# monochrome.so — Page Topology

**URL:** https://www.monochrome.so/
**Title:** Monochrome (Japanese solar panel company)
**Total page height (desktop, 1440px):** 7934px
**Hero height:** 835px (h-screen-s lg:base-pr)

## Global Layout
- **Body font family:** `YakuHanJP, neue-haas-unica, sans-serif`
- **Default text color:** `rgb(0,0,0)` (black on white)
- **No Lenis smooth scroll detected** (native scroll)
- **Page DOM:** Next.js (`/_next/...`), single root DIV `#__next > DIV.__variable_xxxx`
- **Asset roots:** `/_next/static/media/` (kv_*.jpg, product_*.jpg) + `/top/` (architects, event) + S3 CMS (journal images) + Cloudinary (hero video)

## Layered Header Pattern
The page renders TWO header surfaces:
1. **In-page top bar** — visible at `scroll=0`, sits at top of layout (logo + nav + CTA buttons + hamburger). Scrolls away normally.
2. **Fixed reveal-on-scroll-up header** — `<header class="fixed z-[9999] top-0 left-0 right-0 will-change-transform text-black">`
   - Default `transform: translateY(-80px)` (hidden)
   - Reveals to `transform: translateY(0)` when user scrolls UP
   - Both contain identical content (logo + nav + CTA pills + hamburger)
   - Easing/transition: `transition: all` with smooth ease

## Sections (top to bottom)

| # | Name | Top (px) | Height (px) | Bg | Notes |
|---|---|---|---|---|---|
| 0 | Hero | 0 | 835 | white | Cycling KV (17 images) + thumbnail strip on right + title overlay |
| 1 | Products: "エネルギーをつくる" | 995 | ~625 | white | 3-col: Roof-1, Wall-1, Panel-B |
| 2 | Smart Energy: "エネルギーをかしこく使う" | 1619 | ~835 | white | 2-col: Energy-1, モノクローム電力 (cube + power plan) |
| 3 | Journal | 2613 | ~1206 | dark (`bg-dark`) | Carousel "ジャーナル" — 4 articles, large image + thumbnail strip + 03/04 indicator |
| 4 | Construction Cases | 3820 | ~1120 | white | "モノクローム施工事例" — 3-col grid of architects with images, then text-only list |
| 5 | Tour / Open House | 4939 | ~776 | beige (`bg-beige`) | "見学会" — image left + empty-state text + 2 buttons |
| 6 | Newsletter | 5715 | ~604 | gray | "施工事例やイベント情報を / メールでお届けします" + email input + 登録 button |
| 7 | Contact / Resources | 6319 | ~489 | gray | 2-col split: お問い合わせ / 資料請求, each with description + black button |
| 8 | Footer | ~6800 | ~1100 | dark (`bg-dark`) | News releases + 掲載情報 + footer columns + social + legal |

## Shared / Global Components

### Pill Button (Black)
- `お問い合わせ`, `相談する`, `登録`, `ニュースレター`
- Black bg `#000`, white text, fully rounded, padding ~`px-6 py-2`
- Hover: subtle bg shift

### Pill Button (Outline)
- `製品資料一覧`, `詳しく見る`, `一覧を見る`, `工務店の方はこちら`, `施工パートナー募集`
- Transparent bg, 1px black border, black text, fully rounded
- Hover: fills black, text white

### Logo
- Wordmark "Monochrome" (in `neue-haas-unica`) + circular spiral mark (©-style)
- Footer uses just the M with spiral

### Section Heading
- `font-size ~2rem` (32px), `font-weight 400-500`, generous line-height
- Sits at top-left of section above content
- Often paired with an "一覧を見る" CTA on the right

## Page-Level Behaviors
- Header reveal-on-scroll-up
- Hero KV cycles through 17 images (kv_01 → kv_17) with opacity transition `duration-1000 ease-out-expo`
- Hero thumbnail strip on the right reflects active KV index, click to jump
- Architect cards have image-on-hover: `scale-105 opacity-0` → `scale-100 opacity-100` on `group-hover` with `ease-out-cubic`
- Journal carousel auto-advances or click-to-advance with `03 / 04` pagination indicator

## Tech Stack Detected
- **Framework:** Next.js (App Router probable)
- **Images:** Next.js `<Image>` component (`/_next/image?url=...`)
- **Fonts:** YakuHanJP (Japanese kerning), neue-haas-unica (Latin) via next/font
- **CSS:** Tailwind utility classes everywhere — heavy use of arbitrary values like `text-[2.5rem]`, `pt-[6.5rem]`, `z-[9999]`, `h-screen-s`
- **Custom utilities:** `base-px`, `base-pr`, `base-gap-x`, `h-screen-s`, `border-black-10`, `bg-dark`, `bg-beige`, `bg-gray`
- **Custom easing:** `ease-out-expo`, `ease-out-cubic`
- **Video:** Cloudinary (`res.cloudinary.com/monochromeso/...monochrome-power_qdgd5p.mp4`) — 1280w, loop, muted

## Key Custom Tailwind Tokens (inferred)
- `bg-dark` → `#1a1a1a` or `#111` (very dark gray)
- `bg-beige` → light warm beige (~`#dad7c8`)
- `bg-gray` → light cool gray (~`#e5e5e5`)
- `border-black-10` → `rgba(0,0,0,0.1)`
- `h-screen-s` → small viewport height (likely `100svh`)
- `base-px`, `base-pr` → responsive horizontal padding (likely 24/40/64px)
- `base-gap-x` → responsive gap (likely 16/24/40px)
