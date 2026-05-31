#!/usr/bin/env node

/**
 * fetch-missing-data.mjs
 *
 * Reads sitemap.xml, cross-references against existing JSON data files,
 * fetches missing product/article/institution pages, extracts fields with cheerio,
 * and appends results to the corresponding JSON files.
 *
 * Usage: node scripts/fetch-missing-data.mjs
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SITEMAP_PATH      = resolve(ROOT, 'sitemap.xml');
const PRODUCTS_PATH     = resolve(ROOT, 'src/data/productDetails.json');
const ARTICLES_PATH     = resolve(ROOT, 'src/data/articleDetails.json');
const INSTITUTIONS_PATH = resolve(ROOT, 'src/data/institutionDetails.json');
const ERRORS_PATH       = resolve(ROOT, 'src/data/scraper-errors.json');

const BASE_URL = 'https://bbxin.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/** Promise-based delay */
const delay = ms => new Promise(r => setTimeout(r, ms));

/** Random integer between min and max (inclusive) */
const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Fetch with retry and timeout */
async function fetchWithRetry(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT },
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      return await response.text();
    } catch (err) {
      if (attempt < retries) {
        const backoff = randomBetween(1000, 2000);
        await delay(backoff);
      } else {
        throw err;
      }
    }
  }
}

/** Read JSON, append newItem (dedup by id), write back */
function appendToJson(filePath, newItem) {
  let data = [];
  if (existsSync(filePath)) {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  }
  // Dedup by id (string comparison) – skip if an item with the same id already exists
  const newId = String(newItem.id);
  const alreadyExists = data.some(item => String(item.id) === newId);
  if (alreadyExists) {
    return false; // not appended
  }
  data.push(newItem);
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return true;
}

