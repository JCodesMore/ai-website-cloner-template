# UI Consistency Audit & Remediation — MASTER.md v2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit every page and component against the first-principles design system (MASTER.md v2), fix all deviations. Gold accent for CTAs, blue for text links, navy for trust elements.

**Architecture:** Three-phase plan. Phase 1 fixes the 5 critical blue→gold CTA violations found during audit. Phase 2 fixes secondary deviations (LoanForm amber→gold, Sidebar accent bar, counselors page). Phase 3 verifies completeness with a spot-check of each page route.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, React 19

**Reference:** `design-system/MASTER.md` v2 — Banking/Traditional Finance palette (navy #0F172A, gold #CA8A04, white background)

---

### Task 1: Fix Product Detail "Apply Now" CTA (P1)

**Files:**
- Modify: `src/app/products/[category]/[id]/page.tsx:120-122`

- [ ] **Step 1: Change the primary CTA button from blue to gold**

In `src/app/products/[category]/[id]/page.tsx`, change line 122 from:

```tsx
<a className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700" href={`/api/products/${id}/jump?source=click`} target="_blank" rel="nofollow noopener">立即申请</a>
```

To:

```tsx
<a className="inline-flex items-center rounded-lg bg-yellow-600 px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700" href={`/api/products/${id}/jump?source=click`} target="_blank" rel="nofollow noopener">立即申请</a>
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: Only pre-existing `pg` module error, no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/products/[category]/[id]/page.tsx
git commit -m "fix: change product detail CTA from blue to gold — matches MASTER.md v2"
```

---

### Task 2: Fix Institutions Search Button (P1)

**Files:**
- Modify: `src/app/institutions/page.tsx:89`

- [ ] **Step 1: Change search button from blue to gold**

In `src/app/institutions/page.tsx`, change line 89 from:

```tsx
<button type="submit" className="flex h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 cursor-pointer">
  <Search className="h-4 w-4" /> 搜索
</button>
```

To:

```tsx
<button type="submit" className="flex h-10 items-center gap-1.5 rounded-lg bg-yellow-600 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700 cursor-pointer">
  <Search className="h-4 w-4" /> 搜索
</button>
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/institutions/page.tsx
git commit -m "fix: change institutions search button from blue to gold"
```

---

### Task 3: Fix Institution Detail Accent Bar (P1)

**Files:**
- Modify: `src/app/institutions/[id]/page.tsx:51`

- [ ] **Step 1: Change section accent bar from blue to navy**

In `src/app/institutions/[id]/page.tsx`, change line 51 from:

```tsx
<span className="block h-4 w-1 rounded-full bg-blue-600" />
```

To:

```tsx
<span className="block h-4 w-1 rounded-full bg-slate-900" />
```

The navy primary (#0F172A = slate-900) is the correct brand accent for section markers. The emerald variant on line 60 (`bg-emerald-600`) stays — it provides visual variety for the "在营产品" section.

- [ ] **Step 2: Check for other blue accent bars on the same page**

Run: `grep -n "bg-blue-600" src/app/institutions/[id]/page.tsx`
Expected: No remaining `bg-blue-600` instances on this page (only the emerald one on line 60).

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/institutions/[id]/page.tsx
git commit -m "fix: change institution detail accent bar from blue to navy"
```

---

### Task 4: Fix Counselors Page CTAs (P1)

**Files:**
- Modify: `src/app/counselors/[id]/page.tsx:47,55`

- [ ] **Step 1: Change both "查看" buttons from blue to gold**

In `src/app/counselors/[id]/page.tsx`, find the two button instances (lines 47 and 55) with:

```tsx
className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-blue-700 cursor-pointer"
```

Change both to:

```tsx
className="rounded-lg bg-yellow-600 px-4 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-yellow-700 cursor-pointer"
```

- [ ] **Step 2: Also fix the phone icon (line 51)**

The `text-blue-600` on the Phone icon is decorative. Change to match the design system:

```tsx
<Phone className="h-6 w-6 text-slate-700" />
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/counselors/[id]/page.tsx
git commit -m "fix: change counselors page CTAs from blue to gold"
```

---

### Task 5: Fix Admin Logout Button (P2)

**Files:**
- Modify: `src/app/admin/layout.tsx:74`

- [ ] **Step 1: Change admin logout button from blue to gold**

In `src/app/admin/layout.tsx`, change line 74 from:

```tsx
className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 cursor-pointer">
```

To:

```tsx
className="rounded-lg bg-yellow-600 px-8 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700 cursor-pointer">
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "fix: change admin logout button from blue to gold"
```

---

### Task 6: Standardize LoanForm Amber → Gold (P2)

**Files:**
- Modify: `src/components/LoanForm.tsx:129`

- [ ] **Step 1: Change LoanForm submit button from amber to gold**

In `src/components/LoanForm.tsx`, change line 129 from:

```tsx
className="flex h-11 w-full items-center justify-center rounded-lg bg-amber-500 text-sm font-medium text-black transition-colors duration-200 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
```

To:

```tsx
className="flex h-11 w-full items-center justify-center rounded-lg bg-yellow-600 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-60"
```

Note: The text changes from `text-black` to `text-white` because `bg-yellow-600` is a darker gold that needs white text for contrast, unlike `bg-amber-500` which was light enough for black text.

- [ ] **Step 2: Also update the radio button accent color (lines 74, 86)**

Change `accent-amber-500` to `accent-yellow-600` on both radio inputs:

```tsx
className="accent-yellow-500"
```

- [ ] **Step 3: Also update the focus ring color (lines 106, 117, 127)**

Change `focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20` to `focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20` on the phone input, amount select, and submit button container.

- [ ] **Step 4: Update the success state (lines 51-56)**

The success state uses `border-emerald-200 bg-emerald-50 text-emerald-800` and `text-emerald-500` — these are correct per the design system (Success = emerald). No change needed.

- [ ] **Step 5: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/LoanForm.tsx
git commit -m "fix: standardize LoanForm from amber to gold — matches MASTER.md v2 accent"
```

---

### Task 7: Sidebar Accent Bar — Blue → Navy (P2)

**Files:**
- Modify: `src/components/Sidebar.tsx:24`

- [ ] **Step 1: Change SideCard blue accent to navy**

In `src/components/Sidebar.tsx`, change line 24 from:

```tsx
const accent = color === "blue" ? "bg-blue-600" : "bg-emerald-600";
```

To:

```tsx
const accent = color === "blue" ? "bg-slate-900" : "bg-emerald-600";
```

The navy accent matches the design system's primary color. Emerald stays for the alternating cards (discussions, FAQ sections).

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.tsx
git commit -m "fix: change sidebar accent bar from blue to navy"
```

---

### Task 8: Final Verification — Spot-Check All Pages (P2)

**Files:**
- No file changes — verification only.

- [ ] **Step 1: Verify key pages render with gold accents**

Run these checks:

```bash
# Product listing page: gold CTAs on cards
curl -s http://localhost:3000/products/person | grep -c "bg-yellow-600"
# Expected: > 15 (one per product card CTA)

# Product detail page: gold "apply" button
curl -s http://localhost:3000/products/fast/172 | grep -c "bg-yellow-600"
# Expected: 1 (the "立即申请" button)

# Institutions page: gold search button
curl -s http://localhost:3000/institutions | grep -c "bg-yellow-600"
# Expected: 1 (the search button)

# Nav: gold register button
curl -s http://localhost:3000/products/fast | grep -c "bg-yellow-600"
# Expected: > 1 (register button in nav + product card CTAs)
```

- [ ] **Step 2: Verify no blue CTAs remain**

```bash
# Check for blue CTAs (should only find text links, not buttons)
curl -s http://localhost:3000/products/person | grep -o 'bg-blue-600' | wc -l
# Expected: 0
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: All project tests pass.

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: Only pre-existing `pg` module error.

- [ ] **Step 5: Commit verification results (if any final tweaks needed)**

---

## What stays blue (by design)

These elements correctly use blue per the design system's rule: "text links → blue-600 (web convention)":

| Location | Element | Reason |
|----------|---------|--------|
| All breadcrumb links | `hover:text-blue-600` | Navigation text link |
| ArticleCard title | `group-hover:text-blue-600` | Text link |
| Sidebar "更多" + article links | `hover:text-blue-600` | Text link |
| Institution name hover | `group-hover:text-blue-600` | Text link |
| Institution website link | `text-blue-600 hover:underline` | External link |
| Product institution link | `text-blue-600 hover:underline` | External link |
| Agreement → privacy link | `text-blue-600 hover:underline` | Cross-reference link |
| Admin dashboard cards | `bg-blue-50 text-blue-600` | Admin tool, not user-facing |
| Admin "edit" links | `text-blue-600 hover:underline` | Admin tool text link |
| Comment product link | `text-blue-600` | Inline text link |
| Share icon hover | `group-hover:text-blue-600` | Subtle secondary effect |

## Execution Order

```
Phase 1 (parallel):    T1 + T2 + T3 + T4  — independent pages
Phase 2 (after P1):    T5 + T6 + T7  — independent components  
Phase 3 (after P2):    T8  — verification pass
```
