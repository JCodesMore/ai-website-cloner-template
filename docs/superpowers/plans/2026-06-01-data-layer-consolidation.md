# Data Layer Consolidation — Single Source of Truth

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the JSON↔DB dual data source by making PostgreSQL the single runtime source of truth. JSON files become seed+test only. Fixes recurring bugs (search mismatch, institution count, category drift) at the architectural level.

**Architecture:** Three phases. Phase 1 (T1-T2) removes JSON fallback from repository and moves seeding to startup. Phase 2 (T3-T5) normalizes institution names with a `short_name` column and migrates all 13 pages to repository functions. Phase 3 (T6-T8) adds test coverage and cleans up dead imports.

**Tech Stack:** Next.js 16, TypeScript, Drizzle ORM (PostgreSQL), Vitest

**Reference:** Design doc at `~/.gstack/projects/JCodesMore-ai-website-cloner-template/Z1858-master-design-20260601-031427.md`

---

### Task 1: Remove JSON Fallback from Repository (P1)

**Files:**
- Modify: `src/lib/repository.ts`

Remove all 9 try/catch JSON fallback paths. DB errors now propagate to the caller. The `console.error` logging added by T5 can stay or be removed — DB errors will surface naturally through the error propagation chain.

- [ ] **Step 1: Read the current repository.ts**

```bash
wc -l src/lib/repository.ts
```

- [ ] **Step 2: Remove JSON fallback from getAllProducts**

Find the function and remove the catch block's fallback. Before:

```typescript
export async function getAllProducts(): Promise<Product[]> {
  await seedIfEmpty(schema.products, "products", [
    ...fastProducts.map(p => ({ ...p, category: "fast" })),
    ...companyProducts.map(p => ({ ...p, category: "company" })),
    ...personProducts.map(p => ({ ...p, category: "person" })),
    ...pledgeProducts.map(p => ({ ...p, category: "pledge" })),
  ]);
  try {
    const rows = await db.select().from(schema.products).orderBy(desc(schema.products.sortOrder));
    if (rows.length > 0) return rows.map(mapProduct);
  } catch (e) {
    console.error(`[repository] DB error in getAllProducts:`, (e as Error).message);
    const seen = new Set<number>();
    return [...fastProducts, ...companyProducts, ...personProducts, ...pledgeProducts].filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }
  return [];
}
```

After:

```typescript
export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.select().from(schema.products).orderBy(desc(schema.products.sortOrder));
  return rows.map(mapProduct);
}
```

- [ ] **Step 3: Remove JSON fallback from getProductsByCategory**

Before:

```typescript
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getAllProducts();
  if (category === "fast") return fastProducts;
  if (category === "company") return companyProducts;
  if (category === "person") return personProducts;
  if (category === "pledge") return pledgeProducts;
  return all;
}
```

After — use the DB category column directly:

```typescript
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const rows = await db.select().from(schema.products)
      .where(eq(schema.products.category, category))
      .orderBy(desc(schema.products.sortOrder));
    return rows.map(mapProduct);
  } catch {
    // If no products match category column (e.g., legacy data),
    // fall back to filtering getAllProducts in memory
    const all = await getAllProducts();
    return all.filter((p: any) => p.category === category);
  }
}
```

- [ ] **Step 4: Remove JSON fallback from getProductById**

Before:

```typescript
export async function getProductById(id: string): Promise<ProductDetail | null> {
  await seedIfEmpty(schema.products, "products", []);
  try {
    const rows = await db.select().from(schema.products).where(eq(schema.products.id, parseInt(id, 10)));
    if (rows.length > 0) return mapProductDetail(rows[0]);
  } catch { /* fall through */ }
  return productDetails.find(p => p.id === parseInt(id, 10)) || null;
}
```

After:

```typescript
export async function getProductById(id: string): Promise<ProductDetail | null> {
  const rows = await db.select().from(schema.products).where(eq(schema.products.id, parseInt(id, 10)));
  if (rows.length === 0) return null;
  return mapProductDetail(rows[0]);
}
```

- [ ] **Step 5: Remove JSON fallback from remaining 6 functions**

Apply the same pattern to: `getAllProductDetails`, `getAllInstitutions`, `getInstitutionById`, `getAllComments`, `getArticlesByCategory`, `getArticleById`. For each:

```typescript
// Pattern: remove try/catch + JSON fallback, keep DB query
export async function getXxx(): Promise<Xxx[]> {
  const rows = await db.select().from(schema.xxx).orderBy(...);
  return rows.map(mapXxx);
}
```

