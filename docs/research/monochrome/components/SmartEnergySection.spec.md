# SmartEnergySection Specification — "エネルギーをかしこく使う"

## Overview
- **Target file:** `src/components/SmartEnergySection.tsx`
- **Interaction model:** static + hover
- **Screenshot:** docs/design-references/ss_9933na8gz

## Container
- `<section class="relative pt-16 border-t md:pt-30 border-black-10 base-px py-16 md:py-20 lg:py-30">`
- Top border line `border-t border-black-10` (subtle separator from products section above)
- White bg

## Section header
- `<h2 class="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4]">エネルギーをかしこく使う</h2>`
- pb ~`pb-10`

## Card grid
- Desktop: `grid grid-cols-2 gap-x-6 lg:gap-x-8`
- Mobile: stacked single column

## Two product cards (similar structure to ProductsSection but no color dots)

### Card 1: Energy-1
- Title: `Energy-1` (left) — no tagline on right
- Image: `/images/products/energy_1.jpg` (3D black HEMS cube on light gray bg)
- Aspect: `aspect-[16/9]` or `aspect-[5/3]` — wider than products
- Below image flex row:
  - Left: subtitle `電力コストを下げ、災害時に家族を守るHEMS` (text-sm)
  - Right: `詳しく見る` (outline) + `相談する` (filled)

### Card 2: モノクローム電力
- Title: `モノクローム電力`
- Image: `/images/products/energy_2.jpg`
- Below image:
  - Left: subtitle `環境に貢献し、電気代がお得になる電力プラン`
  - Right: `詳しく見る` (outline) + `相談する` (filled)

## Card data
```ts
const SMART_ENERGY = [
  {
    name: "Energy-1",
    image: "/images/products/energy_1.jpg",
    imageAlt: "Energy-1 HEMS device",
    subtitle: "電力コストを下げ、災害時に家族を守るHEMS",
    detailHref: "/energy-1",
    consultHref: "/contact",
  },
  {
    name: "モノクローム電力",
    image: "/images/products/energy_2.jpg",
    imageAlt: "Monochrome electricity plan",
    subtitle: "環境に貢献し、電気代がお得になる電力プラン",
    detailHref: "/electricity",
    consultHref: "/contact",
  },
];
```

## Computed styles
- Same fonts as ProductsSection
- Section padding-top: 64px mobile, 120px desktop (`pt-16 md:pt-30`)
- Image aspect: ~`aspect-[5/3]` (wider than tall — cards are bigger)
- Card title: 28px font, weight 400

## Responsive
- Desktop: 2 columns
- Mobile: stacked, image full-width
