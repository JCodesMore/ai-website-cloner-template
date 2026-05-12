# Yodden Page Topology

Total page scroll height ≈ 7801px @ 1440 viewport. Eleven flow sections plus a fixed header.

## Section order (top → bottom)

| # | Component | Approx height (1440px) | Notes |
| --- | --- | --- | --- |
| 0 | `Header` (fixed) | 96px | Logo + 6 nav items with submenus + search icon + Free Quote pill. Transparent over hero, white once scrolled. |
| 1 | `HeroBanner` | 749px (full viewport) | 3-slide owl carousel, white text on dark image, big H1 with two-weight color split, two buttons, side arrow nav, decorative dot shapes |
| 2 | `ServicesGrid` | 582px | Heading on left, 2×2 grid of icon+title+blurb cards (Broadband, WIFI, Netfix, Satellite). First card has pink wash background. |
| 3 | `AboutUs` | 913px | Bg light. Left: image collage with 28+ years badge + video play overlay (Sandra Braun). Right: H2 + lead + 3 check items + video play CTA |
| 4 | `CounterStats` | 297px | Solid red bg, 4 odometer counters (268, 823, 252, 964) with labels and decorative pie/circle shapes |
| 5 | `WhyChooseUs` | 1073px | H2 centered, 3 features left-aligned, 3 features right-aligned, woman illustration in center |
| 6 | `OfferCallout` | 815px | Two-column overlap: dark left card with text+CTA, right photo with red triangle accents |
| 7 | `PricingPlans` | 1026px | H2 centered, 3 pricing cards (Internet $55, TV $75, Internet+TV $95-dark). Last card uses dark bg. |
| 8 | `Streaming` | 801px | Dark image bg with overlay, white H2, owl carousel of 5 visible stream cards with play buttons |
| 9 | `Blog` | 984px | H2 centered, 3 blog cards with date badge overlay, image, category tag, title, author footer |
| 10 | `SiteFooter` | 701px | Dark bg. Top row: logo + phone + email + location. Mid row: newsletter + Quick Links + Our Services + Schedule. Bottom bar: copyright + social icons |

## Layout architecture
- Native browser scroll (no Lenis or scroll-snap on page level)
- Page is a single column flow inside `body > .main-wrapper`
- Bootstrap 5 grid (12-col, `.container` 1320px max)
- Header is `position: fixed` once scrolled past hero
- Decorative shapes use `position: absolute` inside each `<section>` with `position: relative` on the section

## Dependencies between sections
- Header overlays Hero with transparent bg, so hero text must allow for `pt-30` to clear the nav
- Sections 6 (Offer) and 7 (Pricing) have `position-absolute` ambient dot+rectangle shapes that overflow into surrounding whitespace
- Section 5 (WhyChooseUs) has a `line-02.png` wave that extends below the section

## Interaction model summary
- **Hero:** owl-carousel auto-cycles every 7s with crossfade (`animateIn fadeIn / animateOut fadeOut`); left/right arrow nav buttons
- **Streaming carousel:** owl-carousel 5-up with 25px gap, autoplay 7s
- **Service cards:** hover scales the card and changes bg to active pink wash (first card is active by default)
- **Pricing cards:** hover lifts (translateY) + adds shadow
- **Blog cards:** image zoom on hover (1.05 scale within overflow-hidden)
- **Header:** adds `.fixedHeader` class on scroll (CSS class swap, no JS animation)
- **WOW.js:** staggered `fadeInUp` reveals on most cards with 200/400/600/800ms delays — we'll replicate with simple CSS @keyframes + IntersectionObserver, or skip for v1
- **Counter odometer:** odometer.js animates digits 0→target when in view
- **Logo swap:** `.logochange` class swaps `logo.png` and `logo-inner.png` between transparent-nav and fixed-nav states

## What we IGNORE
- `.buy-theme` and `.wlt-sidebar-main` (themeforest preview chrome)
- `#preloader` (page loader)
- Cookiebot iframe
- All inner pages (broadband.html, contactus.html etc.) — clone only `index.html`
