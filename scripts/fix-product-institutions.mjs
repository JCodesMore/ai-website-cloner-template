#!/usr/bin/env node

/**
 * fix-product-institutions.mjs
 *
 * Fix products in the database that have "机构产品" as their institution.
 * Re-scrapes each product's detail page to extract the correct institution name and href.
 *
 * Usage: node scripts/fix-product-institutions.mjs
 */

import { load } from 'cheerio';
import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const BASE = "https://www.bbxin.com";
const BATCH = 5;
const TIMEOUT = 10000;

function text($, selector) {
  const el = $(selector).first();
  return el ? el.text().trim() : "";
}

function attr($, selector, attrName) {
  const el = $(selector).first();
  return el ? el.attr(attrName) || "" : "";
}

async function scrapInstitution(id) {
  try {
    const resp = await fetch(`${BASE}/products/${id}.html`, {
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!resp.ok) return null;
    const html = await resp.text();
    const $ = load(html);

    // Match institution detail links (/institutions/123.html), NOT breadcrumb
    const instFull = text($, "a[href*='/institutions/']");
    const instHref = attr($, "a[href*='/institutions/']", "href") || "";

    if (!instFull || instFull === "机构产品") return null;

    const shortInst = instFull
      .replace(/（[^）]*）/g, "")
      .replace(/(股份有限公司|有限责任公司|有限公司|股份公司)/g, "")
      .trim()
      .slice(0, 16);

    return { instFull, shortInst, instHref };
  } catch {
    return null;
  }
}

async function main() {
  // Find products with bad institution data
  const { rows: badProducts } = await pool.query(`
    SELECT DISTINCT id, name FROM products
    WHERE institution = '机构产品' OR institution_full_name = '机构产品' OR institution_href = '/institutions.html'
    ORDER BY id
  `);

  console.log(`Found ${badProducts.length} products with bad institution data\n`);

  let fixed = 0, failed = 0, skipped = 0;

  for (let i = 0; i < badProducts.length; i += BATCH) {
    const batch = badProducts.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async (p) => {
        const data = await scrapInstitution(p.id);
        return { id: p.id, name: p.name, data };
      })
    );

    for (const r of results) {
      if (!r.data) {
        failed++;
        process.stdout.write(`\r  [${i + batch.indexOf(r) + 1}/${badProducts.length}] ${r.id} ${r.name}: FAILED`);
        continue;
      }

      const { instFull, shortInst, instHref } = r.data;

      try {
        await pool.query(
          `UPDATE products SET institution = $1, institution_full_name = $2, institution_href = $3, updated_at = NOW() WHERE id = $4`,
          [shortInst, instFull, instHref, r.id]
        );
        fixed++;
        process.stdout.write(`\r  [${i + batch.indexOf(r) + 1}/${badProducts.length}] ${r.id} ${r.name}: "${shortInst}" ← "${instFull}"`);
      } catch (err) {
        failed++;
        process.stdout.write(`\r  [${i + batch.indexOf(r) + 1}/${badProducts.length}] ${r.id} ${r.name}: DB ERROR - ${err.message}`);
      }
    }

    // Small delay between batches
    if (i + BATCH < badProducts.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\n\nDone. Fixed: ${fixed} | Failed: ${failed} | Skipped: ${skipped}`);
  await pool.end();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
