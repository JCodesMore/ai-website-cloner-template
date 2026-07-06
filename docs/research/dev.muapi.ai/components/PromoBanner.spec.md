# PromoBanner Specification

## Overview
- **Target file:** `src/components/PromoBanner.tsx`
- **Interaction model:** click-driven (dismiss)

## DOM Structure
`div > (a, button)` — full-width bar above the header, not sticky.

## Computed Styles
### Container
- display: flex, alignItems: center, justifyContent: center
- gap: 12px
- padding: 8px 16px
- backgroundColor: `bg-indigo-600` (oklch(0.511 0.262 276.966) ≈ `#4f46e5`)
- position: relative, zIndex: 50
- width: 100%

### Text link
- `text-[13px] font-bold text-white text-center hover:opacity-80 transition-opacity`

### Close button
- `absolute right-3 text-white/60 hover:text-white transition-colors text-lg leading-none`
- glyph: `✕`

## States & Behaviors
- Click close button → banner unmounts (local `useState<boolean>` show/hide, default visible).
- Link hover: opacity 80%, transition-opacity.

## Text Content (verbatim)
"Unrestricted AI Images & Videos → Auto-Publish as YouTube Shorts & TikToks, Earn ↗"

## Responsive Behavior
- Same at all breakpoints — single line, centered, no layout change.
