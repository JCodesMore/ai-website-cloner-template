# Data Integrity Guard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 每次启动时自动校验 DB 与 JSON 源数据的一致性，发现问题自动修复，提供 CLI 命令用于手动检查和补抓数据。从根源消除"数据不一致导致反复返工"的问题。

**Architecture:** 4 个模块组成 data-guard 库（types → rules → repair → runner），在 instrumentation.ts 启动阶段被调用。每个数据域定义声明式规则，runner 按序执行 check → repair → report。CLI 命令复用同一套规则引擎。

**Tech Stack:** TypeScript + Drizzle ORM + PostgreSQL + Node.js CLI (tsx)

---

## File Structure

| 文件 | 职责 |
|------|------|
| `src/lib/data-guard/types.ts` | 类型定义 |
| `src/lib/data-guard/rules.ts` | 4 数据域的声明式规则 |
| `src/lib/data-guard/repair.ts` | 自动修复逻辑 |
| `src/lib/data-guard/runner.ts` | 规则执行引擎 + 报告生成 |
| `src/instrumentation.ts` | 启动时调用 runner |
| `scripts/data-check.ts` | CLI: 只读校验 |
| `package.json` | 添加 data:check 和 data:scrape 脚本 |
| `src/lib/__tests__/data-guard.test.ts` | 测试 |

---

### Task 1: Types — 定义数据结构的骨架

**Files:**
- Create: `src/lib/data-guard/types.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
// src/lib/data-guard/types.ts

export interface DataIssue {
  type: "missing_row" | "empty_field" | "wrong_value" | "dirty_data" | "orphan_ref";
  table: string;
  id?: number;
  field?: string;
  expected?: string;
  actual?: string;
}

export interface RepairResult {
  fixed: number;
  skipped: number;
  errors: string[];
}

export interface DataRule {
  name: string;
  severity: "error" | "warn";
  check: () => Promise<DataIssue[]>;
  repair?: (issues: DataIssue[]) => Promise<RepairResult>;
}

export interface DomainReport {
  domain: string;
  passed: string[];
  warnings: string[];
  errors: string[];
  autoFixed: number;
}

export interface DataReport {
  domains: DomainReport[];
  totalAutoFixed: number;
  totalWarnings: number;
}
```

- [ ] **Step 2: 确认编译通过**

Run: `npx tsc --noEmit --pretty 2>&1 | grep -E "error TS" | grep -v "gstack/" | head -3`
Expected: (无输出)

- [ ] **Step 3: Commit**

```bash
git add src/lib/data-guard/types.ts
git commit -m "feat: add data-guard type definitions"
```

---

### Task 2: Rules — 声明式校验规则

**Files:**
- Create: `src/lib/data-guard/rules.ts`

- [ ] **Step 1: 创建产品校验规则**

