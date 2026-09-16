import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { PrismaService } from '../prisma/prisma.service.js';
import { RedisCacheService } from '../redis/redis-cache.service.js';

export interface IndexProductDoc {
  productId: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  priceMinor: number;
  currency: string;
  avgRating: number;
  reviewCount: number;
  inStock: boolean;
  createdAt: string;
}

export interface SearchQueryParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: Client;
  private readonly indexName = 'products';

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: RedisCacheService,
  ) {
    const node = process.env.OPENSEARCH_NODE || 'http://localhost:9200';
    this.client = new Client({
      node,
    });
  }

  async onModuleInit() {
    try {
      await this.ensureIndexExists();
    } catch (err: any) {
      this.logger.warn(`Failed to connect/initialize OpenSearch index: ${err.message}. Search operations will degrade gracefully.`);
    }
  }

  async ensureIndexExists(): Promise<void> {
    const exists = await this.client.indices.exists({ index: this.indexName });
    if (!exists.body) {
      await this.client.indices.create({
        index: this.indexName,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: {
            properties: {
              productId: { type: 'keyword' },
              name: { type: 'text', analyzer: 'standard' },
              description: { type: 'text' },
              category: { type: 'keyword' },
              tags: { type: 'keyword' },
              priceMinor: { type: 'long' },
              currency: { type: 'keyword' },
              avgRating: { type: 'float' },
              reviewCount: { type: 'integer' },
              inStock: { type: 'boolean' },
              createdAt: { type: 'date' },
            },
          },
        },
      });
      this.logger.log(`Created OpenSearch index '${this.indexName}'`);
    }
  }

  async indexProduct(doc: IndexProductDoc): Promise<void> {
    try {
      await this.client.index({
        index: this.indexName,
        id: doc.productId,
        body: doc,
        refresh: true,
      });
    } catch (err: any) {
      this.logger.error(`Error indexing product ${doc.productId}: ${err.message}`);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.indexName,
        id: productId,
        refresh: true,
      });
    } catch (err: any) {
      this.logger.error(`Error deleting product from index ${productId}: ${err.message}`);
    }
  }

  async syncProductById(productId: string): Promise<void> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          variants: {
            where: { deletedAt: null },
            include: { prices: true, inventory: true },
          },
        },
      });

      if (!product || product.deletedAt || product.status !== 'ACTIVE') {
        await this.deleteProduct(productId);
        return;
      }

      const minPriceMinor = product.variants.length > 0
        ? Math.min(...product.variants.map(v => Math.round(Number(v.price) * 100)))
        : 0;
      const inStock = product.variants.some(v => (v.inventory?.quantityAvailable ?? v.stock ?? 0) > 0);
      const currency = product.variants[0]?.prices[0]?.currencyCode || 'USD';

      await this.indexProduct({
        productId: product.id,
        name: product.name,
        description: product.description,
        category: product.category.name,
        tags: [product.category.slug, product.name],
        priceMinor: minPriceMinor,
        currency,
        avgRating: product.avgRating,
        reviewCount: product.reviewCount,
        inStock,
        createdAt: product.createdAt.toISOString(),
      });
    } catch (err: any) {
      this.logger.error(`Error syncing product ${productId} to OpenSearch: ${err.message}`);
    }
  }

  async search(params: SearchQueryParams) {
    const cacheKey = `search:${Buffer.from(JSON.stringify(params)).toString('base64')}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const { q, category, minPrice, maxPrice, minRating, page = 1, limit = 20 } = params;
    const from = (page - 1) * limit;

    const filterClause: any[] = [];
    if (category) {
      filterClause.push({ term: { category } });
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      const range: any = {};
      if (minPrice !== undefined) range.gte = Number(minPrice);
      if (maxPrice !== undefined) range.lte = Number(maxPrice);
      filterClause.push({ range: { priceMinor: range } });
    }
    if (minRating !== undefined) {
      filterClause.push({ range: { avgRating: { gte: Number(minRating) } } });
    }
    filterClause.push({ term: { inStock: true } });

    const mustClause: any[] = q && q.trim().length > 0
      ? [{ multi_match: { query: q.trim(), fields: ['name^2', 'description', 'tags'] } }]
      : [{ match_all: {} }];

    try {
      const response = await this.client.search({
        index: this.indexName,
        from,
        size: Number(limit),
        body: {
          query: {
            bool: {
              must: mustClause,
              filter: filterClause,
            },
          },
        },
      });

      const hits = response.body.hits;
      const total = typeof hits.total === 'number' ? hits.total : hits.total.value;
      const items = hits.hits.map((hit: any) => hit._source);

      const result = {
        items,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };

      await this.cache.set(cacheKey, result, 60); // 60s TTL
      return result;
    } catch (err: any) {
      this.logger.error(`Search query failed: ${err.message}`);
      return {
        items: [],
        total: 0,
        page: Number(page),
        limit: Number(limit),
        totalPages: 0,
      };
    }
  }
}
