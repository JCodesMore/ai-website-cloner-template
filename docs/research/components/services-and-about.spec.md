# ServicesGrid + AboutNed Specification

## Overview
- **Target files:** `src/components/ServicesGrid.tsx`, `src/components/AboutNed.tsx`
- **Used by:** `/` **and** `/services` — the markup and copy are byte-identical on both pages
  (verified by diffing the two cached HTML documents; the only deltas are (a) the DOM position
  of the `01` ghost numeral and (b) `.webp` vs `.jpg` for the headshot).
- **CSS source:** both pages load the same rules — the extraction from
  `review-showcase.webflow.69e063091da62a1e076d275f.624df7b9c.opt.min.css` (home bundle) and
  `…69e838ff254b87943e7db7d6.8b4efbed1…` (services bundle) is identical, zero differences.
- **Interaction model:** ServicesGrid = CSS-only hover states. AboutNed = fully static.

> **Font note:** the live `body` rule in the page bundle is
> `body{color:#333;font-family:Inter,sans-serif;font-size:14px;line-height:20px}`.
> Every element in both sections is therefore Inter — including the ones that never declare
> `font-family` themselves (`.about-subtitle`, `.about-feature_title`, `.about-section_badge`).
> Use `font-inter` at the section level. Our `globals.css` puts `h1–h6` on `--font-heading`
> (Plus Jakarta Sans), so the two `h2`s and the six `h3`s need `font-inter` explicitly.

> **Webflow base-reset inheritance.** `review-showcase.webflow.shared.962c37592.min.css` supplies
> defaults the section rules never override, and they are load-bearing:
> - `h1,h2,h3,h4,h5,h6{margin-bottom:10px;font-weight:700}`
> - `h2{margin-top:20px;font-size:32px;line-height:36px}`
> - `h3{margin-top:20px;font-size:24px;line-height:30px}`
> - `p{margin-top:0;margin-bottom:10px}`
>
> Consequences reproduced in the components:
> 1. `.services-section_h2-1` and `.about-h2` keep **`margin-top: 20px`**. Adjacent-sibling margin
>    collapsing against the preceding eyebrow (`margin-bottom` 12px / 8px) yields a **20px** gap,
>    not 12px / 8px.
> 2. `.services-card_title` keeps **`line-height: 30px`** (h3 base) at an 18px font size, and keeps
>    `margin-top: 20px` — which collapses against `.services-card_icon-wrap`'s 24px bottom margin
>    to **24px**.
> 3. Elements with no `line-height` inherit the body's **`20px`** (absolute, not unitless):
>    `.about-subtitle`, `.about-feature_title`, `.about-section_badge`.
>
> Tailwind Preflight zeroes heading/paragraph margins, so all of the above are set explicitly.

---

## ServicesGrid — `section#services.services-section`

### DOM structure
```
section#services.services-section                    (relative, overflow hidden)
  div.services-section_container                     (1280 max-w, 16px gutters)
    div.services-section_header-1
      p.services-section_eyebrow-1
      h2.services-section_h2-1
        (text) "Lending solutions" <br/>
        span.services-section_h2-accent              "across the board"
      p.services-section_subtext-1                   (right-aligned, ml:auto)
    div.services-section_grid                        (3-col, 1px gaps, radius 16, clipped)
      a.services-card.w-inline-block   (card 01 only — the rest are plain divs)
        span.services-card_ghost-number
        div.services-card_body
          div.services-card_icon-wrap  > svg 20x20
          h3.services-card_title
          p.services-card_text
      div.services-card  x5
  script                                             (injects the hover CSS — see below)
```

> The source renders `span.services-card_ghost-number` **after** `div.services-card_body` on card 01
> on the homepage, but **before** it on every other card and on all six cards on `/services`.
> The span is absolutely positioned with `z-index: 0` against a `z-index: 10` body, so order is
> visually inert. The component always emits it first.

### Computed styles (verbatim from the minified bundle)

**`.services-section`**
- backgroundColor: `#0f0f0f`; paddingTop / paddingBottom: `96px`
- position: `relative`; overflow: `hidden`

