import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartService } from './cart.service.js';

describe('CartService', () => {
  let service: CartService;
  let prismaMock: any;
  let redisRepoMock: any;
  let dbRepoMock: any;

  beforeEach(() => {
    prismaMock = {
      productVariant: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    };
    redisRepoMock = {
      getGuestCart: vi.fn(),
      setGuestCart: vi.fn(),
      clearGuestCart: vi.fn(),
    };
    dbRepoMock = {
      getUserCartItems: vi.fn(),
      setUserCartItems: vi.fn(),
      clearUserCart: vi.fn(),
    };

    service = new CartService(prismaMock as any, redisRepoMock as any, dbRepoMock as any);
  });

  it('should return normalized cart response with live price calculations', async () => {
    redisRepoMock.getGuestCart.mockResolvedValue([{ variantId: 'v-1', quantity: 2 }]);
    prismaMock.productVariant.findMany.mockResolvedValue([
      {
        id: 'v-1',
        size: '100ml',
        color: null,
        price: '150.00',
        product: { name: 'Royal Oud', slug: 'royal-oud' },
      },
    ]);

    const cart = await service.getCart({ sessionId: 'session-123' });

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toEqual({
      variantId: 'v-1',
      productName: 'Royal Oud',
      productSlug: 'royal-oud',
      size: '100ml',
      color: null,
      unitPrice: 150,
      quantity: 2,
      lineTotal: 300,
    });
    expect(cart.subtotal).toBe(300);
    expect(cart.taxAmount).toBe(0);
    expect(cart.discountAmount).toBe(0);
    expect(cart.total).toBe(300);
  });

  it('should reject adding item if requested quantity exceeds available stock', async () => {
    prismaMock.productVariant.findFirst.mockResolvedValue({
      id: 'v-1',
      stock: 3,
    });
    redisRepoMock.getGuestCart.mockResolvedValue([{ variantId: 'v-1', quantity: 2 }]);

    await expect(service.addItem({ sessionId: 's-1' }, 'v-1', 2)).rejects.toThrow(
      'Requested quantity (4) exceeds available stock (3)',
    );
  });

  it('should merge guest Redis items into user Postgres cart and cap at stock', async () => {
    redisRepoMock.getGuestCart.mockResolvedValue([{ variantId: 'v-1', quantity: 5 }]);
    dbRepoMock.getUserCartItems.mockResolvedValue([{ variantId: 'v-1', quantity: 2 }]);
    prismaMock.productVariant.findFirst.mockResolvedValue({
      id: 'v-1',
      stock: 6, // 2 + 5 = 7, capped at 6
    });

    await service.mergeGuestCartIntoUserCart('user-123', 'session-999');

    expect(dbRepoMock.setUserCartItems).toHaveBeenCalledWith('user-123', [
      { variantId: 'v-1', quantity: 6 },
    ]);
    expect(redisRepoMock.clearGuestCart).toHaveBeenCalledWith('session-999');
  });

  it('should skip deleted variants silently during login merge', async () => {
    redisRepoMock.getGuestCart.mockResolvedValue([{ variantId: 'v-deleted', quantity: 2 }]);
    dbRepoMock.getUserCartItems.mockResolvedValue([]);
    prismaMock.productVariant.findFirst.mockResolvedValue(null); // Deleted/missing variant

    await service.mergeGuestCartIntoUserCart('user-123', 'session-999');

    expect(dbRepoMock.setUserCartItems).toHaveBeenCalledWith('user-123', []);
    expect(redisRepoMock.clearGuestCart).toHaveBeenCalledWith('session-999');
  });
});
