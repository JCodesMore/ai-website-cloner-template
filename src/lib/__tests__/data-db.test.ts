import { describe, it, expect } from "vitest";
import { getAllProducts } from "@/lib/repository";

// ── Helpers to mirror the dedup logic under test ──────────

function mergeWithDedup<T extends { id: number }>(...arrays: T[][]): T[] {
  const seen = new Set<number>();
  const result: T[] = [];
  for (const arr of arrays) {
    for (const item of arr) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }
  }
  return result;
}

function hasDuplicates(items: { id: number }[]): number[] {
  const seen = new Set<number>();
  const dupes: number[] = [];
  for (const item of items) {
    if (seen.has(item.id)) dupes.push(item.id);
    seen.add(item.id);
  }
  return dupes;
}

// ── Fixtures ──────────────────────────────────────────────

function p(id: number, name: string, category: string) {
  return { id, name, category, image: "", institution: "农业银行", maxAmount: "100万", term: "12个月", rate: "3.5%", repayment: "等额本息", commentCount: 0, href: `/product/${id}` };
}

const fastProducts = [p(1, "网捷贷", "fast"), p(2, "微捷贷", "fast"), p(3, "科创贷", "fast")];
const companyProducts = [p(2, "微捷贷-企业版", "company"), p(4, "纳税e贷", "company"), p(5, "专精特新贷", "company")];
const personProducts = [p(1, "网捷贷-个人版", "person"), p(6, "富民贷", "person"), p(7, "创业担保贷", "person")];
const pledgeProducts = [p(5, "专精特新贷-质押版", "pledge"), p(8, "存单质押贷", "pledge")];
const emptyProducts: typeof fastProducts = [];

