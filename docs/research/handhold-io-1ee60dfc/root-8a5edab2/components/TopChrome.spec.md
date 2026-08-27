# TopChrome Specification (AnnouncementBar + Header)

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/TopChrome.tsx`
- **Interaction model:** static (header is `position: relative`, NOT sticky/fixed — confirmed via getComputedStyle before/after scroll, no change). Mobile nav collapses to hamburger below `md` (768px).
- Import `HandholdLogo` from `@/components/sites/handhold-io-1ee60dfc/shared/logos`.

## DOM Structure
```
<div> (page wrapper)
  <a> AnnouncementBar — full-width link banner
  <header> — logo left, nav right
</div>
```

## Computed Styles

### AnnouncementBar (`<a>`, full width, links to an announcement page — use `href="#"`)
- display: block, width: 100%
- background: `bg-[#F2F1ED]` → use `bg-surface-elevated`
- padding: `10px 16px` (`px-4 py-2.5`)
- hover: `hover:bg-[#E8E7E3]`, active: `active:bg-[#DFDEDA]` (slightly darker shades of the same beige — use `hover:brightness-95 active:brightness-90` or explicit arbitrary colors)
- text: centered, `font-size: 16px`, `font-weight: 400`, `font-family: Inter`, `line-height: 24px`, `color: rgb(0,0,0)`
- Content: "We raised €3M to grow your revenue on autopilot. " + underlined/emphasized "Read the announcement" inline

### Header
- height: 72px, `padding: 16px 32px` (`px-8 py-4` desktop, `px-4` mobile)
- `position: relative` — flex row, `justify-content: space-between`, `align-items: center`
- z-index: 30

### Logo (left)
- `<HandholdLogo className="h-5 w-36 text-black" />`

### Nav links (right, desktop only, hidden below `md`)
- flex row, gap ~24px, `align-items: center`
- "Resources" — text button with a small chevron-down icon (use lucide-react `ChevronDown`, size 16), `font-size: 16px`, `color: rgb(0,0,0)`, hover: `bg-surface-interactive-secondary-hover` on a rounded-md background pad (this is a dropdown trigger — for the clone, render as a static non-functional button, no need to build the actual dropdown menu content)
- "Sign in" — plain text link, same typography, hover background pill same as above
- "Try for free" — pill button: `bg-black text-white`, `border-radius: 9999px` (fully round), `padding: 8px 16px`, `font-size: 14px`, `font-weight: 400`, `line-height: 20px`, `letter-spacing: -0.13px`, hover: `bg-[--surface-interactive-primary-hover]`

### Mobile (below `md`)
- Nav links hidden, replaced by a single hamburger menu icon button (lucide-react `Menu`, size 24) at the right — no functional menu required, static icon is sufficient for the clone.

## Assets
- `HandholdLogo` from shared/logos.tsx (renders `<use>` against the downloaded sprite at `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/logo-sprite.svg#handhold-full`)
- Icons: lucide-react `ChevronDown`, `Menu`

## Text Content (verbatim)
- Announcement: "We raised €3M to grow your revenue on autopilot. Read the announcement"
- Nav: "Resources", "Sign in", "Try for free"

## Responsive Behavior
- **Desktop (1440px):** full nav links visible, `px-8` header padding
- **Tablet (768px):** same as desktop typically (Tailwind `md:` breakpoint = 768px is where mobile nav switches to desktop nav, so at exactly 768px+ show desktop links)
- **Mobile (390px):** `px-4` header padding, nav links replaced by hamburger icon; announcement bar text may wrap to 2 lines, keep centered
- **Breakpoint:** 768px (`md`)
