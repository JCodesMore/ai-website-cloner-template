# Tech Stack Analysis — fundup.au

## Target platform: Webflow + Flowkit

| Field | Value |
|---|---|
| Platform | Webflow (`<meta content="Webflow" name="generator">`) |
| Design system | **Flowkit** — Webflow's utility-first CSS framework |
| Webflow Site ID | `69e063061da62a1e076d274d` |
| Original template | `review-showcase` (staging: `https://review-showcase.webflow.io`) |
| Last published | Thu May 21 2026 01:02:09 GMT |

Ruled out: no `__NEXT_DATA__`, no `wp-content`/`wp-json`, no `framerusercontent.com`, no
Squarespace context object.

Class naming runs two conventions side by side:
- **Flowkit tokens** — `.heading_hero`, `.button`, `.button.is-secondary`, `.section`, `.container`
- **Hand-written custom classes** — `fu-` prefix with `__` element separator
  (`.fu-nav__logo-link`, `.fu-hero-embed__overlay`, `.services-card_ghost-number`)

## Stylesheet architecture

One shared normalize bundle plus one optimised bundle per page:

```
review-showcase.webflow.shared.962c37592.min.css                             29,876 B  (normalize)
review-showcase.webflow.69e063091da62a1e076d275f.624df7b9c.opt.min.css       89,683 B  home
review-showcase.webflow.69e0630d1da62a1e076d27b8.92a0690cd.opt.min.css      205,567 B  style-guide (FULL token set)
review-showcase.webflow.69e1990a63f3ef04164df1aa.30fe5e0dd.opt.min.css       79,184 B  self-employed-loans
review-showcase.webflow.69e19912e0fb5120f56e6bfd.7cb7d5ddc.opt.min.css       73,859 B  calculators
review-showcase.webflow.69e1a1c7719de3a3b20932e9.91c9e3432.opt.min.css       80,817 B  low-doc-loans
review-showcase.webflow.69e78504f20d425e3c88d922.5b7887958.opt.min.css       74,325 B  contact
review-showcase.webflow.69e838ff254b87943e7db7d6.8b4efbed1.opt.min.css       77,385 B  services
review-showcase.webflow.69eaddfe12318639a7afb7f8.88ca85b35.opt.min.css       71,443 B  privacy-policy
review-showcase.webflow.69eadf316fbc54e8cd89d275.ae395aa1e.opt.min.css       71,527 B  terms-and-conditions
review-showcase.webflow.6a02c072c565f3af4c9a0a2a.7da9c3050.opt.min.css       73,963 B  book-a-consultation
```

The **style-guide bundle is the source of truth** — its `:root` block carries all 288 design-token
declarations. Cached locally during recon for offline extraction.

## Fonts

Loaded via Google **WebFont Loader**, not a stylesheet `<link>`:

```html
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
<script>WebFont.load({ google: { families: [
  "Instrument Sans:300,400,500,600,700",
  "Instrument Sans:300,400,500,600,700",   // duplicated in source
  "Inter:300,400,500,600,700",
  "Plus Jakarta Sans:300,400,500,600,700",
  "Roboto Serif:300,400,500,600,700"
]}});</script>
```

| Font | Role |
|---|---|
| **Plus Jakarta Sans** | all headings (`--heading-font`) |
| **Instrument Sans** | body + buttons (`--body-font`, `--button-font`) |
| Inter | homepage custom CSS + the calculators embed |
| Roboto Serif | homepage custom CSS only |

All four are on Google Fonts → all four map cleanly to `next/font/google`.

Other `@font-face`: Webflow's embedded base64 `webflow-icons` TTF (not needed — we extract SVGs),
and a stray `CameraPlainVariable.woff2` from `cdn.gpteng.co` on `/contact` and `/low-doc-loans`
(a Lovable/GPT-Engineer widget leftover — **do not port**).

## Third-party stack