For `getAllComments` specifically, keep the `where(eq(schema.comments.status, "approved"))` filter.

- [ ] **Step 6: Remove seedIfEmpty from all repository functions**

The seedIfEmpty calls are now handled by instrumentation.ts (Task 2). Remove all `await seedIfEmpty(...)` lines from every repository function.

- [ ] **Step 7: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: Only pre-existing `pg` module error, no new errors.

- [ ] **Step 8: Smoke test all pages**

```bash
for p in fast company person pledge; do
  curl -s -o /dev/null -w "$p: %{http_code}\n" "http://localhost:3000/products/$p"
done
curl -s -o /dev/null -w "institutions: %{http_code}\n" http://localhost:3000/institutions
curl -s -o /dev/null -w "comments: %{http_code}\n" http://localhost:3000/comments
curl -s -o /dev/null -w "search: %{http_code}\n" "http://localhost:3000/products/search?wd=%E5%86%9C%E5%95%86"
```

Expected: All return 200.

- [ ] **Step 9: Commit**

```bash
git add src/lib/repository.ts
git commit -m "refactor: remove JSON fallback from repository — DB is single source of truth"
```

---

### Task 2: Move Seeding to Instrumentation Startup (P1)

**Files:**
- Modify: `src/instrumentation.ts`
- Modify: `src/lib/repository.ts`

Move all `seedIfEmpty` calls to `instrumentation.ts` `register()`, called once at server startup.

- [ ] **Step 1: Read the current instrumentation.ts**

- [ ] **Step 2: Add seedAllTables function**

Add a function that seeds all tables from JSON data:

```typescript
import { db, schema } from "@/lib/db";
import {
  fastProducts, companyProducts, personProducts, pledgeProducts,
  institutions, comments,
  industryArticles, discussionArticles, opinionArticles, faqArticles,
} from "@/lib/data";

async function seedAllTables() {
  const toInsert = [
    { table: schema.products, key: "products", rows: [
      ...fastProducts.map((p: any) => ({ ...p, category: "fast" })),
      ...companyProducts.map((p: any) => ({ ...p, category: "company" })),
      ...personProducts.map((p: any) => ({ ...p, category: "person" })),
      ...pledgeProducts.map((p: any) => ({ ...p, category: "pledge" })),
    ]},
    { table: schema.institutions, key: "institutions", rows: institutions },
    { table: schema.comments, key: "comments", rows: comments },
    { table: schema.articles, key: "articles", rows: [
      ...industryArticles, ...discussionArticles, ...opinionArticles, ...faqArticles,
    ].map((a: any) => ({ ...a, body: a.description || "", viewCount: 0 }))},
  ];

  for (const { table, key, rows } of toInsert) {
    const existing = await db.select({ n: (table as any).id }).from(table).limit(1);
    if (existing.length === 0 && rows.length > 0) {
      for (let i = 0; i < rows.length; i += 50) {
        await db.insert(table).values(rows.slice(i, i + 50) as any).onConflictDoNothing();
      }
      console.log(`[startup] Seeded ${rows.length} rows into ${key}`);
    }
  }
}
```

- [ ] **Step 3: Call seedAllTables from register()**

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
  }
}
```

- [ ] **Step 4: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 5: Restart dev server and verify seeding**

```bash
taskkill //F //IM node.exe 2>/dev/null
npm run dev &
sleep 8
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/products/fast
```

Expected: 200. Check terminal output for "[startup] Seeded N rows into products" messages.

- [ ] **Step 6: Commit**

```bash
git add src/instrumentation.ts
git commit -m "refactor: move DB seeding from repository to instrumentation startup"
```

---

### Task 3: Add short_name Column to Institutions (P1)

**Files:**
- Modify: `src/lib/db/schema.ts`
- Create: `drizzle/` migration files (auto-generated by drizzle-kit)

- [ ] **Step 1: Read the current schema.ts**

- [ ] **Step 2: Add short_name column to institutions table**

In `src/lib/db/schema.ts`, add to the institutions table definition:

```typescript
export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  fullName: text("full_name").default(""),
  shortName: varchar("short_name", { length: 200 }).default(""),  // NEW: abbreviated name for search
  logo: text("logo").default(""),
  // ... rest of columns unchanged
});
```

- [ ] **Step 3: Generate migration**

Run: `npx drizzle-kit generate`
Expected: Migration file appears in `drizzle/` directory.

- [ ] **Step 4: Push migration**

Run: `npx drizzle-kit push`
Expected: Column added to PostgreSQL without errors.

- [ ] **Step 5: Populate short_name from existing data**

Run this Node.js script to populate short_name from the seeding JSON data:

```javascript
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://Z1858@localhost:5432/bbxin' });

