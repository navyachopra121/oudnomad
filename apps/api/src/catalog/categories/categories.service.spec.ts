import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoriesService } from './categories.service.js';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      category: {
        create: vi.fn(),
        findMany: vi.fn(),
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };
    service = new CategoriesService(prismaMock as any);
  });

  it('should build a nested category tree', async () => {
    prismaMock.category.findMany.mockResolvedValue([
      { id: '1', name: 'Perfumes', slug: 'perfumes', description: null, parentId: null, createdAt: new Date() },
      { id: '2', name: 'Oud Extrait', slug: 'oud-extrait', description: null, parentId: '1', createdAt: new Date() },
    ]);

    const tree = await service.getTree();

    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('1');
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].id).toBe('2');
  });

  it('should block category deletion if it has products', async () => {
    prismaMock.category.findFirst.mockResolvedValue({
      id: '1',
      name: 'Perfumes',
      _count: { children: 0, products: 3 },
    });

    await expect(service.delete('1')).rejects.toThrow(
      'Cannot delete category "Perfumes" because it contains 3 products.',
    );
  });
});
