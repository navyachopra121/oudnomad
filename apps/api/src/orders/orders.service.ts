import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Logger,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CartService } from '../cart/cart.service.js';
import { assertValidTransition } from './state-machine/order-state-machine.js';
import { scheduleOrderExpiry, cancelScheduledExpiry } from './queues/order-expiry.queue.js';
import { PAYMENT_SERVICE } from '../payments/payment.interface.js';
import type { PaymentService } from '../payments/payment.interface.js';
import type { CheckoutDto } from './dto/checkout.dto.js';
import type { VerifyPaymentDto } from '../payments/dto/verify-payment.dto.js';
import { OrderStatus, ShippingMethodEnum } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { AuditLogService } from '../audit-log/audit-log.service.js';
import { KafkaProducerService } from '../kafka/kafka-producer.service.js';
import { RefundsService } from '../refunds/refunds.service.js';
import { ShippingService } from '../shipping/shipping.service.js';
import { InvoiceService } from '../invoice/invoice.service.js';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly config: ConfigService,
    private readonly auditLogService: AuditLogService,
    private readonly kafka: KafkaProducerService,
    private readonly refundsService: RefundsService,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: PaymentService,
    private readonly shippingService: ShippingService,
    private readonly invoiceService: InvoiceService,
  ) {}

  /**
   * Get static shipping options & rates.
   */
  getShippingMethods() {
    return [
      {
        method: ShippingMethodEnum.STANDARD,
        cost: 5.0,
        label: 'Standard Delivery (5-7 business days)',
      },
      {
        method: ShippingMethodEnum.EXPRESS,
        cost: 15.0,
        label: 'Express Delivery (1-2 business days)',
      },
    ];
  }

  /**
   * Transition order status using central state machine rules & record OrderStatusEvent audit row.
   */
  async transitionStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    txPrisma?: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    actorId?: string,
  ) {
    const client = txPrisma ?? this.prisma;
    const order = await client.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);

    assertValidTransition(order.status, newStatus);

    const updated = await client.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        reservationExpiresAt:
          newStatus === OrderStatus.PENDING_PAYMENT ? order.reservationExpiresAt : null,
      },
    });

    await client.orderStatusEvent.create({
      data: {
        orderId,
        status: newStatus,
        note: note ?? `Status updated to ${newStatus}`,
      },
    });

    if (actorId) {
      await this.auditLogService.log({
        actorId,
        action: 'order.status_change',
        targetType: 'Order',
        targetId: orderId,
        metadata: { from: order.status, to: newStatus, note },
      });
    }

    // Notify customer when order ships
    if (newStatus === OrderStatus.SHIPPED) {
      const shippedOrder = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { user: { select: { email: true, firstName: true } } },
      });
      if (shippedOrder) {
        this.kafka.publish({
          idempotencyKey: `shipping-update-${orderId}-${randomUUID()}`,
          type: 'SHIPPING_UPDATE',
          recipient: shippedOrder.user.email,
          payload: {
            orderId,
            orderNumber: shippedOrder.orderNumber,
            customerName: shippedOrder.user.firstName ?? '',
            note: note ?? 'Your order has been shipped!',
          },
        }).catch((err: unknown) =>
          this.logger.error('Failed to publish SHIPPING_UPDATE to Kafka', err),
        );
      }
    }

    this.logger.log(`Order ${orderId} transitioned: ${order.status} -> ${newStatus}`);
    return updated;
  }

  /**
   * Release held stock back to ProductVariant for expired or failed orders.
   */
  async releaseHeldStock(
    orderId: string,
    txPrisma?: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
  ): Promise<void> {
    const client = txPrisma ?? this.prisma;
    const items = await client.orderItem.findMany({ where: { orderId } });

    for (const item of items) {
      await client.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }

  /**
   * Checkout: Validates address & stock, decrements stock atomically, snapshots items, creates Order.
   */
  async checkout(userId: string, dto: CheckoutDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.shippingAddressId, userId, deletedAt: null },
    });
    if (!address) {
      throw new BadRequestException('Invalid shipping address ID provided');
    }

    const cart = await this.cartService.getCart({ userId });
    if (cart.items.length === 0) {
      throw new BadRequestException('Cannot checkout with an empty cart');
    }

    const shippingMethod = dto.shippingMethod ?? ShippingMethodEnum.STANDARD;
    const shippingCost = shippingMethod === ShippingMethodEnum.EXPRESS ? 15.0 : 5.0;
    const subtotal = cart.subtotal;
    const total = Number((subtotal + shippingCost).toFixed(2));

    const timeoutMinutes = Number(
      this.config.get<string>('ORDER_RESERVATION_TIMEOUT_MIN') ?? 10,
    );
    const reservationExpiresAt = new Date(Date.now() + timeoutMinutes * 60 * 1000);

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          shippingAddressId: address.id,
          status: OrderStatus.PENDING_PAYMENT,
          shippingMethod,
          shippingCost,
          subtotal,
          taxAmount: 0,
          discountAmount: 0,
          total,
          reservationExpiresAt,
          // Immutable address snapshot for invoice and legal purposes
          snapRecipientName: address.recipientName,
          snapLine1: address.line1,
          snapLine2: address.line2,
          snapCity: address.city,
          snapState: address.state,
          snapPostalCode: address.postalCode,
          snapCountryCode: address.countryCode,
          snapPhone: address.phone,
        },
      });

      for (const item of cart.items) {
        const updated = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stock: { gte: item.quantity },
            deletedAt: null,
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (updated.count === 0) {
          throw new ConflictException(
            `Insufficient stock for item "${item.productName}" (Variant ID: ${item.variantId})`,
          );
        }

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            variantId: item.variantId,
            productName: item.productName,
            size: item.size,
            color: item.color,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          },
        });

        const inventory = await tx.inventory.findUnique({
          where: { variantId: item.variantId },
        });
        if (inventory) {
          await tx.inventoryAdjustment.create({
            data: {
              inventoryId: inventory.id,
              adjustedBy: userId,
              delta: -item.quantity,
              reason: `Order ${newOrder.id} reserved stock`,
            },
          });
        }
      }

      await tx.orderStatusEvent.create({
        data: {
          orderId: newOrder.id,
          status: OrderStatus.PENDING_PAYMENT,
          note: 'Order created with 10-minute inventory reservation',
        },
      });

      await this.cartService.clearCart({ userId });

      return newOrder;
    });

    await scheduleOrderExpiry(order.id, timeoutMinutes);

    return this.findOrderById(userId, order.id);
  }

  /**
   * Create a Razorpay payment attempt for an order.
   * First try or retry — a new PaymentAttempt row is created each time (old ones kept as history).
   * Idempotency: same idempotencyKey returns the existing attempt without creating a new Razorpay order.
   */
  async createPaymentAttempt(userId: string, orderId: string, idempotencyKey: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    if (order.userId !== userId) throw new ForbiddenException('Access denied to this order');

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `Cannot create payment attempt for order in status: ${order.status}`,
      );
    }

    // Reject if reservation has expired
    if (order.reservationExpiresAt && order.reservationExpiresAt < new Date()) {
      throw new BadRequestException(
        'Payment reservation has expired — please start a new checkout to reserve stock again',
      );
    }

    return this.paymentService.createAttempt(order, idempotencyKey);
  }

  /**
   * Verify the client-side Razorpay signature.
   * Returns UX feedback only — does NOT transition Order.status.
   * Authoritative confirmation arrives via webhook (payment.captured).
   */
  async verifyPayment(userId: string, attemptId: string, dto: VerifyPaymentDto) {
    const attempt = await this.prisma.paymentAttempt.findUnique({
      where: { id: attemptId },
      include: { order: true },
    });

    if (!attempt) throw new NotFoundException(`Payment attempt ${attemptId} not found`);
    if (attempt.order.userId !== userId) throw new ForbiddenException('Access denied');

    const isValid = this.paymentService.verifyClientSignature({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    if (!isValid) {
      throw new BadRequestException('Signature verification failed — possible tampering detected');
    }

    // UI feedback only — order stays PENDING_PAYMENT until webhook confirms
    return {
      verified: true,
      message: 'Signature valid — payment processing. Order will be confirmed shortly.',
      orderId: attempt.orderId,
    };
  }

  /**
   * Called by the webhook service after payment.captured event.
   * Cancels expiry job, transitions order → CONFIRMED (and optionally PLACED).
   */
  async handlePaymentSuccess(
    orderId: string,
    txPrisma?: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
  ): Promise<void> {
    await cancelScheduledExpiry(orderId);

    await this.transitionStatus(orderId, OrderStatus.CONFIRMED, 'Payment confirmed via Razorpay webhook', txPrisma);

    const autoAdvance = this.config.get<string>('AUTO_ADVANCE_TO_PLACED') === 'true';
    if (autoAdvance) {
      await this.transitionStatus(
        orderId,
        OrderStatus.PLACED,
        'Auto-advanced on payment confirmation',
        txPrisma,
      );
    }

    // Fire-and-forget: generate invoice PDF and dispatch via DHL
    // Both are idempotent and logged — failures don't roll back the order
    void this.invoiceService.generateInvoice(orderId).catch((err: unknown) =>
      this.logger.error(`Invoice generation failed for order ${orderId}`, err),
    );

    void this.shippingService.dispatchOrder(orderId).catch((err: unknown) =>
      this.logger.error(`DHL dispatch failed for order ${orderId}`, err),
    );
  }

  /**
   * List orders for authenticated user (paginated).
   */
  async findUserOrders(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          reservationExpiresAt: true,
          _count: { select: { items: true } },
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      items: items.map((o) => ({
        id: o.id,
        status: o.status,
        total: Number(o.total),
        itemCount: o._count.items,
        reservationExpiresAt: o.reservationExpiresAt,
        createdAt: o.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get full order detail including items, status history, payment attempts & refunds.
   */
  async findOrderById(userId: string, orderId: string, isAdmin = false) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isBlocked: true,
          },
        },
        items: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
        shippingAddress: true,
        paymentAttempts: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            gatewayOrderId: true,
            status: true,
            amount: true,
            failureReason: true,
            createdAt: true,
          },
        },
        refunds: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            amount: true,
            reason: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);
    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Access denied to this order');
    }

    return order;
  }

  /**
   * Admin: List all orders with filters.
   */
  async findAdminOrders(query: {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: items.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: Number(o.total),
        user: o.user,
        itemCount: o._count.items,
        createdAt: o.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Admin: Manual status update.
   */
  async adminUpdateStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    adminId?: string,
  ) {
    if (newStatus === OrderStatus.REFUNDED) {
      throw new BadRequestException(
        'REFUNDED status cannot be set manually. Use POST /admin/refunds endpoint to initiate a refund.',
      );
    }
    return this.transitionStatus(orderId, newStatus, note, undefined, adminId);
  }

  /**
   * Admin: Update carrier tracking details (AWB, tracking URL, carrier ID).
   */
  async adminUpdateTracking(
    orderId: string,
    data: { awbCode?: string; carrierShipmentId?: string; trackingUrl?: string },
    adminId: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);

    const trackingUrl =
      data.trackingUrl ||
      (data.awbCode
        ? `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(data.awbCode)}`
        : order.trackingUrl);

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        awbCode: data.awbCode || order.awbCode,
        carrierShipmentId: data.carrierShipmentId || order.carrierShipmentId,
        trackingUrl,
        dispatchedAt: order.dispatchedAt || (data.awbCode ? new Date() : undefined),
      },
    });

    await this.auditLogService.log({
      actorId: adminId,
      action: 'order.update_tracking',
      targetType: 'Order',
      targetId: orderId,
      metadata: { awbCode: data.awbCode, carrierShipmentId: data.carrierShipmentId, trackingUrl },
    });

    return updated;
  }


  /**
   * Cancel an order: checks status eligibility, releases stock, writes inventory adjustments,
   * writes audit event, cancels expiry job, and auto-refunds if already paid.
   */
  async cancelOrder(userId: string, orderId: string, reason: string, isAdmin = false) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        paymentAttempts: {
          where: { status: 'SUCCEEDED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);
    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('Access denied to cancel this order');
    }

    const eligibleStatuses: OrderStatus[] = [
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.CONFIRMED,
      OrderStatus.PLACED,
    ];

    if (!eligibleStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Order in status ${order.status} cannot be cancelled. Cancellation is only allowed prior to shipping.`,
      );
    }

    await cancelScheduledExpiry(orderId);

    await this.prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });

        const inventory = await tx.inventory.findUnique({
          where: { variantId: item.variantId },
        });
        if (inventory) {
          await tx.inventoryAdjustment.create({
            data: {
              inventoryId: inventory.id,
              adjustedBy: userId,
              delta: item.quantity,
              reason: `Order ${order.orderNumber || order.id} cancelled: ${reason}`,
            },
          });
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          reservationExpiresAt: null,
        },
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId,
          status: OrderStatus.CANCELLED,
          note: `Order cancelled by ${isAdmin ? 'admin' : 'customer'}. Reason: ${reason}`,
        },
      });
    });

    let refundResult: any = null;
    const paidAttempt = order.paymentAttempts[0];
    if (paidAttempt && paidAttempt.gatewayPaymentId) {
      try {
        refundResult = await this.refundsService.createRefund(userId, {
          orderId: order.id,
          amount: Number(paidAttempt.amount),
          reason: `Auto-refund on cancellation: ${reason}`,
        });

        await this.transitionStatus(
          orderId,
          OrderStatus.REFUNDED,
          `Full auto-refund processed for cancelled order (Amount: ${paidAttempt.amount})`,
        );
      } catch (err: any) {
        this.logger.error(
          `Failed auto-refund on order cancellation ${orderId}: ${err.message}`,
          err.stack,
        );
      }
    }

    this.logger.log(`Order ${orderId} cancelled by ${isAdmin ? 'admin' : 'customer'}: ${reason}`);

    return {
      success: true,
      orderId,
      status: refundResult ? OrderStatus.REFUNDED : OrderStatus.CANCELLED,
      message: refundResult
        ? 'Order cancelled and refund processed successfully.'
        : 'Order cancelled successfully and stock returned to inventory.',
      refund: refundResult,
    };
  }
}
