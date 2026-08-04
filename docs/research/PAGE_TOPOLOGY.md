# Page Topology — fundup.au

## Route inventory (verified by HTTP status, not assumed)

| Route | Status | Title | Build? |
|---|---|---|---|
| `/` | 200 | Self-Employed Mortgage Broker Australia \| FundUp | ✅ |
| `/services` | 200 | Our Mortgage Broking Services for Self-Employed \| FundUp | ✅ |
| `/self-employed-loans` | 200 | Self-Employed Home Loans Australia \| FundUp | ✅ |
| `/low-doc-loans` | 200 | Low Doc Home Loans for Self-Employed Australians \| FundUp | ✅ |
| `/calculators` | 200 | Mortgage & Borrowing Power Calculator \| FundUp | ✅ |
| `/contact` | 200 | Contact FundUp \| Free Mortgage Consultation Australia | ✅ |
| `/book-a-consultation` | 200 | Book A Consultation | ✅ |
| `/privacy-policy` | 200 | Privacy Policy | ✅ |
| `/terms-and-conditions` | 200 | Terms and Conditions | ✅ |
| `/style-guide` | 200 | Fundup | ⛔ mine tokens only, do not build |
| `/services/first-home-buyers` | **404** | — | ⛔ **dead link on the live site** |

**9 routes to build.** `/services/<slug>` sub-pages were intended (an empty Webflow CMS
collection) but never published — only the dead `first-home-buyers` link survives, hard-coded
on both `/` and `/services`.

---

## Global chrome (identical on all 9 pages)

**`nav.fu-nav-1`** — height `4rem`. Logo → `/`. Links: Home `/` · Services `/#services` ·
Self-Employed Loans `/self-employed-loans` · Low Doc Loans `/low-doc-loans` · Calculators
`/calculators` · Contact `/contact` · Call Now `tel:0412885734` (inline phone SVG).
Mobile hamburger `a.fu-nav__mobile-btn-1` with 3-line SVG, driven by `mobile_nav_toggle-1.0.0.js`.

**`footer.fu-footer`** — logo → `/`. Links: Services `/#services` · Contact `/contact` ·
Self-Employed Loans · Low Doc Loans · Calculators · Terms and Conditions.
Three text blocks: copyright, the LMG credit-representative compliance line, and the long
illustrative-purposes disclaimer.

Note the footer does **not** link `/privacy-policy` despite it existing, and nothing anywhere
links `/services` or `/book-a-consultation`.

---

## `/` — Homepage (14 sections)

| # | Element | Working name | Interaction model |
|---|---|---|---|
| 1 | `nav.fu-nav-1` | SiteHeader | click (mobile toggle) |
| 2 | `section#home.fu-hero-embed` | Hero | entrance animation (`@keyframes heroSlideUp`) |
| 3 | `section.trust-bar` | Stats band (4 up) | static |
| 4 | `section#services.services-section` | Services grid (6 cards, ghost numerals 01–06) | hover (`services_card_hover_effects.js`) |
| 5 | `section#about.about-section` | About Ned McLachlan | static |
| 6 | `section.rs2-section` | Trusted by Australians nationwide | TBD — needs browser |
| 7 | `section.fu-testi` | Testimonials | TBD — carousel? needs browser |
| 8 | `section.fd-diff-section` | The FundUp difference (4 items) | static |
| 9 | `section.oc-section` | Our ideal client (3 items) | static |
| 10 | `section.journey-section` | Your journey with us (6 steps) | TBD — needs browser |
| 11 | `section.ctab-section` | CTA band "Ready to get the right loan?" | static |
| 12 | `section#booking.bpa-section` | Borrowing Power Assessment (target of `#bpa-consent2`) | form |
| 13 | `main#contact-git.git-section` | "Ready to get funded?" contact block | static |
| 14 | `section.faq-section` + `section.fu-faq2` | FAQ accordion | click |
| 15 | `footer.fu-footer` | SiteFooter | static |

Hero keyframe, inline in source:
```css
@keyframes heroSlideUp{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
```

Homepage H1: **"Funding solutions for wealth building Australians"**
Stats: 40+ Lenders Compared · 500+ Clients Helped · 24hr *(label duplicated in error)* · 10+ Yrs
Services: First Home Buyers · Self-Employed Loans · Investment Properties · Refinancing ·
Construction Loans · Commercial Finance

---

## `/services` — 2 sections, both reused from the homepage

