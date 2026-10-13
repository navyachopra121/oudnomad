import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Oud Nomad | A Fragrance House Born Between Two Worlds',
  description:
    'Oud Nomad was born when a woman moved from Amritsar to Dubai and found no perfume that understood her. Discover the story behind the fragrance house built for women who belong everywhere.',
  keywords: [
    'about Oud Nomad',
    'luxury perfume brand story',
    'Dubai fragrance house',
    'founder story perfume',
    'Amritsar Dubai fragrance',
    'women oud perfume brand',
    'niche perfume house story',
  ],
  alternates: {
    canonical: 'https://oudnomad.com/about',
  },
  openGraph: {
    title: 'About Oud Nomad | A Fragrance House for Women Between Worlds',
    description:
      'From Amritsar to Dubai — a founder who built the fragrance she could not find. Oud Nomad is crafted for the woman who belongs everywhere and is owned by nowhere.',
    url: 'https://oudnomad.com/about',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Oud Nomad — The Story Behind the Fragrance House',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Oud Nomad | A Fragrance House for Women Between Worlds',
    description:
      'Built from Amritsar roots and Dubai ambition. A fragrance for the woman who belongs everywhere.',
    images: ['/og-image.jpg'],
  },
};
