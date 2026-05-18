# Aurora Agency — Page Topology

Target: https://aurora-agency.ovh/  •  Stack: Nuxt 3 + Lenis smooth scroll + canvas video scroll-scrub  •  Total height (desktop, 1038vw): ~10,795px

## Global layers

- `html.lenis` — Lenis smooth scroll attached to root
- Body bg: `#11121d` (--black), text white
- Fixed header logo (top-left) + hamburger button (top-right) — visible across the whole page, no real `<header>` element, placed inside section overlays
- Hamburger opens a full-viewport `.menu page` overlay with 4 nav items (Agency / Works / Contact / Join us), light-on-dark, with a pink→purple radial gradient background and a disclaimer paragraph

## Section order (top → bottom)

1. **HeroSection** (`.home-hero`)  — `position: fixed; z-10` until scrolled past. Dark bg, huge centered headline "Together we shape the success of your season", large faint "A" or "F" watermark, "SCROLL DOWN" indicator at bottom with circular icon.
2. **VideoSection** (`.home-video`) — `position: relative`, height ~2097px. Contains TWO `position: fixed` children: `.video-mask` and `.home-video--container`. Inside: a fixed `<canvas>` that scroll-scrubs through the hero video. Headline reveals: "Outdoor Agency" (split) + paragraph about 30+ years.
3. **OffersSection** (`.home-offers`) — Headline "Marketing crafted to suit every host" + 3 pills (Expand/Maximize/Elevate). Below: `.stack-cards` containing 3 stacked `.card` elements pinned/stacked on scroll. Each card has profile (left, with a play-button circle showing a video) and text right side (category, title, paragraph, tag pills).
4. **LogosSection** (`.home-logos`) — Centered headline "Trusted Worldwide, End-to-end". Two marquee rows of partner logos (Blue Palace, Cheval Blanc Paris, Belmond, Zannier Hotels, etc. — 7 unique logos from home_2.webp → home_8.webp).
5. **MapSection** (`.home-map`) — Two-column layout: LEFT a dotted map of France (PNG) with an animated pulse dot pointing at Nantes + ambassador profile photo card with name/phone/CTA + back/forward arrow buttons; RIGHT a heading "An Embedded Partner from Day One" + intro paragraph + numbered accordion-style list (01 Weekly On-Site Check-Ins, 02 Personalized Action Playbook, 03 Live Content Capture, 04 Editorial Calendar Orchestration) + closing paragraph + "Discover our offers" CTA link.
6. **GallerySection** (`.home-gallery`) — Full-bleed grid of overlapping luxury hospitality images (real_0..real_6_cover.webp), with parallax/depth offset.
7. **ValuesSection** (`.home-valeurs`) — Dark centered text: small label "Our Values & ESG Commitments", subheading "Ethics ⏤ Humanism ⏤ Transparency ⏤ Performance".
8. **MarqueeSection** (`.double-marquee`) — Two diagonal stripe rows (pink #f3c4c9 above, lavender #d4acc5 below) tilted slightly, with text "Ethics • Humanism • Transparency • Performance" repeating, each separated by a small swirl icon. Top row scrolls one way, bottom the other.
9. **FooterSection** — Three-row footer: `.footer-description` ("Where luxury outdoor meets glamping excellence…"), `.footer-logo` (big Aurora monogram via footer-logo.png on a radial gradient pink→purple bg), `.footer` strip with "Design by Flot Noir Studio" / "Development by Guillaume Colombel" rounded purple buttons.

## Interaction model summary

- **Hero → Video**: Hero is `position: fixed`. As you scroll, content underneath (VideoSection) covers it. The video container is itself `fixed` — its parent `.home-video` has 2097px height creating scroll runway; the canvas scrubs the video as scrollY progresses through that runway.
- **Offers cards**: `.stack-cards` is 1838px tall containing 3 cards (each 578px). On scroll, cards stack/overlap and the top pills (Expand/Maximize/Elevate) auto-update based on which card is active (scroll-driven via IntersectionObserver, NOT click — but pills are also clickable). The 3-card video preview animates on each card.
- **Gallery**: parallax — images shift at different rates as you scroll.
- **Marquee**: horizontal CSS animation, infinite, two rows tilted oppositely.

## Design tokens (extracted from `:root`)

```
--black:           #11121d  (rgba 17,18,29)   — body bg
--white:           #fff
--blue / independance:    #977dbd  (rgba 151,125,189)  — primary purple
--humanisme:       #d4acc5  (rgba 212,172,197)  — lavender pink
--gray / engagement: #f3c4c9 (rgba 243,196,201) — peach pink
--performance:     #b695c1  (rgba 182,149,193)  — muted purple
```

## Fonts

- `Almarena` 300/400/700 (display) — body + headings
- `Almarena Mono` 300/700 (mono) — small caps labels like "TAILORED OFFER", "SCROLL DOWN"

Self-hosted via `public/fonts/Almarena*.woff2`.
