#!/usr/bin/env node

/**
 * sync-ik-mapping.mjs
 *
 * Root fix: Scrape the target site's company page for each ik (institution type)
 * to build a correct product → ik mapping. This replaces keyword-based guessing
 * with the actual classification from bbxin.com.
 *
 * Usage: node scripts/sync-ik-mapping.mjs
 */

import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const REMOTE_BASE = 'https://www.bbxin.com/products/company.html';
const MAPPING_PATH = resolve(ROOT, 'src/data/institution-type-map.json');

const IK_VALUES = ['', 'socb', 'jscb', 'cfc', 'lmc', 'other'];
const IK_LABELS = { '': 'all', socb: '国有银行', jscb: '商业银行', cfc: '消费金融', lmc: '贷款撮合', other: '其他' };

async function getAllProductIds(browser, ik) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    locale: 'zh-CN',
  });
  const page = await ctx.newPage();

  const url = ik ? `${REMOTE_BASE}?ik=${ik}` : REMOTE_BASE;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);

  const ids = new Set();

  // Check if there's pagination
  const hasPagination = await page.evaluate(() => {
    const pagination = document.querySelectorAll('.org-pagination-wrap a, .GPageLink');
    return pagination.length > 0;
  });

  let currentPage = 1;
  const maxPages = 20; // safety limit

  while (currentPage <= maxPages) {
    // Extract product IDs from current page
    const pageIds = await page.evaluate(() => {
      const ids = [];
      document.querySelectorAll('.section-table a[href*="/products/"]').forEach(el => {
        const href = el.getAttribute('href') || '';
        const m = href.match(/\/(\d+)(?:\.html)?/);
        if (m && !ids.includes(m[1])) ids.push(m[1]);
      });
      return ids;
    });

    pageIds.forEach(id => ids.add(id));

    // Check for next page
    const nextPageUrl = await page.evaluate(() => {
      const nextLink = document.querySelector('.GPageLink:last-child, a:has-text("下一页")');
      if (nextLink) {
        const href = nextLink.getAttribute('href');
        return href && href !== 'javascript:;' ? href : null;
      }
      return null;
    });

    if (!nextPageUrl || currentPage > 1) break; // only page 1 for now since we already get all

    // Navigate to next page
    try {
      await page.goto(nextPageUrl.startsWith('http') ? nextPageUrl : `https://www.bbxin.com${nextPageUrl}`, {
        waitUntil: 'networkidle', timeout: 15000
      });
      await page.waitForTimeout(500);
      currentPage++;
    } catch {
      break;
    }
  }

  await ctx.close();
  return [...ids].map(Number).sort((a, b) => a - b);
}

async function getAllPages(browser, ik, pageNum) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    locale: 'zh-CN',
  });
  const page = await ctx.newPage();

  const url = ik
    ? `${REMOTE_BASE}?ik=${ik}&page=${pageNum}`
    : `${REMOTE_BASE}?page=${pageNum}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);

  const ids = await page.evaluate(() => {
    const ids = [];
    document.querySelectorAll('.section-table a[href*="/products/"]').forEach(el => {
      const href = el.getAttribute('href') || '';
      const m = href.match(/\/(\d+)(?:\.html)?/);
      if (m) ids.push(m[1]);
    });
    return ids;
  });

  const totalPages = await page.evaluate(() => {
    const links = document.querySelectorAll('.GPageLink');
    let max = 1;
    links.forEach(l => {
      const n = parseInt(l.textContent.trim());
      if (!isNaN(n) && n > max) max = n;
    });
    return max;
  });

  await ctx.close();
  return { ids: ids.map(Number), totalPages };
}

async function main() {
  console.log('=== Sync IK Mapping from Target Site ===\n');

  const browser = await chromium.launch({ headless: true });

  const productTypeMap = {}; // productId → ik

  for (const ik of IK_VALUES) {
    const label = IK_LABELS[ik];
    process.stdout.write(`Scraping ${label} (ik=${ik || '(all)'})...`);

    try {
      // Get first page and detect total pages
      const { ids: firstPageIds, totalPages } = await getAllPages(browser, ik, 1);

      for (const id of firstPageIds) {
        if (!productTypeMap[id] || ik === '') {
          productTypeMap[id] = ik;
        }
      }

      console.log(` page 1: ${firstPageIds.length} products, ${totalPages} total pages`);

      // Get remaining pages
      for (let p = 2; p <= totalPages; p++) {
        const { ids } = await getAllPages(browser, ik, p);
        for (const id of ids) {
          productTypeMap[id] = ik;
        }
        process.stdout.write(`\rScraping ${label} (ik=${ik || '(all)'})... page ${p}/${totalPages}: ${ids.length} products`);
      }
    } catch (err) {
      console.log(` ERROR: ${err.message}`);
    }
  }

  await browser.close();

  // Build final map
  const entries = Object.entries(productTypeMap)
    .map(([id, ik]) => [parseInt(id), ik])
    .sort((a, b) => a[0] - b[0]);

  const result = {
    description: 'Institution type (ik) mapping from bbxin.com company listing page',
    generated: new Date().toISOString(),
    totalProducts: entries.length,
    counts: {},
    mapping: Object.fromEntries(entries),
  };

  for (const [, ik] of entries) {
    result.counts[ik || 'all'] = (result.counts[ik || 'all'] || 0) + 1;
  }

  writeFileSync(MAPPING_PATH, JSON.stringify(result, null, 2));
  console.log(`\n\nSaved mapping to ${MAPPING_PATH}`);
  console.log('Counts:', JSON.stringify(result.counts));
  console.log(`Total unique products: ${entries.length}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
