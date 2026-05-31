# Data Scraper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone Node.js scraper to fill ~202 missing product details, ~105 article details, and ~29 institution details by scraping bbxin.com HTML.

**Architecture:** Single `scripts/fetch-missing-data.mjs` script using cheerio for HTML parsing. Parses sitemap.xml to find missing IDs, fetches each page, extracts structured data, appends to existing JSON files.

**Tech Stack:** Node.js 18+ (built-in fetch), cheerio (HTML parsing)

---

### Task 1: Install cheerio dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install cheerio**

Run: `npm install cheerio`
Expected: Added to `node_modules/` and `package.json` dependencies.

- [ ] **Step 2: Verify install**

Run: `node -e "try { require('cheerio'); console.log('OK'); } catch(e) { console.log('FAIL'); }"`
Expected: `OK`

---

### Task 2: Create the scraper script

**Files:**
- Create: `scripts/fetch-missing-data.mjs`

This is the main scraper. It reads `sitemap.xml`, categorizes URLs, cross-references against existing JSON data, fetches missing pages, extracts fields with cheerio, and appends to the JSON files.

**Script structure:**
1. Parse sitemap.xml → get all URLs
2. Classify URLs into: product (`/products/...`), article (`/articles/...`), institution (`/institutions/...`), other (skip)
3. Extract numeric IDs from each URL
4. Read existing JSON files to determine which IDs are already populated
5. Compute missing IDs per type
6. Loop over missing IDs with 1-2s random delay between requests
7. For each: fetch URL, cheerio parse, extract fields, write to JSON

**Key design decisions:**
- Use `Set` to track processed IDs (resume safety)
- Atomic writes: write to `.tmp` file, then rename
- Progress output every 5 items per type
- Error logging to `data/scraper-errors.json`
- Fetch with `User-Agent: Mozilla/5.0` header (required by target site)

- [ ] **Step 1: Create the script file**

```mjs
// scripts/fetch-missing-data.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { parseString } from 'xml2js'; // or use regex to avoid extra dep

const BASE_URL = 'https://bbxin.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// ... full script below in subsequent steps
```

- [ ] **Step 2: Implement sitemap parser**

Parse `sitemap.xml` to extract all `<loc>` URLs. Group them by type:

```mjs
function classifyUrl(url) {
  const u = new URL(url);
  const path = u.pathname.replace(/\.html$/, '');
  // /products/{id} or /products/{category}/{id}
  const productMatch = path.match(/^\/products(?:\/(\w+))?\/(\d+)$/);
  if (productMatch) return { type: 'product', id: productMatch[2], category: productMatch[1] || null };
  // /articles/{id}
  const articleMatch = path.match(/^\/articles\/(\d+)$/);
  if (articleMatch) return { type: 'article', id: articleMatch[1] };
  // /institutions/{id}
  const instMatch = path.match(/^\/institutions\/(\d+)$/);
  if (instMatch) return { type: 'institution', id: instMatch[1] };
  return { type: 'other' };
}
```

- [ ] **Step 3: Implement missing ID detection**

Read existing JSON files and compute which IDs are missing:

```mjs
function loadExistingIds(filePath) {
  if (!existsSync(filePath)) return new Set();
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  return new Set(data.map(item => String(item.id)));
}
```

For products: collect existing IDs from `productDetails.json`.
For articles: collect existing IDs from `articleDetails.json`.
For institutions: collect existing IDs from `institutionDetails.json`.

- [ ] **Step 4: Implement product page scraper**

Fetch product page, extract all fields with cheerio selectors:

```mjs
async function scrapeProduct(id, category) {
  const path = category ? `/products/${category}/${id}.html` : `/products/${id}.html`;
  const html = await fetchWithRetry(BASE_URL + path);
  const $ = cheerio.load(html);

  return {
    id,
    category: category || '',
    name: $('.ley-prodetail-name').text().trim(),
    image: $('.ley-prodetail-img img').attr('src') || '',
    institution: $('.ley-prodetail-meta a[href^="/institutions/"]').first().text().trim(),
    institutionFullName: '',  // may not be on page, extract from related section
    institutionHref: $('.ley-prodetail-meta a[href^="/institutions/"]').first().attr('href') || '',
    maxAmount: extractTableValue($, '最高额度'),
    term: extractTableValue($, '贷款期限'),
    rate: extractTableValue($, '参考利率'),
    repayment: extractTableValue($, '还款方式'),
    advantages: [],
    summary: '',
    introHtml: $('.ley-prodetail-intro').html() || '',
  };
}
```

Note: Extract `introHtml` from `.ley-prodetail-intro` inner HTML. The existing data has this stored with a leading fragment `product-intro-wrap">\r\n            \r\n            <p>...`, so the scraper should save the raw HTML from `.ley-prodetail-intro`.

- [ ] **Step 5: Implement article page scraper**

```mjs
async function scrapeArticle(id) {
  const html = await fetchWithRetry(`${BASE_URL}/articles/${id}.html`);
  const $ = cheerio.load(html);

  return {
    id: Number(id),
    title: $('h1').text().trim(),
    date: $('.ley-article-meta .date').text().trim(),
    viewCount: Number($('.ley-article-meta .view-count').text().trim()) || 0,
    body: $('.ley-article-body').html() || '',
  };
}
```

- [ ] **Step 6: Implement institution page scraper**