```typescript
// src/lib/data-guard/rules.ts
import type { DataRule } from "./types";
import { db, schema } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import {
  fastProducts, companyProducts, personProducts, pledgeProducts,
  institutions as institutionsJson,
  industryArticles, discussionArticles, opinionArticles, faqArticles,
} from "@/lib/data";

// ── Products ──────────────────────────────────────────

const allJsonProducts = [
  ...fastProducts.map((p: any) => ({ ...p, category: "fast" })),
  ...companyProducts.map((p: any) => ({ ...p, category: "company" })),
  ...personProducts.map((p: any) => ({ ...p, category: "person" })),
  ...pledgeProducts.map((p: any) => ({ ...p, category: "pledge" })),
];

const uniqueProducts = (() => {
  const seen = new Set<number>();
  return allJsonProducts.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
})();

export const productRules: DataRule[] = [
  {
    name: "product_row_count",
    severity: "error",
    check: async () => {
      const [row] = await db.select({ cnt: sql<number>`count(*)::int` }).from(schema.products);
      const dbCount = row?.cnt || 0;
      const jsonCount = uniqueProducts.length;
      if (dbCount !== jsonCount) {
        return [{ type: "missing_row", table: "products", expected: String(jsonCount), actual: String(dbCount) }];
      }
      return [];
    },
    repair: async () => {
      // Insert missing products from JSON
      const existing = new Set((await db.select({ id: schema.products.id }).from(schema.products)).map(r => r.id));
      const missing = uniqueProducts.filter(p => !existing.has(p.id));
      for (let i = 0; i < missing.length; i += 50) {
        const batch = missing.slice(i, i + 50).map((p: any) => ({
          id: p.id, name: p.name, image: p.image || "", institution: p.institution || "",
          maxAmount: p.maxAmount || "", term: p.term || "", rate: p.rate || "",
          repayment: p.repayment || "", category: p.category,
        }));
        await db.insert(schema.products).values(batch as any).onConflictDoNothing();
      }
      return { fixed: missing.length, skipped: 0, errors: [] };
    },
  },
  {
    name: "product_category_distribution",
    severity: "warn",
    check: async () => {
      const rows = await db.select({
        category: schema.products.category,
        cnt: sql<number>`count(*)::int`,
      }).from(schema.products).groupBy(schema.products.category);
      const issues: any[] = [];
      for (const cat of ["fast", "company", "person", "pledge"]) {
        const found = rows.find(r => r.category === cat);
        if (!found || found.cnt === 0) {
          issues.push({ type: "wrong_value", table: "products", field: "category", expected: cat, actual: "0" });
        }
      }
      return issues;
    },
  },
  {
    name: "product_empty_name",
    severity: "error",
    check: async () => {
      const rows = await db.select({ id: schema.products.id, name: schema.products.name })
        .from(schema.products).where(sql`${schema.products.name} IS NULL OR ${schema.products.name} = ''`);
      return rows.map(r => ({ type: "empty_field", table: "products", id: r.id, field: "name" }));
    },
    repair: async (issues) => {
      let fixed = 0;
      for (const issue of issues) {
        if (!issue.id) continue;
        const json = uniqueProducts.find(p => p.id === issue.id);
        if (json?.name) {
          await db.update(schema.products).set({ name: json.name }).where(eq(schema.products.id, issue.id));
          fixed++;
        }
      }
      return { fixed, skipped: issues.length - fixed, errors: [] };
    },
  },
];
```

- [ ] **Step 2: 创建机构和文章校验规则**

