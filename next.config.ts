import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "www.animesaga.net" },
      { protocol: "https", hostname: "artworks.thetvdb.com" },
    ],
  },
};

export default nextConfig;
