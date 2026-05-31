#!/usr/bin/env node

/**
 * diff-filter-products.mjs
 *
 * Extract product names from both sites for each filter value to identify differences.
 */

import { chromium } from 'playwright';

const REMOTE_BASE = 'https://www.bbxin.com/products/company.html';
const LOCAL_BASE = 'http://localhost:3002/products/company';

async function getProductNames(page) {
  return page.evaluate(() => {
    const names = [];
    // Try multiple selectors for both sites
    const selectors = [
      '.product-name',           // local: ProductCard component
      '.ley-product-card h3',    // fallback
      'h3[class*="name"]',       // generic
      'a[href*="/products/"] .product-name',
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const n = el.textContent.trim();
        if (n && n.length > 1 && !n.includes('加载')) names.push(n);
      });
      if (names.length > 0) break;
    }
    return [...new Set(names)].sort();
  });
}

async function getProductsForFilter(browser, baseUrl, ik, tag, adv) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 Chrome/120.0',
    locale: 'zh-CN',
  });
  const page = await ctx.newPage();

  const params = new URLSearchParams();
  if (ik) params.set('ik', ik);
  if (tag) params.set('tag', tag);
  if (adv) params.set('adv', adv);
  const url = baseUrl + (params.toString() ? '?' + params : '');

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);

  const names = await getProductNames(page);
  await ctx.close();
  return names;
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  const testCases = [
    { label: '消费金融', ik: 'cfc', tag: '', adv: '' },
    { label: '贷款撮合', ik: 'lmc', tag: '', adv: '' },
    { label: '商业银行+3-5年', ik: 'jscb', tag: '', adv: '35' },
  ];

  for (const tc of testCases) {
    console.log(`\n=== ${tc.label} ===`);
    const [remoteProducts, localProducts] = await Promise.all([
      getProductsForFilter(browser, REMOTE_BASE, tc.ik, tc.tag, tc.adv),
      getProductsForFilter(browser, LOCAL_BASE, tc.ik, tc.tag, tc.adv),
    ]);

    console.log(`Remote (${remoteProducts.length}): ${remoteProducts.join(', ')}`);
    console.log(`Local  (${localProducts.length}): ${localProducts.join(', ')}`);

    const remoteSet = new Set(remoteProducts);
    const localSet = new Set(localProducts);
    const onlyRemote = remoteProducts.filter(n => !localSet.has(n));
    const onlyLocal = localProducts.filter(n => !remoteSet.has(n));

    if (onlyRemote.length) console.log(`  Only in remote: ${onlyRemote.join(', ')}`);
    if (onlyLocal.length) console.log(`  Only in local:  ${onlyLocal.join(', ')}`);
  }

  await browser.close();
  console.log('\nDone.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
