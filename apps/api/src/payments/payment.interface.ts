import type { Decimal } from '@prisma/client/runtime/library';
import type { Order, PaymentAttempt } from '@prisma/client';

export interface CreateAttemptResult {
  gatewayOrderId: string;
  amount: number;       // in smallest currency unit (cents, paise, fils)
  currency: string;
  razorpayKeyId?: string;
  stripeClientSecret?: string;
  stripePublishableKey?: string;
}

export interface RefundResult {
  gatewayRefundId: string;
}

export interface VerifySignatureParams {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  stripePaymentIntentId?: string;
}

/**
 * Abstraction over a payment gateway (Stripe, Razorpay, Mock).
 * Webhook-driven model:
 *  - createAttempt()          → starts a payment session (returns data for frontend)
 *  - verifyClientSignature()  → UX feedback verification
 *  - createRefund()           → initiates a refund against a captured payment
 */
export interface PaymentService {
  createAttempt(order: Order, idempotencyKey: string): Promise<CreateAttemptResult>;
  verifyClientSignature(params: VerifySignatureParams): boolean;
  createRefund(paymentAttempt: PaymentAttempt, amount: Decimal): Promise<RefundResult>;
}

export const PAYMENT_SERVICE = 'PAYMENT_SERVICE';
