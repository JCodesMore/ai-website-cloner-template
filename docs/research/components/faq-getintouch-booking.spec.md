# FaqAccordion + GetInTouch + BorrowingPowerForm Specification

## Overview

- **Target files:** `src/components/FaqAccordion.tsx`, `src/components/GetInTouch.tsx`,
  `src/components/BorrowingPowerForm.tsx`
- **Source sections:** `section.faq-section` › `section.fu-faq2` · `main#contact-git.git-section` ·
  `section#booking.bpa-section`
- **Used by:**
  | Component | `/` | `/contact` | `/low-doc-loans` | `/book-a-consultation` |
  |---|---|---|---|---|
  | `FaqAccordion` | ✅ | ✅ | ✅ | ✖︎ (`.faq-section` there wraps the LeadConnector iframe) |
  | `GetInTouch` | ✅ | ✅ | ✖︎ | ✅ (heading/sub differ, **no contact list**) |
  | `BorrowingPowerForm` | ✅ | ✖︎ | ✖︎ | ✖︎ |

  `/self-employed-loans` has **no** `.fu-faq2` — it uses a completely separate static
  `section.sel-faq` (`h3.sel-faq-q` + `p.sel-faq-a`, no accordion at all). That belongs to the
  `/self-employed-loans` route agent, **not** to `FaqAccordion`.

**Provenance.** All CSS below is lifted verbatim from the page-scoped Webflow bundles
`css/review-showcase.webflow.69e063091da62a1e076d275f.624df7b9c.opt.min.css` (`/`) and
`…69e78504f20d425e3c88d922.5b7887958.opt.min.css` (`/contact`) — the `.faq-`, `.git-` and `.bpa-`
rule sets are **byte-identical** between the two. The shared bundle
(`review-showcase.webflow.shared.962c37592.min.css`) contains **no** rules for any of the three
prefixes; it only supplies the Webflow form primitives (`.w-input`, `.w-select`, `.w-button`,
`.w-checkbox*`, `.w-form-done`) reproduced below. The `.fu-faq2` values come from the inline
`<style>` block inside the Webflow embed in each page's HTML.

> **Breakpoint note.** Webflow emits `max-width: 991 / 767 / 479` queries; the `.fu-faq2` embed
> uses its own **`max-width: 600px`**. Both are ported mobile-first so boundaries land exactly:
> - unprefixed = the narrowest band (`≤479`, or `≤600` for `fu-faq2`)
> - `min-[480px]:` = 480–767 · `md:` = 768–991 · `min-[992px]:` = ≥992
> - `min-[601px]:` = ≥601 for `fu-faq2`
>
> Never use `max-[479px]:` — Tailwind v4 compiles it to `not all and (min-width:479px)`, which
> **excludes** 479px itself.

> **Radius note.** `--radius` makes `rounded-lg` = 10px here, so every radius below is written as
> an explicit arbitrary value (`rounded-[12px]`, `rounded-[5px]`).

---

## 1. FaqAccordion — `section.faq-section` › `section.fu-faq2`

### Correction to the brief

The brief described three different FAQ implementations. The cached source says otherwise:

| Claim in brief | What the HTML actually contains |
|---|---|
| `/` and `/contact` use `.faq-item` / `.is-open`, single-open | **False.** Both use the identical `.fu-faq2` embed. `class="faq-item"` appears **0 times** on every page. |
| `/self-employed-loans` uses the same `.faq-item` pattern | **False.** It has no accordion at all — static `section.sel-faq`. |
| Only `/low-doc-loans` allows multiple open | **All three** FAQ pages do. The "close others" loop is commented out in every copy of the embed script. |
| Accent `#dc2626` on `/contact`, `#e5341a` on `/low-doc-loans`, `#bc1a1a` elsewhere | **False.** `.fu-faq2__badge-text { color: #e5341a }` on **all three** pages. `#dc2626` on `/contact` is the `.git-icon` SVG stroke (see §2), not the FAQ. `#bc1a1a` never appears in a FAQ embed. |

