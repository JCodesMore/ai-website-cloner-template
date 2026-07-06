# Behaviors — dev.muapi.ai/open-generative-ai

## Global

- Design tokens are Tailwind utility-first; the site's own `className` strings were captured directly via
  DOM inspection (this is the ground truth — computed styles were used only to resolve custom CSS vars).
- `--primary` resolves to `rgb(34, 211, 238)` = `#22d3ee` (cyan-400 equivalent). Used for accents, active
  states, focus rings, the "Generate" button, the model badge, and the icon glow.
- Body background: `rgb(18,18,18)`. Outermost app shell background: `#050505` (near-black, slightly darker
  than body — the shell div overrides it).
- Font: `Inter` (with `"Inter Fallback"` + system-ui stack) — Google Font, no custom self-hosted font found.
- `html` class includes `dark` — site is dark-mode-only, no light variant detected.
- No smooth-scroll library detected (no `.lenis` / `.locomotive-scroll` class, no scroll-snap on any container).
- No scroll-triggered header restyle — header styling is constant regardless of scroll position (page is short).

## Promo Banner

- Container: `w-full bg-indigo-600 flex items-center justify-center px-4 py-2 gap-3 relative z-50`
- Background resolves to `oklch(0.511 0.262 276.966)` (Tailwind `indigo-600`).
- Text: `text-[13px] font-bold text-white`, center-aligned, single line: "Unrestricted AI Images & Videos → Auto-Publish as YouTube Shorts & TikToks, Earn ↗"
- Close button: `✕`, `absolute right-3 text-white/60 hover:text-white transition-colors text-lg leading-none`
- **Interaction model:** click-driven. Clicking ✕ removes/collapses the banner (client component state — implement as local `useState` toggle, no need for persistence).

## Header / Nav

- `header.w-full.z-50.sticky.top-0.bg-black/95.backdrop-blur-md.border-b.border-white/5`, height 56px (+1px border = 57px measured).
- Left cluster: `flex items-center gap-5 min-w-0 flex-1 overflow-x-auto`
  - Logo: `w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0` containing the muapi mark image.
  - Nav: `flex items-center gap-5 text-[13px] font-semibold text-secondary` — 14 buttons (not `<a>` tags — client-side route switch): Image, Video, Audio Studio, AI Clipping, Vibe Motion, Lip Sync, Body Swap, Cinema Studio, Marketing Studio, Workflows, Agents, Design Agent, Apps (has a small `$`-shaped icon after the text, colored via icon `stroke`/`fill`, not text), MCP & CLI.
  - Active item ("Image" on this page): `text-white`. Inactive: `text-secondary hover:text-white transition-colors` (secondary ≈ zinc-400 `rgb(161,161,170)`).
  - **Interaction model:** click-driven route switch — no hover-only reveal, no dropdown.
- Right cluster: `flex items-center gap-3 shrink-0 relative z-10 bg-black/95 pl-3` (own bg + z so it stays opaque over the scrollable nav on overlap)
  - Language toggle `中文`: `text-[12px] font-bold text-secondary hover:text-white transition-colors border border-white/10 hover:border-white/30 rounded-lg px-2.5 py-1`
  - Pricing icon button: `hidden md:flex`, `opacity-50 cursor-default` (visually present but inert/disabled on this page)
  - "Enter API Key" button: `flex items-center gap-1.5 text-[13px] font-bold bg-[#22d3ee] text-black px-3 py-1.5 rounded-lg hover:bg-[#e5ff33] transition-colors shadow-lg shadow-[#22d3ee]/20` — **hover swaps the background color entirely** (cyan → lime `#e5ff33`), not just an opacity/shade shift.
- **Responsive:** at 390px the nav row does NOT collapse to a hamburger — it stays one row and becomes horizontally scrollable/clipped (`overflow-x-auto`), trailing items get cut off visually.

## Hero Icon Block

- Wrapper: `mb-12 relative group`
- Glow layer (behind icon, blurred): `absolute inset-0 bg-primary/10 blur-[120px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-1000`
- Icon frame: `relative w-24 h-24 md:w-32 md:h-32 bg-white/[0.02] rounded-[2rem] flex items-center justify-center border border-white/[0.05] overflow-hidden backdrop-blur-sm`
- Inner icon tile: `w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 relative z-10 transition-transform duration-500 group-hover:scale-110` — contains a Lucide-style "image" icon (rect + circle + polyline), stroke color cyan.
- Sparkle decoration: `absolute top-4 right-4 text-[10px] text-primary/40 animate-pulse` containing the literal `✨` emoji — infinite pulse (opacity breathing), not click-driven.
- **Interaction model:** hover-driven (glow opacity 0.3→0.6 over 1000ms, icon tile scale 1→1.10 over 500ms, both `group-hover`) + time-driven (sparkle pulse, infinite).

