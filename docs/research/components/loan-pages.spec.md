# Loan landing pages — `/self-employed-loans` and `/low-doc-loans`

Extracted from the live Webflow build:

| Page | HTML | Page stylesheet |
| --- | --- | --- |
| `/self-employed-loans` | `html/self-employed-loans.html` | `review-showcase.webflow.69e1990a63f3ef04164df1aa.30fe5e0dd.opt.min.css` |
| `/low-doc-loans` | `html/low-doc-loans.html` | `review-showcase.webflow.69e1a1c7719de3a3b20932e9.91c9e3432.opt.min.css` |

Both share `review-showcase.webflow.shared.962c37592.min.css` (the Webflow reset) and the global
`nav.fu-nav-1` / `footer.fu-footer`, which are already built as `SiteHeader` / `SiteFooter`.

**Neither page has a `<main>` element** — the sections are direct children of `<body>` after the
nav. The ports keep that shape (fragment of `<section>`s).

---

## 1. Load-bearing base styles

The pages inherit Webflow's reset, which Tailwind Preflight zeroes. Every value below had to be
re-declared explicitly in the port:

```css
body { font-size: 14px; line-height: 20px; }   /* → leading-[20px] on any element with no line-height */
h1   { margin-top: 20px; font-size: 38px; line-height: 44px; }
h2   { margin-top: 20px; font-size: 32px; line-height: 36px; }  /* → leading-[36px] */
h3   { margin-top: 20px; font-size: 24px; line-height: 30px; }  /* → leading-[30px] */
h1..h6 { margin-bottom: 10px; font-weight: 700 }
p    { margin-top: 0; margin-bottom: 10px }
* { box-sizing: border-box }
```

Consequences worth calling out, because they look like mistakes but are the source's real render:

- Every `h3` card title (`.sel-why-card-title`, `.sel-how-title`, `.sel-faq-q`, `.ldl-feat-title`,
  `.ldl-doc-title`, `.ldl-exit-title`) is **15–16px text on a 30px line box** — double-spaced.
- `.sel-faq-h2` (36px), `.ldl-docs-h2` (36px), `.ldl-exit-h2` (36px) and `.ldl-who-h2` (32px) declare
  no `line-height`, so they all render on a **36px** line box — i.e. `line-height: 1.0` for the 36px
  ones, and they get *tighter* (not looser) as the font shrinks at the breakpoints.
- `.ldl-hero-bold` is 18px on a 20px line; `.ldl-result-title` likewise.

Fonts: every text node on both pages is `Inter, sans-serif` → `font-inter`. The project default is
Instrument Sans (body) / Plus Jakarta (headings), so `font-inter` is applied at section level and on
each heading.

### Breakpoints

Webflow desktop-first: `≤991`, `≤767`, `≤479`. Ported as `max-[992px]:`, `max-[768px]:`,
`max-[480px]:` — the `+1` is required because Tailwind's `max-*` compiles to
`not all and (min-width: N)`, which *excludes* `N` itself.

### Nav offset

`layout.tsx` pads the content wrapper by the fixed nav height (`pt-14 md:pt-16 lg:pt-28`), and the
existing `HeroSection` / `/calculators` hero *also* keep the source's literal `padding-top`. These
two pages follow the same established convention (`pt-[152px]` / `pt-[104px]` / `pt-[88px]` verbatim
from the source) rather than subtracting the nav height, so all four heroes sit at the same offset.
If the double offset is ever corrected it should be corrected globally in `layout.tsx`.

---

## 2. Colours

| Token | Where |
| --- | --- |
| `#111` | `.sel-hero`, `.ldl-hero` background; all dark headings |
| `#1a1a1a` | `.ldl-docs`, `.ldl-result-card` backgrounds |
| `#bc1a1a` | brand red — hero accent span, buttons, circles, `.sel-cta`, `.ldl-who` |
| `#e63946` | **fourth red**, `/self-employed-loans` only — every inline SVG stroke and `.sel-explore-link` |
| `#e5341a` | FAQ badge (`--brand-faq`, supplied by `FaqAccordion`) |
| `#1a2035` | `.sel-cta-btn-dark` — navy, *not* `#1a1a1a` |
| `#111827` / `#6b7280` | `.ldl-cta2-*` — Tailwind-ish greys, unique to that one band |
| `#f5f5f5` | `.sel-how`, `.sel-faq`, `.sel-explore`, `.ldl-what`, `.ldl-exit` |
| `#fafafa` / `#e8e8e8` | `.sel-why-card` fill / border |
| `#fff5f5` | icon tile fill (`.sel-why-icon`, `.ldl-feat-icon`) |

---

## 3. `/self-employed-loans`

Metadata — title `Self-Employed Home Loans Australia`, description
`Are you self-employed and struggling to get a home loan? FundUp helps business owners, sole traders & contractors find the right loan across 40+ lenders.`

**8 content blocks across 7 `<section>` elements** — `.sel-why` carries both the problem statement
and the 4-card feature grid.

