/**
 * Product Detail Comparison — compare local productDetails.json against live bbxin.com
 *
 * Fetches each product detail page from the target site, extracts key fields,
 * and reports discrepancies field-by-field.
 *
 * Usage:
 *   bun run compare-product-details.mjs                  # all products
 *   bun run compare-product-details.mjs --id 172          # single product
 *   bun run compare-product-details.mjs --sample 20       # random sample of 20
 */

import { readFileSync } from "fs";
import { load } from "cheerio";

const BASE = "https://www.bbxin.com";
const TIMEOUT = 10000;
const CONCURRENCY = 8;
const DATA_DIR = new URL("../src/data/", import.meta.url).pathname.replace(/^\/[A-Z]:/, "");

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

function normalizeInstitution(full) {
  return full
    .replace(/（[^）]*）/g, "")
    .replace(/(股份有限公司|有限责任公司|有限公司|股份公司)/g, "")
    .trim()
    .slice(0, 16);
}

function slugify(s) {
  return s.replace(/[\s\r\n]+/g, " ").trim();
}

// ── Scrape live product page ─────────────────────────────

async function fetchLiveProduct(id) {
  try {
    const resp = await fetch(`${BASE}/products/${id}.html`, {
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!resp.ok) return null;
    const html = await resp.text();
    const $ = load(html);

    const name = text($, ".product-title, h1");
    if (!name) return null;

    const image =
      attr($, ".product-detail-logo-v2, .product-detail-logo, .product-logo-container img", "src") || "";
    // Normalize image path like the scraper does
    const imgMatch = image.match(/\/([^\/]+\.(png|jpg|jpeg|gif|webp|svg))$/i);
    const normalizedImage = imgMatch ? `/images/remote/${imgMatch[1]}` : image;

    // Institution
    const institutionFullName = text($, "a[href*='/institutions/']");
    const institutionHref = attr($, "a[href*='/institutions/']", "href") || "";
    const institution = normalizeInstitution(institutionFullName);

    // Advantages
    const advantages = [];
    $(".summary-meta-chip").each((_, el) => {
      const t = $(el).text().trim();
      if (t) advantages.push(t);
    });

    // Intro HTML — try multiple selectors
    const introSelectors = [".product-intro.rich-text", ".product-intro-wrap .rich-text", ".product-intro-wrap"];
    let introHtml = "";
    for (const sel of introSelectors) {
      const extracted = $(sel).html();
      if (extracted && extracted.trim().length > 50 && /^\s*</.test(extracted.trim())) {
        introHtml = extracted;
        break;
      }
    }
    if (!introHtml) introHtml = $(".product-intro-wrap").html() || "";

    // Summary
    const summary = text($, ".product-summary-panel p");

    // Table fields
    const tableData = {};
    $(".product-info-table tr, .layui-table tr").each((_, row) => {
      const texts = [];
      $(row).find("td").each((_, td) => texts.push($(td).text().trim()));
      for (let i = 0; i < texts.length - 1; i += 2) {
        if (texts[i] && texts[i + 1]) tableData[texts[i]] = texts[i + 1];
      }
    });

    return {
      id: String(id),
      name,
      image: normalizedImage,
      institution,
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

// ── Compare ──────────────────────────────────────────────

function compareFields(local, live, field) {
  const diffs = [];
  const l = local[field];
  const r = live[field];

  // Skip format-only differences
  if (field === "image") return diffs;  // remote URL vs /images/remote/ is expected
  if (field === "institutionHref") return diffs;  // .html suffix difference is expected
  if (field === "institution") {
    // Only flag if neither is a substring of the other (same company, different truncation)
    const lv = slugify(l || "");
    const rv = slugify(r || "");
    if (lv && rv && lv !== rv && !lv.includes(rv) && !rv.includes(lv)) {
      diffs.push({ field, type: "mismatch", local: lv, live: rv });
    }
    return diffs;
  }
  if (field === "institutionFullName") {
    // Only flag if completely different (not just a formatting difference)
    const lv = slugify(l || "");
    const rv = slugify(r || "");
    if (lv && rv && lv !== rv) {
      // Accept if they share the core company name
      const lCore = lv.replace(/（.*）/, "").slice(0, 6);
      const rCore = rv.replace(/（.*）/, "").slice(0, 6);
      if (lCore !== rCore) {
        diffs.push({ field, type: "mismatch", local: lv, live: rv });
      }
    }
    return diffs;
  }

  if (field === "introHtml") {
    const lText = slugify(stripTags(l || ""));
    const rText = slugify(stripTags(r || ""));
    if (lText.length < 50 && rText.length >= 50) {
      diffs.push({ field, type: "missing_in_clone", detail: `${rText.length} chars on live, ${lText.length} in clone` });
    } else if (rText.length === 0 && lText.length >= 50) {
      diffs.push({ field, type: "missing_in_live", detail: "live data not captured by scraper" });
    }
  } else if (field === "advantages") {
    const lArr = l || [];
    const rArr = r || [];
    // Only flag if the missing ones are actual content gaps, not small differences
    const localOnly = rArr.filter(a => !lArr.some(la => la === a || a.includes(la) || la.includes(a)));
    const liveOnly = lArr.filter(a => !rArr.some(ra => ra === a || a.includes(ra) || ra.includes(a)));
    if (localOnly.length > 0) diffs.push({ field, type: "missing_in_clone", detail: localOnly });
    if (liveOnly.length > 0) diffs.push({ field, type: "extra_in_clone", detail: liveOnly });
  } else {
    const lv = slugify(l || "");
    const rv = slugify(r || "");
    if (lv && !rv) {
      diffs.push({ field, type: "missing_in_live", local: lv, live: "missing" });
    } else if (!lv && rv) {
      diffs.push({ field, type: "missing_in_clone", local: "missing", live: rv });
    } else if (lv !== rv) {
      diffs.push({ field, type: "mismatch", local: lv, live: rv });
    }
  }
  return diffs;
}

// ── Main ─────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const singleId = args.includes("--id") ? Number(args[args.indexOf("--id") + 1]) : null;
  const sampleN = args.includes("--sample") ? Number(args[args.indexOf("--sample") + 1]) : null;

  const localDetails = JSON.parse(readFileSync(DATA_DIR + "productDetails.json", "utf-8"));

  let productsToCheck;
  if (singleId) {
    productsToCheck = localDetails.filter(d => Number(d.id) === singleId);
    console.log(`Comparing single product: #${singleId}`);
  } else if (sampleN) {
    // Random sample
    const shuffled = [...localDetails].sort(() => Math.random() - 0.5);
    productsToCheck = shuffled.slice(0, sampleN);
    console.log(`Comparing random sample of ${sampleN} products`);
  } else {
    productsToCheck = localDetails;
    console.log(`Comparing all ${localDetails.length} products...`);
  }

  console.log(`Concurrency: ${CONCURRENCY}, timeout: ${TIMEOUT}ms\n`);

  const results = [];
  let scanned = 0, failed = 0;

  for (let i = 0; i < productsToCheck.length; i += CONCURRENCY) {
    const batch = productsToCheck.slice(i, i + CONCURRENCY);
    const fetched = await Promise.all(batch.map(d => fetchLiveProduct(d.id)));

    for (let j = 0; j < batch.length; j++) {
      const local = batch[j];
      const live = fetched[j];
      scanned++;
      process.stdout.write(`\r  [${scanned}/${productsToCheck.length}] #${local.id} ${local.name}`);

      if (!live) {
        failed++;
        results.push({ id: local.id, name: local.name, error: "fetch_failed" });
        continue;
      }

      const allDiffs = [];
      for (const field of ["name", "institution", "institutionFullName", "institutionHref", "maxAmount", "term", "rate", "repayment", "advantages", "summary", "introHtml", "image"]) {
        const diffs = compareFields(local, live, field);
        allDiffs.push(...diffs);
      }

      if (allDiffs.length > 0) {
        results.push({ id: local.id, name: local.name, diffs: allDiffs });
      }
    }
  }

  // ── Report ──────────────────────────────────────────────

  console.log(`\n\nScanned: ${scanned} | Failed: ${failed} | With diffs: ${results.length}\n`);

  // Group by diff type
  const summary = {};
  for (const r of results) {
    if (r.error) {
      summary.fetch_failed = (summary.fetch_failed || 0) + 1;
      continue;
    }
    for (const d of r.diffs) {
      const key = `${d.field}: ${d.type}`;
      summary[key] = (summary[key] || 0) + 1;
    }
  }

  console.log("=== DIFF SUMMARY ===\n");
  for (const [key, count] of Object.entries(summary).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${key}: ${count} products`);
  }

  console.log(`\n=== DETAILED DIFF LIST (${results.length} products) ===\n`);

  for (const r of results) {
    if (r.error) {
      console.log(`  #${r.id} ${r.name} [ERROR: ${r.error}]`);
      continue;
    }
    console.log(`  #${r.id} ${r.name}:`);
    for (const d of r.diffs) {
      if (d.type === "mismatch") {
        console.log(`    ${d.field}: "${d.local}" → "${d.live}"`);
      } else if (d.type === "missing_in_clone") {
        if (d.detail) {
          console.log(`    ${d.field}: missing from clone: [${d.detail.join(", ")}]`);
        } else {
          console.log(`    ${d.field}: missing from clone (live has: "${d.live}")`);
        }
      } else if (d.type === "missing_in_live") {
        console.log(`    ${d.field}: clone has "${d.local}" but live is empty`);
      } else if (d.type === "extra_in_clone") {
        console.log(`    ${d.field}: extra in clone: [${d.detail.join(", ")}]`);
      } else if (d.type === "missing") {
        console.log(`    ${d.field}: ${d.local} / ${d.live}`);
      } else if (d.type === "not_scraped") {
        console.log(`    ${d.field}: live content not captured`);
      } else {
        console.log(`    ${d.field} [${d.type}]: ${JSON.stringify(d.local)} / ${JSON.stringify(d.live)}`);
      }
    }
    console.log("");
  }

  console.log(`=== DONE ===`);
  console.log(`Total checked: ${scanned}, Failed: ${failed}, Products with diffs: ${results.filter(r => !r.error).length}`);
}

main().catch(err => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
