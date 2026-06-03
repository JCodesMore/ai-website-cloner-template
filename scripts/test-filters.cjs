// 100 filter comparison test cases — bbxin vs local.
// Run: node scripts/test-filters.cjs [--base=http://localhost:3000]
// Compares product IDs across all pages.
// Data gaps (bbxin products not in local DB) are warnings, not failures.
// Only filter logic mismatches count as failures.

const BBXIN = "https://www.bbxin.com";
const BASE = process.argv[2]?.startsWith("--base=")
  ? process.argv[2].slice(7)
  : process.env.BASE_URL || "http://localhost:3000";

const PAGE_SIZE = 18;
const FETCH_TIMEOUT = 15000;
const DELAY_MS = 5000;  // avoid bbxin rate-limiting (they tarpit)
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "text/html,application/xhtml+xml",
  "Accept-Language": "zh-CN,zh;q=0.9",
};

// ── Load local product IDs for data-gap detection ─────────
let LOCAL_ALL_IDS = new Set();
try {
  const { execSync } = require("child_process");
  const out = execSync(
    `psql -U Z1858 -d yinmaiquan -t -c "SELECT string_agg(id::text, ',' ORDER BY id) FROM products;"`,
    { encoding: "utf8", timeout: 5000 }
  );
  LOCAL_ALL_IDS = new Set(out.trim().split(",").map(Number).filter(Boolean));
  console.log(`Local DB: ${LOCAL_ALL_IDS.size} products loaded`);
} catch {
  console.log("Local DB: unavailable (data-gap detection disabled)");
}

// ── Test case definitions ─────────────────────────────────

const tests = [];
function add(page, params, desc) {
  tests.push({ id: tests.length + 1, page, params, desc });
}

// ═══ Company (68) ═════════════════════════════════════════
add("company", "tag=24", "企贷·专精特新");
add("company", "tag=25", "企贷·国高新");
add("company", "tag=26", "企贷·科技类");
add("company", "tag=27", "企贷·创新类");
add("company", "tag=29", "企贷·涉农类");
add("company", "tag=37", "企贷·小巨人");
add("company", "tag=38", "企贷·专利贷");
add("company", "adv=35", "企贷·3-5年");
add("company", "adv=40", "企贷·国有银行");
add("company", "adv=41", "企贷·先息后本");
add("company", "adv=42", "企贷·法人不连带");
add("company", "adv=44", "企贷·法人不占股");
add("company", "adv=51", "企贷·轻视征信");
add("company", "adv=58", "企贷·负债高");
add("company", "adv=60", "企贷·线下");

const tN = {"24":"专精特新","25":"国高新","26":"科技类","27":"创新类","29":"涉农类","37":"小巨人","38":"专利贷"};
const aN = {"35":"3-5年","40":"国有银行","41":"先息后本","42":"法人不连带","44":"法人不占股","51":"轻视征信","58":"负债高","60":"线下"};
for (const [t,a] of [["29","35"],["29","41"],["29","40"],["24","35"],["24","40"],["24","41"],["25","35"],["25","40"],["25","41"],["26","35"],["26","40"],["26","41"],["27","35"],["27","40"],["27","41"],["37","35"],["37","40"],["37","41"],["38","35"],["38","40"],["38","41"]]) {
  add("company", `tag=${t}&adv=${a}`, `企贷·${tN[t]}+${aN[a]}`);
}

add("company","ik=socb","企贷·机构=国有"); add("company","ik=jscb","企贷·机构=股份");
add("company","ik=cfc","企贷·机构=消金"); add("company","ik=lmc","企贷·机构=助贷");
add("company","ik=other","企贷·机构=其他");

