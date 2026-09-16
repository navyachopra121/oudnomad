import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface CoPurchaseRow {
  product_id: string;
  recommended_id: string;
  score: number;
}

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getRecommendationsForProduct(productId: string, limit = 6) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const recs = await this.prisma.productRecommendation.findMany({
      where: { productId },
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        recommended: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            avgRating: true,
            reviewCount: true,
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
            variants: {
              where: { deletedAt: null },
              select: {
                id: true,
                price: true,
                stock: true,
                inventory: { select: { quantityAvailable: true } },
              },
            },
          },
        },
      },
    });

    return recs.map((r) => ({
      id: r.id,
      productId: r.productId,
      recommendedId: r.recommendedId,
      score: r.score,
      source: r.source,
      product: r.recommended,
    }));
  }

  /**
   * Batch job: calculates co-purchases and populates ProductRecommendation table
   * with same-category fallback for products with < 3 co-purchase recs.
   */
  async computeRecommendations(): Promise<{ count: number }> {
    this.logger.log('Starting recommendation batch calculation...');

    // 1. Fetch co-purchases via raw SQL query
    let coPurchases: CoPurchaseRow[] = [];
    try {
      coPurchases = await this.prisma.$queryRaw<CoPurchaseRow[]>`
        SELECT
          oi1.product_id AS product_id,
          oi2.product_id AS recommended_id,
          COUNT(*)::float AS score
        FROM order_items oi1
        JOIN order_items oi2
          ON oi1.order_id = oi2.order_id AND oi1.product_id != oi2.product_id
        GROUP BY oi1.product_id, oi2.product_id
        ORDER BY oi1.product_id, score DESC;
      `;
    } catch (err: any) {
      this.logger.warn(`Co-purchase query warning: ${err.message}. Proceeding with category fallbacks.`);
    }

    // Group co-purchases by product_id
    const coPurchaseMap = new Map<string, Array<{ recommendedId: string; score: number }>>();
    for (const row of coPurchases) {
      const existing = coPurchaseMap.get(row.product_id) || [];
      if (existing.length < 6) {
        existing.push({ recommendedId: row.recommended_id, score: row.score });
        coPurchaseMap.set(row.product_id, existing);
      }
    }

    // 2. Fetch all active products
    const activeProducts = await this.prisma.product.findMany({
      where: { deletedAt: null, status: 'ACTIVE' },
      select: { id: true, categoryId: true, avgRating: true, reviewCount: true },
    });

    let totalInserted = 0;

    await this.prisma.$transaction(async (tx) => {
      // Clear existing recommendations
      await tx.productRecommendation.deleteMany({});

      for (const p of activeProducts) {
        const pRecs = coPurchaseMap.get(p.id) || [];
        const recsToSave: Array<{
          productId: string;
          recommendedId: string;
          score: number;
          source: string;
        }> = [];

        // Add co-purchase recommendations
        for (const cp of pRecs) {
          recsToSave.push({
            productId: p.id,
            recommendedId: cp.recommendedId,
            score: cp.score,
            source: 'co_purchase',
          });
        }

        // Fallback to same-category products if fewer than 3 recommendations
        if (recsToSave.length < 3) {
          const excludeIds = new Set([p.id, ...recsToSave.map((r) => r.recommendedId)]);
          const categoryProducts = await tx.product.findMany({
            where: {
              categoryId: p.categoryId,
              status: 'ACTIVE',
              deletedAt: null,
              id: { notIn: Array.from(excludeIds) },
            },
            orderBy: [{ avgRating: 'desc' }, { reviewCount: 'desc' }],
            take: 6 - recsToSave.length,
          });

          for (const catProd of categoryProducts) {
            recsToSave.push({
              productId: p.id,
              recommendedId: catProd.id,
              score: (catProd.avgRating || 0) + 0.1, // slight positive score for category fallback
              source: 'same_category',
            });
          }
        }

        if (recsToSave.length > 0) {
          await tx.productRecommendation.createMany({
            data: recsToSave,
            skipDuplicates: true,
          });
          totalInserted += recsToSave.length;
        }
      }
    });

    this.logger.log(`Completed recommendation batch job. Inserted ${totalInserted} recommendations.`);
    return { count: totalInserted };
  }
}
