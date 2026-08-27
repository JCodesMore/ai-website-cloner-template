# Footer Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/Footer.tsx`
- **Interaction model:** static
- Import `HandholdLogo` from `@/components/sites/handhold-io-1ee60dfc/shared/logos`.

## DOM Structure
```
<div class="relative flex w-full flex-col gap-4 overflow-x-clip"> — footer wrapper, z-[-1] decorative images
  <img> hand-top-left.webp (absolute, top-left, z-index -1, decorative watercolor)
  <img> hand-bottom-right.webp (absolute, bottom-right, z-index -1, decorative watercolor)
  <div> CTA line: "Give a white glove experience to every prospect" + "Let's talk" button
  <p> legal disclaimer paragraph (2 paragraphs, small secondary text)
  <div> bottom row: logo + nav links (Sign in / Contact us / Careers) + Legal group (Privacy policy / Cookie policy / Responsible disclosure)
</div>
```

## Computed Styles

### Wrapper
- `position: relative`, `overflow-x: clip` (prevents the oversized decorative images from causing horizontal scroll)
- The two watercolor images are `position: absolute`, `z-index: -1` — purely decorative background texture, sit behind all footer text/content

### CTA line
- Text: Fraunces (serif) 28px/200/28px(100%)/-0.84px, `text-content-primary`, text-align: center
- "Let's talk" button below/beside: `bg-black text-white rounded-full`, padding `10px 20px`, font-size 14px, margin-top ~16px
- Whole block centered, generous vertical padding (`pt-20 md:pt-30` matches divider-adjacent wrapper spacing already accounted for by the page-level divider before this section)

### Legal disclaimer
- Two paragraphs, Inter 12-14px, `text-content-tertiary` (40% black, lightest secondary tone — this is fine-print), line-height ~18-20px, max-width ~900px, centered, margin-top ~32px

### Bottom nav row
- flex row, `justify-content: space-between`, `align-items: center`, padding-top ~32px (possibly a hairline border-top above it, consistent with other section dividers)
- Left: `HandholdLogo` (same as header, `h-5 w-36`)
- Center/right: two link groups
  - Group 1: "Sign in", "Contact us", "Careers" — Inter 14px/400, `text-content-secondary`, gap ~24px
  - Group 2 (labeled "Legal"): "Privacy policy", "Cookie policy", "Responsible disclosure" — same styling, possibly under a small "Legal" label/heading
- On mobile, stacks to column with center alignment

## Assets
- `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/hand-top-left.webp`
- `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/hand-bottom-right.webp`
- `HandholdLogo` from shared/logos.tsx

## Text Content (verbatim)
- CTA: "Give a white glove experience to every prospect"
- Button: "Let's talk"
- Legal paragraph 1: "Handhold ("Handhold") provides technology and AI-powered agents designed to help businesses engage visitors, qualify inbound leads, deliver personalized product experiences, and guide users through onboarding. Handhold is a software platform and does not provide sales, marketing, legal, or advisory services."
- Legal paragraph 2: "Any customer interactions, product information, or recommendations generated through Handhold agents are based on the configuration and data provided by the customer. Handhold does not control, verify, or guarantee the accuracy, completeness, or suitability of any information presented through its platform. By using this website or the Handhold platform, you acknowledge that all content is provided for informational and operational purposes only and agree to our Terms of Use and Privacy Policy."
- Nav group 1: "Sign in", "Contact us", "Careers"
- Nav group 2 ("Legal"): "Privacy policy", "Cookie policy", "Responsible disclosure"

## Responsive Behavior
- **Desktop (1440px):** as described, bottom row is a single flex row
- **Mobile (390px):** bottom row stacks — logo, then link groups, all centered; watercolor images scale down/crop but stay decorative behind content
- **Breakpoint:** 768px (`md`)
