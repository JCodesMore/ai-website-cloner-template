/**
 * Product Detail Scraper — Cheerio DOM extraction → PostgreSQL direct write.
 *
 * Uses proper CSS selectors (not regex) for reliable extraction from bbxin.com's
 * server-rendered PHP pages. No browser needed — the target site renders content
 * server-side, so cheerio's static DOM parsing is equally accurate.
 *
 * Usage:
 *   bun run scrape-to-pg.mjs                     # repair all products with gaps
 *   bun run scrape-to-pg.mjs --id 828             # scrape single product
 *   bun run scrape-to-pg.mjs --missing            # only products missing advantages/summary
 *   bun run scrape-to-pg.mjs --all                # re-scrape every product
 */

import { load } from "cheerio";
import { Pool } from "pg";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const IMG_DIR = resolve(ROOT, "public", "images", "remote");

if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const BASE = "https://www.bbxin.com";
const CONCURRENCY = 8;
const TIMEOUT = 10000;

// ── Helpers ──────────────────────────────────────────────

function text($, sel) {
  const el = $(sel);
  return el.length ? el.first().text().trim() : "";
}

function attr($, sel, name) {
  const el = $(sel);
  return el.length ? (el.first().attr(name) || "") : "";
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

function normalizeImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("/images/")) return url;
  const match = url.match(/\/([^\/]+\.(png|jpg|jpeg|gif|webp|svg))$/i);
  if (match) return `/images/remote/${match[1]}`;
  return url;
}

async function downloadImage(url) {
  if (!url || url.startsWith("/images/")) return;
  const name = basename(url.split("?")[0]);
  if (!name) return;
  const dest = resolve(IMG_DIR, name);
  if (existsSync(dest)) return;
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) return;
    writeFileSync(dest, Buffer.from(await resp.arrayBuffer()));
  } catch { /* best-effort */ }
}

// ── Core Scraper (cheerio DOM selectors, not regex) ──────