A `.faq-item` **script** *is* shipped (single-open, `scrollHeight` based) on `/`, `/contact`,
`/low-doc-loans` and `/book-a-consultation` — but it is dead code with no matching markup, i.e.
the same defect already recorded as `FIXES.md` #11. Ignored.

`allowMultiple` and `accentColor` are still exposed as props per the brief; the *defaults* are set
from what the source actually does (`multiple = false` per the brief's instruction, accent
`brand-faq`). See "API" below.

### DOM structure

```
section.faq-section
  div.inline-div-0                    ← empty, display:none → not rendered
  div.w-embed.w-script
    section.fu-faq2
      div.fu-faq2__inner
        div.fu-faq2__badge
          span.fu-faq2__badge-text    "FAQ"
        div.fu-faq2__heading
          h2                          page-specific
        div.fu-faq2__list#fuFaqList2
          div.fu-faq2__item           × 6
            button.fu-faq2__question[aria-expanded]
              span.fu-faq2__question-text
              span.fu-faq2__icon
                svg  viewBox 0 0 24 24, <polyline points="6 9 12 15 18 9">
            div.fu-faq2__answer[role=region]
              div.fu-faq2__answer-inner
                p
```

### Extracted CSS (verbatim)

**`.faq-section`** (page bundle)
- `background-color: #fff`
- `padding-top: 0; padding-bottom: 0; padding-left: 0`
- `@≤991` / `@≤767` / `@≤479` (all three identical):
  `box-sizing: border-box; width: 100%; padding-left: 16px; padding-right: 16px; overflow-x: hidden`

**`.inline-div-0`** — `display: none`

**`.fu-faq2 *`** — `box-sizing: border-box; margin: 0; padding: 0`

**`.fu-faq2`**
- `width: 100%`
- `padding: 100px 24px` → `@≤600: 60px 20px`
- `background: #f9f9f9`
- `font-family: 'CameraPlainVariable', -apple-system, BlinkMacSystemFont, sans-serif`
- `color: #1a1a1a`

**`.fu-faq2__inner`** — `max-width: 800px; margin: 0 auto`

**`.fu-faq2__badge`** — `display: flex; align-items: center; justify-content: center; margin-bottom: 12px`

**`.fu-faq2__badge-text`** — `font-size: 14px; font-weight: 600; text-transform: uppercase;
color: #e5341a; letter-spacing: 0.1em`

**`.fu-faq2__heading`** — `text-align: center; margin-bottom: 60px`

**`.fu-faq2__heading h2`** — `font-size: clamp(32px, 5vw, 48px); font-weight: 700;
line-height: 1.2; color: #1a1a1a; letter-spacing: -0.02em`

**`.fu-faq2__list`** — `display: flex; flex-direction: column; gap: 12px`

**`.fu-faq2__item`**
- `background: #ffffff`
- `border-radius: 12px`
- `overflow: hidden`
- `border: 1px solid rgba(0, 0, 0, 0.06)`  → `#0000000f`
- `transition: box-shadow 0.3s ease`
- `:hover { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) }` → `#00000008`

**`.fu-faq2__question`**
- `width: 100%; background: transparent; border: none; cursor: pointer`
- `display: flex; align-items: center; justify-content: space-between; gap: 16px`
- `padding: 24px 32px` → `@≤600: 20px 24px`
- `text-align: left; -webkit-tap-highlight-color: transparent`

**`.fu-faq2__question-text`** — `font-size: 18px` (`@≤600: 16px`); `font-weight: 600;
color: #1a1a1a; line-height: 1.4`

**`.fu-faq2__icon`** — `flex-shrink: 0; width: 20px; height: 20px; display: flex;
align-items: center; justify-content: center; transition: transform 0.3s ease; color: #666`
- `svg`: `width/height: 100%; fill: none; stroke: currentColor; stroke-width: 2.5;
  stroke-linecap: round; stroke-linejoin: round`
- `.is-open &` → `transform: rotate(180deg)`

**`.fu-faq2__answer`** — `max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out`
- `.is-open &` → `max-height: 500px`

**`.fu-faq2__answer-inner`** — `padding: 0 32px 32px` → `@≤600: 0 24px 24px`

