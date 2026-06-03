#!/usr/bin/env node

/**
 * sync-all-ik-mapping.mjs
 *
 * Root fix: scrape ALL product listing pages (person, fast, pledge) from
 * bbxin.com for each ik filter to build a complete product→ik mapping.
 * This eliminates keyword-based classification entirely.
 *
 * Usage: node scripts/sync-all-ik-mapping.mjs
 */

import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CATEGORIES = ['person', 'fast', 'pledge'];
const IK_VALUES = ['socb', 'jscb', 'cfc', 'lmc', 'other'];
const MAPPING_PATH = resolve(ROOT, 'src/data/product-ik-mapping.json');

// Load existing company mapping as base
const EXISTING_PATH = resolve(ROOT, 'src/data/company-ik-mapping.json');
const existing = existsSync(EXISTING_PATH)
  ? JSON.parse(readFileSync(EXISTING_PATH, 'utf-8'))
  : {};
const productIkMap = {};
for (const [id, ik] of Object.entries(existing)) {
  if (id !== 'description' && id !== 'generated') {
    productIkMap[id] = ik;
  }
}
console.log(`Starting with ${Object.keys(productIkMap).length} products from company page`);

async function scrapeCategory(browser, category) {
  const catMap = {};
  let newCount = 0;

  for (const ik of IK_VALUES) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 Chrome/120.0',
      locale: 'zh-CN',
    });
    const page = await ctx.newPage();
    let pageNum = 1;

    try {
      while (pageNum <= 20) {
        const url = `https://www.bbxin.com/products/${category}.html?ik=${ik}&page=${pageNum}`;
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(500);

        const result = await page.evaluate(() => {
          const ids = [];
          document.querySelectorAll('a[href*="/products/"][href*="/"]').forEach(el => {
            const href = el.getAttribute('href') || '';
            const m = href.match(/\/(\d+)(?:\.html)?/);
            if (m) ids.push(parseInt(m[1]));
          });
          const pageLinks = Array.from(document.querySelectorAll('.GPageLink'))
            .map(l => l.textContent.trim());
          const maxPage = Math.max(...pageLinks.map(t => parseInt(t)).filter(n => !isNaN(n)), 1);
          return { ids: [...new Set(ids)], maxPage };
        });

        if (result.ids.length === 0) break;

        for (const id of result.ids) {
          if (!productIkMap[String(id)]) {
            catMap[String(id)] = ik;
            productIkMap[String(id)] = ik;
            newCount++;
          }
        }

        process.stdout.write(`\r  ${category}/${ik} p${pageNum}/${result.maxPage}: +${result.ids.length} ids (${newCount} new)`);

        if (pageNum >= result.maxPage) break;
        pageNum++;
      }
    } catch (err) {
      process.stdout.write(`\r  ${category}/${ik}: ERROR ${err.message}`);
    } finally {
      await ctx.close();
    }
  }

  return { catMap, newCount };
}

async function main() {
  console.log('\n=== Building Complete Product IK Mapping ===\n');

  const browser = await chromium.launch({ headless: true });

  for (const cat of CATEGORIES) {
    console.log(`\nScraping ${cat}:`);
    const { newCount } = await scrapeCategory(browser, cat);
    console.log(`\n  → ${newCount} new products added`);
  }

  await browser.close();

  // Write final mapping
  const sorted = Object.entries(productIkMap)
    .map(([id, ik]) => [parseInt(id), ik])
    .sort(([a], [b]) => a - b);

  const counts = {};
  for (const [, ik] of sorted) {
    counts[ik] = (counts[ik] || 0) + 1;
  }

  const result = {
    description: 'Product ID → institution type (ik) mapping from bbxin.com all listing pages',
    generated: new Date().toISOString(),
    totalProducts: sorted.length,
    counts,
    mapping: Object.fromEntries(sorted.map(([id, ik]) => [String(id), ik])),
  };

  writeFileSync(MAPPING_PATH, JSON.stringify(result, null, 2));
  console.log(`\n\nSaved to ${MAPPING_PATH}`);
  console.log(`Total: ${sorted.length} products`);
  console.log('Counts:', JSON.stringify(counts));
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
