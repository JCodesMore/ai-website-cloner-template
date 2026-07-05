import fs from "node:fs";
import path from "node:path";

const IMAGE_URLS = fs.readFileSync("/tmp/all_assets.txt", "utf-8")
  .split("\n").map(s => s.trim()).filter(Boolean)
  .map(u => u.startsWith("http") ? u : "https:" + u);

const VIDEO_URLS = [
  "https://onday.fr/cdn/shop/videos/c/vp/66f2d2c28870466eae358b3516f57eb6/66f2d2c28870466eae358b3516f57eb6.HD-1080p-7.2Mbps-77993130.mp4",
  "https://onday.fr/cdn/shop/videos/c/vp/de9997efe0724c9792f0da671514477d/de9997efe0724c9792f0da671514477d.HD-1080p-7.2Mbps-77839928.mp4",
];

async function downloadOne(url, outDir) {
  const filename = decodeURIComponent(path.basename(new URL(url).pathname));
  const outPath = path.join(outDir, filename);
  if (fs.existsSync(outPath)) return { url, outPath, skipped: true };
  const res = await fetch(url);
  if (!res.ok) return { url, error: `HTTP ${res.status}` };
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, buf);
  return { url, outPath, bytes: buf.length };
}

async function downloadBatch(urls, outDir, concurrency = 4) {
  const results = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(u => downloadOne(u, outDir).catch(e => ({ url: u, error: e.message }))));
    results.push(...batchResults);
    console.log(`Downloaded ${Math.min(i + concurrency, urls.length)}/${urls.length}`);
  }
  return results;
}

const imgResults = await downloadBatch(IMAGE_URLS, "public/images/onday");
const vidResults = await downloadBatch(VIDEO_URLS, "public/videos/onday");

const errors = [...imgResults, ...vidResults].filter(r => r.error);
console.log(`\nDone. ${imgResults.length} images, ${vidResults.length} videos processed.`);
if (errors.length) {
  console.log(`Errors (${errors.length}):`);
  errors.forEach(e => console.log(`  ${e.url}: ${e.error}`));
}
