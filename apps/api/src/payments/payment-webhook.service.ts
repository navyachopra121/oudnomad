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

    await this.prisma.$transaction(async (tx) => {
      await tx.paymentAttempt.update({
        where: { id: attempt.id },
        data: { status: PaymentAttemptStatus.SUCCEEDED, gatewayPaymentId: payment.id },
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
          note: `Payment confirmed via Razorpay webhook — paymentId: ${payment.id}`,
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
    if (orderWithUser) {
      this.kafka.publish({
        idempotencyKey: `order-confirmation-${attempt.orderId}-${payment.id}`,
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

    this.logger.log(`Order ${attempt.orderId} confirmed via payment.captured webhook`);
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
