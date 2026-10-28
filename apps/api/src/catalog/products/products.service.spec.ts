import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      category: {
        findFirst: vi.fn(),
      },
      product: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
      },
      productVariant: {
        create: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      },
      inventory: {
        upsert: vi.fn().mockResolvedValue({}),
      },
    };
    const cacheMock = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      delByPattern: vi.fn(),
    };
    service = new ProductsService(prismaMock as any, cacheMock as any);
  });

  it('should auto-create a default variant when zero explicit variants are passed', async () => {
    prismaMock.category.findFirst.mockResolvedValue({ id: 'cat-1' });
    prismaMock.product.findUnique.mockResolvedValue(null);
    prismaMock.product.create.mockResolvedValue({
      id: 'prod-1',
      name: 'Royal Oud',
      slug: 'royal-oud',
    });
    prismaMock.product.findFirst.mockResolvedValue({
      id: 'prod-1',
      name: 'Royal Oud',
      variants: [{ id: 'v-1', sku: 'royal-oud-def', price: 150, stock: 10 }],
    });
    prismaMock.productVariant.create.mockResolvedValue({
      id: 'v-1',
      productId: 'prod-1',
      sku: 'royal-oud-def',
    });

    await service.create({
      name: 'Royal Oud',
      description: 'Extrait de parfum',
      categoryId: 'cat-1',
      price: 150,
      stock: 10,
    });

    expect(prismaMock.productVariant.create).toHaveBeenCalledWith({
      data: {
        productId: 'prod-1',
        sku: 'royal-oud-100ml',
        size: '100ml',
        price: 150,
        stock: 10,
        attributes: {
          features: undefined,
          ingredients: undefined,
          moodAndCharacter: undefined,
          olfactoryStory: undefined,
          signature: undefined,
          tagline: undefined,
        },
      },
    });
  });

  it('should block deleting the only remaining variant of a product', async () => {
    prismaMock.productVariant.findMany.mockResolvedValue([
      { id: 'v-1', productId: 'p-1', deletedAt: null },
    ]);

    await expect(service.deleteVariant('p-1', 'v-1')).rejects.toThrow(
      'Cannot remove variant: A product must have at least one active variant.',
    );
  });
});
