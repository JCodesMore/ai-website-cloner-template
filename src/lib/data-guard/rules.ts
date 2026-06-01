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

// Deduplicate by ID (pledge > fast > company > person priority)
const uniqueProducts = (() => {
  const seen = new Set<number>();
  const result: any[] = [];
  const priority = ["pledge", "fast", "company", "person"];
  for (const cat of priority) {
    for (const p of allJsonProducts.filter(p => p.category === cat)) {
      if (!seen.has(p.id)) { seen.add(p.id); result.push(p); }
    }
  }
  return result;
})();

export const productRules: DataRule[] = [
  {
    name: "product_row_count",
    severity: "error",
    check: async () => {
      const [row] = await db.select({ cnt: sql`count(*)::int` }).from(schema.products);
      const dbCount = row?.cnt || 0;
      const jsonCount = uniqueProducts.length;
      if (dbCount !== jsonCount) {
        return [{ type: "missing_row", table: "products", expected: String(jsonCount), actual: String(dbCount) }];
      }
      return [];
    },
    repair: async () => {
      const existing = new Set((await db.select({ id: schema.products.id }).from(schema.products)).map((r: { id: number }) => r.id));
      const missing = uniqueProducts.filter((p: any) => !existing.has(p.id));
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
        cnt: sql`count(*)::int`,
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
      return rows.map((r: { id: number; name: string }) => ({ type: "empty_field", table: "products", id: r.id, field: "name" }));
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

// ── Institutions ──────────────────────────────────────

export const institutionRules: DataRule[] = [
  {
    name: "institution_row_count",
    severity: "error",
    check: async () => {
      const [row] = await db.select({ cnt: sql`count(*)::int` }).from(schema.institutions);
      const dbCount = row?.cnt || 0;
      const jsonCount = (institutionsJson as any[]).length;
      if (dbCount !== jsonCount) {
        return [{ type: "missing_row", table: "institutions", expected: String(jsonCount), actual: String(dbCount) }];
      }
      return [];
    },
    repair: async () => {
      const existing = new Set((await db.select({ id: schema.institutions.id }).from(schema.institutions)).map((r: { id: number }) => r.id));
      const missing = (institutionsJson as any[]).filter((i: any) => !existing.has(i.id));
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
        .where(sql`${schema.institutions.name} LIKE ${'%股份有限公司%'} AND (${schema.institutions.fullName} IS NULL OR ${schema.institutions.fullName} NOT LIKE ${'%股份有限公司%'})`);
      return rows.map((r: { id: number; name: string; fullName: string | null }) => ({
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
] as any[];

const sanitizeBody = (raw: string): string => {
  if (!raw) return "";
  return raw
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/^rich-text-content"\s+style="[^"]*"\s*>/g, "")
    .replace(/yinmaiquan-keyword/g, "ymq-keyword")
    .replace(/^[\s\n\r]+/, "")
    .trim();
};

export const articleRules: DataRule[] = [
  {
    name: "article_row_count",
    severity: "error",
    check: async () => {
      const [row] = await db.select({ cnt: sql`count(*)::int` }).from(schema.articles);
      const dbCount = row?.cnt || 0;
      const jsonCount = allJsonArticles.length;
      if (dbCount !== jsonCount) {
        return [{ type: "missing_row", table: "articles", expected: String(jsonCount), actual: String(dbCount) }];
      }
      return [];
    },
    repair: async () => {
      const existing = new Set((await db.select({ id: schema.articles.id }).from(schema.articles)).map((r: { id: number }) => r.id));
      const { default: articleDetails } = await import("@/data/articleDetails.json") as any;
      const detailMap = new Map<number, any>();
      if (Array.isArray(articleDetails)) articleDetails.forEach((d: any) => detailMap.set(Number(d.id), d));

      const missing = allJsonArticles.filter((a: any) => !existing.has(a.id));
      for (let i = 0; i < missing.length; i += 50) {
        const batch = missing.slice(i, i + 50).map((a: any) => {
          const detail = detailMap.get(a.id);
          return {
            id: a.id, title: a.title, body: sanitizeBody(detail?.body || a.description || ""),
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
      return rows.map((r: { id: number }) => ({ type: "empty_field", table: "articles", id: r.id, field: "body" }));
    },
    repair: async (issues) => {
      const { default: articleDetails } = await import("@/data/articleDetails.json") as any;
      const detailMap = new Map<number, any>();
      if (Array.isArray(articleDetails)) articleDetails.forEach((d: any) => detailMap.set(Number(d.id), d));

      let fixed = 0;
      for (const issue of issues) {
        if (!issue.id) continue;
        const json = allJsonArticles.find((a: any) => a.id === issue.id);
        const detail = detailMap.get(issue.id);
        const body = sanitizeBody(detail?.body || json?.description || "");
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
      return rows.map((r: { id: number }) => ({ type: "empty_field", table: "articles", id: r.id, field: "date" }));
    },
    repair: async (issues) => {
      let fixed = 0;
      for (const issue of issues) {
        if (!issue.id) continue;
        const json = allJsonArticles.find((a: any) => a.id === issue.id);
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
      return rows.map((r: { id: number; body: string }) => ({ type: "dirty_data", table: "articles", id: r.id, field: "body" }));
    },
    repair: async (issues) => {
      let fixed = 0;
      for (const issue of issues) {
        if (!issue.id) continue;
        const [row] = await db.select({ body: schema.articles.body }).from(schema.articles).where(eq(schema.articles.id, issue.id));
        if (row?.body) {
          const cleaned = sanitizeBody(row.body);
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
      return rows.map((r: { id: number; title: string }) => ({ type: "empty_field", table: "articles", id: r.id, field: "body", actual: "short" }));
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
      return rows.map((r: { id: number }) => ({ type: "empty_field", table: "comments", id: r.id, field: "content" }));
    },
    repair: async () => {
      await db.delete(schema.comments).where(sql`${schema.comments.content} IS NULL OR ${schema.comments.content} = ''`);
      return { fixed: 0, skipped: 0, errors: [] };
    },
  },
];
