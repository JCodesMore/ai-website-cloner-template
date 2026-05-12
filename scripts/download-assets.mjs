#!/usr/bin/env node
// Download all assets from the Yodden source into public/.
// Usage: node scripts/download-assets.mjs
import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "..", "public");
const BASE = "https://yoddenhtml.websitelayout.net";

// Asset paths sourced from research (all relative to BASE).
const ASSETS = [
  // logos & favicon
  "/img/logos/logo.png",
  "/img/logos/logo-inner.png",
  "/img/logos/footer-light-logo.png",
  "/img/logos/favicon.png",
  "/img/logos/apple-touch-icon-57x57.png",
  "/img/logos/apple-touch-icon-72x72.png",
  "/img/logos/apple-touch-icon-114x114.png",
  // banner photos (hero slides)
  "/img/banner/banner-01.jpg",
  "/img/banner/banner-02.jpg",
  "/img/banner/banner-03.jpg",
  // service card icons + about icon + offer card
  "/img/icons/icon-01.png",
  "/img/icons/icon-02.png",
  "/img/icons/icon-03.png",
  "/img/icons/icon-04.png",
  "/img/icons/icon-07.png",
  "/img/icons/icon-08.png",
  "/img/icons/icon-09.png",
  "/img/icons/icon-10.png",
  "/img/icons/icon-11.png",
  "/img/icons/icon-12.png",
  // about us
  "/img/content/about-01.jpg",
  "/img/content/about-02.jpg",
  "/img/content/about-03.jpg",
  // why choose us illustration
  "/img/content/why-choose-us-01.png",
  // offer right photo
  "/img/content/01.jpg",
  // line decorations
  "/img/content/line-01.png",
  "/img/content/line-02.png",
  // streaming carousel
  "/img/content/stream-01.jpg",
  "/img/content/stream-02.jpg",
  "/img/content/stream-03.jpg",
  "/img/content/stream-04.jpg",
  "/img/content/stream-05.jpg",
  "/img/content/stream-06.jpg",
  // streaming bg
  "/img/bg/bg-02.jpg",
  // blog cards
  "/img/blog/blog-01.jpg",
  "/img/blog/blog-02.jpg",
  "/img/blog/blog-03.jpg",
];

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function downloadOne(rel) {
  const target = join(OUT, rel.replace(/^\//, ""));
  if (await exists(target)) return { rel, status: "cached" };
  await mkdir(dirname(target), { recursive: true });
  const res = await fetch(BASE + rel);
  if (!res.ok) throw new Error(`${rel} → HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
  return { rel, status: "downloaded", bytes: buf.length };
}

async function pool(tasks, n) {
  const results = [];
  const queue = [...tasks];
  await Promise.all(Array.from({ length: n }, async () => {
    while (queue.length) {
      const t = queue.shift();
      try { results.push(await t()); }
      catch (e) { results.push({ error: e.message }); }
    }
  }));
  return results;
}

const results = await pool(
  ASSETS.map((rel) => () => downloadOne(rel)),
  6,
);
let ok = 0, cached = 0, fail = 0;
for (const r of results) {
  if (r.error) { fail++; console.error("FAIL", r.error); }
  else if (r.status === "cached") { cached++; }
  else { ok++; console.log("OK  ", r.rel, `(${r.bytes} bytes)`); }
}
console.log(`\nDone — downloaded: ${ok}, cached: ${cached}, failed: ${fail}`);
if (fail) process.exit(1);
