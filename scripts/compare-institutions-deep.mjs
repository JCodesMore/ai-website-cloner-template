#!/usr/bin/env node

/**
 * compare-institutions-deep.mjs
 *
 * Deep structural comparison of institutions listing page.
 * Prints tag trees side-by-side for quick visual comparison.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'docs/compare/institutions');
const LOCAL_URL = 'http://localhost:3002/institutions';
const REMOTE_URL = 'https://www.bbxin.com/institutions.html';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

function ensureDir(p) { if (!existsSync(p)) mkdirSync(p, { recursive: true }); }

async function extractDom(page) {
  return page.evaluate(() => {
    function walk(node, depth = 0) {
      if (node.nodeType !== 1) return null;
      const el = node;
      const result = {
        tag: el.tagName.toLowerCase(),
        cls: typeof el.className === 'string' ? el.className : '',
        id: el.id || '',
        text: '',
        attrs: {},
        children: [],
      };

      // Collect direct text
      let t = '';
      for (const c of el.childNodes) {
        if (c.nodeType === 3) t += c.textContent;
      }
      result.text = t.trim().slice(0, 100);

      for (const attr of el.attributes) {
        result.attrs[attr.name] = attr.value;
      }

      for (const child of el.children) {
        const sub = walk(child, depth + 1);
        if (sub) result.children.push(sub);
      }
      return result;
    }

    return {
      title: document.title,
      body: walk(document.body),
    };
  });
}

function printTree(node, indent = 0) {
  if (!node) return '';
  const prefix = '  '.repeat(indent);
  let line = `${prefix}<${node.tag}`;
  if (node.cls) line += ` class="${node.cls.slice(0, 60)}"`;
  if (node.id) line += ` id="${node.id}"`;
  if (node.text) line += ` ${JSON.stringify(node.text).slice(0, 80)}`;
  line += ` (${node.children.length} children)`;
  let lines = [line];
  for (const c of node.children) {
    lines = lines.concat(printTree(c, indent + 1));
  }
  return lines;
}

function tagCounts(node, counts = {}) {
  if (!node) return counts;
  counts[node.tag] = (counts[node.tag] || 0) + 1;
  for (const c of node.children || []) tagCounts(c, counts);
  return counts;
}

function classCounts(node, counts = {}) {
  if (!node) return counts;
  if (node.cls) {
    const classes = node.cls.split(/\s+/).filter(Boolean);
    for (const c of classes) counts[c] = (counts[c] || 0) + 1;
  }
  for (const c of node.children || []) classCounts(c, counts);
  return counts;
}

async function main() {
  console.log('=== Deep Institutions Comparison ===\n');
  ensureDir(OUT_DIR);

  const browser = await chromium.launch({ headless: true });

  console.log('Capturing...');
  const results = [];
  for (const [name, url] of [['local', LOCAL_URL], ['remote', REMOTE_URL]]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: USER_AGENT,
      locale: 'zh-CN',
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(1000);
    const dom = await extractDom(page);
    writeFileSync(resolve(OUT_DIR, `${name}_deep.json`), JSON.stringify(dom, null, 2));
    results.push({ name, dom });
    console.log(`  ${name}: ${dom.body.children.length} body children`);
    await ctx.close();
  }

  await browser.close();

  // Tag counts
  const local = results.find(r => r.name === 'local').dom;
  const remote = results.find(r => r.name === 'remote').dom;

  const localTags = tagCounts(local.body);
  const remoteTags = tagCounts(remote.body);

  const allTags = new Set([...Object.keys(localTags), ...Object.keys(remoteTags)]);
  console.log('\n=== Tag Count Comparison ===');
  console.log('Tag'.padEnd(15) + 'Local'.padEnd(10) + 'Remote'.padEnd(10) + 'Diff');
  console.log('-'.repeat(35));
  for (const tag of [...allTags].sort()) {
    const lc = localTags[tag] || 0;
    const rc = remoteTags[tag] || 0;
    const diff = rc - lc;
    if (diff !== 0) {
      console.log(tag.padEnd(15) + String(lc).padEnd(10) + String(rc).padEnd(10) + (diff > 0 ? `+${diff}` : String(diff)));
    }
  }

  // Class counts
  const localCls = classCounts(local.body);
  const remoteCls = classCounts(remote.body);
  const allCls = new Set([...Object.keys(localCls), ...Object.keys(remoteCls)]);

  console.log('\n=== Class Count Comparison (differing only) ===');
  console.log('Class'.padEnd(40) + 'Local'.padEnd(10) + 'Remote');
  console.log('-'.repeat(60));
  for (const cls of [...allCls].sort()) {
    const lc = localCls[cls] || 0;
    const rc = remoteCls[cls] || 0;
    if (lc !== rc) {
      console.log(cls.padEnd(40) + String(lc).padEnd(10) + String(rc));
    }
  }

  // Write tag trees
  console.log('\nWriting tree files...');
  writeFileSync(resolve(OUT_DIR, 'local_tree.txt'), printTree(local.body).join('\n'));
  writeFileSync(resolve(OUT_DIR, 'remote_tree.txt'), printTree(remote.body).join('\n'));
  console.log('Trees saved to institutions/local_tree.txt and remote_tree.txt');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