**`.services-section_container`** — maxWidth: `1280px`; margin: `0 auto`; paddingLeft/Right: `16px`
→ exactly the `.container-site` utility already in `globals.css`.

**`.services-section_header-1`** — textAlign: `left`; marginBottom: `64px`

**`.services-section_eyebrow-1`**
- color: `#bc1a1a`; fontFamily: `Inter`; fontSize: `12px`; fontWeight: `600`
- letterSpacing: `.15em`; textTransform: `uppercase`; marginBottom: `12px`

> Do **not** use the `.eyebrow` component class from `globals.css` here — it is `0.9rem` / `.01em`,
> a different (Flowkit) eyebrow. This section's eyebrow is `12px` / `.15em`.

**`.services-section_h2-1`**
- color: `#fff`; fontFamily: `Inter`; fontSize: `44px`; fontWeight: `700`; lineHeight: `1.15`
- marginBottom: `0`; marginTop: `20px` (inherited from the Webflow `h2` reset)

**`.services-section_h2-accent`** — color: `#bc1a1a`

**`.services-section_subtext-1`**
- color: `#fff9`; fontFamily: `Inter`; fontSize: `14px`; lineHeight: `1.6`
- textAlign: `right`; maxWidth: `448px`; marginLeft: `auto`

**`.services-section_grid`**
- display: `grid`; gridTemplateColumns: `1fr 1fr 1fr`
- gridColumnGap / gridRowGap: `1px`  ← the 1px gap *is* the hairline; the grid's own
  `background-color: #ffffff1a` shows through it. There are no card borders.
- backgroundColor: `#ffffff1a`; borderRadius: `16px`; overflow: `hidden`

**`.services-card`**
- cursor: `pointer`; color: `inherit`; textDecoration: `none`; display: `block`
- backgroundColor: `#0f0f0f`; padding: `40px`; position: `relative`
- fontFamily: `Inter`

**`.services-card_ghost-number`**
- position: `absolute`; top: `16px`; right: `24px`; zIndex: `0`
- color: `#ffffff0a`; fontFamily: `Inter`; fontSize: `72px`; fontWeight: `700`; lineHeight: `1`
- userSelect: `none`; **transition: `color .5s`**

**`.services-card_body`** — position: `relative`; zIndex: `10`

**`.services-card_icon-wrap`**
- color: `#bc1a1a`; border: `1px solid #bc1a1a4d`; borderRadius: `50%`
- display: `flex`; justifyContent / alignItems: `center`; width / height: `44px`
- marginBottom: `24px`; **transition: `all .5s`**

**`.services-card_title`**
- color: `#fff`; fontFamily: `Inter`; fontSize: `18px`; fontWeight: `700`; marginBottom: `12px`
- lineHeight: `30px` + marginTop: `20px` (both from the Webflow `h3` reset)
- **no transition declared** → its hover colour change is instantaneous

**`.services-card_text`**
- color: `#ffffff8c`; fontFamily: `Inter`; fontSize: `14px`; lineHeight: `1.65`; margin: `0`

### Hover behaviour

`services_card_hover_effects-1.0.0.js` is a single inline IIFE that appends a `<style>` element.
Its full payload, lifted verbatim from the cached HTML:

```css
.services-card:hover .services-card_ghost-number { color: rgba(188,26,26,0.10); }
.services-card:hover .services-card_icon-wrap   { border-color: #BC1A1A; background-color: rgba(188,26,26,0.10); }
.services-card:hover .services-card_title       { color: #BC1A1A; }
```

Plus the one rule that lives in the stylesheet proper:

```css
.services-card:hover { background-color: #ffffff0d; transition: background-color .3s; }
```

There is no JS behaviour beyond injecting that stylesheet — **it is reproducible as pure CSS**,
which is what the component does (`group` / `group-hover:`).

Timing, precisely:

| Element | Rest | Hover | Transition |
|---|---|---|---|
| card background | `#0f0f0f` | `#ffffff0d` | `background-color .3s` — **declared inside `:hover` only**, so it eases *in* over 300ms and snaps *back* instantly |
| ghost numeral | `#ffffff0a` | `rgba(188,26,26,0.10)` | `color .5s` (base rule → both directions) |
| icon wrap | border `#bc1a1a4d`, no fill | border `#bc1a1a`, fill `rgba(188,26,26,0.10)` | `all .5s` (base rule → both directions) |
| title | `#fff` | `#bc1a1a` | none — instant |

