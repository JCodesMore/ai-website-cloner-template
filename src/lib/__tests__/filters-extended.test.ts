import { describe, it, expect } from "vitest";
import { filterByTag, filterByAdv, searchInstitutions, sortInstitutions } from "@/lib/filters";
import type { Institution } from "@/types";

describe("filterByTag", () => {
  const products = [
    { promo: "专精特新企业" },
    { promo: "国高新认证" },
    { promo: "科技类企业" },
    { promo: "" },
    {},
  ];

  it("filters by tag '24' (专精特新)", () => {
    const r = filterByTag(products, "24");
    expect(r).toHaveLength(1);
    expect(r[0].promo).toBe("专精特新企业");
  });

  it("filters by tag '25' (国高新)", () => {
    const r = filterByTag(products, "25");
    expect(r).toHaveLength(1);
    expect(r[0].promo).toBe("国高新认证");
  });

  it("returns all when tag is empty", () => {
    expect(filterByTag(products, "")).toHaveLength(5);
  });

  it("returns empty when no match", () => {
    expect(filterByTag([{ promo: "其他" }], "24")).toHaveLength(0);
  });

  it("returns all when tag id is unknown", () => {
    expect(filterByTag(products, "999")).toHaveLength(5);
  });
});

function makeInst(overrides: Partial<Institution> = {}): Institution {
  return {
    id: 1, name: "Test", initial: "T", productCount: 0, href: "/1", products: [],
    ...overrides,
  };
}

describe("searchInstitutions", () => {
  const items: Institution[] = [
    makeInst({ id: 1, name: "农业银行", fullName: "中国农业银行股份有限公司" }),
    makeInst({ id: 2, name: "招商银行", fullName: "招商银行股份有限公司" }),
    makeInst({ id: 3, name: "XX担保", fullName: "" }),
  ];

  it("searches by name", () => {
    expect(searchInstitutions(items, "农业")).toHaveLength(1);
  });

  it("searches by fullName", () => {
    expect(searchInstitutions(items, "招商银行股份")).toHaveLength(1);
  });

  it("returns all when query is empty", () => {
    expect(searchInstitutions(items, "")).toHaveLength(3);
  });

  it("case-insensitive search", () => {
    expect(searchInstitutions(items, "xx")).toHaveLength(1);
  });

  it("returns empty when no match", () => {
    expect(searchInstitutions(items, "不存在的机构")).toHaveLength(0);
  });
});

describe("sortInstitutions", () => {
  const items: Institution[] = [
    makeInst({ id: 1, name: "A", productCount: 5 }),
    makeInst({ id: 2, name: "B", productCount: 10 }),
    makeInst({ id: 3, name: "C", productCount: 3 }),
  ];

  it("sorts by productCount desc", () => {
    const r = sortInstitutions(items, "productNum", "desc");
    expect(r[0].productCount).toBe(10);
    expect(r[2].productCount).toBe(3);
  });

  it("sorts by productCount asc", () => {
    const r = sortInstitutions(items, "productNum", "asc");
    expect(r[0].productCount).toBe(3);
    expect(r[2].productCount).toBe(10);
  });

  it("returns unsorted when ob is not productNum", () => {
    const r = sortInstitutions(items, "", "");
    expect(r[0].name).toBe("A");
  });
});
