# SiteFooter Specification

## Overview
- **Target file:** `src/components/SiteFooter.tsx`
- **Interaction model:** static, link hover only

## DOM Structure
```
footer (border-t, bg matches page bg)
  div (top row, grid: Brand | Product | Resources)
  div (second row, grid: Models (2 sub-cols) | Tools | Model Pages)
  div (Company column)
  hr
  div (copyright bar: text + Terms/Privacy/Refund links)
```

## Computed Styles
- footer: `w-full border-t border-white/10 bg-[#050505]` (source used `border-divider dark:border-zinc-800 bg-bg-page dark:bg-zinc-950` — map to the page's actual dark near-black bg and a subtle `white/10` border for consistency with the rest of the page)
- Column heading (PRODUCT / RESOURCES / MODELS / TOOLS / MODEL PAGES / COMPANY): uppercase, small, bold, muted — `text-xs font-bold text-white/40 tracking-wide uppercase mb-4`
- Links: `text-sm text-white/60 hover:text-white transition-colors block` (consistent with rest of site's `hover:text-white` pattern), stacked vertically with `~12px` gap
- Brand block: logo (`public/images/muapi-logo.svg`, ~28px tall) + wordmark "muapi", one-line description in muted text, status pill: green dot + `"All Systems Operational"` in `text-xs text-white/60` with a small `bg-green-500 rounded-full` dot (~6px)
- Copyright bar: full-width `border-t border-white/10 pt-6 mt-10`, centered text `text-xs text-white/40`, links inline with `·` or gap spacing

## Text Content (verbatim)

**Brand:** "One API for all state-of-the-art AI models. Build, scale, and deploy generative AI workflows at the lowest cost." / "All Systems Operational"

**PRODUCT:** Home, Dashboard, Explore Models, Pricing, Workflows, Agents, Studio, History, Integrations, Providers, Status

**RESOURCES:** Documentation, Providers Hub, Comparison Hub, Alternatives Hub, Blog, Discord, CLI, Gallery, Support, Sitemap

**MODELS (col 1):** Veo 3, Flux Kontext, Midjourney V7, HiDream, Suno, Hunyuan, Seedream, Flux Dev, Vidu, LatentSync, Qwen, SeedEdit
**MODELS (col 2):** Wan 2.2, Seedance, Kling, Minimax Hailuo, Runway, Reve Image, GPT-4o Image, Pixverse, Wan 2.1, MMAudio, Flux Schnell, All Models →

**TOOLS:** AI Image Generator, AI Video Generator, Image to Video, Image Upscale, Background Remover, Face Swap, Product Shot, Lip Sync, AI Image Editor, AI Video Editor, Motion Controls, AI Audio & Music, Anime Generator

**MODEL PAGES:** Veo 3 API, Veo 4 API, Kling 3 API, Flux Kontext API, Gemini Omni API, Seedance 2 API, Seedance 2.5 API, HappyHorse 1 API, HappyHorse 1.1 API, White Label AI Studio, MCP & CLI

**COMPANY:** Terms of Use, Privacy Policy, Refund Policy, Contact

**Copyright bar:** "© 2026 Vadoo Internet Services Private Limited. All Rights Reserved." + Terms / Privacy / Refund Policy links

## States & Behaviors
- All links: `hover:text-white transition-colors`. No other interactivity.

## Assets
- `public/images/muapi-logo.svg`

## Responsive Behavior
- **Desktop (1440px):** 3-column grid per row (Brand/Product/Resources, then Models/Tools/ModelPages), Company below spanning its own row.
- **Mobile (390px):** stack to single column, each group full width, generous vertical spacing between groups.
- Implement with Tailwind grid: `grid-cols-1 md:grid-cols-3` (or similar) per row group.