The asymmetric card-background transition is reproduced literally with a hover-scoped arbitrary
property (`hover:[transition:background-color_.3s]`) rather than a base `transition-colors`.

### Responsive overrides

| Query | Rule |
|---|---|
| `max-width: 991px` | `.services-section_h2-1 { font-size: 36px }` |
| `max-width: 991px` | `.services-section_grid { grid-template-columns: 1fr 1fr }` |
| `max-width: 767px` | `.services-section_grid { grid-template-columns: 1fr }` |
| `max-width: 767px` | `.services-card { padding: 32px }` |
| `max-width: 479px` | `.services-section_grid, .services-card { pointer-events: none }` |

Inverted to Tailwind's mobile-first variants:
`grid-cols-1` → `md:grid-cols-2` (≥768px) → `min-[992px]:grid-cols-3` (≥992px);
`p-8` → `md:p-10`; `text-[36px]` → `min-[992px]:text-[44px]`.
(`lg:` is 1024px in Tailwind and would miss the 992–1023px band, hence `min-[992px]:`.)

### Known defects (and what the component does instead)

1. **`/services/first-home-buyers` 404s.** Card 01 is the only linked card on the live site and its
   destination does not exist. → **retargeted to `/contact`.** The other five cards stay unlinked
   (plain `div`s) exactly as the original has them, `cursor: pointer` and all.
2. **`pointer-events: none` at ≤479px.** Applied to both the grid and the cards, this exists only to
   suppress sticky `:hover` on touch devices — but it also makes card 01's link untappable on phones,
   which would defeat fix #1. **Not reproduced.** Tailwind v4 already wraps `hover:` / `group-hover:`
   in `@media (hover: hover)`, so touch devices get no sticky hover without disabling input.

### Text content (verbatim, exact characters — straight `'`, em dash `—`)

- Eyebrow: `What We Do`
- H2: `Lending solutions` + `<br>` + accent span `across the board`
- Subtext: `Whether you're buying your first home, expanding an investment portfolio, or funding your business — we've got you covered.`

| # | Title | Description | Source SVG → icon |
|---|---|---|---|
| 01 | First Home Buyers | We guide first-time buyers through grants, LMI waivers, and lender options — making your first purchase stress-free. | house → `HomeIcon` |
| 02 | Self-Employed Loans | Specialist lenders who understand non-traditional income. Low-doc and alt-doc options available for ABN holders. | briefcase → `BriefcaseIcon` |
| 03 | Investment Properties | Grow your portfolio with the right debt structure. We find IO loans and offset features that maximise your returns. | bar-chart → `BarChartIcon` |
| 04 | Refinancing | Switch to a better rate or restructure your debt. We compare your current loan against 40+ lenders to save you money. | refresh-cw → `RefreshCwIcon` |
| 05 | Construction Loans | Progressive drawdown loans tailored to your build schedule. We liaise with your builder and lender so you don't have to. | home-roof → `BuildingIcon` |
| 06 | Commercial Finance | Business property, equipment finance, and commercial lending structured around your cash flow and growth plans. | credit-card → `CreditCardIcon` |

> The card 05 title is **`Construction Loans`**, not "Construction Finance".
> All six icon path geometries in `src/components/icons.tsx` are byte-identical to the source SVGs —
> no approximations were needed.

---

## AboutNed — `section#about.about-section`

### DOM structure
```
section#about.about-section
  div.about-section_container                        (grid 2fr 3fr, 1024 max-w)
    div.about-section_left                           (no CSS — structural only)
      div.about-section_photo-wrap                   (relative)
        img.about-section_photo
        div.about-section_badge                      (absolute, bottom/right -12px)
      div.about-section_awards                       (flex column, gap 12)
        div.about-award-item  x3
          div.about-award_icon-wrap > svg 16x16 (award)
          div.about-award_text
    div.about-section_right                          (no CSS — structural only)
      p.about-eyebrow
      h2.about-h2
      p.about-subtitle
      p.about-body
      p.about-body.about-body--last
      div.about-section_features                     (flex column, gap 16)
        div.about-feature-item  x3
          div.about-feature_icon-wrap > svg 18x18
          div
            div.about-feature_title
            div.about-feature_body
```

