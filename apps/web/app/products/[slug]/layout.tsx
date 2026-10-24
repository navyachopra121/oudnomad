import type { Metadata } from 'next';
import { StoreApi } from '../../store-api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug || '';
  let product = null;
  if (slug) {
    try {
      product = await StoreApi.getProductBySlug(slug);
    } catch (_) {}
  }

  if (!product) {
    return {
      title: 'Oud Perfume | Oud Nomad',
      description: 'Discover luxury oud perfumes crafted in Dubai. Extrait de Parfum made from Taif rose, Kashmir saffron and aged Assamese oud.',
    };
  }

  const title = product.name + ' | Oud Nomad';
  const description = product.description?.slice(0, 160) ||
    'A luxury oud fragrance crafted in Dubai. Built to endure heat, not dissolve in it.';
  const rawImg = product.images?.[0];
  const image = (typeof rawImg === 'string' && rawImg.length > 0 ? rawImg : (rawImg as any)?.url) || '/og-image.jpg';
  const price = typeof product.price === 'number' && !isNaN(product.price) ? product.price : 495;
  const currency = product.currency || 'AED';
  const canonical = 'https://oudnomaddubai.com/products/' + slug;
  const cat = typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'perfumes';

  return {
    title,
    description,
    keywords: [
      product.name,
      'oud perfume',
      'luxury fragrance Dubai',
      cat,
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
          url: image.startsWith('http') ? image : 'https://oudnomaddubai.com' + image,
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
      images: [image.startsWith('http') ? image : 'https://oudnomaddubai.com' + image],
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