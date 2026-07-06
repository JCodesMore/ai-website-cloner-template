# SiteHeader Specification

## Overview
- **Target file:** `src/components/SiteHeader.tsx`
- **Interaction model:** click-driven (nav tab switch — implemented as local `useState` active tab, no real routing needed since destination pages are out of scope)

## DOM Structure
```
header (sticky top-0)
  div (h-14 flex justify-between)
    div (left cluster, flex-1, overflow-x-auto)
      div (logo tile, w-9 h-9 bg-white rounded-xl)
      nav (14 buttons)
    div (right cluster)
      button "中文"
      button (pricing icon, disabled look)
      button "Enter API Key" (cyan cta)
```

## Computed Styles

### header
- position: sticky, top: 0, zIndex: 50
- backgroundColor: rgba(0,0,0,0.95) — `bg-black/95`
- backdropFilter: blur(12px) — `backdrop-blur-md`
- borderBottom: 1px solid rgba(255,255,255,0.05) — `border-b border-white/5`
- height: 56px content (57px incl. border)

### Left cluster
- `flex items-center gap-5 min-w-0 flex-1 overflow-x-auto`
- Logo tile: `w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0` — contains `public/images/muapi-logo.svg`, ~24px inside the tile.
- Nav: `flex items-center gap-5 text-[13px] font-semibold text-secondary`
  - Each item: `relative bg-transparent border-none p-0 flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer`
  - Active: `text-white`. Inactive: `text-secondary hover:text-white`
  - Items in order: Image, Video, Audio Studio, AI Clipping, Vibe Motion, Lip Sync, Body Swap, Cinema Studio, Marketing Studio, Workflows, Agents, Design Agent, Apps (+ small dollar-sign icon after label, `lucide-react` `DollarSign`, sized ~12px, `text-emerald-400`), MCP & CLI.
  - Default active tab for this page: "Image".

### Right cluster
- `flex items-center gap-3 shrink-0 relative z-10 bg-black/95 pl-3`
- "中文" button: `text-[12px] font-bold text-secondary hover:text-white transition-colors border border-white/10 hover:border-white/30 rounded-lg px-2.5 py-1`
- Pricing button: `hidden md:flex flex-col items-center` wrapper > `flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-white transition-colors border-none bg-transparent cursor-default opacity-50` with a small icon (lucide `DollarSign` or similar small glyph — render inert, non-interactive: `pointer-events-none` optional but keep hover styles per source)
- "Enter API Key" button: `flex items-center gap-1.5 text-[13px] font-bold bg-[#22d3ee] text-black px-3 py-1.5 rounded-lg hover:bg-[#e5ff33] transition-colors whitespace-nowrap shadow-lg shadow-[#22d3ee]/20` with a leading `lucide-react` `KeyRound` icon (~14px).

## States & Behaviors
- Nav item click: set active tab locally, update `text-white`/`text-secondary` classes. No real navigation (out of scope).
- "Enter API Key" hover: full background color swap `#22d3ee` → `#e5ff33` (not just shade/opacity) — implement via Tailwind `hover:bg-[#e5ff33]`.
- "中文" hover: border brightens `border-white/10` → `border-white/30`, text `text-secondary` → `text-white`.

## Assets
- `public/images/muapi-logo.svg` (logo tile)
- Icons: `lucide-react` — `KeyRound`, `DollarSign`

## Responsive Behavior
- **Desktop (1440px):** all 14 nav items visible in one row.
- **Mobile (390px):** left cluster nav row does NOT wrap or collapse to a hamburger — stays one row with `overflow-x-auto`, later items get clipped/scrollable. Pricing button hidden (`hidden md:flex`).
- Breakpoint: `md:` (768px) hides/shows the pricing icon button.
