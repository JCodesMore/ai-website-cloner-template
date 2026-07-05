# onday.fr — Page Topology

Single page (`/`). Shopify Online Store 2.0 theme. Section IDs below come directly from the live DOM (`shopify-section-*`).

## Global
- **Header**: sticky pill-shaped nav, floats over hero, background stays translucent/white at top. Logo "onday" (script wordmark) left, nav links (Nos ingrédients, Notre mission) center-left, FAQ / Mon compte / Commander (lime pill button) right. `-10%` corner ribbon bottom-left of viewport (persistent).
- **Newsletter popup modal**: appears ~2-3s after load (or on some trigger), two-column modal — left: dropdown of content preference + email capture form ("10% de réduction sur votre première commande"), right: image with "off/on" toggle graphic. Dismiss via × or "Peut-être plus tard".
- **Font system**: headings use local font "HAL Timezone" (serif/display, italic variant for emphasis words), body uses Google Font "Poppins".
- **Colors**: `#003D2A` (dark green, primary/headings/dark sections), `#E0FF0C` (lime accent, CTAs/badges), `#E1E8EA` (light gray-blue), `#FCFAF0` (cream), `#7D7D7D`/`#9CA3AF` (muted text/gray).

## Sections (top to bottom)

| # | Component name | Shopify id | Interaction model |
|---|---|---|---|
| 1 | HeroSlider | `onday_hero_slider` | Carousel, autoplay + manual arrows/dots. 2 slides: video bg (desktop/mobile specific mp4) |
| 2 | BenefitsList | `benefices_liste` | Static grid, fade-in-on-scroll images (6 cards) |
| 3 | WhyOnday | `onday_reasons_animated` + `onday_raisons` | Static numbered list (01-04), fade-in on scroll |
| 4 | Routine | `routine` | Static 4-step row |
| 5 | IngredientsCarousel | `onday_ingredients_carousel` | Horizontal scroll/carousel of 6 cards; click "en savoir plus" toggles card into expanded detail view (dark overlay replaces image, shows extended copy + × to close). "Valeurs nutritionnelles" button opens `nutritional_values` modal (nutrition facts table) |
| 6 | ExpertsTestimonials | `onday_experts` | Carousel of 14 expert quotes, auto-rotating |
| 7 | FeaturedSubscription | `featured_subscription` | Static pricing comparison (subscription vs one-time), toggle/selectable plan cards |
| 8 | IncludedBlocks | `image_link_blocks` | Static 2-up blocks (Gourde, Pot & cuillère) |
| 9 | ReviewsMasonry | `onday_reviews_masonry` | Masonry grid, "Afficher plus d'avis" load-more button |
| 10 | FAQAccordion | `sz_faq` | Click-to-expand accordion, 8 Q&A |
| 11 | MissionBanner | `banner` | Static full-bleed banner |
| 12 | Newsletter | `newsletter` | Email capture form |
| 13 | BenefitSwitch | `switch` | Interactive: 8 numbered benefit claims, likely click/hover to reveal which actifs deliver it |
| 14 | Footer | `shopify-section-sz-footer` | Static, 3-4 link columns + legal + social |

## Responsive
- Breakpoint ~768px: hero video switches to mobile-specific asset (`de9997ef...` vs `66f2d2c2...`), grids collapse to single/2-column, ingredients carousel becomes swipeable single-card view.

## Not building (out of scope)
- Cart drawer, checkout, account pages, Recharge subscription management UI, Klaviyo email app internals, chat widget bottom-right (third-party widget — attach placeholder or omit).
- Note: a "PPSPY" competitor-research browser-extension overlay appeared in screenshots during inspection — that is a Chrome extension on the inspector's machine, NOT part of onday.fr. Ignore it entirely; it must not appear in the clone.
