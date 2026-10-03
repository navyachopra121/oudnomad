// Oud Nomad Dubai — Curated product catalogue (GCC / AED)
export interface ProductFeature {
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
  longevity: string;
  gender: string;
  type: string;
  quantity: string;
}

export interface OudProduct {
  id: string;
  title: string;
  handle: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  categories: string[];
  tags: string[];
  images: string[];
  description: string;
  bodyHtml: string;
  features: ProductFeature;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface CollectionMeta {
  handle: string;
  title: string;
  description: string;
  count: number;
}

// ── Collections (All + Perfumes + Mists) ─────────────────────────────────────
export const OUD_COLLECTIONS: CollectionMeta[] = [
  {
    handle: 'all',
    title: 'All Fragrances',
    description: 'Explore the complete universe of Oud Nomad Dubai — luxury perfumes and refreshing mists, crafted for the GCC.',
    count: 6,
  },
  {
    handle: 'perfumes',
    title: 'Perfumes',
    description: 'Intense, long-lasting Extrait de Parfum and Eau de Parfum blends built around rare agarwood, saffron, and precious florals.',
    count: 3,
  },
  {
    handle: 'mists',
    title: 'Mists',
    description: 'Light, refreshing body and hair mists — the perfect everyday scent for warm GCC days and effortless layering.',
    count: 3,
  },
];

// ── Products — 3 Perfumes + 3 Mists ──────────────────────────────────────────
export const OUD_PRODUCTS: OudProduct[] = [

  // ── PERFUMES ──────────────────────────────────────────────────────────────

  {
    id: 'prod-perf-001',
    title: 'Dakhoon',
    handle: 'dakhoon',
    price: 299,
    compareAtPrice: null,
    category: 'perfumes',
    categories: ['perfumes', 'all'],
    tags: ['perfume', 'oud', 'oriental'],
    images: [
      'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dakhoon.jpg?v=1770415101',
    ],
    description:
      'An opulent fusion inspired by traditional Arabian incense rituals. Dakhoon opens with a rich whisper of agarwood, rose, and smooth vanilla, before exotic saffron blends seamlessly with Omani frankincense. Anchored by leather, powder musk, and amber — a luxurious oriental experience that feels both bold and timeless.',
    bodyHtml: '',
    features: {
      topNotes: 'Agarwood (Oud), Rose, Vanilla',
      middleNotes: 'Saffron, Omani Frankincense, Praline, Guaiac Wood',
      baseNotes: 'Leather, Powder Musk, Amber',
      longevity: '12-16 Hours',
      gender: 'Unisex',
      type: 'Extrait de Parfum',
      quantity: '100ml',
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 28,
  },

  {
    id: 'prod-perf-002',
    title: 'Coffee Oud',
    handle: 'coffee-oud',
    price: 279,
    compareAtPrice: null,
    category: 'perfumes',
    categories: ['perfumes', 'all'],
    tags: ['perfume', 'gourmand', 'oud'],
    images: [
      'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/CoffeeOud.jpg?v=1770414703',
    ],
    description:
      'Bold, addictive, and irresistibly warm — Coffee Oud captures the richness of freshly brewed coffee infused with spicy cardamom and a hint of pink pepper. The heart reveals cinnamon, mandarin, and caramel. A deep base of cedarwood, musk, tonka bean, and agarwood delivers a smooth, long-lasting finish that wraps you in sophistication.',
    bodyHtml: '',
    features: {
      topNotes: 'Coffee, Cardamom, Pink Pepper',
      middleNotes: 'Cinnamon, Mandarin, Caramel',
      baseNotes: 'Cedar, Musk, Tonka Bean, Agarwood, Vanilla',
      longevity: '10-14 Hours',
      gender: 'Unisex',
      type: 'Eau de Parfum',
      quantity: '100ml',
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 34,
  },

  {
    id: 'prod-perf-003',
    title: 'The Dark Horse',
    handle: 'the-dark-horse',
    price: 319,
    compareAtPrice: null,
    category: 'perfumes',
    categories: ['perfumes', 'all'],
    tags: ['perfume', 'woody', 'leather'],
    images: [
      'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Dark_Horse.png?v=1770388755',
    ],
    description:
      'Bold, enigmatic, and crafted for those who stand apart. The Dark Horse opens with lemon, aldehydes, and bergamot wrapped in an intense leathery oud accord. The heart unfolds with green notes, neroli, and freesia, balanced by warm cardamom. A powerful base of sandalwood, African leather, and cashmerean leaves a dark, confident trail that lasts for hours.',
    bodyHtml: '',
    features: {
      topNotes: 'Lemon, Aldehydes, Bergamot, Leather Oud',
      middleNotes: 'Green Notes, Neroli, Freesia, Pear, Cardamom',
      baseNotes: 'Musk Mallow, Cashmerean, Sandalwood, African Leather',
      longevity: '12-16 Hours',
      gender: 'Unisex',
      type: 'Extrait de Parfum',
      quantity: '100ml',
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 21,
  },

  // ── MISTS ─────────────────────────────────────────────────────────────────

  {
    id: 'prod-mist-001',
    title: 'Rose Saffron Mist',
    handle: 'rose-saffron-mist',
    price: 89,
    compareAtPrice: null,
    category: 'mists',
    categories: ['mists', 'all'],
    tags: ['mist', 'floral', 'rose'],
    images: [
      'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618',
    ],
    description:
      'A delicate, luminous mist blending the romance of Taif rose with warm Iranian saffron. Light enough for daily wear, yet enchanting enough to turn heads across any room. Perfect layered over your favourite Oud Nomad perfume or worn alone for an effortless, feminine allure.',
    bodyHtml: '',
    features: {
      topNotes: 'Taif Rose, Iranian Saffron, Pink Pepper',
      middleNotes: 'Bulgarian Rose, Jasmine, Peony',
      baseNotes: 'White Musk, Amber, Sandalwood',
      longevity: '4-6 Hours',
      gender: 'Unisex',
      type: 'Body & Hair Mist',
      quantity: '200ml',
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 18,
  },

  {
    id: 'prod-mist-002',
    title: 'Oud Noir Mist',
    handle: 'oud-noir-mist',
    price: 95,
    compareAtPrice: null,
    category: 'mists',
    categories: ['mists', 'all'],
    tags: ['mist', 'oud', 'dark'],
    images: [
      'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Voice_of_the_soul_1.jpg?v=1692390886',
    ],
    description:
      'Dark, smoky, and mysteriously captivating — Oud Noir Mist is a lightweight interpretation of the classic Arabian oud experience. Frankincense and smoky agarwood open the composition, transitioning to warm amber and spiced vanilla. Ideal for evenings, travel, and layering over your signature fragrance.',
    bodyHtml: '',
    features: {
      topNotes: 'Agarwood (Oud), Frankincense, Black Pepper',
      middleNotes: 'Amber, Labdanum, Vetiver',
      baseNotes: 'Smoky Musk, Dark Vanilla, Patchouli',
      longevity: '4-6 Hours',
      gender: 'Unisex',
      type: 'Body & Hair Mist',
      quantity: '200ml',
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 22,
  },

  {
    id: 'prod-mist-003',
    title: 'Citrus Bloom Mist',
    handle: 'citrus-bloom-mist',
    price: 79,
    compareAtPrice: null,
    category: 'mists',
    categories: ['mists', 'all'],
    tags: ['mist', 'citrus', 'fresh'],
    images: [
      'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Nadeem_1.jpg?v=1692390847',
    ],
    description:
      'Bright, airy, and instantly refreshing — Citrus Bloom Mist opens with a sparkling burst of bergamot, lemon zest, and grapefruit, blooming into a heart of white jasmine and neroli. A clean, warm base of cedarwood and soft musk makes this the ultimate everyday companion for the GCC climate.',
    bodyHtml: '',
    features: {
      topNotes: 'Bergamot, Lemon Zest, Grapefruit',
      middleNotes: 'White Jasmine, Neroli, Lily of the Valley',
      baseNotes: 'Cedarwood, Soft Musk, Light Amber',
      longevity: '3-5 Hours',
      gender: 'Unisex',
      type: 'Body & Hair Mist',
      quantity: '200ml',
    },
    inStock: true,
    rating: 4.7,
    reviewCount: 15,
  },

];