**`.fu-faq2__answer-inner p`** — `font-size: 16px; line-height: 1.6; color: #666666`

> **Font note.** The embed's `CameraPlainVariable` webfont is omitted per `FIXES.md` #12
> (a `cdn.gpteng.co` third-party leftover), matching the decision already taken for the
> testimonials embed. The section falls back to the project `font-sans` stack. Because
> `globals.css` sets `font-family: var(--font-heading)` on `h1–h6` in `@layer base`, the `<h2>`
> and every Base UI `Accordion.Header` (which renders an `<h3>`) need an explicit `font-sans`
> utility to win.

### Interaction model — click-driven, `max-height` transition

The shipped script toggles `.is-open` on click; its "close other items" loop is **commented out**,
so any number of panels can be open simultaneously. Nothing is open on load.

Ported to Base UI's `Accordion` (via the installed shadcn `Accordion` / `AccordionItem`
wrappers), which drives the same thing with a real `height` transition instead of the
`max-height: 500px` hack — visually identical but without the 500px ceiling that would clip a
long answer on the original.

- `multiple={allowMultiple}` ← Base UI's prop is `multiple`, **not** Radix's `type="single|multiple"`
- `defaultValue={[]}` — all closed on load
- Panel: `h-(--accordion-panel-height) … data-starting-style:h-0 data-ending-style:h-0` with
  `transition-[height] duration-300 ease-[ease-out]` (source: `max-height 0.3s ease-out`)
- Chevron: `group-aria-expanded:rotate-180` + `transition-transform duration-300 ease-[ease]`
  (source: `transform 0.3s ease`)

`AccordionTrigger` / `AccordionContent` from `ui/accordion.tsx` are **not** used — they hardcode
two Lucide chevrons, `text-sm`, `font-medium`, `hover:underline`, `py-2.5` and a focus ring, none
of which the source has, and their `className` merge points do not reach the parts that need
overriding. `Accordion.Header` / `.Trigger` / `.Panel` are taken straight from
`@base-ui/react/accordion` (the exact library `ui/accordion.tsx` itself wraps), so the state
machine, keyboard handling and `--accordion-panel-height` behaviour are unchanged.

### API

```ts
type FaqAccent = "brand" | "brand-contact" | "brand-faq";   // #bc1a1a | #dc2626 | #e5341a

interface FaqAccordionProps {
  items: readonly FaqItem[];        // required — FaqItem from src/types
  heading?: string;                 // default "Frequently asked questions"
  badge?: string | null;            // default "FAQ"; null hides the badge row
  accentColor?: FaqAccent;          // default "brand-faq"
  allowMultiple?: boolean;          // default false
  className?: string;
}
```

`accentColor` is a token union rather than a raw hex so it maps to a **static** Tailwind class
(`text-brand-faq` etc. — all three are already declared in `globals.css` `@theme inline`). That
keeps the "Tailwind utility classes, no inline styles" rule intact; a free-form hex would have
required a `style` attribute.

### Verbatim content

**Homepage** (`HOME_FAQ_ITEMS`, exported) — badge `FAQ`, heading `Frequently asked questions`:

1. **Can I get a home loan if I'm self-employed?**
   Absolutely. We specialise in self-employed lending and work with lenders who accept BAS
   statements, accountant letters, and alternative income verification — not just traditional
   payslips.
2. **How much does it cost to use a mortgage broker?**
   Our service is typically free for you. We are paid a commission by the lender when your loan
   settles. We'll always be transparent about how we are compensated.
3. **How many lenders do you compare?**
   We have access to a wide panel of over 40 lenders, including major banks, second-tier lenders,
   and specialist providers, to ensure we find the right fit for your needs.
4. **How long does pre approval take?**
   Pre-approval can take anywhere from 24 hours to a few business days, depending on the
   complexity of your situation and the lender's current processing times.
5. **Do you help with refinancing?**
   Yes! Refinancing is a core part of what we do. We can help you compare your current rate
   against the market to see if you can save on interest or consolidate debt.
6. **What areas do you service?**
   We provide our services nationally. Whether you're in a major city or a regional area, we can
   assist you via phone, email, and video consultation.