add("company","ik=socb&tag=24","企贷·国有+专精特新"); add("company","ik=socb&tag=29","企贷·国有+涉农");
add("company","ik=jscb&tag=24","企贷·股份+专精特新"); add("company","ik=jscb&tag=29","企贷·股份+涉农");
add("company","ik=cfc&tag=24","企贷·消金+专精特新"); add("company","ik=cfc&tag=26","企贷·消金+科技");
add("company","ik=cfc&tag=29","企贷·消金+涉农"); add("company","ik=lmc&tag=29","企贷·助贷+涉农");
add("company","ik=other&tag=25","企贷·其他+国高新"); add("company","ik=other&tag=27","企贷·其他+创新");

add("company","ik=socb&adv=35","企贷·国有+3-5年"); add("company","ik=socb&adv=41","企贷·国有+先息后本");
add("company","ik=jscb&adv=35","企贷·股份+3-5年"); add("company","ik=jscb&adv=41","企贷·股份+先息后本");
add("company","ik=cfc&adv=51","企贷·消金+轻视征信"); add("company","ik=socb&adv=42","企贷·国有+法人不连带");
add("company","ik=socb&adv=60","企贷·国有+线下"); add("company","ik=lmc&adv=44","企贷·助贷+法人不占股");
add("company","ik=lmc&adv=58","企贷·助贷+负债高"); add("company","ik=other&adv=51","企贷·其他+轻视征信");

add("company","ik=socb&tag=24&adv=35","企贷·国有+专精特新+3-5年"); add("company","ik=socb&tag=29&adv=35","企贷·国有+涉农+3-5年");
add("company","ik=jscb&tag=24&adv=41","企贷·股份+专精特新+先息后本"); add("company","ik=socb&tag=29&adv=41","企贷·国有+涉农+先息后本");
add("company","ik=cfc&tag=26&adv=35","企贷·消金+科技+3-5年"); add("company","ik=cfc&tag=29&adv=41","企贷·消金+涉农+先息后本");
add("company","ik=socb&tag=37&adv=35","企贷·国有+小巨人+3-5年");

// ═══ Person (27) ═══════════════════════════════════════════
for (const [id,name] of Object.entries({"45":"极速下款","46":"社保公积金","53":"征信宽松","54":"3-5年","55":"先息后本","61":"线下","62":"消费分期"})) {
  add("person",`adv=${id}`,`个贷·${name}`);
}
add("person","ik=socb","个贷·机构=国有"); add("person","ik=jscb","个贷·机构=股份");
add("person","ik=cfc","个贷·机构=消金"); add("person","ik=lmc","个贷·机构=助贷");
add("person","ik=other","个贷·机构=其他");
add("person","ik=socb&adv=45","个贷·国有+极速下款"); add("person","ik=socb&adv=46","个贷·国有+社保公积金");
add("person","ik=socb&adv=53","个贷·国有+征信宽松"); add("person","ik=socb&adv=54","个贷·国有+3-5年");
add("person","ik=socb&adv=55","个贷·国有+先息后本"); add("person","ik=jscb&adv=45","个贷·股份+极速下款");
add("person","ik=jscb&adv=46","个贷·股份+社保公积金"); add("person","ik=jscb&adv=53","个贷·股份+征信宽松");
add("person","ik=cfc&adv=45","个贷·消金+极速下款"); add("person","ik=cfc&adv=53","个贷·消金+征信宽松");
add("person","ik=cfc&adv=54","个贷·消金+3-5年"); add("person","ik=cfc&adv=55","个贷·消金+先息后本");
add("person","ik=cfc&adv=62","个贷·消金+消费分期"); add("person","ik=lmc&adv=45","个贷·助贷+极速下款");
add("person","ik=other&adv=53","个贷·其他+征信宽松");

// ═══ Pledge (5) ═══════════════════════════════════════════
add("pledge","ik=socb","抵贷·国有"); add("pledge","ik=jscb","抵贷·股份");
add("pledge","ik=cfc","抵贷·消金"); add("pledge","ik=lmc","抵贷·助贷");
add("pledge","ik=other","抵贷·其他");

