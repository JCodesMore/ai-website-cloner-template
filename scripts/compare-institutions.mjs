#!/usr/bin/env node

/**
 * compare-institutions.mjs
 *
 * Playwright-based DOM comparison for /institutions page.
 * Captures DOM structure + computed styles from local and remote,
 * then diffs them to identify differences.
 *
 * Usage: node scripts/compare-institutions.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const OUT_DIR = resolve(ROOT, 'docs/compare/institutions');
const LOCAL_URL = 'http://localhost:3002/institutions';
const REMOTE_URL = 'https://www.bbxin.com/institutions.html';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile:  { width: 375, height: 812 },
};

const STYLE_PROPS = [
  'color', 'font-size', 'font-weight', 'line-height', 'text-align',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'background-color', 'border', 'border-radius', 'box-shadow',
  'display', 'width', 'height', 'opacity', 'position', 'flex-direction',
  'gap', 'grid-template-columns', 'font-family',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(p) { if (!existsSync(p)) mkdirSync(p, { recursive: true }); }

async function extractDom(page) {
  return page.evaluate((props) => {
    function walk(node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const el = node;
      const comp = window.getComputedStyle(el);
      const styles = {};
      for (const p of props) styles[p] = comp.getPropertyValue(p);

      const result = {
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === 'string' ? el.className : '',
        id: el.id || '',
        text: '',
        attrs: {},
        styles,
        children: [],
      };

      // Only leaf text nodes
      let directText = '';
      for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) directText += child.textContent;
      }
      result.text = directText.trim();

      for (const attr of el.attributes) {
        result.attrs[attr.name] = attr.value;
      }

      for (const child of el.children) {
        const sub = walk(child);
        if (sub) result.children.push(sub);
      }

      return result;
    }

    const body = walk(document.body);
    return {
      title: document.title,
      url: window.location.href,
      bodyElementCount: document.body.querySelectorAll('*').length,
      body,
    };
  }, STYLE_PROPS);
}

async function capturePage(browser, url, name, viewportKey) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[viewportKey],
    userAgent: USER_AGENT,
    locale: 'zh-CN',
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(1000);

    const dom = await extractDom(page);
    const screenshotPath = resolve(OUT_DIR, `${name}_${viewportKey}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const domPath = resolve(OUT_DIR, `${name}_${viewportKey}.json`);
    writeFileSync(domPath, JSON.stringify(dom, null, 2));

    return { name, viewport: viewportKey, status: 'ok', elementCount: dom.bodyElementCount };
  } catch (err) {
    console.error(`  [error] ${name}/${viewportKey}: ${err.message}`);
    return { name, viewport: viewportKey, status: 'error', error: err.message };
  } finally {
    await context.close();
  }
}

// ── Diff logic ───────────────────────────────────────────────

function normalizeColor(val) {
  if (!val) return val;
  const m = val.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) {
    return '#' + [m[1], m[2], m[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
  }
  return val.toLowerCase().replace(/\s+/g, '');
}

function flattenTree(node, path = 'root', result = []) {
  if (!node) return result;
  const item = { ...node, path, children: undefined };
  result.push(item);
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child, i) => {
      flattenTree(child, `${path} > ${child.tag}[${i}]`, result);
    });
  }
  return result;
}

function diffDom(local, remote) {
  const localFlat = flattenTree(local.body);
  const remoteFlat = flattenTree(remote.body);

  const diffs = {
    elementCountDiff: remoteFlat.length - localFlat.length,
    structural: [],
    text: [],
    attrs: [],
    styles: [],
  };

  // Filter out Next.js artifacts (link, script, next-route-announcer, nextjs-portal)
  const localFiltered = localFlat.filter(n => !['link', 'script', 'next-route-announcer', 'nextjs-portal'].includes(n.tag));
  const remoteFiltered = remoteFlat.filter(n => !['link', 'script', 'next-route-announcer', 'nextjs-portal'].includes(n.tag));
  return diffFiltered(localFiltered, remoteFiltered);
}

function diffFiltered(localFiltered, remoteFiltered) {
  const diffs = {
    elementCountDiff: remoteFiltered.length - localFiltered.length,
    structural: [],
    text: [],
    attrs: [],
    styles: [],
  };

  // Walk both trees in parallel
  const maxLen = Math.max(localFiltered.length, remoteFiltered.length);
  for (let i = 0; i < maxLen; i++) {
    const l = localFiltered[i];
    const r = remoteFiltered[i];

    if (!l && r) { diffs.structural.push({ type: 'missing_local', path: r.path, tag: r.tag }); continue; }
    if (l && !r) { diffs.structural.push({ type: 'missing_remote', path: l.path, tag: l.tag }); continue; }
    if (!l || !r) continue;

    // Tag
    if (l.tag !== r.tag) {
      diffs.structural.push({ type: 'tag_mismatch', path: l.path, local: l.tag, remote: r.tag });
    }

    // Class name
    if (l.className !== r.className) {
      diffs.structural.push({ type: 'class_diff', path: l.path, tag: l.tag, local: l.className, remote: r.className });
    }

    // Text for leaf nodes
    const isLeaf = (!l.children || !l.children.length) && (!r.children || !r.children.length);
    if (isLeaf && l.text !== r.text) {
      diffs.text.push({ path: l.path, tag: l.tag, local: l.text, remote: r.text });
    }

    // Attributes (skip class, src, href data attributes for now)
    const allAttrKeys = new Set([...Object.keys(l.attrs || {}), ...Object.keys(r.attrs || {})]);
    for (const key of allAttrKeys) {
      if (key === 'class' || key === 'style') continue;
      const lv = (l.attrs?.[key] || '').trim();
      const rv = (r.attrs?.[key] || '').trim();
      if (lv !== rv) {
        diffs.attrs.push({ path: l.path, tag: l.tag, attr: key, local: lv, remote: rv });
      }
    }

    // Styles
    if (l.tag === r.tag) {
      for (const prop of STYLE_PROPS) {
        const lv = normalizeColor(l.styles?.[prop] || '');
        const rv = normalizeColor(r.styles?.[prop] || '');
        if (lv !== rv) {
          diffs.styles.push({ path: l.path, tag: l.tag, prop, local: l.styles?.[prop] || '', remote: r.styles?.[prop] || '' });
        }
      }
    }
  }

  return diffs;
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log('=== Institutions Page Comparison ===\n');
  ensureDir(OUT_DIR);

  const browser = await chromium.launch({ headless: true });

  // Capture both pages
  console.log('Capturing pages...');
  const results = await Promise.all([
    capturePage(browser, LOCAL_URL, 'local', 'desktop'),
    capturePage(browser, REMOTE_URL, 'remote', 'desktop'),
  ]);
  console.log('  ' + results.map(r => `${r.name}: ${r.status} (${r.elementCount} elements)`).join(', '));

  await browser.close();

  // Load and compare
  const localDom = JSON.parse(readFileSync(resolve(OUT_DIR, 'local_desktop.json'), 'utf-8'));
  const remoteDom = JSON.parse(readFileSync(resolve(OUT_DIR, 'remote_desktop.json'), 'utf-8'));

  console.log(`\nLocal elements:  ${localDom.bodyElementCount}`);
  console.log(`Remote elements: ${remoteDom.bodyElementCount}`);

  const diffs = diffDom(localDom, remoteDom);

  console.log(`\n=== Differences ===`);
  console.log(`Structural: ${diffs.structural.length}`);
  console.log(`Text:       ${diffs.text.length}`);
  console.log(`Attributes: ${diffs.attrs.length}`);
  console.log(`Styles:     ${diffs.styles.length}`);

  if (diffs.structural.length > 0) {
    console.log('\n-- Structural Diffs (first 20) --');
    for (const d of diffs.structural.slice(0, 20)) {
      if (d.type === 'massive_count_diff') {
        console.log(`  MASSIVE COUNT DIFF: local=${d.local} remote=${d.remote} diff=${d.diff}`);
      } else if (d.type === 'class_diff') {
        console.log(`  CLASS: ${d.path} tag=${d.tag}`);
        console.log(`    local:  "${d.local}"`);
        console.log(`    remote: "${d.remote}"`);
      } else {
        console.log(`  ${d.type}: ${d.path} ${d.tag ? 'tag=' + d.tag : ''} ${d.local ? 'local=' + d.local : ''} ${d.remote ? 'remote=' + d.remote : ''}`.trim());
      }
    }
  }

  if (diffs.text.length > 0) {
    console.log('\n-- Text Diffs (first 30) --');
    for (const d of diffs.text.slice(0, 30)) {
      console.log(`  ${d.path} tag=${d.tag}`);
      console.log(`    local:  "${d.local.slice(0, 100)}"`);
      console.log(`    remote: "${d.remote.slice(0, 100)}"`);
    }
  }

  if (diffs.attrs.length > 0) {
    console.log('\n-- Attribute Diffs (first 20) --');
    for (const d of diffs.attrs.slice(0, 20)) {
      console.log(`  ${d.path} tag=${d.tag} ${d.attr}: local="${d.local}" remote="${d.remote}"`);
    }
  }

  if (diffs.styles.length > 0) {
    console.log('\n-- Style Diffs (first 30) --');
    for (const d of diffs.styles.slice(0, 30)) {
      console.log(`  ${d.path} tag=${d.tag} ${d.prop}: local="${d.local}" remote="${d.remote}"`);
    }
  }

  // Save detailed diff
  const diffPath = resolve(OUT_DIR, 'diff.json');
  writeFileSync(diffPath, JSON.stringify(diffs, null, 2));
  console.log(`\nFull diff saved to: ${diffPath}`);

  const summaryPath = resolve(OUT_DIR, 'summary.json');
  writeFileSync(summaryPath, JSON.stringify({
    localElementCount: localDom.bodyElementCount,
    remoteElementCount: remoteDom.bodyElementCount,
    structuralDiffs: diffs.structural.length,
    textDiffs: diffs.text.length,
    attrDiffs: diffs.attrs.length,
    styleDiffs: diffs.styles.length,
  }, null, 2));

  if (diffs.structural.length > 0 || diffs.text.length > 0) {
    process.exitCode = 1;
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
