import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable API routes
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