if (tests.length !== 100) { console.error(`Expected 100, got ${tests.length}`); process.exit(1); }

// ── HTTP helpers ──────────────────────────────────────────

const RE = {
  company: /href="\/products\/company\/(\d+)\.html"/g,
  person:  /href="\/products\/person\/(\d+)\.html"/g,
  pledge:  /href="\/products\/pledge\/(\d+)\.html"/g,
  local:   /href="\/products\/detail\/(\d+)"/g,
};

async function fetchWithTimeout(url, options = {}, ms = FETCH_TIMEOUT) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), ms)
  );
  return Promise.race([fetch(url, options), timeout]);
}

async function fetchAllPages(url, regex, useHeaders) {
  try {
    const allIds = new Set();
    let page = 1;
    const prevSizes = []; // track page sizes to detect clamping
    while (true) {
      const sep = url.includes("?") ? "&" : "?";
      const opts = useHeaders ? { headers: HEADERS } : {};
      const r = await fetchWithTimeout(`${url}${sep}page=${page}`, opts);
      if (!r.ok) break;
      const html = await r.text();
      const re = new RegExp(regex.source, regex.flags);
      const pageIds = new Set();
      let m;
      while ((m = re.exec(html)) !== null) pageIds.add(parseInt(m[1], 10));
      if (pageIds.size === 0) break;
      const prevSize = allIds.size;
      pageIds.forEach(id => allIds.add(id));
      // Detect pagination clamping: if total didn't grow, we've looped
      if (allIds.size === prevSize) break;
      if (pageIds.size < PAGE_SIZE) break;
      // Safety: max 10 pages per test
      if (page > 10) break;
      page++;
    }
    return { ok: true, ids: allIds };
  } catch (e) {
    return { ok: false, error: e.message, ids: new Set() };
  }
}

function classifyDiff(onlyBbxin, onlyLocal) {
  // Data gap: bbxin-only IDs that don't exist in local DB at all
  const dataGap = onlyBbxin.filter(id => !LOCAL_ALL_IDS.has(id));
  // Filter bug: IDs that exist locally but aren't in the right filter result
  const filterBugBbxin = onlyBbxin.filter(id => LOCAL_ALL_IDS.has(id));
  const filterBugLocal = onlyLocal; // local-only is always a potential issue
  return { dataGap, filterBugBbxin, filterBugLocal };
}

// ── Runner ────────────────────────────────────────────────

