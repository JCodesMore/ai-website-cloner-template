# 银脉圈 - Design System Master (v2 — First Principles)

## First Principles Rationale

**Product essence:** Loan comparison platform. Users arrive with financial anxiety, need clarity, trust, and fast comparison.

**Design foundations:**
1. Trust > aesthetics — every visual decision must build credibility
2. Data legibility > decoration — users compare numbers (rates, amounts, terms)
3. Reduce anxiety — warm, professional, reassuring — not cold bank counter
4. Mobile-first — loan search happens on phones

**Why gold/amber, not blue:**
- Gold conveys money, value, premium, warmth — culturally aligned with Chinese finance
- Blue conveys technology, corporate — generic SaaS feel
- Navy primary stays — banks = tradition, stability
- This matches the Banking/Traditional Finance color archetype

## Overview

**Project:** 银脉圈 (yinmaiquan.com) — 贷款产品随心选
**Style:** Minimalism & Swiss Style + Trust & Authority
**Stack:** Next.js 16 + Tailwind CSS v4 + shadcn/ui

---

## Color System

### Primary Palette

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Primary (Navy) | `#0F172A` | `slate-900` | Brand color, headings, nav |
| Primary Foreground | `#F8FAFC` | `slate-50` | Text on primary |
| Secondary (Deep Navy) | `#1E3A8A` | `blue-900` | Trust elements, badges |
| **Accent (Gold)** | `#CA8A04` | `yellow-600` | CTAs, links, active states |
| **Accent Hover** | `#A16207` | `yellow-700` | Button hover |
| **Accent Light** | `#FEF3C7` | `amber-50` | Badge bg, highlights |
| Success | `#059669` | `emerald-600` | Approved, verified |
| Warning | `#D97706` | `amber-600` | Alerts, attention |
| Error | `#DC2626` | `red-600` | Errors, reject |

### Backgrounds

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Background | `#F8FAFC` | `slate-50` | Page background |
| Surface | `#FFFFFF` | `white` | Cards, containers |
| Muted | `#F1F5F9` | `slate-100` | Disabled, secondary bg |
| Dark | `#0F172A` | `slate-900` | Footer, dark sections |

### Borders

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Border | `#E2E8F0` | `slate-200` | Default borders |
| Border Focus | `#CA8A04` | `yellow-600` | Focus ring |
| Border Hover | `#CBD5E1` | `slate-300` | Hover borders |

---

## Typography

### Fonts

| Usage | Font | Weights |
|-------|------|---------|
| Headings | IBM Plex Sans | 600-700 |
| Body | IBM Plex Sans | 400-500 |
| Data/numbers | IBM Plex Mono | 400-600 |
| Labels | IBM Plex Sans | 500 |

### Scale

| Level | Size | Line Height | Usage |
|-------|------|-------------|-------|
| h1 | 36px (2.25rem) | 1.2 | Page titles |
| h2 | 28px (1.75rem) | 1.3 | Section titles |
| h3 | 22px (1.375rem) | 1.4 | Card titles |
| h4 | 18px (1.125rem) | 1.5 | Subheadings |
| body | 15px (0.9375rem) | 1.6 | Body text |
| caption | 13px (0.8125rem) | 1.5 | Helper text |
| small | 12px (0.75rem) | 1.5 | Labels, footnotes |

### Font Loading

```tsx
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});
```

---

## Spacing

8px base scale:

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| xs | 4px | `gap-1` / `p-1` | Tight spacing |
| sm | 8px | `gap-2` / `p-2` | Within-group |
| md | 16px | `gap-4` / `p-4` | Card padding |
| lg | 24px | `gap-6` / `p-6` | Section spacing |
| xl | 32px | `gap-8` / `p-8` | Large sections |
| 2xl | 48px | `gap-12` / `p-12` | Page sections |
| 3xl | 64px | `gap-16` / `p-16` | Hero sections |

---

## Border Radius

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| sm | 4px | `rounded` | Small elements |
| md | 8px | `rounded-lg` | Cards, buttons, inputs |
| lg | 12px | `rounded-xl` | Large cards, modals |
| full | 9999px | `rounded-full` | Avatars, pills |

---

## Shadows

