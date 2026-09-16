import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisCacheService } from '../../redis/redis-cache.service.js';
import { generateUniqueSlug } from '../utils/slug.util.js';
import type { CreateProductDto, CreateVariantDto } from './dto/create-product.dto.js';
import type { UpdateProductDto } from './dto/update-product.dto.js';
import type { UpdateVariantDto } from './dto/update-variant.dto.js';
import { ProductQueryDto, ProductSortOption } from './dto/product-query.dto.js';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: RedisCacheService,
  ) {}

  /**
   * Admin: Create product. Auto-creates default variant if no explicit variants are passed.
   */
  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId, deletedAt: null },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
    }

    const slug = await generateUniqueSlug(dto.name, async (candidate) => {
      const found = await this.prisma.product.findUnique({ where: { slug: candidate } });
      return !!found;
    });

    const status = dto.status ?? ProductStatus.ACTIVE;

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        categoryId: dto.categoryId,
        status,
      },
    });

    // Handle Variants — auto-create default variant if none provided
    const variantsToCreate: CreateVariantDto[] =
      dto.variants && dto.variants.length > 0
        ? dto.variants
        : [
            {
              sku: dto.sku ?? `${slug}-def`,
              price: dto.price ?? 0,
              stock: dto.stock ?? 0,
            },
          ];

    for (const v of variantsToCreate) {
      await this.prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          price: v.price,
          stock: v.stock ?? 0,
        },
      });
    }

    return this.findByIdAdmin(product.id);
  }

  /**
   * Admin: Get all products (including archived, paginated).
   */
  async findAllAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { deletedAt: null },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: { where: { deletedAt: null } },
          images: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where: { deletedAt: null } }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Admin: Get single product for editing.
   */
  async findByIdAdmin(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        variants: { where: { deletedAt: null } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Admin: Update product metadata. Slug remains immutable.
   */
  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: dto.categoryId, deletedAt: null },
      });
      if (!category) throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        categoryId: dto.categoryId,
        status: dto.status,
      },
      include: {
        category: true,
        variants: { where: { deletedAt: null } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    // Invalidate product cache
    await this.cache.del(`product:${id}`);
    await this.cache.del(`product:slug:${product.slug}`);
    if (updated.slug !== product.slug) {
      await this.cache.del(`product:slug:${updated.slug}`);
    }

    return updated;
  }

  /**
   * Admin: Soft delete product (sets status: ARCHIVED, deletedAt: now()).
   */
  async delete(id: string): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    await this.prisma.product.update({
      where: { id },
      data: {
        status: ProductStatus.ARCHIVED,
        deletedAt: new Date(),
      },
    });

    // Invalidate product cache
    await this.cache.del(`product:${id}`);
    await this.cache.del(`product:slug:${product.slug}`);
  }

  /**
   * Admin: Add variant to existing product.
   */
  async addVariant(productId: string, dto: CreateVariantDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });
    if (!product) throw new NotFoundException(`Product with ID ${productId} not found`);

    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: dto.sku },
    });
    if (existingSku) {
      throw new BadRequestException(`SKU "${dto.sku}" already exists`);
    }

    return this.prisma.productVariant.create({
      data: {
        productId,
        sku: dto.sku,
        size: dto.size,
        color: dto.color,
        price: dto.price,
        stock: dto.stock ?? 0,
      },
    });
  }

  /**
   * Admin: Update variant price/stock/size/color.
   */
  async updateVariant(productId: string, variantId: string, dto: UpdateVariantDto) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, productId, deletedAt: null },
    });
    if (!variant) throw new NotFoundException('Product variant not found');

    if (dto.sku && dto.sku !== variant.sku) {
      const existingSku = await this.prisma.productVariant.findUnique({
        where: { sku: dto.sku },
      });
      if (existingSku) throw new BadRequestException(`SKU "${dto.sku}" already exists`);
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        sku: dto.sku,
        size: dto.size,
        color: dto.color,
        price: dto.price,
        stock: dto.stock,
      },
    });
  }

  /**
   * Admin: Remove variant — BLOCKS deletion if it is the only remaining variant!
   */
  async deleteVariant(productId: string, variantId: string): Promise<void> {
    const activeVariants = await this.prisma.productVariant.findMany({
      where: { productId, deletedAt: null },
    });

    if (!activeVariants.some((v) => v.id === variantId)) {
      throw new NotFoundException('Product variant not found');
    }

    if (activeVariants.length <= 1) {
      throw new BadRequestException(
        'Cannot remove variant: A product must have at least one active variant.',
      );
    }

    await this.prisma.productVariant.update({
      where: { id: variantId },
      data: { deletedAt: new Date() },
    });
  }

  // ---------------------------------------------------------------------------
  // PUBLIC STOREFRONT METHODS
  // ---------------------------------------------------------------------------

  /**
   * Public: List products with category subtree resolution, price filtering, sorting & cursor pagination.
   */
  async findAllPublic(query: ProductQueryDto) {
    const limit = query.limit ?? 20;

    // Resolve category subtree IDs if categoryId parameter is supplied
    let categoryIds: string[] | undefined;
    if (query.categoryId) {
      categoryIds = await this.getCategorySubtreeIds(query.categoryId);
    }

    const where: any = {
      status: ProductStatus.ACTIVE,
      deletedAt: null,
    };

    if (categoryIds && categoryIds.length > 0) {
      where.categoryId = { in: categoryIds };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.variants = {
        some: {
          deletedAt: null,
          price: {
            gte: query.minPrice !== undefined ? query.minPrice : undefined,
            lte: query.maxPrice !== undefined ? query.maxPrice : undefined,
          },
        },
      };
    }

    // Configure Order By
    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === ProductSortOption.PRICE_ASC) {
      orderBy = { createdAt: 'asc' };
    } else if (query.sort === ProductSortOption.PRICE_DESC) {
      orderBy = { createdAt: 'desc' };
    }

    const items = await this.prisma.product.findMany({
      where,
      take: limit + 1,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      skip: query.cursor ? 1 : 0,
      orderBy,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { where: { deletedAt: null } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id ?? null;
    }

    return {
      items,
      nextCursor,
    };
  }

  /**
   * Public: Get product details by slug including category breadcrumb.
   */
  async findBySlugPublic(slug: string) {
    const cacheKey = `product:slug:${slug}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.prisma.product.findFirst({
      where: { slug, status: ProductStatus.ACTIVE, deletedAt: null },
      include: {
        category: true,
        variants: { where: { deletedAt: null } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    // Build category breadcrumb chain walking parent relations up
    const breadcrumbs = await this.getCategoryBreadcrumbs(product.categoryId);

    const result = {
      ...product,
      breadcrumbs,
    };

    await this.cache.set(cacheKey, result, 300); // 5 min TTL
    return result;
  }

  /**
   * Public: Postgres full-text search via $queryRaw with tsvector & ts_rank.
   */
  async searchFullText(queryText: string, limit = 20, offset = 0) {
    if (!queryText || queryText.trim().length === 0) {
      return [];
    }

    const trimmed = queryText.trim();

    try {
      const results = await this.prisma.$queryRaw`
        SELECT p.id, p.name, p.slug, p.description, p.category_id as "categoryId", p.created_at as "createdAt"
        FROM products p
        WHERE p.status = 'ACTIVE'
          AND p.deleted_at IS NULL
          AND p.search_vector @@ plainto_tsquery('english', ${trimmed})
        ORDER BY ts_rank(p.search_vector, plainto_tsquery('english', ${trimmed})) DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return results;
    } catch (_err) {
      // Fallback for environments where tsvector migration has not run yet
      return this.prisma.product.findMany({
        where: {
          status: ProductStatus.ACTIVE,
          deletedAt: null,
          OR: [
            { name: { contains: trimmed, mode: 'insensitive' } },
            { description: { contains: trimmed, mode: 'insensitive' } },
          ],
        },
        take: limit,
        skip: offset,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // HELPER METHODS
  // ---------------------------------------------------------------------------

  private async getCategorySubtreeIds(rootCategoryId: string): Promise<string[]> {
    const allCategories = await this.prisma.category.findMany({
      where: { deletedAt: null },
      select: { id: true, parentId: true },
    });

    const resultIds = new Set<string>([rootCategoryId]);
    let addedNew = true;

    while (addedNew) {
      addedNew = false;
      for (const cat of allCategories) {
        if (cat.parentId && resultIds.has(cat.parentId) && !resultIds.has(cat.id)) {
          resultIds.add(cat.id);
          addedNew = true;
        }
      }
    }

    return Array.from(resultIds);
  }

  private async getCategoryBreadcrumbs(categoryId: string) {
    const breadcrumbs: Array<{ id: string; name: string; slug: string }> = [];
    let currentId: string | null = categoryId;

    while (currentId) {
      const cat: { id: string; name: string; slug: string; parentId: string | null } | null =
        await this.prisma.category.findFirst({
          where: { id: currentId, deletedAt: null },
          select: { id: true, name: true, slug: true, parentId: true },
        });

      if (!cat) break;
      breadcrumbs.unshift({ id: cat.id, name: cat.name, slug: cat.slug });
      currentId = cat.parentId;
    }

    return breadcrumbs;
  }
}
