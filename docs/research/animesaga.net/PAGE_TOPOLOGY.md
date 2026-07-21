# animesaga.net — Page Topology (home `/`)

Target: `https://animesaga.net` · Framework: **Next.js (App Router, Turbopack, CSS Modules)** · Page height ~3780px @1440.
Fonts: **Inter** (body), **Outfit** (headings/logo). Body bg `rgb(4,5,8)`, text `rgb(241,245,249)` (slate-100), muted `rgb(148,163,184)` (slate-400), accent = vivid green.

## Layout model
- Single scroll container (native scroll — NO Lenis/Locomotive).
- Two fixed overlays: **top Navbar** (`position:fixed; z:1000; h:72`) and **left icon Sidebar** (fixed vertical rail).
- Flow content sits in `main.mainContent` → `div.pageSections`.

## Sections (top → bottom)

| # | Component | DOM (CSS-module) | Notes |
|---|-----------|------------------|-------|
| 1 | **Navbar** | `nav.Navbar-module__navbar` | fixed top, z1000, h72. Logo (green mask icon + ANIME/SAGA), centered search input w/ `Ctrl S` badge, right cluster: EN language pill (green), notification bell, user avatar circle. |
| 2 | **LeftSidebar** | vertical icon rail (fixed, ~64px wide) | Icons: Home (active=green), Search, Calendar, Sparkles, Community(people), Settings(gear); Lock + collapse `‹` at bottom. |
| 3 | **Hero** | `section.Hero-module__section` (h≈334 content, full-bleed bg) | Full-bleed backdrop image w/ dark left+bottom gradient scrim. Left content: title-logo PNG, meta row [★86% (green) · 2026 · 14 Episodes · 24 min · `TV` badge], genre pills [Adventure/Drama/Ecchi], 1-line description, buttons [**Watch Now** green+play, **More Info** glass+info, mute speaker toggle]. Bottom-left: 6-thumbnail carousel + `1/6` counter + prev/next circular arrows. INTERACTION: auto-cycling featured carousel (time-driven) + click thumbnails/arrows to switch. |
| 4 | **AnimeRow** (Trending Now) | `section.AnimeRow-module__section` → `.carouselWrapper` | Heading "Trending Now" + `HOT` badge + "View All →". Horizontal scroll carousel of anime poster cards. |
| 5 | **AnimeRow** (Popular This Season) | same module | badge `SEASONAL`. |
| 6 | **AnimeRow** (Most Favorite) | same module | badge `TOP`. |
| 7 | **Footer** | `footer.Footer-module__footer` (h≈105) | "AnimeSaga.net" · Terms & Privacy · Contacts. |

## Reusable card (inside AnimeRow.carouselWrapper)
Anime poster card: poster image (≈2:3), episode badge ("Ep 14"), status badge ("RELEASING"), title. Hover state TBD (extract).

## Interactive overlays (to preserve per user)
- **More Info modal** — opens from Hero "More Info" and card click. (capture in interaction sweep)
- **Episode UI / menu** — episode list/selector within detail view. (capture in interaction sweep)

## Icons observed (for icons.tsx)
Logo mask, Search, Bell, User/avatar, Home, Calendar, Sparkles, Community/people, Settings/gear, Lock, ChevronLeft (collapse), ChevronLeft/Right (carousel arrows), Play, Info, Speaker-mute, Star.