### 3.1 `section.sel-hero` — `SelfEmployedHero`

```css
.sel-hero        { background:#111; display:flex; justify-content:center; align-items:center;
                   min-height:480px; position:relative; overflow:hidden }
.sel-hero-overlay{ position:absolute; inset:0; z-index:1;
                   background-image:linear-gradient(90deg,#000000b3 30%,#0000004d 100%) }
.sel-hero-content{ z-index:2; text-align:left; max-width:560px; padding:152px 40px 80px }
.sel-hero-eyebrow{ color:#bfbfbf; letter-spacing:.15em; text-transform:uppercase;
                   margin:0 0 16px; font-size:14px; font-weight:500 }      /* lh 20px */
.sel-hero-h1     { color:#fff; margin:0 0 24px; font-size:60px; font-weight:700; line-height:1.1 }
.sel-hero-red    { color:#bc1a1a }
.sel-hero-desc   { color:#fffc; margin:0 0 16px; font-size:20px; line-height:1.6 }
.sel-hero-checks { display:flex; flex-wrap:wrap; gap:16px; color:#bc1a1a; margin:0 0 32px;
                   font-size:14px; font-weight:600 }                        /* lh 20px */
.sel-hero-btns   { display:flex; flex-wrap:wrap; gap:12px }
.sel-hero-btn-red     { height:52px; padding:14px 32px; border-radius:8px; background:#bc1a1a;
                        color:#fff; font-size:15px; font-weight:700; display:inline-flex;
                        align-items:center; gap:6px; box-shadow:0 4px 20px #0000004d }
.sel-hero-btn-outline { height:52px; padding:14px 32px; border-radius:8px; border:2px solid #fff;
                        background:0 0; color:#fff; font-size:15px; font-weight:700 }

@media (max-width:991px){ .sel-hero-content{max-width:100%;padding-top:104px;padding-inline:24px}
                          .sel-hero-h1{font-size:40px;line-height:1.15} }
@media (max-width:767px){ .sel-hero-content{padding:88px 16px 48px}
                          .sel-hero-h1{font-size:28px;line-height:1.2}
                          .sel-hero-desc{font-size:15px}
                          .sel-hero-checks{flex-direction:column;gap:6px;font-size:13px}
                          .sel-hero-btns{flex-direction:column;align-items:stretch;width:100%}
                          .sel-hero-btn-red,.sel-hero-btn-outline{width:100%;justify-content:center;
                                                                  text-align:center} }
```

`.sel-hero-btn-outline` is an inline `<a>` in a flex row, so it blockifies to exactly 52px
(2 + 14 + 20 + 14 + 2). Ported as `inline-flex items-center` — identical end state.

Copy:

- eyebrow `SELF-EMPLOYED LENDING SPECIALISTS`
- h1 `Self-Employed Home Loans` `<br>` `<span class="sel-hero-red">Australia</span>`
- desc `Getting a home loan when you're self-employed shouldn't be hard. We specialise in matching ABN holders, sole traders, and business owners with lenders who understand your income.`
- checks `✓ Free consultation` · `✓ No obligation` · `✓ 40+ lenders compared`
- buttons `Book a Free Consult →` and `Call 0412 885 734`

### 3.2 `section.sel-why` — `SelfEmployedWhy` (problem statement + feature grid)

```css
.sel-why          { background:#fff; padding:80px 24px }
.sel-why-container{ max-width:860px; margin:0 auto }
.sel-why-h2       { text-align:center; color:#111; margin:0 0 20px; font-size:36px;
                    font-weight:800; line-height:1.2 }
.sel-why-sub      { text-align:center; color:#777; max-width:560px; margin:0 auto 48px;
                    font-size:15px; line-height:1.7 }
.sel-why-grid     { display:grid; grid-template-columns:1fr 1fr; gap:20px }
.sel-why-card     { display:flex; align-items:flex-start; gap:16px; background:#fafafa;
                    border:1px solid #e8e8e8; border-radius:12px; padding:24px }
.sel-why-icon     { width:40px; height:40px; border-radius:8px; background:#fff5f5;
                    display:flex; align-items:center; justify-content:center; flex-shrink:0 }
.sel-why-card-title{ color:#111; margin:0 0 8px; font-size:15px; font-weight:700 }  /* lh 30px */
.sel-why-card-text { color:#666; margin:0; font-size:14px; line-height:1.6 }

@media (max-width:991px){ .sel-why-h2{font-size:30px} .sel-why-grid{grid-template-columns:1fr} }
@media (max-width:767px){ .sel-why{padding:48px 16px} .sel-why-h2{font-size:24px}
                          .sel-why-card{padding:16px} }
```

Heading `Why self-employed Australians struggle to get home loans`
Sub `Banks often penalise self-employed borrowers with rigid income requirements. If your taxable income is reduced by legitimate deductions, many lenders simply say no. That's where we come in.`

