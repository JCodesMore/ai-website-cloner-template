const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const DETAILS_PATH = path.join(__dirname, "..", "src", "data", "articleDetails.json");
const BASE_URL = "https://www.bbxin.com/articles";

function sanitizeBody(raw) {
  if (!raw) return "";
  return raw
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/^rich-text-content"\s+style="[^"]*"\s*>/g, "")
    .replace(/yinmaiquan-keyword/g, "ymq-keyword")
    .replace(/^[\s\n\r]+/, "")
    .trim();
}

function isTruncated(body) {
  if (!body || body.length < 100) return true;
  // Check if last sentence is complete (ends with punctuation or closing tag)
  const lastChars = body.substring(body.length - 50);
  return !/[。！？.!?>""」」、。！？]/.test(lastChars);
}

async function scrapeArticle(page, id) {
  const url = `${BASE_URL}/${id}.html`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const title = document.querySelector("h1")?.textContent?.trim() || "";

      // Find date: look for YYYY-MM-DD pattern near the title
      const body = document.body.innerText;
      const dateMatch = body.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);

      // Get full article body
      const bodyEl = document.querySelector(".rich-text-content");
      const rawBody = bodyEl?.innerHTML || "";

      // Get view count
      const viewMatch = body.match(/(\d+)\s*阅读/);

      return {
        title,
        date: dateMatch ? dateMatch[1] : "",
        body: rawBody,
        viewCount: viewMatch ? parseInt(viewMatch[1]) : 0,
      };
    });

    if (!data.body || data.body.length < 100) {
      console.log(`  [${id}] empty body — skipping`);
      return null;
    }

    const cleaned = sanitizeBody(data.body);
    if (isTruncated(cleaned)) {
      console.log(`  [${id}] WARNING: possibly truncated (${cleaned.length} chars)`);
    } else {
      console.log(`  [${id}] OK — ${cleaned.length} chars`);
    }

    return { id, title: data.title, date: data.date, body: cleaned, viewCount: data.viewCount };
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
    console.log("No existing articleDetails.json — starting fresh");
  }

  const existingMap = new Map();
  existing.forEach(d => existingMap.set(Number(d.id), d));

  // Load all article IDs from category JSONs
  const industry = require("../src/data/industryArticles.json");
  const discussion = require("../src/data/discussionArticles.json");
  const opinion = require("../src/data/opinionArticles.json");
  const faq = require("../src/data/faqArticles.json");
  const allIds = new Set([...industry, ...discussion, ...opinion, ...faq].map(a => a.id));

  const ids = Array.from(allIds);
  console.log(`Scraping ${ids.length} articles with concurrency=${CONCURRENCY}\n`);

  let scraped = 0;
  let truncated = 0;

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const batch = ids.slice(i, i + CONCURRENCY);
    const pages = await Promise.all(batch.map(() => browser.newPage()));

    const results = await Promise.all(
      batch.map((id, j) => scrapeArticle(pages[j], id).finally(() => pages[j].close()))
    );

    for (const result of results) {
      if (result) {
        if (isTruncated(result.body)) truncated++;
        if (existingMap.has(result.id)) {
          Object.assign(existingMap.get(result.id), result);
        } else {
          existing.push(result);
          existingMap.set(result.id, result);
        }
        scraped++;
      }
    }

    if (i > 0 && i % 100 === 0) {
      fs.writeFileSync(DETAILS_PATH, JSON.stringify(existing, null, 2));
      console.log(`  Saved checkpoint at ${i}/${ids.length}`);
    }

    const pct = Math.round((i + batch.length) / ids.length * 100);
    console.log(`Progress: ${i + batch.length}/${ids.length} (${pct}%) — ${scraped} OK, ${truncated} truncated`);
  }

  fs.writeFileSync(DETAILS_PATH, JSON.stringify(existing, null, 2));
  console.log(`\nDone! ${scraped} articles scraped (${truncated} possibly truncated)`);
  await browser.close();
}

main().catch(e => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