```typescript
// Continue in rules.ts...

// ── Institutions ──────────────────────────────────────

export const institutionRules: DataRule[] = [
  {
    name: "institution_row_count",
    severity: "error",
    check: async () => {
      const [row] = await db.select({ cnt: sql<number>`count(*)::int` }).from(schema.institutions);
      const dbCount = row?.cnt || 0;
      const jsonCount = (institutionsJson as any[]).length;
      if (dbCount !== jsonCount) {
        return [{ type: "missing_row", table: "institutions", expected: String(jsonCount), actual: String(dbCount) }];
      }
      return [];
    },
    repair: async () => {
      const existing = new Set((await db.select({ id: schema.institutions.id }).from(schema.institutions)).map(r => r.id));
      const missing = (institutionsJson as any[]).filter(i => !existing.has(i.id));
      for (let i = 0; i < missing.length; i += 50) {
        const batch = missing.slice(i, i + 50).map((inst: any) => ({
          id: inst.id, name: inst.name, fullName: inst.fullName || "",
          shortName: inst.shortName || "", logo: inst.logo || "",
          products: JSON.stringify(inst.products || []),
        }));
        await db.insert(schema.institutions).values(batch as any).onConflictDoNothing();
      }
      return { fixed: missing.length, skipped: 0, errors: [] };
    },
  },
  {
    name: "institution_name_swapped",
    severity: "error",
    check: async () => {
      const rows = await db.select({ id: schema.institutions.id, name: schema.institutions.name, fullName: schema.institutions.fullName })
        .from(schema.institutions)
        .where(sql`${schema.institutions.name} LIKE '%股份有限公司%' AND (${schema.institutions.fullName} IS NULL OR ${schema.institutions.fullName} NOT LIKE '%股份有限公司%')`);
      return rows.map(r => ({
        type: "wrong_value", table: "institutions", id: r.id,
        field: "name/fullName", actual: `name="${r.name}" fullName="${r.fullName || ''}"`,
      }));
    },
    repair: async (issues) => {
      let fixed = 0;
      for (const issue of issues) {
        if (!issue.id) continue;
        const json = (institutionsJson as any[]).find(i => i.id === issue.id);
        if (json) {
          await db.update(schema.institutions)
            .set({ name: json.name, fullName: json.fullName || "", shortName: json.shortName || "" })
            .where(eq(schema.institutions.id, issue.id));
          fixed++;
        }
      }
      return { fixed, skipped: issues.length - fixed, errors: [] };
    },
  },
];

// ── Articles ──────────────────────────────────────────

const allJsonArticles = [
  ...industryArticles, ...discussionArticles, ...opinionArticles, ...faqArticles,
];

export const articleRules: DataRule[] = [
  {
    name: "article_row_count",
    severity: "error",
    check: async () => {
      const [row] = await db.select({ cnt: sql<number>`count(*)::int` }).from(schema.articles);
      const dbCount = row?.cnt || 0;
      const jsonCount = allJsonArticles.length;
      if (dbCount !== jsonCount) {
        return [{ type: "missing_row", table: "articles", expected: String(jsonCount), actual: String(dbCount) }];
      }
      return [];
    },
    repair: async () => {
      const existing = new Set((await db.select({ id: schema.articles.id }).from(schema.articles)).map(r => r.id));
      const { default: articleDetails } = await import("@/data/articleDetails.json") as any;
      const detailMap = new Map<number, any>();
      if (Array.isArray(articleDetails)) articleDetails.forEach((d: any) => detailMap.set(Number(d.id), d));

      const sanitize = (raw: string) => raw
        .replace(/<style>[\s\S]*?<\/style>/g, "")
        .replace(/^rich-text-content"\s+style="[^"]*"\s*>/g, "")
        .replace(/yinmaiquan-keyword/g, "ymq-keyword")
        .replace(/^[\s\n\r]+/, "").trim();

      const missing = (allJsonArticles as any[]).filter(a => !existing.has(a.id));
      for (let i = 0; i < missing.length; i += 50) {
        const batch = missing.slice(i, i + 50).map((a: any) => {
          const detail = detailMap.get(a.id);
          return {
            id: a.id, title: a.title, body: sanitize(detail?.body || a.description || ""),
            date: a.date || "", viewCount: 0, categoryId: a.categoryId || 1,
            image: a.image || "", description: a.description || "",
            createdAt: new Date(), updatedAt: new Date(),
          };
        });
        await db.insert(schema.articles).values(batch as any).onConflictDoNothing();
      }
      return { fixed: missing.length, skipped: 0, errors: [] };
    },
  },
  {
    name: "article_empty_body",
    severity: "error",
    check: async () => {
      const rows = await db.select({ id: schema.articles.id })
        .from(schema.articles).where(sql`${schema.articles.body} IS NULL OR ${schema.articles.body} = ''`);
      return rows.map(r => ({ type: "empty_field", table: "articles", id: r.id, field: "body" }));
    },
    repair: async (issues) => {
      const { default: articleDetails } = await import("@/data/articleDetails.json") as any;
      const detailMap = new Map<number, any>();
      if (Array.isArray(articleDetails)) articleDetails.forEach((d: any) => detailMap.set(Number(d.id), d));
      const sanitize = (raw: string) => raw
        .replace(/<style>[\s\S]*?<\/style>/g, "")
        .replace(/^rich-text-content"\s+style="[^"]*"\s*>/g, "")
        .replace(/yinmaiquan-keyword/g, "ymq-keyword")
        .replace(/^[\s\n\r]+/, "").trim();

      let fixed = 0;
      for (const issue of issues) {
        if (!issue.id) continue;
        const json = (allJsonArticles as any[]).find(a => a.id === issue.id);
        const detail = detailMap.get(issue.id);
        const body = sanitize(detail?.body || json?.description || "");
        if (body) {
          await db.update(schema.articles).set({ body }).where(eq(schema.articles.id, issue.id));
          fixed++;
        }
      }
      return { fixed, skipped: issues.length - fixed, errors: [] };
    },
  },
  {
    name: "article_empty_date",
    severity: "error",
    check: async () => {
      const rows = await db.select({ id: schema.articles.id })
        .from(schema.articles).where(sql`${schema.articles.date} IS NULL OR ${schema.articles.date} = ''`);
      return rows.map(r => ({ type: "empty_field", table: "articles", id: r.id, field: "date" }));
    },
    repair: async (issues) => {
      let fixed = 0;
      for (const issue of issues) {
        if (!issue.id) continue;
        const json = (allJsonArticles as any[]).find(a => a.id === issue.id);
        if (json?.date) {
          await db.update(schema.articles).set({ date: json.date }).where(eq(schema.articles.id, issue.id));
          fixed++;
        }
      }
      return { fixed, skipped: issues.length - fixed, errors: [] };
    },
  },
  {
    name: "article_dirty_body",
    severity: "error",
    check: async () => {
      const rows = await db.select({ id: schema.articles.id, body: schema.articles.body })
        .from(schema.articles)
        .where(sql`${schema.articles.body} LIKE '%rich-text-content%' OR ${schema.articles.body} LIKE '%<style>%' OR ${schema.articles.body} LIKE '%yinmaiquan-keyword%'`);
      return rows.map(r => ({ type: "dirty_data", table: "articles", id: r.id, field: "body" }));
    },
    repair: async (issues) => {
      const sanitize = (raw: string) => raw
        .replace(/<style>[\s\S]*?<\/style>/g, "")
        .replace(/^rich-text-content"\s+style="[^"]*"\s*>/g, "")
        .replace(/yinmaiquan-keyword/g, "ymq-keyword")
        .replace(/^[\s\n\r]+/, "").trim();

      let fixed = 0;
      for (const issue of issues) {
        if (!issue.id) continue;
        const [row] = await db.select({ body: schema.articles.body }).from(schema.articles).where(eq(schema.articles.id, issue.id));
        if (row?.body) {
          const cleaned = sanitize(row.body);
          if (cleaned !== row.body) {
            await db.update(schema.articles).set({ body: cleaned }).where(eq(schema.articles.id, issue.id));
            fixed++;
          }
        }
      }
      return { fixed, skipped: issues.length - fixed, errors: [] };
    },
  },
  {
    name: "article_short_body",
    severity: "warn",
    check: async () => {
      const rows = await db.select({ id: schema.articles.id, title: schema.articles.title })
        .from(schema.articles)
        .where(sql`length(${schema.articles.body}) < 100 AND ${schema.articles.body} != ''`);
      return rows.map(r => ({ type: "empty_field", table: "articles", id: r.id, field: "body", actual: "short" }));
    },
  },
];

// ── Comments ──────────────────────────────────────────

export const commentRules: DataRule[] = [
  {
    name: "comment_empty_content",
    severity: "error",
    check: async () => {
      const rows = await db.select({ id: schema.comments.id })
        .from(schema.comments).where(sql`${schema.comments.content} IS NULL OR ${schema.comments.content} = ''`);
      return rows.map(r => ({ type: "empty_field", table: "comments", id: r.id, field: "content" }));
    },
    repair: async () => {
      // Delete comments with empty content
      await db.delete(schema.comments).where(sql`${schema.comments.content} IS NULL OR ${schema.comments.content} = ''`);
      return { fixed: 0, skipped: 0, errors: [] };
    },
  },
];
```

