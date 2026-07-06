# ImageStudioHero Specification

## Overview
- **Target file:** `src/components/ImageStudioHero.tsx`
- **Interaction model:** hover-driven (icon glow/scale) + time-driven (sparkle pulse, mount fade-in-up) + click-driven (prompt card controls, local state only)

## DOM Structure
```
div.relative (h-full)                         — main studio area, bg-app-bg equivalent (#050505)
  div (flex flex-col items-center justify-center, min-h-[50vh], animate-fade-in-up)
    div (icon block, mb-12 relative group)
      div (blurred glow layer, absolute inset-0)
      div (icon frame, w-24/32 h-24/32 rounded-[2rem])
        div (inner tile, w-16 h-16 rounded-2xl) > svg (lucide Image icon)
        div (sparkle "✨", absolute top-4 right-4, animate-pulse)
    h1 (two spans: "START CREATING WITH" / "IMAGE STUDIO")
    p (subtitle)
  div.absolute.bottom-4 (prompt card wrapper, animate-fade-in-up)
    div (card, bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-md border border-white/10 p-4)
      div (row 1: upload button + textarea)
      div (row 2: model selector, aspect ratio, count 1-4 | Generate button)
```

## Computed Styles

### Outer container
- `w-full h-full flex flex-col items-center justify-center bg-app-bg relative p-4 md:p-6 overflow-hidden`
  (`bg-app-bg` → map to page bg `#050505`, or use `bg-background` if globals.css sets `--background` to that value)

### Hero content wrapper
- `flex flex-col items-center justify-center h-full animate-fade-in-up transition-all duration-700 min-h-[50vh]`

### Icon block
- Wrapper: `mb-12 relative group`
- Glow: `absolute inset-0 bg-primary/10 blur-[120px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-1000`
- Frame: `relative w-24 h-24 md:w-32 md:h-32 bg-white/[0.02] rounded-[2rem] flex items-center justify-center border border-white/[0.05] overflow-hidden backdrop-blur-sm`
- Inner tile: `w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 relative z-10 transition-transform duration-500 group-hover:scale-110` — icon: `lucide-react` `Image` component, ~28px, stroke `#22d3ee`
- Sparkle: `absolute top-4 right-4 text-[10px] text-primary/40 animate-pulse` → literal `✨`

### Heading
- `text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 text-center px-4`
  - `<span className="text-white/40 font-medium">START CREATING WITH</span>`
  - `<br />`
  - `<span className="text-white">IMAGE STUDIO</span>`
- Desktop computed: fontSize 60px, lineHeight 60px, letterSpacing -1.5px; line 1 weight 500 @ 40% white, line 2 weight 800 @ full white.

### Subtitle
- `<p className="text-white/40 text-sm md:text-base font-medium tracking-wide text-center max-w-lg leading-relaxed">Describe a scene, character, mood, or style — and watch it come to life</p>`

### Prompt card wrapper
- `absolute bottom-4 w-full max-w-[95%] lg:max-w-4xl z-40 animate-fade-in-up`
- Card: `w-full bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-md border border-white/10 p-4 flex flex-col gap-2 shadow-2xl`

### Row 1 (upload + textarea)
- Container: `flex items-center gap-2`
- Upload button: `w-10 h-10 shrink-0 rounded-full border transition-all flex items-center justify-center relative overflow-hidden mt-1.5 bg-white/5 hover:bg-white/10 border-white/10 hover:border-primary/40` — icon: `lucide-react` `ImagePlus` or `Paperclip`, ~16px. No-op click (file upload out of scope).
- Textarea container: `flex-1 flex flex-col gap-2`
- Textarea: `w-full bg-transparent border-none text-white text-sm placeholder:text-white/20 focus:outline-none resize-none pt-1 leading-relaxed min-h-[40px] max-h-[150px] md:max-h-[250px] overflow-y-auto custom-scrollbar`, placeholder `"Describe the image you want to create"`

### Row 2 (controls)
- Container: `flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-white/[0.03] relative`
- Left group: `flex items-center gap-2 relative flex-wrap pb-1 md:pb-0`
  - Model button: `flex items-center gap-2 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] rounded-md transition-all border border-white/[0.03] group whitespace-nowrap`
    - Badge: `w-4 h-4 bg-[#22d3ee] rounded flex items-center justify-center` > `<span className="text-[9px] font-bold text-black uppercase">G</span>`
    - Label: `text-xs font-semibold text-white/70 group-hover:text-[#22d3ee] transition-colors` → "Nano Banana"
    - Chevron: `lucide-react` `ChevronDown`, ~12px
  - Aspect ratio button: same base classes, icon `lucide-react` `Square` (~12px) + `text-[11px] font-semibold text-white/70 group-hover:text-[#22d3ee] transition-colors` → "1:1"
  - Count group: `flex items-center gap-1 bg-white/[0.03] rounded-md p-1 border border-white/[0.03]`
    - 4 buttons `w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-black transition-all`
    - Selected (default = "1"): `bg-[#22d3ee] text-black shadow-lg shadow-[#22d3ee]/20`
    - Unselected: `text-white/40 hover:text-white/80 hover:bg-white/5`
- Right: Generate button: `bg-[#22d3ee] text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-[#e5ff33] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-[#22d3ee]/10 disabled:opacity-50 disabled:cursor-not-allowed` → "Generate" (no-op onClick — auth-gated on the live site, out of scope)

## States & Behaviors
- **Icon block hover:** glow `opacity-30→60`, `transition-opacity duration-1000`; inner tile `scale-100→110`, `transition-transform duration-500`. Both triggered by `group`/`group-hover` on the wrapper div.
- **Sparkle:** `animate-pulse`, infinite, no trigger.
- **Mount animation:** both the heading block and the prompt card use `animate-fade-in-up` (translate-y + opacity 0→1) — define as a custom keyframe in `globals.css` since it's not a stock Tailwind utility: fade from `opacity:0, translateY(12px)` to `opacity:1, translateY(0)`, duration ~600-700ms, ease-out, plays once on mount.
- **Model/aspect-ratio buttons:** click opens a dropdown in the source (auth-gated further action) — out of scope to wire real dropdown menus; local `useState` toggling a simple absolute-positioned menu is a nice-to-have but not required. At minimum implement the hover/focus visual states exactly.
- **Count buttons:** click sets local selected count (1/2/3/4), restyles selected button to cyan.
- **Generate button:** hover swaps bg cyan→lime `#e5ff33`, scales to 1.02; active scales to 0.98. onClick is a no-op (auth/backend out of scope).

## Assets
- Icons: `lucide-react` — `Image`, `ImagePlus` (or `Paperclip`), `ChevronDown`, `Square`

## Text Content (verbatim)
- "START CREATING WITH" / "IMAGE STUDIO"
- "Describe a scene, character, mood, or style — and watch it come to life"
- "Describe the image you want to create" (placeholder)
- "Nano Banana", "1:1", "1 2 3 4", "Generate"

## Responsive Behavior
- **Desktop (1440px):** icon frame 128px (`md:w-32 md:h-32`), heading 60px, prompt card `max-w-4xl`.
- **Mobile (390px):** icon frame 96px (`w-24 h-24`), heading drops to 30px (`text-3xl`), row 2 controls wrap (`flex-wrap` on left group, `flex-col` on row 2 container until `sm:`), Generate button goes full width (`w-full sm:w-auto`).
- Breakpoints: `sm:` (640px) row2 flex-direction switch; `md:` (768px) icon size + max-height of textarea.
