import { PrismaClient, TaxType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for OudNomad Phase 1...');

  // 1. Currencies
  const usd = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      decimalPlaces: 2,
    },
  });

  const inr = await prisma.currency.upsert({
    where: { code: 'INR' },
    update: {},
    create: {
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      decimalPlaces: 2,
    },
  });

  console.log('✅ Currencies seeded (USD, INR)');

  // 2. Regions
  const regionUS = await prisma.region.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      code: 'US',
      name: 'United States',
      currencyCode: usd.code,
    },
  });

  const regionIN = await prisma.region.upsert({
    where: { code: 'IN' },
    update: {},
    create: {
      code: 'IN',
      name: 'India',
      currencyCode: inr.code,
    },
  });

  console.log('✅ Regions seeded (US, IN)');

  // 3. Tax Rules
  await prisma.taxRule.deleteMany({}); // Reset tax rules for deterministic seeding

  await prisma.taxRule.createMany({
    data: [
      {
        regionId: regionUS.id,
        name: 'US Standard Sales Tax',
        taxType: TaxType.SALES_TAX,
        rateBps: 825, // 8.25%
      },
      {
        regionId: regionIN.id,
        name: 'India GST Standard',
        taxType: TaxType.GST,
        rateBps: 1800, // 18.00%
      },
    ],
  });

  console.log('✅ Tax Rules seeded (US Sales Tax @ 8.25%, IN GST @ 18.00%)');

  // 4. Shipping Methods
  await prisma.shippingMethod.deleteMany({}); // Reset shipping methods for deterministic seeding

  await prisma.shippingMethod.createMany({
    data: [
      {
        regionId: regionUS.id,
        name: 'Standard Ground Shipping',
        description: 'Delivered in 3-5 business days across US mainland',
        amountMinor: 1000, // $10.00
        currencyCode: 'USD',
        minDeliveryDays: 3,
        maxDeliveryDays: 5,
        isActive: true,
      },
      {
        regionId: regionUS.id,
        name: 'Express Air Courier',
        description: 'Delivered in 1-2 business days',
        amountMinor: 2500, // $25.00
        currencyCode: 'USD',
        minDeliveryDays: 1,
        maxDeliveryDays: 2,
        isActive: true,
      },
      {
        regionId: regionIN.id,
        name: 'Standard Surface Shipping',
        description: 'Delivered in 2-4 business days across India',
        amountMinor: 15000, // ₹150.00
        currencyCode: 'INR',
        minDeliveryDays: 2,
        maxDeliveryDays: 4,
        isActive: true,
      },
    ],
  });

  console.log('✅ Shipping Methods seeded');

  // 5. Categories
  const categoryParfum = await prisma.category.upsert({
    where: { slug: 'extrait-de-parfum' },
    update: {},
    create: {
      name: 'Extrait de Parfum',
      slug: 'extrait-de-parfum',
      description: 'Handcrafted luxury spray perfumes with high oil concentration',
    },
  });

  const categoryAttar = await prisma.category.upsert({
    where: { slug: 'attar-oils' },
    update: {},
    create: {
      name: 'Attar Oils',
      slug: 'attar-oils',
      description: 'Pure concentrated artisanal perfume oils',
    },
  });

  console.log(`✅ Categories seeded: ${categoryParfum.name}, ${categoryAttar.name}`);

  console.log('🎉 Phase 1 seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
