import { Kafka, Consumer, EachMessagePayload, logLevel } from 'kafkajs';
import { render } from '@react-email/render';
import * as React from 'react';
import type { EmailProvider } from '../email/email-provider.interface.js';
import { OrderConfirmationEmail } from '../emails/OrderConfirmationEmail.js';
import { ShippingUpdateEmail } from '../emails/ShippingUpdateEmail.js';
import { PasswordResetEmail } from '../emails/PasswordResetEmail.js';
import { AbandonedCartEmail } from '../emails/AbandonedCartEmail.js';
import type { PrismaClient } from '@prisma/client';

const TOPIC = 'notifications';
const DLQ_TOPIC = 'notifications.dlq';
const GROUP_ID = 'notification-worker';
const MAX_RETRIES = 3;

export interface NotificationMessage {
  idempotencyKey: string;
  type: 'ORDER_CONFIRMATION' | 'SHIPPING_UPDATE' | 'PASSWORD_RESET' | 'ABANDONED_CART';
  recipient: string;
  payload: Record<string, unknown>;
}

export async function startKafkaConsumer(
  email: EmailProvider,
  prisma: PrismaClient,
): Promise<{ consumer: Consumer; producer: ReturnType<Kafka['producer']> }> {
  const broker = process.env.KAFKA_BROKER ?? 'localhost:9092';
  const kafka = new Kafka({
    clientId: 'notification-worker',
    brokers: [broker],
    logLevel: logLevel.WARN,
  });

  const consumer = kafka.consumer({ groupId: GROUP_ID });
  const producer = kafka.producer();

  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

  console.log(`[notification-worker] Connected to Kafka broker: ${broker}`);
  console.log(`[notification-worker] Subscribed to topic: ${TOPIC}`);

  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      const raw = payload.message.value?.toString();
      if (!raw) return;

      let msg: NotificationMessage;
      try {
        msg = JSON.parse(raw) as NotificationMessage;
      } catch {
        console.error('[notification-worker] Failed to parse message:', raw);
        return;
      }

      await processMessage(msg, email, prisma, producer);
    },
  });

  return { consumer, producer };
}

async function processMessage(
  msg: NotificationMessage,
  email: EmailProvider,
  prisma: PrismaClient,
  producer: ReturnType<Kafka['producer']>,
): Promise<void> {
  const { idempotencyKey, type, recipient, payload } = msg;

  // ── Idempotency check ──────────────────────────────────────────────────────
  const existing = await (prisma as any).notification.findUnique({
    where: { idempotencyKey },
  });

  if (existing?.status === 'SENT') {
    console.log(`[notification-worker] Skipping already-sent notification: ${idempotencyKey}`);
    return;
  }

  // Upsert a PENDING record (create on first encounter, no-op on duplicates)
  const record = await (prisma as any).notification.upsert({
    where: { idempotencyKey },
    create: {
      idempotencyKey,
      type,
      status: 'PENDING',
      recipient,
      payload,
      attempts: 0,
    },
    update: {}, // Don't overwrite FAILED records — let the retry loop handle it
  });

  if (record.status === 'DEAD_LETTERED') {
    console.warn(`[notification-worker] Notification ${idempotencyKey} is already dead-lettered — skipping`);
    return;
  }

  // ── Retry loop ─────────────────────────────────────────────────────────────
  let lastError: string | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const html = await renderTemplate(type, payload);
      const subject = getSubject(type);

      await email.sendHtml({ to: recipient, subject, html });

      // Mark SENT
      await (prisma as any).notification.update({
        where: { idempotencyKey },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          attempts: record.attempts + attempt,
          lastError: null,
        },
      });

      console.log(`[notification-worker] Sent ${type} to ${recipient} (attempt ${attempt})`);
      return;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(
        `[notification-worker] Attempt ${attempt}/${MAX_RETRIES} failed for ${idempotencyKey}: ${lastError}`,
      );

      if (attempt < MAX_RETRIES) {
        // Exponential back-off: 1s, 2s, 4s
        await sleep(1000 * Math.pow(2, attempt - 1));
      }
    }
  }

  // ── DLQ ───────────────────────────────────────────────────────────────────
  console.error(
    `[notification-worker] All ${MAX_RETRIES} attempts failed for ${idempotencyKey} — routing to DLQ`,
  );

  await (prisma as any).notification.update({
    where: { idempotencyKey },
    data: {
      status: 'DEAD_LETTERED',
      attempts: record.attempts + MAX_RETRIES,
      lastError,
    },
  });

  // Publish to DLQ topic so ops can inspect / replay
  await producer.send({
    topic: DLQ_TOPIC,
    messages: [{ key: idempotencyKey, value: JSON.stringify({ ...msg, lastError }) }],
  }).catch((dlqErr: unknown) => {
    console.error('[notification-worker] Failed to publish to DLQ:', dlqErr);
  });
}

// ── Template renderer ─────────────────────────────────────────────────────

async function renderTemplate(
  type: NotificationMessage['type'],
  payload: Record<string, unknown>,
): Promise<string> {
  switch (type) {
    case 'ORDER_CONFIRMATION':
      return render(
        React.createElement(OrderConfirmationEmail, {
          customerName: String(payload.customerName ?? ''),
          orderId: String(payload.orderId ?? ''),
          orderNumber: payload.orderNumber ? String(payload.orderNumber) : null,
          total: payload.total as string | number,
          items: (payload.items as any[]) ?? [],
        }),
      );

    case 'SHIPPING_UPDATE':
      return render(
        React.createElement(ShippingUpdateEmail, {
          customerName: String(payload.customerName ?? ''),
          orderId: String(payload.orderId ?? ''),
          orderNumber: payload.orderNumber ? String(payload.orderNumber) : null,
          note: payload.note ? String(payload.note) : undefined,
        }),
      );

    case 'PASSWORD_RESET':
      return render(
        React.createElement(PasswordResetEmail, {
          rawToken: String(payload.rawToken ?? ''),
          expiresInMin: Number(payload.expiresInMin ?? 30),
        }),
      );

    case 'ABANDONED_CART':
      return render(
        React.createElement(AbandonedCartEmail, {
          customerName: payload.customerName ? String(payload.customerName) : undefined,
          cartId: String(payload.cartId ?? ''),
          items: (payload.items as any[]) ?? [],
        }),
      );

    default:
      throw new Error(`Unknown notification type: ${type as string}`);
  }
}

function getSubject(type: NotificationMessage['type']): string {
  switch (type) {
    case 'ORDER_CONFIRMATION': return 'Your Oudnomad order is confirmed! 🎉';
    case 'SHIPPING_UPDATE':    return 'Your Oudnomad order has shipped! 📦';
    case 'PASSWORD_RESET':     return 'Reset your Oudnomad password';
    case 'ABANDONED_CART':     return 'You left something in your cart 🛒';
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
