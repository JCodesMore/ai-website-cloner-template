const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const DETAILS_PATH = path.join(__dirname, "..", "src", "data", "institutionDetails.json");
const BASE_URL = "https://www.bbxin.com/institutions";

async function scrapeInstitution(page, id) {
  try {
    await page.goto(`${BASE_URL}/${id}.html`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500);

    const data = await page.evaluate(() => {
      // Find the "机构介绍" section
      const sections = Array.from(document.querySelectorAll("h2, h3"));
      const introHeader = sections.find(h => h.textContent?.trim() === "机构介绍");
      let introHTML = "";
      if (introHeader) {
        // Get the content after the heading — the rich text div
        const richText = introHeader.parentElement?.querySelector(".org-rich-text, .layui-text, [class*=rich-text]");
        if (richText) {
          introHTML = richText.innerHTML.trim();
        } else {
          // Fallback: get next sibling content
          let node = introHeader.nextElementSibling;
          while (node && node.tagName !== "H2" && node.tagName !== "H3") {
            introHTML += node.outerHTML || node.textContent || "";
            node = node.nextElementSibling;
          }
        }
      }

      // Get the name from the heading
      const h1 = document.querySelector("h1")?.textContent?.trim() || "";

      return { introHTML, name: h1 };
    });

    if (!data.introHTML || data.introHTML.length < 20) {
      console.log(`  [${id}] WARNING: short or empty intro (${data.introHTML?.length || 0} chars)`);
    } else {
      console.log(`  [${id}] OK — intro:${data.introHTML.length} chars`);
    }

    return { id, introHTML: data.introHTML, name: data.name };
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
    console.log("No existing institutionDetails.json — starting fresh");
  }

  // Get all institution IDs from institutions.json
  const institutions = require("../src/data/institutions.json");
  const ids = institutions.map(i => i.id).sort((a, b) => a - b);
  console.log(`Scraping up to ${ids.length} institution detail pages with concurrency=${CONCURRENCY}\n`);

  const existingMap = new Map();
  existing.forEach(d => existingMap.set(Number(d.id), d));

  let scraped = 0;
  let skipped = 0;

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const batch = ids.slice(i, i + CONCURRENCY);
    const pages = await Promise.all(batch.map(() => browser.newPage()));

    const results = await Promise.all(
      batch.map((id, j) => scrapeInstitution(pages[j], id).finally(() => pages[j].close()))
    );

    for (const result of results) {
      if (result && result.introHTML && result.introHTML.length >= 20) {
        const entry = existingMap.get(result.id);
        if (entry) {
          entry.introHtml = result.introHTML;
          if (result.name) entry.name = result.name;
        } else {
          existing.push({
            id: result.id,
            name: result.name || "",
            fullName: "",
            logo: "",
            website: "",
            introHtml: result.introHTML,
            products: [],
          });
          existingMap.set(result.id, existing[existing.length - 1]);
        }
        scraped++;
      } else {
        skipped++;
      }
    }

    if (i > 0 && i % 30 === 0) {
      fs.writeFileSync(DETAILS_PATH, JSON.stringify(existing, null, 2));
      console.log(`  Saved checkpoint at ${i}/${ids.length}`);
    }

    const pct = Math.round((i + batch.length) / ids.length * 100);
    console.log(`Progress: ${i + batch.length}/${ids.length} (${pct}%) — ${scraped} OK, ${skipped} skipped`);
  }

  fs.writeFileSync(DETAILS_PATH, JSON.stringify(existing, null, 2));
  console.log(`\nDone! ${scraped} institutions scraped (${skipped} skipped)`);
  await browser.close();
}

main().catch(e => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
