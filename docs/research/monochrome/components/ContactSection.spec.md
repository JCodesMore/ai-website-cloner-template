# ContactSection Specification

## Overview
- **Target file:** `src/components/ContactSection.tsx`
- **Interaction model:** static
- **Screenshot:** docs/design-references/ss_2945oftqv

## Container
- `<section class="relative bg-gray md:flex">`
- Gray background (`#e6e6e4`)
- 2-column split with vertical divider

## Layout
- Two equal columns, each takes `flex-1`
- Vertical divider between them: `border-r border-black-10` on first column at md+
- Each column: `flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32`

## Two columns

### Left: お問い合わせ
- Heading: `<h2 class="text-[2rem] font-normal mb-6">お問い合わせ</h2>` (use --font-jp / --font-sans)
- Body:
  ```
  モノクローム製品の購入をご検討の方は
  こちらからお問い合わせください。
  ```
  - Class: `text-sm md:text-base leading-[1.8] text-black-60 mb-10 whitespace-pre-line`
- Button: filled black pill `相談する` → `/contact`
  - Larger padding than default: `px-8 py-3`

### Right: 資料請求
- Heading: `<h2 class="text-[2rem] font-normal mb-6">資料請求</h2>`
- Body:
  ```
  モノクロームの製品資料をご覧になりたい方は
  製品資料一覧よりご確認ください。
  ```
- Button: filled black pill `資料ダウンロード` → `/download`

## Content (verbatim)
```ts
const CONTACT_BLOCKS = [
  {
    title: "お問い合わせ",
    body: "モノクローム製品の購入をご検討の方は\nこちらからお問い合わせください。",
    cta: "相談する",
    href: "/contact",
  },
  {
    title: "資料請求",
    body: "モノクロームの製品資料をご覧になりたい方は\n製品資料一覧よりご確認ください。",
    cta: "資料ダウンロード",
    href: "/download",
  },
];
```

## Computed styles
- Heading: 32px, weight 400, line-height 1.4
- Body: 14-16px, line-height 1.8, color rgba(20,20,25,0.6)
- Button: similar to standard pill but slightly larger (use `.button-base.button-fill` with extra padding)
- Section bg: `#e6e6e4`

## Responsive
- Desktop (md+): 2 columns side-by-side with vertical divider
- Mobile: stacked, no divider, horizontal divider between blocks
