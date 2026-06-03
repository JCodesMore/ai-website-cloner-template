import { db, schema } from "../src/lib/db";
import { like, eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const OUT_DIR = path.join(process.cwd(), "public", "images", "products");
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const r = await fetch(url, { headers: HEADERS });
    if (!r.ok) return false;
    const buf = Buffer.from(await r.arrayBuffer());
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const rows = await db
    .select({ id: schema.products.id, name: schema.products.name, image: schema.products.image })
    .from(schema.products)
    .where(like(schema.products.image, "https://www.bbxin.com/storage/%"));

  console.log(`Found ${rows.length} products with bbxin CDN images\n`);

  const uniqueUrls = [...new Set(rows.map(r => r.image!))];
  console.log(`${uniqueUrls.length} unique URLs to download\n`);

  let downloaded = 0;
  let failed = 0;
  const BATCH = 5;

  for (let i = 0; i < uniqueUrls.length; i += BATCH) {
    const batch = uniqueUrls.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(async (url) => {
      const filename = url.split("/").pop()!;
      const dest = path.join(OUT_DIR, filename);
      if (fs.existsSync(dest)) return { url, ok: true };
      const ok = await download(url, dest);
      return { url, ok };
    }));

    for (const { ok } of results) {
      if (ok) downloaded++; else failed++;
    }
    if ((i + BATCH) % 50 === 0 || i + BATCH >= uniqueUrls.length) {
      console.log(`  ${downloaded}/${uniqueUrls.length} downloaded (${failed} failed)`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDownload done: ${downloaded} ok, ${failed} failed`);
  console.log("Updating DB to local paths...");

  let updated = 0;
  for (const row of rows) {
    const filename = row.image!.split("/").pop()!;
    const dest = path.join(OUT_DIR, filename);
    if (fs.existsSync(dest)) {
      await db.update(schema.products).set({ image: `/images/products/${filename}` }).where(eq(schema.products.id, row.id));
      updated++;
    }
  }
  console.log(`Updated ${updated} products.`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