async function scrapeProduct(id) {
  try {
    const resp = await fetch(`${BASE}/products/${id}.html`, {
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!resp.ok) return null;

    const html = await resp.text();
    const $ = load(html);

    // Product name — reliable DOM selector
    const name = text($, ".product-title, h1");

    if (!name) return null;

    // Product logo — DOM selector
    const image = attr($, ".product-detail-logo-v2, .product-detail-logo, .product-logo-container img", "src");

    // Advantages — ALL chips (both adv and tag), via DOM selector
    const advantages = [];
    $(".summary-meta-chip").each((_, el) => {
      const t = $(el).text().trim();
      if (t) advantages.push(t);
    });

    // Product intro HTML — try multiple selectors for different page templates
    const selectors = [".product-intro.rich-text", ".product-intro-wrap .rich-text", ".product-intro-wrap"];
    let introHtml = "";
    for (const sel of selectors) {
      const extracted = $(sel).html();
      if (extracted && extracted.trim().length > 50 && /^\s*</.test(extracted.trim())) {
        introHtml = extracted;
        break;
      }
    }
    // Final fallback: take .product-intro-wrap innerHTML even if regex check fails
    if (!introHtml) introHtml = $(".product-intro-wrap").html() || "";

    // Summary text — DOM selector
    const summary = text($, ".product-summary-panel p");

    // Table fields — DOM-based extraction
    const tableData = {};
    $(".product-info-table tr, .layui-table tr").each((_, row) => {
      const cells = $(row).find("td");
      const texts = [];
      cells.each((_, td) => texts.push($(td).text().trim()));
      for (let i = 0; i < texts.length - 1; i += 2) {
        if (texts[i] && texts[i + 1]) tableData[texts[i]] = texts[i + 1];
      }
    });

    // Institution link — DOM selector
    // Match institution detail links (/institutions/123.html), NOT breadcrumb (/institutions.html)
    const institutionFullName = text($, "a[href*='/institutions/']");
    const institutionHref = attr($, "a[href*='/institutions/']", "href") || "";

    // Images in intro HTML (for downloading)
    const introImages = [];
    $(".product-intro img, .rich-text img").each((_, el) => {
      const src = $(el).attr("src");
      if (src) introImages.push(src);
    });

    // ── Normalize ──
    const logoUrl = normalizeImageUrl(image);

    // Download product logo
    await downloadImage(image);

    // Download images in intro (concurrent, best-effort)
    await Promise.all(introImages.map(downloadImage));

    const shortInst = institutionFullName
      .replace(/（[^）]*）/g, "")
      .replace(/(股份有限公司|有限责任公司|有限公司|股份公司)/g, "")
      .trim()
      .slice(0, 16);

    return {
      id,
      name,
      image: logoUrl,
      institution: shortInst,
      institutionFullName,
      institutionHref,
      maxAmount: tableData["最高额度"] || tableData["额度"] || "",
      term: tableData["贷款期限"] || tableData["期限"] || "",
      rate: tableData["贷款利率"] || tableData["利率"] || "",
      repayment: tableData["还款方式"] || "",
      advantages,
      summary,
      introHtml,
    };
  } catch (err) {
    console.error(`  [${id}] Error:`, err.message);
    return null;
  }
}

// ── PostgreSQL writer ─────────────────────────────────────

async function upsertProduct(data) {
  await pool.query(
    `INSERT INTO products (id, name, image, institution, institution_full_name, institution_href,
       max_amount, term, rate, repayment, advantages, summary, intro_html, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (id) DO UPDATE SET
       name=$2, image=$3, institution=$4, institution_full_name=$5, institution_href=$6,
       max_amount=$7, term=$8, rate=$9, repayment=$10, advantages=$11, summary=$12,
       intro_html=$13, updated_at=$14`,
    [
      data.id, data.name, data.image, data.institution,
      data.institutionFullName, data.institutionHref,
      data.maxAmount, data.term, data.rate, data.repayment,
      JSON.stringify(data.advantages), data.summary, data.introHtml,
      new Date(),
    ]
  );
}

// ── Main ─────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const singleId = args.includes("--id") ? parseInt(args[args.indexOf("--id") + 1]) : null;
  const missingOnly = args.includes("--missing");
  const allProducts = args.includes("--all");

  let ids;

  if (singleId) {
    ids = [singleId];
    console.log(`Scraping single product: ${singleId}`);
  } else if (missingOnly) {
    const { rows } = await pool.query(
      `SELECT id FROM products
       WHERE jsonb_array_length(advantages) = 0
          OR summary IS NULL OR summary = ''
       ORDER BY id`
    );
    ids = rows.map(r => r.id);
    console.log(`Found ${ids.length} products with data gaps (--missing mode).`);
  } else if (allProducts) {
    const { rows } = await pool.query(`SELECT id FROM products ORDER BY id`);
    ids = rows.map(r => r.id);
    console.log(`Re-scraping all ${ids.length} products.`);
  } else {
    const { rows } = await pool.query(
      `SELECT id FROM products
       WHERE jsonb_array_length(advantages) = 0
          OR summary IS NULL OR summary = ''
          OR intro_html IS NULL OR length(intro_html) < 300
          OR image LIKE 'https://%'
       ORDER BY id`
    );
    ids = rows.map(r => r.id);
    console.log(`Found ${ids.length} products with data gaps (default repair mode).`);
  }

  if (ids.length === 0) {
    console.log("Nothing to scrape.");
    await pool.end();
    return;
  }

  console.log(`Concurrency: ${CONCURRENCY}, timeout: ${TIMEOUT}ms`);

  let scraped = 0, failed = 0, written = 0;

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const batch = ids.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(id => scrapeProduct(id)));

    for (const r of results) {
      if (!r) { failed++; continue; }
      scraped++;
      try {
        await upsertProduct(r);
        written++;
        process.stdout.write(`\r  [${scraped}/${ids.length}] #${r.id} ${r.name} | adv:${r.advantages.length} intro:${r.introHtml.length}c summary:${r.summary.length}c    `);
      } catch (err) {
        console.error(`\n  DB write error for ${r.id}:`, err.message);
        failed++;
      }
    }
  }

  console.log(`\nDone. Scraped ${scraped}, written ${written}, failed ${failed}.`);

  // Verify
  const { rows: verify } = await pool.query(
    `SELECT count(*) as total,
       count(*) FILTER (WHERE jsonb_array_length(advantages) = 0) as no_adv,
       count(*) FILTER (WHERE summary IS NULL OR summary = '') as no_summary,
       count(*) FILTER (WHERE image LIKE 'https://%') as remote_img
     FROM products`
  );
  console.log(`\nData health: total=${verify[0].total} | no_adv=${verify[0].no_adv} | no_summary=${verify[0].no_summary} | remote_img=${verify[0].remote_img}`);
  console.log(`Run 'bun run data:check' to see full report.`);

  await pool.end();
}

main().catch(err => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
