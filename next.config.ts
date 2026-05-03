import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/incomparables-web",
  assetPrefix: "/incomparables-web/",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minimax-algeng-chat-tts-us.oss-us-east-1.aliyuncs.com",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
    ],
  },
};

export default nextConfig;