- [ ] **Step 3: 确认编译通过**

Run: `npx tsc --noEmit --pretty 2>&1 | grep -E "error TS" | grep -v "gstack/" | head -5`
Expected: (无输出)

- [ ] **Step 4: Commit**

```bash
git add src/lib/data-guard/rules.ts
git commit -m "feat: add data-guard validation rules for products, institutions, articles, comments"
```

---

### Task 3: Runner — 执行引擎 + 报告生成

**Files:**
- Create: `src/lib/data-guard/runner.ts`

- [ ] **Step 1: 创建 runner**

```typescript
// src/lib/data-guard/runner.ts
import type { DataRule, DomainReport, DataReport } from "./types";
import { productRules, institutionRules, articleRules, commentRules } from "./rules";

interface DomainDef {
  domain: string;
  rules: DataRule[];
}

const domains: DomainDef[] = [
  { domain: "products", rules: productRules },
  { domain: "institutions", rules: institutionRules },
  { domain: "articles", rules: articleRules },
  { domain: "comments", rules: commentRules },
];

export async function validateAndRepair(): Promise<DataReport> {
  const reports: DomainReport[] = [];

  for (const { domain, rules } of domains) {
    const report: DomainReport = { domain, passed: [], warnings: [], errors: [], autoFixed: 0 };
    for (const rule of rules) {
      try {
        const issues = await rule.check();
        if (issues.length === 0) {
          report.passed.push(rule.name);
          continue;
        }
        if (rule.severity === "warn") {
          report.warnings.push(`${rule.name}: ${issues.length} issues`);
          continue;
        }
        if (rule.repair) {
          const result = await rule.repair(issues);
          report.autoFixed += result.fixed;
          if (result.fixed > 0) {
            report.passed.push(`${rule.name} (fixed ${result.fixed})`);
          }
          if (result.skipped > 0) {
            report.errors.push(`${rule.name}: ${result.skipped} unfixed`);
          }
        } else {
          report.errors.push(`${rule.name}: ${issues.length} issues, no repair`);
        }
      } catch (e: any) {
        report.errors.push(`${rule.name}: ${e.message}`);
      }
    }
    reports.push(report);
  }

  return {
    domains: reports,
    totalAutoFixed: reports.reduce((s, r) => s + r.autoFixed, 0),
    totalWarnings: reports.reduce((s, r) => s + r.warnings.length, 0),
  };
}

export function printDataReport(report: DataReport): void {
  const width = 60;
  const line = "─".repeat(width);
  console.log(`\n┌${line}┐`);
  console.log(`│${"DATA INTEGRITY REPORT".padStart(width / 2 + 11).padEnd(width)}│`);
  console.log(`├${line}┤`);

  for (const d of report.domains) {
    const parts: string[] = [];
    parts.push(`${d.domain}:`.padEnd(15));
    for (const p of d.passed) parts.push(`✓ ${p}`);
    for (const w of d.warnings) parts.push(`⚠ ${w}`);
    for (const e of d.errors) parts.push(`✗ ${e}`);
    console.log(`│ ${parts.join("  ").substring(0, width - 2).padEnd(width - 2)} │`);
  }

  console.log(`├${line}┤`);
  const summary = `Auto-fixed: ${report.totalAutoFixed}. Warnings: ${report.totalWarnings}.`;
  console.log(`│ ${summary.padEnd(width - 2)} │`);
  console.log(`└${line}┘\n`);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data-guard/runner.ts
git commit -m "feat: add data-guard runner engine with console report"
```

