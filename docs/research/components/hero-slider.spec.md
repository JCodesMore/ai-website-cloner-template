# HeroSlider Specification

## Overview
- **Target file:** `src/components/sections/HeroSlider.tsx`
- **Interaction model:** carousel — autoplay every ~6s + manual prev/next arrow buttons (circular, white bg, positioned top-right of the hero, ~40px diameter) + dot pagination (bottom-left, 2 dots for 2 slides, active dot wider/darker).

## Layout
Full-bleed hero, height ~100vh (min-height 700px), background is a looping muted autoplaying video (no controls), with a subtle dark gradient overlay at the bottom-left for text legibility. Content is bottom-left aligned, max-width ~640px, padding 24px/64px (mobile/desktop).

## Slide 1
- Background video: `/videos/onday/66f2d2c28870466eae358b3516f57eb6.HD-1080p-7.2Mbps-77993130.mp4` (desktop), poster `/images/onday/66f2d2c28870466eae358b3516f57eb6.thumbnail.0000000000.jpg`. Mobile variant: `/videos/onday/de9997efe0724c9792f0da671514477d.HD-1080p-7.2Mbps-77839928.mp4`, poster `/images/onday/de9997efe0724c9792f0da671514477d.thumbnail.0000000000.jpg`.
- Heading (font-heading, white, ~40px desktop/28px mobile, line-height ~1.1): "Et si votre bien-être tenait en **_un seul verre_** ?" (the italic phrase "un seul verre" renders in the italic HAL Timezone style)
- Subtext (white, 16px): "Rejoignez +5000 abonnés"
- CTA pill button (dark green `#003D2A` bg, white text, rounded-full, padding ~14px/24px, small circular lime `#e0ff0c` arrow-right icon on the right end): "Offre de juin : 15€ de réduction"
- Star rating row: 5 filled lime/green stars + white text "4.7/5 | Excellent sur Trustpilot" (14px)

## Slide 2
- Static image background: `/images/onday/1200628_Gamme_face.png` (product range photo)
- Heading: "Enfin un complément qui suit **_votre rythme_**"
- Subtext: "Votre vie n'est pas simple. Alors votre complément devrait l'être."
- CTA pill button: "Je profite de 15€ offerts"
- Same star rating row as slide 1.

## Behaviors
- Autoplay with pause-on-hover; manual arrows override autoplay timer.
- Dots are clickable to jump to a slide.
- Use CSS `transition: opacity .5s ease` or transform-based slide; either is acceptable — prioritize smoothness over exact match.

## Responsive
- **Desktop (1440px):** full-bleed video, text block max-width 640px, bottom-left, ~64px inset.
- **Mobile (390px):** video swaps to the mobile-specific asset (portrait 1080x1920), text block full-width minus 24px padding, font sizes drop ~30%.

## Assets available (public/images/onday/ and public/videos/onday/)
66f2d2c28870466eae358b3516f57eb6.thumbnail.0000000000.jpg, de9997efe0724c9792f0da671514477d.thumbnail.0000000000.jpg, 1200628_Gamme_face.png, stars-5.svg (Trustpilot 5-star badge — or use the `StarRatingIcon` from `src/components/icons.tsx`)

## Notes
- Use `<video autoPlay muted loop playsInline poster={...}>` with `<source>` for desktop, and a second `<video>` swapped via a `md:hidden`/`hidden md:block` pair for the mobile asset (simplest correct approach — avoid JS media-query listeners).
- Do NOT build a click-based tab system here — this is scroll-independent, time/manual-driven carousel only.
