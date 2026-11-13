import type { NewsItem, Tour } from "@/components/sites/showlanka/content/types";
import { placeName } from "@/components/sites/showlanka/subpage-parts";

// Form state for the tour and news editors, and conversion to/from the site's content types.
// Shared by the client forms and the Server Actions (which re-validate everything).

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

export type Stop = { name: string; lat: string; lng: string };

export type TourDraft = {
  title: string;
  slug: string;
  code: string;
  days: string;
  nights: string;
  categories: string[];
  months: number[];
  card: string;
  hero: string;
  gallery: string[];
  /** Per-person price for 1, 2 and 3 travellers; `old` is the pre-discount price */
  prices: { price: string; old: string }[];
  itinerary: { title: string; attractions: string; overnight: string }[];
  tabs: { name: string; items: string }[];
  stops: Stop[];
  published: boolean;
};

export const AIRPORT: Stop = { name: "Airport", lat: "7.1809", lng: "79.8842" };

export const emptyTour = (): TourDraft => ({
  title: "",
  slug: "",
  code: "",
  days: "",
  nights: "",
  categories: ["private"],
  months: [],
  card: "",
  hero: "",
  gallery: [],
  prices: [0, 1, 2].map(() => ({ price: "", old: "" })),
  itinerary: [{ title: "Arrival", attractions: "", overnight: "" }],
  tabs: ["Accommodation", "Transport", "Guide", "Additional Services", "Excludes"].map((name) => ({ name, items: "" })),
  stops: [{ ...AIRPORT }],
  published: true,
});

