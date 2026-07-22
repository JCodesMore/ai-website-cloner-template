import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // 开发指示器悬浮钮会压住移动端底栏「首页」格，干扰与原站对拍
  devIndicators: false,
};

export default nextConfig;
