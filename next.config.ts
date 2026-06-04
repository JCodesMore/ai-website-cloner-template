import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "quiz.kegel-plan.me",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
