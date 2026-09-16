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
    id: 'malaki',
    name: 'Malaki Oud',
    price: 'AED 650',
    story: "Our founder's original blend, unchanged since 1998.",
    notes: {
      top: 'saffron & bergamot',
      heart: 'rose & oud',
      base: 'amber & musk',
    },
    imageSide: 'left',
    image: {
      src: 'https://picsum.photos/seed/malaki-oud-bottle/1200/900',
      alt: 'Malaki Oud — dark glass bottle on marble',
    },
  },
  {
    id: 'noor',
    name: 'Noor Attar',
    price: 'AED 420',
    story: 'Distilled in small batches and rested in cedarwood caskets.',
    notes: {
      top: 'orange blossom & cardamom',
      heart: 'jasmine & oud',
      base: 'sandalwood & resin',
    },
    imageSide: 'right',
    image: {
      src: 'https://picsum.photos/seed/noor-attar-stilllife/1200/900',
      alt: 'Noor Attar — floral attar still life',
    },
  },
  {
    id: 'dusk',
    name: 'Dusk Mukhallat',
    price: 'AED 580',
    story: 'Layered for evening — warm, resinous, and slow to fade.',
    notes: {
      top: 'pink pepper & citrus',
      heart: 'oud & iris',
      base: 'ambergris accord & musk',
    },
    imageSide: 'left',
    image: {
      src: 'https://picsum.photos/seed/dusk-mukhallat-bottle/1200/900',
      alt: 'Dusk Mukhallat — warm amber fragrance bottle',
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
    id: 'malaki-extrait',
    name: 'Malaki Extrait No. 1',
    concentration: 'Extrait de Parfum — 38% Pure Oil',
    volume: '100ml / 3.4 fl. oz.',
    price: 'AED 790',
    accords: 'Aged Assam Oud · Saffron Stigmas · Ambergris',
    description: 'Aged in charred oak casks for seven cycles. Our crowning house blend unchanged since our founding atelier in 1998.',
    notes: {
      top: 'Kashmir Saffron, Calabrian Bergamot, Pink Peppercorn',
      heart: 'Taif Rose Petals, Smoked Birch, 25-Year Assam Agarwood',
      base: 'Grey Ambergris, Bourbon Vanilla, Black Leather Accord',
    },
    auraColor: 'rgba(212, 175, 55, 0.25)',
    image: {
      src: 'https://picsum.photos/seed/malaki-oud-bottle/900/1100',
      alt: 'Malaki Extrait No. 1 in faceted dark obsidian glass',
    },
  },
  {
    id: 'noor-attar',
    name: 'Noor Pure Attar',
    concentration: 'Pure Concentrated Perfume Oil — 100% Non-Alcoholic',
    volume: '12ml / 0.4 fl. oz.',
    price: 'AED 540',
    accords: 'Orange Blossom · Mysore Sandalwood · White Musk',
    description: 'Distilled drop-by-drop through copper alembics, captured over a base of sustainably harvested royal Mysore sandalwood.',
    notes: {
      top: 'Damascene Orange Blossom, Green Cardamom, Wild Honey',
      heart: 'Nocturnal Jasmine Grandiflorum, Frankincense tears',
      base: 'Vintage Mysore Sandalwood, Cashmere Resin, White Musk',
    },
    auraColor: 'rgba(14, 79, 64, 0.35)',
    image: {
      src: 'https://picsum.photos/seed/noor-attar-stilllife/900/1100',
      alt: 'Noor Pure Attar in crystal cut flacon with gold dip-wand',
    },
  },
  {
    id: 'dusk-mukhallat',
    name: 'Dusk Mukhallat Imperiale',
    concentration: 'Extrait de Parfum — 32% Concentration',
    volume: '100ml / 3.4 fl. oz.',
    price: 'AED 680',
    accords: 'Smoked Iris · Trat Agarwood · Spiced Amber',
    description: 'Formulated for twilight rituals. An intoxicating transition from cool violet iris to warm smoldering cambodian resin.',
    notes: {
      top: 'Orris Butter, Cardamom Pods, Red Pomegranate',
      heart: 'Wild Trat Oud Smoke, Black Tea Leaves, Cinnamon Bark',
      base: 'Smoked Benzoin, Labdanum, Cistus Resin, Cedarwood',
    },
    auraColor: 'rgba(110, 51, 46, 0.35)',
    image: {
      src: 'https://picsum.photos/seed/dusk-mukhallat-bottle/900/1100',
      alt: 'Dusk Mukhallat Imperiale heavy crystal flacon',
    },
  },
  {
    id: 'royal-cambodi',
    name: 'Royal Cambodi Reserve',
    concentration: 'Pure Wild Harvest Dehn Al Oud — 100% Pure',
    volume: '6ml / 0.2 fl. oz.',
    price: 'AED 1,250',
    accords: 'Koh Kong Wild Aquilaria · Sweet Hay · Tobacco Leaf',
    description: 'Harvested from century-old wild infected trees in the Koh Kong mountain ranges. A sacred collector’s artifact.',
    notes: {
      top: 'Ancient Woodbark, Dry Apricot, Honeyed Tobacco',
      heart: 'Sweet Balsam, Wild Animalic Leather, Rich Peat',
      base: 'Dense Resinoid Smoke, Vintage Dark Caramel, Precious Earth',
    },
    auraColor: 'rgba(212, 175, 55, 0.4)',
    image: {
      src: 'https://picsum.photos/seed/royal-cambodi-oud/900/1100',
      alt: 'Royal Cambodi Reserve in heavy antique brass-filigree vial',
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