# NewsletterSection Specification

## Overview
- **Target file:** `src/components/NewsletterSection.tsx`
- **Interaction model:** static (with form submission, no-op for clone)
- **Screenshot:** docs/design-references/ss_1784784w6

## Container
- `<section class="relative grid grid-cols-12 py-16 md:py-20 lg:py-40 base-px base-gap-x">`
- White / default background

## Layout
- Centered content, `col-start-4 col-span-6` (occupies middle 6 columns of 12)
- All content centered horizontally? Actually looking at screenshot, content is left-aligned within the centered column
- Padding top extra to space from above section

## Content (verbatim)
- Heading (2 lines, manual line break):
  ```
  施工事例やイベント情報を
  メールでお届けします
  ```
  - Class: `text-[1.5rem] md:text-[1.75rem] font-normal leading-[1.5] mb-6`
- Body description: `モノクロームの製品情報をはじめ、未来に向けた豊かな暮らし方のヒントや、環境への取り組みまで、さまざまな情報をお届けします`
  - Class: `text-sm md:text-base leading-[1.8] text-black-60 mb-8`
- Email input + submit button

## Form
- `<form class="flex flex-col gap-3">`
- `<input type="email" placeholder="メールアドレスを入力してください" class="w-full h-12 px-5 rounded-full border border-black-10 bg-white text-base focus:outline-none focus:border-black">`
- `<button type="submit" class="w-full h-12 rounded-full bg-black text-white font-medium text-base">登録</button>`

## Computed styles
- Section padding: `py-16 md:py-20 lg:py-40` (64/80/160px)
- Heading: 28px @ desktop, 24px @ tablet, weight 400
- Body: 16px, weight 400, color rgba(20,20,25,0.6)
- Input: full width, 48px height, rounded-full, border 1px black-10
- Button: full width, 48px height, rounded-full, black bg, white text, font-medium

## Responsive
- Desktop: content in middle 6 columns
- Mobile: full width with horizontal padding