| # | SVG (24px, stroke `#E63946`, width 2) | Component | Title | Text |
| --- | --- | --- | --- | --- |
| 1 | lucide `file-text` | `FileTextIcon` | Flexible Income Verification | We work with lenders who accept BAS statements, accountant declarations, and tax returns — not just payslips. |
| 2 | lucide `monitor` | `LaptopIcon` | 40+ Lender Panel | Access major banks, non-banks, and specialist self-employed lenders to find the most competitive deal. |
| 3 | lucide `shield` | `ShieldIcon` | All Business Structures | Sole traders, partnerships, trusts, and company structures — we've helped them all secure home loans. |
| 4 | lucide `clock` | `ClockIcon` | Fast Pre-Approval | Most self-employed pre-approvals processed within 24–48 hours so you can bid with confidence. |

### 3.3 `section.sel-how` — `SelfEmployedProcess`

```css
.sel-how       { background:#f5f5f5; padding:80px 24px }
.sel-how-container { max-width:860px; margin:0 auto }
.sel-how-h2    { text-align:center; margin:0 0 48px; font-size:36px; font-weight:800; line-height:1.2 }
.sel-how-grid  { display:grid; grid-template-columns:1fr 1fr; column-gap:48px; row-gap:36px }
.sel-how-step  { display:flex; align-items:flex-start; gap:20px }
.sel-how-num   { color:#bc1a1a; width:36px; flex-shrink:0; font-size:28px; font-weight:800;
                 line-height:1 }
.sel-how-title { margin:0 0 8px; font-size:15px; font-weight:700 }                 /* lh 30px */
.sel-how-text  { color:#666; margin:0; font-size:14px; line-height:1.6 }

@media (max-width:991px){ .sel-how-h2{font-size:30px} .sel-how-grid{grid-template-columns:1fr} }
@media (max-width:767px){ .sel-how{padding:48px 16px}
                          .sel-how-h2{margin-bottom:32px;font-size:24px}
                          .sel-how-grid{gap:24px;grid-template-columns:1fr}
                          .sel-how-step{padding:16px} }
```

