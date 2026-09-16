import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED', 'PAYMENT_FAILED', 'EXPIRED'],
  CONFIRMED: ['PLACED', 'CANCELLED', 'REFUNDED'],
  PLACED: ['SHIPPED', 'CANCELLED', 'REFUNDED'],
  SHIPPED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  PAYMENT_FAILED: [],
  EXPIRED: [],
  REFUNDED: [],
};

/**
 * Validate order status transition according to state machine rules.
 * Throws BadRequestException if transition is disallowed.
 */
export function assertValidTransition(from: OrderStatus, to: OrderStatus): void {
  const allowed = ALLOWED_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    throw new BadRequestException(
      `Cannot transition order status from ${from} to ${to}. Allowed transitions: [${allowed?.join(', ') ?? 'none'}]`,
    );
  }
}
