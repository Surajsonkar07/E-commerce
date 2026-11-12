import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Keep the old Vite-era URL working.
  async redirects() {
    return [{ source: "/addtofavourite", destination: "/wishlist", permanent: true }];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "radix-ui"],
  },
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  additionalPrecacheEntries: [{ url: "/offline", revision: "sarani-offline-1" }],
});

// The service worker is only built for production (`next build --webpack`).
// Dev runs on Turbopack without it, so there is no stale cache while editing.
export default function config(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) return nextConfig;
  return withSerwist(nextConfig);
}
