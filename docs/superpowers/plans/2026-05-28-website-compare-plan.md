# Website Comparison Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a three-phase automated comparison pipeline that captures screenshots + DOM snapshots of 164 product detail pages (local vs bbxin.com, desktop + mobile viewports), runs pixel and DOM diffing, and generates an HTML report.

**Architecture:** Three independent Node.js scripts communicating via disk files under `docs/compare/`. Phase 1 captures data, Phase 2 compares (pixel + DOM separately), Phase 3 generates HTML report.

**Tech Stack:** Node.js ESM scripts, Playwright (browser automation), sharp + pixelmatch (image diffing), no framework.

---

### Task 1: Install dependencies and add npm scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install pixelmatch playwright
npx playwright install chromium
```

Expected: `pixelmatch` and `playwright` added to `node_modules/`, Chromium browser installed.

- [ ] **Step 2: Add npm scripts to package.json**

Edit `package.json`, add to the `"scripts"` section (before the closing `}` of scripts):

```json
    "compare:capture": "node scripts/compare-capture.mjs",
    "compare:pixel": "node scripts/compare-pixel.mjs",
    "compare:dom": "node scripts/compare-dom.mjs",
    "compare:report": "node scripts/compare-report.mjs",
    "compare:all": "npm run compare:capture && npm run compare:pixel && npm run compare:dom && npm run compare:report"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add pixelmatch and playwright deps for website comparison tool"
```

---

### Task 2: Capture script — compare-capture.mjs

**Files:**
- Create: `scripts/compare-capture.mjs`

This script visits each product detail page on localhost and bbxin.com, takes screenshots, and extracts DOM snapshots with computed styles.

**Key design decisions:**
- Product IDs from `productDetails.json`. 164 total.
- Local URL: `http://localhost:3000/products/{id}.html` (rewrites to `/products/detail/{id}`)
- Remote URL: `https://bbxin.com/products/{id}.html`
- Viewports: 1280×800 (desktop), 375×812 (mobile)
- Concurrency: 4 pages at a time. Each page = 1 product × 1 viewport × 1 origin (local or remote)
- Idempotent: skip existing files, `--force` to re-capture
- Timeout: 30s per page, log errors and continue
- DOM snapshot extracts: all elements with tagName, className, textContent, attributes, and computed style properties

- [ ] **Step 1: Write the capture script**

Create `scripts/compare-capture.mjs`:

```js
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

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

/** Extract DOM snapshot with computed styles from the page */
async function extractDomSnapshot(page) {
  return page.evaluate(() => {
    /** Recursively walk elements and extract data */
    function walkElements(node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return null;

      const el = node;
      const comp = window.getComputedStyle(el);

      const styleProps = [
        'color', 'font-size', 'font-weight', 'line-height', 'text-align',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'background-color', 'border', 'border-radius', 'box-shadow',
        'display', 'width', 'height',
      ];

      const styles = {};
      for (const prop of styleProps) {
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
  });
}

/** Capture one product at one viewport from one origin */
async function captureOne(browser, productId, productName, origin, viewportKey) {
  const isLocal = origin === 'local';
  const baseUrl = isLocal ? LOCAL_BASE : REMOTE_BASE;
  const url = isLocal
    ? `${baseUrl}/products/${productId}.html`
    : `${baseUrl}/products/${productId}.html`;
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

  await browser.close();
  console.log('Capture complete.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Commit**

```bash
git add scripts/compare-capture.mjs
git commit -m "feat: add capture script for website comparison tool"
```

---

### Task 3: Pixel comparison script — compare-pixel.mjs

**Files:**
- Create: `scripts/compare-pixel.mjs`

- [ ] **Step 1: Write the pixel comparison script**

Create `scripts/compare-pixel.mjs`:

```js
#!/usr/bin/env node

