import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Keeps the dev badge out of source/local comparison screenshots.
  devIndicators: false,
};

export default nextConfig;
