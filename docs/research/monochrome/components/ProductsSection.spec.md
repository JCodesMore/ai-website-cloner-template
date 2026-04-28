# ProductsSection Specification — "エネルギーをつくる"

## Overview
- **Target file:** `src/components/ProductsSection.tsx`
- **Interaction model:** static (no scroll/click switching of cards; just hover effects)
- **Screenshot:** docs/design-references/ss_8747vc0bw

## Container
- `<section id="products" class="overflow-clip base-px py-16 md:py-20 lg:py-30">`
- White background

## Section header
- `<h2 class="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] tracking-[0.01em]">エネルギーをつくる</h2>`
- Padded below by ~`pb-10`

## Card grid
- Desktop (lg+): `grid grid-cols-3 gap-x-6 lg:gap-x-8`
- Tablet (md): `grid grid-cols-2 gap-6` (Roof-1 + Wall-1 first row, Panel-B second row)
- Mobile: stacked single column with vertical gap-12

## Three product cards
Each card has the same structure; only the data differs.

```
┌──────────────────────────────────────────────┐
│ Roof-1                  エネルギーをつくる屋根  │  ← title row
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │                                          │ │
│ │   <product hero image>                   │ │ ← image (aspect-[4/3])
│ │                                          │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ● Black ⚪ Silver ● Roof-1e   [詳しく見る][相談する]  ← color dots + buttons
└──────────────────────────────────────────────┘
```

### Title row
- Flex justify-between, baseline aligned
- Left: product name `text-[1.75rem] font-normal` (e.g. "Roof-1")
- Right: tagline `text-sm text-black-60` (e.g. "エネルギーをつくる屋根")

### Product image
- `relative aspect-[4/3] mt-4` (or fixed height)
- Use `<Image fill className="object-cover">`

### Footer row (color dots + buttons)
- Flex `justify-between items-center` `mt-4`
- Left: dots — each is `<span>` with `inline-flex items-center gap-1` containing a `<span class="w-3 h-3 rounded-full">` and a label
- Right: two pill buttons inline — `詳しく見る` (outline) + `相談する` (filled black)

### Color dot styles
- Black dot: `bg-[#141419]`
- Silver dot: `bg-[#a3a39c]` (light gray, slightly desaturated silver)
- Roof-1e dot: `bg-[#0d1f1a]` (dark slate green/black variant, has matte finish)

## Product data (verbatim from live site)

```ts
const PRODUCTS = [
  {
    name: "Roof-1",
    tagline: "エネルギーをつくる屋根",
    image: "/images/products/roof_1.jpg",
    imageAlt: "Roof-1 product",
    colors: [
      { label: "Black", hex: "#141419" },
      { label: "Silver", hex: "#a3a39c" },
      { label: "Roof-1e", hex: "#0d1f1a" },
    ],
    detailHref: "/roof-1",
    consultHref: "/contact",
  },
  {
    name: "Wall-1",
    tagline: "エネルギーをつくる壁",
    image: "/images/products/wall_1.jpg",
    imageAlt: "Wall-1 product",
    colors: [{ label: "Black", hex: "#141419" }],
    detailHref: "/wall-1",
    consultHref: "/contact",
  },
  {
    name: "Panel-B",
    tagline: "最もミニマルな太陽光パネル",
    image: "/images/products/panel_1.jpg",
    imageAlt: "Panel-B product",
    colors: [{ label: "Black", hex: "#141419" }],
    detailHref: "/panel-b",
    consultHref: "/contact",
  },
];
```

## Computed styles (from live)
- Card spacing: `gap-x-6 lg:gap-x-8` between cards
- Title font: 28px @ desktop, ~22px @ mobile, weight 400, line-height 1.4
- Tagline font: 14px, weight 400, color rgba(20,20,25,0.6)
- Color dot: 12x12px, fully rounded, with 4px gap to label
- Pill buttons: see globals.css `.button-base` `.button-fill` `.button-outline`

## Hover states
- Image hover: subtle `scale-[1.02]` on `transition-transform 600ms ease-out-cubic` (optional — confirm by hovering)
- Buttons: per global utility classes

## Responsive
- Desktop (>=1024px): 3 columns, gap-8
- Tablet (768-1023px): 2 columns, the third card wraps below; gap-6
- Mobile (<768px): 1 column, gap-12 vertical
