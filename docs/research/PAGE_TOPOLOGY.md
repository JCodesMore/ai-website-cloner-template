# Kilo.ai Page Topology

Extracted from DOM structure on 2026-04-07.

## Overall Layout

- Single-column scrolling page
- Dark background: `oklch(0.217 0.0038309 106.715)` (olive-black)
- Ornamental border/glow around viewport edges
- Font: JetBrains Mono throughout (monospace)
- Max content width: `max-w-6xl` (72rem) centered
- All buttons are SQUARE (border-radius: 0)

## Sections (top to bottom)

| # | id | offsetTop | height | Name |
|---|---|---|---|---|
| 1 | header | 0 (sticky) | 80px | **Navbar** — sticky, z-50 |
| 2 | #hero | 104px | 871px | **Hero** — "AI for every [word]" |
| 3 | #below-fold | 1015px | 120px | **Tagline marquee** |
| 4 | #products | 1175px | 1093px | **Products** — KiloClaw + Kilo Code |
| 5 | #trusted | 2308px | 220px | **Social proof** — company logos |
| 6 | #trust-bar | 2568px | 198px | **Stats** — #1 / 2.3M+ / 25T+ |
| 7 | (unnamed) | 2806px | 768px | **Personal AI Agent** — KiloClaw feature |
| 8 | (unnamed) | 3614px | 816px | **Agentic Engineering** — Kilo Code feature |
| 9 | #mantine-* | 4470px | 492px | **Platforms** — tabbed platform list |
| 10 | #blog | 5002px | 529px | **Blog** — recent posts |
| 11 | #faq | 5571px | 545px | **FAQ** — accordion |
| 12 | #final-cta | 6028px | 554px | **Final CTA** — two paths |
| 13 | footer | ~6582px | - | **Footer** |

## Navbar

- `position: sticky; top: 0; z-index: 50`
- Logo: SVG grid icon + "Kilo" text
- Nav links: Product (dropdown), Pricing, Support, Docs ↗, Blog ↗
- Right: GitHub star count (17.8k), Sign in (dark), Sign up (blue)
- No background at top; gains backdrop-blur on scroll

## Hero (#hero)

- INTERACTION MODEL: **time-driven cycling text** (not scroll, not click)
- `min-height: calc(100svh - 280px)`, centered flex column
- h1: "AI for every [animated word]" — last word cycles: "team", "workflow", "project", "one"...
- h1 color: `oklch(0.95 0.15 108)` (yellow) on the animated word, white for "AI for every"
- Subtitle: "Coding agent for developers / Always on AI for everyone"
- CTA row: [Get your Assistant (yellow)] [Start Coding (blue)]
- Below CTAs: small labels ("Powered by 🦞 OpenClaw" | "VS Code, CLI, JetBrains, & more")

## Below-fold (#below-fold)

- Large bold text: "From pull request to grocery list — we've got you covered."
- Marquee/ticker strip of tech logos below

## Products (#products)

- Two product cards in 2-column grid (md:grid-cols-2)
- KiloClaw: hosted assistant (yellow accent)
- Kilo Code: open source coding agent (blue accent)
- Each card has: headline, subtitle, description, feature list, 2 CTAs

## Trusted (#trusted)

- "Trusted by developers at the world's most innovative companies"
- Scrolling logo marquee of company names/logos

## Trust Bar (#trust-bar)

- 3-column stats: "#1 Open Source Product of the Month", "2.3M+ Kilo Coders", "25T+ tokens processed"

## Personal AI Agent (unnamed)

- Feature section for KiloClaw
- "Your personal AI agent" / "Meet Kilo Claw"
- 3 feature bullet points with descriptions

## Agentic Engineering (unnamed)

- Feature section for Kilo Code
- "Built for agentic engineering" / "Multiple modes, one agent"
- Mode list

## Platforms (#mantine-...)

- "Use Kilo Everywhere"
- Tabbed interface: KiloClaw, VS Code, JetBrains, IntelliJ, PyCharm, WebStorm, CLI, Cloud Agents...
- INTERACTION MODEL: click-driven tabs

## Blog (#blog)

- "Recent posts"
- 3 blog post cards with title, description

## FAQ (#faq)

- "Frequently asked questions"
- Accordion items

## Final CTA (#final-cta)

- Two-column CTA:
  - 🦞 KiloClaw: "Personal 24/7 Assistant" → "Get your Assistant"
  - ⚡ Kilo Code: "Open Source Coding Agent" → "Start Coding"