The `—` in Q1 is `&mdash;` (U+2014) in the source.

**Other routes — content belongs to those route agents, recorded here for reference only:**

- `/contact` — badge `FAQ`, heading `Frequently asked questions`. Same six questions as `/`, with
  **one difference**: Q3 reads "over **30** lenders" instead of "over 40 lenders". This is the
  copy contradiction already logged under *Deliberately preserved* in `FIXES.md`.
- `/low-doc-loans` — badge `FAQ`, heading **`Low doc loan questions answered`**; six entirely
  different questions (What is a low doc loan? / Are low doc loan rates higher? / What's the
  maximum LVR for a low doc loan? / Can I get a low doc investment loan? / How long do I need to
  be self-employed? / Is there a cost to use FundUp?).

---

## 2. GetInTouch — `main#contact-git.git-section`

### DOM structure

```
main#contact-git.git-section
  div.w-embed.w-script                ← GoHighLevel tracker, omitted (FIXES.md "Omitted")
  div.git-container
    p.git-eyebrow                     "Get In Touch"
    h2.git-h2                         page-specific
    p.git-sub                         page-specific
    div.git-list                      ← absent on /book-a-consultation
      a.git-item[href=tel:0412885734]      span.git-icon > svg + span.git-text "0412 885 734"
      a.git-item[href=mailto:ned@fundup.au] span.git-icon > svg + span.git-text "ned@fundup.au"
      div.git-item                          span.git-icon > svg + span.git-text "Australia-wide"
      div.git-item                          span.git-icon > svg + span.git-text "Available 24/7/365"
```

> **`<main>` note.** The source really does use `<main>` here, and it is the **only** `<main>` on
> every page (verified: exactly 1 per document on `/`, `/contact`, `/book-a-consultation`).
> `layout.tsx` wraps children in a plain `<div>`, so rendering `<main id="contact-git">`
> reproduces the original exactly and stays valid. **Route agents must not wrap the page in a
> second `<main>`.**
>
> **No `<h1>`.** The section starts at `<h2>` — matching the source, and consistent with the
> "Page-level heading structure" row already in `FIXES.md` *Deliberately preserved*.

### Extracted CSS (verbatim)

**`.git-section`**
- `box-sizing: border-box; background-color: #000; font-family: Inter, sans-serif`
- `padding: 96px 0 10px` → `@≤991: 48px 16px 10px` → `@≤767: 40px 16px 10px` → `@≤479: 32px 16px 10px`

**`.git-container`**
- `text-align: center; max-width: 600px; margin: 0 auto; padding: 0 16px; font-family: Inter, sans-serif`
- `@≤991`: `box-sizing: border-box; width: 100%; padding-left: 16px; padding-right: 16px`
  (block padding stays `0` — renders identically to desktop)
- `@≤767`: `width: 100%; max-width: 100%; padding: 40px 16px`
- `@≤479`: `width: 100%; max-width: 100%; padding: 32px 16px`

**`.git-eyebrow`** — `color: #bc1a1a; letter-spacing: .15em; text-transform: uppercase;
margin: 0 0 16px; font-size: 12px; font-weight: 600` *(no responsive overrides)*

**`.git-h2`** — `color: #fdf6f6; margin: 0 0 20px; font-family: Inter, sans-serif;
font-size: 44px; font-weight: 700; line-height: 1.15`
- `@≤991: font-size: 32px` · `@≤767: text-align: center; font-size: 26px` · `@≤479: 22px`

**`.git-sub`** — `color: #888; max-width: 480px; margin: 0 0 48px; font-size: 14px;
line-height: 1.7; display: inline-block`
- `@≤767`: `text-align: center; max-width: 100%; margin-bottom: 32px;
  padding-left: 8px; padding-right: 8px; font-size: 14px; display: block`
- `@≤479`: `text-align: center; padding-left: 8px; padding-right: 8px; font-size: 14px`
  (inherits `display: block` / `max-width: 100%` / `margin-bottom: 32px` from the ≤767 block)

**`.git-list`** — `gap: 20px; text-align: left; flex-direction: column; display: inline-flex`

