import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  experimental: {
    // @ts-expect-error - Next.js suggests this config at runtime but it's missing from TS types
    allowedDevOrigins: ["10.108.105.5"],
  },
};

export default withPWA(nextConfig);
