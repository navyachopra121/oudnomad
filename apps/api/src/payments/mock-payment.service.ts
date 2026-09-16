import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PaymentService, CreateAttemptResult, RefundResult, VerifySignatureParams } from './payment.interface.js';
import type { Order, PaymentAttempt } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';

/**
 * Mock payment provider for local dev and CI.
 * PAYMENT_PROVIDER=mock — no real Razorpay credentials needed.
 * Implements the same PaymentService interface as RazorpayPaymentService.
 */
@Injectable()
export class MockPaymentService implements PaymentService {
  private readonly logger = new Logger(MockPaymentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createAttempt(order: Order, idempotencyKey: string): Promise<CreateAttemptResult> {
    // Idempotency: return existing attempt if key already used
    const existing = await this.prisma.paymentAttempt.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      this.logger.warn(`[Mock] Idempotency key ${idempotencyKey} already used`);
      return {
        gatewayOrderId: existing.gatewayOrderId,
        amount: Math.round(Number(existing.amount) * 100),
        currency: 'INR',
        razorpayKeyId: 'mock_key_id',
      };
    }

    const mockGatewayOrderId = `mock_order_${randomUUID().slice(0, 8)}`;

    await this.prisma.paymentAttempt.create({
      data: {
        orderId: order.id,
        gatewayOrderId: mockGatewayOrderId,
        idempotencyKey,
        status: 'CREATED',
        amount: order.total,
      },
    });

    this.logger.log(`[Mock] Created payment attempt for order ${order.id} → ${mockGatewayOrderId}`);

    return {
      gatewayOrderId: mockGatewayOrderId,
      amount: Math.round(Number(order.total) * 100),
      currency: 'INR',
      razorpayKeyId: 'mock_key_id',
    };
  }

  verifyClientSignature(_params: VerifySignatureParams): boolean {
    this.logger.log('[Mock] verifyClientSignature → always true');
    return true;
  }

  async createRefund(paymentAttempt: PaymentAttempt, amount: Decimal): Promise<RefundResult> {
    const mockRefundId = `mock_refund_${randomUUID().slice(0, 8)}`;
    this.logger.log(
      `[Mock] Created refund ${mockRefundId} for attempt ${paymentAttempt.id} amount ${amount}`,
    );
    return { gatewayRefundId: mockRefundId };
  }
}
