'use client';

import React from 'react';

// ── Generic JSON-LD injector ────────────────────────────────────────────────
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

// ── Product schema ──────────────────────────────────────────────────────────
export function generateProductJsonLd(product: {
  name: string;
  description: string;
  images: string[];
  price: number;
  currency?: string;
  slug: string;
  sku?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) => (img.startsWith('http') ? img : 'https://oudnomaddubai.com' + img)),
    description: product.description,
    sku: product.sku || product.slug,
    brand: { '@type': 'Brand', name: product.brand || 'Oud Nomad' },
    offers: {
      '@type': 'Offer',
      url: 'https://oudnomaddubai.com/products/' + product.slug,
      priceCurrency: product.currency || 'AED',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      seller: { '@type': 'Organization', name: 'Oud Nomad' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'AED' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'] },
        deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' }, transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 5, unitCode: 'DAY' } },
      },
    },
    ...(product.rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
        bestRating: '5',
        worstRating: '1',
      },
    } : {}),
  };
}

// ── Breadcrumb schema ───────────────────────────────────────────────────────
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ── FAQ schema ──────────────────────────────────────────────────────────────
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

// ── ItemList (Collection PLP) schema ───────────────────────────────────────
export function generateItemListJsonLd(items: Array<{ name: string; url: string; image?: string; price?: number; currency?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

// ── Review schema ───────────────────────────────────────────────────────────
export function generateReviewJsonLd(review: {
  author: string;
  rating: number;
  body: string;
  datePublished?: string;
  productName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: { '@type': 'Person', name: review.author },
    reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: '5', worstRating: '1' },
    reviewBody: review.body,
    datePublished: review.datePublished || new Date().toISOString().split('T')[0],
    itemReviewed: { '@type': 'Product', name: review.productName, brand: { '@type': 'Brand', name: 'Oud Nomad' } },
  };
}

// ── Organization schema ─────────────────────────────────────────────────────
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://oudnomaddubai.com/#organization',
    name: 'Oud Nomad',
    legalName: 'Oud Nomad Parfums FZ LLC',
    url: 'https://oudnomaddubai.com',
    logo: { '@type': 'ImageObject', url: 'https://oudnomaddubai.com/camelfinallogo-transparent.png', width: 200, height: 80 },
    description: 'A Dubai-born luxury fragrance house for women who belong between worlds.',
    foundingDate: '2022',
    areaServed: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'GB', 'US', 'IN'],
    sameAs: ['https://instagram.com/oudnomad', 'https://facebook.com/oudnomad', 'https://tiktok.com/@oudnomad'],
  };
}

// ── Local Business schema (for GCC region) ─────────────────────────────────
export function generateLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Oud Nomad',
    image: 'https://oudnomaddubai.com/og-image.jpg',
    url: 'https://oudnomaddubai.com',
    telephone: '+971585719731',
    address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressRegion: 'Dubai', addressCountry: 'AE' },
    geo: { '@type': 'GeoCoordinates', latitude: 25.2048, longitude: 55.2708 },
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '09:00', closes: '23:00' },
    priceRange: 'AED 200 - AED 1200',
    currenciesAccepted: 'AED, USD, GBP',
    paymentAccepted: 'Credit Card, Debit Card, Cash on Delivery',
  };
}