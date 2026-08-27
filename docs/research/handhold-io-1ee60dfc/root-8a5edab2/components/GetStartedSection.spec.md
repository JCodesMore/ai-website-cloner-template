# GetStartedSection Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/GetStartedSection.tsx`
- **Interaction model:** static

## DOM Structure
```
<div> heading: "Get started in minutes"
<div class="grid grid-cols-1 gap-6 pb-8 md:grid-cols-[0.45fr_1fr] md:gap-10">
  <div> numbered steps list (3 items) + CTA button + caption
  <img> how-to-get-started.png (rounded-3xl card, aspect-988/541)
</div>
```

## Computed Styles

### Heading ("Get started in minutes")
- Fraunces 40px/200/40px/-1.2px, `#000`, `padding-bottom: 64px` before the grid below

### Steps list
- Each step: flex row, gap ~16-20px, align-items: flex-start, margin-bottom ~24px between steps
- Step number ("1.", "2.", "3."): Fraunces serif, 40px/200/40px/-1.2px (large, matches stat-number scale), `#000`, fixed width column (~48px) for alignment
- Step text: Inter 16px/400/24px, `#000`, max-width ~320px

### CTA + caption (below the 3 steps)
- Button "Get started": `bg-black text-white rounded-full`, padding `10px 20px`, font-size 14px
- Caption below button: Inter 14px/400, `text-content-secondary`, "First version ready in minutes, go live in 1-3 days"

### Image column
- `how-to-get-started.png`, container: `bg-surface-elevated rounded-3xl overflow-hidden`, `aspect-988/541` (≈1.826:1), `h-full w-full`
- Use Next.js `<Image>` filling the container, `object-cover`

## Assets
- `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/how-to-get-started.png`

## Text Content (verbatim)
- Heading: "Get started in minutes"
- Step 1: "Link your website & knowledge base"
- Step 2: "Handhold generates the agents, you refine their goals and messaging"
- Step 3: "Deploy with a simple code snippet"
- Button: "Get started"
- Caption: "First version ready in minutes, go live in 1-3 days"

## Responsive Behavior
- **Desktop (1440px):** grid `[0.45fr_1fr]` — steps column narrower left, image wider right
- **Mobile (390px):** single column, steps list first, image below (or per DOM `md:order-3` on the image, — on mobile it's `order-1`, meaning image appears FIRST before text on mobile; follow the actual class: image div has `order-1 md:order-3 md:row-span-2 md:row-start-1` — so on mobile the image shows first, then steps text below)
- **Breakpoint:** 768px (`md`)