## Heading + Subtitle

- Wrapper: `flex flex-col items-center justify-center h-full animate-fade-in-up transition-all duration-700 min-h-[50vh]` — whole hero content block fades/slides in on mount.
- `h1`-equivalent: `text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 text-center px-4`, built from two inline `<span>`s:
  - Line 1 span: `text-white/40 font-medium` → "START CREATING WITH" (desktop computed: 60px/60px, weight 500, letter-spacing -1.5px)
  - Line 2 span: `text-white` (desktop computed: 60px/60px, weight 800, letter-spacing -1.5px) → "IMAGE STUDIO" (bold/heavier + full white, contrast against the dimmer first line)
- Subtitle `<p>`: `text-white/40 text-sm md:text-base font-medium tracking-wide text-center max-w-lg leading-relaxed` → "Describe a scene, character, mood, or style — and watch it come to life"

## Prompt Card (bottom-anchored)

- Positioning wrapper: `absolute bottom-4 w-full max-w-[95%] lg:max-w-4xl z-40 animate-fade-in-up` (anchored to bottom of the relative hero block, not the viewport)
- Card: `w-full bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-md border border-white/10 p-4 flex flex-col gap-2 shadow-2xl`
- **Row 1** — `flex items-center gap-2`:
  - Upload/attach button (image icon): `w-10 h-10 shrink-0 rounded-full border transition-all flex items-center justify-center relative overflow-hidden mt-1.5 bg-white/5 hover:bg-white/10 border-white/10 hover:border-primary/40` (hidden file `<input>` sibling — native file picker, out of scope to wire up for real uploads; render as a no-op button)
  - Textarea: `w-full bg-transparent border-none text-white text-sm placeholder:text-white/20 focus:outline-none resize-none pt-1 leading-relaxed min-h-[40px] max-h-[150px] md:max-h-[250px] overflow-y-auto custom-scrollbar`, placeholder text: "Describe the image you want to create"
- **Row 2** — `flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-white/[0.03] relative` (divider line above this row)
  - Left group `flex items-center gap-2 relative flex-wrap pb-1 md:pb-0`:
    - Model selector button: `flex items-center gap-2 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] rounded-md transition-all border border-white/[0.03] group whitespace-nowrap` — contains a small badge `w-4 h-4 bg-[#22d3ee] rounded flex items-center justify-center` with `<span class="text-[9px] font-bold text-black uppercase">G</span>`, then label `text-xs font-semibold text-white/70 group-hover:text-[#22d3ee] transition-colors` = "Nano Banana", then a chevron-down svg.
    - Aspect ratio button: same base classes, icon (rect/square) + `text-[11px] font-semibold text-white/70 group-hover:text-[#22d3ee] transition-colors` = "1:1"
    - Count group: `flex items-center gap-1 bg-white/[0.03] rounded-md p-1 border border-white/[0.03]` containing 4 buttons `w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-black transition-all` — selected (`1`): `bg-[#22d3ee] text-black shadow-lg shadow-[#22d3ee]/20`; unselected (2,3,4): `text-white/40 hover:text-white/80 hover:bg-white/5`
  - Right: Generate button: `bg-[#22d3ee] text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-[#e5ff33] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-[#22d3ee]/10 disabled:opacity-50 disabled:cursor-not-allowed` — same cyan→lime hover swap as the header CTA, plus a scale bounce on hover/active.
- **Interaction model:** click-driven for all controls (dropdowns for model/aspect-ratio, toggle for count, submit for Generate). No real backend wiring needed — implement as local component state (selected model/ratio/count) with a no-op or console-log `onGenerate`. Clicking Generate/model/ratio without an API key on the live site opens an "API Key Required" auth modal — **out of scope** (authentication is explicitly excluded by the template defaults); safe to omit entirely or make Generate a visual no-op.

## Footer

- `footer.w-full.border-t.border-divider.dark:border-zinc-800.bg-bg-page.dark:bg-zinc-950`
- Column groups (desktop, multi-column grid): Brand block (logo + one-line description + "● All Systems Operational" status pill) | PRODUCT | RESOURCES, then a second row: MODELS (2 sub-columns) | TOOLS | MODEL PAGES, then COMPANY, then a full-width divider `<hr>` and a centered copyright bar: "© 2026 Vadoo Internet Services Private Limited. All Rights Reserved." with Terms / Privacy / Refund Policy links.
- All footer links are plain text, muted color, presumably `hover:text-white` (standard pattern matching rest of site — not individually re-verified per link, apply consistently).
- **Interaction model:** static, link hover only.
