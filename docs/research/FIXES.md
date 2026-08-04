# Deliberate divergences from the live site

The clone matches fundup.au visually 1:1. These are the **functional defects** we fix rather
than reproduce, agreed with the user during reconnaissance.

## Fixed

| # | Defect on live site | Where | Fix |
|---|---|---|---|
| 1 | `/services/first-home-buyers` returns **404** | `/` services card, `/services` services card | Point the card at `/contact` (no first-home-buyer page exists anywhere on the site) |
| 2 | `tel: 0412885734` — stray space breaks the tel: handler | `/self-employed-loans` CTA | `tel:0412885734` |
| 3 | `#contact` anchor targets an ID that doesn't exist on the page | `/self-employed-loans`, `/low-doc-loans` hero CTAs | Link to `/contact` |
| 4 | Typo: "estimate you rloan repayments stamps duty costs" | `/calculators` sub-heading | "estimate your loan repayments and stamp duty costs" |
| 5 | Stat label duplicated — "24hr" reads "Lenders Compared" | `/` trust bar | "24hr Turnaround" |
| 6 | Red buttons hover to **blue** (`#8ca5fe`) — un-rebranded Flowkit template colour | site-wide `button-primary-bg-hover` | Darkened shade of the button's own red |
| 7 | Accent tints `accent-primary-a10…a90` are all `#4f75fe` template blue | site-wide tokens | Derived from the relevant red |
| 8 | `<link rel="canonical" href="https://review-showcase.webflow.io">` — staging URL, patched client-side by JS | every page | Correct canonical via Next.js `metadata` |
| 9 | `lang` attribute set by JS rather than on `<html>` | every page | `<html lang="en">` server-rendered |
| 10 | `/privacy-policy` §5 — the live DOM emits 5.1–5.3, 5.5, 5.6, then a **content-less** `<h3>5.4</h3>` at the very end, with 5.4's two paragraphs stranded under 5.3 | `/privacy-policy` | Heading reunited with its paragraphs; 5.1 → 5.6 emitted in order |
| 10b | `/terms-and-conditions` §10 Indemnity — the four-item `<ul>` is emitted **before** its lead-in paragraph, leaving the list with no introduction | `/terms-and-conditions` | Lead-in moved above the list. Order only; text unchanged |
| 11 | Dead accordion JS with no matching markup | `/book-a-consultation` | Omitted |
| 12 | `CameraPlainVariable.woff2` from `cdn.gpteng.co` — unused third-party widget leftover | `/contact`, `/low-doc-loans` | Omitted |
| 13 | **Booking calendar collapses to zero width.** Iframe wrapper is `padding: 40px 500px` at ≥992px, leaving it `100vw − 1000px` — ~440px at 1440px and **effectively zero between 992 and ~1050px**, on the only page that can take a booking | `/book-a-consultation` | Centred `max-w-[920px]` with normal gutters |
| 14 | **Contact details invisible.** `.git-text` is `#333` on a `#000` section — 1.3:1 contrast, so phone, email, "Australia-wide" and "Available 24/7/365" are all unreadable | `/`, `/contact` | `#fdf6f6` — the colour `.git-h2` already uses in the same section |
| 15 | **Testimonial mini-cards wired in reverse.** Cards are listed in the opposite order to the slides while `data-idx` counts up, so clicking "Daniel" shows Martin's slide and the highlighted card disagrees with the quote on screen | `/` | Each card now targets its own slide |
| 17 | **Every page sat 141px too low.** Our `layout.tsx` padded the content wrapper by the nav height. The source does no such thing — its heroes start at viewport top *under* the fixed nav and compensate with their own `padding-top: 140px`. Measured live: `#home` top `0`, `h1` top `176`; ours were `112` / `317` | site-wide | Wrapper padding removed. `/`, `/self-employed-loans`, `/low-doc-loans`, `/calculators` now match the live site exactly |
| 18 | **Content hidden behind the fixed nav.** The five routes that don't open with a hero have no clearance in the source either — on live `/services` the first section starts at `top: 0` with only 96px padding, so its eyebrow renders *behind* the 113px nav | `/services`, `/contact`, `/book-a-consultation`, `/privacy-policy`, `/terms-and-conditions` | Per-page nav clearance added. (`LegalPage` needed none — its `section-y` padding already exceeds the nav at every breakpoint.) |
| 19 | **Body metrics were wrong site-wide.** Live `body` is `14px / 20px` absolute; ours was `1rem / 1.6`, so every element not setting its own size rendered 14% large with ~5px extra leading | `globals.css` | Set to `14px / 20px`. `LegalPage` opts back out with explicit `text-base leading-[1.6]` — long legal prose at a 1.25 ratio would be unreadable, and its typography is already a documented divergence |
| 20 | **Legal pages cramped under the nav at mobile.** `LegalPage` relies on `section-y`, which is only `4rem` (64px) below 480px against a 57px fixed nav — a 7px gap | `/privacy-policy`, `/terms-and-conditions` | Mobile-scoped `pt-[104px]`, explicitly cancelled from 480px up so `section-y` still governs every wider breakpoint. Gap: 7px → 47px at mobile, unchanged at desktop |
| 16 | **Ideal-client cards stack flush on mobile.** `.oc-grid` flips to `display:block` below 480px, making its 24px gaps inert so the three cards butt against each other with zero separation | `/` | Kept as a grid at all widths; single column below 480px, 3-up above |

