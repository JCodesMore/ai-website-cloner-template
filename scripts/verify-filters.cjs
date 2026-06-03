// Verify filter combos match bbxin. Run: node scripts/verify-filters.cjs [base-url]
// Defaults to http://localhost:3000
// Compares product IDs from local site against live bbxin results.

const BASE = process.argv[2] || "http://localhost:3000";
const BBXIN = "https://www.bbxin.com";

const checks = [
  { path: "/products/company?tag=29&adv=35", desc: "涉农类 + 3-5年" },
  { path: "/products/company?tag=29&adv=41", desc: "涉农类 + 先息后本" },
  { path: "/products/company?tag=24", desc: "专精特新" },
  { path: "/products/company?tag=29", desc: "涉农类" },
  { path: "/products/company?adv=35", desc: "3-5年" },
  { path: "/products/company?adv=41", desc: "先息后本" },
  { path: "/products/company?adv=40", desc: "国有银行" },
  { path: "/products/company?adv=51", desc: "轻视征信" },
];

function extractIds(html) {
  const ids = new Set();
  const re = /href="\/products\/company\/(\d+)\.html"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    ids.add(parseInt(m[1], 10));
  }
  return ids;
}

function extractLocalIds(html) {
  // Local site uses /products/detail/ID format
  const ids = new Set();
  const re = /href="\/products\/detail\/(\d+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    ids.add(parseInt(m[1], 10));
  }
  return ids;
}

async function main() {
  let failed = 0;
  for (const check of checks) {
    try {
      const [bbxinRes, localRes] = await Promise.all([
        fetch(BBXIN + check.path),
        fetch(BASE + check.path),
      ]);
      const bbxinHtml = await bbxinRes.text();
      const localHtml = await localRes.text();

      const bbxinIds = extractIds(bbxinHtml);
      const localIds = extractLocalIds(localHtml);

      const onlyBbxin = [...bbxinIds].filter(id => !localIds.has(id));
      const onlyLocal = [...localIds].filter(id => !bbxinIds.has(id));

      if (onlyBbxin.length === 0 && onlyLocal.length === 0 && bbxinIds.size > 0) {
        console.log(`OK: ${check.desc} — ${bbxinIds.size} products MATCH`);
      } else if (bbxinIds.size === 0 && localIds.size === 0) {
        console.log(`OK: ${check.desc} — both empty`);
      } else {
        console.log(`FAIL: ${check.desc} (bbxin:${bbxinIds.size} local:${localIds.size})`);
        if (onlyBbxin.size) console.log(`  BBXIN only IDs: [${[...onlyBbxin].join(", ")}]`);
        if (onlyLocal.size) console.log(`  LOCAL only IDs: [${[...onlyLocal].join(", ")}]`);
        failed++;
      }
    } catch (err) {
      console.log(`ERROR: ${check.desc} — ${err.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`\n${failed === 0 ? "All filters match bbxin" : failed + " mismatches"}`);
  process.exit(failed > 0 ? 1 : 0);
}
main();
