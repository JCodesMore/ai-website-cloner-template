# SiteHeader Specification

## Overview
- **Target file:** `src/components/SiteHeader.tsx`
- **Interaction model:** scroll-driven (background color & shadow change after scrolling)
- **Component type:** Client component (`"use client"`) — needs scroll listener

## Structure
A fixed-position bar at the top of the page that spans the full viewport width.
Three columns inside a fluid container:
1. **Logo** (left): `<LogoMark/>` from `@/components/icons` + bold "YODDEN" wordmark with "GET CONNECTED" small caps under.
2. **Nav links** (center): 6 top-level items: HOME, PAGES, SERVICES, PORTFOLIO, BLOG, CONTACT. First five have submenus (use `<ChevronDownIcon/>`); CONTACT is a leaf. Import `NAV_LINKS` from `@/lib/content`. Submenus open on hover, positioned absolutely under the parent, white card, list of links, fade-in.
3. **Right cluster:** `<SearchIcon/>` button + red pill button "FREE QUOTE" using `.yo-btn .yo-btn-primary`.

Container: `.yo-container` wider variant — use `max-width: 1320px`, padding handled by `.yo-container`.

## Computed styles
- Header height: 96px (89px content + 7px border-bottom)
- Header background: transparent over hero, white once scrolled past 100px
- Border-bottom: `1px solid rgba(0, 0, 0, 0.08)` (only in scrolled state)
- Z-index: 99999 (sits over everything)
- Nav link: 16px / weight 700 / uppercase / letter-spacing 0.8px / color `#010101` (or white over hero)
- Nav link padding: 21px 8px
- Submenu items: 14.4px / weight 600 / color `#42545e`, hover color `#df0303`
- Logo width: ~226px desktop, ~180px mobile

## Scroll behavior
- **State A (top):** background transparent, text white. Logo: bright/white variant `logo.png` (use the public/img/logos/logo.png). 
- **State B (scrolled ≥ 100px):** background white, text dark `#010101`, shadow `0 4px 20px rgba(0,0,0,0.05)`. Logo: dark variant `logo-inner.png`.
- Transition: `background 0.3s ease, color 0.3s ease`

## Submenu (dropdown)
- Triggered on hover (desktop) — `:hover` reveals
- White bg, 8px radius, 10px 0 padding, soft shadow `0 8px 30px rgba(0,0,0,0.1)`
- Items: 10px 24px padding, 14px font, no underline, hover: red text
- Width: min 200px

## Mobile
- Below 992px, the nav links collapse behind a hamburger button (3 horizontal bars) on the right.
- Mobile menu drawer slides down from top, full width, vertical stack.

## Implementation notes
- Use `useEffect` to add a scroll listener, set `scrolled` boolean state.
- Use `next/image` for both logo PNGs.
- The "FREE QUOTE" pill is always white-on-red regardless of scroll state.

## Data
Import: `NAV_LINKS` from `@/lib/content`.
Logos: `/img/logos/logo.png` (transparent-bg version) and `/img/logos/logo-inner.png` (color version).
