'use client';

import CollectionPlpPage from './[slug]/page';

export default function CollectionsIndexPage() {
  const dummyParams = Promise.resolve({ slug: 'all' });
  return <CollectionPlpPage params={dummyParams} />;
}
