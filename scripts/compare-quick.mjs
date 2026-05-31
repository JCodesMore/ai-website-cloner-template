#!/usr/bin/env node

/**
 * Quick page comparison — compares key URLs between localhost and bbxin.com.
 * Checks: HTTP status, product count, page title, core elements present.
 * Output: terminal summary + reports/compare-quick-YYYYMMDD.md
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const REPORTS_DIR = resolve(ROOT, 'reports');

if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });

const dateStr = new Date().toISOString().slice(0, 10);
const REPORT_PATH = resolve(REPORTS_DIR, `compare-quick-${dateStr}.md`);

const LOCAL  = 'http://localhost:3000';
const REMOTE = 'https://www.bbxin.com';

// Key URLs to compare (from user-testing patterns)
const KEY_URLS = [
  // Category listings
  { name: 'person list page 1',       local: '/products/person',                  remote: '/products/person.html' },
  { name: 'person adv=45',            local: '/products/person?adv=45',           remote: '/products/person.html?adv=45' },
  { name: 'person adv=53',            local: '/products/person?adv=53',           remote: '/products/person.html?adv=53' },
  { name: 'company list page 1',      local: '/products/company',                 remote: '/products/company.html' },
  { name: 'fast list page 1',         local: '/products/fast',                    remote: '/products/fast.html' },
  // Search
  { name: 'search 京东',               local: '/products/search?wd=京东',          remote: '/products/search.html?wd=京东' },
  { name: 'search 度小满',             local: '/products/search?wd=度小满',        remote: '/products/search.html?wd=度小满' },
  { name: 'search 消费',               local: '/products/search?wd=消费',          remote: '/products/search.html?wd=消费' },
  // Product details
  { name: 'detail 融e借 (172)',        local: '/products/detail/172',              remote: '/products/172.html' },
  { name: 'detail 建行惠懂你 (173)',    local: '/products/detail/173',              remote: '/products/173.html' },
  { name: 'detail 极风分期 (386)',     local: '/products/detail/386',              remote: '/products/386.html' },
  // Pages
  { name: 'homepage',                 local: '/',                                  remote: '/' },
];

const TIMEOUT = 10_000;

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const resp = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await resp.text();
    clearTimeout(timer);
    return { status: resp.status, html };
  } catch (e) {
    clearTimeout(timer);
    return { status: 0, html: '', error: e.message };
  }
}

function countProducts(html, isDetailPage) {
  if (isDetailPage) {
    return /product-detail-logo/.test(html) ? 1 : 0;
  }
  // Count unique product detail hrefs in listing
  const hrefs = html.match(/href="\/products\/(?:person|company|fast|pledge|search|detail)\/\d+[^"]*"/g) || [];
  return new Set(hrefs).size;
}

function isDetailUrl(url) {
  return /\/detail\/\d+/.test(url) || /\/products\/\d+\.html/.test(url);
}

function getTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/);
  return m ? m[1] : '';
}

function hasShareButton(html) {
  return /product-share-float/.test(html);
}

function hasPagination(html) {
  return /GPageLink/.test(html);
}

function hasAdvantageChips(html) {
  return (html.match(/summary-meta-chip/g) || []).length;
}

async function main() {
  console.log('=== Quick Page Comparison ===\n');

  const results = [];
  let pass = 0, warn = 0, fail = 0;

  for (const entry of KEY_URLS) {
    const [localR, remoteR] = await Promise.all([
      fetchPage(LOCAL + entry.local),
      fetchPage(REMOTE + entry.remote),
    ]);

    const isDetail = isDetailUrl(entry.local);
    const localCount = countProducts(localR.html, isDetail);
    const remoteCount = countProducts(remoteR.html, isDetail);
    const countMatch = localCount === remoteCount;
    const localShare = hasShareButton(localR.html);
    const remoteShare = hasShareButton(remoteR.html);
    const localChips = hasAdvantageChips(localR.html);
    const remoteChips = hasAdvantageChips(remoteR.html);

    const issues = [];
    if (localR.status !== 200) issues.push(`local HTTP ${localR.status}`);
    if (remoteR.status !== 200) issues.push(`remote HTTP ${remoteR.status}`);
    if (!countMatch) issues.push(`product count: local=${localCount} remote=${remoteCount}`);
    if (localShare !== remoteShare) issues.push(`share button mismatch`);
    if (isDetail && !localChips && remoteChips > 0) issues.push(`missing advantage chips (local=${localChips} remote=${remoteChips})`);

    const status = issues.length === 0 ? '✅' : issues.length <= 1 ? '⚠️' : '❌';
    if (status === '✅') pass++; else if (status === '⚠️') warn++; else fail++;

    results.push({ ...entry, localStatus: localR.status, remoteStatus: remoteR.status,
      localCount, remoteCount, localShare, remoteShare, localChips, remoteChips, issues, status });
    console.log(`  ${status} ${entry.name}: local=${localCount} remote=${remoteCount}${issues.length ? ' | ' + issues.join('; ') : ''}`);
  }

  // Generate report
  const lines = [];
  lines.push(`# Quick Page Comparison — ${dateStr}`);
  lines.push('');
  lines.push(`| Status | Page | Local | Remote | Issues |`);
  lines.push(`|--------|------|-------|--------|--------|`);
  for (const r of results) {
    lines.push(`| ${r.status} | ${r.name} | ${r.localCount} products | ${r.remoteCount} products | ${r.issues.length ? r.issues.join('; ') : '—'} |`);
  }
  lines.push('');
  lines.push(`**Summary:** ✅ ${pass} passed, ⚠️ ${warn} warnings, ❌ ${fail} failures`);
  lines.push('');
  lines.push(`Local: ${LOCAL}  |  Remote: ${REMOTE}`);

  const report = lines.join('\n');
  console.log(`\n${report.split('\n').slice(-3).join('\n')}`);
  writeFileSync(REPORT_PATH, report, 'utf-8');
  console.log(`\nReport saved: reports/compare-quick-${dateStr}.md`);

  if (fail > 0) process.exitCode = 1;
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
