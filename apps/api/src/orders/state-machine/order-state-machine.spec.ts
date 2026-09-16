import { describe, it, expect } from 'vitest';
import { assertValidTransition, ALLOWED_TRANSITIONS } from './order-state-machine.js';
import { OrderStatus } from '@prisma/client';

describe('Order State Machine', () => {
  it('should allow valid status transitions', () => {
    expect(() => assertValidTransition(OrderStatus.PENDING_PAYMENT, OrderStatus.CONFIRMED)).not.toThrow();
    expect(() => assertValidTransition(OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED)).not.toThrow();
    expect(() => assertValidTransition(OrderStatus.CONFIRMED, OrderStatus.PLACED)).not.toThrow();
    expect(() => assertValidTransition(OrderStatus.CONFIRMED, OrderStatus.REFUNDED)).not.toThrow();
    expect(() => assertValidTransition(OrderStatus.PLACED, OrderStatus.SHIPPED)).not.toThrow();
    expect(() => assertValidTransition(OrderStatus.SHIPPED, OrderStatus.DELIVERED)).not.toThrow();
    expect(() => assertValidTransition(OrderStatus.DELIVERED, OrderStatus.REFUNDED)).not.toThrow();
  });

  it('should reject invalid status transitions', () => {
    expect(() => assertValidTransition(OrderStatus.DELIVERED, OrderStatus.PLACED)).toThrow(
      'Cannot transition order status from DELIVERED to PLACED',
    );
    expect(() => assertValidTransition(OrderStatus.CANCELLED, OrderStatus.CONFIRMED)).toThrow(
      'Cannot transition order status from CANCELLED to CONFIRMED',
    );
    expect(() => assertValidTransition(OrderStatus.EXPIRED, OrderStatus.CONFIRMED)).toThrow(
      'Cannot transition order status from EXPIRED to CONFIRMED',
    );
    expect(() => assertValidTransition(OrderStatus.REFUNDED, OrderStatus.SHIPPED)).toThrow(
      'Cannot transition order status from REFUNDED to SHIPPED',
    );
  });

  it('should cover all status values in ALLOWED_TRANSITIONS', () => {
    const allStatuses = Object.values(OrderStatus);
    for (const status of allStatuses) {
      expect(ALLOWED_TRANSITIONS[status]).toBeDefined();
    }
  });
});
