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
    // 1. Resolve Category
    let categoryId = dto.categoryId;
    if (!categoryId && dto.categoryName) {
      let cat = await this.prisma.category.findFirst({
        where: { name: { equals: dto.categoryName, mode: 'insensitive' }, deletedAt: null },
      });
      if (!cat) {
        const catSlug = await generateUniqueSlug(dto.categoryName, async (candidate) => {
          const found = await this.prisma.category.findUnique({ where: { slug: candidate } });
          return !!found;
        });
        cat = await this.prisma.category.create({
          data: { name: dto.categoryName, slug: catSlug },
        });
      }
      categoryId = cat.id;
    } else if (!categoryId) {
      let cat = await this.prisma.category.findFirst({ where: { deletedAt: null } });
      if (!cat) {
        cat = await this.prisma.category.create({
          data: { name: 'Mists', slug: 'mists', description: 'Oud Nomad Mists Collection' },
        });
      }
      categoryId = cat.id;
    }

    const baseSlug = (dto.slug && dto.slug.trim()) || dto.name;
    const slug = await generateUniqueSlug(baseSlug, async (candidate) => {
      const found = await this.prisma.product.findUnique({ where: { slug: candidate } });
      return !!found;
    });

    const status = dto.status ?? ProductStatus.ACTIVE;

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || dto.tagline || dto.name,
        categoryId,
        status,
      },
    });

    // 2. Handle Images
    if (dto.images && Array.isArray(dto.images)) {
      for (let i = 0; i < dto.images.length; i++) {
        const url = dto.images[i];
        if (url && typeof url === 'string') {
          await this.prisma.productImage.create({
            data: {
              productId: product.id,
              url,
              path: url,
              sortOrder: i,
            },
          });
        }
      }
    }

    // 3. Handle Variants — auto-create default variant with attributes
    const attributes: Record<string, any> = {
      tagline: dto.tagline,
      signature: dto.signature,
      moodAndCharacter: dto.moodAndCharacter,
      olfactoryStory: dto.olfactoryStory,
      ingredients: dto.ingredients,
      features: dto.features,
    };

    const sku = dto.sku ?? `${slug}-100ml`;
    const price = dto.price ?? 495;
    const stock = dto.stock ?? 100;

    const variant = await this.prisma.productVariant.create({
      data: {
        productId: product.id,
        sku,
        size: dto.features?.quantity || '100ml',
        price,
        stock,
        attributes,
      },
    });

    // 4. Upsert initial inventory
    await this.prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: { quantityAvailable: stock },
      create: {
        variantId: variant.id,
        quantityAvailable: stock,
        lowStockThreshold: 5,
      },
    });

    // 5. Upsert GCC Regional Prices
    if (dto.regionalPrices && typeof dto.regionalPrices === 'object') {
      const currencyMap: Record<string, string> = {
        AE: 'AED', SA: 'SAR', KW: 'KWD', QA: 'QAR', OM: 'OMR', BH: 'BHD',
        AED: 'AED', SAR: 'SAR', KWD: 'KWD', QAR: 'QAR', OMR: 'OMR', BHD: 'BHD',
      };
      for (const [key, val] of Object.entries(dto.regionalPrices)) {
        const countryCode =
          key.length === 2
            ? key.toUpperCase()
            : key === 'AED'
            ? 'AE'
            : key === 'SAR'
            ? 'SA'
            : key === 'KWD'
            ? 'KW'
            : key === 'QAR'
            ? 'QA'
            : key === 'OMR'
            ? 'OM'
            : 'BH';
        const currencyCode = currencyMap[key] || 'AED';
        if (val !== undefined && val !== null && !isNaN(Number(val))) {
          const region = await this.prisma.region.findUnique({ where: { code: countryCode } });
          if (region) {
            const existingPrice = await this.prisma.productPrice.findFirst({
              where: { variantId: variant.id, regionId: region.id },
            });
            if (existingPrice) {
              await this.prisma.productPrice.update({
                where: { id: existingPrice.id },
                data: { amountMinor: Math.round(Number(val) * 100), currencyCode },
              });
            } else {
              await this.prisma.productPrice.create({
                data: {
                  variantId: variant.id,
                  regionId: region.id,
                  currencyCode,
                  amountMinor: Math.round(Number(val) * 100),
                },
              });
            }
          }
        }
      }
    }

    return this.findByIdAdmin(product.id);
  }

  /**
   * Admin: Get all products (including archived, paginated, searchable).
   */
  async findAllAdmin(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: {
            where: { deletedAt: null },
            include: { prices: true },
          },
          images: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const formatted = items.map((p: any) => {
      const firstVariant = p.variants?.[0];
      const attributes = (firstVariant?.attributes as any) || {};

      const regionalPrices: Record<string, number> = {};
      firstVariant?.prices?.forEach((rp: any) => {
        regionalPrices[rp.currencyCode] = rp.amountMinor ? rp.amountMinor / 100 : Number(rp.price);
      });

      return {
        ...p,
        sku: firstVariant?.sku || '',
        price: firstVariant ? Number(firstVariant.price) : 0,
        images: (p.images || []).map((img: any) => typeof img === 'string' ? img : img.url),
        tagline: attributes.tagline,
        signature: attributes.signature,
        moodAndCharacter: attributes.moodAndCharacter,
        olfactoryStory: attributes.olfactoryStory,
        ingredients: attributes.ingredients,
        features: attributes.features,
        regionalPrices: Object.keys(regionalPrices).length > 0 ? regionalPrices : undefined,
      };
    });

    return {
      items: formatted,
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
    const product: any = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        variants: {
          where: { deletedAt: null },
          include: { prices: true },
        },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const firstVariant = product.variants?.[0];
    const attributes = (firstVariant?.attributes as any) || {};
    const regionalPrices: Record<string, number> = {};
    firstVariant?.prices?.forEach((rp: any) => {
      regionalPrices[rp.currencyCode] = rp.amountMinor ? rp.amountMinor / 100 : Number(rp.price);
    });

    return {
      ...product,
      sku: firstVariant?.sku || '',
      price: firstVariant ? Number(firstVariant.price) : 0,
      images: (product.images || []).map((img: any) => typeof img === 'string' ? img : img.url),
      tagline: attributes.tagline,
      signature: attributes.signature,
      moodAndCharacter: attributes.moodAndCharacter,
      olfactoryStory: attributes.olfactoryStory,
      ingredients: attributes.ingredients,
      features: attributes.features,
      regionalPrices: Object.keys(regionalPrices).length > 0 ? regionalPrices : undefined,
    };
  }

  /**
   * Admin: Update product metadata, variants, images, regional prices.
   */
  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { variants: true },
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

    let categoryId = dto.categoryId;
    if (!categoryId && dto.categoryName) {
      let cat = await this.prisma.category.findFirst({
        where: {
          OR: [
            { name: { equals: dto.categoryName, mode: 'insensitive' } },
            { slug: { equals: dto.categoryName.toLowerCase().replace(/\s+/g, '-') } },
          ],
          deletedAt: null,
        },
      });
      if (!cat) {
        const catSlug = await generateUniqueSlug(dto.categoryName, async (candidate) => {
          const found = await this.prisma.category.findUnique({ where: { slug: candidate } });
          return !found;
        });
        cat = await this.prisma.category.create({
          data: { name: dto.categoryName, slug: catSlug },
        });
      }
      categoryId = cat.id;
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        categoryId: categoryId || undefined,
        status: dto.status,
      },
      include: {
        category: true,
        variants: { where: { deletedAt: null } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    // Update Images if provided
    if (dto.images && Array.isArray(dto.images)) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < dto.images.length; i++) {
        const url = dto.images[i];
        if (url && typeof url === 'string') {
          await this.prisma.productImage.create({
            data: {
              productId: id,
              url,
              path: url,
              sortOrder: i,
            },
          });
        }
      }
    }

    // Update primary variant
    const firstVariant = product.variants[0];
    if (firstVariant) {
      const existingAttributes = (firstVariant.attributes as any) || {};
      const newAttributes = {
        ...existingAttributes,
        ...(dto.tagline !== undefined && { tagline: dto.tagline }),
        ...(dto.signature !== undefined && { signature: dto.signature }),
        ...(dto.moodAndCharacter !== undefined && { moodAndCharacter: dto.moodAndCharacter }),
        ...(dto.olfactoryStory !== undefined && { olfactoryStory: dto.olfactoryStory }),
        ...(dto.ingredients !== undefined && { ingredients: dto.ingredients }),
        ...(dto.features !== undefined && { features: dto.features }),
      };

      await this.prisma.productVariant.update({
        where: { id: firstVariant.id },
        data: {
          sku: dto.sku || undefined,
          price: dto.price !== undefined ? dto.price : undefined,
          attributes: newAttributes,
        },
      });

      // Update regional prices
      if (dto.regionalPrices && typeof dto.regionalPrices === 'object') {
        const currencyMap: Record<string, string> = {
          AE: 'AED', SA: 'SAR', KW: 'KWD', QA: 'QAR', OM: 'OMR', BH: 'BHD',
          AED: 'AED', SAR: 'SAR', KWD: 'KWD', QAR: 'QAR', OMR: 'OMR', BHD: 'BHD',
        };
        for (const [key, val] of Object.entries(dto.regionalPrices)) {
          const countryCode =
            key.length === 2
              ? key.toUpperCase()
              : key === 'AED'
              ? 'AE'
              : key === 'SAR'
              ? 'SA'
              : key === 'KWD'
              ? 'KW'
              : key === 'QAR'
              ? 'QA'
              : key === 'OMR'
              ? 'OM'
              : 'BH';
          const currencyCode = currencyMap[key] || 'AED';
          if (val !== undefined && val !== null && !isNaN(Number(val))) {
            const region = await this.prisma.region.findUnique({ where: { code: countryCode } });
            if (region) {
              const existingPrice = await this.prisma.productPrice.findFirst({
                where: { variantId: firstVariant.id, regionId: region.id },
              });
              if (existingPrice) {
                await this.prisma.productPrice.update({
                  where: { id: existingPrice.id },
                  data: { amountMinor: Math.round(Number(val) * 100), currencyCode },
                });
              } else {
                await this.prisma.productPrice.create({
                  data: {
                    variantId: firstVariant.id,
                    regionId: region.id,
                    currencyCode,
                    amountMinor: Math.round(Number(val) * 100),
                  },
                });
              }
            }
          }
        }
      }
    }

    // Invalidate product cache
    await this.cache.del(`product:${id}`);
    await this.cache.del(`product:slug:${product.slug}`);

    return this.findByIdAdmin(id);
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

    // Resolve category subtree IDs if categoryId or category parameter is supplied
    let categoryIds: string[] | undefined;
    if (query.categoryId) {
      categoryIds = await this.getCategorySubtreeIds(query.categoryId);
    } else if (query.category && query.category.toLowerCase() !== 'all') {
      const catSlugOrName = query.category.toLowerCase().trim();
      const cat = await this.prisma.category.findFirst({
        where: {
          OR: [
            { slug: { equals: catSlugOrName } },
            { name: { equals: catSlugOrName, mode: 'insensitive' } },
            { slug: { startsWith: catSlugOrName.slice(0, 4) } },
          ],
          deletedAt: null,
        },
      });
      if (cat) {
        categoryIds = await this.getCategorySubtreeIds(cat.id);
      } else {
        categoryIds = ['non-existent-category-id'];
      }
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
    if (query.sort === ProductSortOption.PRICE_ASC || query.sort === 'price_asc' || query.sort === 'price-low-high') {
      orderBy = { createdAt: 'asc' };
    } else if (query.sort === ProductSortOption.PRICE_DESC || query.sort === 'price_desc' || query.sort === 'price-high-low') {
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
        variants: { where: { deletedAt: null }, include: { prices: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id ?? null;
    }

    const mappedItems = items.map((product: any) => {
      const firstVariant = product.variants?.[0];
      const attributes = (firstVariant?.attributes as any) || {};
      const price = firstVariant ? Number(firstVariant.price) : 495;
      const images = (product.images || [])
        .map((img: any) => (typeof img === 'string' ? img : img.url))
        .filter(Boolean);

      const catSlug = product.category?.slug?.toLowerCase() || 'perfumes';
      const catName = product.category?.name || (catSlug.includes('mist') ? 'Mists' : 'Perfumes');

      const regionalPrices: Record<string, number> = {};
      firstVariant?.prices?.forEach((rp: any) => {
        regionalPrices[rp.currencyCode] = rp.amountMinor ? rp.amountMinor / 100 : Number(rp.price);
      });

      return {
        ...product,
        price,
        currency: 'AED',
        category: catSlug.includes('mist') ? 'mists' : 'perfumes',
        categoryName: catName,
        images:
          images.length > 0
            ? images
            : ['https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618'],
        tagline: attributes.tagline || product.tagline || '',
        signature: attributes.signature || product.signature || '',
        moodAndCharacter: attributes.moodAndCharacter || product.moodAndCharacter || '',
        olfactoryStory: attributes.olfactoryStory || product.olfactoryStory || '',
        ingredients: attributes.ingredients || product.ingredients || '',
        features: attributes.features || product.features || {},
        regionalPrices: Object.keys(regionalPrices).length > 0 ? regionalPrices : undefined,
        variants: (product.variants || []).map((v: any) => ({
          id: v.id,
          sku: v.sku,
          size: v.size || '100ml',
          price: Number(v.price) || price,
          stock: v.stock ?? 100,
          inStock: (v.stock ?? 1) > 0,
        })),
      };
    });

    return {
      items: mappedItems,
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

    const product: any = await this.prisma.product.findFirst({
      where: { slug, status: ProductStatus.ACTIVE, deletedAt: null },
      include: {
        category: true,
        variants: { where: { deletedAt: null }, include: { prices: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    // Build category breadcrumb chain walking parent relations up
    const breadcrumbs = await this.getCategoryBreadcrumbs(product.categoryId);

    const firstVariant = product.variants?.[0];
    const attributes = (firstVariant?.attributes as any) || {};
    const price = firstVariant ? Number(firstVariant.price) : 495;
    const images = (product.images || [])
      .map((img: any) => (typeof img === 'string' ? img : img.url))
      .filter(Boolean);

    const catSlug = product.category?.slug?.toLowerCase() || 'perfumes';
    const catName = product.category?.name || (catSlug.includes('mist') ? 'Mists' : 'Perfumes');

    const regionalPrices: Record<string, number> = {};
    firstVariant?.prices?.forEach((rp: any) => {
      regionalPrices[rp.currencyCode] = rp.amountMinor ? rp.amountMinor / 100 : Number(rp.price);
    });

    const result = {
      ...product,
      price,
      currency: 'AED',
      category: catSlug.includes('mist') ? 'mists' : 'perfumes',
      categoryName: catName,
      images:
        images.length > 0
          ? images
          : ['https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618'],
      tagline: attributes.tagline || product.tagline || '',
      signature: attributes.signature || product.signature || '',
      moodAndCharacter: attributes.moodAndCharacter || product.moodAndCharacter || '',
      olfactoryStory: attributes.olfactoryStory || product.olfactoryStory || '',
      ingredients: attributes.ingredients || product.ingredients || '',
      features: attributes.features || product.features || {},
      regionalPrices: Object.keys(regionalPrices).length > 0 ? regionalPrices : undefined,
      variants: (product.variants || []).map((v: any) => ({
        id: v.id,
        sku: v.sku,
        size: v.size || '100ml',
        price: Number(v.price) || price,
        stock: v.stock ?? 100,
        inStock: (v.stock ?? 1) > 0,
      })),
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
