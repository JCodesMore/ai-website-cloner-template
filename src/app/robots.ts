import type { MetadataRoute } from "next";

// F51: explicit allow rules for AI crawlers and search engines.
// IndexNow key file at /6f5e8b2a4d3c1e9f7b8a2d5c4e3f1a9b.txt
export default function robots(): MetadataRoute.Robots {
  const allowAll = {
    allow: "/",
    disallow: ["/api/", "/_next/", "/admin/"],
  };

  return {
    rules: [
      // Default: allow general crawlers
      { userAgent: "*", ...allowAll },

      // AI training and search crawlers — explicitly allowed for citation/visibility
      { userAgent: "GPTBot", ...allowAll },
      { userAgent: "OAI-SearchBot", ...allowAll },
      { userAgent: "ChatGPT-User", ...allowAll },
      { userAgent: "ClaudeBot", ...allowAll },
      { userAgent: "Claude-Web", ...allowAll },
      { userAgent: "anthropic-ai", ...allowAll },
      { userAgent: "PerplexityBot", ...allowAll },
      { userAgent: "Google-Extended", ...allowAll },
      { userAgent: "Bingbot", ...allowAll },
      { userAgent: "Applebot", ...allowAll },
      { userAgent: "DuckDuckBot", ...allowAll },
      { userAgent: "facebookexternalhit", ...allowAll },
      { userAgent: "Twitterbot", ...allowAll },
      { userAgent: "LinkedInBot", ...allowAll },
    ],
    sitemap: "https://bajablue.mx/sitemap.xml",
    host: "https://bajablue.mx",
  };
}