**`.git-item`** — `gap: 14px; color: inherit; align-items: center; text-decoration: none; display: flex`

**`.git-icon`** — `background-color: #bc1a1a14; border: 1px solid #bc1a1a26; border-radius: 50%;
flex-shrink: 0; justify-content: center; align-items: center; width: 36px; height: 36px; display: flex`

**`.git-text`** — `color: #333; font-size: 15px; font-weight: 500`

**Icons** — inline SVGs, `width/height 18`, `viewBox 0 0 24 24`, `fill none`,
**`stroke="#dc2626"`**, `stroke-width 2`, round caps/joins. Geometry matches
`PhoneIcon` / `MailIcon` / `MapPinIcon` / `ClockIcon` in `@/components/icons` exactly, so those
are reused with `className="size-[18px] text-brand-contact"`.

> ⚠️ **Preserved defect — flag for the orchestrator.** `.git-text { color: #333 }` sits on
> `.git-section { background-color: #000 }`. That is `#333` on `#000` — a 1.3:1 contrast ratio,
> i.e. the four contact lines are all but invisible on the live site. Reproduced 1:1 per the
> match-first mandate, but this is a genuine accessibility failure and a strong candidate for a
> new `FIXES.md` row (`#fdf6f6`, matching `.git-h2`, would be the natural fix).

### Interaction model

Fully static. The source declares **zero** `:hover`, `:focus` or `transition` rules for any
`.git-*` selector. Server Component.

### API

```ts
interface GetInTouchProps {
  heading?: string;          // default "Ready to get funded?"
  subheading?: string;       // default the / and /contact copy (below)
  showContactList?: boolean; // default true; false for /book-a-consultation
  className?: string;
}
```

### Verbatim content

- Eyebrow (all routes): `Get In Touch`
- `/` and `/contact`:
  - h2 — `Ready to get funded?`
  - sub — `Book a free, no-obligation consultation. We'll review your situation and find the right lending solution for you.`
- `/book-a-consultation` (`showContactList={false}` — the source omits `.git-list` entirely):
  - h2 — `Book a Consultation`
  - sub — `Ready to find the right loan? Contact FundUp for a free, no-obligation mortgage consultation. Call 0412 885 734 or send us a message — we're here to help.`
- Contact list (exported as `GET_IN_TOUCH_ITEMS`):
  | icon | text | href |
  |---|---|---|
  | Phone | `0412 885 734` | `tel:0412885734` |
  | Mail | `ned@fundup.au` | `mailto:ned@fundup.au` |
  | MapPin | `Australia-wide` | — (renders a `div`, not an `a`) |
  | Clock | `Available 24/7/365` | — (renders a `div`, not an `a`) |

---

## 3. BorrowingPowerForm — `section#booking.bpa-section`

`/` only. **`id="booking"` and `id="bpa-consent2"` are both load-bearing** — the hero CTA and
`CtaBand` both link to `#bpa-consent2` (see `CTA_BAND_LINKS`).

### DOM structure

```
section#booking.bpa-section
  div.bpa-container
    h2.bpa-heading      "Get Your Free Borrowing Power Assessment"
    p.bpa-sub           "Find out how much more you could borrow – and at what rate. Takes 60 seconds."
    p.bpa-urgency       "🔴 " <em>Limited free assessment spots available this month</em>
    div.bpa-card
      h3.bpa-card-title "Get Approved"
      div.bpa-form.w-form
        form[method=get]
          div   > label.field-label-8 "First Name"                        + input.text-field-2  [text]
          label.field-label-7 "Last Name"          ← NOT wrapped in a div (source quirk, see below)
          div   >                                                           input.text-field-3  [text]
          div   > label.field-label-6 "Phone <span>*</span>"              + input.text-field-4  [tel]
          div   > label.field-label-5 "Email <span>*</span>"              + input.text-field    [email]
          div   > label.field-label-4 "What best describes your situation?" + select.select-field
          div   > label.field-label-3 "What is your estimated annual income?" + select.select-field-2
          div   > label.w-checkbox.checkbox-field   > input#bpa-consent1[required] + span.checkbox-label
          div   > label.w-checkbox.checkbox-field-2 > input#bpa-consent2            + span.checkbox-label-2
          input[type=submit].submit-button [value "Submit", data-wait "Please wait..."]
          a.link[href=/privacy-policy] "Privacy Policy"
        div.w-form-done > div "Thank you! Your submission has been received!"
        div.w-form-fail > div "Oops! Something went wrong while submitting the form."
```

