import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migrating categories to Perfumes & Mists only...');

  // 1. Ensure Perfumes exists
  let categoryPerfumes = await prisma.category.findFirst({
    where: {
      OR: [{ slug: 'perfumes' }, { name: { equals: 'Perfumes', mode: 'insensitive' } }],
      deletedAt: null,
    },
  });

  if (!categoryPerfumes) {
    categoryPerfumes = await prisma.category.create({
      data: {
        name: 'Perfumes',
        slug: 'perfumes',
        description: 'Intense, long-lasting luxury perfumes crafted with rare botanicals and precious resins',
      },
    });
    console.log('✅ Created category: Perfumes');
  } else {
    categoryPerfumes = await prisma.category.update({
      where: { id: categoryPerfumes.id },
      data: { name: 'Perfumes', slug: 'perfumes' },
    });
    console.log('✅ Updated category: Perfumes');
  }

  // 2. Ensure Mists exists
  let categoryMists = await prisma.category.findFirst({
    where: {
      OR: [{ slug: 'mists' }, { name: { equals: 'Mists', mode: 'insensitive' } }],
      deletedAt: null,
    },
  });

  if (!categoryMists) {
    categoryMists = await prisma.category.create({
      data: {
        name: 'Mists',
        slug: 'mists',
        description: 'Refreshing luxury body and hair mists crafted for the GCC',
      },
    });
    console.log('✅ Created category: Mists');
  } else {
    categoryMists = await prisma.category.update({
      where: { id: categoryMists.id },
      data: { name: 'Mists', slug: 'mists' },
    });
    console.log('✅ Updated category: Mists');
  }

  // 3. Find any other categories
  const otherCategories = await prisma.category.findMany({
    where: {
      id: { notIn: [categoryPerfumes.id, categoryMists.id] },
    },
  });

  console.log(`Found ${otherCategories.length} legacy categories to migrate.`);

  for (const cat of otherCategories) {
    const isMist = cat.name.toLowerCase().includes('mist') || cat.slug.toLowerCase().includes('mist');
    const targetCategory = isMist ? categoryMists : categoryPerfumes;

    const count = await prisma.product.count({ where: { categoryId: cat.id } });
    if (count > 0) {
      await prisma.product.updateMany({
        where: { categoryId: cat.id },
        data: { categoryId: targetCategory.id },
      });
      console.log(`  Moved ${count} products from "${cat.name}" to "${targetCategory.name}"`);
    }

    await prisma.category.delete({ where: { id: cat.id } }).catch(async () => {
      await prisma.category.update({
        where: { id: cat.id },
        data: { deletedAt: new Date() },
      });
    });
    console.log(`  Removed legacy category "${cat.name}" (${cat.slug})`);
  }

  console.log('🎉 Category migration complete! Only "Perfumes" and "Mists" remain in the database.');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
