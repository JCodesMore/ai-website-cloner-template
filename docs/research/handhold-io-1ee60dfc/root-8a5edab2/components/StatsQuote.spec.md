# StatsQuote Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/StatsQuote.tsx`
- **Interaction model:** static

## DOM Structure
```
<div class="mx-auto flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-8">
  <div> stats column (2 stats stacked or side-by-side)
    <div> stat 1: "60%" + label
    <div> stat 2: "20%" + label
  <div> quote column
    <blockquote> quote text
    <div> attribution row: avatar + name + title
</div>
```

## Computed Styles

### Container
- max-width: `max-w-378` container, `px-4 lg:px-8` gutters, margin-inline: auto
- flex-direction: column on mobile, row on `md:`, `justify-content: space-between`, `align-items: flex-start`, gap: 48px (mobile) / 32px (desktop, `md:gap-8`)
- total block height ~116px on desktop (single-line stats + quote fit compactly)

### Stat number (e.g. "60%")
- font-family: Fraunces (serif), font-size: 40px, font-weight: 200, line-height: 40px (100%), letter-spacing: -1.2px, color: `#000`

### Stat label
- font-family: Inter, font-size: 14px, font-weight: 400, color: `text-content-secondary`, max-width ~160px

### Stats pair layout
- Two stat blocks side by side, gap ~32px

### Quote (`<blockquote>`)
- font-family: Inter, font-size: 16px, font-weight: 400, line-height: 24px, color: `#000`
- max-width: ~480px
- Wrapped in curly quotes as shown in content

### Attribution row
- flex row, gap: 12px, align-items: center, margin-top: 12px
- Avatar: 40px circle (`size-10`), `border border-border-strong rounded-full overflow-hidden`, image `object-cover`
- Name: Inter 14px font-weight 500 (medium), color `#000`
- Title: Inter 14px font-weight 400, color `text-content-secondary`
- Name/title stacked vertically, tight line-height

## Assets
- Avatar image: `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/alasdair.png` (40px circle crop)

## Text Content (verbatim)
- Stat 1: "60%" / "reduction in bad fit sales calls"
- Stat 2: "20%" / "month-on-month increase in total SQLs"
- Quote: "Our sales reps are less occupied with bad fit leads, creating extra capacity for outbound, and Handhold's agent has been super useful for coverage outside of regular business hours."
- Attribution: "Alasdair Reynolds" / "Head of Growth at Parim"

## Responsive Behavior
- **Desktop (1440px):** stats column and quote column side by side (row), stats fixed-width left, quote flexible right
- **Mobile (390px):** stacks to single column — stats pair first, quote block below, full width
- **Breakpoint:** 768px (`md`)