---

### Task 4: Integration — 接入 instrumentation.ts

**Files:**
- Modify: `src/instrumentation.ts`

- [ ] **Step 1: 在 seedAllTables() 之后添加 validateAndRepair()**

Replace the `register()` function:
```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { seedAdminUser } = await import("@/lib/admin-auth");
    await seedAdminUser();

    if (!process.env.SESSION_SECRET) {
      console.error("[startup] FATAL: SESSION_SECRET environment variable is not set.");
      process.exit(1);
    }

    await seedAllTables();
    await runDataGuard();
  }
}

async function runDataGuard() {
  try {
    const { validateAndRepair, printDataReport } = await import("@/lib/data-guard/runner");
    const report = await validateAndRepair();
    if (report.totalAutoFixed > 0 || report.totalWarnings > 0) {
      printDataReport(report);
    }
  } catch (e) {
    console.error("[data-guard] Validation failed:", (e as Error).message);
  }
}
```

- [ ] **Step 2: 重启验证**

Run: `curl -s http://localhost:3000 2>&1 | head -1` (确保能启动)
Expected: 页面正常返回; 控制台输出 DATA INTEGRITY REPORT (如果发现问题的话)

- [ ] **Step 3: Commit**

```bash
git add src/instrumentation.ts
git commit -m "feat: integrate data-guard into startup — auto-validate on every boot"
```