| # | Element | Working name |
|---|---|---|
| 1 | `nav.fu-nav-1` | SiteHeader |
| 2 | `section#services.services-section` | **same component as homepage §4** |
| 3 | `section#about.about-section` | **same component as homepage §5** |
| 4 | `footer.fu-footer` | SiteFooter |

Big reuse win — this page needs **zero new components**, just route assembly.

---

## `/self-employed-loans` — 8 content sections

Hero (eyebrow + H1 + trust ticks + 2 CTAs) → Problem statement → Feature grid (4 cards) →
Numbered process 01–04 → Business-type list (6 items) → Mid-page CTA band → FAQ accordion
(5 Q&A) → Explore-more links.

## `/low-doc-loans` — 9 content sections

Hero → Stats band (40+ / 95% / 48hr / $0) → Explainer + feature grid (4) → Documents checklist
01–04 → Eligibility list (6) → Exit-strategy timeline 01–03 + callout → CTA band →
FAQ accordion (6 Q&A, `section.fu-faq2`) → Explore-more.

## `/calculators` — 4 interactive calculators

The whole suite is **one Webflow `w-embed w-script` block containing a nested full HTML
document** (so the page serves two `<title>` tags). Ships its own Inter font link.

1. **Self-Employed Borrowing Calculator** — net profit + 5 add-back inputs → assessable income,
   stacked bar, borrowing power at 4× / 4.5× / 5×
2. **PAYG Borrowing Calculator** — single/household toggle, income + debts → HEMS living
   expenses → borrowing power at 4.5× / 5× / 5.5×
3. **Loan Calculator** — amount / rate / term sliders → monthly repayment, donut chart,
   total repayment & interest
4. **Stamp Duty Calculator** — price slider + 8 state/territory selector + standard/FHB toggle →
   duty estimate. **Real progressive bracket maths inline**, with FHB thresholds:
   NSW ≤$800k · VIC ≤$600k · QLD ≤$500k · ACT ≤$600k · WA ≤$430k · TAS ≤$400k · NT ≤$500k

Highest-complexity page by far. The arithmetic must be ported exactly, not approximated.

## `/contact` — 2 content sections

Get-in-touch hero (`main#contact-git.git-section`) with 4 contact items (phone, email,
Australia-wide, 24/7/365) → FAQ accordion (6 Q&A).
**There is no contact form on this page** despite the meta description promising one.
Page has no `<h1>` — starts at `<h2>`.

## `/book-a-consultation` — orphaned booking page

Intro block (reuses `git-*` classes, no contact list) → GoHighLevel booking iframe:
```html
<iframe src="https://api.leadconnectorhq.com/widget/booking/cjRBEEobuaiBp31Omzz5" ...>
<script src="https://api.leadconnectorhq.com/js/form_embed.js"></script>
```
The only third-party embed on the site, and **nothing links to it**. Also carries dead accordion
JS with no matching markup. No `<h1>`.

## `/privacy-policy` — 12 numbered sections, `<h1>` → `<h2>` → `<h3>` rich text
## `/terms-and-conditions` — 15 numbered sections, same structure

Both are static Webflow rich-text pages with bare `<title>` and no meta description.

---

## Shared components (build once, reuse everywhere)

| Component | Used by |
|---|---|
| `SiteHeader` | all 9 |
| `SiteFooter` | all 9 |
| `ServicesGrid` | `/`, `/services` |
| `AboutNed` | `/`, `/services` |
| `FaqAccordion` | `/`, `/self-employed-loans`, `/low-doc-loans`, `/contact` |
| `CtaBand` | `/`, `/self-employed-loans`, `/low-doc-loans` |
| `StatsBand` | `/`, `/low-doc-loans` (different data) |
| `NumberedSteps` | `/`, `/self-employed-loans`, `/low-doc-loans` |
| `ExploreMore` | `/self-employed-loans`, `/low-doc-loans` |
| `LegalPage` | `/privacy-policy`, `/terms-and-conditions` |

---

## Still requires the browser (cannot be derived from source)

- Exact computed styles for every element
- Screenshots at 1440 / 768 / 390
- Sections 6, 7, 10 interaction models (`rs2-section`, `fu-testi`, `journey-section`)
- Scroll-triggered header state changes and entrance-animation thresholds
- Hover transition values on service cards
- Whether the testimonial section is a static grid or an auto-playing carousel
