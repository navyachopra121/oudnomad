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
};

export default nextConfig;