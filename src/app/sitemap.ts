import type { MetadataRoute } from "next";

const BASE_URL = "https://www.fundup.au";

/**
 * Mirrors the live site's sitemap, minus `/style-guide` — that page is a Webflow
 * template artifact rather than site content and is not part of this clone.
 */
const ROUTES = [
  "",
  "/services",
  "/self-employed-loans",
  "/low-doc-loans",
  "/calculators",
  "/contact",
  "/book-a-consultation",
  "/privacy-policy",
  "/terms-and-conditions",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
