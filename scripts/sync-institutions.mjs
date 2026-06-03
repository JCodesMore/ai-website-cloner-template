import { readFileSync, writeFileSync } from 'fs';
import { load } from 'cheerio';

const DATA_DIR = new URL('../src/data/', import.meta.url).pathname.replace(/^\/[A-Z]:/, '');

const institutions = JSON.parse(readFileSync(DATA_DIR + 'institutions.json', 'utf-8'));
const details = JSON.parse(readFileSync(DATA_DIR + 'institutionDetails.json', 'utf-8'));
const detailIds = new Set(details.map(d => Number(d.id)));

const missing = institutions.filter(i => !detailIds.has(i.id)).map(i => i.id);
console.log(`Institutions: ${institutions.length} | Details: ${details.length} | Missing: ${missing.length}`);

const BATCH = 8;
const TIMEOUT = 8000;

async function scrapeOne(id) {
  try {
    const resp = await fetch(`https://www.bbxin.com/institutions/${id}.html`, {
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!resp.ok) return null;
    const html = await resp.text();
    const $ = load(html);

    const name = $('.org-title').text().trim();
    if (!name) return null;

    // Only capture real logos, skip site-level images like logo_write.png
    const logoImg = $('.org-logo img').filter((i, el) => !$(el).attr('src')?.includes('/statics/'));
    const logo = logoImg.attr('src') || '';
    const fullNameText = $('.org-rich-text').text();
    const fullMatch = fullNameText.match(/全称[：:]?\s*(.+?)(?:[，。）\)]|$)/);
    const fullName = (fullMatch ? fullMatch[1].trim() : '').slice(0, 80) || name;

    const website = $('a:contains("访问官网")').attr('href') || '';

    const introHtml = $('.org-rich-text').html() || '';

    const products = [];
    $('.org-product-name').each((i, el) => {
      let prodName = $(el).text().trim();
      const prodLink = $(el).closest('a').attr('href') || '';
      // Guard: if cheerio captured sibling text (metrics), extract only the first line
      if (prodName.length > 30 || /最高额度|参考利息|还款方式|还款期限/.test(prodName)) {
        prodName = prodName.split(/\s{2,}/)[0].trim();
      }
      products.push({ name: prodName, href: prodLink, icon: '' });
    });

    return { id: String(id), name, fullName, logo, website, introHtml, products };
  } catch {
    return null;
  }
}

async function main() {
  let added = 0, failed = 0;

  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(id => scrapeOne(id)));

    for (const r of results) {
      if (!r) { failed++; continue; }
      details.push(r);
      added++;
    }

    const done = Math.min(i + BATCH, missing.length);
    process.stdout.write(`\r${done}/${missing.length} | added=${added} failed=${failed}`);
  }

  writeFileSync(DATA_DIR + 'institutionDetails.json', JSON.stringify(details, null, 2), 'utf-8');
  console.log(`\nDone. ${added} added, ${failed} failed. institutionDetails now has ${details.length} entries.`);
}

main().catch(console.error);
