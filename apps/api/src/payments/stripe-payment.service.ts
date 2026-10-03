import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  PaymentService,
  CreateAttemptResult,
  RefundResult,
  VerifySignatureParams,
} from './payment.interface.js';
import type { Order, PaymentAttempt } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime/library';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService implements PaymentService {
  private readonly logger = new Logger(StripePaymentService.name);
  private readonly stripe: Stripe | null = null;
  private readonly publishableKey: string;
  private readonly defaultCurrency: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    this.publishableKey =
      this.config.get<string>('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') ||
      this.config.get<string>('STRIPE_PUBLISHABLE_KEY') ||
      'pk_test_placeholder';
    this.defaultCurrency =
      this.config.get<string>('DEFAULT_CURRENCY') || 'AED';

    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-02-24.acacia' as any,
      });
      this.logger.log(`💳 Stripe payment service initialized (Currency: ${this.defaultCurrency})`);
    } else {
      this.logger.warn(
        'STRIPE_SECRET_KEY not set — Stripe payment service in placeholder mode',
      );
    }
  }

  async createAttempt(
    order: Order,
    idempotencyKey: string,
  ): Promise<CreateAttemptResult> {
    // Idempotency check: return existing attempt if key already used
    const existing = await this.prisma.paymentAttempt.findUnique({
      where: { idempotencyKey },
    });

    const currency = this.defaultCurrency.toLowerCase();
    const amountInCents = Math.round(Number(order.total) * 100);

    if (existing) {
      this.logger.warn(
        `Idempotency key ${idempotencyKey} already used — returning existing attempt ${existing.id}`,
      );
      return {
        gatewayOrderId: existing.gatewayOrderId,
        amount: Math.round(Number(existing.amount) * 100),
        currency: this.defaultCurrency,
        stripePublishableKey: this.publishableKey,
      };
    }

    if (!this.stripe) {
      // Mock / fallback if secret key is not yet set in .env
      const mockIntentId = `pi_mock_${order.id.slice(0, 8)}_${Date.now()}`;
      await this.prisma.paymentAttempt.create({
        data: {
          orderId: order.id,
          gatewayOrderId: mockIntentId,
          idempotencyKey,
          status: 'CREATED',
          amount: order.total,
        },
      });

      return {
        gatewayOrderId: mockIntentId,
        amount: amountInCents,
        currency: this.defaultCurrency,
        stripeClientSecret: `${mockIntentId}_secret_mock`,
        stripePublishableKey: this.publishableKey,
      };
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: {
        orderId: order.id,
        idempotencyKey,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    await this.prisma.paymentAttempt.create({
      data: {
        orderId: order.id,
        gatewayOrderId: paymentIntent.id,
        idempotencyKey,
        status: 'CREATED',
        amount: order.total,
      },
    });

    this.logger.log(
      `Created Stripe PaymentIntent ${paymentIntent.id} for order ${order.id} (${amountInCents} ${currency})`,
    );

    return {
      gatewayOrderId: paymentIntent.id,
      amount: amountInCents,
      currency: this.defaultCurrency,
      stripeClientSecret: paymentIntent.client_secret ?? undefined,
      stripePublishableKey: this.publishableKey,
    };
  }

  verifyClientSignature(_params: VerifySignatureParams): boolean {
    // Stripe client actions are confirmed via webhook or direct API status checks
    return true;
  }

  async createRefund(
    paymentAttempt: PaymentAttempt,
    amount: Decimal,
  ): Promise<RefundResult> {
    if (!this.stripe) {
      this.logger.warn('Mock refund initiated (Stripe not configured with live key)');
      return { gatewayRefundId: `re_mock_${paymentAttempt.id.slice(0, 8)}` };
    }

    if (!paymentAttempt.gatewayOrderId) {
      throw new ConflictException('Cannot refund — no gateway payment intent on this attempt');
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentAttempt.gatewayOrderId,
      amount: Math.round(Number(amount) * 100),
    });

    this.logger.log(
      `Created Stripe refund ${refund.id} for PaymentIntent ${paymentAttempt.gatewayOrderId}`,
    );

    return { gatewayRefundId: refund.id };
  }
}
