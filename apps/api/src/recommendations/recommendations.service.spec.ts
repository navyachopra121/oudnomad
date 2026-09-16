import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecommendationsService } from './recommendations.service.js';

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      product: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
      productRecommendation: {
        findMany: vi.fn(),
        deleteMany: vi.fn(),
        createMany: vi.fn(),
      },
      $queryRaw: vi.fn(),
      $transaction: vi.fn((cb) => cb(prismaMock)),
    };

    service = new RecommendationsService(prismaMock as any);
  });

  it('should return pre-computed recommendations for a product', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: 'p-1', deletedAt: null });
    prismaMock.productRecommendation.findMany.mockResolvedValue([
      {
        id: 'rec-1',
        productId: 'p-1',
        recommendedId: 'p-2',
        score: 5,
        source: 'co_purchase',
        recommended: { id: 'p-2', name: 'Cambodian Oud' },
      },
    ]);

    const recs = await service.getRecommendationsForProduct('p-1');

    expect(recs).toHaveLength(1);
    expect(recs[0].source).toBe('co_purchase');
    expect(recs[0].product.name).toBe('Cambodian Oud');
  });

  it('should fall back to same-category products when co-purchases are insufficient', async () => {
    prismaMock.$queryRaw.mockResolvedValue([]); // no co-purchases
    prismaMock.product.findMany.mockImplementation((args: any) => {
      if (args.where?.status === 'ACTIVE' && !args.where?.categoryId) {
        return Promise.resolve([
          { id: 'p-1', categoryId: 'cat-1', avgRating: 4.8, reviewCount: 10 },
        ]);
      }
      if (args.where?.categoryId === 'cat-1') {
        return Promise.resolve([
          { id: 'p-2', categoryId: 'cat-1', avgRating: 4.5, reviewCount: 5 },
        ]);
      }
      return Promise.resolve([]);
    });

    const result = await service.computeRecommendations();

    expect(result.count).toBeGreaterThan(0);
    expect(prismaMock.productRecommendation.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            productId: 'p-1',
            recommendedId: 'p-2',
            source: 'same_category',
          }),
        ]),
      }),
    );
  });
});
