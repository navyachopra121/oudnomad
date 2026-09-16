import cron from 'node-cron';
import { Kafka, Producer, logLevel } from 'kafkajs';
import type { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const ABANDONED_AFTER_HOURS = Number(process.env.ABANDONED_CART_HOURS ?? 2);
const NOTIFICATION_TOPIC = 'notifications';

/**
 * Scans for carts that have been inactive for ABANDONED_AFTER_HOURS hours,
 * have at least one item, belong to a logged-in user with a known email,
 * and haven't already received an abandoned-cart email.
 *
 * Publishes an ABANDONED_CART Kafka event for each qualifying cart.
 * Runs every 30 minutes.
 */
export function startAbandonedCartCron(prisma: PrismaClient): void {
  const broker = process.env.KAFKA_BROKER ?? 'localhost:9092';
  const kafka = new Kafka({
    clientId: 'notification-worker-cron',
    brokers: [broker],
    logLevel: logLevel.WARN,
  });

  let producer: Producer | null = null;

  const getProducer = async (): Promise<Producer> => {
    if (!producer) {
      producer = kafka.producer();
      await producer.connect();
    }
    return producer;
  };

  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[abandoned-cart-cron] Running scan...');

    try {
      const cutoff = new Date(Date.now() - ABANDONED_AFTER_HOURS * 60 * 60 * 1000);

      const abandonedCarts = await (prisma as any).cart.findMany({
        where: {
          updatedAt: { lt: cutoff },
          abandonedEmailSentAt: null,
          userId: { not: null },
          items: { some: {} }, // at least 1 item
        },
        include: {
          user: { select: { email: true, firstName: true } },
          items: {
            include: {
              variant: { select: { price: true, product: { select: { name: true } } } },
            },
          },
        },
        take: 100, // safety cap per run
      });

      if (abandonedCarts.length === 0) {
        console.log('[abandoned-cart-cron] No abandoned carts found.');
        return;
      }

      console.log(`[abandoned-cart-cron] Found ${abandonedCarts.length} abandoned carts`);

      const p = await getProducer();

      for (const cart of abandonedCarts) {
        const idempotencyKey = `abandoned-cart-${cart.id}-${cart.updatedAt.toISOString()}`;

        await p.send({
          topic: NOTIFICATION_TOPIC,
          messages: [
            {
              key: idempotencyKey,
              value: JSON.stringify({
                idempotencyKey,
                type: 'ABANDONED_CART',
                recipient: cart.user.email,
                payload: {
                  cartId: cart.id,
                  customerName: cart.user.firstName ?? '',
                  items: cart.items.map((i: any) => ({
                    productName: i.variant?.product?.name ?? 'Item',
                    quantity: i.quantity,
                    unitPrice: i.variant?.price ?? 0,
                  })),
                },
              }),
            },
          ],
        });

        // Mark the cart so we don't re-send
        await (prisma as any).cart.update({
          where: { id: cart.id },
          data: { abandonedEmailSentAt: new Date() },
        });

        console.log(`[abandoned-cart-cron] Queued ABANDONED_CART for cart ${cart.id}`);
      }
    } catch (err: unknown) {
      console.error('[abandoned-cart-cron] Scan failed:', err);
    }
  });

  console.log(
    `[abandoned-cart-cron] Scheduled — scans every 30 minutes, fires after ${ABANDONED_AFTER_HOURS}h inactivity`,
  );
}
