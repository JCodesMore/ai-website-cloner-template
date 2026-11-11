# showlanka.com — page brief

Source: https://www.showlanka.com/ (WordPress, theme `webslankatheme`, Bootstrap 5.2 grid + theme `styles.css` + `home.css`).
Local route: `/` → `src/app/page.tsx`, components in `src/components/sites/showlanka/`, assets in `public/sites/showlanka/` (see `asset-map.tsv`).
Reference screenshots: `docs/design-references/showlanka/`.

## Rules observed

- **Fonts:** CSS declares `"Montserrat", sans-serif`, but the Google Fonts `@import` sits mid-file in the WP Fastest Cache bundle and is ignored, so visitors without a local Montserrat see the system sans-serif (Arial on Windows). The hero tagline stack is `"Montserrat", "Segoe UI", sans-serif` → Segoe UI. The clone keeps the same stacks and does not load a webfont.
- Body text `#676767` 16/24. Section titles `#196ebb` 26px/24px 400, letter-spacing .6px. Uppercase subtitles 16/24 500, letter-spacing 1.7px, `::after` 60px line `#196ebb` at ≥992px.
- Breakpoint that changes layout: 992px (Bootstrap `lg`). Containers: Bootstrap max-widths, but `max-width: 100%` below 992px.

## Sections (desktop 1440×900 y-offsets)

1. **Header** — fixed at ≥992px, 7rem with top-down black gradient; adds `.scrolled` past 70px scrollY → `#0057a7`, 4rem, logo 6rem + `hue-rotate(-6deg) invert(1)`; 1s transitions. Below 992px: static white 4rem header, 5rem logo, menu-icon **video** (webm) toggles a full-screen white menu sliding down (translateY(-100vh) → 0, 1s). Video plays to 2/5 duration on open, to end on close.
2. **Hero** (0–900, 100vh) — 3 images crossfade (owl, fade 1s, 5s autoplay, active scale 1.02). Owl's `z-index:1` paints over the theme's dark overlays, so they are not visible. Tagline: rotating word every 5s (opacity + translateY 22px, .7s). "Send an Inquiry" button. Bottom-left: TripAdvisor badge (zoom 1.2) + Google 4.7 badge; bottom-right: TourRadar reviews iframe 240×280. Mobile: hero 65vh, badges flow below hero, TourRadar centered & scaled (.55/.68/.85).
3. **Intro** (900–1210) — "Explore Sri Lanka", h2 32px, two paragraphs, centered.
4. **Tour Packages** (1226–2442) — 9 cards, 3 per row ≥992px, 360px tall bg image, 8px white border, bottom gradient; hover (≥992px): image scale 1.05→1, text up 20px, .5s.
5. **Why travel** (2458–2954) — 3 bordered cards (radius 16, `#c8c8c8`) with 88px FA icons (heart red `#C62828`, certificate yellow `#fbbd00`, shield blue `#047ad9`).
6. **Tour of the month** (2970–3870) — 100vh bg (60vh mobile), `background-attachment: fixed` + JS parallax `translateY((scrollY - top) * 0.6)`; white center gradient over text.
7. **Reviews** (3886–4409) — dotted black video card (click → YouTube embed autoplay), TourRadar widget, Trustindex Google reviews slider (9 reviews, next/prev, 6s autoplay, "Read more"/"Hide"), TripAdvisor badge.
8. **Footer** (4425–5020) — dotted `#494b4e` bg, 3 link columns + address, partner logos (90px), Facebook/YouTube, ©.

Also: first-visit preloader (sessionStorage `slPreloaderShown`, random compass/plane/globe icon), 0.45s body fade-in, header/intro slide-in on load.

## Route map (full site, 45 URLs from /sitemap.xml)

All routes live in the `src/app/(showlanka)/` route group; its layout renders the shared header, footer and preloader.

| Source | Local | Template |
| --- | --- | --- |
| `/` | `/` | `showlanka-home.tsx` |
| `/sri-lanka-tours/` (+ `?group`, `?winter`, …) | `/sri-lanka-tours` | `tours-list.tsx` (category/days/month filters, Bonanza popup) |
| 23 tour posts, e.g. `/sri-lanka-express/` | `/[slug]` | `tour-detail.tsx` (+ `tour-map.tsx`, Bonanza popup) |
| `/news-offers/` | `/news-offers` | news list |
| 11 news posts | `/[slug]` | `news-detail.tsx` |
| `/about/`, `/faqs/`, `/terms-and-conditions/`, `/contact/`, `/meet-your-travel-gurus/`, `/real-traveler-stories/`, `/sweet-bonanza/` | same paths | one `page.tsx` each |

Data: `src/components/sites/showlanka/content/` (`tours.ts` generated from the downloaded pages, `news.ts`, `pages.ts`). Images: `public/sites/showlanka/uploads/<yyyy>/<mm>/…`, same paths as `wp-content/uploads`.

## Content handling

- Kept from the source: layout, images, headings, names, prices, tour codes, durations, map routes, itinerary day titles and stop lists, inclusion/exclusion lists, guide/team facts, contact details, video IDs.
- Not copied word for word: long prose. News posts reprint press articles, so the clone shows a short summary and links to the original post. Tour intros are composed from each tour's data. FAQ answers, Terms clauses and the About/Team text are condensed. 32 itinerary bullets that were full marketing sentences (> 60 chars) were dropped.

## Behaviour notes

- Similar Tour Packages = every tour in the `private` category, in listing order (including the current tour).
- Sweet Bonanza popup: shown 3s after load on the tour list and tour pages, 3 coupons per view (1 below 768px). It closes on an outside click, the X button or Esc.
- Brochure PDF: same output settings as the source's html2pdf call (letter, 0.5in margins, JPEG 0.98, scale 2), built with html2canvas-pro + jsPDF because the template's theme colours are `lab()`/`oklch()`.
- Contact form: same fields and validation; with no WordPress backend, a valid submit opens a pre-filled email to showlankatours@gmail.com.
- Date inputs: a jQuery UI–style calendar that writes `mm/dd/yyyy`.

## External

The TourRadar reviews and the Google Map are live iframes, and the YouTube videos are live embeds. The Trustindex and TripAdvisor widgets are rebuilt as static copies.
