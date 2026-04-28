# SiteFooter Specification

## Overview
- **Target file:** `src/components/SiteFooter.tsx`
- **Interaction model:** static (with link hovers)
- **Screenshots:** docs/design-references/ss_2945oftqv (top), ss_40919fliy (mid), ss_7060oe4jg (bottom)

## Container
- `<footer class="bg-dark text-white py-16 md:py-20 lg:py-30 base-px">`
- DARK bg (`#1b1b1b`), white text (`#fafafa`)

## Sections (top to bottom inside footer)

### 1) ニュースリリース (News releases)
- Heading: `<h3 class="text-base font-normal mb-8">ニュースリリース</h3>`
- 3 list items, each:
  ```
  ┌──────────────────────────────────────────────────────────┐
  │ 2026.4.27  [プレスリリース]  {title text...}        →     │
  └──────────────────────────────────────────────────────────┘
  ```
- Item layout: grid `grid-cols-[80px_120px_1fr_24px] gap-4 items-baseline py-4 border-t border-white/10`
  - Date: `text-sm text-white/60`
  - Badge: `<span class="inline-flex items-center px-3 py-0.5 border border-white/40 rounded-full text-xs">プレスリリース</span>`
  - Title: `text-sm leading-[1.6]`
  - Arrow: `→` symbol or `ArrowRightIcon`, right-aligned

### News items (verbatim)
```ts
const NEWS = [
  {
    date: "2026.4.27",
    badge: "プレスリリース",
    title: "モノクローム、HEMS「Energy-1」がみらいエコ住宅2026事業（GX志向型住宅）に対応。工事不要で補助金要件を一体で満たせる提案を強化-AIF認証を取得。発電から制御まで一体提案を強化",
    href: "/press/1",
  },
  {
    date: "2026.4.22",
    badge: "プレスリリース",
    title: "モノクローム、シリーズB資金調達を実施-建材一体型太陽光パネル開発スタートアップ。プロダクトから体験へ。一棟からまちへ。",
    href: "/press/2",
  },
  {
    date: "2026.4.14",
    badge: "採用情報",
    title: "採用情報",
    href: "/recruit",
  },
];
```

### 2) 掲載情報 (Featured info / press mentions)
- Same structure as ニュースリリース, but each item has an additional source line below the title (e.g., "Forbes JAPAN")
- Arrow uses `ArrowUpRightIcon` (external link)
- 3 items:
```ts
const FEATURED = [
  {
    date: "2025.8.25",
    badge: "掲載情報",
    title: "Forbes JAPANクロストレプレナーアワード、フューチャーライフライン賞に、モノクロームの屋根一体型太陽光パネルRoof-1が搭載の「インフラゼロハウス」が受賞しました",
    source: "Forbes JAPAN",
    href: "https://forbesjapan.com/...",
    external: true,
  },
  {
    date: "2025.3.26",
    badge: "掲載情報",
    title: "脱炭素に取り組む「株式会社モノクローム」の若手活躍を導く組織づくりに迫る！",
    source: "ミライのお仕事",
    external: true,
  },
  {
    date: "2024.6.14",
    badge: "掲載情報",
    title: "泊まれる展望台。那須の絶景オフグリッドグランピングサイト-Miwatas Nasu-",
    source: "モノクロームの読み物 / noteブログ",
    external: true,
  },
];
```

### 3) Footer columns (4 columns of links)
After the lists, separator: `border-t border-white/10 my-12` then a 5-column grid:

| Logo (col 1) | Products (col 2) | Resources (col 3) | Company (col 4) | Contact (col 5) |
|---|---|---|---|---|
| `<MonochromeMark>` (white) | Roof-1 / Wall-1 / Panel-B / Energy-1 / モノクローム電力 | ジャーナル / ニュース / よくあるご質問 / 施工事例 | 会社情報 / 採用情報 | お問い合わせ / ニュースレター登録 / 製品資料一覧 / 見学会 + 2 outlined buttons (工務店の方はこちら / 施工パートナー募集) |

- Use `<Link>` for each footer link
- Link class: `text-sm text-white/80 hover:text-white py-1`
- Outlined buttons: `.button-base .button-outline-on-dark`

### 4) Bottom bar
- Separator `border-t border-white/10 mt-12 pt-8`
- Flex row with 3 columns:
  - Left: social links `X / Instagram / note` (each is text link, gap-6, text-sm white/60)
  - Center: legal `Privacy Policy / 特定商取引法に基づく表記` (text-sm white/60)
  - Right: `Copyright © Monochrome 2026` (text-sm white/40)

## Computed styles
- Bg: `#1b1b1b`
- Text: `#fafafa`
- Muted text: `rgba(255,255,255,0.6)` and `rgba(255,255,255,0.4)`
- Borders: `rgba(255,255,255,0.1)` between rows
- Row padding: `py-4` (16px each)
- Heading sizes: 16px (`ニュースリリース` / `掲載情報` headings)

## Responsive
- Desktop: full 5-col grid as shown
- Tablet: 2-col link grid + logo on top
- Mobile: stacked, all links in vertical lists