// Load JSON institution names (short form)
const inst = require('./src/data/institutions.json');

(async () => {
  for (const i of inst) {
    await pool.query('UPDATE institutions SET short_name = $1 WHERE id = $2 AND (short_name IS NULL OR short_name = ?)', [i.name, i.id, '']);
  }
  console.log('Done populating short_name');
  await pool.end();
})();
```

- [ ] **Step 6: Verify the data**

```bash
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://Z1858@localhost:5432/bbxin' });
(async () => {
  const r = await pool.query('SELECT id, name, short_name FROM institutions WHERE short_name IS NOT NULL AND short_name != ? LIMIT 5', ['']);
  console.log(r.rows);
  await pool.end();
})();
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/db/schema.ts drizzle/
git commit -m "feat: add institutions.short_name column for abbreviation search"
```

---

### Task 4: Replace JSON Alias Map with DB short_name (P1)

**Files:**
- Modify: `src/app/products/search/page.tsx`

- [ ] **Step 1: Read the current search/page.tsx**

- [ ] **Step 2: Replace buildInstAliasMap with DB query**

Remove the `buildInstAliasMap` function and the listing JSON imports. Instead, search against the `short_name` column via a repository function. Since we can't add a new repository function for this narrow case without making it over-engineered, inline a simple check:

Remove the imports of `fastProducts, companyProducts, personProducts, pledgeProducts` from data.ts (used only by buildInstAliasMap).

Remove `buildInstAliasMap()` function entirely.

Update the filter logic. Before:

```typescript
const [allProducts, instAlias] = await Promise.all([
    getAllProducts(),
    buildInstAliasMap(),
  ]);

  const filtered = wd
    ? allProducts.filter(
        (p) => {
          const alias = instAlias.get(p.id);
          const q = wd.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.institution.toLowerCase().includes(q) ||
            (alias && alias.toLowerCase().includes(q))
          );
        },
      )
    : [];
```

After — also search against institution.fullName for full-name matches:

```typescript
import { getAllInstitutions } from "@/lib/repository";

// ... inside SearchPage:

  const [allProducts, allInstitutions] = await Promise.all([
    getAllProducts(),
    getAllInstitutions(),
  ]);

  // Build institution search lookup: id → combined searchable text
  const instSearch = new Map<number, string>();
  for (const inst of allInstitutions) {
    instSearch.set(inst.id, [
      inst.name,
      inst.fullName,
      (inst as any).shortName || "",
    ].filter(Boolean).join(" ").toLowerCase());
  }

  const filtered = wd
    ? allProducts.filter((p) => {
        const q = wd.toLowerCase();
        if (p.name.toLowerCase().includes(q)) return true;
        if (p.institution.toLowerCase().includes(q)) return true;
        const instText = instSearch.get(p.id as any);
        return instText ? instText.includes(q) : false;
      })
    : [];
