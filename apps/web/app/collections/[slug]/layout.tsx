import type { Metadata } from 'next';

const COLLECTION_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  all: {
    title: 'All Fragrances | Oud Nomad Collection',
    description:
      'Explore the complete Oud Nomad fragrance universe. Luxury Extrait de Parfum and refreshing mists crafted from Taif rose, Kashmir saffron and aged Assamese oud. Free shipping to UAE and GCC.',
    keywords: ['oud perfume collection', 'buy oud perfume UAE', 'luxury perfume Dubai', 'Oud Nomad shop', 'oriental perfume women'],
  },
  perfumes: {
    title: 'Luxury Oud Perfumes for Women | Oud Nomad',
    description:
      'Intense Extrait de Parfum blends built around rare agarwood, Taif damask rose and Kashmir saffron. Engineered for 45C desert heat. Long-lasting, no dilution.',
    keywords: ['luxury oud perfume women', 'extrait de parfum oud', 'best oud perfume UAE', 'long lasting perfume heat', 'Taif rose perfume'],
  },
  mists: {
    title: 'Luxury Body and Hair Mists | Oud Nomad',
    description:
      'Light, refreshing oud body and hair mists for everyday luxury. Perfect for warm GCC days and effortless fragrance layering.',
    keywords: ['oud body mist', 'hair mist UAE', 'oud mist women', 'light oud fragrance', 'GCC body mist'],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.toLowerCase();
  const seo = COLLECTION_SEO[key] || COLLECTION_SEO['all'];
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: 'https://oudnomaddubai.com/collections/' + key },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: 'https://oudnomaddubai.com/collections/' + key,
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: seo.title }],
    },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description, images: ['/og-image.jpg'] },
  };
}

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}