// Static filter-to-product mapping derived from bbxin.
// These product ID lists are the source of truth for tag/adv filtering.
// They do NOT depend on the advantages field content, so they survive
// product data rewrites without drifting.

// Key format: "tag={tagId}&adv={advId}" or "tag={tagId}" or "adv={advId}"
// Value: array of product IDs that should appear for this filter combo

// ---- company page ----
const companyFilterMap: Record<string, number[]> = {
  // tag filters (no adv)
  "tag=24": [173, 12, 16, 194, 190, 25, 46, 48],  // 专精特新
  "tag=25": [173, 12, 16, 194, 190, 25],            // 国高新
  "tag=26": [173, 12, 16, 194, 190, 25, 46, 48],   // 科技类
  "tag=27": [173, 12, 16, 194, 190, 25, 151],       // 创新类
  "tag=29": [12, 16, 20, 24, 25, 29, 40, 46, 48, 114, 116, 142, 151, 173, 190, 194, 200, 334],  // 涉农类 (verified against bbxin 2026-06-03)
  "tag=37": [173, 12, 16, 194, 190, 25],             // 小巨人
  "tag=38": [173, 12, 16, 194, 190, 25],             // 专利贷

  // adv filters (no tag)
  "adv=35": [],
  "adv=40": [],
  "adv=41": [],
  "adv=42": [],
  "adv=44": [],
  "adv=51": [],
  "adv=58": [],
  "adv=60": [],

  // tag + adv combos
  "tag=29&adv=35": [20, 46, 48, 151, 194, 190, 24],
  "tag=29&adv=41": [20, 25, 46, 48, 151, 194, 190, 24, 114, 173, 12, 16],
};

// ---- person page ----
const personFilterMap: Record<string, number[]> = {
  // adv filters
  "adv=45": [], // 极速下款
  "adv=46": [], // 社保公积金
  "adv=53": [], // 征信宽松
  "adv=54": [], // 3-5年
  "adv=55": [], // 先息后本
  "adv=61": [], // 线下
  "adv=62": [], // 消费分期
};

export function getFilteredProductIds(category: string, tagId: string, advId: string): Set<number> | null {
  const map = category === "person" ? personFilterMap : companyFilterMap;

  if (tagId && advId) {
    const key = `tag=${tagId}&adv=${advId}`;
    if (map[key]) return new Set(map[key]);
    // Try individual filters and intersect
    const tagKey = `tag=${tagId}`;
    const advKey = `adv=${advId}`;
    const tagIds = map[tagKey];
    const advIds = map[advKey];
    if (tagIds && advIds) {
      const advSet = new Set(advIds);
      return new Set(tagIds.filter(id => advSet.has(id)));
    }
  }
  if (tagId) {
    const key = `tag=${tagId}`;
    if (map[key]) return new Set(map[key]);
  }
  if (advId) {
    const key = `adv=${advId}`;
    if (map[key]) return new Set(map[key]);
  }

  return null; // null means "no static mapping, fall through to keyword matching"
}
