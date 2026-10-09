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

  // 5. Categories
  const categoryParfum = await prisma.category.upsert({
    where: { slug: 'extrait-de-parfum' },
    update: {},
    create: {
      name: 'Extrait de Parfum',
      slug: 'extrait-de-parfum',
      description: 'Handcrafted luxury spray perfumes with extraordinary 35%+ oil concentration',
    },
  });

  const categoryAttar = await prisma.category.upsert({
    where: { slug: 'attar-oils' },
    update: {},
    create: {
      name: 'Artisanal Attar Oils',
      slug: 'attar-oils',
      description: 'Pure concentrated artisanal perfume oils aged in traditional copper stills',
    },
  });

  const categoryDehn = await prisma.category.upsert({
    where: { slug: 'dehn-al-oud' },
    update: {},
    create: {
      name: 'Vintage Dehn Al Oud',
      slug: 'dehn-al-oud',
      description: 'Rare wild-harvested vintage agarwood distillations from Cambodia, Assam & Trat',
    },
  });

  console.log('✅ Categories seeded');

  // 6. Products & Variants — Cedre, Selene, Ivoire
  const productsData = [
    {
      name: 'Cedre',
      slug: 'cedre',
      description:
        'A warm, indulgent fragrance that opens with the soft sweetness of vanilla and honey, unfolding into a rich amber heart. Caramel and white musk settle into a smooth, sensual base, leaving behind a lingering trail that feels warm, comforting and quietly luxurious.',
      categoryId: categoryParfum.id,
      variants: [
        {
          sku: 'CED-50ML',
          name: '50ml Extrait',
          size: '50ml',
          price: 320.0,
          stock: 50,
          priceMinorAED: 32000,
          priceMinorSAR: 33000,
          priceMinorUSD: 8700,
        },
        {
          sku: 'CED-100ML',
          name: '100ml Extrait Flacon',
          size: '100ml',
          price: 495.0,
          stock: 35,
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
      name: 'Selene',
      slug: 'selene',
      description:
        'An elegant floral fragrance balanced with soft musk and aromatic lavender. Orchid and jasmine create a refined floral heart, while tonka bean and vetiver add depth and warmth to the dry-down. A sophisticated scent that moves effortlessly from fresh and delicate to warm and grounded.',
      categoryId: categoryParfum.id,
      variants: [
        {
          sku: 'SEL-50ML',
          name: '50ml Extrait',
          size: '50ml',
          price: 320.0,
          stock: 50,
          priceMinorAED: 32000,
          priceMinorSAR: 33000,
          priceMinorUSD: 8700,
        },
        {
          sku: 'SEL-100ML',
          name: '100ml Extrait Flacon',
          size: '100ml',
          price: 495.0,
          stock: 35,
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
        'A soft, creamy fragrance built around the delicate sweetness of powder and white honey. As it settles, creamy coconut meets clean musk, creating a smooth and comforting trail with an understated sense of luxury.',
      categoryId: categoryParfum.id,
      variants: [
        {
          sku: 'IVO-50ML',
          name: '50ml Extrait',
          size: '50ml',
          price: 320.0,
          stock: 50,
          priceMinorAED: 32000,
          priceMinorSAR: 33000,
          priceMinorUSD: 8700,
        },
        {
          sku: 'IVO-100ML',
          name: '100ml Extrait Flacon',
          size: '100ml',
          price: 495.0,
          stock: 35,
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

  console.log('🎉 Database seed complete! GCC currencies, regions, tax rules, and luxury products are live.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
