#!/usr/bin/env node

/**
 * compare-capture.mjs
 *
 * Phase 1: Capture screenshots + DOM snapshots for all product detail pages.
 * Visits each product on localhost and bbxin.com, at desktop and mobile viewports.
 *
 * Usage: node scripts/compare-capture.mjs [--force]
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PRODUCTS_PATH = resolve(ROOT, 'src/data/productDetails.json');
const CAPTURES_DIR  = resolve(ROOT, 'docs/compare/captures');
const LOCAL_DIR     = resolve(CAPTURES_DIR, 'local');
const REMOTE_DIR    = resolve(CAPTURES_DIR, 'remote');
const DOM_DIR       = resolve(CAPTURES_DIR, 'dom');

const LOCAL_BASE  = 'http://localhost:3000';
const REMOTE_BASE = 'https://bbxin.com';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile:  { width: 375, height: 812 },
};

const TIMEOUT = 30_000;
const CONCURRENCY = 4;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const delay = ms => new Promise(r => setTimeout(r, ms));

const COMPUTED_STYLE_PROPS = [
  'color', 'font-size', 'font-weight', 'line-height', 'text-align',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'background-color', 'border', 'border-radius', 'box-shadow',
  'display', 'width', 'height',
];

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

/** Extract DOM snapshot with computed styles from the page */
async function extractDomSnapshot(page) {
  const styleProps = COMPUTED_STYLE_PROPS;
  return page.evaluate((props) => {
    /** Recursively walk elements and extract data */
    function walkElements(node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return null;

      const el = node;
      const comp = window.getComputedStyle(el);

      const styles = {};
      for (const prop of props) {
        styles[prop] = comp.getPropertyValue(prop);
      }

      const result = {
        tag: el.tagName.toLowerCase(),
        className: el.className || '',
        id: el.id || '',
        text: (el.childNodes.length === 1 && el.firstChild?.nodeType === 3)
          ? el.textContent.trim() : '',
        attrs: {},
        styles,
        children: [],
      };

      for (const attr of el.attributes) {
        result.attrs[attr.name] = attr.value;
      }

      for (const child of el.children) {
        const sub = walkElements(child);
        if (sub) result.children.push(sub);
      }

      return result;
    }

    const metaDesc = document.querySelector('meta[name="description"]');

    return {
      title: document.title,
      metaDescription: metaDesc?.getAttribute('content') || '',
      body: walkElements(document.body),
    };
  }, styleProps);
}

/** Capture one product at one viewport from one origin */
async function captureOne(browser, productId, productName, origin, viewportKey) {
  const isLocal = origin === 'local';
  const baseUrl = isLocal ? LOCAL_BASE : REMOTE_BASE;
  const url = `${baseUrl}/products/${productId}.html`;
  const screenshotDir = resolve(isLocal ? LOCAL_DIR : REMOTE_DIR, viewportKey);
  const screenshotPath = resolve(screenshotDir, `${productId}.png`);
  const domDir = resolve(DOM_DIR, isLocal ? 'local' : 'remote');
  const domPath = resolve(domDir, `${productId}.json`);

  ensureDir(screenshotDir);
  ensureDir(domDir);

  // Skip if already captured (unless --force)
  if (!process.argv.includes('--force') && existsSync(screenshotPath) && existsSync(domPath)) {
    return { productId, viewport: viewportKey, origin, status: 'skipped' };
  }

  const context = await browser.newContext({
    viewport: VIEWPORTS[viewportKey],
    userAgent: USER_AGENT,
    locale: 'zh-CN',
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });

    // Wait for the detail content to render
    try {
      await page.waitForSelector('.ley-detail-content', { timeout: 10_000 });
    } catch {
      // If selector doesn't appear, still screenshot what we have
      console.warn(`  [warn] .ley-detail-content not found: ${origin}/${viewportKey}/${productId}`);
    }

    await delay(500); // let fonts/layout settle

    // Screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // DOM snapshot
    const dom = await extractDomSnapshot(page);
    writeFileSync(domPath, JSON.stringify(dom, null, 2));

    return { productId, viewport: viewportKey, origin, status: 'ok' };
  } catch (err) {
    console.error(`  [error] ${origin}/${viewportKey}/${productId} (${productName}): ${err.message}`);
    return { productId, viewport: viewportKey, origin, status: 'error', error: err.message };
  } finally {
    await context.close();
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Phase 1: Capture screenshots + DOM ===');

  // Read products
  const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));
  if (!Array.isArray(products)) throw new Error('Expected products to be an array');
  products.forEach((p, i) => {
    if (!p.id) throw new Error(`Product at index ${i} missing "id"`);
    if (!p.name) throw new Error(`Product at index ${i} missing "name"`);
  });
  console.log(`Products to capture: ${products.length}`);

  // Ensure output dirs
  ensureDir(CAPTURES_DIR);
  for (const origin of ['local', 'remote']) {
    for (const vp of Object.keys(VIEWPORTS)) {
      ensureDir(resolve(CAPTURES_DIR, origin, vp));
    }
  }
  for (const origin of ['local', 'remote']) {
    ensureDir(resolve(DOM_DIR, origin));
  }

  const browser = await chromium.launch({ headless: true });

  // Build all capture tasks
  const tasks = [];
  for (const product of products) {
    for (const origin of ['local', 'remote']) {
      for (const vp of Object.keys(VIEWPORTS)) {
        tasks.push({ productId: product.id, productName: product.name, origin, viewport: vp });
      }
    }
  }

  console.log(`Total capture tasks: ${tasks.length}`);
  console.log();

  // Process with concurrency control
  const results = [];
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(t => captureOne(browser, t.productId, t.productName, t.origin, t.viewport))
    );
    results.push(...batchResults);

    // Progress
    const done = Math.min(i + CONCURRENCY, tasks.length);
    const ok = results.filter(r => r.status === 'ok').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const errs = results.filter(r => r.status === 'error').length;
    process.stdout.write(`\rProgress: ${done}/${tasks.length} | OK: ${ok} | Skipped: ${skipped} | Errors: ${errs}`);
  }

  console.log('\n');

  // Summary
  const summary = {
    total: tasks.length,
    ok: results.filter(r => r.status === 'ok').length,
    skipped: results.filter(r => r.status === 'skipped').length,
    errors: results.filter(r => r.status === 'error').length,
    errorDetails: results.filter(r => r.status === 'error').map(r => ({
      productId: r.productId, viewport: r.viewport, origin: r.origin, error: r.error,
    })),
  };

  const summaryPath = resolve(CAPTURES_DIR, 'capture-summary.json');
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`Capture summary saved to ${summaryPath}`);

  if (summary.errors > 0) process.exitCode = 1;

  await browser.close();
  console.log('Capture complete.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
