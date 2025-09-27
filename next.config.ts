import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Node.js 22
  experimental: {
    // Enable modern JavaScript features
    esmExternals: true,
    // Optimize server components
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Enable modern bundling
  swcMinify: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Enable compression
  compress: true,
};

export default nextConfig;