## Requested changes (client direction, not defect fixes)

Behaviour that works correctly on the live site but was changed on request. Kept separate from
the table above, which is scoped to actual defects.

| Change | Where | Live behaviour | Ours |
|---|---|---|---|
| **FAQ accordions open one at a time, with the first question already expanded on load** | `/`, `/contact`, `/low-doc-loans` | Inconsistent, and only by accident: all three ship the same embed script, but `/` and `/contact` have its "close the others" loop commented out so any number of answers can be open, while `/low-doc-loans` runs it. All three load fully closed. | Single-open on all three, first item expanded. Clicking the open item still collapses it, leaving none open — the same toggle the source performs. The per-page `allowMultiple` prop was removed rather than defaulted, so the old inconsistency can't creep back |

`/self-employed-loans` is **untouched**. Its FAQ is five static `.sel-faq-item` cards with every
answer permanently visible — no `<button>`, no `aria-expanded`, no script — so there is no
accordion to make single-open. Making it one would mean building interactivity the original never
had; left as-is by decision.

## Deliberately preserved

| Item | Decision |
|---|---|
| **Seven different reds** — `#BC1A1A` (custom styles, dominant) · `#bd1f1f` (Flowkit token + `.oc-accent`) · `#dc2626` (`/contact` icons) · `#e5341a` (`/low-doc-loans` FAQ embed **and the whole testimonials section**) · `#e61919` (`.ctab-section` background) · `#E63946` (journey step SVG strokes) · `#d62b2b` (the `/calculators` embed) | Kept exactly where each appears, per user decision. Visual fidelity over token purity. **Note:** originally recorded as three — the rest surfaced progressively as sections were extracted. If you ever want these unified, `#BC1A1A` is the one to standardise on. |
| `.oc-section` (Our ideal client) has **no 991/767 breakpoints at all** — the grid stays 3-up down to 480px, with three ~240px cards each carrying 40px padding | Tablet behaviour preserved as-is. (The separate ≤479px gap-collapse bug is **fixed** — see row 16.) |
| Contradictory copy — "40+ lenders" vs "over 30 lenders"; "95% max LVR" vs "80% cap"; "ABN 6+ months" vs "12–24 months" | Left verbatim. This is marketing/compliance copy and not ours to reconcile. **Worth raising with the site owner.** |
| `/book-a-consultation` orphaned — nothing links to it | Route still built and reachable by URL; not added to nav, matching the original |
| `/services` and `/privacy-policy` absent from nav and footer | Matches the original |
| No contact form on `/contact` despite the meta description promising one | Matches the original — the real booking flow lives at `/book-a-consultation` |
| Page-level heading structure — `/contact` and `/book-a-consultation` start at `<h2>` with no `<h1>` | Matches the original |

## Open questions — still your call

**The "Privacy Policy" link renders in browser-default blue and underlined.** No stylesheet on
the site sets a colour for a bare `<a>`. Reproduced explicitly as `text-[#0000ee] underline`,
because Tailwind Preflight would otherwise silently restyle it and diverge from the original.
Left as-is: it's a styling omission rather than a functional defect, so it falls under
"clone visuals" rather than "fix defects". One-line change if you'd rather it matched the
site's other link treatment.


**Legal page typography.** The live `/privacy-policy` and `/terms-and-conditions` don't use the
site's type system at all — they're a Webflow one-off in **Inter at 20px h1 / 14px body**,
unrelated to every other page on fundup.au.

Our build instead applies the site's own Webflow type ramp (page title on the h2 scale
1.45→2.83rem @600, clause headings on the h3 scale 1.02→2rem @500, sub-clauses on the h4 scale),
constrained to a 50rem measure. That reads far better for long-form legal prose, but it **is a
visual divergence from the original**, not a defect fix.

Say the word and it's a quick change back to the literal Inter/20px/14px treatment.

## Calculator fidelity

The four calculators on `/calculators` were ported from the embed's own script, then verified
**differentially** against the original minified functions: 4,000 randomised input sets plus an
exhaustive sweep of every $1,000 step from $0–$3.5M × 8 states × both buyer types —
**160,016 assertions, 0 mismatches**.

Two things this surfaced:

- **NSW stamp duty on $600k is `$21,530`, not the `$21,090` shown in the page markup.** That
  figure is stale hardcoded HTML from an older bracket table; the embed's script runs on load and
  immediately overwrites it. We ported the script — i.e. what a visitor actually sees.
- **A VIC bracket bug is preserved as shipped:** the top bracket re-bases from $130k at 5.5%, so
  duty *falls* by roughly $4,150 as the price crosses $960,000. Reproduced rather than corrected,
  since fixing it would mean inventing our own duty maths. Also note SA has no first-home-buyer
  rule in the source.

The PAYG calculator's hint text mentions dependants and the type carries the field, but the
embed ships no dependants control and its script never reads one — HEMS is a flat $30k/$44k off
the Single/Household toggle. Held at `0` rather than inventing a scale.

## Omitted (analytics / tracking, not visual)

- GoHighLevel external tracking script (`link.msgsndr.com`, `tk_7857cdab35ef47008a015d70f7175bb3`)
- jQuery 3.5.1 and the Webflow runtime — replaced by React
