import { readFileSync, writeFileSync } from 'fs';
import { load } from 'cheerio';

const DATA_DIR = new URL('../src/data/', import.meta.url).pathname.replace(/^\/[A-Z]:/, '');

const details = JSON.parse(readFileSync(DATA_DIR + 'productDetails.json', 'utf-8'));
const categories = {};
for (const f of ['fastProducts', 'companyProducts', 'personProducts', 'pledgeProducts']) {
  categories[f] = JSON.parse(readFileSync(DATA_DIR + f + '.json', 'utf-8'));
}

let maxId = 0;
for (const products of Object.values(categories)) {
  for (const p of products) if (p.id > maxId) maxId = p.id;
}
console.log(`Max product ID in local data: ${maxId}`);

const BATCH = 15;
const TIMEOUT = 8000;

/**
 * Strip HTML tags from a string.
 */
function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * Fetch and parse a single product detail page.
 * Returns all fields needed for both listing JSON and productDetails JSON.
 */
async function fetchProduct(id) {
  try {
    const resp = await fetch(`https://www.bbxin.com/products/${id}.html`, {
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    // Name
    const name = (html.match(/<h1 class="product-title">([^<]+)<\/h1>/) || [])[1];
    if (!name) return null;

    // Logo
    const logo =
      (html.match(/<img[^>]*product-detail-logo[^>]*src="([^"]+)"/) || [])[1] || '';

    // Institution full name (the <a> inside the table cell)
    const instFull =
      (html.match(/<a href="\/institutions\/\d+\.html"[^>]*>([^<]+)<\/a>/) || [])[1] || '';

    // Institution href
    const instHref =
      (html.match(/href="(\/institutions\/\d+\.html)"/) || [])[1] || '';

    // Table values — extract <td> contents in order
    const allTds = html.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || [];
    const tdTexts = allTds.map(td => stripTags(td)).filter(t => t);

    // Table structure: 产品名称, NAME, 贷款利率, RATE, 贷款期限, TERM, 最高额度, AMOUNT, 还款方式, REPAYMENT, 所属机构, INST
    const fieldMap = { '产品名称': -1, '贷款利率': -1, '贷款期限': -1, '最高额度': -1, '还款方式': -1 };
    for (let i = 0; i < tdTexts.length; i++) {
      if (fieldMap[tdTexts[i]] !== undefined) fieldMap[tdTexts[i]] = i + 1;
    }
    const rate    = fieldMap['贷款利率'] >= 0 ? tdTexts[fieldMap['贷款利率']] : '';
    const term    = fieldMap['贷款期限'] >= 0 ? tdTexts[fieldMap['贷款期限']] : '';
    const amount  = fieldMap['最高额度'] >= 0 ? tdTexts[fieldMap['最高额度']] : '';
    const repay   = fieldMap['还款方式'] >= 0 ? tdTexts[fieldMap['还款方式']] : '';

    // Short institution name for listing display
    const shortInst = truncateInst(instFull);

    // Advantages + tag chips — use cheerio for reliable extraction
    const $ = load(html);
    const advs = [];
    $(".summary-meta-chip").each((_, el) => {
      const t = $(el).text().trim();
      if (t) advs.push(t);
    });

    // Summary — DOM selector
    const summary = $(".product-summary-panel p").first().text().trim();

    // Product intro HTML — try multiple selectors for different page templates
    const selectors = ['.product-intro.rich-text', '.product-intro-wrap .rich-text', '.product-intro-wrap'];
    let introHtml = '';
    for (const sel of selectors) {
      const extracted = $(sel).html();
      if (extracted && extracted.trim().length > 50 && /^\s*</.test(extracted.trim())) {
        introHtml = extracted;
        break;
      }
    }
    // Final fallback: take .product-intro-wrap innerHTML even if regex check fails
    if (!introHtml) introHtml = $('.product-intro-wrap').html() || '';

    return {
      id: String(id), name, logo, shortInst, instFull, instHref,
      rate, term, amount, repay, advs, introHtml, summary,
    };
  } catch {
    return null;
  }
}

/**
 * Derive a short institution name from the full company name.
 */
function truncateInst(full) {
  return full
    .replace(/（[^）]*）/g, '')
    .replace(/(股份有限公司|有限责任公司|有限公司|股份公司)/g, '')
    .trim()
    .slice(0, 16);
}

async function main() {
  // Build set of existing IDs across ALL listing files
  const existingIds = new Set();
  for (const products of Object.values(categories)) {
    for (const p of products) existingIds.add(p.id);
  }

  const END = maxId + 200;
  console.log(`Probing IDs 1..${END} for missing products...\n`);

  const missing = [];
  for (let i = 1; i <= END; i += BATCH) {
    const batch = [];
    for (let j = i; j < i + BATCH && j <= END; j++) {
      if (!existingIds.has(j)) batch.push(j);
    }
    if (batch.length === 0) continue;

    const results = await Promise.all(batch.map(id => fetchProduct(id)));
    for (const r of results) {
      if (r) {
        missing.push(r);
        process.stdout.write(`\r  Found: [${r.id}] ${r.name} (${missing.length} total)          `);
      }
    }
    const done = Math.min(i + BATCH - 1, END);
    process.stdout.write(`\r  Scanning ${done}/${END} | new: ${missing.length}          `);
  }

  console.log(`\nFound ${missing.length} new products.`);

  const personProducts = categories['personProducts'];

  // ── Phase 1: add new products ──
  let addedListing = 0, addedDetails = 0;

  for (const p of missing) {
    if (!personProducts.find(x => x.id === Number(p.id))) {
      personProducts.push({
        id: Number(p.id), name: p.name, image: p.logo, institution: p.shortInst,
        maxAmount: p.amount, term: p.term, rate: p.rate, repayment: p.repay,
        promo: '', commentCount: 0, href: `/products/person/${p.id}`,
      });
      addedListing++;
    }
    if (!details.find(x => x.id === p.id)) {
      details.push({
        id: p.id, category: 'person', name: p.name, image: p.logo,
        institution: p.shortInst, institutionFullName: p.instFull, institutionHref: p.instHref,
        maxAmount: p.amount, term: p.term, rate: p.rate, repayment: p.repay,
        advantages: p.advs, summary: p.summary, introHtml: p.introHtml,
      });
      addedDetails++;
    }
  }
  if (addedListing > 0) console.log(`  Phase 1 (new): +${addedListing} listing, +${addedDetails} details`);

  // ── Phase 2: repair & create missing product details ──
  // Find products in listing files without any detail entry
  const listingIdSet = new Set();
  for (const products of Object.values(categories)) {
    for (const p of products) listingIdSet.add(String(p.id));
  }
  const pdIdSet = new Set(details.map(d => d.id));
  const missingDetails = [...listingIdSet].filter(id => !pdIdSet.has(id));

  // Scan existing details for gaps
  const gaps = [];
  for (const d of details) {
    const needsAdv = !d.advantages || d.advantages.length === 0;
    const needsTable = !d.maxAmount || !d.term || !d.rate || !d.repayment
      || d.rate.includes('万元');
    const needsSummary = !d.summary || d.summary.length === 0;
    const needsIntro = d.introHtml && (d.introHtml.length < 500 || /^[a-z-]+">/.test(d.introHtml.trim()));
    if (needsAdv || needsTable || needsSummary || needsIntro) gaps.push(d.id);
  }
  // Also re-scrape products that may have tag chips not captured before
  const hasAdvButNoTags = details.filter(d =>
    d.advantages && d.advantages.length > 0 && d.maxAmount && !d.rate.includes('万元')
  );
  console.log(`\n  Phase 2 (repair): ${gaps.length} need repair, ${missingDetails.length} missing details.`);
  console.log(`    Also refreshing ${hasAdvButNoTags.length} complete products for tag chips...`);

  // First batch: repair + create missing entries
  let repaired = 0, created = 0, enriched = 0;
  const allToScan = [...new Set([...gaps, ...hasAdvButNoTags.map(d => d.id), ...missingDetails])];

  for (let i = 0; i < allToScan.length; i += BATCH) {
    const batch = allToScan.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(id => fetchProduct(id)));

    for (const r of results) {
      if (!r) continue;
      let d = details.find(x => x.id === r.id);
      if (!d) {
        // Create new detail entry for product missing from productDetails.json
        d = {
          id: r.id, category: '', name: r.name, image: r.logo,
          institution: r.shortInst, institutionFullName: r.instFull, institutionHref: r.instHref,
          maxAmount: r.amount, term: r.term, rate: r.rate, repayment: r.repay,
          advantages: r.advs, summary: r.summary, introHtml: r.introHtml,
        };
        details.push(d);
        created++;
        continue;
      }
      let changed = false;

      // Merge advantages (union: keep existing + add new ones not already present)
      const existingSet = new Set(d.advantages || []);
      for (const a of r.advs) {
        if (!existingSet.has(a)) { d.advantages = [...(d.advantages || []), a]; changed = true; }
      }

      // Fix table fields
      if (!d.maxAmount || d.rate.includes('万元')) {
        if (r.amount) { d.maxAmount = r.amount; changed = true; }
      }
      if (!d.rate || d.rate.includes('万元')) {
        if (r.rate) { d.rate = r.rate; changed = true; }
      }
      if (!d.term && r.term) { d.term = r.term; changed = true; }
      if (!d.repayment && r.repay) { d.repayment = r.repay; changed = true; }
      if (!d.summary && r.summary) { d.summary = r.summary; changed = true; }
      const hasTruncatedImg = d.introHtml && /\/images\/remote\/(div|p|span|a|strong|br)[>]/.test(d.introHtml);
      if (r.introHtml && (!d.introHtml || d.introHtml.length < 500 || /^[a-z-]+">/.test(d.introHtml.trim()) || hasTruncatedImg)) { d.introHtml = r.introHtml; changed = true; }
      if (!d.institutionFullName && r.instFull) { d.institutionFullName = r.instFull; changed = true; }
      if (!d.institutionHref && r.instHref) { d.institutionHref = r.instHref; changed = true; }
      if (!d.image && r.logo) { d.image = r.logo; changed = true; }

      if (changed) {
        if (gaps.includes(d.id)) repaired++;
        else enriched++;
      }
    }
    const done = Math.min(i + BATCH, allToScan.length);
    process.stdout.write(`\r    ${done}/${allToScan.length} | repaired=${repaired} created=${created} enriched=${enriched}          `);
  }
  console.log(`\n    Repaired ${repaired}, created ${created}, enriched ${enriched} with tags.`);

  // ── Phase 3: cross-category sync ──
  // Products on the live site may appear in categories our local data doesn't reflect.
  // Scrape each category listing to discover cross-category memberships.
  const CATEGORIES = [
    { key: 'personProducts', slug: 'person' },
    { key: 'fastProducts',    slug: 'fast' },
    { key: 'companyProducts', slug: 'company' },
    { key: 'pledgeProducts',  slug: 'pledge' },
  ];
  const MAX_PAGES = 5;

  console.log(`\n  Phase 3 (cross-category): syncing product membership...`);

  // Build a lookup: product ID → source object from any local category
  const productById = {};
  for (const [key, products] of Object.entries(categories)) {
    for (const p of products) {
      if (!productById[p.id]) productById[p.id] = p;
    }
  }

  let crossAdded = 0;

  for (const cat of CATEGORIES) {
    const localIds = new Set(categories[cat.key].map(p => p.id));
    const liveIds = new Set();

    // Scrape up to MAX_PAGES pages
    for (let page = 1; page <= MAX_PAGES; page++) {
      try {
        const url = `https://www.bbxin.com/products/${cat.slug}.html?page=${page}`;
        const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!resp.ok) break;
        const html = await resp.text();
        const re = new RegExp(`/products/${cat.slug}/(\\d+)\\.html`, 'g');
        let m;
        let count = 0;
        while ((m = re.exec(html)) !== null) { liveIds.add(Number(m[1])); count++; }
        if (count === 0) break;
      } catch { break; }
    }

    // Find products that are on the live site but missing locally
    let added = 0;
    for (const id of liveIds) {
      if (localIds.has(id)) continue;
      const src = productById[id];
      if (!src) continue; // not in ANY local category → will be caught by Phase 1 next run
      categories[cat.key].push({
        ...src,
        href: `/products/${cat.slug}/${src.id}`,
      });
      added++;
    }

    if (added > 0) {
      console.log(`    ${cat.key}: +${added} from other categories`);
      crossAdded += added;
    }
  }

  if (crossAdded === 0) {
    console.log('    All categories already in sync.');
  }

  // Save all category files
  for (const [key, products] of Object.entries(categories)) {
    writeFileSync(DATA_DIR + key + '.json', JSON.stringify(products, null, 2), 'utf-8');
  }
  writeFileSync(DATA_DIR + 'productDetails.json', JSON.stringify(details, null, 2), 'utf-8');

  // Verify
  const finalPdIds = new Set(details.map(d => Number(d.id)));
  const allListingIds = new Set();
  for (const products of Object.values(categories)) {
    for (const p of products) allListingIds.add(p.id);
  }
  const stillMissingDetails = [...allListingIds].filter(id => !finalPdIds.has(id));
  const stillEmptyAdv = details.filter(d => !d.advantages || d.advantages.length === 0).length;

  console.log(`\n  Summary:`);
  console.log(`    personProducts: ${personProducts.length} | productDetails: ${details.length}`);
  console.log(`    No detail entry: ${stillMissingDetails.length} | Empty advantages: ${stillEmptyAdv}`);
  if (stillMissingDetails.length === 0 && stillEmptyAdv === 0) {
    console.log('    Status: FULLY IN SYNC');
  }
}

main().catch(console.error);
