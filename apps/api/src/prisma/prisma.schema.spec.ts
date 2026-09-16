import { describe, it, expect } from 'vitest';
import {
  UserRole,
  AddressType,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  TaxType,
} from '@prisma/client';

describe('Phase 1 Database Schema & Enums Verification', () => {
  it('should export all 6 Phase 1 Enums correctly', () => {
    expect(UserRole.CUSTOMER).toBe('CUSTOMER');
    expect(UserRole.ADMIN).toBe('ADMIN');

    expect(AddressType.SHIPPING).toBe('SHIPPING');
    expect(AddressType.BILLING).toBe('BILLING');
    expect(AddressType.BOTH).toBe('BOTH');

    expect(ProductStatus.DRAFT).toBe('DRAFT');
    expect(ProductStatus.ACTIVE).toBe('ACTIVE');
    expect(ProductStatus.ARCHIVED).toBe('ARCHIVED');

    expect(OrderStatus.PENDING_PAYMENT).toBe('PENDING_PAYMENT');
    expect(OrderStatus.CONFIRMED).toBe('CONFIRMED');
    expect(OrderStatus.PLACED).toBe('PLACED');
    expect(OrderStatus.SHIPPED).toBe('SHIPPED');
    expect(OrderStatus.DELIVERED).toBe('DELIVERED');
    expect(OrderStatus.CANCELLED).toBe('CANCELLED');
    expect(OrderStatus.PAYMENT_FAILED).toBe('PAYMENT_FAILED');
    expect(OrderStatus.EXPIRED).toBe('EXPIRED');

    expect(PaymentStatus.PENDING).toBe('PENDING');
    expect(PaymentStatus.SUCCEEDED).toBe('SUCCEEDED');
    expect(PaymentStatus.FAILED).toBe('FAILED');
    expect(PaymentStatus.REFUNDED).toBe('REFUNDED');

    expect(TaxType.VAT).toBe('VAT');
    expect(TaxType.GST).toBe('GST');
    expect(TaxType.SALES_TAX).toBe('SALES_TAX');
  });
});
