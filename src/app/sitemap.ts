import type { MetadataRoute } from "next";
import { getNews, getTours } from "@/lib/server/content";
import { siteUrl } from "@/lib/site-url";

const pages = [
  "", "/sri-lanka-tours", "/about", "/meet-your-travel-gurus", "/real-traveler-stories",
  "/news-offers", "/sweet-bonanza", "/faqs", "/contact", "/terms-and-conditions",
];

// getTours/getNews are request-time, so tours and posts published in the admin are listed at once.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, news] = await Promise.all([getTours(), getNews()]);
  return [
    ...pages.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...tours.map((t) => ({ url: `${siteUrl}/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...news.map((n) => {
      const time = Date.parse(n.date);
      return {
        url: `${siteUrl}/${n.slug}`,
        ...(time ? { lastModified: new Date(time) } : {}),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      };
    }),
  ];
}
