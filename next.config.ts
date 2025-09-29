import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //   images: {
  //     remotePatterns: [
  //       {
  //         protocol: "https",
  //         hostname: "**",
  //       },
  //       {
  //         protocol: "http",
  //         hostname: "**",
  //       },
  //     ],
  //   },
  reactStrictMode: process.env.NODE_ENV === "development",
  transpilePackages: ["gsap", "@gsap/react"],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["gsap", "@gsap/react"],
  },
};

export default nextConfig;
