import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'us.kayali.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oudnomaddubai.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '187.126.116.61',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const apiUrl = raw.replace(/\/+$/, '').replace(/\/api$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;