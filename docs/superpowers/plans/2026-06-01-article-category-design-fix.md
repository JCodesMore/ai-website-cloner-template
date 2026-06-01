# 文章分类页面设计修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复4个文章分类页面（行业资讯/贷款交流/贷款舆情/常见问题）中与 MASTER.md 设计规范不一致的6处问题

**Architecture:** 这些页面共用 `cates/[id]/articles/page.tsx` + `ArticleCard` 组件。修复集中在3个文件：ArticleCard（颜色+日期）、page.tsx（空状态+分类描述）、globals.css（强调色变量）。TDD：先写测试捕获当前错误行为，再实现修复。

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Vitest

---

## File Structure

| 文件 | 职责 | 改动类型 |
|------|------|----------|
| `src/components/ArticleCard.tsx` | 文章卡片：hover颜色、日期格式 | 修改 |
| `src/app/cates/[id]/articles/page.tsx` | 分类列表页：空状态、分类描述 | 修改 |
| `src/lib/__tests__/article-data.test.ts` | 已存在的测试文件（追加测试） | 修改 |

---

### Task 1: 修复 ArticleCard hover 颜色（蓝色 → 金色）

**Files:**
- Modify: `src/components/ArticleCard.tsx:19`

- [ ] **Step 1: 确认当前代码使用了错误的颜色**

当前代码第19行：
```tsx
<h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">{article.title}</h3>
```

`group-hover:text-blue-600` 违反 MASTER.md 规则："禁用蓝色作为主强调色"，应使用 `yellow-600`（金色 `#CA8A04`）。

- [ ] **Step 2: 修改为金色 hover**

```tsx
<h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-yellow-600 transition-colors duration-200">{article.title}</h3>
```

- [ ] **Step 3: 验证修改**

运行: `npx tsc --noEmit --pretty 2>&1 | grep -E "error TS" | grep -v "gstack/" | head -5`
预期: 无输出（无类型错误）

- [ ] **Step 4: 用 Playwright 确认 hover 颜色**

运行:
```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/cates/91/articles', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  const hoverClass = await page.evaluate(() => {
    const h3 = document.querySelector('.space-y-3 > a:first-child h3');
    return h3?.className;
  });
  console.log('hover class:', hoverClass?.includes('yellow-600') ? 'PASS - gold' : 'FAIL - not gold');
  await browser.close();
})();
"
```
预期: `PASS - gold`

- [ ] **Step 5: Commit**

```bash
git add src/components/ArticleCard.tsx
git commit -m "fix: replace blue hover with gold accent on ArticleCard — aligns with MASTER.md color rules"
```

---

### Task 2: 修复日期显示格式（去掉时分秒）

**Files:**
- Modify: `src/components/ArticleCard.tsx:25`

- [ ] **Step 1: 添加日期格式化函数**

```tsx
function formatDate(raw: string): string {
  if (!raw) return "";
  // "2026-05-27 07:19:03" → "2026-05-27"
  return raw.split(" ")[0] || raw;
}
```

- [ ] **Step 2: 在渲染中使用格式化后的日期**

当前代码第25行：
```tsx
{article.date}
```
改为：
```tsx
{formatDate(article.date)}
```

完整 ArticleCard 组件修改后的关键部分：
```tsx
function formatDate(raw: string): string {
  if (!raw) return "";
  return raw.split(" ")[0] || raw;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={article.href} className="group flex gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md cursor-pointer">
      {article.image && (
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-yellow-600 transition-colors duration-200">{article.title}</h3>
          {article.description && <p className="line-clamp-1 text-sm text-slate-500">{article.description}</p>}
        </div>
        {article.date && (
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            {formatDate(article.date)}
          </div>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: 运行类型检查**

运行: `npx tsc --noEmit --pretty 2>&1 | grep -E "error TS" | grep -v "gstack/" | head -5`
预期: 无输出

- [ ] **Step 4: Playwright 验证日期格式**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/cates/91/articles', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  const date = await page.evaluate(() => {
    const el = document.querySelector('.space-y-3 > a:first-child .text-xs');
    return el?.textContent?.trim();
  });
  console.log('date:', date, '| has time:', date?.includes(':') ? 'FAIL' : 'PASS');
  await browser.close();
})();
"
```
预期: `PASS`（不含时分秒）

