# Handhold.io — Page Topology

Source: https://handhold.io/ · Route: `/` · Fetched: 2026-08-27

## Stack Detected
- Next.js (App Router, `_next/image`, `_next/static`)
- Tailwind CSS v4 (utility classes directly in `class`, arbitrary values like `bg-[#f2f1ed]`)
- Radix UI primitives (Accordion confirmed: `data-state`, `data-orientation`, `aria-controls`)
- Design tokens as CSS custom properties in `lab()` color space (see DESIGN_TOKENS section below)
- Fonts: `Inter` (self-hosted via next/font, variable weight) for body/UI; `bureauSerif` (STK Bureau Serif — **commercial/licensed font, not redistributable**) for all headings — substitute with a free serif (Fraunces, extralight/light weights) in the clone.
- No Google Fonts `<link>` — fonts are self-hosted via `next/font/local`.
- Cookie consent banner (declined during inspection per privacy default).
- A floating chat-demo widget (iframe, `id="iframe"`) docks bottom-left, appears ~1-2s after load, cycles example placeholder questions ("How much does Handhold cost?" etc.) in its input field. Out of scope to fully replicate (would require a real backend) — clone as a static non-functional visual only.

## Sections (top → bottom, desktop 1440px, scrollY positions)

| # | Name | scrollY top | Height | Notes |
|---|------|------------|--------|-------|
| 1 | AnnouncementBar | 0 | 40 | `€3M raised` link banner, bg `#F2F1ED` |
| 2 | Header/Nav | 40 | 72 | Logo (sprite `<use>`), Resources dropdown, Sign in, Try for free — `position: relative` (NOT sticky) |
| 3 | Hero | 112 | 788 | `h-[calc(100vh-72px)]`, headline + subhead + 2 CTAs, animated wavy gradient (canvas, WebGL), fades in on load |
| 4 | divider | 948 | 1 | 1px hairline, 10% opacity black |
| 5 | LogoMarquee | ~960 | ~65 | Infinite horizontal scroll of 7 customer logos (`animate-[logoSlide_40s_linear_infinite]`), duplicated 4x for seamless loop |
| 6 | StatsQuote | 1025 | 116 | "60% reduction..." / "20% increase..." stat pair + testimonial quote + avatar, flex-row on desktop |
| 7 | AIDemoSection | 1207 | 584 | Card `bg-[#f2f1ed]` rounded-2xl(24px), "AI Demo" eyebrow, "See Handhold in action" heading, demo-bot.webp mockup + floating demo-orb.webp blobs, "Start demo" CTA |
| 8 | UseCasesHeading | 1859 | 140 | "Deploy agents across your customer journey" + intro paragraph |
| 9 | UseCasesSection | 2071 | 2101 | 3 stacked agent panels (Inbound Q&A / Demo / Onboarding), each: 2-col grid, alternating image-left/right, canvas visual (WebGL, unrecoverable — approximate with static illustration) + 3 feature rows with heading+body |
| 10 | divider | 4220 | 1 | |
| 11 | GetStartedHeading | 4325 | 104 | "Get started in minutes" |
| 12 | GetStartedSection | 4405 | 537 | grid `[0.45fr_1fr]`: numbered steps (1,2,3) list left, `how-to-get-started.png` image right (rounded-3xl), "Get started" CTA + caption below |
| 13 | divider | 5021 | 1 | |
| 14 | CTAHeading | 5086 | 140 | "Scale personalised sales without growing your team" |
| 15 | CTASection | 5298 | 560 | grid `[3fr_2fr]`: left = big "Create your own agent" card (bg-surface-elevated rounded-3xl(32px), heading+body+CTA); right = 3 stacked feature cards (Live 24/7, Multilingual, Personalised) same card style |
| 16 | TestimonialsWrapper | 5951 | 428 | padding wrapper |
| 17 | TestimonialsSection | 6071 | 292 | "What our customers say about us" (H4, serif 20px) + 3-col grid of quote cards, each with 48px circular avatar (border), name, title |
| 18 | divider | 6407 | 1 | |
| 19 | FAQSection | 6456 | 428 | "Frequently Asked Questions" (serif 20px) + Radix Accordion, 6 items, questions in serif 28px extralight |
| 20 | divider | 6932 | 1 | |
| 21 | Footer | 6981 | 372 | CTA line "Give a white glove experience to every prospect" (serif 28px) + "Let's talk" button; layered watercolor "hand" images (`hand-top-left.webp` / `hand-bottom-right.webp`, `z-index:-1`, decorative, `overflow-x-clip` on container); legal disclaimer paragraph (small, secondary text); bottom row: Handhold logo + Sign in/Contact us/Careers links + Legal group (Privacy policy/Cookie policy/Responsible disclosure) |

