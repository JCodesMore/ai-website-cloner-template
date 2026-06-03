import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const IMG_DIR = resolve(ROOT, "public", "images", "remote");
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

const urls = readFileSync(resolve(ROOT, "bbxin-images.txt"), "utf-8").trim().split("\n").filter(Boolean);
console.log(`Downloading ${urls.length} unique images...`);

const BATCH = 10;
let downloaded = 0, failed = 0, skipped = 0;

for (let i = 0; i < urls.length; i += BATCH) {
  const batch = urls.slice(i, i + BATCH);
  const results = await Promise.all(batch.map(async (url) => {
    const name = basename(url);
    const dest = resolve(IMG_DIR, name);
    if (existsSync(dest)) return { status: "skip" };
    try {
      const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!resp.ok) return { status: "fail", url };
      const buf = Buffer.from(await resp.arrayBuffer());
      writeFileSync(dest, buf);
      return { status: "ok" };
    } catch { return { status: "fail", url }; }
  }));
  downloaded += results.filter(r => r.status === "ok").length;
  failed += results.filter(r => r.status === "fail").length;
  skipped += results.filter(r => r.status === "skip").length;
  const done = Math.min(i + BATCH, urls.length);
  process.stdout.write(`\r${done}/${urls.length} | ok=${downloaded} skip=${skipped} fail=${failed}`);
}

console.log(`\nDone. Downloaded ${downloaded}, skipped ${skipped}, failed ${failed}`);
