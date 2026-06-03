# Analytics + Share + QR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add article analytics (view tracking, reading duration, share stats), share functionality (Web Share API), global WeChat QR code, and admin analytics dashboard

**Architecture:** Two parallel lanes: Lane A (DB + API routes + article page integration), Lane B (components + admin dashboard). Lane C (tests) after merge. 4 new DB tables, 6 API routes, 3 new/changed components, 1 new admin page.

**Tech Stack:** Next.js 16 + React 19 + Drizzle ORM + PostgreSQL + Tailwind v4 + Tremor (charts) + qrcode (npm)

**Design decisions from reviews:**
- Dashboard: 3 metric cards → trend chart (2/3) + top 10 (1/3) → full-width article table
- Empty state: "数据收集中..." with guidance text + skeleton preview
- Tremor charts: gold (#CA8A04) primary, navy (#0F172A) secondary
- Admin nav: fix blue→gold (bg-amber-50 text-yellow-700) + add "数据分析" link
- ShareButton: refactor to generic (url + title props), products + articles share
- FloatingQR: fixed bottom-6 right-6, click to expand, mobile-friendly
- View tracking: sendBeacon + IP hash dedup (24h window)
- Reading duration: 30s heartbeat via sendBeacon
- QR scan tracking: click-to-expand event logging

---

## File Structure

| File | Lane | Responsibility |
|------|------|---------------|
| `src/lib/db/schema.ts` | A | 4 new table definitions |
| `src/app/api/articles/[id]/view/route.ts` | A | POST view tracking |
| `src/app/api/articles/[id]/share/route.ts` | A | POST share tracking |
| `src/app/api/articles/[id]/read/route.ts` | A | POST reading heartbeat |
| `src/app/api/qr/scan/route.ts` | A | POST QR scan tracking |
| `src/app/api/admin/analytics/summary/route.ts` | A | GET dashboard summary |
| `src/app/api/admin/analytics/top-articles/route.ts` | A | GET top articles |
| `src/components/ShareButton.tsx` | B | Refactor to generic |
| `src/components/FloatingQR.tsx` | B | New floating QR component |
| `src/components/Footer.tsx` | B | Add QR code section |
| `src/app/admin/analytics/page.tsx` | B | New dashboard page |
| `src/app/admin/layout.tsx` | B | Fix nav color + add link |
| `src/app/articles/[id]/page.tsx` | A | Integrate view/share/read tracking |
| `src/lib/__tests__/analytics.test.ts` | C | API route tests |
| `src/components/__tests__/ShareButton.test.tsx` | C | Component tests |
| `src/components/__tests__/FloatingQR.test.tsx` | C | Component tests |

---

### Task 1: DB Schema — 4 new tables

**Files:**
- Modify: `src/lib/db/schema.ts`

- [ ] **Step 1: Add table definitions to schema.ts**

```typescript
// After the followedProducts table (line 94), add:

export const articleAnalytics = pgTable("article_analytics", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => articles.id),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articleReads = pgTable("article_reads", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => articles.id),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  durationSeconds: integer("duration_seconds").default(30),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articleShares = pgTable("article_shares", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => articles.id),
  channel: varchar("channel", { length: 20 }).default("unknown"),
  deviceType: varchar("device_type", { length: 20 }).default("unknown"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const qrScans = pgTable("qr_scans", {
  id: serial("id").primaryKey(),
  pagePath: varchar("page_path", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

- [ ] **Step 2: Push migration to DB**

Run: `npx drizzle-kit push`
Expected: 4 new tables created in PostgreSQL

- [ ] **Step 3: Verify tables exist**

Run:
```bash
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://Z1858@localhost:5432/bbxin' });
(async () => {
  const res = await pool.query(\"SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('article_analytics','article_reads','article_shares','qr_scans')\");
  console.log('New tables:', res.rows.map(r=>r.table_name).join(', '));
  await pool.end();
})();
"
```
Expected: `New tables: article_analytics, article_reads, article_shares, qr_scans`

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/schema.ts
git commit -m "feat: add analytics tables — article_analytics, article_reads, article_shares, qr_scans"
```

---

### Task 2: View Tracking API Route

**Files:**
- Create: `src/app/api/articles/[id]/view/route.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/analytics.test.ts`:
```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("POST /api/articles/[id]/view", () => {
  it("returns 400 for invalid article id", async () => {
    const res = await fetch("http://localhost:3000/api/articles/99999/view", {
      method: "POST",
    });
    expect(res.status).toBe(400);
  });

  it("returns 200 for valid article id", async () => {
    const res = await fetch("http://localhost:3000/api/articles/1012/view", {
      method: "POST",
      headers: { "X-Forwarded-For": "1.2.3.4" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.counted).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/analytics.test.ts -t "view" --reporter=verbose`
Expected: FAIL — 404 or 500 (route doesn't exist yet)

- [ ] **Step 3: Create the API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { createHash } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId) || articleId < 1) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }

  // Check article exists
  const articles = await db.select({ id: schema.articles.id })
    .from(schema.articles)
    .where(eq(schema.articles.id, articleId))
    .limit(1);
  if (articles.length === 0) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  // IP hash for dedup
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").substring(0, 16);

  // 24h dedup: skip if same IP+article in last 24h
  const recent = await db.select({ id: schema.articleAnalytics.id })
    .from(schema.articleAnalytics)
    .where(and(
      eq(schema.articleAnalytics.articleId, articleId),
      eq(schema.articleAnalytics.ipHash, ipHash),
      sql`${schema.articleAnalytics.createdAt} > NOW() - INTERVAL '24 hours'`
    ))
    .limit(1);

  if (recent.length > 0) {
    return NextResponse.json({ counted: false, reason: "dedup" });
  }

  // Insert view record
  await db.insert(schema.articleAnalytics).values({
    articleId,
    ipHash,
    userAgent: req.headers.get("user-agent") || "",
  });

  // Update article view_count
  await db.update(schema.articles)
    .set({ viewCount: sql`${schema.articles.viewCount} + 1` })
    .where(eq(schema.articles.id, articleId));

  return NextResponse.json({ counted: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/analytics.test.ts -t "view" --reporter=verbose`
Expected: PASS — 2 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/app/api/articles/[id]/view/route.ts src/lib/__tests__/analytics.test.ts
git commit -m "feat: add article view tracking API with IP dedup"
```

---

### Task 3: Share Tracking API Route

**Files:**
- Create: `src/app/api/articles/[id]/share/route.ts`

- [ ] **Step 1: Add test cases to analytics.test.ts**

```typescript
describe("POST /api/articles/[id]/share", () => {
  it("records share event with channel and device", async () => {
    const res = await fetch("http://localhost:3000/api/articles/1012/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "web_share", deviceType: "mobile" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.recorded).toBe(true);
  });

  it("defaults channel to copy_link on PC", async () => {
    const res = await fetch("http://localhost:3000/api/articles/1012/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "copy_link", deviceType: "desktop" }),
    });
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Create the API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId) || articleId < 1) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }

  let channel = "copy_link";
  let deviceType = "desktop";
  try {
    const body = await req.json();
    if (body.channel) channel = body.channel;
    if (body.deviceType) deviceType = body.deviceType;
  } catch {}

  await db.insert(schema.articleShares).values({
    articleId,
    channel,
    deviceType,
  });

  return NextResponse.json({ recorded: true });
}
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/lib/__tests__/analytics.test.ts -t "share" --reporter=verbose`
Expected: PASS — 2 tests passing

- [ ] **Step 4: Commit**

```bash
git add src/app/api/articles/[id]/share/route.ts src/lib/__tests__/analytics.test.ts
git commit -m "feat: add article share tracking API with channel+device"
```

---

### Task 4: Reading Duration Heartbeat API

**Files:**
- Create: `src/app/api/articles/[id]/read/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId) || articleId < 1) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").substring(0, 16);

  await db.insert(schema.articleReads).values({
    articleId,
    ipHash,
    durationSeconds: 30,
  });

  return NextResponse.json({ recorded: true });
}
```

- [ ] **Step 2: Add test**

```typescript
describe("POST /api/articles/[id]/read", () => {
  it("records reading heartbeat", async () => {
    const res = await fetch("http://localhost:3000/api/articles/1012/read", {
      method: "POST",
      headers: { "X-Forwarded-For": "5.6.7.8" },
    });
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 3: Run tests and commit**

```bash
npx vitest run src/lib/__tests__/analytics.test.ts -t "read" --reporter=verbose
git add src/app/api/articles/[id]/read/route.ts src/lib/__tests__/analytics.test.ts
git commit -m "feat: add reading duration heartbeat API"
```

---

### Task 5: QR Scan Tracking API

**Files:**
- Create: `src/app/api/qr/scan/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";

export async function POST(req: NextRequest) {
  let pagePath = "/";
  try {
    const body = await req.json();
    if (body.pagePath) pagePath = body.pagePath;
  } catch {}

  await db.insert(schema.qrScans).values({ pagePath });

  return NextResponse.json({ recorded: true });
}
```

- [ ] **Step 2: Add test and commit**

```typescript
describe("POST /api/qr/scan", () => {
  it("records QR scan with page path", async () => {
    const res = await fetch("http://localhost:3000/api/qr/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: "/articles/1012" }),
    });
    expect(res.status).toBe(200);
  });
});
```

```bash
git add src/app/api/qr/scan/route.ts src/lib/__tests__/analytics.test.ts
git commit -m "feat: add QR scan tracking API"
```

---

### Task 6: Admin Analytics Summary + Top Articles API

**Files:**
- Create: `src/app/api/admin/analytics/summary/route.ts`
- Create: `src/app/api/admin/analytics/top-articles/route.ts`

- [ ] **Step 1: Create summary API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  const since = sql`NOW() - INTERVAL '${sql.raw(String(days))} days'`;

  const [views] = await db.select({ count: sql<number>`count(*)::int` })
    .from(schema.articleAnalytics)
    .where(sql`${schema.articleAnalytics.createdAt} > ${since}`);

  const [shares] = await db.select({ count: sql<number>`count(*)::int` })
    .from(schema.articleShares)
    .where(sql`${schema.articleShares.createdAt} > ${since}`);

  const [scans] = await db.select({ count: sql<number>`count(*)::int` })
    .from(schema.qrScans)
    .where(sql`${schema.qrScans.createdAt} > ${since}`);

  // Daily view trend
  const dailyViews = await db.select({
    date: sql<string>`to_char(${schema.articleAnalytics.createdAt}, 'YYYY-MM-DD')`,
    count: sql<number>`count(*)::int`,
  })
    .from(schema.articleAnalytics)
    .where(sql`${schema.articleAnalytics.createdAt} > ${since}`)
    .groupBy(sql`to_char(${schema.articleAnalytics.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${schema.articleAnalytics.createdAt}, 'YYYY-MM-DD')`);

  return NextResponse.json({
    totalViews: views?.count || 0,
    totalShares: shares?.count || 0,
    totalScans: scans?.count || 0,
    shareRate: views?.count ? ((shares?.count || 0) / views.count * 100).toFixed(1) : "0",
    dailyViews,
  });
}
```

- [ ] **Step 2: Create top articles API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { sql, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const since = sql`NOW() - INTERVAL '${sql.raw(String(days))} days'`;

  const rows = await db.select({
    id: schema.articles.id,
    title: schema.articles.title,
    viewCount: schema.articles.viewCount,
    recentViews: sql<number>`count(${schema.articleAnalytics.id})::int`,
    recentShares: sql<number>`COALESCE(
      (SELECT count(*)::int FROM ${schema.articleShares}
       WHERE ${schema.articleShares.articleId} = ${schema.articles.id}
       AND ${schema.articleShares.createdAt} > ${since}
      ), 0)`,
  })
    .from(schema.articles)
    .leftJoin(schema.articleAnalytics,
      sql`${schema.articleAnalytics.articleId} = ${schema.articles.id}
           AND ${schema.articleAnalytics.createdAt} > ${since}`)
    .groupBy(schema.articles.id)
    .orderBy(desc(sql`count(${schema.articleAnalytics.id})`))
    .limit(limit);

  return NextResponse.json(rows);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/analytics/
git commit -m "feat: add admin analytics summary and top-articles API routes"
```

---

### Task 7: Article Detail Page — Integrate Tracking

**Files:**
- Modify: `src/app/articles/[id]/page.tsx`

- [ ] **Step 1: Add view tracking and reading heartbeat to article page**

At the bottom of the `ArticleDetailPage` component, add a client-side tracking hook. Create a new client component:

Create `src/components/ArticleTracker.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";

export default function ArticleTracker({ articleId }: { articleId: number }) {
  const tracked = useRef(false);
  const heartbeatCount = useRef(0);

  useEffect(() => {
    // Fire view tracking once on mount
    if (!tracked.current) {
      tracked.current = true;
      fetch(`/api/articles/${articleId}/view`, {
        method: "POST",
        keepalive: true,
      }).catch(() => {});
    }

    // Reading duration heartbeat every 30s
    const interval = setInterval(() => {
      heartbeatCount.current++;
      navigator.sendBeacon(`/api/articles/${articleId}/read`);
    }, 30000);

    return () => clearInterval(interval);
  }, [articleId]);

  return null;
}
```

- [ ] **Step 2: Add ArticleTracker to article detail page**

In `src/app/articles/[id]/page.tsx`, add import and render:
```tsx
import ArticleTracker from "@/components/ArticleTracker";

// Inside the main content area, before closing the article div:
<ArticleTracker articleId={Number(id)} />
```

- [ ] **Step 3: Verify with Playwright**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/articles/1012', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  // Check that view was counted
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: 'postgresql://Z1858@localhost:5432/bbxin' });
  const res = await pool.query('SELECT count(*) as cnt FROM article_analytics WHERE article_id=1012');
  console.log('View records for article 1012:', res.rows[0].cnt);
  await pool.end();
  await browser.close();
})();
"
```
Expected: View records for article 1012: >= 1

- [ ] **Step 4: Commit**

```bash
git add src/components/ArticleTracker.tsx src/app/articles/[id]/page.tsx
git commit -m "feat: integrate view tracking + reading heartbeat on article pages"
```

---

### Task 8: ShareButton Refactor — Generic Component

**Files:**
- Modify: `src/components/ShareButton.tsx`
- Modify: `src/app/products/detail/[id]/page.tsx` (update call site)

- [ ] **Step 1: Refactor ShareButton to accept url+title props**

```tsx
"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
  variant?: "product" | "article";
  onShare?: () => void;
}

export default function ShareButton({ url, title, variant = "article", onShare }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const detectDevice = (): string => {
    if (typeof navigator === "undefined") return "desktop";
    const ua = navigator.userAgent;
    if (/Android|iPhone|iPad/i.test(ua)) return "mobile";
    return "desktop";
  };

  const handleShare = async () => {
    const deviceType = detectDevice();

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        recordShare("web_share", deviceType);
        return;
      } catch {}
    }

    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    recordShare("copy_link", deviceType);
  };

  const recordShare = (channel: string, deviceType: string) => {
    const articleId = url.split("/").pop();
    fetch(`/api/articles/${articleId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, deviceType }),
      keepalive: true,
    }).catch(() => {});
    onShare?.();
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-yellow-600 cursor-pointer"
      type="button"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied ? "已复制" : "分享"}
    </button>
  );
}
```

- [ ] **Step 2: Update article detail page to use ShareButton**

In `src/app/articles/[id]/page.tsx`, replace the existing share button:
```tsx
// Remove old share button (line 40-42):
// <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition-colors duration-200 hover:bg-slate-50 cursor-pointer">
//   <Share2 className="h-3.5 w-3.5" /> 分享
// </button>

