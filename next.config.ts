import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const videoCdnOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_VIDEO_CDN_BASE_URL;
  if (!raw) return "";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
})();

// F52: drop unsafe-eval in production. F43: allow Google Maps in frame-src.
// Baja Swarm: allow bajaswarm.com for the embedded Bubbles concierge widget,
// and the ai-studio tailnet for chat backend calls.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cloud.umami.is https://bajaswarm.com"
  : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://cloud.umami.is https://bajaswarm.com";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://bajaswarm.com",
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: blob: https://cdn.sanity.io https://*.cloudflarestream.com https://*.mux.com https://firebasestorage.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://bajaswarm.com ${videoCdnOrigin}`,
      `media-src 'self' blob: https://*.cloudflarestream.com https://stream.mux.com https://*.mux.com https://bajaswarm.com ${videoCdnOrigin}`,
      "connect-src 'self' https://wa.me https://www.google-analytics.com https://cloud.umami.is https://api.umami.is https://api-gateway.umami.dev https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.firebaseapp.com https://*.cloudflarestream.com https://stream.mux.com https://*.mux.com https://bajaswarm.com https://*.ts.net",
      "frame-src 'self' https://www.google.com https://www.youtube.com https://*.cloudflarestream.com https://*.mux.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

// F53: long-cache static images
const imageCacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // F49: enforce no trailing slash (canonical URL hygiene)
  trailingSlash: false,
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/:path*.webp", headers: imageCacheHeaders },
      { source: "/:path*.avif", headers: imageCacheHeaders },
      { source: "/:path*.jpg", headers: imageCacheHeaders },
      { source: "/:path*.jpeg", headers: imageCacheHeaders },
      { source: "/:path*.png", headers: imageCacheHeaders },
      { source: "/:path*.svg", headers: imageCacheHeaders },
      { source: "/:path*.woff2", headers: imageCacheHeaders },
    ];
  },
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.cloudflarestream.com" },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