The **Last Name label is a direct child of `.bpa-form`**, outside the `<div>` that holds its
input. Since `.bpa-form` is `display:flex; gap:16px`, that label becomes its own flex child and
sits **16px** above its input instead of the 5px every other label gets. Reproduced verbatim —
it is a visible vertical-rhythm break on the live page.

### Extracted CSS (verbatim)

`.bpa-*` has **no responsive overrides at all** — an exhaustive scan of the `@media` blocks in the
page bundle turns up zero `.bpa-` selectors. Every value below holds at every width.

**`.bpa-section`** — `background-color: #111; padding: 80px 24px; font-family: inherit`

**`.bpa-container`** — `gap: 12px; text-align: center; flex-direction: column; align-items: center;
max-width: 600px; margin: 0 auto; display: flex`

**`.bpa-heading`** — `color: #fff; margin: 0; font-family: Inter, sans-serif; font-size: 44px;
font-weight: 700; line-height: 1.15`

**`.bpa-sub`** — `color: #aaa; margin: 0; font-family: Inter, sans-serif; font-size: 15px`

**`.bpa-urgency`** — `color: #e63946; margin: 0; font-family: Inter, sans-serif; font-size: 13px`

**`.bpa-card`** — `text-align: left; background-color: #fff; border-radius: 12px; width: 100%;
margin-top: 24px; padding: 40px 48px; font-family: Roboto Serif, sans-serif;
box-shadow: 0 2px 16px #00000014`

**`.bpa-card-title`** — `color: #111; text-align: center; letter-spacing: 0; margin: 0 0 28px;
font-family: Inter, sans-serif; font-size: 36px; font-weight: 400`

**`.bpa-form`** — `gap: 16px; flex-direction: column; display: flex`

**Webflow form primitives** (shared bundle unless noted)
- `label` — `margin-bottom: 5px; font-weight: 700; display: block`
- `.field-label-3 … .field-label-8` (page bundle) — `font-family: Inter, sans-serif; font-weight: 400`
  → net: block, `mb 5px`, weight **400**, 14px/20px inherited from `body`
- `.w-input, .w-select` — `color: #333; vertical-align: middle; background-color: #fff;
  border: 1px solid #ccc; width: 100%; height: 38px; margin-bottom: 10px; padding: 8px 12px;
  font-size: 14px; line-height: 1.42857; display: block`
- `.w-input::placeholder` — `color: #999`
- `.w-input:focus, .w-select:focus` — `border-color: #3898ec; outline: 0`
- `.w-select` — `background-color: #f3f3f3`
- `.select-field, .select-field-2, .text-field` (page bundle) — `color: #676767; font-family: Inter`
- `.text-field-2, .text-field-3, .text-field-4, .checkbox-label, .checkbox-label-2` — `font-family: Inter`
  → **the Email field and both selects are `#676767`; First/Last/Phone stay `#333`**
- `.w-checkbox` — `margin-bottom: 5px; padding-left: 20px; display: block`
- `.w-checkbox-input` — `float: left; margin: 4px 0 0 -20px; line-height: normal`
  (native checkbox — the inputs do **not** carry `w-checkbox-input--inputType-custom`, so
  `/images/checkbox-checkmark.svg` is **not** needed)
- `.w-form-label` — `cursor: pointer; margin-bottom: 0; font-weight: 400; display: inline-block`
- `.checkbox-field` (page bundle) — `margin: 20px 0`
- `.checkbox-field-2` (page bundle) — `margin-bottom: 40px`
- `.w-button` — `color: #fff; line-height: inherit; cursor: pointer; background-color: #3898ec;
  border: 0; border-radius: 0; padding: 9px 15px; display: inline-block`
