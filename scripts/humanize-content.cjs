const { Pool } = require("pg");
const fs = require("fs");
const p = new Pool({ connectionString: "postgresql://Z1858@localhost:5432/bbxin" });

function humanizeChinese(text) {
  if (!text || text.length < 20) return text;
  let raw = text.replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();

  // Remove corporate buzzwords
  raw = raw.replace(/打造/g, "提供");
  raw = raw.replace(/赋能/g, "帮助");
  raw = raw.replace(/全方位/g, "多方面");
  raw = raw.replace(/致力于/g, "");
  raw = raw.replace(/旨在/g, "");
  raw = raw.replace(/（全称：[^）]+）/g, "");
  raw = raw.replace(/极致/g, "");
  raw = raw.replace(/一站式/g, "");
  raw = raw.replace(/专属/g, "");
  raw = raw.replace(/贴身/g, "");
  raw = raw.replace(/贴心/g, "");
  raw = raw.replace(/护航/g, "");

  // Normalize formal tone
  raw = raw.replace(/具有显著优势/g, "");
  raw = raw.replace(/该产品/g, "本产品");
  raw = raw.replace(/非常/g, "");
  raw = raw.replace(/极其/g, "");
  raw = raw.replace(/一般来说/g, "");
  raw = raw.replace(/通常情况下/g, "");

  // Clean up double spaces
  raw = raw.replace(/\s+/g, " ").trim();

  // Split into sections by Chinese numbered markers
  const parts = raw.split(/(?=[一二三四五六七八九十]、)/);
  if (parts.length >= 3) {
    return parts
      .map(function(s) { return s.trim(); })
      .filter(function(s) { return s.length > 10; })
      .map(function(s) { return "<p>" + s + "</p>"; })
      .join("");
  }

  return "<p>" + raw + "</p>";
}

function humanizeSummary(summary) {
  if (!summary || summary.length < 10) return summary;
  return summary
    .replace(/，是由.*?提供.*?贷款.*?产品/g, "")
    .replace(/普通贷款/g, "贷款")
    .replace(/三方助贷/g, "助贷")
    .trim() || summary;
}

async function main() {
  const products = await p.query("SELECT id, name, institution, summary, intro_html FROM products ORDER BY id");
  let updated = 0;

  for (const prod of products.rows) {
    const newSummary = humanizeSummary(prod.summary);
    const newIntro = humanizeChinese(prod.intro_html);

    if (newSummary !== prod.summary || newIntro !== prod.intro_html) {
      await p.query(
        "UPDATE products SET summary = $1, intro_html = $2 WHERE id = $3",
        [newSummary, newIntro, prod.id]
      );
      updated++;
    }
  }

  console.log("Updated " + updated + " of " + products.rows.length + " products");

  // Show samples
  const sample = await p.query("SELECT id, name, summary, intro_html FROM products WHERE id IN (4, 8, 12, 176) ORDER BY id");
  for (const r of sample.rows) {
    console.log("\n--- " + r.name + " ---");
    console.log("S: " + (r.summary || "").substring(0, 120));
    console.log("I: " + (r.intro_html || "").substring(0, 180));
  }

  // Sync JSON
  const details = JSON.parse(fs.readFileSync("src/data/productDetails.json", "utf8"));
  const updatedProds = await p.query("SELECT id, summary, intro_html FROM products");
  const map = new Map(updatedProds.rows.map(function(r) { return [r.id, { summary: r.summary, introHtml: r.intro_html }]; }));
  let jUpdated = 0;
  for (const d of details) {
    const p = map.get(d.id);
    if (p && (d.summary !== p.summary || d.introHtml !== p.introHtml)) {
      d.summary = p.summary;
      d.introHtml = p.introHtml;
      jUpdated++;
    }
  }
  fs.writeFileSync("src/data/productDetails.json", JSON.stringify(details, null, 2));
  fs.writeFileSync("data/productDetails.json", JSON.stringify(details, null, 2));
  console.log("\nSynced " + jUpdated + " entries to productDetails.json");

  p.end();
}
main().catch(function(e) { console.error(e.message); process.exit(1); });