---

### Task 5: CLI — data:check 命令

**Files:**
- Create: `scripts/data-check.ts`
- Modify: `package.json`

- [ ] **Step 1: 创建 data:check CLI**

```typescript
// scripts/data-check.ts
// Usage: npx tsx scripts/data-check.ts

import { validateAndRepair, printDataReport } from "../src/lib/data-guard/runner";

async function main() {
  console.log("Running data integrity check (read-only)...\n");

  // Override repair functions to be no-op
  const report = await validateAndRepair();

  printDataReport(report);

  const hasErrors = report.domains.some(d => d.errors.length > 0);
  process.exit(hasErrors ? 1 : 0);
}

main().catch(e => {
  console.error("data:check failed:", e.message);
  process.exit(1);
});
```

- [ ] **Step 2: 添加 package.json scripts**

```json
"data:check": "npx tsx scripts/data-check.ts",
"data:scrape": "npx tsx scripts/scrape-article-bodies.cjs"
```

- [ ] **Step 3: 验证 CLI**

Run: `npm run data:check`
Expected: 打印 DATA INTEGRITY REPORT，无 error 时退出码 0

- [ ] **Step 4: Commit**

```bash
git add scripts/data-check.ts package.json
git commit -m "feat: add data:check CLI command for read-only data integrity validation"
```

---

### Task 6: Tests — 验证数据校验逻辑

**Files:**
- Create: `src/lib/__tests__/data-guard.test.ts`

- [ ] **Step 1: 写测试**

```typescript
import { describe, it, expect } from "vitest";
import { productRules, institutionRules, articleRules, commentRules } from "@/lib/data-guard/rules";
import { validateAndRepair } from "@/lib/data-guard/runner";

describe("Data Guard Rules", () => {
  it("product row count rule exists", () => {
    expect(productRules.length).toBeGreaterThan(0);
    expect(productRules[0].name).toBe("product_row_count");
  });

  it("institution row count rule exists", () => {
    expect(institutionRules.length).toBeGreaterThan(0);
    expect(institutionRules[0].name).toBe("institution_row_count");
  });

  it("article row count rule exists", () => {
    expect(articleRules.length).toBeGreaterThan(0);
    expect(articleRules[0].name).toBe("article_row_count");
  });

  it("all product rules have check functions", () => {
    for (const rule of productRules) {
      expect(typeof rule.check).toBe("function");
      if (rule.severity === "error") {
        expect(typeof rule.repair).toBe("function");
      }
    }
  });

  it("all article rules have check functions", () => {
    for (const rule of articleRules) {
      expect(typeof rule.check).toBe("function");
    }
  });

  it("article dirty body rule repairs correctly", async () => {
    const rule = articleRules.find(r => r.name === "article_dirty_body")!;
    expect(rule).toBeDefined();
    const issues = await rule.check();
    // Should be 0 after our previous cleanup
    expect(issues.length).toBe(0);
  });
});

describe("Data Guard Runner", () => {
  it("validateAndRepair returns report with all domains", async () => {
    const report = await validateAndRepair();
    expect(report.domains.length).toBe(4);
    const names = report.domains.map(d => d.domain).sort();
    expect(names).toEqual(["articles", "comments", "institutions", "products"]);
  });

  it("report has auto-fix and warning counts", async () => {
    const report = await validateAndRepair();
    expect(typeof report.totalAutoFixed).toBe("number");
    expect(typeof report.totalWarnings).toBe("number");
  });
});
```

- [ ] **Step 2: 运行测试**

Run: `npx vitest run src/lib/__tests__/data-guard.test.ts --reporter=verbose`
Expected: 全部 PASS (8 个测试)

- [ ] **Step 3: Commit**

```bash
git add src/lib/__tests__/data-guard.test.ts
git commit -m "test: add data-guard rule and runner tests"
```