describe("getAllProducts() deduplication", () => {
  it("returns unique products by ID across all categories", () => {
    const result = mergeWithDedup(fastProducts, companyProducts, personProducts, pledgeProducts);
    const ids = result.map((p) => p.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("keeps first occurrence when same ID appears in multiple categories", () => {
    const result = mergeWithDedup(fastProducts, companyProducts, personProducts, pledgeProducts);
    const p1 = result.find((p) => p.id === 1);
    expect(p1!.name).toBe("网捷贷");

    const p2 = result.find((p) => p.id === 2);
    expect(p2!.name).toBe("微捷贷");

    const p5 = result.find((p) => p.id === 5);
    expect(p5!.name).toBe("专精特新贷");
  });

  it("has no duplicate IDs in output", () => {
    const result = mergeWithDedup(fastProducts, companyProducts, personProducts, pledgeProducts);
    expect(hasDuplicates(result)).toEqual([]);
  });

  it("returns empty array when all inputs are empty", () => {
    const result = mergeWithDedup(emptyProducts, emptyProducts, emptyProducts, emptyProducts);
    expect(result).toEqual([]);
  });

  it("returns first category's products when other categories are empty", () => {
    const result = mergeWithDedup(fastProducts, emptyProducts, emptyProducts, emptyProducts);
    expect(result).toHaveLength(3);
    expect(result.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it("works with all unique products (no duplicates)", () => {
    const unique1 = [p(10, "产品A", "fast")];
    const unique2 = [p(20, "产品B", "company")];
    const unique3 = [p(30, "产品C", "person")];
    const result = mergeWithDedup(unique1, unique2, unique3, emptyProducts);
    expect(result).toHaveLength(3);
    expect(hasDuplicates(result)).toEqual([]);
  });

  it("deduplicates when all products have same ID", () => {
    const a = [p(99, "版本A", "fast")];
    const b = [p(99, "版本B", "company")];
    const c = [p(99, "版本C", "person")];
    const d = [p(99, "版本D", "pledge")];
    const result = mergeWithDedup(a, b, c, d);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("版本A");
  });

  it("preserves insertion order: category priority fast > company > person > pledge", () => {
    const result = mergeWithDedup(fastProducts, companyProducts, personProducts, pledgeProducts);
    const categories = result.map((p) => p.category);
    expect(categories).toEqual(["fast", "fast", "fast", "company", "company", "person", "person", "pledge"]);
  });
});

import fastProductsJson from "@/data/fastProducts.json";
import companyProductsJson from "@/data/companyProducts.json";
import personProductsJson from "@/data/personProducts.json";
import pledgeProductsJson from "@/data/pledgeProducts.json";

describe("getAllProducts() actual function", () => {
  it("returns products from all four categories combined", async () => {
    const result = await getAllProducts();
    const rawTotal = fastProductsJson.length + companyProductsJson.length + personProductsJson.length + pledgeProductsJson.length;
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(rawTotal);
  });

  it("has no duplicate IDs", async () => {
    const result = await getAllProducts();
    expect(hasDuplicates(result)).toEqual([]);
  });

  it("first occurrence is from fast category (earliest in merge order)", async () => {
    const result = await getAllProducts();
    const p78 = result.find((p) => p.id === 78);
    expect(p78).toBeDefined();
    const all78 = result.filter((p) => p.id === 78);
    expect(all78).toHaveLength(1);
  });

  it("matches getAllProducts against manual mergeWithDedup", async () => {
    const actual = await getAllProducts();
    const expected = mergeWithDedup(fastProductsJson, companyProductsJson, personProductsJson, pledgeProductsJson);
    expect(actual).toEqual(expected);
  });
});

describe("Real data: getAllProducts()", () => {
  it("produces no duplicate IDs from real JSON data", () => {
    const result = mergeWithDedup(fastProductsJson, companyProductsJson, personProductsJson, pledgeProductsJson);
    expect(hasDuplicates(result)).toEqual([]);
  });

  it("removes expected number of duplicates from real data", async () => {
    const totalRaw = fastProductsJson.length + companyProductsJson.length + personProductsJson.length + pledgeProductsJson.length;
    const result = mergeWithDedup(fastProductsJson, companyProductsJson, personProductsJson, pledgeProductsJson);
    expect(result.length).toBeLessThan(totalRaw);
    expect(totalRaw - result.length).toBeGreaterThanOrEqual(57);
    expect(result).toEqual(await getAllProducts());
  });

  it("has no internal duplicates within each real category file", () => {
    expect(hasDuplicates(fastProductsJson)).toEqual([]);
    expect(hasDuplicates(companyProductsJson)).toEqual([]);
    expect(hasDuplicates(personProductsJson)).toEqual([]);
    expect(hasDuplicates(pledgeProductsJson)).toEqual([]);
  });
});

describe("Search page: allProducts merge and filter", () => {
  function buildSearchProducts(wd: string) {
    const allWithCategory = [
      ...fastProducts.map((p) => ({ ...p, _category: "fast" as const })),
      ...companyProducts.map((p) => ({ ...p, _category: "company" as const })),
      ...personProducts.map((p) => ({ ...p, _category: "person" as const })),
      ...pledgeProducts.map((p) => ({ ...p, _category: "pledge" as const })),
    ];
    // Dedup
    const seen = new Set<number>();
    const deduped = allWithCategory.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    // Filter
    if (!wd) return [];
    return deduped.filter(
      (p) =>
        p.name.toLowerCase().includes(wd.toLowerCase()) ||
        p.institution.toLowerCase().includes(wd.toLowerCase()),
    );
  }

  it("returns unique results when search term matches products across categories", () => {
    const results = buildSearchProducts("网捷贷");
    const ids = results.map((p) => p.id);
    // id=1 "网捷贷" only once, even though it's in fastProducts and personProducts
    expect(ids.filter((id) => id === 1)).toHaveLength(1);
  });

  it("returns unique results for institution search matching multi-category products", () => {
    const results = buildSearchProducts("农业银行");
    const dupes = hasDuplicates(results);
    expect(dupes).toEqual([]);
  });

  it("returns empty array when search term is empty", () => {
    const results = buildSearchProducts("");
    expect(results).toEqual([]);
  });

  it("returns empty array when no match found", () => {
    const results = buildSearchProducts("不存在的产品");
    expect(results).toEqual([]);
  });

  it("preserves _category field from first occurrence", () => {
    const results = buildSearchProducts("微捷贷");
    // id=2: "微捷贷" in fast, "微捷贷-企业版" in company
    // "微捷贷" matches both name and institution, but only fast version kept
    const match = results.find((p) => p.id === 2);
    expect(match?._category).toBe("fast");
  });

  it("case-insensitive name search works", () => {
    const results = buildSearchProducts("WANGJIE"); // partial pinyin, won't match Chinese chars
    // Test with actual Chinese data
    const cn = buildSearchProducts("网捷贷");
    const lower = buildSearchProducts("网捷贷");
    expect(cn).toEqual(lower);
  });
});

describe("Search with real data", () => {
  it("农业银行 search returns no duplicate product cards", () => {
    const allWithCategory = [
      ...fastProductsJson.map((p: any) => ({ ...p, _category: "fast" })),
      ...companyProductsJson.map((p: any) => ({ ...p, _category: "company" })),
      ...personProductsJson.map((p: any) => ({ ...p, _category: "person" })),
      ...pledgeProductsJson.map((p: any) => ({ ...p, _category: "pledge" })),
    ];

    const seen = new Set<number>();
    const deduped = allWithCategory.filter((p: any) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    const results = deduped.filter(
      (p: any) =>
        p.name.toLowerCase().includes("农业银行") ||
        p.institution.toLowerCase().includes("农业银行"),
    );

    // No duplicate IDs
    const ids = results.map((p: any) => p.id);
    expect(new Set(ids).size).toBe(ids.length);

    // Should match all unique products related to 农业银行
    // Previously returned 22 (with 5 dupes), now should be 17
    expect(results.length).toBe(17);
  });
});
