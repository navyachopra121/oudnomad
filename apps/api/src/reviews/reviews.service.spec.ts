import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReviewsService } from './reviews.service.js';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prismaMock: any;
  let searchServiceMock: any;
  let kafkaProducerMock: any;

  beforeEach(() => {
    prismaMock = {
      product: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      review: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
        aggregate: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb(prismaMock)),
    };

    searchServiceMock = {
      syncProductById: vi.fn().mockResolvedValue(undefined),
    };

    kafkaProducerMock = {
      publishProductChanged: vi.fn().mockResolvedValue(undefined),
    };

    service = new ReviewsService(
      prismaMock as any,
      searchServiceMock as any,
      kafkaProducerMock as any,
    );
  });

  it('should reject duplicate review attempt by same user on same product', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 'p-1', deletedAt: null });
    prismaMock.review.findFirst.mockResolvedValue({ id: 'r-1', productId: 'p-1', userId: 'u-1' });

    await expect(
      service.create('u-1', 'p-1', { rating: 5, body: 'Great' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should validate rating range (1-5)', async () => {
    await expect(
      service.create('u-1', 'p-1', { rating: 6 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should calculate avgRating and reviewCount on review creation', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 'p-1', deletedAt: null });
    prismaMock.review.findFirst.mockResolvedValue(null);
    prismaMock.review.create.mockResolvedValue({
      id: 'r-2',
      productId: 'p-1',
      userId: 'u-1',
      rating: 4,
    });
    prismaMock.review.aggregate.mockResolvedValue({
      _avg: { rating: 4.5 },
      _count: 2,
    });

    const result = await service.create('u-1', 'p-1', { rating: 4, title: 'Nice' });

    expect(result.id).toBe('r-2');
    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: 'p-1' },
      data: { avgRating: 4.5, reviewCount: 2 },
    });
    expect(searchServiceMock.syncProductById).toHaveBeenCalledWith('p-1');
  });

  it('should reset rating to 0 when last review is deleted', async () => {
    prismaMock.review.findUnique.mockResolvedValue({
      id: 'r-1',
      productId: 'p-1',
      userId: 'u-1',
      deletedAt: null,
    });
    prismaMock.review.aggregate.mockResolvedValue({
      _avg: { rating: null },
      _count: 0,
    });

    await service.delete('u-1', 'r-1');

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: 'p-1' },
      data: { avgRating: 0, reviewCount: 0 },
    });
  });
});
