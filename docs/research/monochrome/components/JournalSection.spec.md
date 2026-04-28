# JournalSection Specification — "ジャーナル"

## Overview
- **Target file:** `src/components/JournalSection.tsx`
- **Interaction model:** time-driven (auto-cycling carousel) + click-driven (thumbnail click)
- **Screenshot:** docs/design-references/ss_50954s02a (active state showing 03/04)

## Container
- `<section class="py-20 overflow-hidden text-white md:py-20 lg:py-40 base-px bg-dark">`
- DARK background (`#1b1b1b`), white text — first dark section on the page
- Vertical padding: 80px mobile, 160px desktop

## Layout

```
┌────────────────────────────────────────────────────────────────┐
│  ⊙ ジャーナル                                       [一覧を見る]   │ ← header row
│                                                                 │
│  ┌──────────────────────────────────────────────┬───────┐      │
│  │                                              │  ┌──┐ │      │
│  │                                              │  ├──┤ │      │
│  │           Featured article image             │  ├──┤ │ ← 4 thumbs
│  │           (with optional title overlay)      │  ├──┤ │      │
│  │                                              │  └──┘ │      │
│  └──────────────────────────────────────────────┴───────┘      │
│                                                                 │
│  03 / 04           ← pagination indicator                       │
│                                                                 │
│  Article title goes here...                                     │
│  Date · Category                                                │
└────────────────────────────────────────────────────────────────┘
```

## Section header
- Flex justify-between items-center
- Left: monogram (`MonogramIcon` w-5 h-5) + `ジャーナル` text (text-base font-normal, ml-2)
- Right: `<Link>` outlined pill button "一覧を見る" → `/journal` (use `.button-base.button-outline-on-dark`)

## Carousel main
- Container: `relative grid grid-cols-12 gap-4 mt-10`
  - Featured image: `col-span-10`, aspect `~16/10`
  - Thumbnails: `col-span-2`, vertical stack of 4 thumbs each ~80x80, with gap
- Featured image: `relative w-full aspect-[16/10] overflow-hidden`
  - Inside: `<Image fill className="object-cover">` cycling between 4 articles via opacity transitions
  - Optional title overlay (e.g., "Roof-1") with a `<MonogramIcon>` next to it

## Pagination indicator
- Below the image, left aligned: `<div class="text-3xl">{cur} <span class="text-white-40">/ {total}</span></div>`
- Format: zero-padded current `03`, slash, total `04` muted

## Article cards (4 articles)

```ts
const JOURNAL_ARTICLES = [
  {
    date: "02/04",
    category: "建築家紹介",
    title: "【建築家インタビュー】「太陽にありがとうと言える暮らし」建築家・堀部安嗣の葉山の自邸",
    image: "/images/journal/article_1.png",
    href: "/journal/article-1",
    productBadge: "Roof-1",
  },
  // ... 3 more (use article_2.webp, article_3.jpg, article_4.jpg)
];
```

## Auto-cycling
- Cycles every ~6s
- Click thumbnail → jump to that article (resets timer)

## Computed styles
- Bg: `#1b1b1b` (use `.bg-dark`)
- Text: `#fafafa` / `#ffffff` for headings, `rgba(255,255,255,0.6)` for muted
- Pagination indicator: 28px font weight 400 for current, white-40 for total
- Thumbnails: 80x80px square, opacity-50 default → opacity-100 active
- Featured image transition: `opacity-1000 ease-out-expo`

## Responsive
- Desktop: 10/2 col split as shown
- Tablet: 8/4 col split
- Mobile: featured image full-width, thumbnails become horizontal row below
