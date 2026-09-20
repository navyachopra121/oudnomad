'use client';

import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function generateProductJsonLd(product: {
  name: string;
  description: string;
  images: string[];
  price: number;
  currency?: string;
  slug: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) => (img.startsWith('http') ? img : `https://oudnomad.com${img}`)),
    description: product.description,
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'OudNomad',
    },
    offers: {
      '@type': 'Offer',
      url: `https://oudnomad.com/products/${product.slug}`,
      priceCurrency: product.currency || 'USD',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'OudNomad Artisanal Perfumery',
      },
    },
    ...(product.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 1,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OudNomad',
    legalName: 'OudNomad Parfums FZ LLC',
    url: 'https://oudnomad.com',
    logo: 'https://oudnomad.com/images/logo.png',
    description: 'High luxury artisanal wild agarwood & rare botanical extraits',
    sameAs: [
      'https://instagram.com/oudnomad',
      'https://facebook.com/oudnomad',
    ],
  };
}
