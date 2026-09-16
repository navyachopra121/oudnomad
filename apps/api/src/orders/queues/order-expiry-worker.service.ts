import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Worker } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service.js';
import { createOrderExpiryWorker, OrderExpiryPayload } from './order-expiry.worker.js';
import { OrderStatus } from '@prisma/client';
import type { Job } from 'bullmq';

@Injectable()
export class OrderExpiryWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderExpiryWorkerService.name);
  private worker: Worker<OrderExpiryPayload> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.worker = createOrderExpiryWorker(this.handleExpiry.bind(this));
    this.logger.log('Order expiry worker started');
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
      this.logger.log('Order expiry worker shut down');
    }
  }

  private async handleExpiry(job: Job<OrderExpiryPayload>): Promise<void> {
    const { orderId } = job.data;
    this.logger.log(`Processing expiry for order ${orderId}`);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      this.logger.warn(`Order ${orderId} not found — skipping expiry`);
      return;
    }

    // Only expire orders still awaiting payment
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      this.logger.log(
        `Order ${orderId} is already in status ${order.status} — skipping expiry`,
      );
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      // Release held stock
      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Transition to EXPIRED
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.EXPIRED, reservationExpiresAt: null },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId,
          status: OrderStatus.EXPIRED,
          note: 'Order reservation expired — stock released automatically',
        },
      });
    });

    this.logger.log(`Order ${orderId} expired — stock released`);
  }
}
