# TourSection Specification — "見学会"

## Overview
- **Target file:** `src/components/TourSection.tsx`
- **Interaction model:** static
- **Screenshot:** docs/design-references/ss_2476gijlj

## Container
- `<section class="relative py-20 md:py-30 lg:py-40 bg-beige base-px">`
- Beige background (`#d6d3c4` — extracted)

## Section header
- `<h2 class="text-[2rem] font-normal mb-12">見学会</h2>` (top-left)

## Layout (2-col)
```
┌──────────────────┬──────────────────────────────────────┐
│                  │                                      │
│                  │  ただいま開催予定の見学会はございません。 │
│                  │                                      │
│   <event image>  │  最新のイベント情報はニュースレターにて   │
│                  │  配信を行なっております。               │
│                  │  また見学会に関するご質問は             │
│                  │  お問い合わせフォームよりお願いします。  │
│                  │                                      │
│                  │  [ニュースレター] [お問い合わせ]         │
└──────────────────┴──────────────────────────────────────┘
```

- Container: `grid grid-cols-12 gap-x-8 items-center`
- Image: `col-span-6 lg:col-span-5` `aspect-[4/3] overflow-hidden`
- Text: `col-span-6 lg:col-span-7 lg:pl-8`

## Image
- `/images/event.jpg` — wooden interior with seminar attendees
- `relative w-full h-full overflow-hidden` containing `<Image fill className="object-cover">`

## Text content (verbatim)
- Heading: `ただいま開催予定の見学会はございません。`
- Body (multi-line, line breaks `<br>` allowed):
  - `最新のイベント情報はニュースレターにて配信を行なっております。`
  - `また見学会に関するご質問はお問い合わせフォームよりお願いします。`
- Buttons row (gap-3):
  - `ニュースレター` → `/newsletter` — **filled black**
  - `お問い合わせ` → `/contact` — **filled black**

## Computed styles
- Heading: `text-[1.5rem] md:text-[1.75rem] font-normal leading-[1.5]`
- Body: `text-sm md:text-base leading-[1.8] text-black-60`
- Button gap: 16px
- Section heading "見学会": top-left, mb-12 to push content down

## Responsive
- Desktop: 2 columns side-by-side
- Mobile: stacked, image first, text below
