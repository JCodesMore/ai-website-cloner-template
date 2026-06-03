import { describe, it, expect } from "vitest";
import { getAllProducts } from "@/lib/repository";
import { paginate, filterByIk, PAGE_SIZE } from "@/lib/filters";
import categoryProducts from "@/data/category-products.json";

async function buildListingResponse(category: string, page: number, ik: string) {
  const allProducts = await getAllProducts();
  const catData = (categoryProducts as any).categories[category];
  const catIds: Set<number> = catData ? new Set(catData.ids) : new Set();
  let filtered = catIds.size > 0 ? allProducts.filter((p) => catIds.has(p.id)) : allProducts;
  if (ik) filtered = filterByIk(filtered, ik);
  return paginate(filtered, page, PAGE_SIZE);
}

describe("API listing route deduplication", () => {
  it("category 'fast' listing has no duplicate IDs", async () => {
    const { items } = await buildListingResponse("fast", 1, "");
    const ids = items.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("category 'company' listing has no duplicate IDs", async () => {
    const { items } = await buildListingResponse("company", 1, "");
    const ids = items.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("category 'person' listing has no duplicate IDs", async () => {
    const { items } = await buildListingResponse("person", 1, "");
    const ids = items.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("category 'pledge' listing has no duplicate IDs", async () => {
    const { items } = await buildListingResponse("pledge", 1, "");
    const ids = items.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("paginates correctly through all results", async () => {
    const { total, totalPages, items } = await buildListingResponse("fast", 1, "");
    expect(items.length).toBeLessThanOrEqual(PAGE_SIZE);
    for (let p = 1; p <= totalPages; p++) {
      const page = await buildListingResponse("fast", p, "");
      expect(page.currentPage).toBe(p);
      expect(page.items.length).toBeGreaterThan(0);
      if (p < totalPages) expect(page.items.length).toBe(PAGE_SIZE);
    }
  });
});

describe("API listing route with institution filter (ik)", () => {
  it("socb filter returns only products from 六大行", async () => {
    const { items } = await buildListingResponse("company", 1, "socb");
    for (const p of items) {
      const text = p.institution;
      const isSocb = ["工商银行", "建设银行", "农业银行", "中国银行", "交通银行", "邮储银行", "邮储", "开发银行", "进出口银行", "农业发展银行"].some((k) => text.includes(k));
      expect(isSocb).toBe(true);
    }
  });

  it("filtered results have no duplicate IDs", async () => {
    const { items } = await buildListingResponse("company", 1, "socb");
    const ids = items.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns empty for non-existent institution type", async () => {
    const { items, total } = await buildListingResponse("company", 1, "nonexistent");
    expect(items.length).toBe(0);
    expect(total).toBe(0);
  });
});

describe("Cross-category edge cases", () => {
  it("products that span fast+person categories appear only once in each listing", async () => {
    const fastListing = await buildListingResponse("fast", 1, "");
    const personListing = await buildListingResponse("person", 1, "");
    const inFast = fastListing.items.filter((p: any) => p.id === 78);
    const inPerson = personListing.items.filter((p: any) => p.id === 78);
    expect(inFast.length).toBeLessThanOrEqual(1);
    expect(inPerson.length).toBeLessThanOrEqual(1);
  });

  it("product in company+pledge categories deduplicates correctly", async () => {
    const { items } = await buildListingResponse("company", 1, "");
    const match = items.filter((p: any) => p.id === 135);
    expect(match.length).toBeLessThanOrEqual(1);
  });

  it("total counts are consistent across pages", async () => {
    const page1 = await buildListingResponse("company", 1, "");
    const page2 = await buildListingResponse("company", 2, "");
    expect(page1.total).toBe(page2.total);
    const page1Ids = new Set(page1.items.map((p) => p.id));
    const page2Ids = page2.items.map((p) => p.id);
    for (const id of page2Ids) expect(page1Ids.has(id)).toBe(false);
  });

  it("no products lost: all unique category products are present across all pages", async () => {
    const catData = (categoryProducts as any).categories["fast"];
    const catIds: Set<number> = new Set(catData.ids);
    const allUnique = (await getAllProducts()).filter((p) => catIds.has(p.id));
    const uniqueIds = new Set(allUnique.map((p) => p.id));
    expect(allUnique.length).toBe(uniqueIds.size);

    const page1 = await buildListingResponse("fast", 1, "");
    const collectedIds = new Set(page1.items.map((p) => p.id));
    for (let p = 2; p <= page1.totalPages; p++) {
      const page = await buildListingResponse("fast", p, "");
      for (const item of page.items) collectedIds.add(item.id);
    }
    for (const id of uniqueIds) expect(collectedIds.has(id)).toBe(true);
    for (const id of collectedIds) expect(uniqueIds.has(id)).toBe(true);
  });
});
