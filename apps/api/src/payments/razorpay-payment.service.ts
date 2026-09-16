import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PaymentService, CreateAttemptResult, RefundResult, VerifySignatureParams } from './payment.interface.js';
import type { Order, PaymentAttempt } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime/library';
import Razorpay from 'razorpay';
import { createHmac } from 'crypto';

@Injectable()
export class RazorpayPaymentService implements PaymentService {
  private readonly logger = new Logger(RazorpayPaymentService.name);
  private readonly razorpay: Razorpay;
  private readonly keyId: string;
  private readonly keySecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.keyId = this.config.getOrThrow<string>('RAZORPAY_KEY_ID');
    this.keySecret = this.config.getOrThrow<string>('RAZORPAY_KEY_SECRET');
    this.razorpay = new Razorpay({
      key_id: this.keyId,
      key_secret: this.keySecret,
    });
  }

  async createAttempt(order: Order, idempotencyKey: string): Promise<CreateAttemptResult> {
    // Application-level idempotency guard — return existing attempt if key already used
    const existing = await this.prisma.paymentAttempt.findUnique({
      where: { idempotencyKey },
    });
    if (existing) {
      this.logger.warn(
        `Idempotency key ${idempotencyKey} already used — returning existing attempt ${existing.id}`,
      );
      return {
        gatewayOrderId: existing.gatewayOrderId,
        amount: Math.round(Number(existing.amount) * 100),
        currency: 'INR',
        razorpayKeyId: this.keyId,
      };
    }

    const amountInPaise = Math.round(Number(order.total) * 100);

    const razorpayOrder = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.id,
      notes: { internalOrderId: order.id },
    });

    await this.prisma.paymentAttempt.create({
      data: {
        orderId: order.id,
        gatewayOrderId: razorpayOrder.id,
        idempotencyKey,
        status: 'CREATED',
        amount: order.total,
      },
    });

    this.logger.log(
      `Created Razorpay order ${razorpayOrder.id} for internal order ${order.id}`,
    );

    return {
      gatewayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      razorpayKeyId: this.keyId,
    };
  }

  verifyClientSignature(params: VerifySignatureParams): boolean {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;
    const expected = createHmac('sha256', this.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    return expected === razorpaySignature;
  }

  async createRefund(paymentAttempt: PaymentAttempt, amount: Decimal): Promise<RefundResult> {
    if (!paymentAttempt.gatewayPaymentId) {
      throw new ConflictException('Cannot refund — no captured payment ID on this attempt');
    }

    const refund = await this.razorpay.payments.refund(paymentAttempt.gatewayPaymentId, {
      amount: Math.round(Number(amount) * 100),
    });

    this.logger.log(
      `Created Razorpay refund ${refund.id} for payment ${paymentAttempt.gatewayPaymentId}`,
    );

    return { gatewayRefundId: refund.id };
  }
}
