import { createHash, createHmac } from "node:crypto";
import { getDb, TIME_ZONE } from "./db";

// Cookieless analytics: a visitor is a hash of IP + user agent with a salt that changes
// daily, so nothing is stored on the visitor's device and raw IPs are never saved.

const SESSION_GAP_MS = 30 * 60 * 1000;
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|curl|wget|python|axios|node-fetch/i;

export const dayKey = (ms: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(ms);

export function visitorId(ip: string, ua: string, now = Date.now()) {
  const salt = createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "showlanka").update(dayKey(now)).digest("hex");
  return createHash("sha256").update(`${salt}|${ip}|${ua}`).digest("hex").slice(0, 24);
}

export const isBot = (ua: string) => !ua || BOT_UA.test(ua);

export function deviceOf(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "Tablet";
  if (/mobi|iphone|ipod|android/i.test(ua)) return "Mobile";
  return "Desktop";
}

export function browserOf(ua: string) {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)yahoo\./, "Yahoo"],
  [/(facebook\.com|fb\.com|fb\.me)$/, "Facebook"],
  [/instagram\.com$/, "Instagram"],
  [/(t\.co|twitter\.com|x\.com)$/, "X / Twitter"],
  [/(youtube\.com|youtu\.be)$/, "YouTube"],
  [/tripadvisor\./, "Tripadvisor"],
  [/(chatgpt\.com|openai\.com)$/, "ChatGPT"],
  [/perplexity\.ai$/, "Perplexity"],
  [/(whatsapp\.com|wa\.me)$/, "WhatsApp"],
  [/linkedin\.com$/, "LinkedIn"],
  [/pinterest\./, "Pinterest"],
];

export function sourceOf(referrerHost: string, utmSource: string) {
  if (utmSource) {
    const s = utmSource.toLowerCase();
    const known = SOURCES.find(([re]) => re.test(`${s}.com`) || re.test(s));
    return known ? known[1] : utmSource.slice(0, 60);
  }
  if (!referrerHost) return "Direct";
  return SOURCES.find(([re]) => re.test(referrerHost))?.[1] ?? referrerHost.replace(/^www\./, "");
}

export type PageviewInput = {
  path: string;
  referrerHost: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  country: string;
  ua: string;
  ip: string;
};

export function recordPageview(v: PageviewInput) {
  const db = getDb();
  const now = Date.now();
  const visitor = visitorId(v.ip, v.ua, now);
  const last = db
    .prepare("SELECT session_id, created_at FROM pageviews WHERE visitor_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(visitor) as { session_id: string; created_at: number } | undefined;
  const isEntry = !last || now - last.created_at > SESSION_GAP_MS;
  const session = isEntry ? createHash("sha256").update(`${visitor}|${now}`).digest("hex").slice(0, 24) : last.session_id;
  db.prepare(
    `INSERT INTO pageviews (created_at, visitor_id, session_id, path, referrer_host, source, utm_source, utm_medium, utm_campaign, country, device, browser, is_entry)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    now, visitor, session, v.path.slice(0, 300), v.referrerHost, sourceOf(v.referrerHost, v.utmSource),
    v.utmSource.slice(0, 100), v.utmMedium.slice(0, 100), v.utmCampaign.slice(0, 100),
    v.country.slice(0, 2).toUpperCase(), deviceOf(v.ua), browserOf(v.ua), isEntry ? 1 : 0,
  );
}

/** Where this visitor's current session began (for attributing an enquiry). */
export function sessionOrigin(ip: string, ua: string) {
  const visitor = visitorId(ip, ua);
  const entry = getDb()
    .prepare(
      `SELECT p.source, p.referrer_host, p.path FROM pageviews p
       WHERE p.session_id = (SELECT session_id FROM pageviews WHERE visitor_id = ? ORDER BY created_at DESC LIMIT 1)
       ORDER BY p.created_at ASC LIMIT 1`,
    )
    .get(visitor) as { source: string; referrer_host: string; path: string } | undefined;
  return { visitor, source: entry?.source ?? "", referrer: entry?.referrer_host ?? "", landingPage: entry?.path ?? "" };
}

// ---------- Dashboard queries ----------

export type Totals = { views: number; visitors: number; sessions: number; bounceRate: number; enquiries: number };
export type Ranked = { label: string; value: number };
export type DailyPoint = { day: string; views: number; visitors: number };

/** Admin time zone's offset from UTC at an instant, in ms (local − UTC). */
function tzOffset(ms: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  }).formatToParts(ms);
  const n = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second")) - Math.floor(ms / 1000) * 1000;
}

/** Midnight (admin time zone) of the first day of a `days`-long range ending today. */
export function rangeStart(days: number, now = Date.now()) {
  const utcMidnight = Date.parse(`${dayKey(now)}T00:00:00Z`);
  return utcMidnight - tzOffset(utcMidnight) - (days - 1) * 86400000;
}

export function totals(from: number, to = Date.now()): Totals {
  const db = getDb();
  const t = db
    .prepare(
      `SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors, COUNT(DISTINCT session_id) AS sessions
       FROM pageviews WHERE created_at >= ? AND created_at < ?`,
    )
    .get(from, to) as { views: number; visitors: number; sessions: number };
  const single = db
    .prepare(
      `SELECT COUNT(*) AS n FROM (SELECT session_id FROM pageviews WHERE created_at >= ? AND created_at < ?
       GROUP BY session_id HAVING COUNT(*) = 1)`,
    )
    .get(from, to) as { n: number };
  const enq = db.prepare("SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= ? AND created_at < ?").get(from, to) as { n: number };
  return { ...t, bounceRate: t.sessions ? single.n / t.sessions : 0, enquiries: enq.n };
}

export function daily(days: number): DailyPoint[] {
  const from = rangeStart(days);
  const rows = getDb()
    .prepare("SELECT created_at, visitor_id FROM pageviews WHERE created_at >= ?")
    .all(from) as { created_at: number; visitor_id: string }[];
  const buckets = new Map<string, { views: number; visitors: Set<string> }>();
  for (let i = 0; i < days; i++) buckets.set(dayKey(from + i * 86400000 + 43200000), { views: 0, visitors: new Set() });
  for (const r of rows) {
    const b = buckets.get(dayKey(r.created_at));
    if (!b) continue;
    b.views += 1;
    b.visitors.add(r.visitor_id);
  }
  return [...buckets].map(([day, b]) => ({ day, views: b.views, visitors: b.visitors.size }));
}

type Dimension = "path" | "source" | "country" | "device" | "browser";

/** Top values of a dimension. Sources count sessions (entry pageviews); the rest count views. */
export function top(dimension: Dimension, from: number, limit = 8): Ranked[] {
  const entryOnly = dimension === "source" ? "AND is_entry = 1" : "";
  return getDb()
    .prepare(
      `SELECT ${dimension} AS label, COUNT(*) AS value FROM pageviews
       WHERE created_at >= ? ${entryOnly} GROUP BY ${dimension} ORDER BY value DESC LIMIT ?`,
    )
    .all(from, limit) as Ranked[];
}

export function liveVisitors() {
  const r = getDb()
    .prepare("SELECT COUNT(DISTINCT visitor_id) AS n FROM pageviews WHERE created_at >= ?")
    .get(Date.now() - 5 * 60 * 1000) as { n: number };
  return r.n;
}
