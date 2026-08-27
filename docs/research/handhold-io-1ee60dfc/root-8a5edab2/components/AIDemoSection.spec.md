# AIDemoSection Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/AIDemoSection.tsx`
- **Interaction model:** static (no scroll/click behavior observed)

## DOM Structure
```
<div class="relative overflow-hidden rounded-2xl bg-[#f2f1ed]"> — big card, 1376x584 desktop
  <div> eyebrow "AI Demo"
  <h2> "See Handhold in action"
  <p> "Let our agent walk you through our product"
  <button> "Start demo"
  <img> demo-bot.webp (large product-mockup image, top-center, w-230/md:w-245, pointer-events-none)
  <img> x5 demo-orb.webp (small decorative circular blob/orb images, absolutely positioned at various corners: top-left ~8%/5%, top-25%/28%, top-15%/right-18%, bottom-12%/left-4%, bottom-12%/right-2% — each a soft blurred color-blob circle, sizes ranging ~44px to ~200px, `rounded-full overflow-hidden`)
</div>
```

## Computed Styles

### Card container
- background: `#f2f1ed` (`bg-surface-elevated`)
- border-radius: 24px (`rounded-2xl`)
- width: 100% of `max-w-378` container, height: 584px desktop (content-driven, not fixed — let content set height with padding)
- position: relative, overflow: hidden
- padding: generous top padding (~40-56px) for the text content before the image mockup begins

### Eyebrow ("AI Demo")
- font-family: Inter, font-size: 14px, font-weight: 500, letter-spacing: uppercase-ish tracking, color: `text-content-secondary`, small pill or plain label above the heading

### Heading ("See Handhold in action")
- font-family: Fraunces (serif), font-size: 40px, font-weight: 200, line-height: 40px, letter-spacing: -1.2px, color: `#000`, text-align: center

### Body ("Let our agent walk you through our product")
- font-family: Inter, font-size: 16px, font-weight: 400, color: `text-content-secondary`, text-align: center, margin-top: 8px

### "Start demo" button
- `bg-black text-white rounded-full`, padding `10px 20px`, font-size 14px, margin-top: 24px, centered

### demo-bot.webp mockup image
- positioned absolute, `top: 40px` mobile / `top: 30px` desktop, width `w-230` (920px) mobile-scale / `md:w-245` (980px) — i.e. it's an oversized image bleeding past the card edges at the bottom, `pointer-events-none`
- aspect ratio ~1960:1017 (roughly 1.93:1)

### demo-orb.webp instances (5x, decorative blob orbs)
- all use the same source image (`demo-orb.webp`, natural 3024x1588 — a soft blurred gradient blob, cropped to circle), `rounded-full overflow-hidden pointer-events-none absolute`
- positions or (approximate, use these Tailwind arbitrary-value patterns directly):
  1. `top-[5%] left-[8%] h-17.5 w-15.5 md:h-28.5 md:w-27.25` (hidden below `2xs`)
  2. `top-[25%] left-[28%] h-11 w-9.75 md:h-17.5 md:w-15.5` (hidden below `sm`)
  3. `top-[15%] right-[18%] h-12.5 w-10.5 md:h-19.75 md:w-16.5` (hidden below `2xs`)
  4. `bottom-[12%] left-[4%] h-30 w-29.5 md:bottom-[8%] md:h-48.5 md:w-49` (hidden below `2xs`)
  5. `right-[2%] bottom-[12%] h-32.5 w-13 md:bottom-[8%] md:h-52.5 md:w-20.75` (hidden below `xs`)

## Assets
- `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/demo-bot.webp`
- `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/demo-orb.webp` (reused 5x)
- Use Next.js `<Image>` with `fill` or explicit width/height matching natural sizes (1960x1017 for demo-bot, 3024x1588 for demo-orb), `unoptimized` not required — local images.

## Text Content (verbatim)
- Eyebrow: "AI Demo"
- Heading: "See Handhold in action"
- Body: "Let our agent walk you through our product"
- Button: "Start demo"

## Responsive Behavior
- **Desktop (1440px):** as described, `md:` sizes apply
- **Mobile (390px):** smaller orb sizes per the arbitrary classes above, some orbs hidden entirely (`max-2xs:hidden`, `max-xs:hidden`, `max-sm:hidden` breakpoints — treat `2xs`≈375px, `xs`≈420px, `sm`=640px as approximate cutoffs, or simplify by just hiding the smallest/least visible orbs below 400px if custom breakpoints aren't configured)
- **Breakpoint:** 768px (`md`) for main scaling; smaller custom breakpoints for orb visibility are a nice-to-have, not critical
