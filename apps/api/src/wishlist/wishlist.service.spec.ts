import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WishlistService } from './wishlist.service.js';
import { NotFoundException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      product: {
        findUnique: vi.fn(),
      },
      wishlistItem: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        deleteMany: vi.fn(),
        count: vi.fn(),
      },
    };

    service = new WishlistService(prismaMock as any);
  });

  it('should add item to wishlist idempotently', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 'p-1', deletedAt: null });
    prismaMock.wishlistItem.findUnique.mockResolvedValue(null);
    prismaMock.wishlistItem.create.mockResolvedValue({
      id: 'w-1',
      userId: 'u-1',
      productId: 'p-1',
    });

    const item = await service.addItem('u-1', 'p-1');
    expect(item.id).toBe('w-1');

    // Second add call should be a no-op success returning existing item
    prismaMock.wishlistItem.findUnique.mockResolvedValue({
      id: 'w-1',
      userId: 'u-1',
      productId: 'p-1',
    });
    const secondItem = await service.addItem('u-1', 'p-1');
    expect(secondItem.id).toBe('w-1');
    expect(prismaMock.wishlistItem.create).toHaveBeenCalledTimes(1);
  });

  it('should remove item from wishlist idempotently', async () => {
    prismaMock.wishlistItem.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.removeItem('u-1', 'p-1');
    expect(result.success).toBe(true);

    // Second remove should also succeed without error
    prismaMock.wishlistItem.deleteMany.mockResolvedValue({ count: 0 });
    const result2 = await service.removeItem('u-1', 'p-1');
    expect(result2.success).toBe(true);
  });

  it('should throw NotFoundException when adding invalid product', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);

    await expect(service.addItem('u-1', 'invalid-p')).rejects.toThrow(NotFoundException);
  });
});
