# IngredientsCarousel Specification

## Overview
- **Target file:** `src/components/sections/IngredientsCarousel.tsx`
- **Interaction model:** CLICK-DRIVEN (verified by clicking live site — this is NOT scroll-driven). Each card has a small "en savoir plus" pill (top-right corner, semi-translucent dark bg, white text + refresh/flip icon) that on click flips the card's content: the photo background is replaced by a plain dark surface (same accent color family, darkened) showing extended detail paragraphs, and a small × close button appears top-right to flip back. Cards are otherwise laid out in a horizontal row that becomes a swipeable/scrollable carousel with prev/next circular arrow buttons top-right of the section heading.

## Layout
White background. Heading centered at top with prev/next arrow buttons at top-right. Row of 6 cards, each ~280px wide × ~380px tall, rounded-2xl, gap 24px, horizontally scrollable (snap-x) on all breakpoints — visible: ~4 cards on desktop, ~1.2 on mobile (peek next card).

Each card (default state): full-bleed background image (macro texture photo matching the ingredient category, tinted), huge lime `#e0ff0c` number top-left overlapping the image (e.g. "11", font-heading, ~96px), category name + 1-line description in a dark scrim box at the bottom, "en savoir plus ⟳" pill top-right.

Each card (expanded state): image replaced by a solid dark surface in the same hue family as the default image (e.g. dark gray/purple/amber depending on category), heading "{number} {Category}" at top, 1-2 paragraphs of extended copy, × close pill top-right.

## Content (6 cards, in order)
1. **Vitamines** (image `/images/onday/Vitamines_4e66a815-3f24-4693-a6bb-f712aa41f35f.png`, number "11") — short: "Soutiennent vos fonctions vitales et activent la production d'énergie." — expanded: "Toutes les vitamines du groupe B (avec des formes actives rares comme la B9 5-MTHF et la B6 P-5-P) pour soutenir votre métabolisme, apaiser votre système nerveux et garantir une énergie constante. S'y ajoutent la Vitamine C extraite d'Acérola du Brésil, et un duo de choc 100% naturel pour l'immunité et les os : la Vitamine D3 vegan issue du Lichen boréal couplée à la K2 MK-7."
2. **Minéraux** (image `/images/onday/Mineraux_2_ba639596-ac3b-4f3e-a56e-86c5492990e8.png`, number "5") — short: "Régulent l'équilibre nerveux et assurent une fonction musculaire optimale." — expanded: "Le duo Magnésium et Zinc sous forme Bisglycinate (ultra-assimilable et très doux pour l'estomac) régule le système nerveux, combat la fatigue et renforce l'immunité. S'y ajoutent le Potassium Citrate pour l'équilibre musculaire, le Sélénium organique sur levure (puissant antioxydant) et le Chrome Picolinate pour réguler le sucre sanguin."
3. **Probiotiques** (image `/images/onday/Probiotiques_dd142cfc-ec64-4cc2-b810-9fd19634d538.png`, number "10", suffix "Md" small superscript for "milliards") — short: "Renforcent la barrière intestinale pour une immunité et une digestion solides." — expanded: "L'équilibre parfait : 5 milliards de Lactobacillus acidophilus et 5 milliards de Bifidobacterium bifidum travaillent ensemble pour repeupler votre flore, restaurer votre confort digestif et booster votre immunité. Pour décupler leur survie et leur efficacité, nous les avons couplés à des fibres prébiotiques (inuline de chicorée) qui les nourrissent directement dans l'intestin."
4. **Acides Aminés** (image `/images/onday/Acide_amine_ac75b57c-b34d-4146-9bd1-57702ed87d15.png`, number "3") — short: "Optimisent la récupération et la synthèse des protéines essentielles." — expanded: "La Glycine, indispensable à la synthèse du collagène, protège vos articulations et favorise un sommeil réellement réparateur. La L-Glutamine, véritable carburant des cellules intestinales, renforce votre barrière digestive et accélère la récupération musculaire. Enfin, la Taurine assure l'équilibre des électrolytes et soutient la vitalité cardiaque."
5. **Super Aliments** (image `/images/onday/Plante_2_20bcbe1b-6293-4f7a-8dd4-ee809bee2c81.png`, number "14") — short: "Purifient votre organisme grâce aux bienfaits naturels des plantes bio." — expanded: "Ce cocktail Bio est un véritable bouclier pour votre organisme : Les plantes adaptogènes (ginseng, ashwagandha..) régulent le stress et soutiennent l'énergie, tandis que les fibres et prébiotiques (chicorée, gingembre..) apaisent la digestion. Et notre concentré de super-aliments (spiruline, chardon-marie..) inonde vos cellules d'antioxydants et de bons nutriments."
6. **Antioxydants** (image `/images/onday/Antioxydants_130f16c6-d5c6-4dd2-8115-06b9f2420d0e.png`, number "4") — short: "Protègent votre corps contre le stress oxydatif et le vieillissement cellulaire." — expanded: "Le Coenzyme Q10 booste votre énergie cellulaire et protège votre cœur, tandis que l'Acide Hyaluronique assure une hydratation profonde de la peau et des articulations. Pour compléter ce bouclier, nous avons intégré de la Lutéine (issue de Rose d'Inde) pour la santé oculaire et de la Quercétine (issue de Sophora du Japon) pour renforcer votre réponse immunitaire."

Section heading (font-heading, dark green, centered, large italic emphasis on last words): "On a réuni tous vos nutriments essentiels dans un seul verre"

Below the cards: a dark green pill button with lime circular arrow icon: "Valeurs nutritionnelles" — on click, open a simple centered Dialog (use shadcn `Dialog`) with a placeholder heading "Valeurs nutritionnelles" and a note "Tableau nutritionnel complet disponible sur demande" (the real nutrition-facts table wasn't fully extracted — keep this modal minimal/stubbed).

## Responsive
- **Mobile (390px):** cards ~85vw wide, snap-x scrolling, 1 card + peek visible.

## Notes
- Use client component (`"use client"`) with local `useState<number|null>` for which card index is expanded.
- This is the #1 place to get the interaction model right — it is CLICK-per-card, not a shared tab-switcher. Each card expands independently.
