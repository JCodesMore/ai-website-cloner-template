#!/usr/bin/env node

/**
 * compare-company-filters.mjs
 *
 * Compare company page filter options and results between local and remote.
 */

import { chromium } from 'playwright';

const REMOTE = 'https://www.bbxin.com/products/company.html';
const LOCAL = 'http://localhost:3002/products/company';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

async function extractFilter(page) {
  return page.evaluate(() => {
    const sections = [];
    const rows = document.querySelectorAll('.ley-filter .row');
    rows.forEach(row => {
      const title = row.querySelector('.title')?.textContent?.trim().replace(/[：:]\s*$/, '') || '';
      const options = [];
      row.querySelectorAll('.list .item').forEach(item => {
        const link = item.closest('a');
        options.push({
          label: item.textContent.trim(),
          active: item.classList.contains('active'),
          href: link?.getAttribute('href') || '',
        });
      });
      sections.push({ title, options });
    });
    return sections;
  });
}

async function extractProducts(page) {
  return page.evaluate(() => {
    const products = [];
    document.querySelectorAll('.product-card, .product-row, [class*="product-item"]').forEach(card => {
      const name = card.querySelector('h3, [class*="name"], [class*="title"]')?.textContent?.trim();
      if (name) products.push(name);
    });
    // Fallback: count product links
    if (products.length === 0) {
      const links = document.querySelectorAll('.ley-product-list a[href*="/products/"]');
      links.forEach(a => { if (a.textContent.trim()) products.push(a.textContent.trim().slice(0, 30)); });
    }
    return products;
  });
}

async function extractTotals(page) {
  return page.evaluate(() => {
    const body = document.body.innerText;
    const m = body.match(/共\s*(\d+)\s*个/);
    const total = m ? parseInt(m[1]) : 0;

    // Count visible product rows
    const productLinks = document.querySelectorAll('.ley-product-list a[href*="/products/detail/"], .ley-product-list a[href*="/products/company/"]');
    const productNames = new Set();
    productLinks.forEach(a => {
      const name = a.querySelector('h3')?.textContent?.trim() || a.textContent?.trim();
      if (name && name.length > 1) productNames.add(name);
    });

    return { total, visibleProducts: productNames.size };
  });
}

async function testFilter(page, ik, tag, adv) {
  const params = new URLSearchParams();
  if (ik) params.set('ik', ik);
  if (tag) params.set('tag', tag);
  if (adv) params.set('adv', adv);
  const url = page.url().split('?')[0] + (params.toString() ? '?' + params : '');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);
  return extractTotals(page);
}

async function main() {
  console.log('=== Company Page Filter Comparison ===\n');

  const browser = await chromium.launch({ headless: true });

  // Step 1: Compare filter options
  console.log('Step 1: Comparing filter options...\n');

  for (const [name, url] of [['Remote', REMOTE], ['Local', LOCAL]]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: USER_AGENT,
      locale: 'zh-CN',
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const filters = await extractFilter(page);
    console.log(`--- ${name} (${url}) ---`);
    for (const section of filters) {
      console.log(`  ${section.title}:`);
      for (const opt of section.options) {
        console.log(`    ${opt.active ? '✓' : ' '} ${opt.label} (${opt.href.split('?')[1] || '(all)'})`);
      }
    }
    await ctx.close();
  }

  // Step 2: Compare filtered counts
  console.log('\nStep 2: Comparing filtered product counts...\n');

  const testCases = [
    { label: 'No filter', ik: '', tag: '', adv: '' },
    { label: '国有银行', ik: 'socb', tag: '', adv: '' },
    { label: '商业银行', ik: 'jscb', tag: '', adv: '' },
    { label: '消费金融', ik: 'cfc', tag: '', adv: '' },
    { label: '贷款撮合', ik: 'lmc', tag: '', adv: '' },
    { label: '专精特新', ik: '', tag: '24', adv: '' },
    { label: '国高新', ik: '', tag: '25', adv: '' },
    { label: '3-5年', ik: '', tag: '', adv: '35' },
    { label: '先息后本', ik: '', tag: '', adv: '41' },
    { label: '线下', ik: '', tag: '', adv: '60' },
    { label: '商业银行+3-5年', ik: 'jscb', tag: '', adv: '35' },
    { label: '国有银行+先息后本', ik: 'socb', tag: '', adv: '41' },
  ];

  for (const tc of testCases) {
    const results = {};
    for (const [name, url] of [['Remote', REMOTE], ['Local', LOCAL]]) {
      const ctx = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: USER_AGENT,
        locale: 'zh-CN',
      });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(500);
      results[name] = await testFilter(page, tc.ik, tc.tag, tc.adv);
      await ctx.close();
    }

    const match = results.Remote.visibleProducts === results.Local.visibleProducts ? '✅' : '❌';
    console.log(`${match} ${tc.label}: Remote=${results.Remote.visibleProducts}P/${results.Remote.total}T | Local=${results.Local.visibleProducts}P/${results.Local.total}T`);
  }

  await browser.close();
  console.log('\nDone.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
