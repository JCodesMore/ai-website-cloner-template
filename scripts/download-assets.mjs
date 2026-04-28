// Downloads all monochrome.so assets to /public for the clone.
// Run with: node scripts/download-assets.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

const ORIGIN = "https://www.monochrome.so";

// Assets discovered via the live page DOM. Map source URL -> local path under /public.
const ASSETS = [
  // ---- Hero KV cycling images ----
  ["/_next/static/media/kv_01.b9ff9bcd.jpg", "images/kv/kv_01.jpg"],
  ["/_next/static/media/kv_02.35d55342.jpg", "images/kv/kv_02.jpg"],
  ["/_next/static/media/kv_03.92ddbce7.jpg", "images/kv/kv_03.jpg"],
  ["/_next/static/media/kv_04.4da2db39.jpg", "images/kv/kv_04.jpg"],
  ["/_next/static/media/kv_05.eb0fe7ad.jpg", "images/kv/kv_05.jpg"],
  ["/_next/static/media/kv_06.11ad9256.jpg", "images/kv/kv_06.jpg"],
  ["/_next/static/media/kv_07.6d6a7740.jpg", "images/kv/kv_07.jpg"],
  ["/_next/static/media/kv_08.bba09bec.jpg", "images/kv/kv_08.jpg"],
  ["/_next/static/media/kv_09.39dfe48f.jpg", "images/kv/kv_09.jpg"],
  ["/_next/static/media/kv_10.467005e9.jpg", "images/kv/kv_10.jpg"],
  ["/_next/static/media/kv_11.0906b109.jpg", "images/kv/kv_11.jpg"],
  ["/_next/static/media/kv_12.96b2880f.jpg", "images/kv/kv_12.jpg"],
  ["/_next/static/media/kv_13.499e44a5.jpg", "images/kv/kv_13.jpg"],
  ["/_next/static/media/kv_14.fcfc7447.jpg", "images/kv/kv_14.jpg"],
  ["/_next/static/media/kv_15.61e9eeaa.jpg", "images/kv/kv_15.jpg"],
  ["/_next/static/media/kv_16.e57f1aed.jpg", "images/kv/kv_16.jpg"],
  ["/_next/static/media/kv_17.6df8d5be.jpg", "images/kv/kv_17.jpg"],

  // ---- Product images ----
  ["/_next/static/media/product_roof.1a0e3387.jpg", "images/products/roof_1.jpg"],
  ["/_next/static/media/product_roof_2.2d235ab1.jpg", "images/products/roof_2.jpg"],
  ["/_next/static/media/product_wall.7d5eeab6.jpg", "images/products/wall_1.jpg"],
  ["/_next/static/media/product_wall_2.08c3cb5d.jpg", "images/products/wall_2.jpg"],
  ["/_next/static/media/product_panel.874a69e1.jpg", "images/products/panel_1.jpg"],
  ["/_next/static/media/product_panel_2.58208d16.jpg", "images/products/panel_2.jpg"],
  ["/_next/static/media/product_energy.b2dcd064.jpg", "images/products/energy_1.jpg"],
  ["/_next/static/media/product_energy_2.fe0d52ae.jpg", "images/products/energy_2.jpg"],

  // ---- Architects ----
  ["/top/architect_01.jpg", "images/architects/01.jpg"],
  ["/top/architect_02.jpg", "images/architects/02.jpg"],
  ["/top/architect_03.jpg", "images/architects/03.jpg"],

  // ---- Tour event ----
  ["/top/event.jpg", "images/event.jpg"],

  // ---- Favicons ----
  ["/Icons/favicon.ico", "seo/favicon.ico"],
  ["/Icons/favicon-16x16.png", "seo/favicon-16x16.png"],
  ["/Icons/favicon-32x32.png", "seo/favicon-32x32.png"],
  ["/Icons/favicon-96x96.png", "seo/favicon-96x96.png"],
  ["/Icons/apple-touch-icon-57x57.png", "seo/apple-touch-icon-57x57.png"],
  ["/Icons/apple-touch-icon-60x60.png", "seo/apple-touch-icon-60x60.png"],
  ["/Icons/apple-touch-icon-72x72.png", "seo/apple-touch-icon-72x72.png"],
  ["/Icons/apple-touch-icon-76x76.png", "seo/apple-touch-icon-76x76.png"],
  ["/Icons/apple-touch-icon-114x114.png", "seo/apple-touch-icon-114x114.png"],
  ["/Icons/apple-touch-icon-120x120.png", "seo/apple-touch-icon-120x120.png"],
  ["/Icons/apple-touch-icon-144x144.png", "seo/apple-touch-icon-144x144.png"],
  ["/Icons/apple-touch-icon-152x152.png", "seo/apple-touch-icon-152x152.png"],
];

// Absolute external URLs (S3 + Cloudinary)
const EXTERNAL = [
  // Journal article images (S3 CMS)
  ["https://monochrome-cms-images.s3.ap-northeast-1.amazonaws.com/58e05bad-2a27-4eb1-9617-10816bd592d5.png", "images/journal/article_1.png"],
  ["https://monochrome-cms-images.s3.ap-northeast-1.amazonaws.com/da379d8c-fce0-43be-bc70-4350c4a634be.webp", "images/journal/article_2.webp"],
  ["https://monochrome-cms-images.s3.ap-northeast-1.amazonaws.com/455d47af-7947-4821-9cab-0662d968ec69.jpg", "images/journal/article_3.jpg"],
  ["https://monochrome-cms-images.s3.ap-northeast-1.amazonaws.com/3c17f3bd-07b9-4b7f-9054-60aafb653d55.jpg", "images/journal/article_4.jpg"],
  // Hero promo video (Cloudinary)
  ["https://res.cloudinary.com/monochromeso/video/upload/ac_none,vc_auto,c_scale,w_1280/v1753194642/monochrome-power_qdgd5p.mp4", "videos/monochrome-power.mp4"],
];

const FULL = [
  ...ASSETS.map(([src, dest]) => [ORIGIN + src, dest]),
  ...EXTERNAL,
];

async function ensureDir(p) {
  await fs.mkdir(path.dirname(p), { recursive: true });
}

async function downloadOne([src, dest]) {
  const target = path.join(PUBLIC, dest);
  try {
    const stat = await fs.stat(target).catch(() => null);
    if (stat && stat.size > 0) return { skipped: true, dest };
  } catch {}

  await ensureDir(target);
  const res = await fetch(src, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
  });
  if (!res.ok) {
    return { error: `${res.status} ${res.statusText}`, dest, src };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(target, buf);
  return { ok: true, dest, size: buf.length };
}

async function batchedRun(items, concurrency = 4) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const slice = items.slice(i, i + concurrency);
    const r = await Promise.allSettled(slice.map(downloadOne));
    r.forEach((rr) => {
      if (rr.status === "fulfilled") results.push(rr.value);
      else results.push({ error: String(rr.reason) });
    });
  }
  return results;
}

(async () => {
  console.log(`Downloading ${FULL.length} assets to ${PUBLIC} ...`);
  const out = await batchedRun(FULL, 4);
  let ok = 0, skipped = 0, errors = 0;
  for (const r of out) {
    if (r.ok) { ok++; console.log(`  + ${r.dest} (${r.size} bytes)`); }
    else if (r.skipped) { skipped++; }
    else if (r.error) { errors++; console.error(`  ! ${r.dest || r.src} -> ${r.error}`); }
  }
  console.log(`Done. ok=${ok}, skipped=${skipped}, errors=${errors}`);
  if (errors > 0) process.exitCode = 1;
})();
