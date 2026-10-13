import type { Metadata } from 'next';
import { StoreApi } from '../../store-api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let product = null;
  try {
    product = await StoreApi.getProductBySlug(slug);
  } catch (_) {}

  if (!product) {
    return {
      title: 'Oud Perfume | Oud Nomad',
      description: 'Discover luxury oud perfumes crafted in Dubai. Extrait de Parfum made from Taif rose, Kashmir saffron and aged Assamese oud.',
    };
  }

  const title = product.name + ' | Oud Nomad';
  const description = product.description?.slice(0, 160) ||
    'A luxury oud fragrance crafted in Dubai. Built to endure heat, not dissolve in it.';
  const image = product.images?.[0] || '/og-image.jpg';
  const price = product.price;
  const currency = product.currency || 'AED';
  const canonical = 'https://oudnomad.com/products/' + slug;

  return {
    title,
    description,
    keywords: [
      product.name,
      'oud perfume',
      'luxury fragrance Dubai',
      product.category || 'extrait de parfum',
      'Oud Nomad',
      'buy oud perfume',
    ].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: image.startsWith('http') ? image : 'https://oudnomad.com' + image,
          width: 1200,
          height: 630,
          alt: product.name + ' - Oud Nomad',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : 'https://oudnomad.com' + image],
    },
    other: {
      'product:price:amount': String(price),
      'product:price:currency': currency,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}