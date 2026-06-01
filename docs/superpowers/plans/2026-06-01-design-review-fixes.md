# Design Review Fixes — UI/UX Improvements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 6 design improvements from the /plan-design-review: trust signals, empty states, institution-first card hierarchy, responsive focus states, and a reusable EmptyState component.

**Architecture:** Six independent UI fixes touching Banner, ProductCard, search page, globals.css, and a new EmptyState component. T1-T5 are P1 (trust + a11y). T6 is P2 (reusable component). All files are independent — no shared state.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, React 19

---

### Task 1: Add Value Proposition Subtitle to Banner (P1)

**Files:**
- Modify: `src/components/Banner.tsx`

- [ ] **Step 1: Read the current Banner.tsx**

- [ ] **Step 2: Add value proposition text below the product count**

In `src/components/Banner.tsx`, add a subtitle line below the product count paragraph. Change:

```tsx
<p className="text-lg text-slate-300 md:text-xl">
  已收录全网{" "}
  <strong className="text-3xl font-bold text-white md:text-4xl">
    {productCount.toLocaleString()}
  </strong>{" "}
  个贷款产品
</p>
```

To:

```tsx
<p className="text-lg text-slate-300 md:text-xl">
  已收录全网{" "}
  <strong className="text-3xl font-bold text-white md:text-4xl">
    {productCount.toLocaleString()}
  </strong>{" "}
  个贷款产品
</p>
<p className="mt-2 text-sm text-slate-400">
  用数据说话，用口碑导航 — 找贷款先查银脉圈
</p>
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Verify the page renders correctly**

```bash
curl -s http://localhost:3000/products/fast | grep -o "用数据说话，用口碑导航"
```

Expected: The text appears in the output.

- [ ] **Step 5: Commit**

```bash
git add src/components/Banner.tsx
git commit -m "feat: add value proposition subtitle to Banner"
```

---

### Task 2: Add Action Guidance to Empty Search Results (P1)

**Files:**
- Modify: `src/app/products/search/page.tsx`

- [ ] **Step 1: Read the current search page**

- [ ] **Step 2: Add action links to empty/no-query states**

In `src/app/products/search/page.tsx`, find the empty state rendering. Change the two empty state messages:

For no search query:
```tsx
{!wd && <p className="py-10 text-center text-slate-400">请在搜索框中输入产品名称或机构名称</p>}
```

For no results:
```tsx
{wd && filtered.length === 0 && (
  <div className="py-10 text-center">
    <p className="text-slate-400">未找到与"{wd}"相关的产品，请尝试其他关键词</p>
    <a href="/products/fast" className="mt-3 inline-block text-sm text-yellow-600 hover:underline">
      浏览全部产品
    </a>
  </div>
)}
```

The `!wd` case stays as-is (it guides the user to enter a search term).

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Test empty search**

```bash
curl -s "http://localhost:3000/products/search?wd=不存在的产品" | grep -o "浏览全部产品"
```

Expected: "浏览全部产品" appears in output.

- [ ] **Step 5: Commit**

```bash
git add src/app/products/search/page.tsx
git commit -m "feat: add browse-all link to empty search results"
```

---

### Task 3: Replace Product Count with Comment Trust Signal in Banner (P1)

**Files:**
- Modify: `src/components/Banner.tsx`

- [ ] **Step 1: Read the current Banner.tsx (modified in T1)**

- [ ] **Step 2: Add comment count as a trust signal**

In `src/components/Banner.tsx`, add a `commentCount` prop and display it. Change the interface and component:

```tsx
interface BannerProps {
  productCount?: number;
  commentCount?: number;
}

