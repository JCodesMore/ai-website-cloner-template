#!/usr/bin/env node
// Download assets needed for inner pages (about/services/team/blog/portfolio etc.)
import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "..", "public");
const BASE = "https://yoddenhtml.websitelayout.net";

const ASSETS = [
  // inner-page hero backgrounds
  "/img/bg/bg-01.jpg",
  "/img/bg/bg-03.jpg",
  "/img/bg/bg-04.jpg",
  "/img/bg/bg-05.jpg",
  "/img/bg/bg-06.jpg",
  "/img/bg/bg-09.jpg",
  // avatars (testimonials & blog authors)
  "/img/avatar/avatar-01.jpg",
  "/img/avatar/avatar-02.jpg",
  "/img/avatar/avatar-03.jpg",
  "/img/avatar/avatar-05.jpg",
  "/img/avatar/avatar-06.jpg",
  "/img/avatar/avatar-07.jpg",
  "/img/avatar/avatar-08.jpg",
  "/img/avatar/avatar-09.jpg",
  // blog & portfolio extras
  "/img/blog/blog-04.jpg",
  "/img/blog/blog-05.jpg",
  "/img/blog/blog-06.jpg",
  "/img/blog/blog-detail-02.jpg",
  "/img/blog/blog-detail-03.jpg",
  "/img/blog/blog-gallary-01.jpg",
  "/img/blog/blog-gallary-02.jpg",
  "/img/blog/blog-gallary-03.jpg",
  "/img/blog/blog-gallary-04.jpg",
  "/img/blog/blog-gallary-05.jpg",
  "/img/blog/blog-gallary-06.jpg",
  "/img/blog/blog-post-01.jpg",
  "/img/blog/blog-post-02.jpg",
  "/img/blog/blog-post-03.jpg",
  "/img/blog/blog-sidebar-banner.jpg",
  "/img/blog/next-blog.jpg",
  "/img/blog/prev-blog.jpg",
  // content & shape extras
  "/img/content/02.jpg",
  "/img/content/about-04.jpg",
  "/img/content/about-05.jpg",
  "/img/content/shape-01.png",
  // additional service icons
  "/img/icons/icon-05.png",
  "/img/icons/icon-06.png",
  // portfolio
  "/img/portfolio/portfolio-01.jpg",
  "/img/portfolio/portfolio-02.jpg",
  "/img/portfolio/portfolio-03.jpg",
  "/img/portfolio/portfolio-04.jpg",
  "/img/portfolio/portfolio-05.jpg",
  "/img/portfolio/portfolio-06.jpg",
  "/img/portfolio/portfolio-detail-01.jpg",
  "/img/portfolio/portfolio-detail-02.jpg",
  "/img/portfolio/portfolio-detail-03.jpg",
  "/img/portfolio/portfolio-detail-04.jpg",
  "/img/portfolio/next-portfolio.jpg",
  "/img/portfolio/prev-portfolio.jpg",
  // service detail
  "/img/services/service-detail-01.jpg",
  "/img/services/service-detail-02.jpg",
  // team
  "/img/team/team-01.jpg",
  "/img/team/team-02.jpg",
  "/img/team/team-03.jpg",
  "/img/team/team-04.jpg",
  "/img/team/team-05.jpg",
  "/img/team/team-06.jpg",
  "/img/team/team-07.jpg",
  "/img/team/team-08.jpg",
];

async function exists(p) { try { await stat(p); return true; } catch { return false; } }
async function downloadOne(rel) {
  const target = join(OUT, rel.replace(/^\//, ""));
  if (await exists(target)) return { rel, status: "cached" };
  await mkdir(dirname(target), { recursive: true });
  const res = await fetch(BASE + rel);
  if (!res.ok) throw new Error(`${rel} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
  return { rel, status: "downloaded", bytes: buf.length };
}
async function pool(tasks, n) {
  const out = [], q = [...tasks];
  await Promise.all(Array.from({ length: n }, async () => {
    while (q.length) { const t = q.shift(); try { out.push(await t()); } catch (e) { out.push({ error: e.message }); } }
  }));
  return out;
}
const results = await pool(ASSETS.map(r => () => downloadOne(r)), 8);
let ok = 0, cached = 0, fail = 0;
for (const r of results) {
  if (r.error) { fail++; console.error("FAIL", r.error); }
  else if (r.status === "cached") cached++;
  else { ok++; }
}
console.log(`downloaded: ${ok}, cached: ${cached}, failed: ${fail}`);
if (fail) process.exit(1);
