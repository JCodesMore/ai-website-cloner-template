# Page Topology — dev.muapi.ai/open-generative-ai

Source: https://dev.muapi.ai/open-generative-ai ("Open Generative AI — Free AI Image & Video Studio | Muapi")

## Scope

Per user decision: clone **only this landing page as it renders** (the "Image Studio" default view).
The 13 other nav destinations (Video, Audio Studio, AI Clipping, Vibe Motion, Lip Sync, Body Swap,
Cinema Studio, Marketing Studio, Workflows, Agents, Design Agent, Apps, MCP & CLI) are out of scope —
their nav links exist visually but do not need working destination pages.

## Layout Overview

Single vertical flow, no sidebars, no scroll-snap, no parallax. Root container:
`min-h-screen bg-[#050505] flex flex-col` (page background `#050505`, near-black).

Stacking order top to bottom:

1. **Promo banner** — full-width, NOT sticky, flows above header, dismissible (client state, closes to nothing / collapses)
2. **Header/Nav** — sticky top-0, z-50, stays pinned as page scrolls (page itself barely scrolls — content is short)
3. **Hero / Studio Panel** — the only "content" section; fills remaining viewport height (`min-h-[50vh]` inner wrapper), contains the icon, heading, subtitle, and a bottom-anchored floating prompt card
4. **Footer** — multi-column link directory + copyright bar

## Dependencies / Overlays

- Header is `position: sticky` with `bg-black/95` + `backdrop-blur-md` — sits above hero content while scrolling.
- The prompt card inside the hero is `position: absolute; bottom: 1rem` within its relative hero container — it's pinned to the bottom of the hero viewport block, not part of normal document flow.
- No modals are open by default. Clicking generation controls (model selector, aspect ratio, count, Generate) without an API key opens an "API Key Required" dialog (auth-gated — out of scope per template defaults, but noted for visual completeness).

## Interaction Model Per Section

| Section | Model |
|---|---|
| Promo banner | click-driven (✕ dismiss button) |
| Header nav | click-driven (client-side route switch between tool tabs); no scroll-triggered style change observed (header styling is static regardless of scroll position, since page content is short) |
| Hero icon | hover-driven (glow opacity + icon scale-110 on group hover) + time-driven (sparkle emoji has `animate-pulse`) |
| Hero heading/panel | time-driven entrance (`animate-fade-in-up` on mount, `transition-all duration-700`) |
| Prompt card | time-driven entrance (`animate-fade-in-up`); click-driven controls (image-upload icon button, model dropdown, aspect-ratio dropdown, count 1/2/3/4 toggle, Generate button) |
| Footer | static, link hovers only |

## Responsive Breakpoints Observed

- **Desktop (1440px):** full nav visible in one row, hero heading at `text-6xl` (60px), prompt card `max-w-4xl`, footer in multi-column grid (Product / Resources / Models / Tools / Model Pages / Company).
- **Mobile (390px):** nav becomes a horizontally-scrollable single row (`overflow-x-auto`, no hamburger, no wrap) with items simply clipped/scrollable rather than collapsing to a menu; hero heading drops to `text-3xl` (30px); prompt card controls wrap (`flex-wrap`) — aspect ratio + count group wrap onto the row under the model selector; Generate button becomes full width (`w-full sm:w-auto`).
- Tailwind breakpoint used throughout is `sm:`/`md:`/`lg:` (i.e. ~640/768/1024px) — no unusual custom breakpoints found.
