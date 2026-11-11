import { connection } from "next/server";
import { news as builtinNews } from "@/components/sites/showlanka/content/news";
import { tours as builtinTours } from "@/components/sites/showlanka/content/tours";
import type { NewsItem, Tour } from "@/components/sites/showlanka/content/types";
import { getDb } from "./db";

type Row = { slug: string; data: string; published: number; created_at: number; updated_at: number };

export type AdminEntry<T> = {
  item: T;
  /** Shipped with the site code (content/*.ts) rather than created in the admin */
  builtin: boolean;
  /** Built-in item that has been edited in the admin */
  edited: boolean;
  published: boolean;
  updatedAt: number | null;
};

const builtinTourSlugs = new Set(builtinTours.map((t) => t.slug));
const builtinNewsSlugs = new Set(builtinNews.map((n) => n.slug));

/** First-level routes a tour or post slug must not shadow. */
export const RESERVED_SLUGS = new Set([
  "about", "admin", "api", "contact", "faqs", "media", "meet-your-travel-gurus", "news-offers",
  "real-traveler-stories", "sites", "sri-lanka-tours", "sweet-bonanza", "terms-and-conditions",
]);

/** No database (e.g. serverless hosting without a persistent disk) → built-in content only. */
function rows(table: "tours" | "news") {
  try {
    return getDb().prepare(`SELECT slug, data, published, created_at, updated_at FROM ${table} ORDER BY created_at DESC`).all() as Row[];
  } catch (err) {
    console.warn(`[content] database unavailable, using built-in ${table}:`, err);
    return [];
  }
}

/** Built-in items (with admin overrides applied) after the admin-created ones, newest first. */
function merge<T extends { slug: string }>(table: "tours" | "news", builtin: T[], builtinSlugs: Set<string>) {
  const stored = new Map(rows(table).map((r) => [r.slug, r]));
  const created: AdminEntry<T>[] = [];
  for (const r of stored.values()) {
    if (builtinSlugs.has(r.slug)) continue;
    created.push({ item: JSON.parse(r.data) as T, builtin: false, edited: false, published: !!r.published, updatedAt: r.updated_at });
  }
  const shipped = builtin.map((item): AdminEntry<T> => {
    const r = stored.get(item.slug);
    return r
      ? { item: JSON.parse(r.data) as T, builtin: true, edited: true, published: !!r.published, updatedAt: r.updated_at }
      : { item, builtin: true, edited: false, published: true, updatedAt: null };
  });
  return [...created, ...shipped];
}

// Admin listings (include unpublished)
export const adminTours = () => merge("tours", builtinTours, builtinTourSlugs);
export const adminNews = () => sortNews(merge("news", builtinNews, builtinNewsSlugs), (e) => e.item);

export function slugInUse(slug: string) {
  return RESERVED_SLUGS.has(slug) || adminTours().some((e) => e.item.slug === slug) || adminNews().some((e) => e.item.slug === slug);
}

const newsTime = (n: NewsItem) => Date.parse(n.date) || 0;
function sortNews<T>(list: T[], get: (x: T) => NewsItem) {
  // Stable sort keeps same-day posts in their existing order.
  return [...list].sort((a, b) => newsTime(get(b)) - newsTime(get(a)));
}

// Public site (published only). connection() keeps these pages request-time so admin
// edits show immediately, instead of being frozen into the build.
export async function getTours(): Promise<Tour[]> {
  await connection();
  return adminTours().filter((e) => e.published).map((e) => e.item);
}

export async function getNews(): Promise<NewsItem[]> {
  await connection();
  return adminNews().filter((e) => e.published).map((e) => e.item);
}

export async function getTour(slug: string) {
  return (await getTours()).find((t) => t.slug === slug);
}

export async function getNewsItem(slug: string) {
  return (await getNews()).find((n) => n.slug === slug);
}

export function isBuiltinTour(slug: string) {
  return builtinTourSlugs.has(slug);
}
export function isBuiltinNews(slug: string) {
  return builtinNewsSlugs.has(slug);
}
export const builtinTour = (slug: string) => builtinTours.find((t) => t.slug === slug);
export const builtinNewsItem = (slug: string) => builtinNews.find((n) => n.slug === slug);
