# SiteHeader Specification

## Overview
- **Target file:** `src/components/SiteHeader.tsx`
- **Interaction model:** static-at-top + scroll-up-reveal (TWO surfaces)
- **Screenshots:** docs/design-references/ss_6121facf8 (top), ss_123176h8e (scroll-up reveal)

## Architecture
The page renders TWO header surfaces with identical content:
1. **In-page top bar** — sits inside the layout above hero, naturally scrolls away.
2. **Fixed reveal-on-scroll-up header** — `<header class="fixed z-[9999] top-0 left-0 right-0 will-change-transform text-black">`, hidden by default with `transform: translateY(-80px)`, slides in to `translateY(0)` when the user scrolls UP. At top of page (scrollY=0) it is hidden.

Implement BOTH. The in-page version is just absolutely-positioned at the top of the layout flow; the fixed version is a separate `<header>` controlled by a scroll hook.

## Content (verbatim, copy-paste exactly)
- Logo wordmark: "Monochrome" + small monogram (use `MonochromeLogo` from `@/components/icons`) → `href="/"`
- Nav links (only shown >= lg):
  - 製品情報 → `/#products`
  - ジャーナル → `/journal`
  - ニュース → `/press`
- CTA pill buttons (right side):
  - お問い合わせ → `/contact` — **filled black** style (`button-base button-fill`)
  - 製品資料一覧 → `/download` — **outline** style (`button-base button-outline`)
- Hamburger button (always visible, opens menu — for the clone, just a no-op button using `HamburgerIcon`)

## Layout
- Total height: 80px (use the `--header-height: 5rem` CSS variable)
- Padding: `base-px` horizontal, `py-5` vertical (40px → 80px height with content)
- Grid: logo left | nav center | CTAs + hamburger right
- Use `flex items-center justify-between` with the nav absolutely centered (or use grid)
- At desktop, the nav is centered between logo and CTAs

## Computed styles (from getComputedStyle)
- Body font: `YakuHanJP, neue-haas-unica, sans-serif` → use `var(--font-sans)` (already set in globals)
- Logo wordmark: ~24px medium weight, tracking-tight
- Nav link: `font-size 14px`, `color #141419`, `font-weight 400`
- CTA button (filled): `font-size 12.5px`, `font-weight 500`, `color white`, `bg #000`, `border 1px solid rgba(255,255,255,0.2)`, `border-radius 9999px`, `padding 0 20px`, `height ~36px`
- CTA button (outline): `border 1px solid #141419`, `color #141419`, `bg transparent`
- Hamburger icon: 32x16, 1px stroke

## Behaviors

### Scroll-up reveal (fixed header only)
- **Hidden state:** `translate-y-[-80px]`
- **Visible state:** `translate-y-0`
- **Trigger:**
  - At `window.scrollY <= 0`: hidden
  - When scrolling DOWN: hidden
  - When scrolling UP past ~10px delta from last position: revealed
  - When near bottom (within 200px): hidden (so footer is unobstructed)
- **Transition:** `transition: transform 400ms var(--ease-out-expo)`
- Implementation: a `useEffect` hook tracking `window.scrollY`, comparing with previous value, toggling state.

### Mobile (< lg)
- Nav links hidden
- CTAs hidden (only show hamburger)
- The mobile floating bottom bar (`fixed bottom-0 ...`) shows the same CTAs — but for this clone, you can keep the CTAs in the top fixed bar at md, then hide on smaller screens.

## Implementation skeleton
```tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MonochromeLogo, HamburgerIcon } from "@/components/icons";

const NAV = [
  { href: "/#products", label: "製品情報" },
  { href: "/journal",   label: "ジャーナル" },
  { href: "/press",     label: "ニュース" },
];

function HeaderInner({ tone = "light" }: { tone?: "light" | "dark" }) { /* ... */ }

export function SiteHeader() {
  // 1) In-page bar (always rendered, static)
  // 2) Fixed reveal-on-scroll-up bar
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => { /* logic */ setShown(...); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (<>{/* in-page */}<header className={cn("fixed z-[9999] ... transform transition-transform duration-400 ease-out-expo", shown ? "translate-y-0" : "-translate-y-full")}>{/* same content */}</header></>);
}
```

## Responsive
- Desktop (>=1024px): nav visible, both CTAs visible, hamburger visible
- Tablet/mobile (<1024px): nav hidden, CTAs may collapse, hamburger always visible
