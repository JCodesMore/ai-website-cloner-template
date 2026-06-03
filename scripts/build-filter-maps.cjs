// Auto-generate src/lib/filter-maps.ts by scraping bbxin product IDs.
// Run: node scripts/build-filter-maps.cjs
// Scrapes ALL pages for each filter (bbxin paginates at 18 products/page).
// Company: tags, advs, combos. Person: advs. Pledge: no tag/adv filters.

const BBXIN = "https://www.bbxin.com";
const PAGE_SIZE = 18;

// ── Company page ────────────────────────────────────────
const companyTags = [
  { id: "24", desc: "专精特新" },
  { id: "25", desc: "国高新" },
  { id: "26", desc: "科技类" },
  { id: "27", desc: "创新类" },
  { id: "29", desc: "涉农类" },
  { id: "37", desc: "小巨人" },
  { id: "38", desc: "专利贷" },
];

const companyAdvs = [
  { id: "35", desc: "3-5年" },
  { id: "40", desc: "国有银行" },
  { id: "41", desc: "先息后本" },
  { id: "42", desc: "法人不连带" },
  { id: "44", desc: "法人不占股" },
  { id: "51", desc: "轻视征信" },
  { id: "58", desc: "负债高" },
  { id: "60", desc: "线下" },
];

const companyCombos = [
  ["29", "35"], ["29", "41"], ["29", "40"],
  ["24", "35"], ["24", "40"], ["24", "41"],
  ["25", "35"], ["25", "40"], ["25", "41"],
  ["26", "35"], ["26", "40"], ["26", "41"],
  ["27", "35"], ["27", "40"], ["27", "41"],
  ["37", "35"], ["37", "40"], ["37", "41"],
  ["38", "35"], ["38", "40"], ["38", "41"],
];

// ── Person page ─────────────────────────────────────────
const personAdvs = [
  { id: "45", desc: "极速下款" },
  { id: "46", desc: "社保公积金" },
  { id: "53", desc: "征信宽松" },
  { id: "54", desc: "3-5年" },
  { id: "55", desc: "先息后本" },
  { id: "61", desc: "线下" },
  { id: "62", desc: "消费分期" },
];

// ── Helpers ─────────────────────────────────────────────

async function fetchAllPages(basePath, category) {
  const allIds = new Set();
  let page = 1;
  while (true) {
    const sep = basePath.includes("?") ? "&" : "?";
    const url = `${BBXIN}${basePath}${sep}page=${page}`;
    try {
      const r = await fetch(url);
      const html = await r.text();
      const re = new RegExp(`href="/products/${category}/(\\d+)\\.html"`, "g");
      const pageIds = new Set();
      let m;
      while ((m = re.exec(html)) !== null) pageIds.add(parseInt(m[1], 10));
      if (pageIds.size === 0) break; // empty page
      pageIds.forEach(id => allIds.add(id));
      if (pageIds.size < PAGE_SIZE) break; // last page
      page++;
    } catch (e) {
      console.error(`    ERROR page ${page}: ${e.message}`);
      break;
    }
  }
  return [...allIds].sort((a, b) => a - b);
}

function formatIds(ids) {
  return `[${ids.join(",")}]`;
}

// ── Main ────────────────────────────────────────────────