- [ ] **Step 5: Commit**

```bash
git add src/components/ArticleCard.tsx
git commit -m "fix: strip time from article date display — show date only, not datetime"
```

---

### Task 3: 添加空状态处理

**Files:**
- Modify: `src/app/cates/[id]/articles/page.tsx`

- [ ] **Step 1: 确认 EmptyState 组件可用**

文件 `src/components/EmptyState.tsx` 已存在，接受 `title`, `description`, `actionHref`, `actionLabel` props。

- [ ] **Step 2: 写入测试（验证空状态逻辑）**

在 `src/lib/__tests__/article-data.test.ts` 追加：

```typescript
import { describe, it, expect } from "vitest";
import { getArticlesByCategory } from "@/lib/repository";

describe("Article category edge cases", () => {
  it("returns empty array for non-existent category", async () => {
    // Category 999 does not exist — should return empty array, not throw
    const articles = await getArticlesByCategory(999);
    expect(articles).toEqual([]);
  });

  it("returns articles for valid category 91", async () => {
    const articles = await getArticlesByCategory(91);
    expect(articles.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

运行: `npx vitest run src/lib/__tests__/article-data.test.ts -t "non-existent" --reporter=verbose`
预期: FAIL（如果 category 999 抛错）或 PASS（如果返回空数组）—— 无论哪种，确认行为后再继续

- [ ] **Step 4: 修改 page.tsx 添加空状态**

```tsx
import EmptyState from "@/components/EmptyState";
```

在 `cates/[id]/articles/page.tsx` 中，articles 列表渲染之前添加空状态检查：

```tsx
{articles.length === 0 ? (
  <EmptyState
    title="暂无文章"
    description="该分类下还没有文章，请稍后再来"
    actionHref="/"
    actionLabel="返回首页"
  />
) : (
  <>
    <p className="mb-4 text-sm text-slate-500">{meta.title} — 共 {articles.length} 篇</p>
    <div className="space-y-3">
      {items.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  </>
)}
```

完整 page.tsx 修改后（return 部分）：
```tsx
return (
  <>
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
        <Link href="/" className="hover:text-yellow-600 transition-colors duration-200">首页</Link>
        <span className="mx-2">/</span>
        <span>{meta.title}</span>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          {articles.length === 0 ? (
            <EmptyState
              title="暂无文章"
              description="该分类下还没有文章，请稍后再来"
              actionHref="/"
              actionLabel="返回首页"
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-500">{meta.title} — 共 {articles.length} 篇</p>
              <div className="space-y-3">
                {items.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={`/cates/${categoryId}/articles`} />
              )}
            </>
          )}
        </div>
        <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
      </div>
    </div>
  </>
);
```

- [ ] **Step 5: 验证编译**

运行: `npx tsc --noEmit --pretty 2>&1 | grep -i "article\|cates\|error TS" | grep -v "gstack/" | head -10`
预期: 无输出

- [ ] **Step 6: Commit**

```bash
git add src/app/cates/[id]/articles/page.tsx src/lib/__tests__/article-data.test.ts
git commit -m "feat: add empty state for article category pages with zero articles"
```

---

### Task 4: 展示分类描述文字

**Files:**
- Modify: `src/app/cates/[id]/articles/page.tsx`

- [ ] **Step 1: 在当前页面添加描述文字**

在 `page.tsx` 的标题下方添加分类描述，使用 `meta.description`：

```tsx
<div className="mb-6">
  <h2 className="text-xl font-bold text-slate-900">{meta.title}</h2>
  <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
