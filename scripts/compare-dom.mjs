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

/** Strip base URLs for comparison */
function normalizeUrl(url) {
  if (!url) return url;
  return url
    .replace(/^https?:\/\/localhost:3000/, '')
    .replace(/^https?:\/\/bbxin\.com/, '');
}

/** Normalize color value for comparison */
function normalizeColor(val) {
  if (!val) return val;
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

    if (key === 'href' || key === 'src') {
      if (normalizeUrl(lv) !== normalizeUrl(rv)) {
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

    if (l.tag !== r.tag) {
      structuralDiffs.push({ type: 'tag_mismatch', path: l.path, local: l.tag, remote: r.tag });
    }

    // Text content (leaf elements only)
    if (!l.children?.length || !r.children?.length) {
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

      const localFlat = flattenTree(localDom.body);
      const remoteFlat = flattenTree(remoteDom.body);

      const diffs = compareFlattened(localFlat, remoteFlat);

      result.elementCount = { local: localFlat.length, remote: remoteFlat.length };
      result.structuralDiffs = diffs.structuralDiffs;
      result.textDiffs = diffs.textDiffs;
      result.attrDiffs = diffs.attrDiffs;
      result.styleDiffs = diffs.styleDiffs;

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

  // Per-product files
  for (const r of allResults) {
    if (r.verdict === 'ERROR') continue; // skip writing error entries as JSON
    const resultPath = resolve(RESULTS_DIR, `${r.productId}.json`);
    writeFileSync(resultPath, JSON.stringify(r, null, 2));
  }

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

  if (summary.errors > 0) process.exitCode = 1;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
