# HeroSection + TrustBar Specification

## Overview
- **Target files:** `src/components/HeroSection.tsx`, `src/components/TrustBar.tsx`
- **Used by:** `/` only
- **Interaction model:** HeroSection = entrance animation on load. TrustBar = static.

> **Font note:** these bespoke `fu-` sections use **Inter**, not the Flowkit body font.
> Use `font-inter` (mapped in `globals.css` to `--font-inter`), not the default `font-sans`.

---

## HeroSection — `section#home.fu-hero-embed`

### DOM structure
```
section#home.fu-hero-embed          (relative, overflow hidden)
  div.fu-hero-embed__bg             (absolute inset-0, z-0, background-image)
  div.fu-hero-embed__overlay        (absolute inset-0, z-1, gradient)
  div.fu-hero-embed__content        (relative, z-10, animated)
    p.fu-hero-embed__eyebrow
    h1.fu-hero-embed__h1            (contains span.fu-hero-embed__accent)
    p.fu-hero-embed__body
    p.fu-hero-embed__trust
    div.fu-hero-embed__ctas
      a.fu-hero-embed__btn-primary
      a.fu-hero-embed__btn-ghost
```

### Computed styles

**`.fu-hero-embed`**
- backgroundColor: `#121212`  ← a *third* dark value, distinct from `#000` (nav) and `#0f0f0f`
- display: `flex`; justifyContent: `center`; alignItems: `center`
- minHeight: `40vh`; paddingTop: `140px`; paddingBottom: `80px`
- position: `relative`; overflow: `hidden`; transform: `translate(0)` (creates stacking context)

**`.fu-hero-embed__bg`** — position: `absolute`; inset: `0`; zIndex: `0`
- backgroundImage: `url(/images/hero-bg-desktop.webp)`
- backgroundRepeat: `no-repeat`; backgroundSize: `cover`
- **`≤479px` swaps to `/images/hero-bg-mobile.jpg`**

**`.fu-hero-embed__overlay`** — position: `absolute`; inset: `0`; zIndex: `1`
- backgroundImage: `linear-gradient(#000000bf, #000000a6)`
- border: `1px solid #6d5555` ← visible 1px reddish-grey outline around the hero; reproduce it

**`.fu-hero-embed__content`**
- position: `relative`; zIndex: `10`; textAlign: `center`
- width: `100%`; maxWidth: `768px`; margin: `0 auto`; padding: `0 16px`
- **animation: `.7s ease-out forwards heroSlideUp`** (keyframe already in `globals.css`)

**`.fu-hero-embed__eyebrow`**
- color: `#bfbfbf`; fontFamily: `Inter`; fontSize: `12px`; fontWeight: `600`
- letterSpacing: `.15em`; textTransform: `uppercase`; margin: `0 0 16px`

**`.fu-hero-embed__h1`**
- color: `#fff`; fontFamily: `Inter`; fontSize: `60px`; fontWeight: `700`; lineHeight: `1.1`
- margin: `0 0 24px`

**`.fu-hero-embed__accent`** — color: `#bc1a1a`

**`.fu-hero-embed__body`**
- color: `#fffc`; fontFamily: `Inter`; fontSize: `14px`; fontWeight: `400`; lineHeight: `1.6`
- maxWidth: `672px`; margin: `0 auto 16px`

**`.fu-hero-embed__trust`**
- color: `#bc1a1a`; fontFamily: `Inter`; fontSize: `14px`; fontWeight: `600`; margin: `0 0 32px`

**`.fu-hero-embed__ctas`** — display: `flex`; flexWrap: `wrap`; justifyContent/alignItems: `center`; gap: `16px`

**`.fu-hero-embed__btn-primary`**
- display: `inline-flex`; alignItems: `center`; gap: `10px`
- backgroundColor: `#bc1a1a`; color: `#fff`; borderRadius: `8px`
- height: `52px`; padding: `0 32px`
- fontFamily: `Inter`; fontSize: `15px`; fontWeight: `700`; whiteSpace: `nowrap`
- boxShadow: `0 4px 20px #0000004d`

**`.fu-hero-embed__btn-ghost`**
- display: `inline-flex`; justifyContent/alignItems: `center`
- backgroundColor: `transparent`; color: `#bc1a1a`; border: `2px solid #bc1a1a`; borderRadius: `8px`
- height: `52px`; padding: `0 32px`
- fontFamily: `Inter`; fontSize: `15px`; fontWeight: `700`; whiteSpace: `nowrap`

### Responsive
`≤479px`: `.fu-hero-embed` → `min-height: auto`, `padding-top: 100px`, `padding-bottom: 60px`.
Scale the `60px` h1 down for mobile (the source's `fu-` sections don't define an explicit mobile
h1 size here — use `clamp()` or Tailwind steps so it doesn't overflow at 390px).

### Text content (verbatim)
- Eyebrow: `AUSTRALIAN MORTGAGE BROKER`
- H1: `Funding solutions for wealth building Australians` — the accent span wraps the
  portion rendered in red; confirm the exact split against the cached HTML
- CTAs: primary → `#bpa-consent2`, ghost → `tel:0412885734`

### Assets
`public/images/hero-bg-desktop.webp`, `public/images/hero-bg-mobile.jpg`

---

## TrustBar — `section.trust-bar`

### Computed styles

**`.trust-bar`** — backgroundColor: `#0f0f0f`; borderBottom: `1px solid #ffffff1a`;
paddingTop/paddingBottom: `24px`

**`.trust-bar_container`** — maxWidth: `1280px`; margin: `0 auto`; paddingLeft/Right: `16px`

**`.trust-bar_grid`** — display: `grid`; gridTemplateColumns: `1fr 1fr 1fr 1fr`;
gridAutoRows: `minmax(55px, 1fr)`; gap: `24px`

**`.trust-bar_stat`** — display: `flex`; justifyContent/alignItems: `center`; gap: `12px`

**`.trust-bar_stat-text`** — display: `flex`; flexDirection: `column`; gap: `2px`

**`.stat-number`** — color: `#fff`; fontSize: `18px`; fontWeight: `700`; lineHeight: `1`; margin: `0`

**`.stat-label`** — color: `#fff9`; fontFamily: `Inter`; fontSize: `12px`; margin: `0`

### Content — four stats, each with a leading icon
| Value | Label |
|---|---|
| 40+ | Lenders Compared |
| 500+ | Clients Helped |
| 24hr | **Turnaround** ← the live site duplicates "Lenders Compared" here; fixed per `FIXES.md` #5 |
| 10+ | Yrs Industry Experience |

### Responsive
Four columns collapse on narrow viewports — grid should go `grid-cols-2` below `md` so the
stats stay legible at 390px rather than crushing to 4-up.
