import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    cpus: 1,
    webpackMemoryOptimizations: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
