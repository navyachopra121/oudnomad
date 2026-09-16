import { PrismaClient } from '../apps/api/node_modules/@prisma/client/default.js';
import { Client } from '../apps/api/node_modules/@opensearch-project/opensearch/index.js';

const prisma = new PrismaClient();
const opensearchHost = process.env.OPENSEARCH_NODE || 'http://localhost:9200';
const client = new Client({ node: opensearchHost });

async function main() {
  console.log('Starting full product reindex into OpenSearch...');
  
  // Ensure index exists
  const indexName = 'products';
  const exists = await client.indices.exists({ index: indexName });
  if (!exists.body) {
    await client.indices.create({
      index: indexName,
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
    console.log(`Created index ${indexName}`);
  }

  const products = await prisma.product.findMany({
    where: { deletedAt: null, status: 'ACTIVE' },
    include: {
      category: true,
      variants: {
        where: { deletedAt: null },
        include: { prices: true, inventory: true },
      },
    },
  });

  console.log(`Found ${products.length} active products to reindex.`);

  for (const product of products) {
    const minPriceMinor = product.variants.length > 0
      ? Math.min(...product.variants.map(v => Math.round(Number(v.price) * 100)))
      : 0;

    const inStock = product.variants.some(v => (v.inventory?.quantityAvailable ?? v.stock ?? 0) > 0);
    const currency = product.variants[0]?.prices[0]?.currencyCode || 'USD';

    const doc = {
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
    };

    await client.index({
      index: indexName,
      id: product.id,
      body: doc,
      refresh: true,
    });
    console.log(`Indexed product: ${product.name} (${product.id})`);
  }

  console.log('Reindexing completed successfully.');
}

main()
  .catch((err) => {
    console.error('Reindexing failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
