// Server Component — no 'use client' directive
// Fetches product + recommendations server-side for SSR, passes to client component.

import { notFound } from 'next/navigation';
import { StoreApi } from '../../store-api';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Safely resolve params whether it's a plain object (older Next.js) or a Promise (Next.js 15+)
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug || '';

  if (!slug) notFound();

  // Server-side data fetching — happens before HTML is sent to browser
  let product = null;
  let recommendations: Awaited<ReturnType<typeof StoreApi.getRecommendations>> = [];

  try {
    product = await StoreApi.getProductBySlug(slug);
  } catch (_) {
    // Will render notFound below
  }

  if (!product) {
    notFound();
  }

  try {
    recommendations = await StoreApi.getRecommendations(product.id, product.slug);
    if (!recommendations || recommendations.length === 0) {
      const allRes = await StoreApi.getProducts();
      const allItems = Array.isArray(allRes) ? allRes : allRes?.items || [];
      recommendations = allItems.filter(
        (p: any) => p.slug?.toLowerCase() !== product.slug?.toLowerCase() && p.id !== product.id
      ).slice(0, 4);
    }
  } catch (_) {
    recommendations = [];
  }

  return (
    <ProductDetailClient
      product={product}
      recommendations={recommendations}
    />
  );
}
