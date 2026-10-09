// NOTE: image `src` values below use https://picsum.photos as stable placeholders.
// Picsum generates a consistent image per `seed` value (no dependency on a specific
// photo ID existing), so these cannot 404 the way a guessed Unsplash photo ID can.
// Swap each `src` for real product/lifestyle photography as it becomes available —
// the `seed` names are just descriptive labels, not meaningful beyond that.

export type SignatureProduct = {
  id: string;
  name: string;
  price: string;
  story: string;
  notes: { top: string; heart: string; base: string };
  imageSide: 'left' | 'right';
  image: { src: string; alt: string };
};

export const SIGNATURE_PRODUCTS: SignatureProduct[] = [
  {
    id: 'cedre',
    name: 'Cedre',
    price: 'AED 495',
    story: 'A warm blend of vanilla, honey, amber and soft musk.',
    notes: {
      top: 'vanilla & honey',
      heart: 'rich amber',
      base: 'caramel & white musk',
    },
    imageSide: 'left',
    image: {
      src: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
      alt: 'Cedre Extrait de Parfum flacon',
    },
  },
  {
    id: 'selene',
    name: 'Selene',
    price: 'AED 495',
    story: 'A sophisticated floral blend with lavender, jasmine, tonka bean and vetiver.',
    notes: {
      top: 'lavender & musk',
      heart: 'orchid & jasmine',
      base: 'tonka bean & vetiver',
    },
    imageSide: 'right',
    image: {
      src: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80',
      alt: 'Selene Extrait de Parfum flacon',
    },
  },
  {
    id: 'ivoire',
    name: 'Ivoire',
    price: 'AED 495',
    story: 'A creamy blend of sweet powder, white honey, coconut and musk.',
    notes: {
      top: 'sweet powder',
      heart: 'white honey',
      base: 'coconut & clean musk',
    },
    imageSide: 'left',
    image: {
      src: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1200&q=80',
      alt: 'Ivoire Extrait de Parfum flacon',
    },
  },
];

export type VitrineFlacon = {
  id: string;
  name: string;
  concentration: string;
  volume: string;
  price: string;
  accords: string;
  description: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  auraColor: string;
  image: { src: string; alt: string };
};

export const VITRINE_MASTERPIECES: VitrineFlacon[] = [
  {
    id: 'cedre',
    name: 'Cedre Extrait',
    concentration: 'Extrait de Parfum — 35% Pure Oil',
    volume: '100ml / 3.4 fl. oz.',
    price: 'AED 495',
    accords: 'Warm Vanilla · Rich Amber · Spiced Honey · White Musk',
    description: 'A warm, indulgent fragrance that opens with the soft sweetness of vanilla and honey, unfolding into a rich amber heart. Caramel and white musk settle into a smooth, sensual base.',
    notes: {
      top: 'Vanilla, Honey Nectar, Golden Spices',
      heart: 'Resinous Amber, Sweet Praline',
      base: 'Caramel Accord, Sensual White Musk',
    },
    auraColor: 'rgba(212, 175, 55, 0.3)',
    image: {
      src: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      alt: 'Cedre Extrait in amber crystal flacon',
    },
  },
  {
    id: 'selene',
    name: 'Selene Extrait',
    concentration: 'Extrait de Parfum — 35% Pure Oil',
    volume: '100ml / 3.4 fl. oz.',
    price: 'AED 495',
    accords: 'Aromatic Lavender · Floral Orchid · White Jasmine · Tonka Bean',
    description: 'An elegant floral fragrance balanced with soft musk and aromatic lavender. Orchid and jasmine create a refined floral heart, while tonka bean and vetiver add depth and warmth.',
    notes: {
      top: 'Highland Lavender, Luminous Musk',
      heart: 'Midnight Orchid, Night-blooming Jasmine',
      base: 'Roasted Tonka Bean, Smoky Haitian Vetiver',
    },
    auraColor: 'rgba(138, 120, 190, 0.3)',
    image: {
      src: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
      alt: 'Selene Extrait flacon with nocturnal aura',
    },
  },
  {
    id: 'ivoire',
    name: 'Ivoire Extrait',
    concentration: 'Extrait de Parfum — 35% Pure Oil',
    volume: '100ml / 3.4 fl. oz.',
    price: 'AED 495',
    accords: 'Sweet Powder · White Honey · Creamy Coconut · Clean Musk',
    description: 'A soft, creamy fragrance built around the delicate sweetness of powder and white honey. As it settles, creamy coconut meets clean musk, creating a smooth and comforting trail.',
    notes: {
      top: 'Delicate Sweet Powder, Rice Blossom',
      heart: 'Pure White Honey, Sunlit Coconut Milk',
      base: 'Velvet Clean Musk, Sheer Sandalwood',
    },
    auraColor: 'rgba(240, 230, 210, 0.3)',
    image: {
      src: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80',
      alt: 'Ivoire Extrait in frosted porcelain-white flacon',
    },
  },
];


export type RawElement = {
  id: string;
  name: string;
  arabicName: string;
  provenance: string;
  character: string;
  alchemy: string;
  image: { src: string; alt: string };
};

