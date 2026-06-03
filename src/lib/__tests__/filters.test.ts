import { describe, it, expect } from "vitest";
import { paginate, getWd, getPage, filterByIk, filterInstitutionsByIk, PAGE_SIZE } from "@/lib/filters";

// ── getWd ─────────────────────────────────────────────────

describe("getWd", () => {
  it("extracts wd parameter", () => {
    const params = new URLSearchParams("wd=农业银行");
    expect(getWd(params)).toBe("农业银行");
  });

  it("returns empty string when wd is missing", () => {
    const params = new URLSearchParams("");
    expect(getWd(params)).toBe("");
  });

  it("trims whitespace from wd", () => {
    const params = new URLSearchParams("wd=  农业银行  ");
    expect(getWd(params)).toBe("农业银行");
  });

  it("returns empty string when wd is only whitespace", () => {
    const params = new URLSearchParams("wd=   ");
    expect(getWd(params)).toBe("");
  });
});

// ── getPage ────────────────────────────────────────────────

describe("getPage", () => {
  it("parses page number", () => {
    expect(getPage(new URLSearchParams("page=3"))).toBe(3);
  });

  it("defaults to 1 when page is missing", () => {
    expect(getPage(new URLSearchParams(""))).toBe(1);
  });

  it("defaults to 1 when page is not a number", () => {
    expect(getPage(new URLSearchParams("page=abc"))).toBe(1);
  });

  it("defaults to 1 when page is negative", () => {
    expect(getPage(new URLSearchParams("page=-5"))).toBe(1);
  });

  it("defaults to 1 when page is zero", () => {
    expect(getPage(new URLSearchParams("page=0"))).toBe(1);
  });

  it("handles large page numbers", () => {
    expect(getPage(new URLSearchParams("page=999"))).toBe(999);
  });
});

// ── paginate ───────────────────────────────────────────────

describe("paginate", () => {
  const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));

  it("returns first page with correct size", () => {
    const result = paginate(items, 1, PAGE_SIZE);
    expect(result.items).toHaveLength(PAGE_SIZE);
    expect(result.items[0].id).toBe(1);
    expect(result.currentPage).toBe(1);
  });

  it("returns second page with correct offset", () => {
    const result = paginate(items, 2, PAGE_SIZE);
    expect(result.items).toHaveLength(PAGE_SIZE);
    expect(result.items[0].id).toBe(PAGE_SIZE + 1);
    expect(result.currentPage).toBe(2);
  });

  it("returns last page with fewer items", () => {
    const result = paginate(items, 3, PAGE_SIZE); // 50 items, 18 per page = 3 pages: 18 + 18 + 14
    expect(result.items).toHaveLength(14);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(3);
  });

  it("clamps page to total pages when requested page exceeds total", () => {
    const result = paginate(items, 100, PAGE_SIZE);
    expect(result.currentPage).toBe(3); // Clamped to last page
  });

  it("handles empty array", () => {
    const result = paginate([], 1, PAGE_SIZE);
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1); // minimum 1
    expect(result.currentPage).toBe(1);
  });

  it("handles single item", () => {
    const result = paginate([{ id: 1 }], 1, PAGE_SIZE);
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it("returns correct total count", () => {
    const result = paginate(items, 1, PAGE_SIZE);
    expect(result.total).toBe(50);
  });

  it("works with custom page size", () => {
    const result = paginate(items, 1, 10);
    expect(result.items).toHaveLength(10);
    expect(result.totalPages).toBe(5);
  });

  it("page 1 with exactly PAGE_SIZE items has 1 total page", () => {
    const exact = Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: i + 1 }));
    const result = paginate(exact, 1, PAGE_SIZE);
    expect(result.totalPages).toBe(1);
    expect(result.items).toHaveLength(PAGE_SIZE);
  });
});

// ── filterByIk ─────────────────────────────────────────────

describe("filterByIk", () => {
  const products = [
    { institution: "农业银行" },
    { institution: "工商银行" },
    { institution: "招商银行" },
    { institution: "马上消费金融" },
    { institution: "XX担保公司" },
  ];

  it("filters by institution type 'socb' (六大行)", () => {
    const result = filterByIk(products, "socb");
    expect(result).toHaveLength(2); // 农业银行, 工商银行
  });

  it("filters by institution type 'jscb' (股份制银行)", () => {
    const result = filterByIk(products, "jscb");
    expect(result).toHaveLength(1); // 招商银行
  });

  it("filters by institution type 'cfc' (消费金融)", () => {
    const result = filterByIk(products, "cfc");
    expect(result).toHaveLength(1); // 马上消费金融
  });

  it("filters by institution type 'lmc' (担保/小贷)", () => {
    const result = filterByIk(products, "lmc");
    expect(result).toHaveLength(1); // XX担保公司
  });

  it("returns all items when ik is empty", () => {
    const result = filterByIk(products, "");
    expect(result).toHaveLength(5);
  });

  it("returns empty array when no institution matches", () => {
    const result = filterByIk([{ institution: "未知机构" }], "socb");
    expect(result).toHaveLength(0);
  });
});

describe("Regression: institution search by abbreviation", () => {
  it('"农商" matches institutions with short_name containing 农商', () => {
    const institutions = [
      { id: 1, name: "北京农村商业银行股份有限公司", fullName: "北京农商行" },
      { id: 2, name: "上海农村商业银行股份有限公司", fullName: "上海农商银行" },
      { id: 3, name: "招商银行股份有限公司", fullName: "招商银行" },
    ];
    const q = "农商";
    const matches = institutions.filter((i: any) =>
      i.name.includes(q) || (i.fullName || "").includes(q)
    );
    expect(matches.length).toBe(2);
  });

  it("filterInstitutionsByIk socb returns 6 state-owned banks", () => {
    const banks = [
      { id: 1, name: "工商银行", fullName: "中国工商银行股份有限公司" },
      { id: 2, name: "农业银行", fullName: "中国农业银行股份有限公司" },
      { id: 4, name: "建设银行", fullName: "中国建设银行股份有限公司" },
      { id: 5, name: "邮储银行", fullName: "中国邮政储蓄银行股份有限公司" },
      { id: 6, name: "交通银行", fullName: "中国交通银行股份有限公司" },
      { id: 7, name: "中国银行", fullName: "中国银行股份有限公司" },
      { id: 99, name: "招商银行", fullName: "招商银行股份有限公司" },
    ] as any;
    const result = filterInstitutionsByIk(banks, "socb");
    expect(result.length).toBe(6);
    expect(result.map((i: any) => i.id).sort()).toEqual([1, 2, 4, 5, 6, 7]);
  });
});
