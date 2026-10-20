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

// GCC Regional Pricebook — admin-set exact prices per country (VAT-inclusive)
export interface RegionalPricebook {
  AED?: number; // 🇦🇪 UAE (5% VAT included)
  SAR?: number; // 🇸🇦 Saudi Arabia (15% VAT included)
  KWD?: number; // 🇰🇼 Kuwait (Tax-Free)
  QAR?: number; // 🇶🇦 Qatar (Tax-Free)
  OMR?: number; // 🇴🇲 Oman (5% VAT included)
  BHD?: number; // 🇧🇭 Bahrain (10% VAT included)
}

export interface OudProduct {
  id: string;
  title: string;
  handle: string;
  tagline?: string;
  price: number;            // Base price in AED (always)
  compareAtPrice: number | null;
  regionalPrices: RegionalPricebook; // Admin-configured per-country GCC prices
  category: string;
  categories: string[];
  tags: string[];
  images: string[];
  description: string;
  bodyHtml: string;
  olfactoryStory?: string;
  moodAndCharacter?: string;
  moods?: string[];
  signature?: string;
  philosophy?: string;
  ingredients?: string;
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

export const OUD_NOMAD_PHILOSOPHY = {
  title: 'THE OUD NOMAD PHILOSOPHY',
  tagline: 'Born in Dubai, inspired by the spirit of exploration.',
  description:
    'Oud Nomad approaches fragrance as a personal signature — an invisible expression of presence, memory and individuality. Each composition invites a different encounter with the senses, designed to be experienced rather than simply worn.',
  luxuryStatement: 'Because true luxury does not demand attention.',
  signatureLine: 'It leaves a trace.',
  signatureArabic: 'بَل تَتْرُكُ أَثَراً',
};

// ── Collections ───────────────────────────────────────────────────────────────
export const OUD_COLLECTIONS: CollectionMeta[] = [
  {
    handle: 'all',
    title: 'All Fragrances',
    description: 'Explore the complete universe of Oud Nomad — luxury perfumes and refreshing creations, crafted for the GCC.',
    count: 3,
  },
  {
    handle: 'mists',
    title: 'Mists',
    description: 'Light, refreshing body and hair mists — the perfect everyday scent for warm GCC days and effortless layering.',
    count: 3,
  },
  {
    handle: 'perfumes',
    title: 'Perfumes',
    description: 'Intense, long-lasting Extrait de Parfum blends crafted with rare botanicals, precious resins, and warm musks.',
    count: 0,
  },
];

// ── GCC Default Pricebook ─────────────────────────────────────────────────────
// VAT-inclusive, psychologically rounded luxury price points.
// Admin can override per product/variant in the admin panel.
export const GCC_DEFAULT_PRICEBOOK: RegionalPricebook = {
  AED: 495, // UAE — 5% VAT included
  SAR: 510, // KSA — 15% VAT included
  KWD: 42,  // Kuwait — tax-free
  QAR: 505, // Qatar — tax-free
  OMR: 52,  // Oman — 5% VAT included
  BHD: 51,  // Bahrain — 10% VAT included
};

// ── Products (Mists Collection) — Cèdre, Sélène, Ivoire ──────────────────────
export const OUD_PRODUCTS: OudProduct[] = [
  {
    id: 'prod-cedre',
    title: 'Cèdre',
    handle: 'cedre',
    tagline: 'A GOLDEN HOUR, HELD IN SCENT.',
    price: 495,
    compareAtPrice: null,
    regionalPrices: { ...GCC_DEFAULT_PRICEBOOK },
    category: 'mists',
    categories: ['mists', 'all'],
    tags: ['mist', 'mists', 'warm', 'sensual', 'gourmand', 'opulent', 'golden hour', 'vanilla', 'honey', 'amber', 'caramel', 'white musk'],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'There is a moment when the desert light turns to gold, when warmth settles into the air and the world grows quiet. Cèdre captures that fleeting hour. Honeyed vanilla opens with a soft, inviting sweetness, unfolding into the golden depth of amber. Caramel and white musk linger on the skin, leaving behind a trail that feels warm, intimate and quietly magnetic. A fragrance of enveloping warmth, composed with understated sensuality.',
    bodyHtml:
      '<p>There is a moment when the desert light turns to gold, when warmth settles into the air and the world grows quiet.</p><p>Cèdre captures that fleeting hour. Honeyed vanilla opens with a soft, inviting sweetness, unfolding into the golden depth of amber. Caramel and white musk linger on the skin, leaving behind a trail that feels warm, intimate and quietly magnetic.</p><p>A fragrance of enveloping warmth, composed with understated sensuality.</p>',
    olfactoryStory:
      'There is a moment when the desert light turns to gold, when warmth settles into the air and the world grows quiet.\n\nCèdre captures that fleeting hour. Honeyed vanilla opens with a soft, inviting sweetness, unfolding into the golden depth of amber. Caramel and white musk linger on the skin, leaving behind a trail that feels warm, intimate and quietly magnetic.\n\nA fragrance of enveloping warmth, composed with understated sensuality.',
    moodAndCharacter: 'Warm · Sensual · Gourmand · Opulent',
    moods: ['Warm', 'Sensual', 'Gourmand', 'Opulent'],
    signature: 'Golden warmth. A lingering presence.',
    philosophy:
      'Born in Dubai, inspired by the spirit of exploration. Oud Nomad approaches fragrance as a personal signature — an invisible expression of presence, memory and individuality. Each composition invites a different encounter with the senses, designed to be experienced rather than simply worn. Because true luxury does not demand attention. It leaves a trace.',
    features: {
      topNotes: 'Vanilla, Honey',
      middleNotes: 'Amber',
      baseNotes: 'Caramel, White Musk',
      longevity: '8 Hours',
      gender: 'Unisex',
      type: 'Fragrance Mist',
      quantity: '100ml',
    },
    ingredients: 'Alcohol Denat. 80%, Fragrance (Parfum) 16%, D.M. Water 4%.',
    inStock: true,
    rating: 4.9,
    reviewCount: 24,
  },
  {
    id: 'prod-selene',
    title: 'Sélène',
    handle: 'selene',
    tagline: 'THE SILENCE BEFORE MIDNIGHT.',
    price: 495,
    compareAtPrice: null,
    regionalPrices: { ...GCC_DEFAULT_PRICEBOOK },
    category: 'mists',
    categories: ['mists', 'all'],
    tags: ['mist', 'mists', 'floral', 'serene', 'sophisticated', 'refined', 'midnight', 'lavender', 'musk', 'orchid', 'jasmine', 'tonka bean', 'vetiver'],
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'As the city slips into night, its energy gives way to a more intimate kind of elegance. Sélène opens with the aromatic calm of lavender and musk, revealing a delicate heart of orchid and jasmine. Tonka bean lends a tender warmth, while vetiver grounds the composition in an earthy, sophisticated finish. Floral yet composed, Sélène is an ode to the beauty of restraint — a quiet signature that reveals itself gradually.',
    bodyHtml:
      '<p>As the city slips into night, its energy gives way to a more intimate kind of elegance.</p><p>Sélène opens with the aromatic calm of lavender and musk, revealing a delicate heart of orchid and jasmine. Tonka bean lends a tender warmth, while vetiver grounds the composition in an earthy, sophisticated finish.</p><p>Floral yet composed, Sélène is an ode to the beauty of restraint — a quiet signature that reveals itself gradually.</p>',
    olfactoryStory:
      'As the city slips into night, its energy gives way to a more intimate kind of elegance.\n\nSélène opens with the aromatic calm of lavender and musk, revealing a delicate heart of orchid and jasmine. Tonka bean lends a tender warmth, while vetiver grounds the composition in an earthy, sophisticated finish.\n\nFloral yet composed, Sélène is an ode to the beauty of restraint — a quiet signature that reveals itself gradually.',
    moodAndCharacter: 'Floral · Serene · Sophisticated · Refined',
    moods: ['Floral', 'Serene', 'Sophisticated', 'Refined'],
    signature: 'Quiet elegance. An unforgettable afterglow.',
    philosophy:
      'Born in Dubai, inspired by the spirit of exploration. Oud Nomad approaches fragrance as a personal signature — an invisible expression of presence, memory and individuality. Each composition invites a different encounter with the senses, designed to be experienced rather than simply worn. Because true luxury does not demand attention. It leaves a trace.',
    features: {
      topNotes: 'Lavender, Musk',
      middleNotes: 'Orchid, Jasmine',
      baseNotes: 'Tonka Bean, Vetiver',
      longevity: '8 Hours',
      gender: 'Unisex',
      type: 'Fragrance Mist',
      quantity: '100ml',
    },
    ingredients: 'Alcohol Denat. 80%, Fragrance (Parfum) 16%, D.M. Water 4%.',
    inStock: true,
    rating: 4.9,
    reviewCount: 29,
  },
  {
    id: 'prod-ivoire',
    title: 'Ivoire',
    handle: 'ivoire',
    tagline: 'THE LUXURY OF SOFTNESS.',
    price: 495,
    compareAtPrice: null,
    regionalPrices: { ...GCC_DEFAULT_PRICEBOOK },
    category: 'mists',
    categories: ['mists', 'all'],
    tags: ['mist', 'mists', 'soft', 'creamy', 'luminous', 'sensual', 'powder', 'white honey', 'coconut', 'musk'],
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
    ],
    description:
      'Some of the most captivating things are never announced. They are felt. Ivoire opens like a whisper of powdery sweetness, softened by the golden delicacy of white honey. Coconut introduces a creamy warmth, while musk settles close to the skin, creating a smooth and intimate finish. Tender without being fragile, indulgent without excess, Ivoire is an exploration of softness in its most refined form.',
    bodyHtml:
      '<p>Some of the most captivating things are never announced. They are felt.</p><p>Ivoire opens like a whisper of powdery sweetness, softened by the golden delicacy of white honey. Coconut introduces a creamy warmth, while musk settles close to the skin, creating a smooth and intimate finish.</p><p>Tender without being fragile, indulgent without excess, Ivoire is an exploration of softness in its most refined form.</p>',
    olfactoryStory:
      'Some of the most captivating things are never announced. They are felt.\n\nIvoire opens like a whisper of powdery sweetness, softened by the golden delicacy of white honey. Coconut introduces a creamy warmth, while musk settles close to the skin, creating a smooth and intimate finish.\n\nTender without being fragile, indulgent without excess, Ivoire is an exploration of softness in its most refined form.',
    moodAndCharacter: 'Soft · Creamy · Luminous · Sensual',
    moods: ['Soft', 'Creamy', 'Luminous', 'Sensual'],
    signature: 'An intimate softness. A lasting impression.',
    philosophy:
      'Born in Dubai, inspired by the spirit of exploration. Oud Nomad approaches fragrance as a personal signature — an invisible expression of presence, memory and individuality. Each composition invites a different encounter with the senses, designed to be experienced rather than simply worn. Because true luxury does not demand attention. It leaves a trace.',
    features: {
      topNotes: 'Sweet Powder',
      middleNotes: 'White Honey',
      baseNotes: 'Coconut, Musk',
      longevity: '8 Hours',
      gender: 'Unisex',
      type: 'Fragrance Mist',
      quantity: '100ml',
    },
    ingredients: 'Alcohol Denat. 80%, Fragrance (Parfum) 16%, D.M. Water 4%.',
    inStock: true,
    rating: 4.8,
    reviewCount: 19,
  },
];