- `.submit-button` (page bundle) — `background-color: #000; border-radius: 5px; width: 100%;
  padding-top: 13px; padding-bottom: 13px; font-family: Inter`
  → net: full-width black button, `13px 15px`, radius 5px, `#fff` 14px/20px
- `.link` (page bundle) — `text-align: center; justify-content: center; margin-top: 40px;
  margin-left: auto; margin-right: auto; font-family: Inter; display: flex`
- `.w-form-done` — `text-align: center; background-color: #ddd; padding: 20px; display: none`
- `.w-form-fail` — `background-color: #ffdede; margin-top: 10px; padding: 10px; display: none`

> ⚠️ **Preserved defect — flag for the orchestrator.** No stylesheet on the site sets a colour for
> a bare `<a>` (the only `a` rules in either bundle are `a{background-color:#0000}` and
> `a:hover{outline:0}`), so `a.link` "Privacy Policy" renders in the **browser default link blue,
> underlined** (`#0000EE` in Chrome) on a white card. Reproduced literally with
> `text-[#0000ee] underline`, because Tailwind's preflight (`a { color: inherit }`) would
> otherwise silently "fix" it. Candidate for a `FIXES.md` row.

### Verbatim content

| Field | Label | Placeholder | Type |
|---|---|---|---|
| 1 | `First Name` | `First Name` | `text` |
| 2 | `Last Name` | `Last Name` | `text` |
| 3 | `Phone *` (the `*` is a `<span>`) | `Phone` | `tel` |
| 4 | `Email *` (the `*` is a `<span>`) | `Email` | `email` |
| 5 | `What best describes your situation?` | — | `select` |
| 6 | `What is your estimated annual income?` | — | `select` |

- Situation options: `" Please select"` *(leading space, `value=""`)*, `First Home Buyer`,
  `Investor`, `Refinance`, `Upgrading`, `Commercial Lending`, `Asset Finance`
- Income options: `"Please select"` *(no leading space)*, `100K-150K`, `150K-200K`, `200K+`
- Consent 1 (`#bpa-consent1`, `required`):
  > By checking this box, I consent to receive non-marketing text messages from **FundUp** about
  > **Lending Products**. Message frequency varies, message & data rates may apply. Text HELP for
  > assistance, reply STOP to opt out.
- Consent 2 (`#bpa-consent2`, optional):
  > By checking this box, I consent to receive marketing and promotional messages including
  > special offers, discounts, new product updates among others from **FundUp** at the phone
  > number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance,
  > reply STOP to opt out.
- Submit: `Submit` · Link: `Privacy Policy` → `/privacy-policy`
- Success: `Thank you! Your submission has been received!`
- Note the `–` in `.bpa-sub` is an **en dash** (U+2013), and `.bpa-urgency` opens with the 🔴
  emoji (U+1F534) followed by a space, then an `<em>`.

### Interaction model & deliberate divergences

- **No backend** (project scope). `onSubmit` calls `preventDefault()` and swaps the form for the
  `.w-form-done` panel. Nothing is posted anywhere. The `.w-form-fail` panel can never fire and is
  not rendered.
- The source's Webflow markup gives **all six controls `id="field"`** and two labels `for=""`.
  Duplicate IDs break label→control association and screen readers. The clone assigns unique ids
  (`bpa-first-name`, `bpa-last-name`, `bpa-phone`, `bpa-email`, `bpa-situation`, `bpa-income`) with
  matching `htmlFor`. Zero visual change. `#bpa-consent1` / `#bpa-consent2` keep their source ids.
- Every `<option>` in the situation select carries `value="Another option"` in the source (a
  Webflow authoring default that was never edited). Since nothing is submitted, the clone uses the
  option label as its value.
- Selects are the shadcn/Base UI `Select` rather than a native `<select>`; the trigger is styled to
  the `.w-select` box exactly (38px, `#ccc` border, `#f3f3f3` fill, `#676767` text, square
  corners). The dropdown popup itself is the shadcn surface — the original's popup is
  OS-rendered and cannot be reproduced in CSS. Note `ui/select.tsx` sets height via
  `data-[size=default]:h-8`, so the override must also be written as
  `data-[size=default]:h-[38px]` or it loses the merge.