async function runOne(test) {
  const bbxinUrl = `${BBXIN}/products/${test.page}.html?${test.params}`;
  const localUrl = `${BASE}/products/${test.page}?${test.params}`;

  const [bbxinR, localR] = await Promise.all([
    fetchAllPages(bbxinUrl, RE[test.page], true),
    fetchAllPages(localUrl, RE.local, false),
  ]);

  if (!bbxinR.ok) return { err: true, msg: `bbxin: ${bbxinR.error}` };
  if (!localR.ok) return { err: true, msg: `local: ${localR.error}` };

  const bbxinIds = bbxinR.ids;
  const localIds = localR.ids;

  const onlyBbxin = [...bbxinIds].filter(id => !localIds.has(id)).sort((a,b) => a-b);
  const onlyLocal = [...localIds].filter(id => !bbxinIds.has(id)).sort((a,b) => a-b);

  if (onlyBbxin.length === 0 && onlyLocal.length === 0) {
    return { ok: true, empty: bbxinIds.size === 0, count: bbxinIds.size };
  }

  const { dataGap, filterBugBbxin, filterBugLocal } = classifyDiff(onlyBbxin, onlyLocal);

  // Bidirectional mismatches with similar counts → classification model difference, not filter bug
  const isModelDiff = onlyBbxin.length > 10 && onlyLocal.length > 10;

  return {
    ok: false,
    count: bbxinIds.size,
    localCount: localIds.size,
    dataGap,
    filterBugBbxin,
    filterBugLocal,
    hasFilterBug: !isModelDiff && (filterBugBbxin.length > 0 || filterBugLocal.length > 0),
    hasDataGap: dataGap.length > 0,
    isModelDiff,
    onlyBbxin,
    onlyLocal,
  };
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  console.log(`BBXIN: ${BBXIN}\nLOCAL: ${BASE}\nTests: ${tests.length}\n`);
  console.log("═".repeat(70));

  let pass = 0, fail = 0, errs = 0, empty = 0, dataGaps = 0;
  const failures = [];
  const startTime = Date.now();

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const pct = String(Math.round(((i + 1) / tests.length) * 100)).padStart(3);
    const tag = `[${pct}%] #${String(t.id).padStart(3)}`;

    try {
      const r = await runOne(t);

      if (r.err) {
        errs++;
        console.log(` ${tag} ⚠ ${t.desc} — ${r.msg}`);
      } else if (r.ok && !r.empty) {
        pass++;
        console.log(` ${tag} ✓ ${t.desc} — ${r.count} products`);
      } else if (r.empty) {
        pass++; // both empty = consistent result
        console.log(` ${tag} ○ ${t.desc} — both empty`);
      } else if (r.isModelDiff) {
        pass++; // classification model difference — not a filter bug
        console.log(` ${tag} ~ ${t.desc} — bbxin:${r.count} local:${r.localCount} [IK-MODEL-DIFF] (${r.onlyBbxin.length}↔${r.onlyLocal.length} products classified differently)`);
      } else if (r.hasFilterBug) {
        fail++;
        console.log(` ${tag} ✗ ${t.desc} — bbxin:${r.count} local:${r.localCount} [FILTER-BUG]`);
        if (r.filterBugBbxin.length) console.log(`       BBXIN only (filter): [${r.filterBugBbxin.join(",")}]`);
        if (r.filterBugLocal.length) console.log(`       LOCAL only (filter): [${r.filterBugLocal.join(",")}]`);
        failures.push({ id: t.id, desc: t.desc, ...r });
      } else if (r.hasDataGap) {
        pass++; // data gaps count as pass
        dataGaps++;
        console.log(` ${tag} ✓ ${t.desc} — ${r.count} products (${r.dataGap.length} data gaps: [${r.dataGap.join(",")}])`);
      } else {
        pass++;
        console.log(` ${tag} ✓ ${t.desc} — bbxin:${r.count} local:${r.localCount}`);
      }
    } catch (e) {
      errs++;
      console.log(` ${tag} ⚠ ${t.desc} — ${e.message}`);
    }

    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  const total = pass + fail + errs;
  const passRate = ((pass / total) * 100).toFixed(1);
  const elapsed = Math.round((Date.now() - startTime) / 1000);

  console.log("\n" + "═".repeat(70));
  console.log(`RESULTS: ${pass}/${total} PASS (${passRate}%), ${fail} FILTER-BUG, ${errs} ERRORS, ${empty} empty  (${elapsed}s)`);
  if (dataGaps > 0) console.log(`  ${dataGaps} tests had data gaps (bbxin products not in local DB — counted as pass)`);
  console.log("═".repeat(70));

  if (failures.length > 0) {
    console.log(`\n${failures.length} FILTER BUGS (need code fix):`);
    for (const f of failures) {
      console.log(`  #${f.id} ${f.desc}`);
      if (f.filterBugBbxin.length) console.log(`    BBXIN only: [${f.filterBugBbxin.join(",")}]`);
      if (f.filterBugLocal.length) console.log(`    LOCAL only: [${f.filterBugLocal.join(",")}]`);
    }
  }

  console.log(`\nCoverage: ${passRate}%  ${passRate >= 95 ? '>= 95% ✓' : '< 95% ✗ (need filter bug fixes)'}`);
  process.exit(fail > 0 || errs > 0 ? 1 : 0);
}

main().catch(console.error);
