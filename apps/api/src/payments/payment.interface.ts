import type { Decimal } from '@prisma/client/runtime/library';
import type { Order, PaymentAttempt } from '@prisma/client';

export interface CreateAttemptResult {
  gatewayOrderId: string;
  amount: number;       // in paise (smallest currency unit)
  currency: string;
  razorpayKeyId: string;
}

export interface RefundResult {
  gatewayRefundId: string;
}

export interface VerifySignatureParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Abstraction over a payment gateway.
 * Phase 5 synchronous charge() is replaced with an async, webhook-driven model:
 *  - createAttempt()          → starts a payment session (returns data for frontend)
 *  - verifyClientSignature()  → HMAC check for UX feedback only (not authoritative)
 *  - createRefund()           → initiates a refund against a captured payment
 * Authoritative confirmation always arrives via webhook, never as a return value here.
 */
export interface PaymentService {
  createAttempt(order: Order, idempotencyKey: string): Promise<CreateAttemptResult>;
  verifyClientSignature(params: VerifySignatureParams): boolean;
  createRefund(paymentAttempt: PaymentAttempt, amount: Decimal): Promise<RefundResult>;
}

export const PAYMENT_SERVICE = 'PAYMENT_SERVICE';