`.about-section_left` and `.about-section_right` have **no rules in any bundle** — they are bare
grid children.

### Computed styles

**`.about-section`** — backgroundColor: `#fff`; paddingTop / paddingBottom: `80px`

**`.about-section_container`**
- display: `grid`; gridTemplateColumns: `2fr 3fr`; gap: `40px`; alignItems: `start`
- maxWidth: `1024px`; margin: `0 auto`; paddingLeft/Right: `16px`

**`.about-section_photo-wrap`** — position: `relative`

**`.about-section_photo`**
- display: `block`; width: `100%`; height: `auto`; minHeight: `300px`
- objectFit: `cover`; backgroundColor: `#f3f4f6`; borderRadius: `16px`
- boxShadow: `0 20px 40px #00000026`
- intrinsic size from the `img` attributes: `479 x 767`

**`.about-section_badge`**
- position: `absolute`; bottom: `-12px`; right: `-12px`
- color: `#fff`; backgroundColor: `#1a1a1a`; borderRadius: `8px`; padding: `8px 16px`
- fontSize: `12px`; fontWeight: `700`; whiteSpace: `nowrap`; lineHeight: inherited `20px`
- boxShadow: `0 2px 8px #0003`

**`.about-section_awards`** — display: `flex`; flexDirection: `column`; gap: `12px`;
marginTop: `24px`; fontFamily: `Inter`

**`.about-award-item`**
- display: `flex`; alignItems: `center`; gap: `12px`; padding: `12px 16px`
- backgroundColor: `#fff`; border: `1px solid #e5e7eb`; borderRadius: `12px`
- boxShadow: `0 1px 3px #00000014`

**`.about-award_icon-wrap`** — backgroundColor: `#bc1a1a1a`; borderRadius: `50%`;
width / height: `32px`; display: `flex`; center/center; flexShrink: `0`

**`.about-award_text`** — color: `#111827`; fontSize: `12px`; fontWeight: `700`; lineHeight: `1.4`

**`.about-eyebrow`**
- color: `#bc1a1a`; fontFamily: `Inter`; fontSize: `12px`; fontWeight: `600`
- letterSpacing: `.15em`; textTransform: `uppercase`; marginBottom: `8px`

**`.about-h2`**
- color: `#111827`; fontFamily: `Inter`; fontSize: `44px`; fontWeight: `700`; lineHeight: `1.15`
- marginBottom: `8px`; marginTop: `20px` (Webflow `h2` reset)

**`.about-subtitle`** — color: `#bc1a1a`; fontSize: `16px`; fontWeight: `500`; marginBottom: `20px`;
lineHeight: inherited `20px`; no own `font-family` → Inter via `body`

**`.about-body`** — color: `#6b7280`; fontFamily: `Inter`; fontSize: `14px`; lineHeight: `1.6`;
marginBottom: `16px`
**`.about-body--last`** — marginBottom: `24px`

**`.about-section_features`** — display: `flex`; flexDirection: `column`; gap: `16px`

**`.about-feature-item`** — display: `flex`; alignItems: `flex-start`; gap: `16px`

**`.about-feature_icon-wrap`** — backgroundColor: `#bc1a1a1a`; borderRadius: `8px`;
width / height: `36px`; display: `flex`; center/center; flexShrink: `0`

**`.about-feature_title`** — color: `#111827`; fontSize: `14px`; fontWeight: `600`;
marginBottom: `2px`; lineHeight: inherited `20px`

**`.about-feature_body`** — color: `#6b7280`; fontFamily: `Inter`; fontSize: `14px`; lineHeight: `1.5`

### Hover behaviour
None. Nothing in this section has a `:hover`, `transition`, or script attached.

### Responsive overrides

