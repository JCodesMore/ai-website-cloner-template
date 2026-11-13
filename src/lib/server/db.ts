import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

/** Where the SQLite database and uploaded images live. Must be a persistent disk in production. */
// Runtime-only location: kept out of build file tracing so the data folder is never bundled.
export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "data"));
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS pageviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer_host TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL,
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  device TEXT NOT NULL DEFAULT '',
  browser TEXT NOT NULL DEFAULT '',
  is_entry INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS pageviews_created ON pageviews (created_at);
CREATE INDEX IF NOT EXISTS pageviews_visitor ON pageviews (visitor_id, created_at);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  arrival TEXT NOT NULL DEFAULT '',
  departure TEXT NOT NULL DEFAULT '',
  adults TEXT NOT NULL DEFAULT '',
  children TEXT NOT NULL DEFAULT '',
  hotel TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  page TEXT NOT NULL DEFAULT '',
  visitor_id TEXT,
  source TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  landing_page TEXT NOT NULL DEFAULT '',
  email_sent INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS enquiries_created ON enquiries (created_at);

-- Tours and news posts written in the admin. A row whose slug matches a built-in
-- tour/post overrides it (published = 0 hides it from the site).
CREATE TABLE IF NOT EXISTS tours (
  slug TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS news (
  slug TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

const globalForDb = globalThis as unknown as { showlankaDb?: DatabaseSync };

function open() {
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "showlanka.db"));
  db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA synchronous = NORMAL;");
  db.exec(SCHEMA);
  return db;
}

/** One connection per server process (kept on globalThis so dev hot reloads reuse it). */
export function getDb() {
  return (globalForDb.showlankaDb ??= open());
}

/** Admin time zone for dates and daily totals. */
export const TIME_ZONE = process.env.ADMIN_TIMEZONE || "Asia/Colombo";
