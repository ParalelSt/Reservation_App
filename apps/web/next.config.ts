import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@reservation-app/database'],
  serverExternalPackages: ['postgres'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.auth0.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.facebook.com',
      },
    ],
  },
};

export default nextConfig;
