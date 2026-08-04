# SiteHeader + SiteFooter Specification

## Overview
- **Target files:** `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`
- **Interaction model:** SiteHeader = click-driven (mobile menu toggle). SiteFooter = static.
- **Used by:** all 9 routes — mounted in `src/app/layout.tsx`
- **Source:** exact declared rules from `review-showcase.webflow.*.opt.min.css`

---

## SiteHeader

### DOM structure
```
nav.fu-nav-1                        (fixed, full width)
  div.fu-nav__container-1           (max-w 1280, flex, space-between)
    a.fu-nav__logo-link  → "/"
      img.fu-nav__logo-1
    div.fu-nav__links-wrapper-1     (flex, gap 32)
      a.fu-nav__link-1 × 6
      a.fu-nav__call-btn-1          (red pill, phone icon + label)
    a.fu-nav__mobile-btn-1          (hamburger, hidden ≥992px)
```

### Computed styles — desktop

**`nav.fu-nav-1`**
- position: `fixed`; top/left/right: `0`; zIndex: `50`
- backgroundColor: `#000` — note: pure black, **not** the `#0f0f0f` used elsewhere
- borderBottom: `1px solid #ffffff1a`

**`.fu-nav__container-1`**
- display: `flex`; justifyContent: `space-between`; alignItems: `center`
- maxWidth: `1280px`; height: `112px`; margin: `0 auto`
- paddingLeft / paddingRight: `16px`
- fontFamily: `Inter, sans-serif` — the nav uses Inter, not the site body font

**`.fu-nav__logo-link`** — display: `flex`; alignItems: `center`; flexShrink: `0`; textDecoration: `none`

**`.fu-nav__logo-1`** — width: `auto`; height: `96px`; display: `block`

**`.fu-nav__links-wrapper-1`** — display: `flex`; alignItems: `center`; gap: `32px`

**`.fu-nav__link-1`**
- color: `#fffc` (white, 80%); fontSize: `14px`; fontWeight: `500`
- textDecoration: `none`; transition: `color .2s`

**`.fu-nav__call-btn-1`**
- display: `flex`; alignItems: `center`; gap: `8px`
- backgroundColor: `#bc1a1a`; color: `#fff`; borderRadius: `6px`
- height: `36px`; paddingLeft / paddingRight: `12px`
- fontSize: `14px`; fontWeight: `600`; whiteSpace: `nowrap`; textDecoration: `none`
- boxShadow: `0 4px 6px #0000004d`; transition: `filter .2s`

**`.fu-nav__mobile-btn-1`** — color: `#fff`; cursor: `pointer`; border: none; padding: `8px`; display: `none`

### Responsive

| Breakpoint | Changes |
|---|---|
| `≤991px` | container height → `64px`; logo `max-height: 36px`; **links wrapper `display: none`**; mobile button `display: block`, `background-color: #bc1a1a` |
| `≤767px` | container height → `56px`; logo `max-height: 32px`; mobile button `display: flex` |
| `≤479px` | container height → `56px`; logo `width: 76.7969px`; mobile button `background-color: transparent` |

Mobile-first Tailwind inversion: base = mobile (`h-14`), `md:` ≥768 (`h-16`), `lg:` ≥992 (`h-28`,
links visible, hamburger hidden).

### States & behaviors

**Mobile menu toggle** — the original drives this with `mobile_nav_toggle-1.0.0.js`.
- **Trigger:** click on `.fu-nav__mobile-btn-1`
- **Implementation:** React `useState` in a `"use client"` component. Panel drops below the bar
  containing the same six links plus the call CTA, full-width, on the `#000` surface.
- Close the panel on route change and on `Escape`.

**Link hover** — `color: #fffc` → `#fff`, `transition: color .2s`
**Call button hover** — `transition: filter .2s`; apply `filter: brightness(1.1)`

> The header is `position: fixed` with **no scroll-triggered state change** — no shrink, no
> background swap. Because it's fixed, every page needs top padding equal to the nav height
> (`112px` desktop / `64px` / `56px`) so content isn't obscured.

### Content — nav links, in order
| Label | href |
|---|---|
| Home | `/` |
| Services | `/#services` |
| Self-Employed Loans | `/self-employed-loans` |
| Low Doc Loans | `/low-doc-loans` |
| Calculators | `/calculators` |
| Contact | `/contact` |
| Call Now | `tel:0412885734` (with `PhoneIcon`) |

### Assets
- `public/images/fundup-logo.webp` (+ `-p-500`, `-p-800`, `-p-1080`, `-p-1600` variants)
  — intrinsic 1920×800, alt `"FundUp"`
- `PhoneIcon`, `MenuIcon` from `@/components/icons`

---

## SiteFooter

### Computed styles

**`footer.fu-footer`**
- backgroundColor: `#0f0f0f`
- borderTop: `1px solid #ffffff1a`
- paddingTop / paddingBottom: `40px`

> ⚠ At `≤767px` the source sets `margin-left: -20px; margin-right: -20px; padding-right: 0`,
> which pushes the footer outside the viewport and causes horizontal overflow on mobile.
> **Do not reproduce** — it's a layout bug. Use full-width with normal gutters.

### Content

Logo → `/` (same webp asset).

Links: Services `/#services` · Contact `/contact` · Self-Employed Loans `/self-employed-loans`
· Low Doc Loans `/low-doc-loans` · Calculators `/calculators` · Terms and Conditions
`/terms-and-conditions`

Three text blocks, verbatim:

> © 2026 FundUp. All rights reserved.

> Loan Ranger Finance Pty Ltd Trading as FundUp is a Credit Representative 571356 of LMG Broker
> Services Pty Ltd ACN 632 405 504 Australian Credit Licence 517192.

> The information provided on this site is on the understanding that it is for illustrative and
> discussion purposes only. Whilst all care and attention is taken in its preparation any party
> seeking to rely on its content or otherwise should make their own enquiries and research to
> ensure its relevance to your specific personal and business requirements and circumstances.
> Terms, conditions, fees and charges may apply. Normal lending criteria apply. Rates subject to
> change. Approved applicants only.

Text on the dark surface uses `#fffc` for links and `#fff9`-weight muted tone for the
disclaimer body. Footer does **not** link `/privacy-policy` — matches the original.