| Query | Rule |
|---|---|
| `max-width: 991px` | `.about-h2 { font-size: 36px }` |
| `max-width: 767px` | `.about-section_container { grid-template-columns: 1fr }` |
| `max-width: 767px` | `.about-section_photo { object-fit: cover; max-height: 400px }` |
| `max-width: 479px` | `.about-section_photo { width: 479px; max-width: 361px; height: 767px }` |

**The ≤479px photo rule is a Webflow artifact.** `width: 479px` with `max-width: 361px` resolves to
361px, and `height: 767px` is still clamped by the 400px `max-height` inherited from the ≤767px
block (later source position, different property, so both apply). On a 390px-wide phone the
container is 358px, so a hard 361px width overflows the viewport by 3px and introduces a horizontal
scrollbar. **Fixed:** the component keeps `w-full max-w-[361px]` + the 400px height, which is
identical at ≥393px viewports and simply stops overflowing below that.

Tailwind mapping: `max-md:` → `width < 768px` (= `max-width: 767px`); `max-[480px]:` →
`width < 480px` (= `max-width: 479px`); `min-[992px]:` → `min-width: 992px` (= "above 991px").

### Text content (verbatim — note the **curly** apostrophes `’` and the **en dash** `–` in the
subtitle and in the "No Chatbots" body; the awards use **em dashes** `—`)

- Eyebrow: `About Me`
- H2: `Ned McLachlan`
- Subtitle: `Award-Winning Broker – Not a Call Centre`
- Photo badge: `Director & Broker`
- Body 1: `I started FundUp because I was frustrated by the mortgage industry’s obsession with volume over people. Too many brokers treat clients like numbers. I built this business around the opposite philosophy — that every borrower deserves honest, personalised advice from someone who actually picks up the phone.`
- Body 2 (`--last`): `With 40+ lenders on my panel and a deep specialisation in self-employed lending, I have the tools to find solutions that the big banks and call centres simply can’t. My results speak for themselves — but more importantly, so do my clients.`

Awards (all three use the same award/rosette SVG → `AwardIcon`):
1. `Emerging Broker of the Year 2023`
2. `National Winner — Most Sales, Emerging Broker Q3 & Q4 2023`
3. `State Winner — Most Sales, Emerging Broker Q3 & Q4 2023`

Key points:
| Title | Body | Source SVG → icon |
|---|---|---|
| No Chatbots | You’ll speak directly with me – a real person who understands your situation. | phone → `PhoneIcon` |
| No Telemarketers | No call centres, no being passed around. I handle your loan from start to finish. | users → `UsersIcon` |
| One Point of Contact | I’m your broker, your advocate, and your go-to throughout the entire process. | user → `UserIcon` |

> `PhoneIcon` in `icons.tsx` uses the Feather 1.x arc syntax (`12.84 0 0 0 .7 2.81`) where the source
> used the Lucide re-authored form (`.127.96 1.903.7 2.81`). The rendered path is the same phone
> handset; kept as-is rather than adding a duplicate icon.

### Assets
`public/images/ned-mclachlan.webp` (479x767 intrinsic), with `-p-500` / `-p-800` / `-p-1080`
variants also present. The component uses `next/image` and lets Next generate the srcset from the
base file, with `sizes="(max-width: 767px) 100vw, 400px"` (the 2fr column is ~381px at the 1024px
container). `loading="eager"` matches the source's `loading="eager"`; `priority` is deliberately not
used because the section is below the fold and would preload against the hero's LCP.

Alt text is verbatim from the source: `Ned McLachlan – FundUp Mortgage Broker`.

---

## Component API

```ts
// ServicesGrid.tsx
export const SERVICES: readonly ServiceCard[];       // the six cards, exported for reuse
export function ServicesGrid(props: {
  services?: readonly ServiceCard[];                 // override the copy per page
  className?: string;                                // extra section classes
}): ReactElement;

// AboutNed.tsx
export function AboutNed(props: { className?: string }): ReactElement;
```

Both are server components — no `"use client"`, no state, no effects.
`ServiceCard` comes from `src/types/index.ts`; `icon` is a string key resolved through a local
`Record<string, ComponentType<IconProps> | undefined>` map so the type stays serialisable.