## Layout
- Max content width: `max-w-378` (≈1512px container, actual visible content typically clipped to viewport with `px-4 lg:px-8` gutters)
- Base grid: single column, sections stacked vertically, no sidebar
- Hairline dividers (`border-t border-t-[#000] opacity-10`) separate major sections
- z-index layers: header `z-30`; footer watercolor images `z-[-1]` (behind content); floating chat iframe likely `fixed` high z-index (not fully inspected — floats above all content)

## Design Tokens (from `:root`, `lab()` color space)
```
--surface-base: lab(100% 0 0)                         /* white */
--surface-elevated: lab(95.139% -.175655 2.06032)      /* ≈ #F2F1ED warm off-white */
--surface-overlay: lab(0% 0 0 / .4)
--surface-interactive-primary-base: lab(0% 0 0)        /* black buttons */
--surface-interactive-primary-hover: lab(14.7726% 2.29341 3.7733)
--surface-interactive-primary-disabled: lab(82.0432% 0 0)
--surface-interactive-secondary-base: lab(95.139% -.175655 2.06032)
--surface-interactive-secondary-hover: lab(96.9378% .213504 .6055)
--surface-interactive-secondary-active: lab(86.0894% .121564 5.46051)
--content-primary: lab(0% 0 0)
--content-secondary: lab(0% 0 0 / .55)
--content-tertiary: lab(0% 0 0 / .4)
--content-danger: lab(61.6712% 41.9637 36.4136)
--content-contrast: lab(100% 0 0)
--border-base: lab(95.139% -.175655 2.06032)
--border-strong: lab(86.0894% .121564 5.46051)
--border-hover: lab(14.7726% 2.29341 3.7733)
--border-focus: lab(0% 0 0)
```
Use these `lab()` values verbatim as CSS custom properties for exact color reproduction (modern CSS supports `lab()` natively).

## Typography Scale (observed)
| Use | Font | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| H1 (hero) | serif (bureauSerif→Fraunces) | 72px | 200 (extralight) | 72px (100%) | -2.16px |
| Section H2 | serif | 40px | 200 | 40px (100%) | -1.2px |
| Sub-heading (CTA card, footer line) | serif | 28px | 200 | 28px (100%) | -0.84px |
| Eyebrow / small heading (H4) | serif | 20px | 200 | 20px (100%) | -0.6px |
| Body | Inter | 16px | 400 | 24px | normal |
| Small/secondary body | Inter | 14px | 400 | 20px | -0.18px |
| Button label | Inter | 14px | 400 | 20px | -0.13px |

## Assets Downloaded
All in `public/sites/handhold-io-1ee60dfc/root-8a5edab2/images/`:
alasdair.png, arthur.png, anette.png, demo-bot.webp, demo-orb.webp, usecase-overlay-{qa,demo,onboarding}-{1,2,3}.svg (9 files), how-to-get-started.png, hand-top-left.webp, hand-bottom-right.webp, favicon.svg/.ico, safari-pinned-tab.svg, apple-touch-icon.png, logo-sprite.svg (contains `#handhold-full` symbol).

7 customer logo SVGs (aikido, Parim, LIVEFORCE, parcelly, finbite, ParcelTracker, WHALE) captured as inline markup — see `components/LogoMarquee.spec.md`.

## Known Gaps / Non-recoverable Assets
- **Hero wave background** and **3 use-case panel visuals**: rendered via `<canvas>` with WebGL (`preserveDrawingBuffer: false` default) — `toDataURL()` returns blank frames from outside the render loop, so pixel-exact capture is not possible via available tools. Approximated in specs with CSS/SVG gradients using the observed color impression (blue ~`#4A7FE0`/`#5B8DEF`, gold/tan ~`#D9A75C`/`#E8C79A`, on white) rather than pixel-identical source material. This is a disclosed approximation, not a generated fallback per Atlas Cloud policy (no user approval sought since these are decorative, not brand/trademark assets).
- Full-page and per-section PNG screenshots could not be persisted to disk this session — the in-app Browser pane returned blank captures for any scroll position beyond the initial viewport (a rendering bug in this session, confirmed via DOM/computed-style inspection that content was present and opaque). All specs below are built from `getComputedStyle()` extraction and full-page text dumps instead of screenshot crops.
