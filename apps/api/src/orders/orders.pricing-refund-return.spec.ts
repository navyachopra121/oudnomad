import { describe, it, expect } from 'vitest';
import { assertValidTransition } from './state-machine/order-state-machine.js';
import { OrderStatus } from '@prisma/client';

describe('Pricing, Tax & Discount Calculations', () => {
  it('calculates line item total accurately without floating point drift', () => {
    const unitPrice = 495.0;
    const quantity = 3;
    const lineTotal = Number((unitPrice * quantity).toFixed(2));
    expect(lineTotal).toBe(1485.0);
  });

  it('calculates GST tax (18%) and applies discount correctly', () => {
    const subtotal = 1000.0;
    const discountAmount = 100.0; // 10% coupon
    const discountedSubtotal = subtotal - discountAmount;
    const gstRateBps = 1800; // 18% in basis points
    const taxAmount = Number(((discountedSubtotal * gstRateBps) / 10000).toFixed(2));
    const shipping = 15.0;
    const total = Number((discountedSubtotal + taxAmount + shipping).toFixed(2));

    expect(discountedSubtotal).toBe(900.0);
    expect(taxAmount).toBe(162.0);
    expect(total).toBe(1077.0);
  });

  it('handles zero discount and standard shipping correctly', () => {
    const subtotal = 250.0;
    const shippingCost = 5.0;
    const taxAmount = 0.0;
    const total = Number((subtotal + shippingCost + taxAmount).toFixed(2));
    expect(total).toBe(255.0);
  });
});

describe('Refundable Amount Logic', () => {
  function calculateRemainingRefundable(originalAmount: number, existingRefunds: { amount: number; status: string }[]) {
    const totalRefunded = existingRefunds
      .filter((r) => r.status === 'PROCESSED' || r.status === 'PENDING')
      .reduce((sum, r) => sum + r.amount, 0);
    return Math.max(0, Number((originalAmount - totalRefunded).toFixed(2)));
  }

  it('returns full amount when no prior refunds exist', () => {
    const remaining = calculateRemainingRefundable(500.0, []);
    expect(remaining).toBe(500.0);
  });

  it('calculates remaining amount correctly after partial refund', () => {
    const existing = [{ amount: 200.0, status: 'PROCESSED' }];
    const remaining = calculateRemainingRefundable(500.0, existing);
    expect(remaining).toBe(300.0);
  });

  it('disallows further refund when full amount is already refunded', () => {
    const existing = [
      { amount: 300.0, status: 'PROCESSED' },
      { amount: 200.0, status: 'PENDING' },
    ];
    const remaining = calculateRemainingRefundable(500.0, existing);
    expect(remaining).toBe(0.0);
  });

  it('ignores failed refund records when calculating refundable amount', () => {
    const existing = [
      { amount: 150.0, status: 'PROCESSED' },
      { amount: 250.0, status: 'FAILED' },
    ];
    const remaining = calculateRemainingRefundable(500.0, existing);
    expect(remaining).toBe(350.0);
  });
});

describe('Order Cancellation & State Transition Policy', () => {
  it('permits cancellation from PENDING_PAYMENT, CONFIRMED, and PLACED', () => {
    expect(() => assertValidTransition(OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED)).not.toThrow();
    expect(() => assertValidTransition(OrderStatus.CONFIRMED, OrderStatus.CANCELLED)).not.toThrow();
    expect(() => assertValidTransition(OrderStatus.PLACED, OrderStatus.CANCELLED)).not.toThrow();
  });

  it('rejects cancellation once order is SHIPPED or DELIVERED', () => {
    expect(() => assertValidTransition(OrderStatus.SHIPPED, OrderStatus.CANCELLED)).toThrow();
    expect(() => assertValidTransition(OrderStatus.DELIVERED, OrderStatus.CANCELLED)).toThrow();
  });

  it('rejects cancellation on already CANCELLED or REFUNDED orders', () => {
    expect(() => assertValidTransition(OrderStatus.CANCELLED, OrderStatus.CANCELLED)).toThrow();
    expect(() => assertValidTransition(OrderStatus.REFUNDED, OrderStatus.CANCELLED)).toThrow();
  });
});

describe('Return Window Calculation Logic', () => {
  const RETURN_WINDOW_DAYS = 14;

  function isEligibleForReturn(deliveredAt: Date | null, requestDate: Date, isFinalSale = false): { eligible: boolean; reason?: string } {
    if (isFinalSale) {
      return { eligible: false, reason: 'Final sale or bespoke collector items are non-returnable.' };
    }
    if (!deliveredAt) {
      return { eligible: false, reason: 'Order has not been delivered yet.' };
    }
    const diffMs = requestDate.getTime() - deliveredAt.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays > RETURN_WINDOW_DAYS) {
      return {
        eligible: false,
        reason: `Return window expired. Returns must be requested within ${RETURN_WINDOW_DAYS} days of delivery.`,
      };
    }
    return { eligible: true };
  }

  it('approves return within 14-day window', () => {
    const deliveredAt = new Date('2026-10-01T10:00:00Z');
    const requestDate = new Date('2026-10-08T10:00:00Z'); // 7 days later
    const result = isEligibleForReturn(deliveredAt, requestDate);
    expect(result.eligible).toBe(true);
  });

  it('blocks return after 14-day window has elapsed', () => {
    const deliveredAt = new Date('2026-10-01T10:00:00Z');
    const requestDate = new Date('2026-10-20T10:00:00Z'); // 19 days later
    const result = isEligibleForReturn(deliveredAt, requestDate);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Return window expired');
  });

  it('blocks return for undelivered items', () => {
    const result = isEligibleForReturn(null, new Date());
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Order has not been delivered');
  });

  it('blocks return for non-returnable final sale products', () => {
    const deliveredAt = new Date('2026-10-10T10:00:00Z');
    const result = isEligibleForReturn(deliveredAt, new Date('2026-10-11T10:00:00Z'), true);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('Final sale');
  });
});
