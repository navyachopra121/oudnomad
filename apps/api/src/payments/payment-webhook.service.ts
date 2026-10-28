import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PAYMENT_SERVICE } from './payment.interface.js';
import type { PaymentService } from './payment.interface.js';
import { PaymentAttemptStatus } from '@prisma/client';
import { KafkaProducerService } from '../kafka/kafka-producer.service.js';
import { randomUUID } from 'crypto';

export interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment?: { entity: RazorpayPaymentEntity };
    refund?: { entity: RazorpayRefundEntity };
  };
}

interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
  error_description?: string;
}

interface RazorpayRefundEntity {
  id: string;
}

@Injectable()
export class PaymentWebhookService {
  private readonly logger = new Logger(PaymentWebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_SERVICE) private readonly _paymentService: PaymentService,
    private readonly kafka: KafkaProducerService,
  ) {}

  async handleEvent(event: RazorpayWebhookEvent): Promise<void> {
    this.logger.log(`Received webhook event: ${event.event}`);

    switch (event.event) {
      case 'payment.captured':
        await this.handlePaymentCaptured(event.payload.payment!.entity);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(event.payload.payment!.entity);
        break;
      case 'refund.processed':
        await this.handleRefundUpdate(event.payload.refund!.entity.id, 'PROCESSED');
        break;
      case 'refund.failed':
        await this.handleRefundUpdate(event.payload.refund!.entity.id, 'FAILED');
        break;
      default:
        this.logger.log(`Unhandled webhook event type: ${event.event} — ignoring`);
    }
  }

  async handleStripeEvent(event: any): Promise<void> {
    this.logger.log(`Received Stripe webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data?.object;
        if (!intent) break;
        await this.handleStripePaymentIntentSucceeded(intent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data?.object;
        if (!intent) break;
        await this.handleStripePaymentIntentFailed(intent);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data?.object;
        if (charge?.refunds?.data?.length) {
          for (const ref of charge.refunds.data) {
            await this.handleRefundUpdate(ref.id, 'PROCESSED');
          }
        }
        break;
      }
      default:
        this.logger.log(`Unhandled Stripe event type: ${event.type} — ignoring`);
    }
  }

  private async handleStripePaymentIntentSucceeded(intent: any): Promise<void> {
    const gatewayOrderId = intent.id;
    let attempt = await this.prisma.paymentAttempt.findUnique({
      where: { gatewayOrderId },
      include: { order: true },
    });

    if (!attempt && intent.metadata?.orderId) {
      attempt = await this.prisma.paymentAttempt.findFirst({
        where: { orderId: intent.metadata.orderId },
        include: { order: true },
      });
    }

    if (!attempt) {
      this.logger.warn(`Stripe payment_intent.succeeded: no attempt found for ${gatewayOrderId}`);
      return;
    }

    if (attempt.status === PaymentAttemptStatus.SUCCEEDED) {
      this.logger.log(`Stripe payment_intent.succeeded: attempt ${attempt.id} already SUCCEEDED`);
      return;
    }

    if (attempt.order.status !== 'PENDING_PAYMENT') {
      this.logger.warn(
        `Stripe payment_intent.succeeded: order ${attempt.orderId} status is ${attempt.order.status}, not PENDING_PAYMENT`,
      );
      return;
    }

    const gatewayPaymentId = typeof intent.latest_charge === 'string' ? intent.latest_charge : intent.id;
    await this.applyPaymentSuccess(attempt, gatewayPaymentId, 'Stripe');
  }

  private async handleStripePaymentIntentFailed(intent: any): Promise<void> {
    const gatewayOrderId = intent.id;
    const attempt = await this.prisma.paymentAttempt.findUnique({
      where: { gatewayOrderId },
    });

    if (!attempt || attempt.status !== PaymentAttemptStatus.CREATED) {
      return;
    }

    await this.prisma.paymentAttempt.update({
      where: { id: attempt.id },
      data: {
        status: PaymentAttemptStatus.FAILED,
        failureReason: intent.last_payment_error?.message ?? 'Stripe payment failed',
      },
    });

    this.logger.log(`Stripe attempt ${attempt.id} marked FAILED for order ${attempt.orderId}`);
  }

  private async handlePaymentCaptured(payment: RazorpayPaymentEntity): Promise<void> {
    const attempt = await this.prisma.paymentAttempt.findUnique({
      where: { gatewayOrderId: payment.order_id },
      include: { order: true },
    });

    if (!attempt) {
      this.logger.warn(`payment.captured: no attempt found for gatewayOrderId ${payment.order_id}`);
      return;
    }

    // Idempotency guard — already processed
    if (attempt.status === PaymentAttemptStatus.SUCCEEDED) {
      this.logger.log(`payment.captured: attempt ${attempt.id} already SUCCEEDED — no-op`);
      return;
    }

    // Order already resolved (e.g. expired while waiting)
    if (attempt.order.status !== 'PENDING_PAYMENT') {
      this.logger.warn(
        `payment.captured: order ${attempt.orderId} is ${attempt.order.status}, not PENDING_PAYMENT — skipping`,
      );
      return;
    }

    await this.applyPaymentSuccess(attempt, payment.id, 'Razorpay');
  }

  private async applyPaymentSuccess(
    attempt: any,
    gatewayPaymentId: string,
    gatewayName: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.paymentAttempt.update({
        where: { id: attempt.id },
        data: { status: PaymentAttemptStatus.SUCCEEDED, gatewayPaymentId },
      });

      // Import OrdersService dynamically to avoid circular dependency
      const { cancelScheduledExpiry } = await import('../orders/queues/order-expiry.queue.js');
      await cancelScheduledExpiry(attempt.orderId);

      await tx.order.update({
        where: { id: attempt.orderId },
        data: { status: 'CONFIRMED', reservationExpiresAt: null },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId: attempt.orderId,
          status: 'CONFIRMED',
          note: `Payment confirmed via ${gatewayName} webhook — paymentId: ${gatewayPaymentId}`,
        },
      });
    });

    // Publish ORDER_CONFIRMATION event to Kafka
    const orderWithUser = await this.prisma.order.findUnique({
      where: { id: attempt.orderId },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        items: true,
      },
    });
    if (orderWithUser && orderWithUser.user?.email) {
      this.kafka.publish({
        idempotencyKey: `order-confirmation-${attempt.orderId}-${gatewayPaymentId}`,
        type: 'ORDER_CONFIRMATION',
        recipient: orderWithUser.user.email,
        payload: {
          orderId: orderWithUser.id,
          orderNumber: orderWithUser.orderNumber,
          customerName: orderWithUser.user.firstName ?? '',
          total: orderWithUser.total,
          items: orderWithUser.items.map((i) => ({
            productName: i.productName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            lineTotal: i.lineTotal,
          })),
        },
      }).catch((err: unknown) =>
        this.logger.error('Failed to publish ORDER_CONFIRMATION to Kafka', err),
      );
    }

    this.logger.log(`Order ${attempt.orderId} confirmed via ${gatewayName} payment webhook`);
  }

  private async handlePaymentFailed(payment: RazorpayPaymentEntity): Promise<void> {
    const attempt = await this.prisma.paymentAttempt.findUnique({
      where: { gatewayOrderId: payment.order_id },
    });

    if (!attempt || attempt.status !== PaymentAttemptStatus.CREATED) {
      this.logger.log(
        `payment.failed: attempt for ${payment.order_id} not in CREATED state — skipping`,
      );
      return;
    }

    await this.prisma.paymentAttempt.update({
      where: { id: attempt.id },
      data: {
        status: PaymentAttemptStatus.FAILED,
        failureReason: payment.error_description ?? 'Payment failed',
      },
    });

    // Order stays PENDING_PAYMENT so the customer can retry
    this.logger.log(
      `Attempt ${attempt.id} marked FAILED — order ${attempt.orderId} stays PENDING_PAYMENT for retry`,
    );
  }

  private async handleRefundUpdate(
    gatewayRefundId: string,
    newStatus: 'PROCESSED' | 'FAILED',
  ): Promise<void> {
    const count = await this.prisma.refund.updateMany({
      where: { gatewayRefundId, status: 'PENDING' },
      data: { status: newStatus },
    });

    if (count.count === 0) {
      this.logger.warn(`refund.${newStatus.toLowerCase()}: no PENDING refund found for ${gatewayRefundId}`);
    } else {
      this.logger.log(`Refund ${gatewayRefundId} → ${newStatus}`);
    }
  }
}
