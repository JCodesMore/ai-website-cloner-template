import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      // Products without category: /products/858(.html) -> /products/detail/858
      {
        source: "/products/:id(\\d+).html",
        destination: "/products/detail/:id",
      },
      {
        source: "/products/:id(\\d+)",
        destination: "/products/detail/:id",
      },
      // Strip .html suffix from all other incoming URLs
      {
        source: "/:path*.html",
        destination: "/:path*",
      },
      // Map /statics/* to public/* for static assets (live site uses /statics/ prefix)
      {
        source: "/statics/:path*",
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
