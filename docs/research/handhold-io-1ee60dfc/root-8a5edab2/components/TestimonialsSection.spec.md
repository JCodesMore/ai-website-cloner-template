# TestimonialsSection Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/TestimonialsSection.tsx`
- **Interaction model:** static

## DOM Structure
```
<section class="mx-auto flex w-full max-w-378 flex-col gap-8 px-4 lg:px-8">
  <h4> "What our customers say about us"
  <div class="grid"> 3 testimonial cards
</section>
```

## Computed Styles

### Heading (`<h4>`)
- font-family: Fraunces (serif), font-size: 20px, font-weight: 200, line-height: 20px (100%), letter-spacing: -0.6px
- color: `text-content-secondary` (55% black — muted, not full black, confirmed via computed style)

### Card grid
- `grid-cols-1 md:grid-cols-3`, gap ~24px

### Each card
- `bg-surface-elevated rounded-3xl p-8` (32px radius, 32px padding) — consistent with other card treatments sitewide
- flex column, gap ~24px between quote and attribution
- Quote: Inter 16px/400/24px, `#000`
- Attribution row: flex row, gap 12px, align-items center
  - Avatar: 48px circle (`size-12`), `border border-border-strong rounded-full overflow-hidden`, `object-cover`
  - Name: Inter 14px/500, `#000`
  - Title: Inter 14px/400, `text-content-secondary`

## Assets
- Avatars: `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/alasdair.png`, `arthur.png`, `anette.png` (48px circle crop each)

## Text Content (verbatim, 3 cards)
1. Quote: "We're seeing a very positive impact. Sales reps are less occupied with bad fit leads, creating extra capacity for outbound & Handhold's agent has been super useful for coverage outside of regular business hours. The team is a pleasure to work with & ships improvements rapidly." — Name: "Alasdair Reynolds" — Title: "Head of Growth at Parim"
2. Quote: "Our demo agent helps leads quickly validate whether Parcel Tracker is the right fit for them, so when they appear in our CRM, our sales team has the context required to bring them over the line." — Name: "Arthur Zargaryan" — Title: "CEO at Parcel Tracker"
3. Quote: "Handhold helps our website visitors discover the depth of Finbite's platform in their own language. It's an efficient tool for capturing leads and gathering user insights in every region we operate." — Name: "Anette Tenison Lõhmus" — Title: "Marketing Manager at Finbite"

## Responsive Behavior
- **Desktop (1440px):** 3-column grid
- **Mobile (390px):** single column, cards stacked full-width
- **Breakpoint:** 768px (`md`)