const money = (s: string | undefined) => {
  const n = Number(String(s ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};
const num = (n: number) => (n ? String(Math.round(n * 100) / 100) : "");

export function tourToDraft(t: Tour, published = true): TourDraft {
  return {
    title: t.title,
    slug: t.slug,
    code: t.code,
    days: String(parseInt(t.duration, 10) || ""),
    nights: String(t.nights ?? ""),
    categories: [...t.categories],
    months: [...t.months],
    card: t.card,
    hero: t.hero,
    gallery: [...t.gallery],
    prices: (["1", "2", "3"] as const).map((k, i) => {
      const p = t.prices[k];
      const price = money(p?.price) || t.calc[i] || 0;
      const old = money(p?.old);
      return { price: num(price), old: old > price ? num(old) : "" };
    }),
    itinerary: t.itinerary.map((d) => ({
      title: d.title.replace(/^day\s*\d+\s*:\s*/i, ""),
      attractions: d.attractions.join("\n"),
      overnight: d.overnight,
    })),
    tabs: t.tabs.map((tab) => ({ name: tab.name, items: tab.items.join("\n") })),
    stops: Object.entries(t.map).map(([key, [lat, lng]]) => ({ name: placeName(key), lat: String(lat), lng: String(lng) })),
    published,
  };
}

const lines = (s: string) =>
  s
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

export type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

export function draftToTour(d: TourDraft): Result<Tour> {
  const errors: string[] = [];
  const title = d.title.trim();
  const slug = slugify(d.slug || d.title);
  const days = parseInt(d.days, 10);
  const nights = d.nights.trim() === "" ? Math.max(0, days - 1) : parseInt(d.nights, 10);
  if (!title) errors.push("Give the tour a title.");
  if (!slug) errors.push("The web address (slug) is empty.");
  if (!(days >= 1 && days <= 60)) errors.push("Days must be a number from 1 to 60.");
  if (!(nights >= 0 && nights <= 60)) errors.push("Nights must be a number from 0 to 60.");
  if (!d.hero.trim()) errors.push("Add a main (hero) image.");

  // Prices: a blank price means that party size is not offered (stored as 0, as on the source).
  const prices = [0, 1, 2].map((i) => d.prices[i] ?? { price: "", old: "" });
  const per = prices.map((p) => money(p.price));
  const old = prices.map((p, i) => Math.max(money(p.old), per[i]));
  if (!per.some(Boolean)) errors.push("Enter a price per person for at least one party size.");

  const itinerary = d.itinerary
    .filter((day) => day.title.trim() || day.attractions.trim())
    .map((day, i) => ({
      title: `Day ${i + 1} : ${day.title.trim() || "Free day"}`,
      attractions: lines(day.attractions),
      overnight: day.overnight.trim(),
    }));
  if (!itinerary.length) errors.push("Add at least one itinerary day.");

  const map: Record<string, [number, number]> = {};
  for (const s of d.stops) {
    if (!s.name.trim()) continue;
    const lat = Number(s.lat);
    const lng = Number(s.lng);
    if (!(lat >= 5.5 && lat <= 10.1 && lng >= 79.3 && lng <= 82.1)) {
      errors.push(`"${s.name}" needs a latitude/longitude inside Sri Lanka (pick a known place or check the numbers).`);
      continue;
    }
    map[s.name.trim().toLowerCase().replace(/\s+/g, "_")] = [lat, lng];
  }

  if (errors.length) return { ok: false, errors };

  const usd = (n: number) => `US$${Math.round(n)}`;
  const keys = ["1", "2", "3"] as const;
  const pct = Math.max(...per.map((p, i) => (old[i] > p ? (old[i] - p) / old[i] : 0)));
  const card = d.card.trim() || d.hero.trim();
  return {
    ok: true,
    value: {
      slug,
      title,
      code: d.code.trim(),
      duration: `${days} ${days === 1 ? "Day" : "Days"}`,
      nights,
      categories: [...new Set(d.categories)],
      months: [...new Set(d.months)].filter((m) => m >= 1 && m <= 12).sort((a, b) => a - b),
      card,
      // Listing cards show the 3-traveller rate, or the lowest offered rate without one.
      cardPrice: usd(per[2] || Math.min(...per.filter(Boolean))),
      hero: d.hero.trim(),
      gallery: d.gallery.map((g) => g.trim()).filter(Boolean),
      prices: Object.fromEntries(keys.map((k, i) => [k, { old: usd(old[i]), price: usd(per[i]) }])),
      // The site shows the saving for the whole party (per-person saving × travellers).
      save: Object.fromEntries(keys.map((k, i) => [k, String(Math.round((old[i] - per[i]) * (i + 1)))])),
      discount: `${Math.round(pct * 100)}% Off`,
      calc: per,
      itinerary,
      tabs: d.tabs
        .map((t) => ({ name: t.name.trim(), items: lines(t.items) }))
        .filter((t) => t.name && t.items.length),
      map,
    },
  };
}

// ---------- News ----------

export type NewsDraft = {
  title: string;
  slug: string;
  /** YYYY-MM-DD */
  date: string;
  card: string;
  hero: string;
  video: string;
  body: string;
  published: boolean;
  /** Built-in posts summarise an article on showlanka.com and link to it */
  linkOriginal: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");
export const isoToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const emptyNews = (): NewsDraft => ({
  title: "",
  slug: "",
  date: isoToday(),
  card: "",
  hero: "",
  video: "",
  body: "",
  published: true,
  linkOriginal: false,
});

export function newsToDraft(n: NewsItem, published = true): NewsDraft {
  const t = new Date(n.date);
  return {
    title: n.title,
    slug: n.slug,
    date: Number.isNaN(t.getTime()) ? isoToday() : `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`,
    card: n.card,
    hero: n.hero,
    video: n.video ?? "",
    body: n.summary.join("\n\n"),
    published,
    linkOriginal: !n.standalone,
  };
}

/** Accepts a YouTube ID or any youtube.com / youtu.be link. */
export function youtubeId(input: string) {
  const s = input.trim();
  if (!s) return "";
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function draftToNews(d: NewsDraft): Result<NewsItem> {
  const errors: string[] = [];
  const title = d.title.trim();
  const slug = slugify(d.slug || d.title);
  const [y, m, day] = d.date.split("-").map(Number);
  const date = y && m && day ? new Date(y, m - 1, day) : null;
  const video = youtubeId(d.video);
  const paragraphs = d.body
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);
  if (!title) errors.push("Give the article a headline.");
  if (!slug) errors.push("The web address (slug) is empty.");
  if (!date || Number.isNaN(date.getTime())) errors.push("Pick a publish date.");
  if (video === null) errors.push("The video must be a YouTube link or video ID.");
  if (!paragraphs.length) errors.push("Write the article text.");
  if (!d.hero.trim() && !video) errors.push("Add a main image or a YouTube video.");
  if (errors.length || !date) return { ok: false, errors };
  return {
    ok: true,
    value: {
      slug,
      title,
      date: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      card: d.card.trim(),
      hero: d.hero.trim(),
      ...(video ? { video } : {}),
      summary: paragraphs,
      ...(d.linkOriginal ? {} : { standalone: true }),
    },
  };
}