```mjs
async function scrapeInstitution(id) {
  const html = await fetchWithRetry(`${BASE_URL}/institutions/${id}.html`);
  const $ = cheerio.load(html);

  // Extract products from the "在营产品" section
  const products = [];
  $('.org-products-card a[href^="/products/"]').each((i, el) => {
    const href = $(el).attr('href');
    const name = $(el).text().trim();
    const productId = href ? href.match(/\/(\d+)$/)?.[1] : null;
    if (name && productId) products.push({ name, href: `/products/${productId}`, id: Number(productId) });
  });

  return {
    id,
    name: $('.ley-inst-profile-name').first().text().trim(),
    fullName: '',
    logo: $('.ley-inst-profile-logo img').attr('src') || '',
    website: $('.ley-inst-profile-website a').attr('href') || '',
    introHtml: $('.org-rich-text').html() || $('.ley-inst-profile-intro').html() || '',
    products,
  };
}
```

- [ ] **Step 7: Wire up the main orchestrator**

The main function:
1. Parse sitemap → classify → group by type
2. Load existing IDs from each JSON file
3. Compute missing IDs
4. For missing IDs in each type, fetch → parse → append to JSON
5. Write errors to `data/scraper-errors.json`
6. Print summary at the end

```mjs
async function main() {
  console.log('=== bbxin.com Missing Data Scraper ===');
  
  // 1. Parse sitemap
  const sitemap = readFileSync('sitemap.xml', 'utf-8');
  const urls = parseSitemapUrls(sitemap);
  console.log(`Found ${urls.length} URLs in sitemap`);
  
  // 2. Classify
  const byType = { product: [], article: [], institution: [] };
  for (const url of urls) {
    const { type, id, category } = classifyUrl(url);
    if (type !== 'other') byType[type].push({ id, category });
  }
  console.log(`Products: ${byType.product.length}, Articles: ${byType.article.length}, Institutions: ${byType.institution.length}`);
  
  // 3. Compute missing
  const existingProducts = loadExistingIds('src/data/productDetails.json');
  const existingArticles = loadExistingIds('src/data/articleDetails.json');
  const existingInstitutions = loadExistingIds('src/data/institutionDetails.json');
  
  const missingProducts = [...new Set(byType.product.map(p => p.id))].filter(id => !existingProducts.has(id));
  const missingArticles = [...new Set(byType.article.map(a => a.id))].filter(id => !existingArticles.has(id));
  const missingInsts = [...new Set(byType.institution.map(i => i.id))].filter(id => !existingInstitutions.has(id));
  
  console.log(`Missing: ${missingProducts.length} products, ${missingArticles.length} articles, ${missingInsts.length} institutions`);
  
  // 4. Scrape products
  const processed = { product: new Set(), article: new Set(), institution: new Set() };
  
  for (const id of missingProducts) {
    try {
      const entry = byType.product.find(p => p.id === id);
      const data = await scrapeProduct(id, entry?.category || null);
      appendToJson('src/data/productDetails.json', data);
      processed.product.add(id);
    } catch (err) {
      logError('product', id, err.message);
    }
    await delay(randomBetween(1000, 2000));
  }
  
  // ... similar loops for articles and institutions
  
  console.log('Done!');
  printSummary(processed, errors);
}
```

- [ ] **Step 8: Implement helper functions**

```mjs
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (i === retries) throw err;
      await delay(2000);
    }
  }
}

function extractTableValue($, label) {
  const th = $(`th:contains("${label}")`);
  if (th.length) return th.next('td').text().trim();
  const dt = $(`dt:contains("${label}")`);
  if (dt.length) return dt.next('dd').text().trim();
  return '';
}

function appendToJson(filePath, newItem) {
  let data = [];
  if (existsSync(filePath)) {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  }
  // Check for duplicate
  if (!data.some(item => String(item.id) === String(newItem.id))) {
    data.push(newItem);
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

function logError(type, id, message) {
  const errors = existsSync('data/scraper-errors.json')
    ? JSON.parse(readFileSync('data/scraper-errors.json', 'utf-8'))
    : [];
  errors.push({ type, id, message, time: new Date().toISOString() });
  writeFileSync('data/scraper-errors.json', JSON.stringify(errors, null, 2), 'utf-8');
}
```

- [ ] **Step 9: Verify script runs**

Run: `node scripts/fetch-missing-data.mjs`
Expected: Script starts, shows progress output, begins fetching pages. Let it run to completion (will take several minutes due to rate limiting).

---

### Task 3: Verify scraped data integrity

- [ ] **Step 1: Check product detail count**

Run: `node -e "const d=require('./src/data/productDetails.json'); console.log(d.length);"`
Expected: >12 (should be ~214 after scraping)

- [ ] **Step 2: Check article detail count**

Run: `node -e "const d=require('./src/data/articleDetails.json'); console.log(d.length);"`
Expected: >3 (should be ~108 after scraping)

- [ ] **Step 3: Check institution detail count**

Run: `node -e "const d=require('./src/data/institutionDetails.json'); console.log(d.length);"`
Expected: >5 (should be ~34 after scraping)

- [ ] **Step 4: Verify no corrupt JSON**

Run: `node -e "const d1=require('./src/data/productDetails.json'); const d2=require('./src/data/articleDetails.json'); const d3=require('./src/data/institutionDetails.json'); console.log('All valid');"`
Expected: `All valid`

- [ ] **Step 5: Spot-check a few entries**

Run: `node -e "const d=require('./src/data/productDetails.json'); const last=d[d.length-1]; console.log(last.id, last.name, last.introHtml ? 'has intro' : 'NO intro');"`
Expected: Shows valid data with introHtml content.

---

### Task 4: Cleanup

- [ ] **Step 1: Commit changes**

```bash
git add scripts/fetch-missing-data.mjs package.json src/data/productDetails.json src/data/articleDetails.json src/data/institutionDetails.json data/scraper-errors.json
git commit -m "feat: add data scraper and populate missing details"
```