`.sel-how-num` inherits no `font-family` declaration of its own — it falls through to
`.sel-how`'s `font-family: inherit`, i.e. the page body font. Ported as `font-inter` like the rest of
the section (the section's own container is Inter).

Heading `How we get self-employed borrowers approved`

| № | Title | Text |
| --- | --- | --- |
| 01 | Free Discovery Call | We learn about your business structure, income, and property goals — no obligation. |
| 02 | Income Assessment | We review your financials and identify which lenders best suit your self-employed situation. |
| 03 | Lender Matching | We compare rates and policies across 40+ lenders and present your best options. |
| 04 | Application & Settlement | We handle the paperwork, chase the lender, and keep you updated until settlement day. |

### 3.4 `section.sel-types` — `SelfEmployedBusinessTypes`

```css
.sel-types      { background:#fff; padding:80px 24px 64px }
.sel-types-container { max-width:760px; margin:0 auto }
.sel-types-h2   { text-align:center; margin:0 0 48px; font-size:36px; font-weight:800; line-height:1.2 }
.sel-types-grid { display:grid; grid-template-columns:1fr 1fr; column-gap:48px; row-gap:24px }
.sel-types-item { display:flex; align-items:center; gap:12px; color:#333;
                  border-bottom:1px solid #f0f0f0; padding-bottom:20px; font-size:15px } /* lh 20px */

@media (max-width:991px){ .sel-types-h2{font-size:30px} .sel-types-grid{grid-template-columns:1fr 1fr} }
@media (max-width:767px){ .sel-types{padding:48px 16px}
                          .sel-types-h2{margin-bottom:32px;font-size:24px}
                          .sel-types-grid{gap:16px;grid-template-columns:1fr} }
```

Icon: 18px `CheckCircleBigIcon`, stroke `#E63946`, width 2.5.

Heading `Self-employed home loans for every business type`
Items: `Sole traders & freelancers`, `Partnerships & joint ventures`,
`Company directors & shareholders`, `Trust structures (family & discretionary)`,
`Contractors & subcontractors`, `ABN holders with 1+ year trading`

### 3.5 `section.sel-cta` — `SelfEmployedCtaBand`

```css
.sel-cta          { background:#bc1a1a; padding:64px 24px }
.sel-cta-container{ text-align:center; max-width:760px; margin:0 auto }
.sel-cta-h2       { color:#fff; margin:0 0 12px; font-size:32px; font-weight:800; line-height:1.2 }
.sel-cta-sub      { color:#ffffffd9; margin:0 0 28px; font-size:15px }            /* lh 20px */
.sel-cta-btns     { display:flex; flex-wrap:wrap; justify-content:center; gap:16px }
.sel-cta-btn-dark    { background:#1a2035; color:#fff; border-radius:8px; padding:14px 28px;
                       font-size:15px; font-weight:700 }
.sel-cta-btn-outline { border:2px solid #fff; background:#0000; color:#fff; border-radius:8px;
                       padding:14px 28px; font-size:15px; font-weight:600 }

@media (max-width:991px){ .sel-cta-h2{font-size:28px} }
@media (max-width:767px){ .sel-cta{padding:48px 16px} .sel-cta-h2{font-size:24px}
                          .sel-cta-btns{flex-direction:column;align-items:stretch;width:100%}
                          .sel-cta-btn-dark,.sel-cta-btn-outline{width:100%;justify-content:center} }
@media (max-width:479px){ .sel-cta{background-color:#bc1a1a} }   /* no-op restatement */
```

> **Not `CtaBand`.** The shared `CtaBand` is `.ctab-section` from `/`: `#e61919`, `max-width:860px`,
> a 44px heading, `#1a1a1a` buttons and **no responsive rules at all**. `.sel-cta` differs on
> background, container width, heading size, button colour, outline weight and stacks full-width
> below 768px, and `CtaBand` exposes no props for any of that — so this band is built page-local.

Heading `Ready to get your self-employed home loan sorted?`
Sub `Free consultation · No obligation · Compare 40+ lenders`
Buttons `Book Free Consultation →` → `/contact`, `Call 0412 885 734` → `tel:0412885734`

### 3.6 `section.sel-faq` — `SelfEmployedFaq` — **static, not an accordion**

```css
.sel-faq       { background:#f5f5f5; padding:80px 24px }
.sel-faq-container { max-width:700px; margin:0 auto }
.sel-faq-h2    { text-align:center; margin:0 0 40px; font-size:36px; font-weight:800 } /* lh 36px */
.sel-faq-list  { display:flex; flex-direction:column; gap:16px }
.sel-faq-item  { background:#fff; border:1px solid #e8e8e8; border-radius:10px; padding:24px 28px }
.sel-faq-q     { margin:0 0 10px; font-size:15px; font-weight:600 }                    /* lh 30px */
.sel-faq-a     { color:#666; margin:0; font-size:14px; line-height:1.6 }

@media (max-width:991px){ .sel-faq-h2{font-size:28px} }
@media (max-width:767px){ .sel-faq{padding:48px 16px} .sel-faq-h2{font-size:24px}
                          .sel-faq-item{padding:16px} .sel-faq-q{font-size:16px} }
```

The source markup is `h3.sel-faq-q` + `p.sel-faq-a` inside `div.sel-faq-item` — no `<button>`, no
`aria-expanded`, no script. Ported literally; `FaqAccordion` is **not** used on this page.

Heading `Self-employed home loan FAQs`

1. **Can I get a home loan if I've only been self-employed for 1 year?** — Yes. Several lenders on our panel accept just 1 year of trading history, especially with strong BAS or accountant-prepared financials.
2. **Do I need two years of tax returns?** — Not always. Many lenders accept alternative documentation such as 6–12 months of BAS, bank statements, or an accountant's letter confirming income.
3. **What if my taxable income is low because of deductions?** — We specialise in this exact scenario. Certain lenders 'add back' depreciation and other non-cash deductions, giving you significantly higher borrowing power.
4. **Is a self-employed home loan more expensive?** — Not necessarily. With the right lender match, self-employed borrowers can access the same competitive rates as PAYG earners.
5. **Do you charge a fee?** — No. Our service is completely free to you — we're paid by the lender when your loan settles.

### 3.7 `section.sel-explore` — `ExploreMore` (shared by both pages)

```css
.sel-explore       { background:#f5f5f5; border-top:1px solid #e0e0e0; padding:32px 24px 64px }
.sel-explore-container { text-align:center; max-width:700px; margin:0 auto }
.sel-explore-label { color:#999; margin:0 0 16px; font-size:13px }          /* lh 20px */
.sel-explore-links { display:flex; flex-wrap:wrap; justify-content:center; gap:32px }
.sel-explore-link  { color:#e63946; font-size:15px; font-weight:600 }       /* lh 20px */

@media (max-width:767px){ .sel-explore,.sel-explore-container{padding-inline:16px}
                          .sel-explore-links{flex-direction:column;align-items:center} }
```

Label `Explore more`.
`/self-employed-loans`: `Low Doc Loans →` `/low-doc-loans`, `Calculators →` `/calculators`, `All Services →` `/#services`
`/low-doc-loans`: `Self-Employed Loans →` `/self-employed-loans`, `Calculators →` `/calculators`, `All Services →` `/#services`

---

## 4. `/low-doc-loans`

Metadata — title `Low Doc Home Loans for Self-Employed Australians`, description
`No payslips or tax returns? No problem. FundUp specialises in low doc home loans for self-employed Australians. Compare flexible lenders and get approved fast.`

**9 content blocks across 7 `<section>` elements** — the stats band lives inside `.ldl-hero`
(right column) and the feature grid inside `.ldl-what` (right column).

### 4.1 `section.ldl-hero` — `LowDocHero` (hero + stats band)

```css
.ldl-hero      { display:flex; justify-content:space-between; align-items:center; gap:48px;
                 background:#111; min-height:480px; padding:152px 64px 80px }
.ldl-hero-left { max-width:480px }
.ldl-hero-eyebrow{ color:#bc1a1a; letter-spacing:2.5px; text-transform:uppercase;
                   margin:0 0 16px; font-size:11px; font-weight:700 }        /* lh 20px */
.ldl-hero-h1   { color:#fff; margin:0 0 20px; font-size:52px; font-weight:700; line-height:1.15 }
.ldl-red       { color:#bc1a1a }
.ldl-hero-bold { color:#fff; margin:0 0 12px; font-size:18px; font-weight:700 }  /* lh 20px */
.ldl-hero-desc { color:#ffffffbf; margin:0 0 28px; font-size:16px; line-height:1.7 }
.ldl-hero-btns { display:flex; flex-wrap:wrap; gap:12px }
.ldl-btn-red   { height:52px; padding:0 28px; border-radius:8px; background:#bc1a1a; color:#fff;
                 font-size:15px; font-weight:700; display:inline-flex; align-items:center; gap:6px }
.ldl-btn-outline{ height:52px; padding:0 28px; border-radius:8px; border:2px solid #fff;
                 background:#0000; color:#fff; font-size:15px; font-weight:700;
                 display:inline-flex; align-items:center }
.ldl-hero-right{ flex-shrink:0 }
.ldl-stats-grid{ display:grid; grid-template-columns:1fr 1fr; gap:16px }
.ldl-stat      { display:flex; flex-direction:column; align-items:center; gap:6px; background:#fff;
                 border-radius:10px; min-width:160px; padding:24px 28px }
.ldl-stat-num  { color:#bc1a1a; font-size:36px; font-weight:800; line-height:1 }
.ldl-stat-label{ color:#888; text-align:center; font-size:13px }             /* lh 20px */

@media (max-width:991px){ .ldl-hero{flex-direction:column;padding:104px 24px 60px}
                          .ldl-hero-left{width:100%;max-width:100%}
                          .ldl-hero-h1{font-size:36px;line-height:1.2}
                          .ldl-hero-right{width:100%;max-width:100%;margin-top:40px} }
@media (max-width:767px){ .ldl-hero{padding:88px 16px 48px}
                          .ldl-hero-h1{font-size:28px;line-height:1.25}
                          .ldl-hero-btns{flex-direction:column;align-items:stretch;width:100%}
                          .ldl-btn-red,.ldl-btn-outline{width:100%;justify-content:center}
                          .ldl-hero-right{margin-top:24px}
                          .ldl-stats-grid{gap:12px} }
@media (max-width:479px){ .ldl-hero-h1{font-size:24px} }
```

Note the `≤991` rule keeps the 48px flex `gap` *and* adds `margin-top:40px` → 88px between the two
columns. Reproduced verbatim.

- eyebrow `LOW DOCUMENTATION LENDING`
- h1 `Low Doc Loans for ` `<span class="ldl-red">Self-Employed</span>` ` Australians`
- bold `No tax returns? No problem.`
- desc `Low doc home loans let self-employed Australians use BAS, bank statements, or accountant letters instead of full tax returns to get approved.`
- buttons `Book a Free Consult →`, `Call 0412 885 734`
- stats: `40+` / Lenders compared · `95%` / Max LVR available · `48hr` / Pre-approval turnaround · `$0` / Cost to you

### 4.2 `section.ldl-what` — `LowDocExplainer` (explainer + 4 feature cards)

```css
.ldl-what      { display:flex; align-items:flex-start; gap:64px; background:#f5f5f5; padding:80px 64px }
.ldl-what-left { flex:1; max-width:380px }
.ldl-what-h2   { margin:0 0 20px; font-size:36px; font-weight:800; line-height:1.2 }
.ldl-what-p    { color:#555; margin:0 0 16px; font-size:15px; line-height:1.7 }
.ldl-what-right{ display:flex; flex-direction:column; flex:1; gap:16px }
.ldl-feat-card { display:flex; align-items:flex-start; gap:16px; background:#fff;
                 border:1px solid #e8e8e8; border-radius:12px; padding:20px 24px }
.ldl-feat-icon { width:36px; height:36px; border-radius:8px; background:#fff5f5;
                 display:flex; align-items:center; justify-content:center; flex-shrink:0 }
.ldl-feat-title{ margin:0 0 6px; font-size:15px; font-weight:700 }             /* lh 30px */
.ldl-feat-text { color:#666; margin:0; font-size:13px; line-height:1.6 }

@media (max-width:991px){ .ldl-what{flex-direction:column;padding-inline:24px}
                          .ldl-what-left{width:100%;max-width:100%}
                          .ldl-what-h2{font-size:30px}
                          .ldl-what-right{width:100%;max-width:100%} }
@media (max-width:767px){ .ldl-what{gap:32px;padding:48px 16px} .ldl-what-h2{font-size:24px}
                          .ldl-feat-card{padding:16px} }
```

The `≤991`/`≤767` rules also set `grid-template-columns:1fr 1fr` / `display:flex` on
`.ldl-what-right`, which is already a column flexbox — **both are no-ops**, the cards stay in one
column at every width. Not ported.

h2 `What is a ` `<span class="ldl-red">low doc</span>` ` loan?`
p1 `Instead of two years of tax returns, you provide alternative proof of income — like BAS, bank statements, or an accountant's declaration. We match you with the right lender based on what documentation you have available.`
p2 `A low doc loan is designed for self-employed Australians who don't have the traditional paperwork banks typically require.`

| # | SVG (20px, stroke `#BC1A1A`, width 2) | Component | Title | Text |
| --- | --- | --- | --- | --- |
| 1 | `file-text`, **one** body line | `FileTextIcon` | Minimal Documentation | No full tax returns required. Many lenders accept BAS, bank statements, or an accountant's letter as proof of income. |
| 2 | `shield` | `ShieldIcon` | Major & Specialist Lenders | We access low doc products from mainstream banks and specialist non-bank lenders for the most competitive rates. |
| 3 | `trending-up` | `TrendingUpIcon` | Higher Borrowing Power | Low doc lenders often 'add back' business deductions like depreciation, boosting what you can actually borrow. |
| 4 | `users` | `UsersIcon` | Expert Self-Employed Guidance | We understand ABN structures, GST cycles, and seasonal income — and we know which lenders do too. |

Card 1's inline SVG drops the second `<line x1="16" y1="17" x2="8" y2="17">` that the identical icon
on `/self-employed-loans` keeps. The shared `FileTextIcon` (two lines) is reused rather than adding a
near-duplicate icon.

### 4.3 `section.ldl-docs` — `LowDocDocuments`

```css
.ldl-docs       { background:#1a1a1a; padding:80px 64px }
.ldl-docs-container{ max-width:700px; margin:0 auto }
.ldl-docs-eyebrow{ color:#bc1a1a; text-align:center; letter-spacing:2.5px; text-transform:uppercase;
                   margin:0 0 12px; font-size:11px; font-weight:700 }         /* lh 20px */
.ldl-docs-h2    { color:#fff; text-align:center; margin:0 0 48px; font-size:36px; font-weight:700 } /* lh 36px */
.ldl-docs-list  { display:flex; flex-direction:column }
.ldl-doc-item   { display:flex; gap:24px }
.ldl-doc-left   { display:flex; flex-direction:column; align-items:center; flex-shrink:0 }
.ldl-doc-circle { width:44px; height:44px; border-radius:50%; background:#bc1a1a; color:#fff;
                  display:flex; align-items:center; justify-content:center;
                  font-size:13px; font-weight:700; flex-shrink:0 }
.ldl-doc-line   { background:#333; flex:1; width:2px; min-height:32px; margin:4px 0 }
.ldl-doc-body   { padding-bottom:36px }
.ldl-doc-title  { color:#fff; margin:8px 0; font-size:16px; font-weight:700 }  /* lh 30px */
.ldl-doc-text   { color:#aaa; margin:0; font-size:14px; line-height:1.6 }

@media (max-width:991px){ .ldl-docs,.ldl-docs-container{padding-inline:24px} .ldl-docs-h2{font-size:28px} }
@media (max-width:767px){ .ldl-docs{padding:48px 16px} .ldl-docs-container{padding-inline:16px}
                          .ldl-docs-h2{margin-bottom:32px;font-size:24px} }
```

Both `.ldl-docs` and `.ldl-docs-container` take horizontal padding below 992px, so the gutters
compound (24+24, then 16+16). Verbatim. The fourth item carries a bare `last` class (no CSS rule
anywhere in the bundle) and simply omits `.ldl-doc-line`; `.ldl-doc-body`'s 36px bottom padding
still applies to it.

Eyebrow `WHAT YOU'LL NEED` · h2 `Documents we can work with`

| № | Title | Text |
| --- | --- | --- |
| 01 | BAS (Business Activity Statements) | 6–12 months of BAS showing your business turnover and GST. |
| 02 | Accountant's Declaration | A letter from your accountant confirming your income — no full tax return needed. |
| 03 | Bank Statements | Some lenders assess income from 3–6 months of business bank statements. |
| 04 | Self-Declaration | For strong equity positions, certain lenders accept a signed income declaration. |

### 4.4 `section.ldl-who` — `LowDocEligibility`

```css
.ldl-who       { background:#bc1a1a; padding:64px; font-family:Inte }   /* sic — invalid family */
.ldl-who-container{ max-width:900px; margin:0 auto }
.ldl-who-h2    { color:#fff; text-align:center; margin:0 0 36px; font-size:32px; font-weight:700 } /* lh 36px */
.ldl-who-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:16px }
.ldl-who-item  { display:flex; align-items:center; gap:12px; color:#fff; background:#ffffff26;
                 border-radius:8px; padding:16px 20px; font-size:15px; font-weight:500 } /* lh 20px */

@media (max-width:991px){ .ldl-who,.ldl-who-container{padding-inline:24px}
                          .ldl-who-h2{font-size:30px} .ldl-who-grid{grid-template-columns:1fr 1fr} }
@media (max-width:767px){ .ldl-who{padding:48px 16px} .ldl-who-container{padding-inline:16px}
                          .ldl-who-h2{font-size:24px} .ldl-who-grid{grid-template-columns:1fr} }
```

`font-family: Inte` is a truncated typo, but every descendant sets its own family so it never
resolves against anything — dropped from the port.

**Quirk reproduced:** the six item labels are Webflow-generated spans and only the first three are
Inter —

```css
.text-span,.text-span-2,.text-span-3 { font-family:Inter,sans-serif }
.text-span-4,.text-span-5,.text-span-6 { font-family:system-ui,-apple-system,BlinkMacSystemFont,
   Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif }
```

Items 4–6 (`Company directors`, `Partnership & trust structures`, `ABN holders (6+ months)`) render
in the system UI font on the live site. Kept verbatim per the brief.

Icon: 18px `CheckCircleBigIcon`, stroke `#fff`, width 2.5.

h2 `Who can get a low doc home loan?`
Items: `Sole traders & freelancers`, `Contractors & subcontractors`, `Small business owners`,
`Company directors`, `Partnership & trust structures`, `ABN holders (6+ months)`

### 4.5 `section.ldl-exit` — `LowDocExitStrategy` (timeline + result callout)

```css
.ldl-exit        { background:#f5f5f5; padding:80px 64px }
.ldl-exit-container{ text-align:center; max-width:900px; margin:0 auto }
.ldl-exit-eyebrow{ color:#bc1a1a; letter-spacing:2.5px; text-transform:uppercase; margin:0 0 12px;
                   font-size:11px; font-weight:700 }                          /* lh 20px */
.ldl-exit-h2     { margin:0 0 16px; font-size:36px; font-weight:700 }         /* lh 36px */
.ldl-exit-sub    { color:#666; max-width:580px; margin:0 auto 48px; font-size:16px; line-height:1.7 }
.ldl-exit-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:32px }
.ldl-exit-card   { text-align:center; background:#fff; border:1px solid #e8e8e8;
                   border-radius:12px; padding:32px 24px }
.ldl-exit-circle { width:48px; height:48px; border-radius:50%; background:#bc1a1a; color:#fff;
                   display:flex; align-items:center; justify-content:center; margin:0 auto 16px;
                   font-size:14px; font-weight:700 }
.ldl-exit-title  { margin:0 0 12px; font-size:16px; font-weight:700 }         /* lh 30px */
.ldl-exit-text   { color:#666; text-align:center; margin:0; font-size:14px; line-height:1.6 }
.ldl-result-card { text-align:center; background:#1a1a1a; border-radius:12px; padding:36px 48px }
.ldl-result-title{ color:#fff; margin:0 0 12px; font-size:18px; font-weight:700 }  /* lh 20px */
.ldl-result-text { color:#ffffffbf; margin:0; font-size:15px; line-height:1.7 }

@media (max-width:991px){ .ldl-exit,.ldl-exit-container{padding-inline:24px}
                          .ldl-exit-h2{font-size:30px} .ldl-exit-grid{grid-template-columns:1fr} }
@media (max-width:767px){ .ldl-exit{padding:48px 16px} .ldl-exit-container{padding-inline:16px}
                          .ldl-exit-h2{font-size:24px} }
```

Eyebrow `SMART STRATEGY` · h2 `The low doc exit strategy`
Sub `A low doc loan doesn't have to be forever. We use it as a bridge to get you into the market now, then refinance you to a better rate once your financials are ready.`

| № | Title | Text |
| --- | --- | --- |
| 01 | Secure the deal | We place you with a low doc lender now — using BAS, bank statements, or an accountant's letter — so you don't miss out on the property you want. |
| 02 | Build your financials | Over the next 6–24 months, your accountant prepares your tax returns and financials. We stay in touch and monitor the market for the right time to move. |
| 03 | Refinance to a prime rate | Once your tax returns are lodged, we refinance you to a full doc lender at a lower rate — minimising the time and cost spent on the low doc product. |

Callout: `The result?` / `You get into the market today instead of waiting years for perfect paperwork — then transition to a competitive prime rate as soon as you're ready. Most clients save thousands in the long run.`

### 4.6 `section.ldl-cta2-section` — `LowDocCtaBand`

```css
.ldl-cta2-section{ background:#fff; padding:64px }
.ldl-cta2-inner  { display:flex; justify-content:space-between; align-items:center; gap:48px;
                   max-width:1100px; margin:0 auto }
.ldl-cta2-left   { flex:1 }
.ldl-cta2-heading{ color:#111827; margin:0 0 16px; font-size:34px; font-weight:700; line-height:1.25 }
.ldl-cta2-sub    { color:#6b7280; max-width:480px; margin:0; font-size:15px; line-height:1.6 }
.ldl-cta2-right  { display:flex; flex-direction:column; flex-shrink:0; gap:14px }
.ldl-cta2-btn-primary{ background:#bc1a1a; color:#fff; border-radius:6px; padding:14px 28px;
                       font-size:15px; font-weight:600; text-align:center; white-space:nowrap }
.ldl-cta2-btn-outline{ border:2px solid #111827; background:#0000; color:#111827; border-radius:6px;
                       padding:13px 28px; font-size:15px; font-weight:600; text-align:center;
                       white-space:nowrap }

@media (max-width:991px){ .ldl-cta2-section{padding-inline:24px}
                          .ldl-cta2-inner{flex-direction:column;text-align:center;padding-inline:24px}
                          .ldl-cta2-left{width:100%;max-width:100%;text-align:center}
                          .ldl-cta2-right{width:100%;justify-content:center;align-items:center} }
@media (max-width:767px){ .ldl-cta2-section{padding-inline:16px}
                          .ldl-cta2-inner{gap:24px;padding-inline:16px}
                          .ldl-cta2-heading{font-size:24px}
                          .ldl-cta2-btn-primary,.ldl-cta2-btn-outline{width:100%} }
```

> This is a white two-column band with a 6px radius and `#111827` greys — nothing like the shared
> `CtaBand` (`.ctab-section`, full-bleed `#e61919`, single centred column). Built page-local.

Heading `Get your low doc loan sorted today`
Sub `Free consultation. No tax returns needed. We compare 40+ lenders and handle everything from application to settlement.`
Buttons `Book Free Consultation →` → `/contact`, `Call 0412 885 734` → `tel:0412885734`

### 4.7 `section.faq-section` › `section.fu-faq2` — shared `FaqAccordion`

```css
.faq-section  { background:#fff; padding:0 0 0 0 }
.inline-div-0 { display:none }   /* empty div immediately before the embed */
@media (max-width:991px){ .faq-section{width:100%;padding-inline:16px;overflow-x:hidden} }
```

The panel itself is a Webflow embed with its own `<style>`/`<script>`, already ported as
`FaqAccordion`. Props used: `items` (the six below), `heading="Low doc loan questions answered"`,
`badge="FAQ"`.

> **Resolved.** The build brief specified `allowMultiple={true}` on the grounds that the embed's
> "close others" loop is commented out. In *this* page's copy it is **not** commented out — the
> `items.forEach(... remove('is-open') ...)` block is live code, so the original `/low-doc-loans`
> accordion is single-open. The prop was never actually passed here, and has since been removed
> from `FaqAccordion` altogether: every FAQ on the site is now single-open with the first question
> expanded (`FIXES.md` → *Requested changes*). This page therefore matches its original, bar the
> open first item. (The trailing second `<script>` on this section targets `.faq-item` /
> `.faq-trigger`, which exist nowhere on the page — dead code, not ported.)

1. **What is a low doc loan?** — A low doc (low documentation) loan is a home loan designed for self-employed borrowers who can't provide the full financial documentation that traditional loans require — like two years of tax returns.
2. **Are low doc loan rates higher?** — Low doc loans often carry slightly higher interest rates than standard loans because they are perceived as higher risk by lenders. However, rates vary significantly between lenders, and we'll help you find the most competitive option available.
3. **What's the maximum LVR for a low doc loan?** — Most lenders cap low doc loans at 80% LVR (Loan to Value Ratio), meaning you'll need at least a 20% deposit. Some specialist lenders may offer higher LVRs under specific conditions.
4. **Can I get a low doc investment loan?** — Yes, low doc loans are available for both owner-occupied and investment properties. The criteria may vary slightly, but we can help you navigate the options for your investment strategy.
5. **How long do I need to be self-employed?** — Typically, lenders look for at least 12–24 months of self-employment. Some specialist lenders may consider shorter periods if you have a strong history in the same industry.
6. **Is there a cost to use FundUp?** — Our service is completely free to you. We are paid a commission by the lender when your loan settles. This means you get expert guidance without any out-of-pocket costs.

---

## 5. Defects fixed while porting

| # | Source | Fix |
| --- | --- | --- |
| 1 | `#contact` on both hero primary CTAs — **no `id="contact"` exists on either page**, so the button scrolls nowhere | → `/contact` |
| 2 | `href="tel: 0412885734"` (leading space breaks the dialler) on `/self-employed-loans` | Present only on `nav.fu-nav__call-btn-1`, i.e. the **global header**, not in either page body. Both pages' own `tel:` links are already well-formed. Out of scope for these files — flagged for whoever owns `SiteHeader`. |

## 6. Copy contradictions left verbatim (client marketing copy)

- Hero stat says **95% max LVR**; FAQ Q3 says lenders **cap at 80% LVR**.
- Eligibility list accepts **ABN holders (6+ months)**; FAQ Q5 says lenders want **12–24 months**.
- `/self-employed-loans` accepts **1+ year trading**, and its FAQ Q1 says **1 year** is fine — while
  `/low-doc-loans` FAQ Q5 asks for 12–24 months.
