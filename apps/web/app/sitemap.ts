import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://oudnomad.com';
  const now = new Date();

  // ── High-priority brand pages ───────────────────────────────────────────────
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                             lastModified: now, changeFrequency: 'daily',   priority: 1.0  },
    { url: `${baseUrl}/about`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/collections/all`,        lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/collections/perfumes`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.90 },
    { url: `${baseUrl}/collections/mists`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${baseUrl}/fragrance-finder`,       lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${baseUrl}/craft`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/search`,                 lastModified: now, changeFrequency: 'daily',   priority: 0.70 },
    { url: `${baseUrl}/contact`,                lastModified: now, changeFrequency: 'monthly', priority: 0.60 },
    { url: `${baseUrl}/reviews`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.65 },
  ];

  // ── Legal pages ─────────────────────────────────────────────────────────────
  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/legal/privacy`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.30 },
    { url: `${baseUrl}/legal/terms`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.30 },
    { url: `${baseUrl}/legal/refund-policy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.30 },
  ];

  // ── Products ─────────────────────────────────────────────────────────────────
  // TODO: Replace with dynamic fetch from store API when backend is live
  const productSlugs: string[] = [
    'cedre', 'selene', 'ivoire', 'amritsar-nights', 'dubai-dusk',
    'rub-al-khali', 'taif-rose', 'nomad-woman', 'saffron-silk',
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.90,
  }));

  return [...coreRoutes, ...legalRoutes, ...productRoutes];
}

