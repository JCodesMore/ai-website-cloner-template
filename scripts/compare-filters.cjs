// Compare bbxin vs local filter results for company products
// Run: node scripts/compare-filters.cjs
const LOCAL = "http://localhost:3000";
const BBXIN = "https://www.bbxin.com";

// Test sets
const tags = [
  { id: "24", desc: "专精特新" },
  { id: "25", desc: "国高新" },
  { id: "26", desc: "科技类" },
  { id: "27", desc: "创新类" },
  { id: "29", desc: "涉农类" },
  { id: "37", desc: "小巨人" },
  { id: "38", desc: "专利贷" },
];

const advs = [
  { id: "35", desc: "3-5年" },
  { id: "40", desc: "国有银行" },
  { id: "41", desc: "先息后本" },
  { id: "42", desc: "法人不连带" },
  { id: "44", desc: "法人不占股" },
  { id: "51", desc: "轻视征信" },
  { id: "58", desc: "负债高" },
  { id: "60", desc: "线下" },
];

async function fetchProductNames(url) {
  try {
    const r = await fetch(url);
    const html = await r.text();
    const names = new Set();
    const re = /title="([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      const name = m[1].trim();
      if (name && name.length >= 2 && !/[企业个人扫码首页登录注册bbxin重新加载去看机构关于我们联系我们免责声明]/.test(name) && !name.includes("电话")) {
        names.add(name);
      }
    }
    return [...names].sort();
  } catch (e) {
    return [];
  }
}

async function main() {
  console.log("=".repeat(70));
  console.log("Company page filter comparison: BBXIN vs LOCAL");
  console.log("=".repeat(70));

  let totalChecked = 0;
  let totalMatch = 0;
  let totalMismatch = 0;

  // --- 1. Tags only ---
  console.log("\n### Tags (tag=N) ###");
  for (const tag of tags) {
    totalChecked++;
    const bbxinNames = await fetchProductNames(`${BBXIN}/products/company.html?tag=${tag.id}`);
    const localNames = await fetchProductNames(`${LOCAL}/products/company?tag=${tag.id}`);

    const bbxinSet = new Set(bbxinNames);
    const localSet = new Set(localNames);
    const onlyBbxin = bbxinNames.filter(n => !localSet.has(n));
    const onlyLocal = localNames.filter(n => !bbxinSet.has(n));

    if (onlyBbxin.length === 0 && onlyLocal.length === 0) {
      console.log(`  ✓ tag=${tag.id} (${tag.desc}): ${bbxinNames.length} products MATCH`);
      totalMatch++;
    } else {
      console.log(`  ✗ tag=${tag.id} (${tag.desc}): MISMATCH`);
      if (onlyBbxin.length) console.log(`    BBXIN only (${onlyBbxin.length}): ${onlyBbxin.slice(0,8).join(', ')}`);
      if (onlyLocal.length) console.log(`    LOCAL only (${onlyLocal.length}): ${onlyLocal.slice(0,8).join(', ')}`);
      totalMismatch++;
    }
    await new Promise(r => setTimeout(r, 300)); // rate limit
  }

  // --- 2. Advs only ---
  console.log("\n### Advantages (adv=N) ###");
  for (const adv of advs) {
    totalChecked++;
    const bbxinNames = await fetchProductNames(`${BBXIN}/products/company.html?adv=${adv.id}`);
    const localNames = await fetchProductNames(`${LOCAL}/products/company?adv=${adv.id}`);

    const bbxinSet = new Set(bbxinNames);
    const localSet = new Set(localNames);
    const onlyBbxin = bbxinNames.filter(n => !localSet.has(n));
    const onlyLocal = localNames.filter(n => !bbxinSet.has(n));

    if (onlyBbxin.length === 0 && onlyLocal.length === 0 && bbxinNames.length > 0) {
      console.log(`  ✓ adv=${adv.id} (${adv.desc}): ${bbxinNames.length} products MATCH`);
      totalMatch++;
    } else if (bbxinNames.length === 0 && localNames.length === 0) {
      console.log(`  - adv=${adv.id} (${adv.desc}): both empty (no products)`);
      totalMatch++;
    } else {
      console.log(`  ✗ adv=${adv.id} (${adv.desc}): MISMATCH (bbxin:${bbxinNames.length} local:${localNames.length})`);
      if (onlyBbxin.length) console.log(`    BBXIN only (${onlyBbxin.length}): ${onlyBbxin.slice(0,8).join(', ')}`);
      if (onlyLocal.length) console.log(`    LOCAL only (${onlyLocal.length}): ${onlyLocal.slice(0,8).join(', ')}`);
      totalMismatch++;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  // --- 3. Key tag+adv combos ---
  const combos = [
    ["29", "35"], ["29", "41"], ["29", "40"], ["24", "35"], ["24", "41"],
    ["25", "35"], ["25", "41"], ["26", "35"], ["27", "41"],
  ];
  console.log("\n### Tag+Adv Combos ###");
  for (const [tag, adv] of combos) {
    totalChecked++;
    const bbxinNames = await fetchProductNames(`${BBXIN}/products/company.html?tag=${tag}&adv=${adv}`);
    const localNames = await fetchProductNames(`${LOCAL}/products/company?tag=${tag}&adv=${adv}`);

    const bbxinSet = new Set(bbxinNames);
    const localSet = new Set(localNames);
    const onlyBbxin = bbxinNames.filter(n => !localSet.has(n));
    const onlyLocal = localNames.filter(n => !bbxinSet.has(n));

    if (onlyBbxin.length === 0 && onlyLocal.length === 0 && bbxinNames.length > 0) {
      console.log(`  ✓ tag=${tag}&adv=${adv}: ${bbxinNames.length} products MATCH`);
      totalMatch++;
    } else if (bbxinNames.length === 0 && localNames.length === 0) {
      console.log(`  - tag=${tag}&adv=${adv}: both empty`);
      totalMatch++;
    } else {
      console.log(`  ✗ tag=${tag}&adv=${adv}: MISMATCH (bbxin:${bbxinNames.length} local:${localNames.length})`);
      if (onlyBbxin.length) console.log(`    BBXIN only: ${onlyBbxin.join(', ')}`);
      if (onlyLocal.length) console.log(`    LOCAL only: ${onlyLocal.join(', ')}`);
      totalMismatch++;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log(`RESULTS: ${totalMatch}/${totalChecked} MATCH, ${totalMismatch} MISMATCH`);
  console.log(`${"=".repeat(70)}`);
}

main().catch(console.error);