/** Append an error entry to the errors log */
function logError(type, id, message) {
  const entry = {
    type,
    id: String(id),
    message,
    timestamp: new Date().toISOString(),
  };
  let errors = [];
  if (existsSync(ERRORS_PATH)) {
    try {
      errors = JSON.parse(readFileSync(ERRORS_PATH, 'utf-8'));
    } catch { /* ignore corrupt file */ }
  }
  errors.push(entry);
  const dir = dirname(ERRORS_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(ERRORS_PATH, JSON.stringify(errors, null, 2), 'utf-8');
}

/** Print progress for a type every 5 items */
function printProgress(type, current, total) {
  if (current % 5 === 0 || current === total) {
    console.log(`  [${type}] ${current}/${total} processed`);
  }
}

// ---------------------------------------------------------------------------
// Sitemap parsing & URL classification
// ---------------------------------------------------------------------------

function classifyUrl(urlStr) {
  const u = new URL(urlStr);
  const path = u.pathname.replace(/\.html$/, '');

  // /products/{id} or /products/{category}/{id}
  const productMatch = path.match(/^\/products(?:\/(\w+))?\/(\d+)$/);
  if (productMatch) {
    return { type: 'product', id: productMatch[2], category: productMatch[1] || null };
  }

  // /articles/{id}
  const articleMatch = path.match(/^\/articles\/(\d+)$/);
  if (articleMatch) {
    return { type: 'article', id: articleMatch[1] };
  }

  // /institutions/{id}
  const instMatch = path.match(/^\/institutions\/(\d+)$/);
  if (instMatch) {
    return { type: 'institution', id: instMatch[1] };
  }

  return { type: 'other' };
}

/** Parse sitemap XML and classify all URLs */
function parseSitemap() {
  const xml = readFileSync(SITEMAP_PATH, 'utf-8');
  const locRegex = /<loc>\s*(.*?)\s*<\/loc>/gi;
  const urls = [];
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  // Group classified URLs
  const productIds = new Map();   // id -> { url, category }
  const articleIds = new Map();   // id -> url
  const institutionIds = new Map(); // id -> url

  for (const url of urls) {
    const result = classifyUrl(url);
    if (result.type === 'product') {
      const id = result.id;
      const category = result.category;
      const existing = productIds.get(id);
      if (!existing) {
        productIds.set(id, { url, category });
      } else {
        // Prefer URL without category (e.g., /products/858.html over /products/fast/858.html)
        if (!result.category) {
          // This URL has no category — prefer it
          productIds.set(id, { url, category: null });
        }
        // Otherwise keep the existing entry (first seen or no-category)
      }
    } else if (result.type === 'article') {
      if (!articleIds.has(result.id)) {
        articleIds.set(result.id, url);
      }
    } else if (result.type === 'institution') {
      if (!institutionIds.has(result.id)) {
        institutionIds.set(result.id, url);
      }
    }
  }

  return { productIds, articleIds, institutionIds };
}

// ---------------------------------------------------------------------------
// Existing data loading
// ---------------------------------------------------------------------------

function loadExistingIds(filePath) {
  if (!existsSync(filePath)) return new Set();
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  return new Set(data.map(item => String(item.id)));
}

// ---------------------------------------------------------------------------
// Scrapers
// ---------------------------------------------------------------------------

/**
 * Scrape a product detail page.
 * URL formats: /products/{id}.html or /products/{category}/{id}.html
 */
async function scrapeProduct(id, category, url) {
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  // Product name from h1.product-title (confirmed via live page HTML)
  const name = $('h1.product-title').text().trim();

  // Product image
  const image = $('.product-detail-logo-v2').attr('src')
    || $('.product-logo-container img').attr('src')
    || '';

  // Extract values from the product info table (td.label / td pairs)
  const maxAmount = extractTableValueByLabel($, '最高额度');
  const term = extractTableValueByLabel($, '贷款期限');
  const rate = extractTableValueByLabel($, '贷款利率');
  const repayment = extractTableValueByLabel($, '还款方式');
  const productNameFromTable = extractTableValueByLabel($, '产品名称');

  // Use h1 name if available, fall back to table name
  const finalName = name || productNameFromTable;

  // Institution from the "所属机构" row
  let institution = '';
  let institutionHref = '';
  let institutionFullName = '';
  $('td.label').each((_, el) => {
    if ($(el).text().trim() === '所属机构') {
      const link = $(el).next('td').find('a[href^="/institutions/"]');
      if (link.length) {
        institutionHref = link.attr('href') || '';
        institutionFullName = link.text().trim();
        institution = institutionFullName;
      }
    }
  });
  // Fallback: first institution link on the page
  if (!institution) {
    const instLink = $('a[href^="/institutions/"]').first();
    institution = instLink.text().trim() || '';
    institutionHref = instLink.attr('href') || '';
    institutionFullName = institution;
  }

  // Advantages: look for bbx-pill-badge elements (common on product pages)
  const advantages = [];
  $('.bbx-pill-badge').each((_, el) => {
    const text = $(el).text().trim();
    if (text) advantages.push(text);
  });

  const summary = '';

  // Intro HTML from product-intro-wrap
  let introHtml = '';
  const introWrap = $('.product-intro-wrap');
  if (introWrap.length) {
    introHtml = introWrap.html() || '';
  }

  return {
    id,
    category: category || '',
    name: finalName,
    image,
    institution,
    institutionFullName,
    institutionHref,
    maxAmount,
    term,
    rate,
    repayment,
    advantages,
    summary,
    introHtml,
  };
}

/**
 * Extract a value from the product info table by finding a td.label with matching text
 * and returning the next td's text content.
 */
function extractTableValueByLabel($, label) {
  let result = '';
  $('td.label').each((_, el) => {
    if ($(el).text().trim() === label) {
      result = $(el).next('td').text().trim();
    }
  });
  return result;
}

/**
 * Scrape an article detail page.
 * URL format: /articles/{id}.html
 */
async function scrapeArticle(id, url) {
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  // Title
  const title = $('h1').first().text().trim()
    || $('.article-title').text().trim()
    || $('.ley-article-title').text().trim()
    || '';

  // Date
  const date = $('.article-meta time, .article-date, .ley-article-date, .article-meta-date')
    .first().text().trim()
    || $('time').first().text().trim()
    || '';

  // View count
  const viewCountText = $('.article-meta .view-count, .article-view-count, .ley-article-view')
    .first().text().trim()
    || '0';
  const viewCount = parseInt(viewCountText.replace(/[^\d]/g, ''), 10) || 0;

  // Body
  let body = '';
  const bodyEl = $('.ley-article-body');
  if (bodyEl.length) {
    body = bodyEl.html() || '';
  }
  if (!body) {
    const richEl = $('.rich-text-content');
    if (richEl.length) {
      body = richEl.html() || '';
    }
  }
  if (!body) {
    const articleContent = $('.article-content, .article-body');
    if (articleContent.length) {
      body = articleContent.html() || '';
    }
  }

  return {
    id: parseInt(id, 10),
    title,
    date,
    viewCount,
    body,
  };
}

/**
 * Scrape an institution detail page.
 * URL format: /institutions/{id}.html
 */
async function scrapeInstitution(id, url) {
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  // Name
  const name = $('.org-name, .inst-name, .ley-inst-name, .org-profile-name').first().text().trim()
    || $('h1').first().text().trim()
    || '';

  // Full name
  const fullName = $('.org-full-name, .inst-full-name').first().text().trim()
    || $('a[href^="/institutions/"]').first().text().trim()
    || name;

  // Logo
  const logo = $('.org-logo img, .inst-logo img, .ley-inst-logo img').first().attr('src')
    || $('img[alt*="logo"], img.org-logo').first().attr('src')
    || '';

  // Website
  const website = $('.org-website a, .inst-website a, .ley-inst-website a').first().attr('href')
    || $('a.website-link').first().attr('href')
    || '';

  // Intro HTML
  let introHtml = '';
  const introEl = $('.org-rich-text');
  if (introEl.length) {
    introHtml = introEl.html() || '';
  }
  if (!introHtml) {
    const fallback = $('.ley-inst-profile-intro');
    if (fallback.length) {
      introHtml = fallback.html() || '';
    }
  }

  // Products from "在营产品" section
  const products = [];
  // Look for product links within or after the "在营产品" heading
  $('h2:contains("在营产品")').each((_, heading) => {
    // Get the parent container and find product links
    const container = $(heading).closest('.org-products-card, .org-section, .products-section, [class*="products"]');
    container.find('a[href^="/products/"]').each((_, link) => {
      const href = $(link).attr('href').replace(/\.html$/, '');
      const pName = $(link).text().trim();
      if (pName && href) {
        const idMatch = href.match(/\/(\d+)$/);
        const pId = idMatch ? parseInt(idMatch[1], 10) : 0;
        products.push({ name: pName, href, id: pId });
      }
    });
  });

  // Fallback: if no products found under heading, look for any product links in the page
  if (products.length === 0) {
    $('a[href^="/products/"]').each((_, link) => {
      const href = $(link).attr('href').replace(/\.html$/, '');
      const pName = $(link).text().trim();
      // Only include links that look like product cards/items (not in-text links)
      const parent = $(link).parent();
      if (parent.is('li, .product-item, [class*="product"]') || parent.find('img').length) {
        if (pName && href) {
          const idMatch = href.match(/\/(\d+)$/);
          const pId = idMatch ? parseInt(idMatch[1], 10) : 0;
          products.push({ name: pName, href, id: pId });
        }
      }
    });
    // Dedup by id
    const seen = new Set();
    const deduped = [];
    for (const p of products) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        deduped.push(p);
      }
    }
    products.length = 0;
    products.push(...deduped);
  }

  return {
    id,
    name,
    fullName,
    logo,
    website,
    introHtml,
    products,
  };
}

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== bbxin.com Data Scraper ===\n');

  // 1. Parse sitemap
  console.log('Parsing sitemap.xml...');
  const { productIds, articleIds, institutionIds } = parseSitemap();
  console.log(`  Found ${productIds.size} unique product IDs, ${articleIds.size} article IDs, ${institutionIds.size} institution IDs\n`);

  // 2. Load existing IDs
  console.log('Loading existing data...');
  const existingProductIds = loadExistingIds(PRODUCTS_PATH);
  const existingArticleIds = loadExistingIds(ARTICLES_PATH);
  const existingInstitutionIds = loadExistingIds(INSTITUTIONS_PATH);
  console.log(`  Existing: ${existingProductIds.size} products, ${existingArticleIds.size} articles, ${existingInstitutionIds.size} institutions\n`);

  // 3. Compute missing IDs
  const missingProductIds = [...productIds.keys()].filter(id => !existingProductIds.has(id));
  const missingArticleIds = [...articleIds.keys()].filter(id => !existingArticleIds.has(id));
  const missingInstitutionIds = [...institutionIds.keys()].filter(id => !existingInstitutionIds.has(id));
  console.log(`Missing: ${missingProductIds.length} products, ${missingArticleIds.length} articles, ${missingInstitutionIds.length} institutions\n`);

  let totalFetched = 0;
  let totalErrors = 0;

  // ---- Products ----
  if (missingProductIds.length > 0) {
    console.log('--- Scraping Products ---');
    for (let i = 0; i < missingProductIds.length; i++) {
      const id = missingProductIds[i];
      const info = productIds.get(id);
      if (!info) {
        logError('product', id, 'No URL found in sitemap');
        totalErrors++;
        printProgress('product', i + 1, missingProductIds.length);
        continue;
      }
      const url = info.url;
      const category = info.category || '';

      try {
        console.log(`  Fetching product ${id}...`);
        const product = await scrapeProduct(id, category, url);
        const appended = appendToJson(PRODUCTS_PATH, product);
        if (appended) {
          totalFetched++;
          console.log(`    -> Scraped: ${product.name}`);
        } else {
          console.log(`    -> Skipped (duplicate): id=${id}`);
        }
      } catch (err) {
        logError('product', id, err.message);
        totalErrors++;
        console.error(`    -> ERROR: ${err.message}`);
      }

      printProgress('product', i + 1, missingProductIds.length);

      // Delay between requests
      if (i < missingProductIds.length - 1) {
        const wait = randomBetween(1000, 2000);
        await delay(wait);
      }
    }
    console.log('');
  }

  // ---- Articles ----
  if (missingArticleIds.length > 0) {
    console.log('--- Scraping Articles ---');
    for (let i = 0; i < missingArticleIds.length; i++) {
      const id = missingArticleIds[i];
      const url = articleIds.get(id);
      if (!url) {
        logError('article', id, 'No URL found in sitemap');
        totalErrors++;
        printProgress('article', i + 1, missingArticleIds.length);
        continue;
      }

      try {
        console.log(`  Fetching article ${id}...`);
        const article = await scrapeArticle(id, url);
        const appended = appendToJson(ARTICLES_PATH, article);
        if (appended) {
          totalFetched++;
          console.log(`    -> Scraped: ${article.title}`);
        } else {
          console.log(`    -> Skipped (duplicate): id=${id}`);
        }
      } catch (err) {
        logError('article', id, err.message);
        totalErrors++;
        console.error(`    -> ERROR: ${err.message}`);
      }

      printProgress('article', i + 1, missingArticleIds.length);

      if (i < missingArticleIds.length - 1) {
        const wait = randomBetween(1000, 2000);
        await delay(wait);
      }
    }
    console.log('');
  }

  // ---- Institutions ----
  if (missingInstitutionIds.length > 0) {
    console.log('--- Scraping Institutions ---');
    for (let i = 0; i < missingInstitutionIds.length; i++) {
      const id = missingInstitutionIds[i];
      const url = institutionIds.get(id);
      if (!url) {
        logError('institution', id, 'No URL found in sitemap');
        totalErrors++;
        printProgress('institution', i + 1, missingInstitutionIds.length);
        continue;
      }

      try {
        console.log(`  Fetching institution ${id}...`);
        const institution = await scrapeInstitution(id, url);
        const appended = appendToJson(INSTITUTIONS_PATH, institution);
        if (appended) {
          totalFetched++;
          console.log(`    -> Scraped: ${institution.name}`);
        } else {
          console.log(`    -> Skipped (duplicate): id=${id}`);
        }
      } catch (err) {
        logError('institution', id, err.message);
        totalErrors++;
        console.error(`    -> ERROR: ${err.message}`);
      }

      printProgress('institution', i + 1, missingInstitutionIds.length);

      if (i < missingInstitutionIds.length - 1) {
        const wait = randomBetween(1000, 2000);
        await delay(wait);
      }
    }
    console.log('');
  }

  // Summary
  console.log('=== Summary ===');
  console.log(`  Fetched: ${totalFetched}`);
  console.log(`  Errors:  ${totalErrors}`);
  const remaining = missingProductIds.length + missingArticleIds.length + missingInstitutionIds.length - totalFetched;
  console.log(`  Skipped (duplicates): ${remaining}`);
  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
