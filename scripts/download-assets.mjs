#!/usr/bin/env node
/**
 * Downloads every binary asset fundup.au serves from the Webflow CDN into public/.
 *
 * The site is unusually asset-light: a logo, one headshot, two hero backgrounds and the
 * favicons. Everything else on the page is inline SVG or pure CSS, so those are extracted
 * into src/components/icons.tsx rather than downloaded.
 *
 * Run: node scripts/download-assets.mjs
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CDN = "https://cdn.prod.website-files.com/69e063061da62a1e076d274d";

/** @type {{url: string, dest: string}[]} */
const ASSETS = [
  // ── Logo (responsive variants) ──────────────────────────────────────────
  ...["", "-p-500", "-p-800", "-p-1080", "-p-1600"].map((v) => ({
    url: `${CDN}/69e8ce53a48de4f7a3594b3b_69e074300a159b45d16892f4_fundup-logo${v}.webp`,
    dest: `images/fundup-logo${v}.webp`,
  })),

  // ── Ned McLachlan headshot (webp + legacy jpg) ──────────────────────────
  ...["", "-p-500", "-p-800", "-p-1080"].map((v) => ({
    url: `${CDN}/69e8cd929c7bdf4ddd4d9465_69e07434bdb7ff1bc3e75fc9_ned-mclachlan${v}.webp`,
    dest: `images/ned-mclachlan${v}.webp`,
  })),
  ...["", "-p-500", "-p-800", "-p-1080"].map((v) => ({
    url: `${CDN}/69e07434bdb7ff1bc3e75fc9_ned-mclachlan${v}.jpg`,
    dest: `images/ned-mclachlan${v}.jpg`,
  })),

  // ── Hero backgrounds (CSS background-image on .fu-hero-embed__bg) ───────
  // Filenames carry literal spaces and parens on the CDN. Two distinct images:
  // the webp is the default, the jpg is swapped in below the 479px breakpoint.
  {
    url: `${CDN}/69e99016fb06b84449e01b3b_69e07433b81c31594428acb1_homepage%20(2).webp`,
    dest: "images/hero-bg-desktop.webp",
  },
  {
    url: `${CDN}/69eaddf284ed17414ec28efb_69e07433b81c31594428acb1_homepage%20(1)%20(1).jpg`,
    dest: "images/hero-bg-mobile.jpg",
  },

  // ── Favicons ────────────────────────────────────────────────────────────
  { url: `${CDN}/69e7753c604ddd2e42d42bd6_Untitled%20design.png`, dest: "seo/favicon.png" },
  {
    url: `${CDN}/69e77577e96cd0874f5ace76_Untitled%20design%20(1).png`,
    dest: "seo/apple-touch-icon.png",
  },

  // ── Webflow form checkbox tick (used by the borrowing-power form) ───────
  {
    url: "https://d3e54v103j8qbb.cloudfront.net/static/custom-checkbox-checkmark.589d534424.svg",
    dest: "images/checkbox-checkmark.svg",
  },
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const BATCH = 4;

async function download({ url, dest }) {
  const out = join(ROOT, "public", dest);
  try {
    await access(out);
    return { dest, status: "skipped (exists)" };
  } catch {
    /* not cached yet */
  }
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) return { dest, status: `FAILED ${res.status}` };
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buf);
  return { dest, status: "ok", bytes: buf.length };
}

const results = [];
for (let i = 0; i < ASSETS.length; i += BATCH) {
  const chunk = ASSETS.slice(i, i + BATCH);
  const settled = await Promise.allSettled(chunk.map(download));
  settled.forEach((s, j) =>
    results.push(
      s.status === "fulfilled" ? s.value : { dest: chunk[j].dest, status: `ERROR ${s.reason}` },
    ),
  );
}

const failed = results.filter((r) => !/^(ok|skipped)/.test(r.status));
for (const r of results) {
  const size = r.bytes ? ` (${(r.bytes / 1024).toFixed(1)} KB)` : "";
  console.log(`${r.status === "ok" ? "✓" : r.status.startsWith("skipped") ? "·" : "✗"} ${r.dest}${size}`);
}
console.log(`\n${results.length - failed.length}/${results.length} assets available.`);
if (failed.length) {
  console.error("Failed:", failed.map((f) => `${f.dest} → ${f.status}`).join(", "));
  process.exit(1);
}
