import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

const prisma = new PrismaClient();
const os = new Client({ node: 'http://localhost:9200' });

async function syncAll() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
  });
  console.log('Found products to index:', products.length);
  for (const p of products) {
    const minPrice =
      p.variants.length > 0
        ? Math.min(...p.variants.map((v) => Math.round(Number(v.price) * 100)))
        : 0;
    await os.index({
      index: 'products',
      id: p.id,
      body: {
        productId: p.id,
        name: p.name,
        description: p.description,
        category: p.category.name,
        tags: [p.category.slug, p.name],
        priceMinor: minPrice,
        currency: 'AED',
        avgRating: 5.0,
        reviewCount: 12,
        inStock: true,
        createdAt: p.createdAt.toISOString(),
      },
      refresh: true,
    });
    console.log('Indexed into OpenSearch:', p.name);
  }
}

syncAll()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
