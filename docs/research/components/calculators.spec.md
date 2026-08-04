# `/calculators` Specification

## Overview

- **Route:** `src/app/calculators/page.tsx` (Server Component shell)
- **Logic:** `src/lib/calculators.ts` — pure functions, no DOM, no React
- **Components:** `src/components/calculators/*.tsx`
- **Interaction model:** four independent client-side calculators; every output is
  derived during render from `useState`, so there are no effects and no
  `setState`-in-effect synchronisation.

### Provenance

The entire suite ships from the live site as **one Webflow embed** (`div.w-embed.w-script`)
containing a complete nested HTML document — its own `<meta>`, `<link>` to Google
Fonts (Inter 300–800), a ~6 KB `<style>` block and a minified `<script>` holding
all the maths. Browsers discard the nested `<html>`/`<head>`/`<body>` tags but
hoist the `<style>`, so **the embed's `body { … }` rule repaints the real page**:

```css
body { font-family: Inter, sans-serif; background: #f2f2f2; color: #222; }
```

That is why `<main>` on this route carries `bg-[#f2f2f2] font-inter text-[#222222]`
rather than the site's normal white/Instrument Sans surface.

Source of record: `scratchpad/src-cache/html/calculators.html` (page markup +
embed) and `css/review-showcase.webflow.69e19912e0fb5120f56e6bfd.7cb7d5ddc.opt.min.css`
(hero only — the calculators themselves are styled entirely by the embed).

---

## Palette

The embed declares its **own** custom properties, independent of the site tokens:

| Embed var | Value | Used for |
|---|---|---|
| `--red` | `#d62b2b` | every accent: badges, headline figures, sliders, CTA, arcs |
| `--red-hover` | `#b82020` | CTA hover |
| `--dark` | `#111111` | right (results) panel |
| `--light-bg` | `#f5f5f5` | declared, unused |
| `--border` | `#e0e0e0` | panel divider, input + button borders |
| `--text` | `#222222` | body / label text |
| `--muted` | `#888888` | hints, range end labels, inactive toggle |
| `--input-bg` | `#fafafa` | number inputs, state buttons, toggle track |

