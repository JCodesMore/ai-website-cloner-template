import { describe, it, expect } from "vitest";
import { productRules, institutionRules, articleRules, commentRules } from "@/lib/data-guard/rules";

const hasDb = !!process.env.DATABASE_URL;

describe("Data Guard Rules (structure)", () => {
  it("product rules exist and all have check functions", () => {
    expect(productRules.length).toBe(3);
    expect(productRules[0].name).toBe("product_row_count");
    for (const rule of productRules) {
      expect(typeof rule.check).toBe("function");
      if (rule.severity === "error") expect(typeof rule.repair).toBe("function");
    }
  });

  it("institution rules have name_swapped detection", () => {
    expect(institutionRules.length).toBe(2);
    expect(institutionRules[0].name).toBe("institution_row_count");
    expect(institutionRules[1].name).toBe("institution_name_swapped");
    for (const rule of institutionRules) {
      expect(typeof rule.check).toBe("function");
      if (rule.severity === "error") expect(typeof rule.repair).toBe("function");
    }
  });

  it("article rules cover all 5 checks", () => {
    expect(articleRules.length).toBe(5);
    const names = articleRules.map(r => r.name);
    expect(names).toContain("article_row_count");
    expect(names).toContain("article_empty_body");
    expect(names).toContain("article_empty_date");
    expect(names).toContain("article_dirty_body");
    expect(names).toContain("article_short_body");
    for (const rule of articleRules) {
      expect(typeof rule.check).toBe("function");
    }
  });

  it("comment rules exist", () => {
    expect(commentRules.length).toBe(1);
    expect(commentRules[0].name).toBe("comment_empty_content");
  });

  it("error rules all have repair functions", () => {
    const allRules = [...productRules, ...institutionRules, ...articleRules, ...commentRules];
    for (const rule of allRules) {
      if (rule.severity === "error") {
        expect(typeof rule.repair, `${rule.name} should have repair function`).toBe("function");
      }
    }
  });

  it("warn rules do not require repair functions", () => {
    const allRules = [...productRules, ...institutionRules, ...articleRules, ...commentRules];
    for (const rule of allRules) {
      if (rule.severity === "warn") {
        // warn-level rules may or may not have repair
        expect(rule.name).toBeTruthy();
      }
    }
  });
});

describe("Data Guard Rules (DB integration)", () => {
  const itDb = hasDb ? it : it.skip;

  itDb("product category distribution check runs without error", async () => {
    const catRule = productRules.find(r => r.name === "product_category_distribution")!;
    expect(catRule).toBeDefined();
    // Only verify it doesn't throw — actual result depends on DB state
    const issues = await catRule.check();
    expect(Array.isArray(issues)).toBe(true);
  });

  itDb("institution name swap check produces valid issue array", async () => {
    const swapRule = institutionRules.find(r => r.name === "institution_name_swapped")!;
    expect(swapRule).toBeDefined();
    const issues = await swapRule.check();
    expect(Array.isArray(issues)).toBe(true);
  });

  itDb("article dirty body check produces valid issue array", async () => {
    const dirtyRule = articleRules.find(r => r.name === "article_dirty_body")!;
    expect(dirtyRule).toBeDefined();
    const issues = await dirtyRule.check();
    expect(Array.isArray(issues)).toBe(true);
  });
});
