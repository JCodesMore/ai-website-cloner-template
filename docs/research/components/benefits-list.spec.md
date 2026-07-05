# BenefitsList Specification

## Overview
- **Target file:** `src/components/sections/BenefitsList.tsx`
- **Interaction model:** static grid; each card's image + caption fades/slides in when it scrolls into view (IntersectionObserver, simple opacity+translateY(16px) → 0, ~0.5s ease, stagger ~100ms per card).

## Layout
Full-bleed section, background `#003D2A` (dark green). Centered heading block, then a responsive grid of 6 image cards (3 columns × 2 rows desktop, 1 column mobile), gap ~24px, max-width ~1200px centered, padding 64px vertical.

## Content
- Small eyebrow/kicker line above heading (white, uppercase-ish tracking): "Tous vos nutriments essentiels, chaque matin"
- Three small pill badges under kicker (light/translucent bg, white text, ~13px): "Complément à boire", "43 actifs en synergie", "100% français"
- Heading (font-heading, white, ~32px): "Votre organisme renforcé en profondeur dès le premier mois"

### Cards (each: rounded-2xl image ~4:5 ratio, badge pill top-left with icon + label, caption text bottom-left over a dark gradient scrim)
1. **ÉNERGIE** — image `/images/onday/Energie_2.png` — "Soutient une vitalité stable et durable, du matin au soir."
2. **RÉCUPÉRATION** — image (pick a fitness/cycling themed file from the asset list below) — "Régénère l'organisme en profondeur après l'effort et le stress quotidien."
3. **IMMUNITÉ** — image `/images/onday/Immunite_3.png` — "Active votre bouclier naturel pour un corps résistant en toute saison."
4. **DIGESTION** — image `/images/onday/Digestion_3.png` — "Régule le transit et apaise les ballonnements."
5. **SOMMEIL** — image (pick a sleep-themed file, e.g. `Sommeil_698346db-fe68-49a2-9c90-442b3e7f08c0.png`) — "Apaise le système nerveux pour un endormissement serein et réparateur."
6. **PEAU, ONGLES & CHEVEUX** — image `/images/onday/Peau_ongles_cheveux_2.png` — "Fortifie les tissus et prévient le vieillissement cellulaire."

Badge pill style: small circular icon chip (lime `#e0ff0c` bg, dark green icon) + uppercase label text, positioned top-left of each image, semi-translucent dark rounded pill background.

## Responsive
- **Desktop:** 3-column grid.
- **Mobile (390px):** single column, cards full width, same content order.

## Assets available (public/images/onday/)
10.png, 15.png, 16.png, 7.png, 9.png, Energie_2.png, Immunite_3.png, Immunite_ada66d24-d02d-4cda-8b81-b5e3f1279220.png, Digestion.png, Digestion_3.png, Sommeil.png, Sommeil_698346db-fe68-49a2-9c90-442b3e7f08c0.png, Peau_ongles_cheveux_079a004c-86ff-4339-a50c-b1fd941ddf05.png, Peau_ongles_cheveux_2.png, Rectangle_7_0b0c3ada-5872-4c1f-b65b-ef8406c185af.png, Rectangle_8102_1.png, Teint.png, Sante.png, Confiance.png

Use `next/image` with `fill` inside an `aspect-[4/5]` relative container.