Chart-only colours: `#e8724c` (depreciation / partner), `#f0a040` (interest),
`#4a90d9` (super / other income), `#7c4dff` (director's wages), `#26a69a`
(other add-backs), `#444444` (donut interest + duty arc), `#252525` (donut base
ring), `#333333` (stacked-bar track).

> **Decision — `#d62b2b`, not `--brand` (`#bc1a1a`).** The embed is a
> self-contained document with a distinctly lighter red than the rest of the
> site. Per the pixel-perfect-emulation rule the components hardcode `#d62b2b`.
> This is a **fourth** site red alongside the three catalogued in
> `DESIGN_TOKENS.md` / `FIXES.md`; it is deliberately not promoted to a global
> token because it exists only inside this embed. `globals.css` was not touched.

---

## Page structure

```
main.bg-#f2f2f2.font-inter.leading-normal.text-#222222
├─ section#home.fu-hero-embed          — "Financial Calculators"
└─ section                             — the embed
   ├─ .calc-section  (Self-Employed Borrowing)
   ├─ hr.calc-divider
   ├─ .calc-section  (PAYG Borrowing)
   ├─ hr.calc-divider
   ├─ .calc-section  (Loan)
   ├─ hr.calc-divider
   └─ .calc-section  (Stamp Duty)
```

Header and footer are mounted globally in `src/app/layout.tsx` — not repeated here.

### Hero — `.fu-hero-embed`

Identical shell to the homepage hero, minus the `__bg` / `__overlay` layers this
page never had (so the flat `#121212` shows through).

| Selector | Desktop | ≤479px |
|---|---|---|
| `.fu-hero-embed` | `bg #121212`, `min-h 40vh`, `pt 140px`, `pb 80px`, flex-centre, `overflow hidden` | `min-h auto`, `pt 100px`, `pb 60px` |
| `.fu-hero-embed__content` | `max-w 768px`, `px 16px`, centred, `animation heroSlideUp .7s ease-out forwards` | `w 100%` |
| `.fu-hero-embed__h1` | Inter 60px/1.1 700 `#fff`, `mb 24px` | 36px, `mb 16px` |
| `.fu-hero-embed__body` | Inter 14px/1.6 400 `#ffffffcc`, `max-w 672px`, `mb 16px` | 16px, `mb 12px` |

`max-[480px]:` is used for the `≤479px` query (`max-[479px]` would exclude 479px itself).

### Section shell — `.calc-section`

`max-width 980px`, `margin 0 auto`, `padding 70px 24px 80px`.

| Selector | Rules |
|---|---|
| `.section-badge` | inline-flex, `gap 6px`, `bg rgba(214,43,43,.08)`, `border 1px rgba(214,43,43,.15)`, `radius 100px`, `padding 5px 14px`, 11px/600, `letter-spacing .04em`, uppercase, `#d62b2b`, `mb 18px`; SVG `13x13` |
| `.section-title` | Inter `clamp(26px, 4vw, 38px)` / 800 / 1.15, centred, `mb 10px`, `#222` |
| `.section-desc` | centred, `#888`, `14.5px` / 1.6, `max-w 480px`, `mb 36px` |
| `.calc-divider` | `<hr>`, `border-top 1px #e0e0e0`, `max-w 980px`, centred |

### Card — `.calc-card`

`grid-template-columns: 1fr 1fr`, `radius 18px`, `overflow hidden`,
`box-shadow 0 4px 40px rgba(0,0,0,.1)`, white. **`@media (max-width:700px)` →
single column** (expressed mobile-first as `min-[701px]:grid-cols-2`).

- `.left-panel` — white, `padding 32px 28px`, `border-right 1px #e0e0e0`
  (→ `border-bottom` when stacked).
- `.right-panel` — `#111`, `padding 32px 28px`, white text, `display flex; flex-direction column`
  (this is what makes `.cta-btn { margin-top: auto }` pin the CTA to the bottom).

> **PAYG card puts `.right-panel` first in the DOM.** On desktop it therefore
> occupies column 2; when stacked, the dark results panel sits *above* the
> inputs. Reproduced as-is.

### `:last-of-type` on `.summary-row`

`.summary-row:last-of-type { border-bottom: none }` matches the last `div`
**sibling**, not the last summary row. Consequence, preserved exactly:

- Loan + Stamp Duty — the third summary row *is* the last `div`, so its rule is dropped.
- Self-Employed — `.bp-rows` follows the summary rows, so **both keep their rule**.

Implemented as `[&:last-of-type]:border-b-0`, which reproduces this automatically
because the component tree emits the same `div` sibling order.

---

## 1. Self-Employed Borrowing Calculator

**Copy**

- Badge: `Self-Employed Borrowing Calculator` (briefcase icon)
- Title: `Self-Employed? See Your True Borrowing Power`
- Description: `As a business owner, your taxable income doesn't tell the full story. Lenders add back expenses like depreciation, interest and super to reveal your real earning capacity.`
- Left panel title: `Your Financials` · Right panel title: `Your Adjusted Income`
- Headline label: `Full Assessable Income`
- Group title: `Add-Back Expenses`; hint: `These are expenses lenders typically add back to your net profit to calculate your borrowing capacity.`
- Disclaimer: `*This is a simplified estimate. Lender policies vary — contact us for an accurate assessment.`

**Inputs** — all `<input type="number" min="0">`, `$` prefix

| Field | `SelfEmployedInputs` key | Source id | Default |
|---|---|---|---|
| Net Profit (from tax return) | `netProfit` | `se-profit` | `120000` |
| Depreciation | `depreciation` | `se-dep` | `15000` |
| Interest Expenses | `interestExpenses` | `se-int` | `10000` |
| Director's Super Contributions | `superContributions` | `se-super` | `12000` |
| Director's Wages | `directorsWages` | `se-wages` | `0` |
| Other Add-Backs | `otherAddBacks` | `se-other` | `0` |

**Formulas** — `calcSE()`

```
totalAddBacks    = depreciation + interestExpenses + superContributions
                   + directorsWages + otherAddBacks
assessableIncome = netProfit + totalAddBacks

conservative = 4   × assessableIncome
moderate     = 4.5 × assessableIncome      ← highlighted row
optimistic   = 5   × assessableIncome

# stacked bar, only when assessableIncome > 0 (otherwise 0)
width(x) = (max(x, 0) / assessableIncome × 100).toFixed(2) + "%"
```

Segment order / colours: net profit `#d62b2b`, depreciation `#e8724c`, interest
`#f0a040`, super `#4a90d9`, director's wages `#7c4dff`, other `#26a69a`. The
legend lists **only the first four**.

Summary rows: `Net Profit` = `AU(netProfit)`; `Total Add-Backs` =
`"+" + AU(totalAddBacks)`, rendered in red.

**Defaults produce:** `$157,000` assessable · `$120,000` profit · `+$37,000`
add-backs · `$628,000` / `$706,500` / `$785,000`.

---

## 2. PAYG Borrowing Calculator

**Copy**

- Badge: `PAYG Borrowing Calculator` (user icon)
- Title: `Salaried? Estimate Your Borrowing Power`
- Description: `For PAYG employees, lenders assess your gross salary, existing debts and living expenses (HEMS) to determine how much you can borrow — solo or with a partner.`
- Left panel title: `Your Income Details` · Right panel title: `Your Borrowing Estimate`
- Headline label: `Total Gross Income`
- HEMS row: `Living Expenses (HEMS)` / `Based on Household Expenditure Measure for your income & dependants` / `AU(hems) + "/yr"`
- Sub-head: `Additional Details`
- Disclaimer: same as calculator 1.

**Inputs**

| Control | Key | Source id | Default |
|---|---|---|---|
| Income Type toggle — `Single` / `Household` | `incomeType` | `payg-btn-*` | `single` |
| Gross Annual Income *(single)* | `grossIncome` | `payg-inc1` | `85000` |
| Your Gross Annual Income *(household)* | `grossIncome` | `payg-inc1h` | `85000` |
| Partner's Gross Annual Income *(household)* | `partnerGrossIncome` | `payg-inc2` | `65000` |
| Other Annual Income (rental, investments, etc.) | `otherIncome` | `payg-other` | `0` |
| Existing Annual Debt Repayments | `existingDebtRepayments` | `payg-debt` | `0` |

**Formulas** — `calcPayg()`

```
partner          = incomeType === "household" ? partnerGrossIncome : 0
totalGrossIncome = grossIncome + partner + otherIncome
hemsAnnual       = incomeType === "household" ? 44000 : 30000
assessableIncome = max(totalGrossIncome − 1.2 × existingDebtRepayments − hemsAnnual,
                       0.5 × totalGrossIncome)

conservative = 4.5 × assessableIncome
moderate     = 5   × assessableIncome      ← highlighted row
optimistic   = 5.5 × assessableIncome

# stacked bar, only when totalGrossIncome > 0 (otherwise 100% / 0% / 0%)
width(x) = (x / totalGrossIncome × 100).toFixed(2) + "%"
```

Constants exported as `HEMS_SINGLE`, `HEMS_HOUSEHOLD`, `DEBT_LOADING` (1.2) and
`ASSESSABLE_INCOME_FLOOR_RATIO` (0.5).

Segments/legend: primary `#d62b2b`, partner `#e8724c` (legend item hidden unless
household), other `#4a90d9`.

**Defaults produce:** single → `$85,000` gross, `$30,000/yr` HEMS, `$247,500` /
`$275,000` / `$302,500`. Household → `$150,000` gross, `$44,000/yr` HEMS,
`$477,000` / `$530,000` / `$583,000`.

> ### Source quirks preserved / noted
> 1. **No dependants input exists.** The hint text mentions dependants, and
>    `PaygInputs` carries a `dependants` field, but the embed ships no control
>    and the script never reads one — HEMS is a flat 30k/44k driven purely by the
>    Single/Household toggle. `dependants` is therefore held at `0` and excluded
>    from the maths. Inventing a dependants scale would fabricate finance logic.
> 2. **Two separate gross-income inputs.** The source has independent DOM nodes
>    for single (`payg-inc1`) and household (`payg-inc1h`), both defaulting to
>    `85000`. The clone uses one `grossIncome` field shared across both modes —
>    indistinguishable at defaults, and it stops the value being lost on toggle.

---

## 3. Loan Calculator

**Copy**

- Badge: `Loan Calculator` (dollar-sign icon)
- Title: `Estimate Your Repayments`
- Description: `Get a quick estimate of your monthly repayments. For a personalised assessment, book a free consult.`
- Left panel title: `Loan Details` · Right panel title: `Your Estimated Repayments`
- Headline label: `Monthly Repayment`
- Donut centre caption: `Principal`
- Disclaimer: `*Estimates only. Actual rates may vary. Contact us for accurate figures.`

**Sliders**

| Slider | Key | Min | Max | Step | Default | Value label | End labels |
|---|---|---|---|---|---|---|---|
| Loan Amount | `amount` | `50000` | `2000000` | `5000` | `500000` | `AU(v)` | `$50K` / `$2M` |
| Interest Rate | `interestRate` | `2` | `12` | `0.1` | `6.5` | `v.toFixed(1) + "%"` | `2%` / `12%` |
| Loan Term | `termYears` | `1` | `30` | `1` | `30` | `v + (v === 1 ? " year" : " years")` | `1 yr` / `30 yrs` |

**Formulas** — `calcLoan()`, standard amortisation

```
r = interestRate / 100 / 12                     # monthly rate
n = termYears × 12                              # number of payments

monthlyRepayment = r === 0
                 ? amount / n
                 : amount × r × (1+r)^n / ((1+r)^n − 1)

totalRepayment = monthlyRepayment × n
totalInterest  = totalRepayment − amount
principalPct   = round(amount / totalRepayment × 100)
```

Summary rows: `Total Repayment`, `Total Interest`, `Loan Amount`.
Donut legend: `Principal AU(amount)` `#d62b2b` · `Interest AU(totalInterest)` `#444`.

**Defaults produce:** `$3,160` monthly (raw `3160.3401174648266`), `$1,137,722`
total, `$637,722` interest, `44%` principal.

---

## 4. Stamp Duty Calculator

**Copy**

- Badge: `Stamp Duty Calculator` (home icon)
- Title: `Estimate Your Stamp Duty`
- Description: `Get a quick estimate of stamp duty costs across Australian states and territories.`
- Left panel title: `Property Details` · Right panel title: `Stamp Duty Estimate`
- Headline label: `Estimated Stamp Duty` · Donut centre caption: `of total cost`
- Disclaimer: `*Estimates only. Concessions & exemptions may apply. Contact us for accurate figures.`

**Inputs**

| Control | Key | Values | Default |
|---|---|---|---|
| Property Price slider | `propertyPrice` | `100000`–`3000000`, step `5000` (`$100K` / `$3M`) | `600000` |
| State / Territory (4-col button grid) | `state` | NSW VIC QLD WA SA TAS ACT NT | `NSW` |
| Buyer Type (radio) | `buyerType` | `Standard` / `First Home Buyer` | `standard` |

### First-home-buyer full exemptions

Applied **before** the brackets; at or below the threshold duty is `$0`.

| State | Threshold |
|---|---|
| NSW | `≤ $800,000` |
| VIC | `≤ $600,000` |
| QLD | `≤ $500,000` |
| ACT | `≤ $600,000` |
| WA | `≤ $430,000` |
| TAS | `≤ $400,000` |
| NT | `≤ $500,000` |
| **SA** | **none — SA first home buyers pay the standard schedule** |

There is no partial concession: above the threshold the standard schedule applies in full.

### Bracket tables (verbatim)

**NSW**

| Price | Duty |
|---|---|
| `≤ 17,000` | `0.0125 × P` |
| `≤ 36,000` | `212.50 + 0.015 × (P − 17,000)` |
| `≤ 97,000` | `497.50 + 0.0175 × (P − 36,000)` |
| `≤ 364,000` | `1,565 + 0.035 × (P − 97,000)` |
| `≤ 1,214,000` | `10,910 + 0.045 × (P − 364,000)` |
| `> 1,214,000` | `49,160 + 0.055 × (P − 1,214,000)` |

**VIC**

| Price | Duty |
|---|---|
| `≤ 25,000` | `0.014 × P` |
| `≤ 130,000` | `350 + 0.024 × (P − 25,000)` |
| `≤ 960,000` | `2,870 + 0.06 × (P − 130,000)` |
| `> 960,000` | `2,870 + 0.055 × (P − 130,000)` |

> ⚠ The top VIC bracket re-bases from `$130,000` at 5.5% instead of continuing
> from `$960,000`, so duty **drops by ~$4,150 as the price crosses $960,000**.
> This is a bug in the source; it is ported as shipped and flagged here rather
> than silently "fixed", because fixing it would make the clone disagree with
> the live site.

**QLD**

| Price | Duty |
|---|---|
| `≤ 5,000` | `0` |
| `≤ 75,000` | `0.015 × (P − 5,000)` |
| `≤ 540,000` | `1,050 + 0.035 × (P − 75,000)` |
| `≤ 1,000,000` | `17,325 + 0.045 × (P − 540,000)` |
| `> 1,000,000` | `38,025 + 0.0575 × (P − 1,000,000)` |

**WA**

| Price | Duty |
|---|---|
| `≤ 120,000` | `0.019 × P` |
| `≤ 150,000` | `2,280 + 0.0285 × (P − 120,000)` |
| `≤ 360,000` | `3,135 + 0.038 × (P − 150,000)` |
| `≤ 725,000` | `11,115 + 0.0475 × (P − 360,000)` |
| `> 725,000` | `28,453 + 0.0515 × (P − 725,000)` |

**SA / TAS / ACT / NT** — one shared schedule (the source's `default` branch)

| Price | Duty |
|---|---|
| `≤ 100,000` | `0.02 × P` |
| `≤ 300,000` | `2,000 + 0.035 × (P − 100,000)` |
| `≤ 500,000` | `9,000 + 0.04 × (P − 300,000)` |
| `> 500,000` | `17,000 + 0.055 × (P − 500,000)` |

### Derived outputs — `calcSD()`

```
duty                  = max(0, round(stampDuty(price, state, buyerType)))
totalUpfrontCost      = price + duty
dutyPercentOfPrice    = (duty / price × 100).toFixed(1)          # "Duty as % of Price"
dutyPercentOfTotalCost= (duty / totalUpfrontCost × 100).toFixed(1)  # donut centre
```

Summary rows: `Property Price`, `Total Upfront Cost`, `Duty as % of Price`.
Donut legend: `Property AU(price)` `#d62b2b` · `Duty AU(duty)` `#444`.

**Defaults produce (NSW, $600,000, standard):** duty `$21,530`, total
`$621,530`, `3.6%` of price, `3.5%` of total cost.

> ### ⚠ The markup's `$21,090` is stale
> The server-rendered HTML hardcodes `$21,090` / `3.5%` / `3.4%` in the stamp
> duty panel, but the script calls `sdTrack(); calcSD();` on load and
> immediately overwrites them. Running the shipped NSW brackets on `$600,000`
> gives `10,910 + 0.045 × 236,000 = **21,530**`. The `$21,090` figure is
> self-consistent with an *older* bracket table that is no longer in the bundle,
> so the live page shows **$21,530**. The clone matches the script, not the
> stale markup. (Contrast the loan panel, whose hardcoded `$3,160` /
> `$1,137,722` / `$637,722` *are* current.)

---

## Donut / gauge widget

Two 140×140 SVGs, identical geometry, driven at runtime in the source by
`setAttribute("stroke-dashoffset", …)` on ids `ln-arc-int` / `ln-arc-prc` and
`sd-arc-prop` / `sd-arc-duty`. Deliberately **not** in `icons.tsx` — they are
mutated widgets, not icons. Rebuilt as `DonutChart.tsx` with React-driven
`strokeDasharray` / `strokeDashoffset`; no ids required.

```
viewBox 0 0 140 140, width/height 140
circle cx=70 cy=70 r=52 fill=none stroke-width=16
  #252525 base ring
  arc A  (painted under)   transform="rotate(-90 70 70)"
  arc B  (painted over)    transform="rotate(-90 70 70)"
stroke-dasharray = 327 on both arcs
```

`327` is the source's hardcoded rounding of `2π × 52 = 326.7256…` and is kept —
using the exact circumference would shift every sweep by ~0.1%.

| Calculator | Arc A (under) | Arc B (over) | Centre |
|---|---|---|---|
| Loan | `#444`, offset `0` (full ring) | `#d62b2b`, offset `327 − (amount / totalRepayment) × 327` | `principalPct%` / `Principal` |
| Stamp Duty | `#d62b2b`, offset `0` (full ring) | `#444`, offset `327 − min(duty / totalCost × 327, 325)` | `dutyPercentOfTotalCost%` / `of total cost` |

The stamp-duty arc is capped at `325` so the grey ring can never fully close.

`.donut-wrap` is `height 140px`, `margin 8px 0 14px`, flex-centred; the centre
text is absolutely positioned and `pointer-events: none`.

---

## Controls

| Element | Rules |
|---|---|
| `.input-wrap input[type=number]` | `h 40px`, `border 1.5px #e0e0e0`, `radius 8px`, `padding 0 12px 0 26px`, Inter 14px, `bg #fafafa`; focus → `border #d62b2b`, `bg #fff`; spinners hidden (`appearance: textfield`) |
| `.input-wrap .prefix` | `$`, absolute `left 12px`, vertically centred, 13px/500 `#888`, `pointer-events none` |
| `input[type=range]` | `h 4px`, `radius 2px`, `bg #ddd`, appearance none; track fill is an inline `linear-gradient(to right,#d62b2b P%,#ddd P%)` where `P = ((v − min) / (max − min) × 100).toFixed(2)` |
| range thumb | `18px` circle, `#d62b2b`, `2px` white border, `shadow 0 2px 6px rgba(214,43,43,.35)` (both `::-webkit-slider-thumb` and `::-moz-range-thumb`) |
| `.state-btn` | `h 34px`, `border 1.5px #e0e0e0`, `radius 7px`, `bg #fafafa`, 12px/600; hover → red border + red text; active → solid `#d62b2b`, white text |
| `.income-toggle` / `.toggle-option` | track: `bg #fafafa`, `border 1.5px #e0e0e0`, `radius 8px`, `padding 2px`, `gap 2px`; option: `flex 1`, `h 36px`, `radius 6px`, 13px/600, `#888`; active → `bg #d62b2b`, white; 14px icon |
| `.radio-option` | `gap 7px`, 13px/500, `select-none`; circle `16px`, `border 2px #e0e0e0` → `#d62b2b` when active, `7px` red dot |
| `.cta-btn` | `w 100%`, `h 44px`, `bg #d62b2b`, `radius 8px`, 13px/700, `letter-spacing .01em`, `margin-top auto`; hover → `#b82020` + `translateY(-1px)` |
| `.disclaimer` | 10px/1.5 `rgba(255,255,255,.3)`, centred, `mt 10px` |

Transitions: `.result-big` and `.bp-row-value` `all .25s`; `.bar-segment`
`width .35s ease`; inputs `border-color .15s`; toggle `.18s`; state buttons `.15s`.

---

## Deviations from source (all deliberate)

| # | Source | Clone | Why |
|---|---|---|---|
| 1 | Sub-heading `Use our free tools to estimate you rloan repayments stamps duty costs across Australia` | `Use our free tools to estimate your loan repayments and stamp duty costs across Australia` | Three typos in one sentence (`you r`→`your`, missing `and`, `stamps`→`stamp`). Explicitly briefed. |
| 2 | `<button onclick='window.open("https://fundup.au/contact","_blank")'>` | `<Link href="/contact">` | Same destination, client-side nav, no popup, no `target="_blank"`. Visual treatment unchanged. |
| 3 | Duty `$21,090` in static markup | `$21,530` | Stale markup; the shipped script computes `$21,530`. See the stamp-duty note above. |
| 4 | No dependants control (hint text mentions them) | Same — `dependants` held at `0` | Adding a scale would be invented finance maths. |
| 5 | Two independent gross-income inputs (single vs household) | One shared `grossIncome` | Same defaults, value survives toggling. |
| 6 | State / buyer-type / income-type controls are `<div onclick>` | `<button type="button">` with `aria-pressed`, and `role="radiogroup"` / `role="radio"` + `aria-checked` for buyer type | Keyboard + screen-reader access; pixels unchanged. |
| 7 | Bare `<label>` used as a sub-head (`Additional Details`) | `<div>` with the same `.field-label` styling | A `<label>` with no control is invalid; `display: block` makes them identical. |
| 8 | `AU()` uses `toLocaleString("en-AU")` | `formatAud()` groups manually | `Intl` output depends on the host's ICU build; a server/client difference would be a hydration error. Byte-identical for all integers. |

Not changed: the VIC `>$960,000` discontinuity and the SA first-home-buyer gap
are left exactly as the site ships them (documented above).

---

## Verification

`src/lib/calculators.ts` was diffed against the original minified functions
(`calcSE`, `calcPayg`, `calcLoan`, `stampDuty`, `calcSD`) pasted verbatim into a
throwaway harness:

- **46/46** fixed assertions against the source's stated defaults.
- **160,016** differential assertions, **0 mismatches** — 4,000 randomised input
  sets across all four calculators, plus an exhaustive sweep of every $1,000
  step from `$0` to `$3,500,000` × 8 states × both buyer types.

| Check | Result |
|---|---|
| SE full assessable income | `$157,000` ✓ |
| SE add-backs / multiples | `+$37,000` · `$628,000` / `$706,500` / `$785,000` ✓ |
| PAYG single gross / HEMS | `$85,000` · `$30,000/yr` ✓ |
| PAYG single multiples | `$247,500` / `$275,000` / `$302,500` ✓ |
| PAYG household | `$150,000` · `$44,000/yr` · `$477,000` / `$530,000` / `$583,000` ✓ |
| Loan monthly repayment | `$3,160` (raw `3160.3401174648266`) ✓ |
| Loan total / interest / donut | `$1,137,722` · `$637,722` · `44%` ✓ |
| Stamp duty NSW $600k standard | `$21,530` — script-correct; markup's `$21,090` is stale |
| Stamp duty NSW $600k total / % | `$621,530` · `3.6%` of price · `3.5%` of total ✓ |

`npx tsc --noEmit`, `npm run lint` and `npm run build` all pass with zero errors
or warnings.
