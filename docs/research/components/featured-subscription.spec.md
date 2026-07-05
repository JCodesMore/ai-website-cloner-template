# FeaturedSubscription Specification

## Overview
- **Target file:** `src/components/sections/FeaturedSubscription.tsx`
- **Interaction model:** left media is a manual carousel (arrows + dot pagination, ~10 dots visible on the live site — just implement with the images listed below, looping). Right side is a click-to-select pricing card: two selectable options (radio-style circle), selecting one visually highlights it (border/bg change); "Livraison mensuelle" is selected by default.

## Layout
White background, two columns desktop (left: image carousel ~50%, right: pricing card ~45%, gap ~48px), stacked on mobile (image on top). Heading above both columns, centered, with italic last word: "Et si on commençait **_aujourd'hui_** ?"

### Left: image carousel
Square-ish product photography, rounded-2xl, prev/next circular arrow buttons (white bg) vertically centered at the edges, dot pagination below. Use these images in order (loop):
`Doypack_2.png`, `Slide_Abonnement_dd5c3907-cd59-455a-a2c5-172b005857f9.png`, `Slide_Gamme_1768a2ca-a162-4cc4-b2a9-ab18f7d691a8.png`, `Slide_Gout_1.png`, `Slide_Ingredients_Achat_Unique.png`, `Slide_Tableau_Ingredients_5.png`, `Slide_Unique.png`, `Slide_Confiance_ce611e3a-4e3a-468e-bb0f-15afcf6cb1e8.png`, `Slide_Data_1.png`, `Slide_Bienfaits_Achat_Unique.png`

### Right: pricing card (rounded-2xl border, padding ~24px)
**Option A (selected by default)** — green filled radio dot + "Livraison mensuelle" label, right-aligned price block: "89€" (strikethrough, gray) "74€ / mois" (bold dark green) below a small "-18%" pill (lime bg) and "2,46€ / jour" (small gray).
Bullet list (green checkmark icon + text, ~14px):
- 1 sachet de 30 doses, livré chaque mois
- Pot de stockage & shaker OFFERTS (58€)
- -18% sur toutes vos commandes
- Livraison gratuite tous les mois
- Sans engagement, résiliez à tout moment

CTA button full-width, lime `#e0ff0c` bg, dark green text, rounded-full, dark green circular arrow-right icon right-aligned inside: "J'en profite maintenant"

Below CTA, a light gray `#e1e8ea` rounded box "INCLUS DANS VOTRE ABONNEMENT :" (small uppercase label with gift icon) containing 2 included-item rows (thumbnail image ~48px rounded, name bold + 1-line description, right-aligned price strikethrough + "Offert" in green):
- Thumbnail `Gourde_110x110_crop_center.png` — **Gourde en Tritan™** — "Une gourde ultra-légère pour faire votre mélange, sans aucun micro-plastiques !" — 15€ → Offert
- Thumbnail `Pot_110x110_crop_center.png` — **Pot & cuillère doseuse** — "En acier inoxydable et en chêne : le moyen le plus écologique de consommer." — 34€ → Offert

**Option B** — outline radio circle + "Achat unique" label, price "89€" right-aligned.
Bullet list:
- 30 doses dans un sachet refermable
- Cuillère doseuse inclue dans le sachet
- Livraison offerte

## Responsive
- **Mobile:** stacked, carousel first, card below full-width.

## Assets available (public/images/onday/)
Doypack_2.png, Slide_Abonnement_dd5c3907-cd59-455a-a2c5-172b005857f9.png, Slide_Gamme_1768a2ca-a162-4cc4-b2a9-ab18f7d691a8.png, Slide_Gout_1.png, Slide_Ingredients_Achat_Unique.png, Slide_Tableau_Ingredients_5.png, Slide_Unique.png, Slide_Unique_ffd43099-cab5-4e31-bcc2-23547a986453.png, Slide_Confiance_ce611e3a-4e3a-468e-bb0f-15afcf6cb1e8.png, Slide_Data_1.png, Slide_Bienfaits_Achat_Unique.png, Slide_Onday_remplace_-_Abonnement.png, Slide_Onday_remplace_-_Achat_unique_328b5487-4040-4da4-a8c2-ed4ae68c194d.png, Gourde_110x110_crop_center.png, Pot_110x110_crop_center.png

Client component (`"use client"`) — needs local state for carousel index and selected plan.