| Level | Value | Usage |
|-------|-------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.04)` | Card default |
| md | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | Card hover |
| lg | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns |
| xl | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals |

---

## Z-Index

| Layer | Token | Tailwind | Component |
|-------|-------|----------|-----------|
| Base | 0 | default | Page content |
| Dropdown | 10 | `z-10` | Dropdown menus |
| Sticky | 20 | `z-20` | Fixed nav |
| Overlay | 30 | `z-30` | Backdrop |
| Modal | 50 | `z-50` | Dialogs, modals |

---

## Layout

| Property | Value | Tailwind |
|----------|-------|----------|
| Max content width | 1280px | `max-w-7xl` |
| Narrow content | 768px | `max-w-3xl` |
| Content padding | 16px | `px-4` |
| Nav height | 64px | `h-16` |
| Sidebar width | 300px | `w-[300px]` |

### Grid (Product Listing)

Mobile (default): 1 column
Tablet (sm: 640px+): 2 columns
Desktop (lg: 1024px+): 3 columns

```css
grid gap-4 sm:grid-cols-2 lg:grid-cols-3
```

---

## Animation

| Property | Value |
|----------|-------|
| Micro-interaction | 150-200ms |
| Transition | 200-300ms |
| Easing | `ease-out` (standard), `ease-in-out` (enter/exit) |
| Transform | `transform` + `opacity` only — no width/height animations |

### Tailwind Classes

```
transition-colors duration-200 ease-out    // Color changes
transition-opacity duration-200 ease-out   // Show/hide
transition-shadow duration-200 ease-out    // Shadow changes
transition-transform duration-200 ease-out // Slight movement
```

---

## Component Specs

### Navigation (Nav)
- Fixed top, 64px height, z-20
- Background: `bg-slate-900` (navy) + `text-white`
- Content: `max-w-7xl`, horizontal padding `px-4`
- Active link: gold underline or bg highlight
- Dropdown: 8px radius, level-md shadow

### Cards (Card)
- White background, 8px radius (`rounded-lg`), level-sm shadow
- Border: `border border-slate-200`
- Hover: level-md shadow + slight `-translate-y-0.5`
- Transition: `transition-shadow transition-transform duration-200`

### Product Card
- Card spec + internal structure:
  - Top: product logo + name (h3), institution name
  - Middle: 4 key metrics (amount, term, rate, repayment) in a 2x2 grid
  - Bottom: promo tag (if any) + gold CTA button
- CTA: `bg-yellow-600 hover:bg-yellow-700 text-white`
- Promo badge: `bg-amber-50 text-yellow-700`

### Buttons
- Primary CTA: `bg-yellow-600 text-white hover:bg-yellow-700`
- Secondary: `bg-white border-slate-200 text-slate-700 hover:bg-slate-50`
- Ghost: `text-slate-600 hover:bg-slate-100`
- Min touch target 44x44px
- Loading state: disabled + spinner

### Inputs
- White bg, 8px radius, `border-slate-200`
- Focus: `border-yellow-600` + `ring-2 ring-yellow-600/20`
- Height 44px (touch-friendly)
- Error: `border-red-600` + red error text

### Filter Bar
- Horizontal pill list, 8px gap
- Active: `bg-slate-900 text-white`
- Inactive: `bg-white border-slate-200 text-slate-600 hover:bg-slate-50`
- Pill shape (`rounded-full`)

### Pagination
- Active page: `bg-slate-900 text-white`
- Inactive: `text-slate-600 hover:bg-slate-100`
- Previous/Next: `text-slate-600` (disabled: `text-slate-300`)

---

## Icons

Use Lucide React (installed). Unified 24x24 viewBox, `w-5 h-5` or `w-6 h-6`.

---

## Anti-patterns

- ❌ No emojis as icons
- ❌ No scale transforms that shift layout
- ❌ No arbitrary large z-index values (use defined layers)
- ❌ No gradient color blocks (keep it flat)
- ❌ No harsh black borders or hard shadows (not Neubrutalism)
- ❌ No low-contrast text on light backgrounds (>= 4.5:1)
- ❌ No overriding Tailwind utilities with custom CSS
- ❌ No blue as primary accent — gold conveys money and warmth for lending
- ❌ No purely decorative elements — every pixel serves clarity or trust
- ❌ No AI purple/pink gradients

---

## Pre-Delivery Checklist

- [ ] No emojis as icons
- [ ] Clickable elements have `cursor-pointer`
- [ ] Hover states smooth (150-300ms)
- [ ] Light mode text contrast >= 4.5:1
- [ ] Keyboard navigation visible focus states
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375px / 768px / 1024px / 1440px
- [ ] No horizontal scroll on mobile
- [ ] Inputs have labels
- [ ] Icons use Lucide, consistent sizing

---

## References

- **Style:** Minimalism & Swiss Style (clean, grid, functional)
- **Trust model:** Trust & Authority (badges, metrics, certifications)
- **Font:** IBM Plex Sans / IBM Plex Mono (financial professional)
- **Color archetype:** Banking/Traditional Finance (navy + gold + light bg)
- **UI Kit:** shadcn/ui (Card, Table, Form, Dialog, Button)
