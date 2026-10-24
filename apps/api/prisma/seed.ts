import { PrismaClient, TaxType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for OudNomad (GCC & Global)...');

  // 1. Currencies
  const aed = await prisma.currency.upsert({
    where: { code: 'AED' },
    update: {},
    create: {
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      decimalPlaces: 2,
    },
  });

  const sar = await prisma.currency.upsert({
    where: { code: 'SAR' },
    update: {},
    create: {
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: 'ر.س',
      decimalPlaces: 2,
    },
  });

  const kwd = await prisma.currency.upsert({
    where: { code: 'KWD' },
    update: {},
    create: {
      code: 'KWD',
      name: 'Kuwaiti Dinar',
      symbol: 'د.ك',
      decimalPlaces: 3,
    },
  });

  const qar = await prisma.currency.upsert({
    where: { code: 'QAR' },
    update: {},
    create: {
      code: 'QAR',
      name: 'Qatari Riyal',
      symbol: 'ر.ق',
      decimalPlaces: 2,
    },
  });

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

  console.log('✅ Currencies seeded (AED, SAR, KWD, QAR, USD, INR)');

  // 2. Regions
  const regionAE = await prisma.region.upsert({
    where: { code: 'AE' },
    update: {},
    create: {
      code: 'AE',
      name: 'United Arab Emirates',
      currencyCode: aed.code,
    },
  });

  const regionSA = await prisma.region.upsert({
    where: { code: 'SA' },
    update: {},
    create: {
      code: 'SA',
      name: 'Saudi Arabia',
      currencyCode: sar.code,
    },
  });

  const regionKW = await prisma.region.upsert({
    where: { code: 'KW' },
    update: {},
    create: {
      code: 'KW',
      name: 'Kuwait',
      currencyCode: kwd.code,
    },
  });

  const regionQA = await prisma.region.upsert({
    where: { code: 'QA' },
    update: {},
    create: {
      code: 'QA',
      name: 'Qatar',
      currencyCode: qar.code,
    },
  });

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

  console.log('✅ Regions seeded (AE, SA, KW, QA, US, IN)');

  // 3. Tax Rules
  await prisma.taxRule.deleteMany({});
  await prisma.taxRule.createMany({
    data: [
      {
        regionId: regionAE.id,
        name: 'UAE Standard VAT',
        taxType: TaxType.VAT,
        rateBps: 500, // 5%
      },
      {
        regionId: regionSA.id,
        name: 'Saudi Arabia Standard VAT',
        taxType: TaxType.VAT,
        rateBps: 1500, // 15%
      },
      {
        regionId: regionUS.id,
        name: 'US Sales Tax',
        taxType: TaxType.SALES_TAX,
        rateBps: 825, // 8.25%
      },
      {
        regionId: regionIN.id,
        name: 'India GST Standard',
        taxType: TaxType.GST,
        rateBps: 1800, // 18%
      },
    ],
  });

  console.log('✅ Tax Rules seeded');

  // 4. Shipping Methods
  await prisma.shippingMethod.deleteMany({});
  await prisma.shippingMethod.createMany({
    data: [
      {
        regionId: regionAE.id,
        name: 'UAE Premium Courier',
        description: 'Next-day delivery across Dubai, Abu Dhabi & Emirates',
        amountMinor: 2500, // 25.00 AED
        currencyCode: 'AED',
        minDeliveryDays: 1,
        maxDeliveryDays: 2,
        isActive: true,
      },
      {
        regionId: regionSA.id,
        name: 'Saudi Express Courier',
        description: 'Fast tracked courier across Riyadh, Jeddah & KSA',
        amountMinor: 3500, // 35.00 SAR
        currencyCode: 'SAR',
        minDeliveryDays: 2,
        maxDeliveryDays: 4,
        isActive: true,
      },
      {
        regionId: regionUS.id,
        name: 'Standard Ground Shipping',
        description: 'Delivered in 3-5 business days across US',
        amountMinor: 1000, // $10.00
        currencyCode: 'USD',
        minDeliveryDays: 3,
        maxDeliveryDays: 5,
        isActive: true,
      },
    ],
  });

  console.log('✅ Shipping Methods seeded');

  // 5. Categories — Only Perfumes & Mists
  const categoryPerfumes = await prisma.category.upsert({
    where: { slug: 'perfumes' },
    update: {
      name: 'Perfumes', 
      description: 'Intense, long-lasting luxury perfumes crafted with rare botanicals and precious resins',
    },
    create: {
      name: 'Perfumes',
      slug: 'perfumes',
      description: 'Intense, long-lasting luxury perfumes crafted with rare botanicals and precious resins',
    },
    
  });

  const categoryMists = await prisma.category.upsert({
    where: { slug: 'mists' },
    update: {
      name: 'Mists',
      description: 'Refreshing luxury body and hair mists crafted for the GCC',
    },
    create: {
      name: 'Mists',
      slug: 'mists',
      description: 'Refreshing luxury body and hair mists crafted for the GCC',
    },
  });

  // Reassign any legacy categories (extrait-de-parfum, attar-oils, dehn-al-oud) to Perfumes and clean up
  const legacyCategories = await prisma.category.findMany({
    where: {
      slug: { in: ['extrait-de-parfum', 'attar-oils', 'dehn-al-oud'] },
    },
  });

  for (const legacy of legacyCategories) {
    await prisma.product.updateMany({
      where: { categoryId: legacy.id },
      data: { categoryId: categoryPerfumes.id },
    });
    await prisma.category.delete({ where: { id: legacy.id } }).catch(() => {});
  }

  console.log('✅ Categories seeded: Perfumes & Mists only');

  // 6. Products & Variants — Cèdre, Sélène, Ivoire (Mists Collection)
  const productsData = [
    {
      name: 'Cèdre',
      slug: 'cedre',
      description:
        'There is a moment when the desert light turns to gold, when warmth settles into the air and the world grows quiet. Cèdre captures that fleeting hour. Honeyed vanilla opens with a soft, inviting sweetness, unfolding into the golden depth of amber. Caramel and white musk linger on the skin, leaving behind a trail that feels warm, intimate and quietly magnetic. A fragrance of enveloping warmth, composed with understated sensuality.',
      categoryId: categoryMists.id,
      variants: [
        {
          sku: 'CED-MST-100ML',
          name: '100ml Fragrance Mist',
          size: '100ml',
          price: 495.0,
          stock: 50,
          priceMinorAED: 49500,
          priceMinorSAR: 51000,
          priceMinorUSD: 13500,
        },
      ],
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      name: 'Sélène',
      slug: 'selene',
      description:
        'As the city slips into night, its energy gives way to a more intimate kind of elegance. Sélène opens with the aromatic calm of lavender and musk, revealing a delicate heart of orchid and jasmine. Tonka bean lends a tender warmth, while vetiver grounds the composition in an earthy, sophisticated finish. Floral yet composed, Sélène is an ode to the beauty of restraint — a quiet signature that reveals itself gradually.',
      categoryId: categoryMists.id,
      variants: [
        {
          sku: 'SEL-MST-100ML',
          name: '100ml Fragrance Mist',
          size: '100ml',
          price: 495.0,
          stock: 50,
          priceMinorAED: 49500,
          priceMinorSAR: 51000,
          priceMinorUSD: 13500,
        },
      ],
      images: [
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      name: 'Ivoire',
      slug: 'ivoire',
      description:
        'Some of the most captivating things are never announced. They are felt. Ivoire opens like a whisper of powdery sweetness, softened by the golden delicacy of white honey. Coconut introduces a creamy warmth, while musk settles close to the skin, creating a smooth and intimate finish. Tender without being fragile, indulgent without excess, Ivoire is an exploration of softness in its most refined form.',
      categoryId: categoryMists.id,
      variants: [
        {
          sku: 'IVO-MST-100ML',
          name: '100ml Fragrance Mist',
          size: '100ml',
          price: 495.0,
          stock: 50,
          priceMinorAED: 49500,
          priceMinorSAR: 51000,
          priceMinorUSD: 13500,
        },
      ],
      images: [
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
      ],
    },
  ];


  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        categoryId: p.categoryId,
        status: 'ACTIVE',
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        status: 'ACTIVE',
      },
    });

    // Add images
    for (let i = 0; i < p.images.length; i++) {
      const imgUrl = p.images[i];
      const existingImg = await prisma.productImage.findFirst({
        where: { productId: product.id, position: i },
      });
      if (!existingImg) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: imgUrl,
            path: imgUrl,
            position: i,
            sortOrder: i,
            altText: `${p.name} luxury flacon`,
          },
        });
      }
    }

    // Add variants & prices
    for (const v of p.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          name: v.name,
          size: v.size,
          price: v.price,
          stock: v.stock,
        },
        create: {
          productId: product.id,
          sku: v.sku,
          name: v.name,
          size: v.size,
          price: v.price,
          stock: v.stock,
        },
      });

      // Regional prices (AED, SAR, USD)
      const prices = [
        { regionId: regionAE.id, currencyCode: 'AED', amountMinor: v.priceMinorAED },
        { regionId: regionSA.id, currencyCode: 'SAR', amountMinor: v.priceMinorSAR },
        { regionId: regionUS.id, currencyCode: 'USD', amountMinor: v.priceMinorUSD },
      ];

      for (const pr of prices) {
        const existingPrice = await prisma.productPrice.findFirst({
          where: { variantId: variant.id, regionId: pr.regionId },
        });
        if (!existingPrice) {
          await prisma.productPrice.create({
            data: {
              variantId: variant.id,
              regionId: pr.regionId,
              currencyCode: pr.currencyCode,
              amountMinor: pr.amountMinor,
            },
          });
        }
      }
    }

    console.log(`✅ Seeded product: ${p.name}`);
  }

  // 6. Default Administrator Account
  const adminEmail = process.env.ADMIN_EMAIL || 'navyachopra121@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Oudnomad@2026';
  const argon2 = await import('argon2');
  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: 'ADMIN',
      emailVerified: true,
      isBlocked: false,
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'Navya',
      lastName: 'Chopra',
      role: 'ADMIN',
      emailVerified: true,
      isBlocked: false,
    },
  });

  // Revoke admin access for all other accounts
  const revoked = await prisma.user.updateMany({
    where: {
      email: { not: adminEmail },
      role: 'ADMIN',
    },
    data: {
      role: 'CUSTOMER',
    },
  });
  if (revoked.count > 0) {
    console.log(`🔒 Revoked admin privileges from ${revoked.count} other account(s)`);
  }

  console.log(`👤 Active Administrator: ${adminUser.email}`);

  console.log('🎉 Database seed complete! GCC currencies, regions, tax rules, luxury products, and Administrator are live.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
