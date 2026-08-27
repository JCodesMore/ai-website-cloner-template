# UseCasesSection Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/UseCasesSection.tsx`
- **Interaction model: STATIC** — confirmed NOT tabs, NOT scroll-driven. All 3 agent panels render simultaneously, stacked vertically in normal flow (verified: DOM has 3 full `grid-cols-2` panels present at once, no `hidden`/tab-button elements, no `display:none` toggling).

## DOM Structure
```
<div class="flex flex-col gap-8"> — section wrapper
  <div> heading block: "Deploy agents across your customer journey" + intro paragraph
  <div> panel 1 (Inbound Q&A agent) — image col-start-2 (right)
  <div> panel 2 (Demo agent) — image col-start-1 (left)
  <div> panel 3 (Onboarding agent) — image col-start-2 (right)
</div>
```
Each panel: `grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:gap-10` containing an image/visual block + a text block (eyebrow, heading, 3 feature rows).

## Computed Styles

### Section heading block
- Eyebrow-less; `<h2>` "Deploy agents across your customer journey": Fraunces 40px/200/40px line-height/-1.2px tracking, `#000`
- Intro paragraph: Inter 16px/400/24px, `text-content-secondary`, max-width ~600px, margin-top 16px

### Each panel (repeat 3x with alternating `imageSide`)
- Grid: 1 col mobile → 2 col `md:` (`md:grid-cols-2 md:gap-10`), `pb-8` bottom padding, hairline-free (no divider between panels, just padding)
- **Visual column:** `bg-surface-elevated relative aspect-731/708 h-full w-full overflow-hidden rounded-3xl` (32px radius) — original content is an unrecoverable WebGL canvas (see Known Gaps in PAGE_TOPOLOGY.md). Approximate with a static illustrative graphic: a light `bg-surface-elevated` card containing a simple abstract chat/UI mockup built from CSS (rounded rectangles suggesting a chat bubble + a small avatar circle + a few skeleton lines), or an SVG doodle in the site's palette (black/white/beige, no bright colors). Keep it simple — this is a decorative substitute, not a pixel target.
- **Text column:** flex column, gap ~24-32px
  - Eyebrow (small label, e.g. "Inbound Q&A agent"): Inter 14px/500, `text-content-secondary`, possibly a small rounded-full badge/pill
  - Heading (e.g. "Help leads validate with AI chat"): Fraunces 28px/200/28px/-0.84px, `#000`
  - 3 feature rows, each: bold micro-heading (Inter 16px/500/`#000`) + body text (Inter 14px/400/`text-content-secondary`), stacked with ~16px gap between rows, no icons/checkmarks observed — plain text pairs

## Content (verbatim, 3 panels)

### Panel 1 — Inbound Q&A agent (image RIGHT, `md:col-start-2`)
- Eyebrow: "Inbound Q&A agent"
- Heading: "Help leads validate with AI chat"
- Features:
  1. "Engages visitors and answers their questions" — "Discovers what customers are looking for, responds in real time, and turns curiosity into meaningful interactions."
  2. "Qualifies leads and nudges them towards next steps" — "Identifies intent, filters high-value leads, and guides prospects toward the right next action."
  3. "Retains memory and passes context" — "Remembers every conversation and seamlessly shares context across agents for a continuous experience."

### Panel 2 — Demo agent (image LEFT, `md:col-start-1`)
- Eyebrow: "Demo agent"
- Heading: "Give 1:1 demos at scale with an AI expert"
- Features:
  1. "Runs deep-dive demo sessions" — "Delivers interactive, personalised demos by showing your live product in real time."
  2. "Gathers insights from conversations" — "Captures key signals, needs, and preferences directly from each interaction."
  3. "Turns visitors into customers" — "Equips prospects with the knowledge they need to become buyers and gets them started."

### Panel 3 — Onboarding agent (image RIGHT, `md:col-start-2`)
- Eyebrow: "Onboarding agent"
- Heading: "Provide tailored onboarding with an AI guide"
- Features:
  1. "Knows your product inside out" — "Ingests your knowledge base, indexes your entire product, and keeps itself up to date."
  2. "Navigates directly inside your UI" — "Shows new customers how to use your product with a second cursor."
  3. "Helps your users reach their goals" — "Tailors onboarding paths for every account, boosting activation rates."

## Section Heading Text (verbatim)
- H2: "Deploy agents across your customer journey"
- Intro: "Most buyer journeys are full of hurdles, each contributing to drop-off. Let our agents handhold your prospects from intent to activation."

## Downloaded Overlay Assets (optional accent, layer subtly behind/within each visual card if desired)
- `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-qa-{1,2,3}.svg`
- `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-demo-{1,2,3}.svg`
- `/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-onboarding-{1,2,3}.svg`
(These are real gradient-overlay SVGs from the site, ~300x200px each, meant to be centered within the visual card as a soft color wash. Optional — use if it improves the visual card without adding complexity; a plain `bg-surface-elevated` card is an acceptable fallback.)

## Responsive Behavior
- **Desktop (1440px):** 2-column grid per panel, alternating image left/right via `md:col-start-1`/`md:col-start-2`
- **Mobile (390px):** single column — visual stacks above text (image is `order-2` in the DOM order meaning on mobile it may render after text; follow source order: image div appears first in each panel's markup at `order-2` class, i.e. visually second on mobile single-column — text block first, then image)
- **Breakpoint:** 768px (`md`)

## Build note
Implement as one `AgentPanel` internal subcomponent parameterized by `HandholdAgentPanel` (see `src/types/handhold.ts`) plus a `panels` data array, rendered 3x — do not hand-duplicate the JSX three times.
