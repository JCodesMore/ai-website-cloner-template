// Verify filter combos. Run: node scripts/verify-filters.cjs [base-url]
// Defaults to http://localhost:3000
// Compares product names from local site against expected bbxin results.

const BASE = process.argv[2] || "http://localhost:3000";

const checks = [
  {
    path: "/products/company?tag=29&adv=35",
    expected: ["惠农贷", "信用快贷", "善担贷", "创业担保贷", "科技e贷", "裕农快贷", "微捷贷"],
    desc: "涉农类 + 3-5年 (7 products)",
  },
  {
    path: "/products/company?tag=29&adv=41",
    expected: ["惠农贷", "振兴贷", "信用快贷", "善担贷", "创业担保贷", "科技e贷", "裕农快贷", "微捷贷", "云税贷", "建行惠懂你", "科创e贷", "银税贷"],
    desc: "涉农类 + 先息后本 (12 products)",
  },
];

async function main() {
  let failed = 0;
  for (const check of checks) {
    try {
      const res = await fetch(BASE + check.path);
      const html = await res.text();
      const matches = [];
      for (const name of check.expected) {
        if (html.includes(name)) matches.push(name);
      }
      const missing = check.expected.filter(n => !matches.includes(n));
      if (missing.length > 0) {
        console.log(`FAIL: ${check.desc} — missing: ${missing.join(", ")}`);
        failed++;
      } else {
        console.log(`OK: ${check.desc} — all ${check.expected.length} products found`);
      }
    } catch (err) {
      console.log(`ERROR: ${check.desc} — ${err.message}`);
      failed++;
    }
  }
  console.log(`\n${failed === 0 ? "All filters match ✓" : failed + " mismatches ✗"}`);
  process.exit(failed > 0 ? 1 : 0);
}
main();
