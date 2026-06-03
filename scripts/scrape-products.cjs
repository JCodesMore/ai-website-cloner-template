const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = "https://www.bbxin.com/products";
const CATEGORIES = ["fast", "company", "person", "pledge"];
const OUT_DIR = path.join(__dirname, "..", "src", "data");

function parseCardText(text) {
  const result = {};

  // First line is product name
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Product name = first line before "评："
  const nameIdx = lines.findIndex(l => l.startsWith("评："));
  if (nameIdx > 0) {
    result.name = lines.slice(0, nameIdx).join(" ").trim();
  }

  for (const line of lines) {
    if (line.startsWith("机构：")) result.institution = line.replace("机构：", "").trim();
    if (line.startsWith("最高额度")) {
      // Next line has the value
      const idx = lines.indexOf(line);
      if (idx >= 0 && idx + 1 < lines.length) result.maxAmount = lines[idx + 1].trim();
    }
    if (line.startsWith("还款期限")) {
      const idx = lines.indexOf(line);
      if (idx >= 0 && idx + 1 < lines.length) result.term = lines[idx + 1].trim();
    }
    if (line.startsWith("参考利率") || line.startsWith("参考利息")) {
      const idx = lines.indexOf(line);
      if (idx >= 0 && idx + 1 < lines.length) result.rate = lines[idx + 1].trim();
    }
    if (line.startsWith("还款方式")) {
      const idx = lines.indexOf(line);
      if (idx >= 0 && idx + 1 < lines.length) result.repayment = lines[idx + 1].trim();
    }
    if (line.startsWith("评：")) result.rating = line.replace("评：", "").trim();
  }

  return result;
}

async function scrapeCategory(browser, category) {
  const products = [];
  const seenIds = new Set();

  for (let p = 1; p <= 50; p++) {
    const url = p === 1
      ? `${BASE}/${category}.html`
      : `${BASE}/${category}.html?page=${p}`;

    const page = await browser.newPage();
    let items = [];

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log(`  ${category} page ${p}: timeout — stopping`);
      await page.close();
      break;
    }

    try {
      items = await page.evaluate(() => {
        const cards = document.querySelectorAll("a.ley-product-card");
        return Array.from(cards).map(card => {
          const href = card.getAttribute("href") || "";
          const idMatch = href.match(/\/products\/\w+\/(\d+)\.html/);
          const img = card.querySelector("img");
          return {
            id: idMatch ? parseInt(idMatch[1]) : 0,
            href: href,
            image: img?.getAttribute("src") || "",
            text: card.innerText || "",
          };
        }).filter(c => c.id > 0);
      });
    } catch (e) {
      console.log(`  ${category} page ${p}: eval error — ${e.message}`);
    }

    if (items.length === 0) {
      console.log(`  ${category} page ${p}: empty — stopping`);
      await page.close();
      break;
    }

    // Parse text and build product objects
    for (const item of items) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);

      const parsed = parseCardText(item.text);
      products.push({
        id: item.id,
        name: parsed.name || item.text.split("\n")[0]?.trim() || "",
        image: item.image,
        institution: parsed.institution || "",
        maxAmount: parsed.maxAmount || "",
        term: parsed.term || "",
        rate: parsed.rate || "",
        repayment: parsed.repayment || "",
        href: item.href,
        promo: "",
        commentCount: parseInt(parsed.rating) || 0,
      });
    }

    // Check if there's a next page
    const hasNext = await page.evaluate(() => {
      const links = document.querySelectorAll("a");
      for (const a of links) {
        if (a.textContent?.trim() === "下一页" && !a.classList.contains("layui-disabled")) {
          return true;
        }
      }
      return false;
    });

    console.log(`  ${category} page ${p}: ${items.length} items (total: ${products.length})`);
    await page.close();

    if (!hasNext) {
      console.log(`  ${category}: no more pages`);
      break;
    }

    await new Promise(r => setTimeout(r, 300));
  }

  return products;
}

async function main() {
  console.log("Scraping products from bbxin.com...\n");
  const browser = await chromium.launch();

  const allResults = {};

  for (const cat of CATEGORIES) {
    console.log(`\n=== ${cat} ===`);
    allResults[cat] = await scrapeCategory(browser, cat);
  }

  await browser.close();

  // Write JSON files
  for (const cat of CATEGORIES) {
    const fileName = cat === "fast" ? "fastProducts.json"
      : cat === "company" ? "companyProducts.json"
      : cat === "person" ? "personProducts.json"
      : "pledgeProducts.json";

    const filePath = path.join(OUT_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(allResults[cat], null, 2));
    console.log(`\n${fileName}: ${allResults[cat].length} products`);
  }

  const total = Object.values(allResults).reduce((s, a) => s + a.length, 0);
  console.log(`\nTotal: ${total} products across ${CATEGORIES.length} categories`);
  console.log("Done!");
}

main().catch(e => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
