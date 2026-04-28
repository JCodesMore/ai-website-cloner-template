# monochrome.so — Behaviors Bible

## Page-Level

### Reveal-on-scroll-up Header
- **Element:** `<header class="fixed z-[9999] top-0 left-0 right-0 will-change-transform text-black">`
- **Hidden state:** `transform: matrix(1, 0, 0, 1, 0, -80)` = `translateY(-80px)`
- **Visible state:** `transform: matrix(1, 0, 0, 1, 0, 0)` = `translateY(0)`
- **Mid-animation observed:** `translateY(-55.55px)` — confirms smooth interpolation
- **Trigger:**
  - At top of page (scrollY=0): hidden
  - Scrolling DOWN: hidden
  - Scrolling UP past a small threshold: revealed
  - At bottom of page: hidden again (so footer is unobstructed) — confirm
- **Transition:** `transition: all` — let CSS handle interpolation
- **Implementation hint:** Use a custom hook tracking scrollY delta; toggle a CSS class that flips translateY.

### Native Scroll
- No Lenis or smooth-scroll library detected
- Use browser native scroll for the clone

## Section-Level

### Section 0 — Hero KV Carousel
- **Element pattern:** 17 absolutely-positioned divs, each holding 1 KV image (`kv_01.jpg` through `kv_17.jpg`)
- **Container child class:** `transition-opacity duration-1000 ease-out-expo will-change-[opacity] z-0 opacity-0` (inactive) / `opacity-100` (active)
- **Active KV cycles automatically** — likely on a timer (4-6s). Confirm by watching.
- **Thumbnail strip:** absolutely positioned vertical column on the right edge, 17 thumbs (147x82-110px each), each showing a scaled-down version of its KV. Active thumb is at full opacity, inactives at lower opacity.
- **Click thumbnail:** jumps to that KV
- **Hero title:** `<h1>` overlaying bottom-left with `text-white` (so when over light KV image, may have a subtle gradient backdrop). Class: `absolute z-50 text-white text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-[1.25] left-0 bottom-0 base-px pb-5 md:pb-8 xl:pb-10 2xl:pb-...`
- **Text:** "未来に残したい景色をつくる。" (Creating scenery worth preserving for the future)

### Section 1 — Products
- 3 product cards in a row at desktop
- Each card has:
  - Title (Roof-1 / Wall-1 / Panel-B) + subtitle on right (エネルギーをつくる屋根 etc.)
  - Large product hero image
  - Color/variant dots row (e.g., `● Black ⚪ Silver ● Roof-1e`)
  - Two pill buttons: 詳しく見る (outline) / 相談する (filled black)
- Mobile: stacked single column
- Hover on image: subtle scale or no change — confirm

### Section 2 — Smart Energy
- 2 product cards in a row at desktop
- Same card structure as Section 1 but only 2 columns
- Energy-1 has a 3D black product cube image; モノクローム電力 has a beige/empty image area

### Section 3 — Journal Carousel
- Dark background `bg-dark`
- Header: small circular spiral mark + "ジャーナル" label, "一覧を見る" button on right
- Featured image area (~875x534) with title overlay (e.g., "Roof-1" with a B icon)
- Right side: small thumbnail strip (4 thumbs ~80x80)
- Below image: pagination indicator "03 / 04" with current bold + total muted
- **Auto-advancing or click-driven** — confirm

### Section 4 — Construction Cases
- "モノクローム施工事例" + "一覧を見る"
- Top row (3 cols): SUEP. / Suppose Design Office / 中川エリカ建築設計事務所 — each has architect name as a label above a thin border-top + an image card
- Below: text-only list of additional architects, each with `border-top` separator
  - 山本健悟建築設計室
  - 能作文徳建築設計事務所＋Studio mnm
  - DRAWERS
  - lyhty
  - NOT A HOTEL株式会社
  - ミサワホーム株式会社
  - ツバメアーキテクツ
  - スキーマ建築計画
- **Hover behavior:** `IMG.absolute top-0 left-0 object-cover w-full h-full scale-105 opacity-0 lg:transition group-hover:lg:opacity-100 group-hover:lg:scale-100 ease-out-cubic` — image fades in and scales down to 100% on hover (image is hidden by default with opacity 0, scale 105, becomes visible on hover)

### Section 5 — Tour
- `bg-beige` warm background
- Section heading "見学会" at top-left
- 2-col layout: left = static image of an event (~`/top/event.jpg`); right = headline + body + 2 buttons
- Buttons: ニュースレター (filled black) / お問い合わせ (filled black)

### Section 6 — Newsletter
- Gray background
- Centered content: 2-line heading + 2-line description + email input + black submit button (登録)
- Input: subtle border, rounded, white bg
- Button: full-width below input, black bg, white text, rounded, "登録"

### Section 7 — Contact / Resources
- `bg-gray` gray
- 2-col split with vertical divider
- Each column: big heading + 2-line description + outlined-pill button (相談する / 資料ダウンロード)

### Section 8 — Footer
- `bg-dark`
- News releases section: 3 rows, each `2026.4.27 [プレスリリース] {title}` + arrow on right
- 掲載情報 section: 3 rows, similar structure but with publication name as subtitle
- Footer links (4 columns of 4-5 links each)
- Bottom bar: social (X / Instagram / note) + legal (Privacy Policy, 特定商取引法に基づく表記, Copyright © Monochrome 2026)

## Hover States Catalog

| Element | Default | Hover |
|---|---|---|
| Pill button (outline) | `bg-transparent border-black text-black` | `bg-black text-white` |
| Pill button (filled black) | `bg-black text-white` | `bg-black/80` or subtle |
| Architect card image | `scale-105 opacity-0` | `scale-100 opacity-100`, `ease-out-cubic` |
| KV thumbnail | `opacity-50` | `opacity-100` |
| Nav link | underline indicator | `text-black-100` underline grows |

## Responsive Breakpoints
- Mobile: `< 768px` (md)
- Tablet: `< 1024px` (lg)
- Desktop: `>= 1024px`
- Sections collapse columns: 3-col → 1-col, 2-col → 1-col on mobile
- Hero KV thumbnail strip is hidden on mobile (likely)
- In-page header collapses CTAs into hamburger on mobile
