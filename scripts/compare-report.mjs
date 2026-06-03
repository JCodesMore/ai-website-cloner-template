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
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function imgToBase64(filePath) {
  if (existsSync(filePath)) {
    const data = readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

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

    let verdict = 'PASS';
    let severity = 0;

    if (dom?.verdict === 'ERROR' || pixelDesktop?.verdict === 'ERROR' || pixelMobile?.verdict === 'ERROR') {
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
      verdict = 'MINOR';
      severity = 1;
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
    });
  }

  combinedResults.sort((a, b) => b.severity - a.severity || a.productId.localeCompare(b.productId));

  // Build DOM diff HTML
  function buildDomDetailHtml(r) {
    if (!r.dom) return '';
    const hasDiffs = r.dom.structuralDiffs.length || r.dom.textDiffs.length ||
      r.dom.attrDiffs.length || r.dom.styleDiffs.length;
    if (!hasDiffs) return '';

    let html = '<div class="dom-details"><h4>DOM Diffs</h4>';

    if (r.dom.structuralDiffs.length) {
      html += `<div class="diff-section"><h5>Structural (${r.dom.structuralDiffs.length})</h5><ul>`;
      html += r.dom.structuralDiffs.slice(0, 20).map(d =>
        `<li><strong>${d.type}</strong> at ${d.path}: ${d.tag}${d.local ? ` (local: ${d.local})` : ''}${d.remote ? ` (remote: ${d.remote})` : ''}${d.text ? ` text="${d.text}"` : ''}</li>`
      ).join('');
      if (r.dom.structuralDiffs.length > 20) {
        html += `<li>...and ${r.dom.structuralDiffs.length - 20} more</li>`;
      }
      html += '</ul></div>';
    }

    if (r.dom.textDiffs.length) {
      html += `<div class="diff-section"><h5>Text (${r.dom.textDiffs.length})</h5><ul>`;
      html += r.dom.textDiffs.slice(0, 10).map(d =>
        `<li><strong>${d.path}</strong>: local="${d.local}" vs remote="${d.remote}"</li>`
      ).join('');
      if (r.dom.textDiffs.length > 10) {
        html += `<li>...and ${r.dom.textDiffs.length - 10} more</li>`;
      }
      html += '</ul></div>';
    }

    if (r.dom.attrDiffs.length) {
      html += `<div class="diff-section"><h5>Attributes (${r.dom.attrDiffs.length})</h5><ul>`;
      html += r.dom.attrDiffs.slice(0, 10).map(d =>
        `<li><strong>${d.path}</strong> ${d.attribute}: local="${d.local}" vs remote="${d.remote}"</li>`
      ).join('');
      if (r.dom.attrDiffs.length > 10) {
        html += `<li>...and ${r.dom.attrDiffs.length - 10} more</li>`;
      }
      html += '</ul></div>';
    }

    if (r.dom.styleDiffs.length) {
      html += `<div class="diff-section"><h5>Style (${r.dom.styleDiffs.length})</h5><table class="style-table"><tr><th>Path</th><th>Property</th><th>Local</th><th>Remote</th></tr>`;
      html += r.dom.styleDiffs.slice(0, 30).map(d =>
        `<tr><td>${d.path}</td><td>${d.property}</td><td>${d.local}</td><td>${d.remote}</td></tr>`
      ).join('');
      if (r.dom.styleDiffs.length > 30) {
        html += `<tr><td colspan="4">...and ${r.dom.styleDiffs.length - 30} more</td></tr>`;
      }
      html += '</table></div>';
    }

    html += '</div>';
    return html;
  }

  const verdictColors = {
    PASS: '#22c55e',
    PIXEL_WARN: '#f59e0b',
    MINOR: '#3b82f6',
    FAIL: '#ef4444',
    ERROR: '#6b7280',
  };

  const counts = { PASS: 0, PIXEL_WARN: 0, MINOR: 0, FAIL: 0, ERROR: 0 };
  for (const r of combinedResults) counts[r.verdict]++;

  // Simple HTML escaping
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
.filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
.filter-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 13px; }
.filter-btn.active { background: #333; color: #fff; border-color: #333; }
.search-box { padding: 6px 12px; border-radius: 6px; border: 1px solid #ddd; font-size: 13px; width: 200px; }
.card { background: #fff; border-radius: 10px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.card-header { display: flex; align-items: center; padding: 12px 16px; cursor: pointer; gap: 12px; }
.card-header:hover { background: #fafafa; }
.verdict-badge { padding: 3px 10px; border-radius: 12px; color: #fff; font-size: 11px; font-weight: 600; white-space: nowrap; }
.card-title { font-weight: 600; flex: 1; }
.card-meta { font-size: 12px; color: #888; display: flex; gap: 16px; flex-wrap: wrap; }
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
${combinedResults.map(r => {
  const pDesktop = r.pixel.desktop;
  const pMobile = r.pixel.mobile;
  const desktopDiffTxt = pDesktop ? `${pDesktop.diffPercent.toFixed(2)}%` : 'N/A';
  const mobileDiffTxt = pMobile ? `${pMobile.diffPercent.toFixed(2)}%` : 'N/A';

  const localDesktop = imgToBase64(resolve(CAPTURES_DIR, 'local', 'desktop', `${r.productId}.png`));
  const remoteDesktop = imgToBase64(resolve(CAPTURES_DIR, 'remote', 'desktop', `${r.productId}.png`));
  const diffDesktop = imgToBase64(resolve(PIXEL_DIFF_DIR, `${r.productId}_desktop_diff.png`));
  const localMobile = imgToBase64(resolve(CAPTURES_DIR, 'local', 'mobile', `${r.productId}.png`));
  const remoteMobile = imgToBase64(resolve(CAPTURES_DIR, 'remote', 'mobile', `${r.productId}.png`));
  const diffMobile = imgToBase64(resolve(PIXEL_DIFF_DIR, `${r.productId}_mobile_diff.png`));

  const domHtml = buildDomDetailHtml(r);
  const color = verdictColors[r.verdict];

  let domSummary = '';
  if (r.dom) {
    const d = r.dom.diffCounts;
    domSummary = `DOM: ${d.structural}S ${d.text}T ${d.attributes}A ${d.style}C`;
  }

  return `
<div class="card" data-verdict="${r.verdict}" data-name="${esc(r.productName)}" data-id="${r.productId}">
  <div class="card-header" onclick="this.nextElementSibling.classList.toggle('open')">
    <span class="verdict-badge" style="background:${color}">${r.verdict}</span>
    <span class="card-title">[${r.productId}] ${esc(r.productName)}</span>
    <span class="card-meta">
      <span>Desktop: ${desktopDiffTxt}</span>
      <span>Mobile: ${mobileDiffTxt}</span>
      ${domSummary ? `<span>${domSummary}</span>` : ''}
    </span>
  </div>
  <div class="card-body">
    ${localDesktop ? `
    <div class="viewport-label">Desktop — Local / Remote / Diff</div>
    <div class="screenshot-grid">
      <img src="${localDesktop}" alt="local desktop">
      <img src="${remoteDesktop}" alt="remote desktop">
      ${diffDesktop ? `<img src="${diffDesktop}" alt="diff desktop">` : '<div style="color:#999">No diff available</div>'}
    </div>` : ''}
    ${localMobile ? `
    <div class="viewport-label">Mobile — Local / Remote / Diff</div>
    <div class="screenshot-grid">
      <img src="${localMobile}" alt="local mobile">
      <img src="${remoteMobile}" alt="remote mobile">
      ${diffMobile ? `<img src="${diffMobile}" alt="diff mobile">` : '<div style="color:#999">No diff available</div>'}
    </div>` : ''}
    ${domHtml || '<div style="color:#999;margin-top:8px;font-size:13px">No DOM differences</div>'}
  </div>
</div>`;
}).join('\n')}
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

  ensureDir(dirname(REPORT_PATH));
  writeFileSync(REPORT_PATH, html);
  console.log(`Report generated: ${REPORT_PATH}`);
  console.log(`  Total: ${combinedResults.length} | PASS: ${counts.PASS} | WARN: ${counts.PIXEL_WARN} | MINOR: ${counts.MINOR} | FAIL: ${counts.FAIL} | ERROR: ${counts.ERROR}`);
}

main();
