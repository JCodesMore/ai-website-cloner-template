const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const DETAILS_PATH = path.join(__dirname, "..", "src", "data", "productDetails.json");
const BASE_URL = "https://www.bbxin.com/products";

async function scrapeProduct(page, id) {
  const url = `${BASE_URL}/${id}.html`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500);

    const data = await page.evaluate(() => {
      // Institution full name and href from table
      const allTds = Array.from(document.querySelectorAll("td"));
      const instTd = allTds.find(td => td.textContent?.trim() === "所属机构");
      const instValTd = instTd?.nextElementSibling;
      const instLink = instValTd?.querySelector("a");
      const institutionFullName = instLink?.textContent?.trim() || instValTd?.textContent?.trim() || "";
      const institutionHref = instLink?.href || instLink?.getAttribute("href") || "";

      // Summary panel
      const summaryPanel = document.querySelector(".product-summary-panel");
      const summaryMeta = summaryPanel?.querySelector(".product-summary-meta");

      // Summary: text from the first <p> in the summary panel (before the meta row)
      const summaryP = summaryPanel?.querySelector("p");
      const summary = summaryP?.textContent?.replace(/\s+/g, " ").trim() || "";

      // Advantages: chips from .summary-meta-values inside .summary-meta-row
      const chips = Array.from(summaryPanel?.querySelectorAll(".summary-meta-chip") || []);
      const advantages = chips.map(t => t.textContent?.trim() || "").filter(Boolean);

      // Intro HTML: the full product introduction content
      const introWrap = document.querySelector(".product-intro-wrap");
      // Remove the section title header
      const introTitle = introWrap?.querySelector(".product-section-title");
      const introTitleText = introTitle?.textContent || "";
      let introHTML = introWrap?.innerHTML || "";
      // Remove the header element to avoid duplicating it as body content
      if (introTitle) {
        introHTML = introHTML.replace(introTitle.outerHTML, "");
      }
      introHTML = introHTML.trim();

      return {
        institutionFullName,
        institutionHref,
        summary: summary.replace(/\s+/g, " ").trim(),
        advantages,
        introHtml: introHTML,
      };
    });

    if (!data.introHTML || data.introHTML.length < 50) {
      console.log(`  [${id}] WARNING: short intro (${data.introHTML?.length || 0} chars)`);
    } else {
      console.log(`  [${id}] OK — intro:${data.introHTML.length} summary:${data.summary.length} advantages:${data.advantages.length}`);
    }

    return { id, ...data };
  } catch (e) {
    console.log(`  [${id}] ERROR: ${e.message?.substring(0, 60)}`);
    return null;
  }
}

async function main() {
  const browser = await chromium.launch();
  const CONCURRENCY = 6;

  // Load existing details
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(DETAILS_PATH, "utf8"));
  } catch {
    console.log("No existing productDetails.json — starting fresh");
  }

  // Load all product IDs and category mappings from the product JSON files
  const allIds = new Set();
  const catMap = new Map();
  const categories = ["fast", "company", "person", "pledge"];
  for (const cat of categories) {
    try {
      const data = require(`../src/data/${cat}Products.json`);
      data.forEach(p => { allIds.add(p.id); catMap.set(p.id, cat); });
    } catch (e) {
      console.log(`  Skipping ${cat}: ${e.message}`);
    }
  }

  const ids = Array.from(allIds).sort((a, b) => a - b);
  console.log(`Scraping ${ids.length} product detail pages with concurrency=${CONCURRENCY}\n`);

  let scraped = 0;
  let skipped = 0;
  const existingMap = new Map();
  existing.forEach(d => existingMap.set(Number(d.id), d));

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const batch = ids.slice(i, i + CONCURRENCY);
    const pages = await Promise.all(batch.map(() => browser.newPage()));

    const results = await Promise.all(
      batch.map((id, j) => scrapeProduct(pages[j], id).finally(() => pages[j].close()))
    );

    for (const result of results) {
      if (result) {
        result.category = catMap.get(result.id) || "";
        if (existingMap.has(result.id)) {
          Object.assign(existingMap.get(result.id), result);
        } else {
          existing.push(result);
          existingMap.set(result.id, result);
        }
        scraped++;
      } else {
        skipped++;
      }
    }

    if (i > 0 && i % 50 === 0) {
      fs.writeFileSync(DETAILS_PATH, JSON.stringify(existing, null, 2));
      console.log(`  Saved checkpoint at ${i}/${ids.length}`);
    }

    const pct = Math.round((i + batch.length) / ids.length * 100);
    console.log(`Progress: ${i + batch.length}/${ids.length} (${pct}%) — ${scraped} OK, ${skipped} skipped`);
  }

  fs.writeFileSync(DETAILS_PATH, JSON.stringify(existing, null, 2));
  console.log(`\nDone! ${scraped} products scraped (${skipped} skipped)`);
  await browser.close();
}

main().catch(e => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
