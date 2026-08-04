# FundUpDifference + IdealClient + CtaBand Specification

## Overview
- **Target files:** `src/components/FundUpDifference.tsx`, `src/components/IdealClient.tsx`,
  `src/components/CtaBand.tsx`
- **Source sections:** `section.fd-diff-section`, `section.oc-section`, `section.ctab-section`
- **Used by:** `/` only (all three appear once, in that order, with `section.journey-section`
  sitting between `.oc-section` and `.ctab-section`)
- **Interaction model:** all three are fully static. No JS, no hover rules, no transitions,
  no entrance animation — the source declares **zero** `:hover` / `transition` for any
  `.fd-diff-*`, `.oc-*` or `.ctab-*` selector. They are plain Server Components.

**Provenance.** Every value below is lifted verbatim from
`css/review-showcase.webflow.69e063091da62a1e076d275f.624df7b9c.opt.min.css` (the page-scoped
Webflow bundle for `/`). The shared bundle
(`review-showcase.webflow.shared.962c37592.min.css`) contains **no** rules for these three
prefixes — confirmed by an exhaustive selector scan. There are no inline `<style>` overrides
in `home.html` for them either.

> **Font note:** all three sections declare `font-family: Inter, sans-serif` on the section
> element (and again on several descendants). Use `font-inter`, not the default `font-sans`.

