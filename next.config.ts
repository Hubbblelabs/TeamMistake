import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable API routes
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  // Enable source maps for production debugging
  productionBrowserSourceMaps: true,
};

export default nextConfig;