| Vendor | Purpose | Where |
|---|---|---|
| **GoHighLevel / LeadConnector** | CRM tracking, `data-tracking-id="tk_7857cdab35ef47008a015d70f7175bb3"` | every page |
| GHL booking widget | iframe calendar `cjRBEEobuaiBp31Omzz5` | `/book-a-consultation` only |
| jQuery 3.5.1 | Webflow runtime dependency | every page |
| Webflow custom code | `services_card_hover_effects`, `mobile_nav_toggle`, `ghl_external_tracking` | every page |

## Asset CDN

Pattern: `https://cdn.prod.website-files.com/{SITE_ID}/{HASH}_{filename}`
Secondary (Webflow static UI): `https://d3e54v103j8qbb.cloudfront.net/...`

The site is remarkably asset-light: **the logo and one headshot are the only real images**.
Everything else — every icon, every chart, every decorative element — is inline SVG or CSS.

## Our equivalents

| Target | Our implementation |
|---|---|
| Webflow Flowkit CSS variables | Tailwind v4 `@theme` tokens in `globals.css` |
| Webflow page-scoped CSS bundles | React components + Tailwind utilities |
| WebFont Loader | `next/font/google` (self-hosted, no layout shift) |
| jQuery + Webflow runtime | React 19 + native browser APIs |
| `mobile_nav_toggle-1.0.0.js` | React state in `SiteHeader` |
| `services_card_hover_effects-1.0.0.js` | CSS transitions |
| Webflow accordion embeds | shadcn `accordion` (base-nova / `@base-ui/react`) |
| GHL booking iframe | keep the iframe — it's the real booking system |
| GHL tracking script | **omit** (analytics, not visual) |
| Inline `<svg>` icons | `src/components/icons.tsx` named exports |

## Tailwind v4 gotchas found while porting

Each of these caused a real, visible bug during the build. Worth knowing before touching any
component.

**1. `translate-y-*` compiles to the `translate` property, not `transform`.**
So `transition-[opacity,transform]` emits `transition-property: opacity, transform`, never
matches `translate`, and the animation **snaps instead of easing**. Write
`transition-[opacity,transform,translate]`. Stock `transition-transform` is safe — v4 expands it
correctly. Only arbitrary lists are affected.

**2. `max-[479px]:` excludes 479px itself.**
It compiles to `@media not all and (min-width:479px)`, i.e. width < 479. The source's
`@media (max-width:479px)` includes 479. Use **`max-[480px]:`** to match. Same for the other
Webflow breakpoints: `max-[768px]:` and `max-[992px]:`.

**3. Tailwind's `lg` is 1024px, but Webflow's desktop breakpoint is 992px.**
Using `lg:` leaves the 992–1023px band on the wrong layout. Use `min-[992px]:` where the source
boundary matters.

**4. `rounded-lg` is 10px here, not 8px.** This project's `--radius` is `0.5rem` and the shadcn
scale derives from it. When matching a source value, write it explicitly — `rounded-[8px]`.

**5. Webflow's base reset is load-bearing and Tailwind Preflight zeroes it.**
The shared Webflow bundle sets `h2 { margin-top: 20px }`, `h3 { margin-top: 20px; line-height:
30px }` and `body { line-height: 20px }`, and the section rules never override them. So real
gaps and line-heights on the live site depend on rules Preflight removes. Set them explicitly
rather than assuming the section CSS tells the whole story.

**6. `hover:` is auto-wrapped in `@media (hover:hover)` in v4.** The source's
`@media (max-width:479px){ .services-card { pointer-events: none } }` hack — which exists only to
kill sticky hover on touch — is unnecessary and was deliberately not ported, since it would have
made a card link untappable on phones.

## Breakpoints

Webflow standard, and what the site's media queries actually use:

| Breakpoint | Tailwind equivalent |
|---|---|
| `≤991px` | below `lg` |
| `≤767px` | below `md` |
| `≤479px` | below `sm` |

Note these are **max-width** queries (desktop-first) while our build is mobile-first Tailwind.
Invert them: `991px` → `lg:`, `767px` → `md:`, `479px` → `sm:`.