async function main() {
  console.log("Scraping bbxin filter product IDs (all pages)...\n");

  // === Company: tags ===
  const cTagEntries = {};
  console.log("### Company Tags ###");
  for (const tag of companyTags) {
    const ids = await fetchAllPages(`/products/company.html?tag=${tag.id}`, "company");
    const key = `tag=${tag.id}`;
    cTagEntries[key] = ids;
    console.log(`  ${key} (${tag.desc}): ${ids.length} products${ids.length >= PAGE_SIZE ? " (multi-page)" : ""}`);
    await new Promise(r => setTimeout(r, 400));
  }

  // === Company: advs ===
  const cAdvEntries = {};
  console.log("\n### Company Advantages ###");
  for (const adv of companyAdvs) {
    const ids = await fetchAllPages(`/products/company.html?adv=${adv.id}`, "company");
    const key = `adv=${adv.id}`;
    if (ids.length > 0) {
      cAdvEntries[key] = ids;
      console.log(`  ${key} (${adv.desc}): ${ids.length} products${ids.length >= PAGE_SIZE ? " (multi-page)" : ""}`);
    } else {
      console.log(`  ${key} (${adv.desc}): 0 products — SKIPPED`);
    }
    await new Promise(r => setTimeout(r, 400));
  }

  // === Company: combos ===
  const cComboEntries = {};
  console.log("\n### Company Tag+Adv Combos ###");
  for (const [tag, adv] of companyCombos) {
    const ids = await fetchAllPages(`/products/company.html?tag=${tag}&adv=${adv}`, "company");
    const key = `tag=${tag}&adv=${adv}`;
    if (ids.length > 0) {
      cComboEntries[key] = ids;
      console.log(`  ${key}: ${ids.length} products${ids.length >= PAGE_SIZE ? " (multi-page)" : ""}`);
    } else {
      console.log(`  ${key}: 0 products — SKIPPED`);
    }
    await new Promise(r => setTimeout(r, 400));
  }

  // === Person: advs ===
  const pAdvEntries = {};
  console.log("\n### Person Advantages ###");
  for (const adv of personAdvs) {
    const ids = await fetchAllPages(`/products/person.html?adv=${adv.id}`, "person");
    const key = `adv=${adv.id}`;
    if (ids.length > 0) {
      pAdvEntries[key] = ids;
      console.log(`  ${key} (${adv.desc}): ${ids.length} products${ids.length >= PAGE_SIZE ? " (multi-page)" : ""}`);
    } else {
      console.log(`  ${key} (${adv.desc}): 0 products — SKIPPED`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  // === Generate TypeScript file ===
  function fmtSection(entries, indent) {
    return Object.entries(entries)
      .map(([key, ids]) => `${indent}"${key}": ${formatIds(ids)},`)
      .join("\n");
  }

  const output = `// Static filter-to-product mapping derived from bbxin.
// Auto-generated ${new Date().toISOString().slice(0, 10)}. DO NOT EDIT MANUALLY.
// Regenerate: node scripts/build-filter-maps.cjs

// ---- company page ----
const companyFilterMap: Record<string, number[]> = {
  // tags (scraped from live bbxin, all pages)
${fmtSection(cTagEntries, "  ")}

  // advs (scraped from live bbxin, all pages)
${fmtSection(cAdvEntries, "  ")}

  // tag+adv combos (scraped from live bbxin, all pages)
${fmtSection(cComboEntries, "  ")}
};

// ---- person page ----
const personFilterMap: Record<string, number[]> = {
  // advs (scraped from live bbxin, all pages)
${fmtSection(pAdvEntries, "  ")}
};

export function getFilteredProductIds(category: string, tagId: string, advId: string): Set<number> | null {
  const map = category === "person" ? personFilterMap : companyFilterMap;

  if (tagId && advId) {
    const key = \`tag=\${tagId}&adv=\${advId}\`;
    if (map[key]) return new Set(map[key]);
    // Intersection fallback: intersect tag and adv individual sets
    const tagKey = \`tag=\${tagId}\`;
    const advKey = \`adv=\${advId}\`;
    const tagIds = map[tagKey];
    const advIds = map[advKey];
    if (tagIds && advIds) {
      const advSet = new Set(advIds);
      return new Set(tagIds.filter(id => advSet.has(id)));
    }
  }
  if (tagId) {
    const key = \`tag=\${tagId}\`;
    if (map[key]) return new Set(map[key]);
  }
  if (advId) {
    const key = \`adv=\${advId}\`;
    if (map[key]) return new Set(map[key]);
  }

  return null; // null means "no static mapping, fall through to keyword matching"
}
`;

  const fs = require("fs");
  const path = require("path");

  const outPath = path.join(__dirname, "..", "src", "lib", "filter-maps.ts");
  fs.writeFileSync(outPath, output, "utf8");

  const totalEntries = Object.keys(cTagEntries).length + Object.keys(cAdvEntries).length +
    Object.keys(cComboEntries).length + Object.keys(pAdvEntries).length;
  console.log(`\nWritten ${totalEntries} entries to ${outPath}`);
}

main().catch(console.error);
