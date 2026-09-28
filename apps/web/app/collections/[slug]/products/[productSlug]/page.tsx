'use client';

import ProductDetailPage from '../../../../products/[slug]/page';

interface NestedProductPageProps {
  params: Promise<{ slug: string; productSlug: string }>;
}

export default function NestedCollectionProductPage({ params }: NestedProductPageProps) {
  // Pass productSlug to the main ProductDetailPage
  const resolvedParams = params.then((p) => ({ slug: p.productSlug }));
  return <ProductDetailPage params={resolvedParams} />;
}
