# MissionBanner Specification

## Overview
- **Target file:** `src/components/sections/MissionBanner.tsx`
- **Interaction model:** static, no interactivity beyond a CTA link.

## Layout
Full-bleed image section, height ~420px, background image of a person running through a grass field (motion blur), rounded-2xl on the section itself with ~24px horizontal page margin (the image has visible rounded corners inset from the browser edges, per the live screenshot), dark overlay/gradient for text legibility. Content bottom-left, white text, padding ~48px.

## Content
- Heading (font-heading, white, ~32px, two lines): "Le partenaire invisible de vos journées **_chargées._**" (last word italic)
- Second line heading, ~28px: "Pour que chaque jour soit un jour **_on_**" (the word "on" in lime `#e0ff0c` italic)
- CTA pill button (white bg, dark green text, rounded-full, small lime circular arrow icon): "Notre mission" → links to `/pages/mission`

## Assets
Use `/images/onday/Rectangle_7_0b0c3ada-5872-4c1f-b65b-ef8406c185af.png` or `/images/onday/Alice_pack.png` (pick whichever is a wide landscape nature/running photo) as the background image — if none fit well, `/images/onday/Mosaique_site_internet.png` is an acceptable wide fallback.

## Responsive
- **Mobile (390px):** height reduces to ~320px, heading font drops to ~22px, same layout otherwise.
