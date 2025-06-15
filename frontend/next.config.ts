import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: ["portal.payconiq.com", "localhost"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.BACKEND_URL || "http://backend:3001/:path*", // Proxy to Backend
        // destination: process.env.BACKEND_URL || "http://localhost:3001/:path*",
        // destination: process.env.BACKEND_URL || "http://192.168.129.235:3001//:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
