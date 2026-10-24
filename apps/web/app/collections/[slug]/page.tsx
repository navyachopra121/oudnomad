// Server Component — no 'use client' directive
// Fetches initial products server-side for SSR, passes to client component.

import { StoreApi } from '../../store-api';
import CollectionPlpClient from './CollectionPlpClient';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function CollectionPlpPage({ params }: PageProps) {
  // Safely resolve params whether it's a plain object or a Promise (Next.js 15+)
  const resolvedParams = await Promise.resolve(params);
  const rawSlug = resolvedParams?.slug || 'all';
  const slug = rawSlug.toLowerCase();

  // Server-side data fetching — no loading spinner on first render
  let initialProducts: Awaited<ReturnType<typeof StoreApi.getProducts>>['items'] = [];
  try {
    const queryCategory = slug === 'all' ? undefined : slug;
    const res = await StoreApi.getProducts({ category: queryCategory });
    initialProducts = res.items || [];
  } catch (_) {
    initialProducts = [];
  }

  return (
    <CollectionPlpClient
      slug={slug}
      initialProducts={initialProducts}
    />
  );
}
