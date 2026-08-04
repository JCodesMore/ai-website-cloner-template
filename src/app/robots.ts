import type { MetadataRoute } from "next";

/**
 * The live site's robots.txt is a single `Sitemap:` line with no User-agent or
 * Disallow directives. We add the equivalent explicit allow-all so the output is
 * a valid robots.txt rather than a bare sitemap reference.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.fundup.au/sitemap.xml",
  };
}
