# WhyOnday Specification

## Overview
- **Target file:** `src/components/sections/WhyOnday.tsx`
- **Interaction model:** static two-column layout; numbered items fade/slide in on scroll (same IntersectionObserver pattern as BenefitsList, stagger per item).

## Layout
Background cream `#FCFAF0`. Two columns on desktop (image left ~45%, sticky within section; text list right ~55%), stacked on mobile (image above, list below). Section padding ~96px vertical, max-width ~1200px centered.

## Content
- Heading (font-heading, dark green `#003D2A`, ~36px, centered above the two columns): "onday, c'est pour vous ?"
- Left image: a runner/lifestyle motion-blur photo (pick from asset list, e.g. one of the numbered `1_...png`–`8_...png` blur/motion shots), rounded corners ~24px, tall aspect ratio (~3:4).
- Right: 4 numbered items, each: large muted sage-green numeral (`text-6xl`, color ~`#a8c9b8` low-opacity dark green), heading (dark green, ~20px) + paragraph (muted gray `#7d7d7d`, ~15px):
  1. **01 — Vous n'êtes pas qu'une identité figée** — "Travail, sport, famille, vie sociale… vous menez tout de front. Vous avez besoin d'un allié santé complet qui accompagne enfin votre rythme."
  2. **02 — Votre corps a besoin d'une base nutritionnelle solide** — "Le stress, la fatigue et la pollution vident vos réserves. Vous voulez des actifs intelligemment choisis pour combler vos carences et renforcer votre santé."
  3. **03 — Vous n'avez pas envie d'accumuler 10 cures différentes** — "Vous cherchez la simplicité sans sacrifier l'efficacité. Vous rêvez d'une formule unique, complète et agréable à boire qui s'intègre facilement à votre routine matinale."
  4. **04 — Vous êtes intransigeant sur la qualité** — "Vous êtes lassés des compositions floues et des provenances obscures. Vous exigez une formule clean, sans sucre, et fabriquée en France."
- Below the list: CTA pill button, dark green bg `#003D2A`, white text, small lime circular arrow-right icon on the right: "Découvrir la routine" (scrolls/links to the Routine section, anchor `#routine`)

## Responsive
- **Mobile (390px):** single column, image on top (aspect ~4:3), numbered list stacked below with reduced numeral size (`text-4xl`).

## Assets available (public/images/onday/)
1_5a381b36-93a3-41d2-8f11-2ebf26bec3eb.png, 2_15d5a9cf-52d8-4f13-a7ec-a2a01b3e2b5a.png, 2_77fd8d05-3b82-4b1b-a4e8-8a42b4d2cc7a.png, 3_79ad8a76-e6fd-4c50-a3af-96b6f71880d4.png, 4_abe3af46-b04d-4af2-a788-ed8025a1bc9f.png, 5_73d98ae0-fadb-4c89-8b1c-09626481f71e.png, 6_3ff5a863-f8f5-47ce-ba93-e19b487377e0.png, 6_83329103-6a42-4d16-8286-0a6c5698fe66.png, 7_ba33b82d-2227-439c-9081-393fea88d87a.png, 8_f1916836-20bb-4e01-80ed-03a66b7dd33f.png
