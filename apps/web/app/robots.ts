import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Primary crawlers — allow everything except private routes
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider'],
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/cart/'],
      },
      // AI training crawlers — block entirely
      {
        userAgent: ['GPTBot', 'CCBot', 'anthropic-ai', 'ClaudeBot', 'Google-Extended'],
        disallow: '/',
      },
      // SEO audit bots — crawl-delay to protect server
      {
        userAgent: ['SemrushBot', 'AhrefsBot', 'MJ12bot', 'DotBot'],
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/cart/'],
        crawlDelay: 10,
      },
      // All others — standard rule
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/cart/'],
      },
    ],
    sitemap: 'https://oudnomad.com/sitemap.xml',
    host: 'https://oudnomad.com',
  };
}
