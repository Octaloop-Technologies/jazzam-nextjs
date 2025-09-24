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

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Add CORS headers for development
          ...(process.env.NODE_ENV === "development"
            ? [
                {
                  key: "Access-Control-Allow-Origin",
                  value: "*",
                },
                {
                  key: "Access-Control-Allow-Methods",
                  value: "GET, POST, PUT, DELETE, OPTIONS",
                },
                {
                  key: "Access-Control-Allow-Headers",
                  value: "Content-Type, Authorization, Cookie",
                },
                {
                  key: "Access-Control-Allow-Credentials",
                  value: "true",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
