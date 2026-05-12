# Yodden Design Tokens

## Brand Colors
- **Primary (red):** `#df0303` — rgb(223, 3, 3) — used for accents, buttons, primary headings highlights, subtitle bar
- **Secondary (near-black):** `#010101` — rgb(1, 1, 1) — dark blocks, dark cards
- **Body text:** `#42545e` — rgb(66, 84, 94) — paragraph and muted text
- **Heading dark:** `#232323` — subtitle uppercase color
- **Light background:** `#f8f9fa` — gray-50, used for soft sections
- **Card1 background (active):** `rgba(223, 3, 3, 0.05)` — pale pink wash on first service card
- **White:** `#ffffff`

## Typography
**Font family:** `"Plus Jakarta Sans", sans-serif` — loaded from Google Fonts (`Plus+Jakarta+Sans:wght@300;400;500;600;700;800`).

Display scale (matches Bootstrap's `display-N` and bespoke `display-N` utilities):
| Name | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| h1 / display-1 | 80px | 80px | 800 | -2px |
| h2 / display-5 | 48px | 48px | 800 | -2px |
| h3 | 40px | 48px | 700 | -0.8px |
| h4 | 24px | 28.8px | 800 | -0.48px |
| h5 | 20px | 24px | 800 | — |
| display-28 (lead) | 17.6px | 29.92px | 500 | — |
| body | 16px | 27.2px | 400 | — |
| display-29 | 16px | 19.2px | 500 | — |
| display-30 | 14.4px | 24.48px | 500 | — |
| display-31 | small caps label | — | 700 | uppercase |
| subtitle | 16px | — | 600 | 1px / uppercase |

H1 hero text uses two weights inline: `font-weight-800` for the first half, `font-weight-400` for the second (e.g., "Strong connection **smooth journey**" — second half is light, first half is heavy).

## Spacing scale (Bootstrap-style with custom multipliers)
Bootstrap utilities like `pt-1-9`, `pt-2-6`, `pt-6`, `pt-md-18` map to rem multiples (0.1rem step e.g. `1-9 = 1.9rem`, `2-6 = 2.6rem`, plus larger 6, 8, 10, 13, 18, 22 rem steps).

## Container
- `.container` max-width: 1320px (Bootstrap XXL container)
- Horizontal padding: `px-lg-1-6 px-xl-2-5 px-xxl-2-9`

## Buttons (`.butn`)
- 9px 20px padding, 50px border-radius (pill)
- 15px font-size, 800 weight, uppercase, 0.5px letter-spacing
- Height ~43px
- Primary variant: red bg, white text
- `.butn.white`: white bg, primary text
- `.butn.white-btn`: white outline / bordered variant

## Cards
- `.card-style1` (service): radius 6px, bg `rgba(223,3,3,0.05)` when active, otherwise transparent until hover
- `.card-style6` (pricing): white bg, large padding, top icon, has dark variant `.bg-secondary`
- `.card-style19` (blog): radius 10px, white, soft primary shadow, post-date pill overlay

## Decorative elements
- Floating dots (`.p-2 bg-primary rounded-circle ani-move`) for ambient red specks
- Stroked rectangles for outline shapes (`.border border-width-2`)
- Subtle wave lines (`line-01.png`, `line-02.png`) drift up/down via `ani-top-bottom`
- Big red conic-gradient circle (`conic-gradient(rgb(223, 3, 3) 95%, rgb(1, 1, 1) 95%)`) appears on counter as decorative pie

## Icons
- **Font Awesome 7 Free** (solid + brands + regular) — `fas`, `far`, `fab`, `fa-*`
- **Themify Icons** — `ti-*` prefix (ti-check, ti-arrow-left, ti-rss-alt, ti-desktop, ti-time, ti-user, ti-comment-alt)
- Service card icons: PNG illustrations from `/img/icons/icon-XX.png` (red line art with pink/circle ring behind)
- Two custom shapes: `.round-shape` (round behind icon) and `.icon-box` (pill bg behind why-choose icons)

## Animations
- WOW.js with `fadeInUp` data-wow-delay 200-800ms staggers
- Owl Carousel for hero (3-slide fade) and streaming (5-up carousel)
- `ani-move`, `ani-top-bottom`, `ani-left-right` — looping decorative drifts (keyframes in styles.css)
- Header style: `header-style1 menu_area-light fixedHeader` — header stays at top, gets `fixedHeader` class once scrolled

## Excluded (Themeforest preview chrome)
These elements are NOT part of the actual template — they are injected by the preview wrapper and must not be cloned:
- `.buy-theme` floating "Purchase Covrit Template" cart pill (top-right side strip)
- `.wlt-sidebar-main` "Popular Templates" side panel + layers icon
- Cookiebot consent banner
- `#preloader` (we'll skip the loader; it's not core UX)
