# CasesSection Specification — "モノクローム施工事例"

## Overview
- **Target file:** `src/components/CasesSection.tsx`
- **Interaction model:** static + hover (image fade-in/scale on architect cards)
- **Screenshots:** docs/design-references/ss_0145hy4ts (top 3 architects), ss_1326jcm0l (text-only list)

## Container
- `<section class="relative py-20 md:py-30 lg:py-40 base-px">`
- White bg

## Section header
- Flex justify-between
- Left: `<h2 class="text-[2rem] font-normal">モノクローム施工事例</h2>`
- Right: outlined pill button `一覧を見る` → `/cases`

## Top row: 3 featured architect cards (with images)
- Grid `grid grid-cols-3 gap-x-8 mt-12`
- Each card:
  ```
  ─────────────────────────  ← top border (1px black-10)
  SUEP.                      ← architect name
  
  ┌─────────────┐
  │             │
  │   <image>   │
  │             │
  └─────────────┘
  ```
- Card structure:
  - `<div class="border-t border-black-10 pt-4">`
  - Architect name as `<p class="text-base font-normal mb-6">SUEP.</p>`
  - Image container: `relative aspect-[4/3] overflow-hidden` (or aspect-square, ~square-ish)
  - Inside: hover-driven image with `<Image fill className="object-cover scale-105 opacity-0 lg:transition group-hover:lg:opacity-100 group-hover:lg:scale-100 ease-out-cubic">`
  - Wrap in `<a class="group block">` to enable group-hover

## Hover behavior (key)
- Default: image is `opacity-0 scale-105` (invisible, slightly enlarged)
- On parent group hover at `lg+`: image becomes `opacity-100 scale-100` with `transition-all ease-out-cubic 600ms`
- The card looks empty by default, then the image fades into view on hover — a signature monochrome.so motion

## Bottom: text-only list (8 entries)
- `<ul class="mt-16 grid grid-cols-3 gap-x-8">` — wait, looking at the screenshot, the list is in the FIRST column only and stacks vertically
- Actually looking at the screenshot: text-only entries stack vertically below the SUEP card (column 1) only. The other 2 columns are empty below.
- Each entry: `<li class="border-t border-black-10 py-4 text-base">`
  - `山本健悟建築設計室`
  - `能作文徳建築設計事務所＋Studio mnm`
  - `DRAWERS`
  - `lyhty`
  - `NOT A HOTEL株式会社`
  - `ミサワホーム株式会社`
  - `ツバメアーキテクツ`
  - `スキーマ建築計画`
- Last entry has bottom border too (8 entries, 9 borders total)

## Architect data
```ts
const FEATURED_ARCHITECTS = [
  { name: "SUEP.", image: "/images/architects/01.jpg", href: "/cases/suep" },
  { name: "Suppose Design Office", image: "/images/architects/02.jpg", href: "/cases/suppose" },
  { name: "中川エリカ建築設計事務所", image: "/images/architects/03.jpg", href: "/cases/nakagawa-erika" },
];

const TEXT_ONLY_ARCHITECTS = [
  "山本健悟建築設計室",
  "能作文徳建築設計事務所＋Studio mnm",
  "DRAWERS",
  "lyhty",
  "NOT A HOTEL株式会社",
  "ミサワホーム株式会社",
  "ツバメアーキテクツ",
  "スキーマ建築計画",
];
```

## Computed styles
- Heading: 32px / weight 400 / line-height 1.4
- Architect name: 16px / weight 400
- Border color: `rgba(20,20,25,0.1)` = `border-black-10`
- Image aspect: ~1/0.75 (roughly 4:3 portrait-leaning)

## Responsive
- Desktop: 3-col featured + text list in first column
- Tablet: 2-col featured + text list
- Mobile: stacked single column featured + text list
