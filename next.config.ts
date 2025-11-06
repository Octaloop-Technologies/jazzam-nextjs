import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: process.env.NODE_ENV === "development",
  transpilePackages: ["gsap", "@gsap/react"],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["gsap", "@gsap/react"],
  },
};

export default nextConfig;
