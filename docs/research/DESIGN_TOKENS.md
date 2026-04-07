# Kilo.ai Design Tokens

Extracted via `getComputedStyle()` from live site on 2026-04-07.

## Colors (oklch)

| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(0.217 0.0038309 106.715)` | Page background (very dark olive-black) |
| `--foreground` | `oklch(1 0 0 / 0.9)` | Primary text (white 90%) |
| `--muted-foreground` | `oklch(1 0 0 / 0.6)` | Muted text (white 60%) |
| `--brand-primary` | `oklch(0.95 0.15 108)` | Lime yellow — h1 accent, CTA button bg |
| `--primary` | `oklch(0.567 0.15 248)` | Blue — "Start Coding" CTA, Sign up btn |
| `--primary-foreground` | `oklch(1 0 0 / 0.9)` | Text on blue buttons |
| `--card` | `oklch(0.27 0.01 106)` | Card background (slightly lighter than bg) |
| `--card-border` | `oklch(0.95 0.15 108 / 0.3)` | Card border (brand-primary/30) |
| `--sign-in-bg` | `oklch(0.285 0 0)` | Sign in button background |
| `--border` | `oklch(1 0 0 / 0.1)` | Default border |

## Typography

| Property | Value |
|---|---|
| Font family | `"JetBrains Mono", "JetBrains Mono Fallback"` |
| h1 font-size | `72px` |
| h1 font-weight | `800` |
| h1 line-height | `80px` |
| h2 font-size | `48px` (md: `3rem`) |
| Nav/button font-weight | `700` |
| Nav font-size | `16px` |
| Body font-size | `16px` |
| CTA button font-size | `20px` |
| Muted caption font-size | `14px` |

## Spacing

| Usage | Value |
|---|---|
| CTA button padding | `0 36px`, height `56px` |
| Nav button padding | `8px 16px` |
| Section padding y | `py-16 md:py-24` |
| Max content width | `max-w-6xl` (72rem) |
| Card padding | `p-6 md:p-8` |
| Card border-radius | `rounded-xl` (`.625rem * 1.4`) |
| Global radius | `0.625rem` |

## Buttons

| Variant | bg | color | border-radius |
|---|---|---|---|
| CTA yellow ("Get your Assistant") | `oklch(0.95 0.15 108)` | `oklch(0.217 0.0038309 106.715)` | `0px` |
| CTA blue ("Start Coding") | `oklch(0.567 0.15 248)` | white 90% | `0px` |
| Sign in | `oklch(0.285 0 0)` | white 90% | `0px` |
| Sign up | `oklch(0.567 0.15 248)` | white 90% | `0px` |

Note: ALL buttons are square (border-radius: 0). This is a key design signature.

## Page Border

The page has an ornamental warm brownish/orange glow border around the viewport edges — a `radial-gradient` or `box-shadow` applied to body or a wrapper div, giving a subtle burnt-orange vignette.

## Animations

- Hero text has a typing/cycling animation for the last word ("team", "workflow", "project", "one", etc.)
- Elements fade in as page loads (opacity 0 → 1 with blur animation)
- Scroll-triggered entrance animations on most sections
