# Handhold.io — Behavior Bible

## Header / Scroll
- Header is `position: relative` (confirmed via getComputedStyle before/after scrolling to y=1500) — it is **NOT sticky, NOT fixed**, and does **not** change background/shadow on scroll. It simply scrolls away with the page. Implementation: plain static header, no scroll listener needed.

## Page-load entrance animation
- Hero headline, subhead, and CTA buttons fade in on initial load (observed: subhead/buttons at near-zero opacity for ~1-2s after first paint, then fade to opacity 1). Implementation approach: CSS `animation: fadeInUp 0.6s ease-out forwards` with a small stagger (~100ms) per element (headline → subhead → buttons), or Framer Motion `initial/animate` on mount. Not scroll-triggered — triggers once on mount.

## Hero wave graphic
- Rendered via `<canvas>` (2880×1518 backing size, `w-full min-w-[1440px]`), animated continuously (WebGL, likely a shader-based flowing gradient/noise wave). Colors: blue (~#4A7FE0/#5B8DEF) and gold/tan (~#D9A75C/#E8C79A) ribbons crossing on white background, subtle grain/dither texture.
- **Cannot be pixel-extracted** (see PAGE_TOPOLOGY.md gaps). Approximate with an SVG wave path (or CSS conic/linear gradient masked into a wave shape) with a slow `background-position` or `stroke-dashoffset` animation loop (~15-20s, ease-in-out, infinite). Static fallback is acceptable if animation is out of scope.

## Logo marquee (customer logos)
- Infinite horizontal auto-scroll, CSS class `animate-[logoSlide_40s_linear_infinite]` on each logo wrapper. 7 unique logos, each duplicated ~4x in the DOM back-to-back to create a seamless loop (no JS scroll-snap, pure CSS `@keyframes logoSlide { from { transform: translateX(0) } to { transform: translateX(-100%) } }` on a flex row twice the visible width, linear timing, infinite, 40s duration). No pause-on-hover observed to test, but is a common addition — not confirmed either way, omit unless trivial to add.

## Use-case agent panels (Inbound Q&A / Demo / Onboarding)
- **INTERACTION MODEL: static** — all 3 panels render simultaneously, stacked vertically in normal document flow. This is NOT a tab/click-switcher and NOT scroll-driven (confirmed: DOM contains 3 full panels with `grid-cols-2` layouts and 3 separate `<canvas>` elements simultaneously present, no `hidden`/`display:none` toggling observed, no tab button elements found in this section).
- Each panel alternates image column left/right (`md:col-start-2` then `md:col-start-1` then `md:col-start-2` — i.e., right/left/right) purely via CSS grid `order`/`col-start`, no JS.
- Each panel's visual is a `<canvas>` (731×708 @2x, aspect-731/708) inside a `rounded-3xl` container — same WebGL-unrecoverable situation as the hero wave. Approximate each with a static illustrative graphic (abstract UI-mockup style) matching the section's rounded-3xl `bg-surface-elevated` card treatment; do not attempt pixel match.
- Each panel has 3 feature rows (bold micro-heading + body text) below/beside the visual — plain static content, no animation observed.

## FAQ Accordion
- Built with **Radix UI Accordion** (confirmed via `data-state="closed"`, `data-orientation="vertical"`, `aria-controls`, `data-radix-collection-item` attributes in the DOM). 6 items, single-open-at-a-time is Radix's default `type="single" collapsible` pattern (not verified whether multiple can be open — assume single per Radix accordion convention and this design's single-column layout).
- Use shadcn/ui's `Accordion` component (already Radix-based) directly — it ships the standard `accordion-down`/`accordion-up` CSS keyframe transition out of the box. Question trigger text is serif 28px/extralight; do not need custom animation extraction beyond the standard shadcn accordion transition.

## Chat/demo widget (floating, bottom-left)
- An `<iframe>` (`id="iframe"`) docks near the bottom of the viewport, not visible in the very first frame but appears within ~1-2s of load. Shows an input field with a cycling/typing placeholder ("How much does Handhold cost?", "How m..." partial states observed → looks like an animated typewriter cycling through example queries) and a "See AI demo" button.
- This is Handhold's own live product widget (third-party embed, functionally out of scope — no backend to power it). Clone as a **static, non-functional visual replica** (fixed-position pill/input bar + button, bottom-left, no real typing animation required, or a simple CSS text-cycle animation if trivial).

## Responsive sweep
- Not fully swept at 768px/390px this session (browser pane screenshot instability prevented reliable visual diffing below the fold — see PAGE_TOPOLOGY.md gaps). Tailwind class evidence from the DOM (`md:`, `lg:` prefixes observed throughout: `md:grid-cols-2`, `lg:px-8`, `md:top-7.5`, etc.) confirms standard Tailwind breakpoints (`md` = 768px, `lg` = 1024px) are in use. Builders should follow standard Tailwind mobile-first responsive conventions: single-column stacking below `md`, image/text panels stack (image above or below text, image full-width) below `md`, nav collapses to a hamburger/menu icon below `md` (confirmed earlier: a narrow-viewport capture showed a hamburger icon `☰` in place of the desktop nav links).

## Cookie consent banner
- Standard modal dialog ("Do you accept optional cookies?") with Decline/Accept buttons, bottom-center. Out of scope for the clone (no real consent backend) — omit entirely or stub as inert UI if the user wants it for visual completeness. Declined during inspection per this project's privacy default.
