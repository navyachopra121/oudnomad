import { Metadata } from 'next';
import { StoreApi } from '../store-api';
import CollectionPlpClient from './[slug]/CollectionPlpClient';

export const metadata: Metadata = {
  title: 'All Fragrances | Oud Nomad Collection',
  description:
    'Explore the complete Oud Nomad fragrance universe. Luxury Extrait de Parfum and refreshing mists crafted from Taif rose, Kashmir saffron and aged Assamese oud. Free shipping to UAE and GCC.',
};

export default async function CollectionsIndexPage() {
  let initialProducts: Awaited<ReturnType<typeof StoreApi.getProducts>>['items'] = [];
  try {
    const res = await StoreApi.getProducts();
    initialProducts = res.items || [];
  } catch (_) {
    initialProducts = [];
  }

  return (
    <CollectionPlpClient
      slug="all"
      initialProducts={initialProducts}
    />
  );
}