> **Breakpoint note:** the source uses Webflow's `max-width: 991 / 767 / 479` queries. These
> are ported **mobile-first** so the boundaries land exactly:
> - base (no variant) = the `≤767px` values
> - `md:` = `min-width: 768px` = the `≤991px` block (Tailwind's `md` is exactly 768px)
> - `min-[992px]:` = the unqualified desktop values
> - `min-[480px]:` = above the `≤479px` block
>
> Do **not** use `max-[479px]:` — Tailwind v4 compiles it to
> `@media not all and (min-width:479px)`, which excludes 479px itself.

> **Radius note:** `--radius` in this project makes `rounded-lg` = 10px. All radii below are
> written as explicit arbitrary values (`rounded-[16px]`, `rounded-[12px]`, `rounded-[8px]`).

---

## 1. FundUpDifference — `section.fd-diff-section`

### DOM structure
```
section.fd-diff-section
  div.fd-diff-container
    div.fd-diff-header
      p.fd-diff-eyebrow
      h2.fd-diff-heading
      p.fd-diff-subheading
    div.fd-diff-grid
      div.fd-diff-card            × 4
        div.fd-diff-icon-wrap
          svg  (24×24, stroke=currentColor, stroke-width 2, round caps/joins)
        h3.fd-diff-card-title
        p.fd-diff-card-body
```

### Extracted CSS (verbatim)

**`.fd-diff-section`**
- `background-color: #111`
- `padding-top: 96px; padding-bottom: 96px`
- `font-family: Inter, sans-serif`

**`.fd-diff-container`**
- `max-width: 1100px; margin-left: auto; margin-right: auto`
- `padding-left: 40px; padding-right: 40px`

**`.fd-diff-header`** — `text-align: center; margin-bottom: 64px`

**`.fd-diff-eyebrow`**
- `color: #bc1a1a`
- `letter-spacing: .15em; text-transform: uppercase`
- `margin-top: 0; margin-bottom: 12px`
- `font-family: Inter; font-size: 12px; font-weight: 600`

**`.fd-diff-heading`**
- `color: #fff; letter-spacing: -.5px`
- `margin-top: 0; margin-bottom: 16px`
- `font-family: Inter; font-size: 44px; font-weight: 700; line-height: 1.15`

**`.fd-diff-subheading`**
- `color: #ffffff8c` (white @ 55%)
- `margin: 0`
- `font-family: Inter; font-size: 17px; font-weight: 400; line-height: 1.6`

**`.fd-diff-grid`** — the minified rule declares the gaps **twice**; the later pair wins:
```
grid-column-gap:100px; grid-row-gap:48px; text-align:left;
grid-column-gap:32px;  grid-row-gap:0px;  text-align:left;   ← these win
grid-template-columns:1fr 1fr 1fr 1fr; display:grid
```
→ effective: `display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 32px;
row-gap: 0; text-align: left`.

**`.fd-diff-card`**
- `text-align: center; display: flex; flex-direction: column; align-items: center`
- `padding: 8px`
- (the card's own `text-align:center` overrides the grid's `text-align:left`)

**`.fd-diff-icon-wrap`**
- `color: #bc1a1a` (the SVG is `stroke="currentColor"`)
- `background-color: #bc1a1a26` (15%)
- `border: 1px solid #bc1a1a4d` (30%)
- `border-radius: 50%`
- `width: 64px; height: 64px; flex-shrink: 0`
- `display: flex; justify-content: center; align-items: center`
- `margin-bottom: 20px`
- SVG child is rendered at `width=24 height=24`

**`.fd-diff-card-title`**
- `color: #fff; margin-top: 0; margin-bottom: 12px`
- `font-family: Inter; font-size: 18px; font-weight: 700; line-height: 1.3`

**`.fd-diff-card-body`**
- `color: #ffffff8c`
- `max-width: 260px; margin: 0`
- `font-family: Inter; font-size: 15px; line-height: 1.7`

### Responsive overrides

`@media screen and (max-width: 991px)`
| Selector | Change |
|---|---|
| `.fd-diff-section` | `padding-top: 64px; padding-bottom: 64px` |
| `.fd-diff-container` | `padding-left: 24px; padding-right: 24px` |
| `.fd-diff-header` | `margin-bottom: 48px` |
| `.fd-diff-heading` | `font-size: 34px` |
| `.fd-diff-grid` | `column-gap: 24px; row-gap: 40px; grid-template-columns: 1fr 1fr` |

`@media screen and (max-width: 767px)`
| Selector | Change |
|---|---|
| `.fd-diff-section` | `padding-top: 48px; padding-bottom: 48px` |
| `.fd-diff-container` | `padding-left: 20px; padding-right: 20px` |
| `.fd-diff-header` | `margin-bottom: 36px` |
| `.fd-diff-heading` | `letter-spacing: 0; font-size: 28px` |
| `.fd-diff-subheading` | `font-size: 15px` |
| `.fd-diff-grid` | `row-gap: 36px; grid-template-columns: 1fr` |
| `.fd-diff-card-title` | `font-size: 17px` |

`@media screen and (max-width: 479px)` — **no `.fd-diff-*` rules.**

### Verbatim copy

- **Eyebrow:** `WHY CHOOSE US` (already uppercase in the markup)
- **H2:** `The FundUp difference`
- **Sub:** `We're more than brokers — we're your lending partners.`
  (apostrophes are plain ASCII `'` U+0027, source-encoded as `&#x27;`; the dash is U+2014)

| # | Icon (source SVG → our component) | Title | Body |
|---|---|---|---|
| 1 | `rect 2,7,20,14 rx2` + `M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2` → **`BriefcaseIcon`** (exact match) | `Self-Employed Specialists` | `We understand the unique challenges of self-employed income. From low-doc to full-doc, we find the right path.` |
| 2 | three `rect 8×8 rx1` + `M14 17h8M18 14v6` → **`GridPlusIcon`** (exact match) | `Access to Accountants, Planners & Buyers Agents` | `We connect you with trusted professionals — accountants, financial planners, and buyers agents — to support your goals.` |
| 3 | file outline + `polyline 14,2 14,8 20,8` + two `line`s → **`FileTextIcon`** (exact match) | `Self Declared Income Loans` | `Flexible lending options that let you declare your income without traditional documentation hurdles.` |
| 4 | `M20.84 4.61a5.5 5.5 0 0 0-7.78 0…` → **`HeartIcon`** (exact match) | `Long Term Relationship` | `We're not about one-off transactions. We build lasting partnerships to support your financial journey for years to come.` |

Non-ASCII in this section: **U+2014 `—` only.** Every apostrophe is ASCII U+0027 and every
hyphen ("Self-Employed", "low-doc", "one-off") is ASCII U+002D. No non-breaking hyphens here —
those appear only in `.oc-section`.

---

## 2. IdealClient — `section.oc-section`

### DOM structure
```
section.oc-section
  div.oc-container
    div.oc-header
      div.oc-header-left
        p.oc-eyebrow
        h2.oc-h2            ("Our ideal" <br/> <span.oc-accent>client</span>)
      p.oc-subtext
    div.oc-grid
      div.oc-card           × 3
        span.oc-ghost       ("01" / "02" / "03")
        div.oc-card-inner
          div.oc-icon-box
            svg  (28×28, stroke="#dc2626")
          h3.oc-card-title
          p.oc-card-desc
          div.oc-list
            div.oc-list-item × 3
              svg  (16×16, stroke="#dc2626", check-in-circle)
              span
```

### Extracted CSS (verbatim)

**`.oc-section`**
- `box-sizing: border-box`
- `background-color: #eee`
- `padding: 96px 0`
- `font-family: Inter, sans-serif`

**`.oc-container`** — `max-width: 1280px; margin: 0 auto; padding: 0 16px`

**`.oc-header`**
- `display: flex; flex-direction: row; justify-content: flex-end; align-items: flex-end`
- `column-gap: 24px; row-gap: 24px`
- `margin-bottom: 64px`
- `font-family: Inter, sans-serif`

**`.oc-header-left`** — `flex: 1`

**`.oc-eyebrow`**
- `color: #bc1a1a; letter-spacing: .15em; text-transform: uppercase`
- `margin: 0 0 12px; font-size: 12px; font-weight: 600`

**`.oc-h2`**
- `color: #111; margin: 0`
- `font-family: Inter; font-size: 44px; font-weight: 700; line-height: 1.15`

**`.oc-accent`** — `color: #bd1f1f`
> ⚠️ `#bd1f1f`, **not** the brand `#bc1a1a` and not `#dc2626`. A *fourth* red, unique to this
> one span on the whole site. Preserved literally per the "three reds" decision in
> `docs/research/FIXES.md` (visual fidelity over token purity).

**`.oc-subtext`**
- `color: #666; text-align: right; max-width: 420px; margin: 0`
- `font-size: 14px; line-height: 1.7`

**`.oc-grid`**
- `display: grid; grid-template-columns: repeat(3, 1fr)`
- `column-gap: 24px; row-gap: 24px`
- `max-width: 1024px; margin: 0 auto`

**`.oc-card`**
- `background-color: #fff`
- `border: 1.5px solid #e5e7eb`  ← **1.5px**, a half-pixel border
- `border-radius: 16px; padding: 40px`
- `position: relative; overflow: hidden`

**`.oc-ghost`**
- `color: #0000000f` (black @ 6%)
- `user-select: none`
- `font-size: 64px; font-weight: 700; line-height: 1`
- `position: absolute; top: 16px; right: 24px`

**`.oc-card-inner`** — `position: relative; z-index: 10`

**`.oc-icon-box`**
- `background-color: #dc262614` (8%)
- `border: 1px solid #dc262633` (20%)
- `border-radius: 12px`
- `width: 56px; height: 56px`
- `display: flex; justify-content: center; align-items: center`
- `margin-bottom: 24px`
- SVG child is `28×28`, `stroke="#dc2626"` **hard-coded inline** (not `currentColor`)

**`.oc-card-title`** — `color: #111; margin: 0 0 12px; font-size: 20px; font-weight: 700`

**`.oc-card-desc`** — `color: #555; margin: 0 0 24px; font-size: 14px; line-height: 1.7`

**`.oc-list`**
- `display: flex; flex-direction: column; column-gap: 10px; row-gap: 10px`
- `border-top: 1px solid #e5e7eb; padding-top: 16px`

**`.oc-list-item`**
- `display: flex; align-items: center; column-gap: 10px; row-gap: 10px`
- `color: #444; font-size: 14px`
- SVG child is `16×16`, `stroke="#dc2626"` hard-coded

### Responsive overrides

`@media (max-width: 991px)` — **none.**
`@media (max-width: 767px)` — **none.**

`@media screen and (max-width: 479px)`
| Selector | Change |
|---|---|
| `.oc-grid` | `column-gap: 24px; row-gap: 24px; grid-template-rows: auto auto; grid-template-columns: repeat(3,1fr); grid-auto-columns: 1fr;` **`display: block`** |
| `.oc-card` | `display: block` |

> **Preserved quirk (not a fix).** Flipping `.oc-grid` to `display:block` makes the grid gaps
> inert, so at ≤479px the three cards stack **flush against each other with 0px of vertical
> separation**. Combined with the fact that the section has *no* 991/767 overrides at all —
> the header stays a `flex-direction: row` two-column layout and the grid stays 3-up right
> down to 480px — this section is visibly cramped on tablet and seam-free on phones on the
> live site. Reproduced 1:1 rather than "corrected", per the project's match-first mandate.
> Worth raising with the site owner alongside the other items in `FIXES.md`.

### Verbatim copy

- **Eyebrow:** `Who We Work With` (rendered uppercase by `text-transform`)
- **H2:** `Our ideal` + `<br/>` + `client` (the second line in `span.oc-accent`)
  → reads **"Our ideal client"**
- **Sub:** `We do our best work with people who share these values — driven individuals building wealth through property.`

| # | Ghost | Icon (source SVG → our component) | Title | Description | List items |
|---|---|---|---|---|---|
| 1 | `01` | `polyline 22 7 13.5 15.5 8.5 10.5 2 17` + `polyline 16 7 22 7 22 13` → **`TrendingUpIcon`** * | `Wealth‑Building Mindset` | `You see property as a vehicle for long‑term wealth — not just a place to live. You're ready to think strategically about your next move.` | `Property investors` · `Portfolio builders` · `Strategic thinkers` |
| 2 | `02` | `M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15…` + `M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4` → **`WalletIcon`** (exact match) | `Budget‑Conscious & Prepared` | `You understand the value of a solid budget. Whether buying your first home or expanding a portfolio, you come prepared to invest wisely.` | `Financially organised` · `Goal‑driven savers` · `Ready to act` |
| 3 | `03` | five-path handshake (`m11 17 2 2a1 1 0 1 0 3-3` …) → **`HandshakeIcon`** (exact match) | `Long‑Term Partnership` | `You want a broker who grows with you — not a one‑off transaction. We're here for every milestone, from your first loan to your fifth.` | `Relationship focused` · `Repeat borrowers` · `Trust over transactions` |

\* **`TrendingUpIcon` geometry differs by ~1 unit.** Source: `22 7 13.5 15.5 8.5 10.5 2 17` /
`16 7 22 7 22 13`. Our shared `icons.tsx`: `23 6 13.5 15.5 8.5 10.5 1 18` / `17 6 23 6 23 12`
(the canonical Feather `trending-up`). Same glyph, a hair larger/offset within the same 24×24
box. Reusing the shared component is the right call — `icons.tsx` is owned by another agent
and the delta is sub-pixel at the rendered 28px.

**All three list-item ticks** use `circle cx=12 cy=12 r=10` + `m9 12 2 2 4-4`, which is exactly
**`CheckCircleIcon`** (`circle r=10` + `polyline 9 12 11 14 15 10` — identical geometry).

#### Non-ASCII inventory for `.oc-section`
Only two non-ASCII codepoints appear in this entire section:

| Codepoint | Char | Where |
|---|---|---|
| `U+2011` | `‑` **non-breaking hyphen** | `Wealth‑Building`, `long‑term`, `Budget‑Conscious`, `Goal‑driven`, `Long‑Term`, `one‑off` |
| `U+2014` | `—` em dash | subtext, card 1 desc, card 3 desc |

Note the apostrophes here (`You're`, `We're`) are plain **ASCII `'` (U+0027)**, encoded in the
source HTML as `&#x27;` — *not* the typographic U+2019. Same as `.fd-diff-section`. Rendered
in JSX as `&apos;`, matching the existing convention in `HeroSection.tsx`.

**U+2011 must be preserved byte-for-byte** — it is not a regular hyphen (U+002D) and not a
non-breaking *space*. It prevents "Wealth-Building" from wrapping.

---

## 3. CtaBand — `section.ctab-section`

### DOM structure
```
section.ctab-section
  div.ctab-container
    h2.ctab-heading
    p.ctab-sub
    div.ctab-btns
      a.ctab-btn-dark    href="#bpa-consent2"
      a.ctab-btn-light   href="tel:0412885734"
```

### Extracted CSS (verbatim)

**`.ctab-section`**
- `background-color: #e61919`
- `padding: 64px 24px`
- `font-family: Inter, sans-serif`

> ⚠️ `#e61919` is a **fifth** red — brighter than `#bc1a1a`, `#dc2626`, `#e5341a`, `#bd1f1f`.
> Preserved literally.

**`.ctab-container`**
- `display: flex; flex-direction: column; align-items: center`
- `column-gap: 16px; row-gap: 16px`
- `text-align: center`
- `max-width: 860px; margin: 0 auto`

**`.ctab-heading`**
- `color: #fff; margin: 0`
- `font-family: Inter; font-size: 44px; font-weight: 700; line-height: 1.15`

**`.ctab-sub`**
- `color: #ffffffd9` (white @ 85%)
- `margin: 0; font-family: Inter; font-size: 15px`

**`.ctab-btns`**
- `display: flex; flex-wrap: wrap; justify-content: center`
- `column-gap: 16px; row-gap: 16px`
- `margin-top: 8px`

**`.ctab-btn-dark`**
- `display: inline-flex; align-items: center; column-gap: 6px; row-gap: 6px`
- `color: #fff; background-color: #1a1a1a`
- `border-radius: 8px; padding: 14px 28px`
- `font-family: Inter; font-size: 15px; font-weight: 600; text-decoration: none`

**`.ctab-btn-light`**
- `color: #1a1a1a; background-color: #fff`
- `border: 2px solid #fff`
- `border-radius: 8px; padding: 14px 28px`
- `font-family: Inter; font-size: 15px; font-weight: 600; text-decoration: none`
- **no `display` declared** → as a flex item it is blockified

### Responsive overrides
**None at 991px, 767px or 479px.** The 44px heading and the 64px/24px padding hold at every
width; the buttons wrap onto two rows via `flex-wrap` on narrow screens. This is the source's
entire responsive story for this section.

### Button height reconciliation
`.ctab-btn-light` carries a `2px` border that `.ctab-btn-dark` does not, so its natural border-
box height is 4px greater. `.ctab-btns` uses the default `align-items: stretch`, so the dark
button stretches to match, and its own `align-items: center` re-centres the label. Net effect:
both labels sit **16px from the top of their border box** and the buttons are the same height.
Rendering `.ctab-btn-light` as `inline-flex items-center justify-center` reproduces this
exactly (identical natural height, identical label position) while avoiding stretch-induced
top-alignment — that is what the component does.

### Verbatim copy
- **H2:** `Ready to get the right loan?`
- **Sub:** `Free consultation · No obligation · Compare 40+ lenders in minutes`
  (separator is U+00B7 MIDDLE DOT, surrounded by regular spaces)
- **Dark button:** `Book Free Consultation →` — the arrow **U+2192** is part of the anchor's
  text node, not a separate icon element. (`.ctab-btn-dark`'s `gap: 6px` is therefore inert —
  there is only one child.)
  `href="#bpa-consent2"` — resolves to the consent checkbox inside `section#booking.bpa-section`
  further down `/`. Odd target, but it **does** exist, so it is not a broken-anchor defect
  (cf. `FIXES.md` #3) and is kept verbatim.
- **Light button:** `Call 0412 885 734`, `href="tel:0412885734"` (already correctly
  unspaced here; the defect in `FIXES.md` #2 is on `/self-employed-loans`).

Non-ASCII: `U+00B7 ·` and `U+2192 →`.

---

## Types used
From `src/types/index.ts`:
- `FeatureCard { icon: string; title: string; description: string }` — both card grids reuse
  its `title` / `description` shape via `Omit<FeatureCard, "icon">`, swapping the serialisable
  `icon` key for a real `Icon: ComponentType<IconProps>`. This mirrors the `TrustStat extends
  Stat` pattern already established in `TrustBar.tsx`.
- `CtaLink { label: string; href: string; variant: "primary" | "ghost" }` — used as-is by
  `CtaBand`: `primary` → `.ctab-btn-dark`, `ghost` → `.ctab-btn-light`.

## Colour summary (this batch)
| Hex | Where |
|---|---|
| `#111` | `.fd-diff-section` bg, `.oc-h2`, `.oc-card-title` |
| `#eee` | `.oc-section` bg |
| `#e61919` | `.ctab-section` bg |
| `#1a1a1a` | `.ctab-btn-dark` bg / `.ctab-btn-light` text |
| `#bc1a1a` | `.fd-diff-eyebrow`, `.fd-diff-icon-wrap`, `.oc-eyebrow` |
| `#bd1f1f` | `.oc-accent` only |
| `#dc2626` | `.oc-icon-box` bg/border, all `.oc-*` inline SVG strokes |
| `#ffffff8c` | `.fd-diff-subheading`, `.fd-diff-card-body` |
| `#ffffffd9` | `.ctab-sub` |
| `#e5e7eb` | `.oc-card` border, `.oc-list` top border |
| `#666` / `#555` / `#444` | `.oc-subtext` / `.oc-card-desc` / `.oc-list-item` |
| `#0000000f` | `.oc-ghost` |
