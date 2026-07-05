# BenefitSwitch Specification

## Overview
- **Target file:** `src/components/sections/BenefitSwitch.tsx`
- **Interaction model:** click-to-expand accordion for each of the 8 numbered claims (plus icon toggles, reveals the scientific substantiation text). The "off/on" graphic overlay is decorative/static (not interactive itself — just a visual toggle illustration).

## Layout
Full-bleed black & white photo background (~500px tall), a decorative "off [pill toggle] on" graphic centered (white text "off", a small rounded pill toggle switch with a lime `#e0ff0c` circle, italic white "on"), sized ~140px wide toggle, text ~32px. Directly below, an 8-row accordion list on a dark green `#003D2A` background, two-column layout on desktop (4 rows left, 4 rows right) collapsing to 1 column on mobile. Each row: small superscript number + claim label (white, ~16px) + "+" icon button (white, thin stroke) right-aligned, bottom border translucent white/10.

## Assets
Background photo: `/images/onday/Effets_Mobile_b105ab2f-3c39-4c30-9ea6-f4ea2362d355.png` or `/images/onday/Site_image_toggle.png` (pick whichever is the black-and-white runner/canyon landscape photo).

## Content (8 claims, each expands to reveal its substantiation text)
1. **Énergie** — "Les vitamines B1, B2, B3, B5, B6, B8, B12, C et le magnésium contribuent à un métabolisme énergétique normal. L'ashwagandha et le ginseng aident à se sentir plus énergique."
2. **Immunité** — "Les vitamines B6, B9, B12, D, C, le sélénium et le zinc contribuent au fonctionnement normal du système immunitaire."
3. **Sommeil** — "Les vitamines B2, B3, B5, B6, B9, B12, C et le magnésium contribuent à réduire la fatigue. L'ashwagandha contribue à l'endormissement."
4. **Digestion** — "Le gingembre favorise la digestion et le fonctionnement normal de l'estomac, ce qui participe au bien-être digestif. Le chardon-marie soutient la digestion."
5. **Stress** — "L'ashwagandha possède des propriétés adaptogènes qui aident l'organisme à faire face au stress et favorisent la stabilité émotionnelle."
6. **Glycémie** — "Le chrome, le zinc et le ginseng contribuent au maintien d'une glycémie normale."
7. **Peau** — "Les vitamines B2, B3, B8 et le zinc contribuent au maintien d'une peau normale. La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale des os, cartilages, gencives, peau, dents."
8. **Focus** — "Les vitamines B1, B3, B6, B8, B12, C et le magnésium contribuent à des fonctions psychologiques normales. L'ashwagandha et le ginseng contribuent à une activité mentale et cognitive optimale."

## Responsive
- **Mobile (390px):** single column list, photo section height reduces to ~320px, toggle graphic scales down (~100px wide).

## Notes
- Client component, `useState` for which row(s) are expanded (allow multiple open at once, independent accordion rows — no evidence on the live site that opening one closes another).