export const RAW_ELEMENTS: RawElement[] = [
  {
    id: 'agarwood',
    name: 'Wild Aquilaria Crassna',
    arabicName: 'دهن العود الملكي',
    provenance: 'Koh Kong & Assam Deep Forest',
    character: 'Deep resinous smoke, sweet balsamic leather, antique woodcasks.',
    alchemy: 'Formed naturally over decades within sacred heartwood. Slow maceration for over 18 months before bottling.',
    image: {
      src: 'https://picsum.photos/seed/raw-agarwood-heartwood/800/800',
      alt: 'Dark resinous wild agarwood heartwood chips',
    },
  },
  {
    id: 'rose-damascena',
    name: 'Taif Highland Rose',
    arabicName: 'ورد الطائف النقي',
    provenance: 'High Altitude Al-Hada Mountains, KSA',
    character: 'Dewy morning petals, honeyed nectar, spicy green stem.',
    alchemy: 'Handpicked at dawn before sunrise burns the precious volatile oils. Hydro-distilled in traditional copper alembics.',
    image: {
      src: 'https://picsum.photos/seed/taif-rose-petals/800/800',
      alt: 'Fresh Taif rose petals bathed in morning light',
    },
  },
  {
    id: 'ambergris',
    name: 'White Floating Ambergris',
    arabicName: 'عنبر الحوت النادر',
    provenance: 'Arabian Sea Coastal Flotsam',
    character: 'Marine warmth, salty skin sensual warmth, radiant diffusion.',
    alchemy: 'Naturally cured by sea salt and relentless desert sun for decades. Creates an eternal, unforgettable trail.',
    image: {
      src: 'https://picsum.photos/seed/ocean-ambergris-rock/800/800',
      alt: 'Naturally cured rare marine ambergris chunk',
    },
  },
  {
    id: 'frankincense',
    name: 'Royal Hojari Frankincense',
    arabicName: 'لبان الحوجري الملكي',
    provenance: 'Dhofar Plateau, Sultanate of Oman',
    character: 'Silver-green resin tears, balsamic citrus, sacred temple smoke.',
    alchemy: 'The highest imperial grade of Boswellia sacra. Yields an ethereal, elevating smoke that purifies the senses.',
    image: {
      src: 'https://picsum.photos/seed/royal-hojari-frankincense/800/800',
      alt: 'Pale green and silver Royal Hojari frankincense tears',
    },
  },
];


export const TRUST_PILLARS = [
  {
    id: 'aged',
    title: 'Hand-aged oud',
    body: 'Aged for months before bottling, never rushed.',
  },
  {
    id: 'sourced',
    title: 'Sourced with care',
    body: 'Direct relationships with growers across the Gulf.',
  },
  {
    id: 'gift',
    title: 'Gift-ready presentation',
    body: 'Every order arrives silk-wrapped, ready to give.',
  },
  {
    id: 'delivery',
    title: 'Complimentary UAE delivery',
    body: 'On orders over AED 300.',
  },
];

export const TESTIMONIALS = [
  {
    id: '1',
    quote:
      'Walking into the store felt like stepping into a different world — the website is the first time I\'ve felt that online too.',
    author: 'Sara',
    city: 'Abu Dhabi',
  },
  {
    id: '2',
    quote: 'The oud opens slowly, like the ritual they describe. Nothing loud, everything considered.',
    author: 'Fatima',
    city: 'Dubai',
  },
  {
    id: '3',
    quote: 'Gift presentation alone tells you this house respects the craft. The scent stayed with me all evening.',
    author: 'Khalid',
    city: 'Sharjah',
  },
  {
    id: '4',
    quote: 'Finally a fragrance house that feels like the boutique — not a discount shelf online.',
    author: 'Layla',
    city: 'Riyadh',
  },
];

export const GALLERY_ITEMS = [
  {
    id: 'g1',
    label: 'Store ambiance',
    image: {
      src: 'https://picsum.photos/seed/oud-store-ambiance/800/800',
      alt: 'Warm boutique interior with soft lighting',
    },
  },
  {
    id: 'g2',
    label: 'Bottle still life',
    image: {
      src: 'https://picsum.photos/seed/oud-bottle-stilllife/800/800',
      alt: 'Perfume bottles arranged as still life',
    },
  },
  {
    id: 'g3',
    label: 'Bakhoor ritual',
    image: {
      src: 'https://picsum.photos/seed/oud-bakhoor-smoke/800/800',
      alt: 'Incense smoke curling from bakhoor',
    },
  },
  {
    id: 'g4',
    label: 'Atelier detail',
    image: {
      src: 'https://picsum.photos/seed/oud-atelier-detail/800/800',
      alt: 'Hands blending fragrance ingredients',
    },
  },
  {
    id: 'g5',
    label: 'Evening light',
    image: {
      src: 'https://picsum.photos/seed/oud-evening-desert/800/800',
      alt: 'Golden evening light over desert landscape',
    },
  },
  {
    id: 'g6',
    label: 'Community moment',
    image: {
      src: 'https://picsum.photos/seed/oud-community-moment/800/800',
      alt: 'Friends sharing a fragrance moment',
    },
  },
];