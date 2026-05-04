import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bajablue.mx";
  const lastModified = "2026-04-13";

  return [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/tours`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tours/ocean-safari`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tours/blue-expedition`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tours/master-seafari`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/accommodations`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    ...blogPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
