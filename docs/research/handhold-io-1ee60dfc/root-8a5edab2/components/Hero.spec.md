# Hero Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/Hero.tsx`
- **Interaction model:** time-driven (entrance fade-up on mount) + time-driven (infinite logo marquee) + time-driven (ambient wave animation, approximated as static/looping CSS gradient — see Known Gaps)

## DOM Structure
```
<section> h-[calc(100vh-72px)], grid, rows: [content][wave]
  <div> headline column (max-width ~683px, centered)
    <h1>
    <p> subhead
    <div> CTA row (2 buttons)
  <div> wave visual (absolute/behind, bottom portion of section)
  <div> logo marquee row (bottom of section, above the fold border)
</section>
```

## Computed Styles

### Section
- height: `calc(100vh - 72px)`, width: 100%, `position: relative`
- grid-template-rows: `minmax(max-content,1fr) minmax(150px,...)` (content row flexes, wave row has min height)

### H1
- font-family: `font-serif` (Fraunces, substituting bureauSerif)
- font-size: 72px, font-weight: 200 (extralight), line-height: 72px (100%), letter-spacing: -2.16px
- color: `#000` (`text-content-primary`)
- max-width: 683px, text-align: center, margin-inline: auto
- Text: "A dedicated guide for every buyer"

### Subhead (`<p>`)
- font-family: Inter, font-size: 16px, font-weight: 400, line-height: 24px, color: `text-content-secondary` (55% black)
- Text: "AI agents running tailored demos & onboarding 24/7"
- margin-top: ~16px

### CTA row
- flex row, gap: 12px, justify-content: center, margin-top: ~24px
- **Primary "See AI demo":** `bg-black text-white rounded-full`, padding `10px 16px` approx (h=40px total), font-size 14px, includes a small sparkle/diamond icon (lucide-react `Sparkles`, size 16) before the label
- **Secondary "Try for free":** `bg-surface-elevated text-black rounded-full`, same padding/font, no icon

### Logo marquee row
- flex row, `overflow: hidden`, positioned near bottom of hero section, above the divider
- mask: `linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)` (fade edges — confirmed a masked overflow-hidden wrapper div was found in DOM)
- Inner track: flex row, `animate-logo-slide` (40s linear infinite, defined in globals.css) — duplicate the 7-logo set twice back-to-back inside the track so it loops seamlessly (`translateX(-50%)` end state)
- Each logo: `height: ~24-32px`, `width: auto`, `flex-shrink: 0`, spaced with `gap: ~48px`, color `text-content-primary` (black, via `currentColor`)
- Use the 7 logo components from `@/components/sites/handhold-io-1ee60dfc/shared/logos`: `AikidoLogo, ParimLogo, LiveforceLogo, ParcellyLogo, FinbiteLogo, ParcelTrackerLogo, WhaleLogo`

## Wave Visual (Known Gap — approximate, do not attempt pixel match)
- Original: animated WebGL `<canvas>`, full-bleed width, ~1518px tall backing store, positioned in the lower half/bottom of the hero section, behind the logo marquee.
- **Approximation:** an absolutely-positioned full-width `<div>` behind the marquee row containing an inline SVG with 2-3 overlapping wavy `<path>` shapes (S-curve/ribbon shapes crossing the width), filled with soft linear gradients: blue ribbon `linear-gradient(135deg, #5B8DEF, #A9C4F5)`, gold ribbon `linear-gradient(135deg, #E8C79A, #D9A75C)`, both at ~70-85% opacity over a white background, `mix-blend-mode: normal`. Add a subtle continuous horizontal drift animation (`@keyframes wave-drift { 0%,100% { transform: translateX(0) } 50% { transform: translateX(-2%) } }`, 20s ease-in-out infinite) for a sense of motion. Keep it purely decorative and non-interactive (`pointer-events-none`).

## Entrance Animation
- On mount, headline/subhead/CTA row fade+slide up using the `hero-fade-up` keyframe already defined in `globals.css` (`opacity: 0 → 1`, `translateY(12px) → 0`). Stagger: headline 0ms, subhead 100ms, CTAs 200ms delay. Simple CSS `animation` with `animation-delay`, no JS/Framer Motion needed.

## Assets
- Logo components (see above)
- Icon: lucide-react `Sparkles`

## Text Content (verbatim)
- H1: "A dedicated guide for every buyer"
- Subhead: "AI agents running tailored demos & onboarding 24/7"
- Buttons: "See AI demo", "Try for free"

## Responsive Behavior
- **Desktop (1440px):** as described, H1 72px
- **Tablet (768px):** H1 scales down (estimate ~48-56px), CTA row may wrap
- **Mobile (390px):** H1 ~36-40px, subhead 14px, buttons stack or stay inline if they fit, wave graphic simplifies/crops, logo marquee still scrolls but logos may be smaller (~20px height)
- **Breakpoint:** 768px (`md`)
