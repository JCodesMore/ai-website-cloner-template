const fs = require("fs");
const path = require("path");

const DETAILS_PATH = path.join(__dirname, "..", "src", "data", "articleDetails.json");
const BASE_URL = "https://www.bbxin.com/articles";

// Load existing details
const existing = JSON.parse(fs.readFileSync(DETAILS_PATH, "utf8"));
const existingMap = new Map();
existing.forEach((d) => existingMap.set(Number(d.id), d));

// Load all article IDs from category JSONs
const industry = require("../src/data/industryArticles.json");
const discussion = require("../src/data/discussionArticles.json");
const opinion = require("../src/data/opinionArticles.json");
const faq = require("../src/data/faqArticles.json");
const allIds = new Set([
  ...industry, ...discussion, ...opinion, ...faq,
].map((a) => a.id));

// Find missing articles
const missing = [];
for (const id of allIds) {
  const detail = existingMap.get(id);
  if (!detail || !detail.body || detail.body.length < 100) {
    missing.push(id);
  }
}
console.log(`${missing.length} articles need scraping (${allIds.size} total)`);

// Use Playwright to scrape article bodies
const { chromium } = require("playwright");

async function scrapeArticle(page, id) {
  const url = `${BASE_URL}/${id}.html`;
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const title = document.querySelector("h1")?.textContent?.trim() || "";
      const dateEl = document.querySelector(".article-date, .date, time, [class*=date]");
      const date = dateEl?.textContent?.trim() || "";

      // Extract article body - try common selectors
      const bodyEl =
        document.querySelector(".rich-text-content") ||
        document.querySelector(".article-body") ||
        document.querySelector(".article-content") ||
        document.querySelector("article") ||
        document.querySelector(".content");

      const body = bodyEl?.innerHTML || "";
      const viewCountEl = document.querySelector("[class*=view], [class*=read]");
      const viewCount = parseInt((viewCountEl?.textContent || "").replace(/\D/g, ""), 10) || 0;

      return { title, date, body, viewCount };
    });

    if (!data.body) {
      console.log(`  [${id}] empty body — skipping`);
      return null;
    }

    // Sanitize body
    data.body = data.body
      .replace(/<style>[\s\S]*?<\/style>/g, "")
      .replace(/^rich-text-content"\s+style="[^"]*"\s*>/g, "")
      .replace(/yinmaiquan-keyword/g, "ymq-keyword")
      .replace(/^[\s\n\r]+/, "")
      .trim();

    console.log(`  [${id}] OK — ${data.body.length} chars`);
    return { id, ...data };
  } catch (e) {
    console.log(`  [${id}] ERROR: ${e.message?.substring(0, 80)}`);
    return null;
  }
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const CONCURRENCY = 4;

  let scraped = 0;
  const total = missing.length;

  // Process in batches
  for (let i = 0; i < missing.length; i += CONCURRENCY) {
    const batch = missing.slice(i, i + CONCURRENCY);
    const pages = await Promise.all(batch.map(() => context.newPage()));

    const results = await Promise.all(
      batch.map((id, j) =>
        scrapeArticle(pages[j], id).finally(() => pages[j].close())
      )
    );

    for (const result of results) {
      if (result) {
        if (existingMap.has(result.id)) {
          // Update existing
          const existing_ = existingMap.get(result.id);
          Object.assign(existing_, result);
        } else {
          // Add new
          existing.push(result);
          existingMap.set(result.id, result);
        }
        scraped++;
      }
    }

    const pct = Math.round((i + batch.length) / total * 100);
    console.log(`Progress: ${i + batch.length}/${total} (${pct}%) — ${scraped} scraped`);

    if (i > 0 && i % 50 === 0) {
      // Periodic save
      fs.writeFileSync(DETAILS_PATH, JSON.stringify(existing, null, 2));
      console.log(`Saved checkpoint at ${i}/${total}`);
    }
  }

  // Final save
  fs.writeFileSync(DETAILS_PATH, JSON.stringify(existing, null, 2));
  console.log(`\nDone! ${scraped} articles scraped, saved to articleDetails.json`);
  await browser.close();
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
