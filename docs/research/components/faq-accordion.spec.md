# FAQAccordion Specification

## Overview
- **Target file:** `src/components/sections/FAQAccordion.tsx`
- **Interaction model:** CLICK to expand/collapse each question (accordion, only visual state change — no scroll dependency). Icon toggles between "+" and "×" (or rotates 45deg), dark green circular badge (~32px) on the right of each row.

## Layout
White background, two columns desktop (left: sticky tall image ~35%, right: accordion list ~60%), stacked on mobile (image can be omitted or shown small on top). Heading "FAQ" (font-heading, dark green, large) above the right column. Each row: question text (dark green, ~17px, medium weight) + icon button, full-width bottom border `#dbd8d8`, py-6. Expanded state reveals an answer paragraph (gray `#1a1a1a`/muted, ~15px, with line breaks/bullet lists preserved where present in the copy) with a slide-down/fade transition (~0.25s ease).

## Left image
A glass being poured with green liquid, tall portrait aspect — use `/images/onday/vf-onday-2.jpg` or `/images/onday/GNHM57-130.jpg` (pick whichever crops best tall).

## Content (8 Q&A, only first one open by default — "Quel est le goût de Onday ?")
1. **Quel est le goût de Onday ?** — "Onday, c'est un goût naturel de végétaux combiné à des notes fruitées pour une sensation douce et agréable. Notre équipe R&D a passé plusieurs mois à élaborer la formule la plus naturelle possible, sans arôme artificiel ni conservateurs. C'est bon pour le corps, et pour les papilles !"
2. **Et si je n'aime pas le goût ? Avec quoi puis-je mélanger Onday ?** — "Pas d'inquiétude ! Onday a un goût volontairement léger, et peut se mélanger à presque tout (sauf les liquides très chauds, pour préserver les probiotiques). Voici nos astuces préférées : Ajouter quelques gouttes de citron · Avec de l'eau bien fraîche et quelques glaçons · Avec du lait végétal (amande, avoine...) · Dans un yaourt ou du fromage blanc · Mélangé à votre jus de fruit préféré · Dans votre shaker de protéines. Le principal, c'est de faire comme vous le préférez : à chacun sa routine !"
3. **Est-ce que Onday est fait pour moi ?** — "Onday accompagne toutes celles et ceux qui veulent prendre soin d'eux au quotidien : que vous cherchiez à combler des carences en nutriments, que vous ayez une pratique sportive intense, ou que vous vouliez simplement vous sentir bien. onday rassemble toutes les vitamines et minéraux dont vous avez besoin dans une formule unique et fabriquée en France pour vous offrir une base fondamentale de nutrition quotidienne. À noter qu'Onday ne remplace en aucun cas une alimentation variée et équilibrée, et doit se prendre dans le cadre d'un mode de vie sain."
4. **Comment se prend Onday ?** — "Versez 2 cuillères de Onday dans 250mL d'eau, secouez, buvez ! C'est tout. La simplicité est notre maître-mot : un seul geste facile qui vous donne le sourire tous les matins. Et quoi de mieux pour vous accompagner au quotidien que notre gourde Onday en Tritan™ ? Vous aussi vous en aviez marre d'avaler plusieurs gélules et comprimés chaque matin ?"
5. **Quels bienfaits ? Et au bout de combien de temps ?** — "Les bienfaits les plus ressentis par nos clients : énergie au quotidien (en partie liée à un sommeil plus réparateur), meilleure immunité, digestion apaisée, moins de stress, une peau plus nette, des cheveux et ongles renforcés… et un vrai mieux-être général. Certains effets peuvent se faire sentir en quelques jours, d'autres prennent 4 à 6 semaines. Chaque corps est unique, et les bénéfices s'installent avec la régularité."
6. **Pourquoi Onday n'est pas un complément comme les autres ?** — "Parce qu'on a voulu faire simple, complet et ultra qualitatif, et sans le moindre compromis ! Ce qui fait la différence : Une fabrication 100% française, avec des partenaires experts et des standards exigeants. · Des ingrédients hautement biodisponibles et validés par la science. · Une expérience premium et durable : pot en inox avec couvercle en chêne, cuillère en acier, gourde en Tritan™. · Une formule pensée avec justesse, des dosages 100% physiologiques. · Un accompagnement quotidien : conseils bien-être, recettes, astuces..."
7. **Comment a été construit le prix de Onday ?** — "Avec Onday, vous bénéficiez d'un concentré de qualité, fabriqué en France, pour 2,50€ par jour. 40+ nutriments essentiels hautement assimilables et sélectionnés avec rigueur. Achetés séparément, ces nutriments reviendraient en moyenne à 185€ par mois. Et nous ne sommes pas prêts à faire des compromis de qualité ou de production pour réduire le prix !"
8. **Est-ce que Onday est vegan et sans gluten ?** — "Oui ! Onday est 100% vegan et sans gluten. Aucun ingrédient d'origine animale, et aucun allergène majeur. (Pour l'anecdote, la plupart des vitamines D disponibles sur le marché sont issues de laine de mouton et ne sont donc pas vegan. C'est pourquoi nous avons sélectionné une vitamine D issue de lichen boréal, 100% vegan et tout aussi efficace)."

## Responsive
- **Mobile (390px):** image hidden or shown small/cropped above the list; accordion full width.

## Notes
- Use shadcn `Accordion` component if present in the repo (`src/components/ui/accordion.tsx`); otherwise build a minimal local accordion with `useState`.
