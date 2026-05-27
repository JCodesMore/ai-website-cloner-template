# bbixin.com Design Tokens

## Primary Colors
- `--bbx-primary`: #ff5f16 (brand orange)
- `--bbx-primary-strong`: #ff7a3d (stronger orange, used in gradients)
- `--bbx-primary-hover`: #e5550f

## Background Colors
- `--bbx-bg-page`: #f6f7fb (page background)
- Card backgrounds: #fff
- Nav background: #fff
- Footer background: #393939

## Text Colors
- `--bbx-text-main`: #111827 / #1f2937 (primary text)
- `--bbx-text-muted`: #6b7280 (secondary text)
- `--bbx-text-light`: #9ca3af (labels/placeholders)
- `--bbx-text-white`: #fff (on dark backgrounds)
- Link color: #06f (#0066ff)
- Footer text: #fff

## Border / Separator
- Card border: #f1f3f5 / #f0f2f5
- Brand border: #ffd2bd / #ffd8c8 / #ffe4d5
- Separator: #eee / #e5e7eb / #f3f4f6

## Status / Accent
- Error: #f56c6c
- Success: #047857
- Warning chip bg: #fff7f2, text: #b45309
- Info chip bg: #f3f7ff, text: #1d4ed8

## Shadows
- Card shadow: 0 10px 24px rgba(15, 23, 42, 0.04)
- Card hover shadow: 0 16px 32px rgba(255, 95, 22, 0.1)
- Fast card shadow: 0 12px 28px rgba(15, 23, 42, 0.06)
- Search shadow: 0 4px 20px rgba(0, 0, 0, 0.1)
- Nav shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1)
- Sidebar shadow: 0 4px 12px rgba(0, 0, 0, 0.04)

## Border Radius
- Default: 4px
- Small: 6px
- Medium: 10px
- Large: 12px / 14px (cards)
- XL: 16px (sidebar panels)
- Full/Pill: 999px

## Typography
- Font: System fonts (default sans-serif, Chinese-optimized)
- Font sizes: 11px (labels), 12px (badges), 13px (secondary), 14px (body), 16px-18px (headings), 20px-34px (section titles)
- Font weights: 400 (normal), 500 (medium), 600 (semi-bold), 700 (bold), 800 (extra-bold)

## Spacing
- `--bbx-space-1`: 4px
- `--bbx-space-2`: 8px
- `--bbx-space-3`: 12px
- `--bbx-space-4`: 16px
- Content width: 1100px (.ley-inner)
- Grid gap: 16px (layui-col-space16)
- Card padding: 12px

## Layout
- Nav: fixed top, 60px height, z-index 20
- Page padding-top: 60px (offset for fixed nav) + 15px
- Main content: 75% (9/12) + Sidebar: 25% (3/12)
- Product grid: 3 columns, gap 16px
- Footer top: padding 30px vertical