/**
 * compare-pixel.mjs
 *
 * Phase 2a: Pixel-level comparison of captured screenshots.
 * Uses PixelMatch to diff local vs remote screenshots for each product × viewport.
 *
 * Usage: node scripts/compare-pixel.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CAPTURES_DIR = resolve(ROOT, 'docs/compare/captures');
const RESULTS_DIR  = resolve(ROOT, 'docs/compare/results/pixel');

const LOCAL_DIR  = resolve(CAPTURES_DIR, 'local');
const REMOTE_DIR = resolve(CAPTURES_DIR, 'remote');

const VIEWPORTS = ['desktop', 'mobile'];
const DIFF_THRESHOLD = 0.1; // PixelMatch threshold
const FAIL_PCT = 5; // >5% diff = FAIL

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

/** Read PNG as RGBA raw pixel buffer, returns { data, width, height } */
async function readPng(filePath) {
  const img = sharp(filePath);
  const metadata = await img.metadata();
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** Resize image to match target dimensions (white padding) */
async function resizeToMatch(filePath, targetWidth, targetHeight) {
  const img = sharp(filePath);
  const metadata = await img.metadata();

  if (metadata.width === targetWidth && metadata.height === targetHeight) {
    return await readPng(filePath);
  }

  // Resize with white background padding
  const resized = await img
    .resize(targetWidth, targetHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  return { data: resized.data, width: resized.width, height: resized.height };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Phase 2a: Pixel Comparison ===');
  ensureDir(RESULTS_DIR);

  // Collect product IDs that have both local and remote captures
  const scores = [];

  for (const vp of VIEWPORTS) {
    const localVpDir = resolve(LOCAL_DIR, vp);
    const remoteVpDir = resolve(REMOTE_DIR, vp);

    if (!existsSync(localVpDir) || !existsSync(remoteVpDir)) {
      console.warn(`Skipping viewport ${vp}: missing capture directory`);
      continue;
    }

    const localFiles = readdirSync(localVpDir).filter(f => f.endsWith('.png'));
    console.log(`Processing ${vp} — ${localFiles.length} products`);

    for (const file of localFiles) {
      const productId = basename(file, extname(file));
      const localPath = resolve(localVpDir, file);
      const remotePath = resolve(remoteVpDir, file);

      if (!existsSync(remotePath)) {
        console.warn(`  [skip] ${productId}: no remote capture`);
        continue;
      }

      try {
        // Read both images
        const localImg = await readPng(localPath);
        const remoteImg = await readPng(remotePath);

        // Match dimensions
        const targetW = Math.max(localImg.width, remoteImg.width);
        const targetH = Math.max(localImg.height, remoteImg.height);

        const local = await resizeToMatch(localPath, targetW, targetH);
        const remote = await resizeToMatch(remotePath, targetW, targetH);

        // Diff
        const diff = new Uint8ClampedArray(local.data.length);
        const diffPixels = pixelmatch(local.data, remote.data, diff, local.width, local.height, {
          threshold: DIFF_THRESHOLD,
        });

        const totalPixels = local.width * local.height;
        const diffPercent = (diffPixels / totalPixels) * 100;

        // Save diff image
        const diffImg = await sharp(Buffer.from(diff), {
          raw: { width: local.width, height: local.height, channels: 4 },
        }).png().toBuffer();

        const diffPath = resolve(RESULTS_DIR, `${productId}_${vp}_diff.png`);
        writeFileSync(diffPath, diffImg);

        scores.push({
          productId,
          viewport: vp,
          diffPercent: Math.round(diffPercent * 100) / 100,
          verdict: diffPercent > FAIL_PCT ? 'PIXEL_FAIL' : 'PIXEL_PASS',
        });

        process.stdout.write(`\r  ${vp}: ${productId} — ${diffPercent.toFixed(2)}% diff`);
      } catch (err) {
        console.error(`\n  [error] ${productId} (${vp}): ${err.message}`);
        scores.push({
          productId,
          viewport: vp,
          diffPercent: -1,
          verdict: 'ERROR',
          error: err.message,
        });
      }
    }
    console.log();
  }

  // Save aggregate scores
  const scorePath = resolve(RESULTS_DIR, 'score.json');
  writeFileSync(scorePath, JSON.stringify(scores, null, 2));

  const passed = scores.filter(s => s.verdict === 'PIXEL_PASS').length;
  const failed = scores.filter(s => s.verdict === 'PIXEL_FAIL').length;
  const errors = scores.filter(s => s.verdict === 'ERROR').length;

  console.log(`\nPixel comparison complete.`);
  console.log(`  Pass: ${passed} | Fail: ${failed} | Error: ${errors}`);
  console.log(`  Scores saved to ${scorePath}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Commit**

```bash
git add scripts/compare-pixel.mjs
git commit -m "feat: add pixel comparison script"
```

---

### Task 4: DOM comparison script — compare-dom.mjs

**Files:**
- Create: `scripts/compare-dom.mjs`

- [ ] **Step 1: Write the DOM comparison script**

Create `scripts/compare-dom.mjs`:

```js
#!/usr/bin/env node

/**
 * compare-dom.mjs
 *
 * Phase 2b: DOM structure + computed styles comparison.
 * Loads captured DOM snapshots and compares local vs remote for each product.
 *
 * Usage: node scripts/compare-dom.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CAPTURES_DIR = resolve(ROOT, 'docs/compare/captures');
const RESULTS_DIR  = resolve(ROOT, 'docs/compare/results/dom');
const DOM_DIR      = resolve(CAPTURES_DIR, 'dom');

const STYLE_PROPS = [
  'color', 'font-size', 'font-weight', 'line-height', 'text-align',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'background-color', 'border', 'border-radius', 'box-shadow',
  'display', 'width', 'height',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

/** Flatten element tree to a list with path for comparison */
function flattenTree(node, path = 'root', result = []) {
  if (!node) return result;
  result.push({ ...node, path, children: undefined });
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child, i) => {
      const tag = child.tag || 'unknown';
      flattenTree(child, `${path} > ${tag}[${i}]`, result);
    });
  }
  return result;
}

/** Normalize URL for comparison: handle relative vs absolute */
function normalizeUrl(url, isLocal = false) {
  if (!url) return url;
  // Strip base URLs for comparison
  if (isLocal) {
    return url.replace(/^http:\/\/localhost:3000/, '');
  }
  return url.replace(/^https:\/\/bbxin\.com/, '');
}

/** Normalize color value for comparison */
function normalizeColor(val) {
  if (!val) return val;
  // Convert rgb/rgba to hex for comparison
  const rgbMatch = val.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const [_, r, g, b] = rgbMatch;
    return `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
  }
  return val.toLowerCase().replace(/\s+/g, '');
}

/** Compare computed styles between two element snapshots */
function compareStyles(localStyles, remoteStyles) {
  const diffs = [];
  for (const prop of STYLE_PROPS) {
    const lv = localStyles?.[prop] || '';
    const rv = remoteStyles?.[prop] || '';
    if (normalizeColor(lv) !== normalizeColor(rv)) {
      diffs.push({ property: prop, local: lv, remote: rv });
    }
  }
  return diffs;
}

/** Compare attributes between two element snapshots */
function compareAttrs(localAttrs, remoteAttrs) {
  const diffs = [];
  const allKeys = new Set([...Object.keys(localAttrs || {}), ...Object.keys(remoteAttrs || {})]);

  for (const key of allKeys) {
    const lv = (localAttrs?.[key] || '').trim();
    const rv = (remoteAttrs?.[key] || '').trim();

    if (key === 'href') {
      // Normalize URLs for comparison
      const lvNorm = normalizeUrl(lv, true);
      const rvNorm = normalizeUrl(rv, false);
      if (lvNorm !== rvNorm) {
        diffs.push({ attribute: key, local: lv, remote: rv });
      }
    } else if (key === 'src') {
      const lvNorm = normalizeUrl(lv, true);
      const rvNorm = normalizeUrl(rv, false);
      if (lvNorm !== rvNorm) {
        diffs.push({ attribute: key, local: lv, remote: rv });
      }
    } else if (lv !== rv) {
      diffs.push({ attribute: key, local: lv, remote: rv });
    }
  }
  return diffs;
}

/** Compare text content */
function compareTexts(localText, remoteText) {
  if ((localText || '').trim() !== (remoteText || '').trim()) {
    return { local: localText, remote: remoteText };
  }
  return null;
}

/** Compare two flattened element lists */
function compareFlattened(localFlat, remoteFlat) {
  const structuralDiffs = [];
  const textDiffs = [];
  const attrDiffs = [];
  const styleDiffs = [];
  const maxLen = Math.max(localFlat.length, remoteFlat.length);

  for (let i = 0; i < maxLen; i++) {
    const l = localFlat[i];
    const r = remoteFlat[i];

    if (!l && r) {
      structuralDiffs.push({ type: 'missing_local', path: r.path, tag: r.tag, text: r.text });
      continue;
    }
    if (l && !r) {
      structuralDiffs.push({ type: 'missing_remote', path: l.path, tag: l.tag, text: l.text });
      continue;
    }
    if (!l || !r) continue;

    // Tag mismatch
    if (l.tag !== r.tag) {
      structuralDiffs.push({ type: 'tag_mismatch', path: l.path, local: l.tag, remote: r.tag });
    }

    // Class name mismatch
    if (l.className !== r.className && !l.className.includes('ley-')) {
      // Skip internal class differences for ley- prefixed classes (component-level differences expected)
    }

    // Text content
    if (l.children?.length === 0 || r.children?.length === 0) {
      const textDiff = compareTexts(l.text, r.text);
      if (textDiff) {
        textDiffs.push({ path: l.path, tag: l.tag, ...textDiff });
      }
    }

    // Attributes
    const aDiffs = compareAttrs(l.attrs, r.attrs);
    for (const d of aDiffs) {
      attrDiffs.push({ path: l.path, tag: l.tag, ...d });
    }

    // Computed styles (only if basic structure matches)
    if (l.tag === r.tag) {
      const sDiffs = compareStyles(l.styles, r.styles);
      for (const d of sDiffs) {
        styleDiffs.push({ path: l.path, tag: l.tag, ...d });
      }
    }
  }

  return { structuralDiffs, textDiffs, attrDiffs, styleDiffs };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Phase 2b: DOM Comparison ===');
  ensureDir(RESULTS_DIR);

  const localDomDir = resolve(DOM_DIR, 'local');
  const remoteDomDir = resolve(DOM_DIR, 'remote');

  if (!existsSync(localDomDir) || !existsSync(remoteDomDir)) {
    console.error('DOM capture directories not found. Run compare-capture.mjs first.');
    process.exit(1);
  }

  const files = readdirSync(localDomDir).filter(f => f.endsWith('.json'));
  console.log(`Comparing DOM for ${files.length} products`);

  const allResults = [];

  for (const file of files) {
    const productId = file.replace('.json', '');
    const localPath = resolve(localDomDir, file);
    const remotePath = resolve(remoteDomDir, file);

    if (!existsSync(remotePath)) {
      console.warn(`  [skip] ${productId}: no remote DOM snapshot`);
      continue;
    }

    try {
      const localDom = JSON.parse(readFileSync(localPath, 'utf-8'));
      const remoteDom = JSON.parse(readFileSync(remotePath, 'utf-8'));

      const result = {
        productId,
        metadata: {
          title: compareTexts(localDom.title, remoteDom.title),
          description: compareTexts(localDom.metaDescription, remoteDom.metaDescription),
        },
      };

      // Flatten and compare
      const localFlat = flattenTree(localDom.body);
      const remoteFlat = flattenTree(remoteDom.body);

      const diffs = compareFlattened(localFlat, remoteFlat);

      result.elementCount = { local: localFlat.length, remote: remoteFlat.length };
      result.structuralDiffs = diffs.structuralDiffs;
      result.textDiffs = diffs.textDiffs;
      result.attrDiffs = diffs.attrDiffs;
      result.styleDiffs = diffs.styleDiffs;

      // Compute verdict
      result.hasStructuralDiff = diffs.structuralDiffs.length > 0;
      result.hasTextDiff = diffs.textDiffs.length > 0;
      result.hasAttrDiff = diffs.attrDiffs.length > 0;
      result.hasStyleDiff = diffs.styleDiffs.length > 0;

      result.diffCounts = {
        structural: diffs.structuralDiffs.length,
        text: diffs.textDiffs.length,
        attributes: diffs.attrDiffs.length,
        style: diffs.styleDiffs.length,
      };

      result.verdict =
        diffs.structuralDiffs.length > 0 || diffs.textDiffs.length > 0 ? 'STRUCTURAL_FAIL'
        : diffs.attrDiffs.length > 0 ? 'ATTR_DIFF'
        : diffs.styleDiffs.length > 0 ? 'STYLE_DIFF'
        : 'DOM_MATCH';

      allResults.push(result);
      process.stdout.write(`\r  ${productId}: ${result.verdict} (${result.diffCounts.structural}S/${result.diffCounts.text}T/${result.diffCounts.attributes}A/${result.diffCounts.style}C)`);
    } catch (err) {
      console.error(`\n  [error] ${productId}: ${err.message}`);
      allResults.push({ productId, error: err.message, verdict: 'ERROR' });
    }
  }

  console.log();

  // Save results
  // Per-product files
  for (const r of allResults) {
    const resultPath = resolve(RESULTS_DIR, `${r.productId}.json`);
    writeFileSync(resultPath, JSON.stringify(r, null, 2));
  }

  // Aggregate summary
  const summary = {
    total: allResults.length,
    match: allResults.filter(r => r.verdict === 'DOM_MATCH').length,
    styleDiff: allResults.filter(r => r.verdict === 'STYLE_DIFF').length,
    attrDiff: allResults.filter(r => r.verdict === 'ATTR_DIFF').length,
    structuralFail: allResults.filter(r => r.verdict === 'STRUCTURAL_FAIL').length,
    errors: allResults.filter(r => r.verdict === 'ERROR').length,
  };

  const summaryPath = resolve(RESULTS_DIR, 'dom-summary.json');
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`\nDOM comparison complete.`);
  console.log(`  Match: ${summary.match} | Style: ${summary.styleDiff} | Attr: ${summary.attrDiff} | Structural: ${summary.structuralFail} | Error: ${summary.errors}`);
  console.log(`  Results saved to ${RESULTS_DIR}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Commit**

```bash
git add scripts/compare-dom.mjs
git commit -m "feat: add DOM comparison script"
```

---

### Task 5: HTML report script — compare-report.mjs

**Files:**
- Create: `scripts/compare-report.mjs`

- [ ] **Step 1: Write the report generation script**

Create `scripts/compare-report.mjs`:

```js
#!/usr/bin/env node

/**
 * compare-report.mjs
 *
 * Phase 3: Generate a self-contained HTML comparison report.
 * Reads pixel scores + DOM diff results and renders an interactive report.
 *
 * Usage: node scripts/compare-report.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PRODUCTS_PATH     = resolve(ROOT, 'src/data/productDetails.json');
const PIXEL_SCORES_PATH = resolve(ROOT, 'docs/compare/results/pixel/score.json');
const DOM_RESULTS_DIR   = resolve(ROOT, 'docs/compare/results/dom');
const REPORT_PATH       = resolve(ROOT, 'docs/compare/report.html');
const PIXEL_DIFF_DIR    = resolve(ROOT, 'docs/compare/results/pixel');
const CAPTURES_DIR      = resolve(ROOT, 'docs/compare/captures');

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('=== Phase 3: Generate HTML Report ===');

  // Load data
  const products = JSON.parse(readFileSync(PRODUCTS_PATH, 'utf-8'));
  const productMap = {};
  for (const p of products) productMap[p.id] = p;

  let pixelScores = [];
  if (existsSync(PIXEL_SCORES_PATH)) {
    pixelScores = JSON.parse(readFileSync(PIXEL_SCORES_PATH, 'utf-8'));
  }

  const domResults = [];
  if (existsSync(DOM_RESULTS_DIR)) {
    const files = readdirSync(DOM_RESULTS_DIR).filter(f => f.endsWith('.json') && f !== 'dom-summary.json');
    for (const f of files) {
      try {
        domResults.push(JSON.parse(readFileSync(resolve(DOM_RESULTS_DIR, f), 'utf-8')));
      } catch { /* skip corrupt */ }
    }
  }

  // Build combined results
  const combinedResults = [];
  const allProductIds = new Set([
    ...pixelScores.map(s => s.productId),
    ...domResults.map(d => d.productId),
  ]);

  for (const productId of allProductIds) {
    const product = productMap[productId];
    const pixelDesktop = pixelScores.find(s => s.productId === productId && s.viewport === 'desktop');
    const pixelMobile = pixelScores.find(s => s.productId === productId && s.viewport === 'mobile');
    const dom = domResults.find(d => d.productId === productId);

    // Compute combined verdict
    let verdict = 'PASS';
    let severity = 0;

    if (dom?.error || pixelDesktop?.verdict === 'ERROR' || pixelMobile?.verdict === 'ERROR') {
      verdict = 'ERROR';
      severity = 5;
    } else if (dom?.verdict === 'STRUCTURAL_FAIL') {
      verdict = 'FAIL';
      severity = 4;
    } else if (pixelDesktop?.verdict === 'PIXEL_FAIL' || pixelMobile?.verdict === 'PIXEL_FAIL') {
      if (dom?.hasStyleDiff || dom?.hasAttrDiff) {
        verdict = 'FAIL';
        severity = 3;
      } else {
        verdict = 'PIXEL_WARN';
        severity = 2;
      }
    } else if (dom?.hasStyleDiff || dom?.hasAttrDiff) {
      if (dom?.hasStructuralDiff) {
        verdict = 'FAIL';
        severity = 3;
      } else {
        verdict = 'MINOR';
        severity = 1;
      }
    }

    combinedResults.push({
      productId,
      productName: product?.name || 'Unknown',
      verdict,
      severity,
      pixel: {
        desktop: pixelDesktop,
        mobile: pixelMobile,
      },
      dom: dom ? {
        diffCounts: dom.diffCounts,
        structuralDiffs: dom.structuralDiffs || [],
        textDiffs: dom.textDiffs || [],
        attrDiffs: dom.attrDiffs || [],
        styleDiffs: dom.styleDiffs || [],
      } : null,
      hasCapture: existsSync(resolve(CAPTURES_DIR, 'local', 'desktop', `${productId}.png`)),
    });
  }

  // Sort by severity descending, then product ID
  combinedResults.sort((a, b) => b.severity - a.severity || a.productId.localeCompare(b.productId));

  // Generate HTML
  const diffImageToBase64 = (productId, viewport) => {
    const path = resolve(PIXEL_DIFF_DIR, `${productId}_${viewport}_diff.png`);
    if (existsSync(path)) {
      const data = readFileSync(path);
      return `data:image/png;base64,${data.toString('base64')}`;
    }
    return '';
  };

  const screenshotToBase64 = (origin, viewport, productId) => {
    const path = resolve(CAPTURES_DIR, origin, viewport, `${productId}.png`);
    if (existsSync(path)) {
      const data = readFileSync(path);
      return `data:image/png;base64,${data.toString('base64')}`;
    }
    return '';
  };

  const verdictColors = {
    PASS: '#22c55e',
    PIXEL_WARN: '#f59e0b',
    MINOR: '#3b82f6',
    FAIL: '#ef4444',
    ERROR: '#6b7280',
  };

  const rows = combinedResults.map(r => {
    const pDesktop = r.pixel.desktop;
    const pMobile = r.pixel.mobile;
    const desktopDiff = pDesktop ? `${pDesktop.diffPercent.toFixed(2)}%` : 'N/A';
    const mobileDiff = pMobile ? `${pMobile.diffPercent.toFixed(2)}%` : 'N/A';

    const desktopImg = diffImageToBase64(r.productId, 'desktop');
    const mobileImg = diffImageToBase64(r.productId, 'mobile');
    const localDesktopImg = screenshotToBase64('local', 'desktop', r.productId);
    const remoteDesktopImg = screenshotToBase64('remote', 'desktop', r.productId);
    const localMobileImg = screenshotToBase64('local', 'mobile', r.productId);
    const remoteMobileImg = screenshotToBase64('remote', 'mobile', r.productId);

    let domDetailHtml = '';
    if (r.dom && (r.dom.structuralDiffs.length || r.dom.textDiffs.length || r.dom.attrDiffs.length || r.dom.styleDiffs.length)) {
      domDetailHtml = `<div class="dom-details"><h4>DOM Diffs</h4>`;

      if (r.dom.structuralDiffs.length) {
        domDetailHtml += `<div class="diff-section"><h5>Structural (${r.dom.structuralDiffs.length})</h5><ul>${r.dom.structuralDiffs.slice(0, 20).map(d =>
          `<li><strong>${d.type}</strong> at ${d.path}: ${d.tag}${d.local ? ` (local: ${d.local})` : ''}${d.remote ? ` (remote: ${d.remote})` : ''}${d.text ? ` text="${d.text}"` : ''}</li>`
        ).join('')}${r.dom.structuralDiffs.length > 20 ? `<li>...and ${r.dom.structuralDiffs.length - 20} more</li>` : ''}</ul></div>`;
      }

      if (r.dom.textDiffs.length) {
        domDetailHtml += `<div class="diff-section"><h5>Text (${r.dom.textDiffs.length})</h5><ul>${r.dom.textDiffs.slice(0, 10).map(d =>
          `<li><strong>${d.path}</strong>: local="${d.local}" vs remote="${d.remote}"</li>`
        ).join('')}${r.dom.textDiffs.length > 10 ? `<li>...and ${r.dom.textDiffs.length - 10} more</li>` : ''}</ul></div>`;
      }

      if (r.dom.attrDiffs.length) {
        domDetailHtml += `<div class="diff-section"><h5>Attributes (${r.dom.attrDiffs.length})</h5><ul>${r.dom.attrDiffs.slice(0, 10).map(d =>
          `<li><strong>${d.path}</strong> ${d.attribute}: local="${d.local}" vs remote="${d.remote}"</li>`
        ).join('')}${r.dom.attrDiffs.length > 10 ? `<li>...and ${r.dom.attrDiffs.length - 10} more</li>` : ''}</ul></div>`;
      }

      if (r.dom.styleDiffs.length) {
        domDetailHtml += `<div class="diff-section"><h5>Style (${r.dom.styleDiffs.length})</h5><table class="style-table"><tr><th>Path</th><th>Property</th><th>Local</th><th>Remote</th></tr>${r.dom.styleDiffs.slice(0, 30).map(d =>
          `<tr><td>${d.path}</td><td>${d.property}</td><td>${d.local}</td><td>${d.remote}</td></tr>`
        ).join('')}${r.dom.styleDiffs.length > 30 ? `<tr><td colspan="4">...and ${r.dom.styleDiffs.length - 30} more</td></tr>` : ''}</table></div>`;
      }

      domDetailHtml += '</div>';
    }

    return {
      id: r.productId,
      name: r.productName,
      verdict: r.verdict,
      severity: r.severity,
      color: verdictColors[r.verdict] || '#6b7280',
      desktopDiff,
      mobileDiff,
      desktopImg,
      mobileImg,
      localDesktopImg,
      remoteDesktopImg,
      localMobileImg,
      remoteMobileImg,
      domDetailHtml,
      hasDomDiffs: !!domDetailHtml,
      hasCapture: r.hasCapture,
    };
  });

  const counts = { PASS: 0, PIXEL_WARN: 0, MINOR: 0, FAIL: 0, ERROR: 0 };
  for (const r of combinedResults) counts[r.verdict]++;

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Website Comparison Report</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; padding: 20px; }
h1 { margin-bottom: 20px; }
.dashboard { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.stat { padding: 12px 20px; border-radius: 8px; color: #fff; font-weight: 600; font-size: 14px; min-width: 80px; text-align: center; }
.stat span { display: block; font-size: 28px; font-weight: 700; margin-top: 4px; }
.filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.filter-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 13px; }
.filter-btn.active { background: #333; color: #fff; border-color: #333; }
.search-box { padding: 6px 12px; border-radius: 6px; border: 1px solid #ddd; font-size: 13px; width: 200px; }
.card { background: #fff; border-radius: 10px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.card-header { display: flex; align-items: center; padding: 12px 16px; cursor: pointer; gap: 12px; }
.card-header:hover { background: #fafafa; }
.verdict-badge { padding: 3px 10px; border-radius: 12px; color: #fff; font-size: 11px; font-weight: 600; }
.card-title { font-weight: 600; flex: 1; }
.card-meta { font-size: 12px; color: #888; display: flex; gap: 16px; }
.card-body { padding: 0 16px 16px; display: none; }
.card-body.open { display: block; }
.screenshot-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 12px 0; }
.screenshot-grid img { width: 100%; border-radius: 6px; border: 1px solid #eee; }
.viewport-label { font-size: 13px; font-weight: 600; color: #666; margin: 12px 0 4px; }
.dom-details { margin-top: 12px; padding: 12px; background: #fafafa; border-radius: 6px; }
.dom-details h4 { font-size: 14px; margin-bottom: 8px; }
.diff-section { margin: 8px 0; }
.diff-section h5 { font-size: 13px; color: #555; margin-bottom: 4px; }
.diff-section ul { list-style: none; font-size: 12px; }
.diff-section li { padding: 2px 0; font-family: monospace; font-size: 11px; word-break: break-all; }
.style-table { width: 100%; border-collapse: collapse; font-size: 11px; font-family: monospace; }
.style-table th, .style-table td { padding: 4px 8px; text-align: left; border-bottom: 1px solid #eee; word-break: break-all; }
.style-table th { background: #f0f0f0; font-weight: 600; }
.summary-count { font-size: 12px; color: #999; margin-left: 4px; }
</style>
</head>
<body>
<h1>Website Comparison Report — Product Details</h1>

<div class="dashboard">
  <div class="stat" style="background:#22c55e">PASS <span>${counts.PASS}</span></div>
  <div class="stat" style="background:#f59e0b">WARN <span>${counts.PIXEL_WARN}</span></div>
  <div class="stat" style="background:#3b82f6">MINOR <span>${counts.MINOR}</span></div>
  <div class="stat" style="background:#ef4444">FAIL <span>${counts.FAIL}</span></div>
  <div class="stat" style="background:#6b7280">ERROR <span>${counts.ERROR}</span></div>
</div>

<div class="filters">
  <button class="filter-btn active" data-filter="all">All (${combinedResults.length})</button>
  <button class="filter-btn" data-filter="FAIL">FAIL (${counts.FAIL})</button>
  <button class="filter-btn" data-filter="PIXEL_WARN">WARN (${counts.PIXEL_WARN})</button>
  <button class="filter-btn" data-filter="MINOR">MINOR (${counts.MINOR})</button>
  <button class="filter-btn" data-filter="PASS">PASS (${counts.PASS})</button>
  <button class="filter-btn" data-filter="ERROR">ERROR (${counts.ERROR})</button>
  <input class="search-box" type="text" placeholder="Search by name or ID...">
</div>

<div id="cards">
${rows.map(r => `
<div class="card" data-verdict="${r.verdict}" data-name="${r.name}" data-id="${r.id}">
  <div class="card-header" onclick="this.nextElementSibling.classList.toggle('open')">
    <span class="verdict-badge" style="background:${r.color}">${r.verdict}</span>
    <span class="card-title">[${r.id}] ${r.name}</span>
    <span class="card-meta">
      <span>Desktop: ${r.desktopDiff}</span>
      <span>Mobile: ${r.mobileDiff}</span>
      ${r.dom ? `<span>DOM: ${r.dom.diffCounts.structural}S ${r.dom.diffCounts.text}T ${r.dom.diffCounts.attributes}A ${r.dom.diffCounts.style}C</span>` : ''}
    </span>
  </div>
  <div class="card-body">
    ${r.localDesktopImg ? `
    <div class="viewport-label">Desktop — Local / Remote / Diff</div>
    <div class="screenshot-grid">
      <img src="${r.localDesktopImg}" alt="local desktop">
      <img src="${r.remoteDesktopImg}" alt="remote desktop">
      ${r.desktopImg ? `<img src="${r.desktopImg}" alt="diff desktop">` : '<div style="color:#999">No diff</div>'}
    </div>` : ''}
    ${r.localMobileImg ? `
    <div class="viewport-label">Mobile — Local / Remote / Diff</div>
    <div class="screenshot-grid">
      <img src="${r.localMobileImg}" alt="local mobile">
      <img src="${r.remoteMobileImg}" alt="remote mobile">
      ${r.mobileImg ? `<img src="${r.mobileImg}" alt="diff mobile">` : '<div style="color:#999">No diff</div>'}
    </div>` : ''}
    ${r.hasDomDiffs ? r.domDetailHtml : '<div style="color:#999;margin-top:8px;font-size:13px">No DOM differences</div>'}
  </div>
</div>`).join('\n')}
</div>

<script>
const filterBtns = document.querySelectorAll('.filter-btn');
const searchBox = document.querySelector('.search-box');
const cards = document.querySelectorAll('.card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});

searchBox.addEventListener('input', applyFilters);

function applyFilters() {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset?.filter || 'all';
  const query = searchBox.value.toLowerCase();

  cards.forEach(card => {
    const verdict = card.dataset.verdict;
    const name = card.dataset.name.toLowerCase();
    const id = card.dataset.id;
    const matchesFilter = activeFilter === 'all' || verdict === activeFilter;
    const matchesSearch = !query || name.includes(query) || id.includes(query);
    card.style.display = matchesFilter && matchesSearch ? 'block' : 'none';
  });
}
</script>
</body>
</html>`;

  writeFileSync(REPORT_PATH, html);
  console.log(`Report generated: ${REPORT_PATH}`);
  console.log(`  Total: ${combinedResults.length} | PASS: ${counts.PASS} | WARN: ${counts.PIXEL_WARN} | MINOR: ${counts.MINOR} | FAIL: ${counts.FAIL} | ERROR: ${counts.ERROR}`);
}

main();
```

- [ ] **Step 2: Commit**

```bash
git add scripts/compare-report.mjs
git commit -m "feat: add HTML report generation script"
```

---

### Task 6: Create docs/compare directory with .gitkeep

**Files:**
- Create: `docs/compare/.gitkeep`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p docs/compare
touch docs/compare/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add docs/compare/.gitkeep
git commit -m "chore: add docs/compare output directory"
```

---

### Task 7: End-to-end verification

**Files:**
- None (verification only)

- [ ] **Step 1: Start the dev server**

Run in background:
```bash
npm run dev &
```

Wait for server to start (check `http://localhost:3000` responds).

- [ ] **Step 2: Run capture on a small sample first**

Test with 3 products to validate the pipeline works:
```bash
# Temporarily modify compare-capture.mjs to test with 3 products
# Or just run it and let it process - it will take ~4.5 min for 164 products
# (164 products × 2 origins × 2 viewports = 656 tasks ÷ 4 concurrent = ~164 batches × ~3s each ≈ 8 min)
```

Run capture:
```bash
node scripts/compare-capture.mjs
```

Expected: Screenshots and DOM snapshots saved to `docs/compare/captures/`.

- [ ] **Step 3: Run pixel comparison**

```bash
node scripts/compare-pixel.mjs
```

Expected: Diff images and score.json in `docs/compare/results/pixel/`.

- [ ] **Step 4: Run DOM comparison**

```bash
node scripts/compare-dom.mjs
```

Expected: Per-product DOM diff JSONs in `docs/compare/results/dom/`.

- [ ] **Step 5: Generate report**

```bash
node scripts/compare-report.mjs
```

Expected: `docs/compare/report.html` generated.

- [ ] **Step 6: Open report and verify**

Open `docs/compare/report.html` in a browser. Verify:
- Dashboard counts match expectations
- Filter buttons work
- Search works
- Cards show screenshots and diff images
- DOM diffs are expandable
