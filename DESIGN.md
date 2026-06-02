# Design System — 银脉圈 (yinmaiquan.com)

v2.0 — Slate + Emerald 现代金融

## Design Philosophy
- **For 个人用户**: 亲切可信 — emerald green 传递安全感，充足留白减少焦虑
- **For 企业用户**: 专业高效 — slate gray 传递冷静专业，清晰的信息层级
- **VS bbxin**: 180° 差异化 — 从橙色密集信息转为深色现代极简

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | #1E293B (slate-800) | Nav, footer, primary headings |
| `--primary-hover` | #334155 (slate-700) | Hover states on dark surfaces |
| `--surface` | #FFFFFF | Cards, modals, content panels |
| `--background` | #F8FAFC (slate-50) | Page background |
| `--border` | #E2E8F0 (slate-200) | Card borders, dividers, inputs |
| `--text-primary` | #0F172A (slate-900) | Body text, headings on light |
| `--text-secondary` | #64748B (slate-500) | Meta, labels, captions |
| `--text-on-dark` | #F1F5F9 (slate-100) | Text on dark nav/banner |
| `--accent` | #059669 (emerald-600) | CTA buttons, links, active states |
| `--accent-hover` | #047857 (emerald-700) | Button hover, link hover |
| `--accent-light` | #ECFDF5 (emerald-50) | Badge backgrounds, highlighted rows |
| `--danger` | #DC2626 (red-600) | Errors, destructive actions |
| `--warning` | #F59E0B (amber-500) | Warnings |
| `--success` | #10B981 (emerald-500) | Success messages |

## Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Page Title | Inter | 24px/1.5rem | 700 |
| Section Title | Inter | 18px/1.125rem | 600 |
| Card Title | Inter | 16px/1rem | 600 |
| Body | Inter | 16px/1rem | 400 |
| Meta/Caption | Inter | 14px/0.875rem | 400 |
| Small/Micro | Inter | 12px/0.75rem | 400 |
| Data/Numbers | Inter | 16px/1rem | 500 tabular-nums |

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Icon gaps |
| `--space-sm` | 8px | Related elements |
| `--space-md` | 16px | Card padding, section gaps |
| `--space-lg` | 24px | Section spacing |
| `--space-xl` | 32px | Major section breaks |
| `--space-2xl` | 48px | Page top/bottom padding |

## Border Radius

| Element | Value |
|---------|-------|
| Cards | 12px (rounded-xl) |
| Buttons | 8px (rounded-lg) |
| Inputs | 8px (rounded-lg) |
| Avatars/Logos | 12px (rounded-xl) |
| Badges | 9999px (rounded-full) |

## Shadows

| Context | Value |
|---------|-------|
| Card default | shadow-sm |
| Card hover | shadow-md |
| Modal | shadow-xl |
| Nav | none (flat dark surface) |

## Component Styles

### Navigation (Nav)
- Background: slate-800 (#1E293B)
- Text: slate-100 (#F1F5F9)
- Active: emerald-400 (#34D399) underline or bg
- Height: 64px (h-16)

### Banner
- Background: slate-800 → slate-700 gradient (merged with Nav)
- Text: white/slate-100
- CTA: emerald-600 button on dark background
- Height: 120-160px

### ProductCard
- Background: white
- Border: slate-200, 1px
- Hover: shadow-md, border emerald-200
- Title: slate-900, 600 weight
- Meta: slate-500, 400 weight
- Accent badge: emerald-50 bg, emerald-700 text

### Buttons
- Primary CTA: emerald-600 bg, white text, hover emerald-700
- Secondary: white bg, slate-200 border, slate-600 text, hover border-emerald-300
- Danger: red-600 bg, white text
- Disabled: opacity-60

### FilterBar (Pill-style)
- Container: white, border-slate-200
- Active pill: emerald-50 bg, emerald-700 text
- Inactive pill: slate-50 bg, slate-500 text
- Hover: slate-100 bg

### Pagination
- Active page: emerald-600 bg, white text
- Inactive: slate-100 bg, slate-600 text
- Hover: slate-200 bg

### Sidebar
- Cards: white, shadow-sm
- Links: slate-600, hover emerald-600
- Active link: emerald-600, emerald-50 bg

## Page Layout

### Homepage (products/fast)
```
┌─────────────────────────────────────┐
│ Nav (slate-800, h-16)               │
├─────────────────────────────────────┤
│ Banner (slate-800→700, h-40)       │
│  Title + Search + CTA               │
├─────────────────────────────────────┤
│ Content (slate-50 bg)               │
│ ┌─────────┬───────────────────────┐ │
│ │Sidebar  │ Product Grid          │ │
│ │(300px)  │ (2-3 cols)            │ │
│ │         │                       │ │
│ └─────────┴───────────────────────┘ │
└─────────────────────────────────────┘
│ Footer (slate-900)                  │
└─────────────────────────────────────┘
```

### Product Detail
```
┌─────────────────────────────────────┐
│ Nav (slate-800)                     │
│ Breadcrumb (white bg)               │
│ ┌─────────┬───────────────────────┐ │
│ │Product  │ Sidebar               │ │
│ │Card     │                       │ │
│ │+Table   │                       │ │
│ │+Intro   │                       │ │
│ │+Comments│                       │ │
│ └─────────┴───────────────────────┘ │
│ Footer (slate-900)                  │
└─────────────────────────────────────┘
```

### Institution List
```
Same as homepage but product grid → institution list cards
```

### Institution Detail
```
Same as product detail but show institution info + products
```

## Migration from v1 (Navy/Amber)

| v1 | v2 |
|----|----|
| navy-900 | slate-800 |
| amber/yellow-600 | emerald-600 |
| blue-600 links | emerald-600 links |
| amber-50 bg | emerald-50 bg |
| amber-300 border | emerald-200 border |
| amber-400 text | emerald-400 text |
| bg-white nav | bg-slate-800 nav |
| banner with gradient | banner merged with nav |