</div>
```

当前代码中 `categoryMeta` 已定义：
```typescript
const categoryMeta: Record<number, { title: string; description: string }> = {
  91: { title: "行业资讯", description: "汇聚贷款行业最新资讯" },
  14: { title: "贷款交流", description: "贷款产品口碑信息实时交流" },
  80: { title: "贷款舆情", description: "及时汇总发布各贷款产品的最新舆情反馈" },
  1:  { title: "常见问题", description: "汇总聚合各贷款产品的常见问题" },
};
```

- [ ] **Step 2: 完整修改后的页面结构**

```tsx
return (
  <>
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
        <Link href="/" className="hover:text-yellow-600 transition-colors duration-200">首页</Link>
        <span className="mx-2">/</span>
        <span>{meta.title}</span>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">{meta.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
          </div>

          {articles.length === 0 ? (
            <EmptyState ... />
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-500">共 {articles.length} 篇</p>
              <div className="space-y-3">
                {items.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination ... />
              )}
            </>
          )}
        </div>
        <Sidebar ... />
      </div>
    </div>
  </>
);
```

- [ ] **Step 3: 验证编译 + Playwright 确认描述显示**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/cates/91/articles', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  const desc = await page.evaluate(() => {
    const h2 = document.querySelector('h2');
    const p = h2?.nextElementSibling;
    return { title: h2?.textContent, desc: p?.textContent };
  });
  console.log(JSON.stringify(desc));
  await browser.close();
})();
"
```
预期: `{"title":"行业资讯","desc":"汇聚贷款行业最新资讯"}`

- [ ] **Step 4: Commit**

```bash
git add src/app/cates/[id]/articles/page.tsx
git commit -m "feat: show category description below title on article listing pages"
```

---

### Task 5: 移除面包屑中残留的蓝色 hover

**Files:**
- Modify: `src/app/cates/[id]/articles/page.tsx:27`

- [ ] **Step 1: 修改面包屑链接颜色**

当前：`hover:text-blue-600` → 改为：`hover:text-yellow-600`

```tsx
<Link href="/" className="hover:text-yellow-600 transition-colors duration-200">首页</Link>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/cates/[id]/articles/page.tsx
git commit -m "fix: change breadcrumb hover color from blue to gold accent"
```

---

### Task 6: 最终验证 — 全部4个页面回归测试

- [ ] **Step 1: 运行所有测试**

```bash
npx vitest run src/lib/__tests__/article-data.test.ts --reporter=verbose
```
预期: 全部 PASS

- [ ] **Step 2: Playwright 验证全部4个页面**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const categories = [
    { id: 91, name: '行业资讯', desc: '汇聚贷款行业最新资讯' },
    { id: 14, name: '贷款交流', desc: '贷款产品口碑信息实时交流' },
    { id: 80, name: '贷款舆情', desc: '及时汇总发布各贷款产品的最新舆情反馈' },
    { id: 1,  name: '常见问题', desc: '汇总聚合各贷款产品的常见问题' },
  ];
  for (const cat of categories) {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/cates/' + cat.id + '/articles', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      const p = h2?.nextElementSibling;
      const hoverClasses = document.querySelector('h3')?.className || '';
      const date = document.querySelector('.text-xs')?.textContent?.trim() || '';
      const countEl = document.body.innerText.match(/共 \d+ 篇/);
      return {
        title: h2?.textContent,
        desc: p?.textContent,
        hoverGold: hoverClasses.includes('yellow-600'),
        dateNoTime: !date.includes(':'),
        hasCount: !!countEl
      };
    });
    const status = info.title === cat.name && info.desc === cat.desc && info.hoverGold && info.dateNoTime && info.hasCount;
    console.log((status ? 'PASS' : 'FAIL') + ' - ' + cat.name + ':', JSON.stringify(info));
    await page.close();
  }
  await browser.close();
})();
"
```
预期: 全部 PASS

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: final verification — all 4 article category pages pass design checks"
```
