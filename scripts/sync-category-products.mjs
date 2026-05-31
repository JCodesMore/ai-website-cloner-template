#!/usr/bin/env node

/**
 * sync-category-products.mjs
 *
 * Root fix: Scrape ALL products from each category listing page on bbxin.com,
 * then update the local database's category column to match.
 *
 * Usage: node scripts/sync-category-products.mjs
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import "dotenv/config";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const CATEGORIES = ['company', 'person', 'fast', 'pledge'];

async function getAllProductIds(browser, category) {
  const ids = new Set();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    locale: 'zh-CN',
  });
  const page = await ctx.newPage();
  let pageNum = 1;

  try {
    while (pageNum <= 50) {
      const url = `https://www.bbxin.com/products/${category}.html?page=${pageNum}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(500);

      const result = await page.evaluate(() => {
        const ids = [];
        document.querySelectorAll('a[href*="/products/"][href*="/"]').forEach(el => {
          const m = (el.getAttribute('href') || '').match(/\/(\d+)(?:\.html)?/);
          if (m) ids.push(parseInt(m[1]));
        });
        const pageLinks = Array.from(document.querySelectorAll('.GPageLink'))
          .map(l => l.textContent.trim());
        const maxPage = Math.max(...pageLinks.map(t => parseInt(t)).filter(n => !isNaN(n)), 1);
        return { ids: [...new Set(ids)], maxPage, hasContent: ids.length > 0 };
      });

      if (!result.hasContent) break;
      result.ids.forEach(id => ids.add(id));
      process.stdout.write(`\r  ${category} p${pageNum}/${result.maxPage}: ${result.ids.length} visible (total: ${ids.size})`);

      if (pageNum >= result.maxPage) break;
      pageNum++;
    }
  } catch (err) {
    process.stdout.write(`\r  ${category}: ERROR ${err.message}`);
  } finally {
    await ctx.close();
  }

  return [...ids].sort((a, b) => a - b);
}

async function main() {
  console.log('=== Sync Category Product Lists from Target Site ===\n');

  const browser = await chromium.launch({ headless: true });
  const categoryProducts = {};

  // Step 1: Get all product IDs for each category from remote
  for (const cat of CATEGORIES) {
    console.log(`\nScraping ${cat}:`);
    const ids = await getAllProductIds(browser, cat);
    categoryProducts[cat] = ids;
    console.log(`\n  → ${ids.length} products`);
  }

  await browser.close();

  // Step 2: Build the mapping (product → categories it appears in)
  const catMap = {}; // Set<category> per product
  for (const [cat, ids] of Object.entries(categoryProducts)) {
    for (const id of ids) {
      if (!catMap[id]) catMap[id] = new Set();
      catMap[id].add(cat);
    }
  }

  // Step 3: Update database categories
  console.log('\n=== Updating Database Categories ===\n');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let updated = 0;
    for (const [productId, cats] of Object.entries(catMap)) {
      const targetCat = cats.has('company') ? 'company' :
                        cats.has('person') ? 'person' :
                        cats.has('fast') ? 'fast' :
                        cats.has('pledge') ? 'pledge' : null;
      if (!targetCat) continue;

      // Check current category
      const { rows: [current] } = await client.query(
        'SELECT id, category FROM products WHERE id = $1', [parseInt(productId)]
      );
      if (!current) continue;

      if (current.category !== targetCat) {
        await client.query(
          'UPDATE products SET category = $1, updated_at = NOW() WHERE id = $2',
          [targetCat, parseInt(productId)]
        );
        updated++;
        process.stdout.write(`\r  Updated: ${updated} (${productId}: ${current.category} → ${targetCat})`);
      }
    }

    await client.query('COMMIT');
    console.log(`\n\nDone. Updated ${updated} products.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error:', err.message);
  } finally {
    client.release();
  }

  // Save category product lists for reference
  const result = {
    description: 'Product IDs per category from bbxin.com',
    generated: new Date().toISOString(),
    categories: Object.fromEntries(
      Object.entries(categoryProducts).map(([cat, ids]) => [cat, { total: ids.length, ids }])
    ),
  };
  writeFileSync(resolve(ROOT, 'src/data/category-products.json'), JSON.stringify(result, null, 2));
  console.log('Category product lists saved to src/data/category-products.json');

  await pool.end();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