export default function Banner({ productCount = 816, commentCount = 0 }: BannerProps) {
  // ... existing state and handler ...

  return (
    <section className="bg-slate-900 py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-lg text-slate-300 md:text-xl">
          已收录全网{" "}
          <strong className="text-3xl font-bold text-white md:text-4xl">
            {productCount.toLocaleString()}
          </strong>{" "}
          个贷款产品
          {commentCount > 0 && (
            <span className="text-slate-400">
              ，基于{" "}
              <strong className="font-semibold text-amber-400">
                {commentCount.toLocaleString()}
              </strong>{" "}
              条真实用户评论
            </span>
          )}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          用数据说话，用口碑导航 — 找贷款先查银脉圈
        </p>
        {/* ... existing search form ... */}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update ProductListPage to pass commentCount**

In `src/components/ProductListPage.tsx`, import comments data and pass the count:

Add to the top of the component:
```typescript
import { comments } from "@/lib/data";
```

And in the Banner call:
```tsx
<Banner commentCount={comments.length} />
```

- [ ] **Step 4: Verify typecheck and rendering**

Run: `npx tsc --noEmit`
```bash
curl -s http://localhost:3000/products/fast | grep -o "条真实用户评论"
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Banner.tsx src/components/ProductListPage.tsx
git commit -m "feat: add comment count trust signal to Banner"
```

---

### Task 4: Institution-First Card Hierarchy (P1)

**Files:**
- Modify: `src/components/ProductCard.tsx`

- [ ] **Step 1: Read the current ProductCard.tsx**

- [ ] **Step 2: Move institution name before product name in the card header**

Change the card header structure. Before:

```tsx
<div className="mb-3 flex items-center gap-3">
  <img src={product.image} alt={product.name} className="h-10 w-10 shrink-0 rounded-lg border border-slate-100 object-cover" />
  <h3 className="truncate text-base font-semibold text-slate-900 transition-colors duration-200 group-hover:text-yellow-600" title={product.name}>
    {product.name}
  </h3>
</div>

<div className="mb-3 flex items-center gap-3 text-sm text-slate-500">
  <span>评：<strong className="text-slate-700">{product.commentCount}</strong></span>
  <span>机构：{product.institution}</span>
</div>
```

After — institution first, product name as subtitle:

```tsx
<div className="mb-3 flex items-center gap-3">
  <img src={product.image} alt={product.name} className="h-10 w-10 shrink-0 rounded-lg border border-slate-100 object-cover" />
  <div className="min-w-0">
    <div className="text-sm font-medium text-slate-500">{product.institution}</div>
    <h3 className="truncate text-base font-semibold text-slate-900 transition-colors duration-200 group-hover:text-yellow-600" title={product.name}>
      {product.name}
    </h3>
  </div>
</div>
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Verify rendering**

```bash
curl -s http://localhost:3000/products/fast | grep -c "text-sm font-medium text-slate-500"
```

Expected: > 0 (institution names rendered with the new class).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: institution-first hierarchy on product cards — bank name before product name"
```

---

### Task 5: Global Focus-Visible Styles (P1)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Read globals.css to find the right insertion point**

- [ ] **Step 2: Add focus-visible styles at the end of the @layer base block**

In `src/app/globals.css`, find the `@layer base { ... }` block and add inside it:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  /* Keyboard focus indicator — visible ring for all interactive elements */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-yellow-600 rounded-sm;
  }
}
```

- [ ] **Step 3: Verify typecheck (no TS impact, but verify build)**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add global focus-visible styles for keyboard navigation accessibility"
```

---

### Task 6: Create Reusable EmptyState Component (P2)

**Files:**
- Create: `src/components/EmptyState.tsx`
- Modify: `src/app/products/search/page.tsx`

- [ ] **Step 1: Create the EmptyState component**

Create `src/components/EmptyState.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-slate-300">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-slate-700">{title}</h3>
      {description && <p className="mb-4 max-w-md text-sm text-slate-400">{description}</p>}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="rounded-lg bg-yellow-600 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Use EmptyState in search page**

In `src/app/products/search/page.tsx`, replace the empty state messages:

Add import:
```typescript
import EmptyState from "@/components/EmptyState";
import { Search } from "lucide-react";
```

Replace the two empty state branches:

For no query:
```tsx
{!wd && <EmptyState icon={<Search className="h-10 w-10" />} title="请输入搜索关键词" description="搜索产品名称或机构名称，查找贷款产品" />}
```

For no results:
```tsx
{wd && filtered.length === 0 && (
  <EmptyState
    icon={<Search className="h-10 w-10" />}
    title={`未找到与"${wd}"相关的产品`}
    description="请尝试其他关键词"
    actionHref="/products/fast"
    actionLabel="浏览全部产品"
  />
)}
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/EmptyState.tsx src/app/products/search/page.tsx
git commit -m "feat: create reusable EmptyState component, apply to search page"
```

---

## Execution Order

All 6 tasks touch independent files — parallel execution safe:

```
Lane A: T1 → T3 (shared Banner.tsx)
Lane B: T2 → T6 (shared search/page.tsx)
Lane C: T4 (independent ProductCard.tsx)
Lane D: T5 (independent globals.css)

Launch A + B + C + D in parallel. No conflicts.
```
