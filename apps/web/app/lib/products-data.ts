// Oud Nomad — Curated product catalogue (GCC / AED)
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
    description: 'Explore the complete universe of Oud Nomad — luxury perfumes and refreshing creations, crafted for the GCC.',
    count: 3,
  },
  {
    handle: 'perfumes',
    title: 'Perfumes',
    description: 'Intense, long-lasting Extrait de Parfum blends crafted with rare botanicals, precious resins, and warm musks.',
    count: 3,
  },
  {
    handle: 'mists',
    title: 'Mists',
    description: 'Light, refreshing body and hair mists — the perfect everyday scent for warm GCC days and effortless layering.',
    count: 0,
  },
];

// ── Products — Cedre, Selene, Ivoire ─────────────────────────────────────────
export const OUD_PRODUCTS: OudProduct[] = [
  {
    id: 'prod-cedre',
    title: 'Cedre',
    handle: 'cedre',
    price: 495,
    compareAtPrice: null,
    category: 'perfumes',
    categories: ['perfumes', 'all'],
    tags: ['perfume', 'warm', 'sweet', 'sensual', 'gourmand', 'luxurious', 'vanilla', 'honey', 'amber'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'A warm, indulgent fragrance that opens with the soft sweetness of vanilla and honey, unfolding into a rich amber heart. Caramel and white musk settle into a smooth, sensual base, leaving behind a lingering trail that feels warm, comforting and quietly luxurious.',
    bodyHtml: '<p>A warm, indulgent fragrance that opens with the soft sweetness of vanilla and honey, unfolding into a rich amber heart. Caramel and white musk settle into a smooth, sensual base, leaving behind a lingering trail that feels warm, comforting and quietly luxurious.</p>',
    features: {
      topNotes: 'Vanilla, Honey',
      middleNotes: 'Amber',
      baseNotes: 'Caramel, White Musk',
      longevity: '14-16 Hours',
      gender: 'Unisex',
      type: 'Extrait de Parfum',
      quantity: '100ml',
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 24,
  },
  {
    id: 'prod-selene',
    title: 'Selene',
    handle: 'selene',
    price: 495,
    compareAtPrice: null,
    category: 'perfumes',
    categories: ['perfumes', 'all'],
    tags: ['perfume', 'floral', 'elegant', 'sophisticated', 'soft', 'refined', 'lavender', 'jasmine', 'musk'],
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'An elegant floral fragrance balanced with soft musk and aromatic lavender. Orchid and jasmine create a refined floral heart, while tonka bean and vetiver add depth and warmth to the dry-down. A sophisticated scent that moves effortlessly from fresh and delicate to warm and grounded.',
    bodyHtml: '<p>An elegant floral fragrance balanced with soft musk and aromatic lavender. Orchid and jasmine create a refined floral heart, while tonka bean and vetiver add depth and warmth to the dry-down. A sophisticated scent that moves effortlessly from fresh and delicate to warm and grounded.</p>',
    features: {
      topNotes: 'Lavender, Musk',
      middleNotes: 'Orchid, Jasmine',
      baseNotes: 'Tonka Bean, Vetiver',
      longevity: '12-16 Hours',
      gender: 'Unisex',
      type: 'Extrait de Parfum',
      quantity: '100ml',
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 29,
  },
  {
    id: 'prod-ivoire',
    title: 'Ivoire',
    handle: 'ivoire',
    price: 495,
    compareAtPrice: null,
    category: 'perfumes',
    categories: ['perfumes', 'all'],
    tags: ['perfume', 'soft', 'creamy', 'sweet', 'clean', 'sensual', 'powder', 'white honey', 'coconut'],
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'A soft, creamy fragrance built around the delicate sweetness of powder and white honey. As it settles, creamy coconut meets clean musk, creating a smooth and comforting trail with an understated sense of luxury.',
    bodyHtml: '<p>A soft, creamy fragrance built around the delicate sweetness of powder and white honey. As it settles, creamy coconut meets clean musk, creating a smooth and comforting trail with an understated sense of luxury.</p>',
    features: {
      topNotes: 'Sweet Powder',
      middleNotes: 'White Honey',
      baseNotes: 'Coconut, Clean Musk',
      longevity: '12-14 Hours',
      gender: 'Unisex',
      type: 'Extrait de Parfum',
      quantity: '100ml',
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 19,
  },
];