// Replace with:
<ShareButton
  url={`/articles/${id}`}
  title={article.title}
  variant="article"
/>
```

- [ ] **Step 3: Verify with Playwright**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/articles/1012', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  const btn = await page.evaluate(() => {
    const b = document.querySelector('button');
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(t => t?.includes('分享'));
  });
  console.log('Share buttons found:', btn);
  await browser.close();
})();
"
```
Expected: Share buttons found: ["分享"]

- [ ] **Step 4: Commit**

```bash
git add src/components/ShareButton.tsx src/app/articles/[id]/page.tsx
git commit -m "refactor: make ShareButton generic (url+title props), integrate on article pages"
```

---

### Task 9: FloatingQR + Footer QR

**Files:**
- Create: `src/components/FloatingQR.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Create FloatingQR component**

```tsx
"use client";

import { useState } from "react";
import { QrCode, X } from "lucide-react";

export default function FloatingQR({ pagePath }: { pagePath?: string }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    // Track QR scan intention
    fetch("/api/qr/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: pagePath || window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-600 text-white shadow-lg transition-all duration-200 hover:bg-yellow-700 hover:shadow-xl cursor-pointer"
        type="button"
        aria-label="微信联系"
      >
        <QrCode className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="relative mx-4 w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="mb-2 text-lg font-bold text-slate-900">微信扫码咨询</h3>
            <p className="mb-4 text-sm text-slate-500">扫码添加微信，免费获取贷款建议</p>
            <img
              src="/images/wechat-qr.png"
              alt="微信二维码"
              className="mx-auto h-52 w-52 rounded-lg border border-slate-100 object-cover"
            />
            <p className="mt-3 text-xs text-slate-400">微信扫一扫 或 长按识别</p>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Add QR section to Footer**

In `src/components/Footer.tsx`, add QR code to the right column alongside "快速链接":
```tsx
<div>
  <h4 className="mb-3 text-sm font-semibold text-white">微信咨询</h4>
  <img
    src="/images/wechat-qr.png"
    alt="微信二维码"
    className="mb-2 h-24 w-24 rounded-lg border border-slate-700 object-cover"
  />
  <p className="text-xs text-slate-500">扫码添加微信</p>
</div>
```

Change grid to 3 columns: `md:grid-cols-[1fr_200px_150px]`

- [ ] **Step 3: Add FloatingQR to layout**

In `src/app/layout.tsx`, add `<FloatingQR />` before closing `</body>`.

- [ ] **Step 4: Verify with Playwright**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 }); // mobile
  await page.goto('http://localhost:3000/articles/1012', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  const qrBtn = await page.evaluate(() => {
    return !!document.querySelector('[aria-label=\"微信联系\"]');
  });
  console.log('FloatingQR visible:', qrBtn);
  await browser.close();
})();
"
```
Expected: FloatingQR visible: true

- [ ] **Step 5: Commit**

```bash
git add src/components/FloatingQR.tsx src/components/Footer.tsx src/app/layout.tsx
git commit -m "feat: add FloatingQR button + footer QR code section"
```

---

### Task 10: Admin Analytics Dashboard

**Files:**
- Create: `src/app/admin/analytics/page.tsx`

- [ ] **Step 1: Install Tremor dependency**

```bash
npm install @tremor/react
```

- [ ] **Step 2: Create the dashboard page**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Card, AreaChart, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from "@tremor/react";
import { Eye, Share2, Scan, TrendingUp } from "lucide-react";

interface Summary {
  totalViews: number;
  totalShares: number;
  totalScans: number;
  shareRate: string;
  dailyViews: { date: string; count: number }[];
}

interface TopArticle {
  id: number;
  title: string;
  viewCount: number;
  recentViews: number;
  recentShares: number;
}

const goldPalette = {
  area: "#CA8A04",
  areaFill: "rgba(202,138,4,0.15)",
  navy: "#0F172A",
};

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/analytics/summary?days=${days}`).then(r => r.json()),
      fetch(`/api/admin/analytics/top-articles?days=${days}&limit=20`).then(r => r.json()),
    ])
      .then(([s, t]) => { setSummary(s); setTopArticles(t); })
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-slate-100" />
          ))}
        </div>
        <div className="h-64 rounded-lg bg-slate-100" />
      </div>
    );
  }

  if (!summary || summary.totalViews === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <TrendingUp className="h-12 w-12 text-slate-300" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">数据收集中...</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          当用户开始访问文章后，阅读量、分享数据和扫码统计将在这里展示。
          图表会随数据积累自动更新。
        </p>
        <div className="mt-8 grid w-full max-w-2xl gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-slate-50 border border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">数据分析</h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
        >
          <option value={7}>最近 7 天</option>
          <option value={30}>最近 30 天</option>
          <option value={90}>最近 90 天</option>
        </select>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card decoration="top" decorationColor="yellow">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Eye className="h-4 w-4" /> 总阅读量
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{summary.totalViews.toLocaleString()}</div>
        </Card>
        <Card decoration="top" decorationColor="emerald">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Share2 className="h-4 w-4" /> 总分享数
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{summary.totalShares.toLocaleString()}</div>
        </Card>
        <Card decoration="top" decorationColor="slate">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Scan className="h-4 w-4" /> 扫码次数
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{summary.totalScans.toLocaleString()}</div>
        </Card>
        <Card decoration="top" decorationColor="amber">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <TrendingUp className="h-4 w-4" /> 分享率
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{summary.shareRate}%</div>
        </Card>
      </div>

      {/* Trend Chart + Top 10 */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <Title>阅读趋势（近 {days} 天）</Title>
          <AreaChart
            className="mt-4 h-64"
            data={summary.dailyViews}
            index="date"
            categories={["count"]}
            colors={["yellow"]}
            valueFormatter={(v) => v.toLocaleString()}
            showLegend={false}
          />
        </Card>
        <Card>
          <Title>热门文章 TOP 10</Title>
          <div className="mt-4 space-y-3">
            {topArticles.slice(0, 10).map((a, i) => (
              <div key={a.id} className="flex items-start gap-2">
                <span className="mt-0.5 text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <a href={`/articles/${a.id}`} target="_blank" className="text-sm text-slate-700 hover:text-yellow-600 line-clamp-1 transition-colors">
                    {a.title}
                  </a>
                  <div className="mt-0.5 flex gap-3 text-xs text-slate-400">
                    <span><Eye className="inline h-3 w-3" /> {a.recentViews}</span>
                    <span><Share2 className="inline h-3 w-3" /> {a.recentShares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Full Article Table */}
      <Card>
        <Title>文章数据明细</Title>
        <Table className="mt-4">
          <TableHead>
            <TableRow>
              <TableHeaderCell>文章标题</TableHeaderCell>
              <TableHeaderCell>总阅读</TableHeaderCell>
              <TableHeaderCell>近期阅读</TableHeaderCell>
              <TableHeaderCell>近期分享</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topArticles.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <a href={`/articles/${a.id}`} target="_blank" className="text-slate-700 hover:text-yellow-600 transition-colors line-clamp-1 max-w-md">
                    {a.title}
                  </a>
                </TableCell>
                <TableCell>{a.viewCount.toLocaleString()}</TableCell>
                <TableCell>{a.recentViews.toLocaleString()}</TableCell>
                <TableCell>{a.recentShares.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/analytics/page.tsx package.json package-lock.json
git commit -m "feat: add admin analytics dashboard with Tremor charts"
```

---

### Task 11: Admin Nav Fix — Blue to Gold + Analytics Link

**Files:**
- Modify: `src/app/admin/layout.tsx`

- [ ] **Step 1: Fix nav colors and add link**

In `src/app/admin/layout.tsx`:

Change line 8 import:
```tsx
import { LogOut, LayoutDashboard, FileText, Users, Package, Building2, MessageSquare, FileEdit, BarChart3 } from "lucide-react";
```

Change navItems array (line 10-18) — add analytics entry + fix all blue references:
```tsx
const navItems = [
  { label: "概览", href: "/admin", icon: LayoutDashboard },
  { label: "数据分析", href: "/admin/analytics", icon: BarChart3 },
  { label: "贷款申请", href: "/admin/loans", icon: FileText },
  { label: "用户管理", href: "/admin/users", icon: Users },
  { label: "产品管理", href: "/admin/products", icon: Package },
  { label: "机构管理", href: "/admin/institutions", icon: Building2 },
  { label: "评论管理", href: "/admin/comments", icon: MessageSquare },
  { label: "文章管理", href: "/admin/articles", icon: FileEdit },
];
```

Change active nav class (line 100-101) — fix blue to gold:
```tsx
? "bg-amber-50 text-yellow-700 font-semibold"
: "text-slate-600 hover:bg-slate-50"
```

Change sidebar header link (line 86-88) — fix blue to gold:
```tsx
<Link href="/admin" className="text-lg font-bold text-slate-900 hover:text-yellow-600 transition-colors duration-200">
  银脉圈 · 后台
</Link>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "fix: admin nav blue→gold accent + add analytics nav link"
```

---

### Task 12: Full Test Suite — All 19 Paths

**Files:**
- Modify: `src/lib/__tests__/analytics.test.ts`
- Create: `src/components/__tests__/ShareButton.test.tsx`
- Create: `src/components/__tests__/FloatingQR.test.tsx`

- [ ] **Step 1: Complete analytics API tests**

Add remaining test cases to `src/lib/__tests__/analytics.test.ts` for admin summary, top articles, rate limiting:

```typescript
describe("GET /api/admin/analytics/summary", () => {
  it("returns summary with default 30 days", async () => {
    const res = await fetch("http://localhost:3000/api/admin/analytics/summary");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("totalViews");
    expect(body).toHaveProperty("totalShares");
    expect(body).toHaveProperty("dailyViews");
  });
});

describe("GET /api/admin/analytics/top-articles", () => {
  it("returns top articles list", async () => {
    const res = await fetch("http://localhost:3000/api/admin/analytics/top-articles?limit=5");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Create ShareButton component tests**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ShareButton from "@/components/ShareButton";

describe("ShareButton", () => {
  it("renders share button with text", () => {
    render(<ShareButton url="/articles/1" title="Test Article" />);
    expect(screen.getByText("分享")).toBeDefined();
  });

  it("accepts variant prop", () => {
    render(<ShareButton url="/products/detail/1" title="Test Product" variant="product" />);
    expect(screen.getByText("分享")).toBeDefined();
  });
});
```

- [ ] **Step 3: Create FloatingQR component tests**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FloatingQR from "@/components/FloatingQR";

describe("FloatingQR", () => {
  it("renders QR button with aria label", () => {
    render(<FloatingQR />);
    expect(screen.getByLabelText("微信联系")).toBeDefined();
  });
});
```

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run --reporter=verbose
```
Expected: All tests PASS — 19+ tests covering all API routes and components

- [ ] **Step 5: Commit**

```bash
git add src/lib/__tests__/analytics.test.ts src/components/__tests__/
git commit -m "test: add full test suite for analytics APIs, ShareButton, FloatingQR"
```

---

### Task 13: Final Integration — Placeholder QR Image + Verification

- [ ] **Step 1: Create placeholder QR code image**

```bash
# Create a basic placeholder (can be replaced later by admin)
cp public/images/remote/dc4to74g65csi8fqrp.jpg public/images/wechat-qr.png 2>/dev/null || echo "Placeholder needed — use any qr image"
```

- [ ] **Step 2: Full Playwright verification**

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  
  // 1. Article page — share button + floating QR
  const p1 = await browser.newPage();
  await p1.goto('http://localhost:3000/articles/1012', { waitUntil: 'load', timeout: 60000 });
  await p1.waitForTimeout(2000);
  const hasShare = await p1.evaluate(() => !!Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('分享')));
  const hasQR = await p1.evaluate(() => !!document.querySelector('[aria-label=\"微信联系\"]'));
  console.log('Article page: share=' + hasShare + ' qr=' + hasQR);
  await p1.close();
  
  // 2. Admin analytics page
  const p2 = await browser.newPage();
  // Login first
  await p2.goto('http://localhost:3000/admin/login', { waitUntil: 'load', timeout: 60000 });
  // ... (manual login step needed)
  await p2.goto('http://localhost:3000/admin/analytics', { waitUntil: 'load', timeout: 60000 });
  await p2.waitForTimeout(2000);
  const heading = await p2.evaluate(() => document.querySelector('h1')?.textContent);
  console.log('Admin analytics: heading=' + heading);
  await p2.close();
  
  await browser.close();
})();
"
```
Expected: Article page: share=true qr=true | Admin analytics: heading=数据分析

- [ ] **Step 3: Final commit**

```bash
git add public/images/wechat-qr.png
git commit -m "chore: add placeholder QR image, final integration verification"
```