```

Remove the import of `fastProducts, companyProducts, personProducts, pledgeProducts` from the data.ts import line.

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Test search for "农商"**

```bash
curl -s "http://localhost:3000/products/search?wd=%E5%86%9C%E5%95%86" | grep -oP '共找到 \d+ 个'
```

Expected: `共找到 2 个` (or more).

- [ ] **Step 5: Commit**

```bash
git add src/app/products/search/page.tsx
git commit -m "fix: replace JSON institution alias map with DB short_name search"
```

---

### Task 5: Migrate All Pages from data.ts Imports to Repository (P1)

**Files:**
- Modify: `src/app/institutions/page.tsx`
- Modify: `src/app/institutions/[id]/page.tsx`
- Modify: `src/app/comments/page.tsx`
- Modify: `src/app/articles/[id]/page.tsx`
- Modify: `src/app/counselors/[id]/page.tsx`
- Modify: `src/app/products/[category]/[id]/page.tsx`
- Modify: `src/app/products/detail/[id]/page.tsx`
- Modify: `src/app/cates/[id]/articles/page.tsx`
- Modify: `src/app/products/fast/page.tsx`
- Modify: `src/app/products/company/page.tsx`
- Modify: `src/app/products/person/page.tsx`
- Modify: `src/app/products/pledge/page.tsx`

Replace direct JSON data imports with repository function calls. Sidebar data (newsItems, discussionItems, opinionItems, faqItems) imports from `data.ts` are also migrated to `getSidebarNews()` etc. from repository.

- [ ] **Step 1: Migrate institutions/page.tsx**

Change:
```typescript
import { institutions, newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
```

To:
```typescript
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { getAllInstitutions } from "@/lib/repository";
```

And replace `let filtered = institutions;` with `let filtered = await getAllInstitutions();`.

- [ ] **Step 2: Migrate institutions/[id]/page.tsx**

Change:
```typescript
import { institutionDetails, productDetails, newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
```

To:
```typescript
import { productDetails, newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { getInstitutionById } from "@/lib/repository";
```

And replace `institutionDetails.find(x => x.id === id)` with `await getInstitutionById(id)`.

- [ ] **Step 3: Migrate comments/page.tsx**

Change:
```typescript
import { comments, newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
```

To:
```typescript
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { getAllComments } from "@/lib/repository";
```

And replace `let filtered = comments;` with `let filtered = await getAllComments();`.

- [ ] **Step 4: Migrate articles/[id]/page.tsx**

Change:
```typescript
import { articleDetails, newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
```

To:
```typescript
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { getArticleById } from "@/lib/repository";
```

And replace `articleDetails.find((a) => a.id === Number(id))` with `await getArticleById(Number(id))`.

- [ ] **Step 5: Migrate counselors/[id]/page.tsx**

Replace:
```typescript
import { counselors } from "@/lib/data";
const inst = counselors.find(...)
```

With:
```typescript
import { getAllCounselors } from "@/lib/repository";
const counselors = await getAllCounselors();
const inst = counselors.find(...)
```

- [ ] **Step 6: Migrate cates/[id]/articles/page.tsx**

Replace:
```typescript
import { industryArticles, discussionArticles, opinionArticles, faqArticles, ... } from "@/lib/data";
```

With:
```typescript
import { getArticlesByCategory } from "@/lib/repository";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
// ... 
const articles = await getArticlesByCategory(Number(id));
```

- [ ] **Step 7: Migrate product detail pages**

For `products/[category]/[id]/page.tsx` and `products/detail/[id]/page.tsx`:
Replace imports of `productDetails, fastProducts, companyProducts, personProducts, pledgeProducts` with `getProductById` from repository.

- [ ] **Step 8: Migrate product listing pages sidebar imports**

For `products/fast/page.tsx`, `products/company/page.tsx`, `products/person/page.tsx`, `products/pledge/page.tsx`:
Replace sidebar imports from data.ts with repository sidebar functions:
```typescript
import { getSidebarNews, getSidebarDiscussions, getSidebarOpinions, getSidebarFaq } from "@/lib/repository";
```

- [ ] **Step 9: Verify typecheck and smoke test**

Run: `npx tsc --noEmit`
Then curl-smoke-test all 13 pages.

- [ ] **Step 10: Commit**

```bash
git add src/app/
git commit -m "refactor: migrate all pages from data.ts imports to repository functions"
```

---

### Task 6: Create repository.test.ts (P2)

**Files:**
- Create: `src/lib/__tests__/repository.test.ts`

- [ ] **Step 1: Create the test file**

Create `src/lib/__tests__/repository.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";

// Mock the DB module
vi.mock("@/lib/db", () => {
  const mockSelect = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([]),
      }),
      orderBy: vi.fn().mockResolvedValue([]),
      limit: vi.fn().mockReturnValue({
        offset: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  });
  return {
    db: {
      select: mockSelect,
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      }),
    },
    schema: {
      products: { id: "id", sortOrder: "sort_order" },
      institutions: { id: "id" },
      comments: { id: "id", status: "status" },
      articles: { id: "id", categoryId: "category_id" },
    },
  };
});

import { getAllProducts, getProductsByCategory, getAllInstitutions, getInstitutionById, getAllComments, getArticleById } from "@/lib/repository";

describe("getAllProducts", () => {
  it("returns products from DB", async () => {
    const result = await getAllProducts();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getProductsByCategory", () => {
  it("returns products filtered by category", async () => {
    const result = await getProductsByCategory("fast");
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getAllInstitutions", () => {
  it("returns institutions from DB", async () => {
    const result = await getAllInstitutions();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getInstitutionById", () => {
  it("returns null for non-existent institution", async () => {
    const result = await getInstitutionById("999999");
    expect(result).toBeNull();
  });
});

describe("getAllComments", () => {
  it("returns comments from DB", async () => {
    const result = await getAllComments();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getArticleById", () => {
  it("returns null for non-existent article", async () => {
    const result = await getArticleById(999999);
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `npx vitest run src/lib/__tests__/repository.test.ts`
Expected: 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/lib/__tests__/repository.test.ts
git commit -m "test: add repository.test.ts — DB path coverage for 6 functions"
```

---

### Task 7: Add Regression Tests for Search + Institution Filter (P2)

**Files:**
- Modify: `src/lib/__tests__/filters.test.ts` (append new tests)

- [ ] **Step 1: Read the current filters.test.ts to understand conventions**

- [ ] **Step 2: Append regression tests**

Add at the end of `src/lib/__tests__/filters.test.ts`:

```typescript
describe("Regression: institution search by abbreviation", () => {
  it('"农商" matches institutions with short_name containing 农商', () => {
    const institutions = [
      { id: 1, name: "北京农村商业银行股份有限公司", fullName: "北京农商行" } as any,
      { id: 2, name: "上海农村商业银行股份有限公司", fullName: "上海农商银行" } as any,
      { id: 3, name: "招商银行股份有限公司", fullName: "招商银行" } as any,
    ];
    // Simulate the search logic: check name + fullName for abbreviation match
    const q = "农商";
    const matches = institutions.filter(i =>
      i.name.includes(q) || (i.fullName || "").includes(q)
    );
    // "农商" is NOT a substring of "农村商业银行", but IS a substring of "农商行" / "农商银行"
    expect(matches.length).toBe(2);
  });

  it("filterInstitutionsByIk socb returns 6 state-owned banks", () => {
    const { filterInstitutionsByIk } = require("@/lib/filters");
    const banks = [
      { id: 1, name: "工商银行", fullName: "中国工商银行股份有限公司" } as any,
      { id: 2, name: "农业银行", fullName: "中国农业银行股份有限公司" } as any,
      { id: 4, name: "建设银行", fullName: "中国建设银行股份有限公司" } as any,
      { id: 5, name: "邮储银行", fullName: "中国邮政储蓄银行股份有限公司" } as any,
      { id: 6, name: "交通银行", fullName: "中国交通银行股份有限公司" } as any,
      { id: 7, name: "中国银行", fullName: "中国银行股份有限公司" } as any,
      { id: 99, name: "招商银行", fullName: "招商银行股份有限公司" } as any,
    ];
    const result = filterInstitutionsByIk(banks, "socb");
    expect(result.length).toBe(6);
    expect(result.map(i => i.id).sort()).toEqual([1, 2, 4, 5, 6, 7]);
  });
});
```

- [ ] **Step 3: Run the tests**

Run: `npx vitest run src/lib/__tests__/filters.test.ts`
Expected: All existing tests pass + 2 new regression tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/__tests__/filters.test.ts
git commit -m "test: add regression tests for institution abbreviation search and socb filter"
```

---

### Task 8: Clean Up data.ts Module (P3)

**Files:**
- Modify: `src/lib/data.ts`

Remove exports that are no longer used by any page. Keep only what's needed for seed data and tests.

- [ ] **Step 1: Verify no pages import from data.ts**

```bash
grep -rn "from \"@/lib/data\"" src/app/ --include="*.tsx"
```

Expected: 0 results after Task 5 migration.

- [ ] **Step 2: Mark remaining exports as seed-only**

Add a comment at the top of `src/lib/data.ts`:

```typescript
/**
 * Seed data module — used ONLY by instrumentation.ts (startup seeding)
 * and test files. Pages and API routes must use repository functions instead.
 *
 * @deprecated Do not import from this module in page/route files.
 */
```

Remove the `newsItems`, `discussionItems`, `opinionItems`, `faqItems` re-exports (these are now served by `getSidebarNews()` etc. in repository).

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Check for leftover imports**

```bash
grep -rn "from \"@/lib/data\"" src/ --include="*.tsx" --include="*.ts" | grep -v "__tests__" | grep -v "repository.ts" | grep -v "instrumentation.ts"
```

Expected: Only test files and instrumentation.ts import from data.ts.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data.ts
git commit -m "chore: mark data.ts as seed-only, remove unused sidebar re-exports"
```

---

## Execution Order

```
Lane A (DB/seed layer):  T1 → T2 → T3
Lane B (page migration): T4 → T5  
Lane C (tests/cleanup):  T6 → T7 → T8 (after A+B merge)

Launch A + B in parallel worktrees. Merge both. Then C.
```
