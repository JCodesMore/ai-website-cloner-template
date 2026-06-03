// Replace /images/remote/... paths with full bbxin CDN URLs.
// Run: npx tsx scripts/fix-remote-images.ts
// Scans bbxin CDN to find correct year/month for each filename.

import { db, schema } from "../src/lib/db";
import { eq, like, and, sql } from "drizzle-orm";

const BBXIN_CDN = "https://www.bbxin.com/storage";
// Try recent months first (most files are from these)
const MONTHS = [
  "2026/06", "2026/05", "2026/04", "2026/03", "2026/02", "2026/01",
  "2025/12", "2025/11", "2025/10", "2025/09", "2025/08", "2025/07",
];

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};

async function findBbxinUrl(filename: string): Promise<string | null> {
  for (const month of MONTHS) {
    const url = `${BBXIN_CDN}/${month}/${filename}`;
    try {
      const r = await fetch(url, { method: "HEAD", headers: HEADERS });
      if (r.ok) return url;
    } catch {
      // continue
    }
  }
  return null;
}

async function main() {
  // Find all products with /images/remote/ paths
  const rows = await db
    .select({ id: schema.products.id, name: schema.products.name, image: schema.products.image })
    .from(schema.products)
    .where(like(schema.products.image, "/images/remote/%"));

  console.log(`Found ${rows.length} products with /images/remote/ paths\n`);

  let updated = 0;
  let failed = 0;

  // Process unique filenames in parallel batches
  const uniqueFiles = [...new Set(rows.map(r => r.image!.replace("/images/remote/", "")))];
  console.log(`${uniqueFiles.length} unique filenames to resolve\n`);

  const fileToUrl = new Map<string, string | null>();
  const BATCH = 10;

  for (let i = 0; i < uniqueFiles.length; i += BATCH) {
    const batch = uniqueFiles.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(async (filename) => {
      const url = await findBbxinUrl(filename);
      return { filename, url };
    }));
    for (const { filename, url } of results) {
      fileToUrl.set(filename, url);
    }
    if (i > 0 && i % 100 === 0) console.log(`  Resolved ${i}/${uniqueFiles.length} filenames...`);
  }

  console.log(`Resolved ${uniqueFiles.length} filenames, updating DB...\n`);

  for (const row of rows) {
    const filename = row.image!.replace("/images/remote/", "");
    const url = fileToUrl.get(filename);
    if (url) {
      await db.update(schema.products).set({ image: url }).where(eq(schema.products.id, row.id));
      updated++;
    } else {
      failed++;
      console.log(`  FAIL #${row.id} ${row.name}: ${filename}`);
    }
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
