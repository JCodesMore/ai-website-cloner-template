# ExpertsTestimonials Specification

## Overview
- **Target file:** `src/components/sections/ExpertsTestimonials.tsx`
- **Interaction model:** carousel, auto-rotating (slow, ~4s per step) + likely swipeable; no visible arrow controls needed but feel free to add subtle ones. Loops infinitely (text content repeats when scrolled past the end on the live site, confirming a loop).

## Layout
Full-bleed section, background dark green `#003D2A`. Centered small uppercase label above heading: "APPROUVÉ PAR LES PLUS EXIGEANTS". Heading centered, white, with the last word in italic HAL Timezone: "Ils ont tous choisi **_onday_**". Below: a horizontally scrolling row of testimonial cards (~4 visible on desktop, 1.2 on mobile), each ~280px wide, aspect ~3:4, rounded-2xl, photo background with dark gradient scrim at bottom holding the quote text (white, ~14px, italic-free, in quotes), name (semibold white) and role (small pill, translucent dark bg, white text, rounded-full).

## Content (13 testimonials, in order — loop back to start after the last)
1. Nathan Guerbeur — Triathlète Professionnel — "Entre les trois disciplines, mon corps est mis à rude épreuve. Onday m'assure une énergie constante et une récupération optimale." — image `/images/onday/Natahan_Guerbeur.png`
2. Mathilde Benoit — Volleyeuse Professionnelle — "L'exigence du haut niveau demande une routine sans faille. Le rituel Onday est devenu mon allié quotidien." — image `/images/onday/Mathilde_Benoit_1.png`
3. Clarisse Sousa — Diététicienne D.E Nutritionniste — "Une formulation pointue et parfaitement dosée pour une prise long-terme. Je recommande cette synergie d'actifs à mes patients." — image `/images/onday/Clarisse_Sousa.png`
4. Fred Fugen — Champion du Monde de Parachutisme — "En vol, la moindre erreur ne pardonne pas. Onday m'aide à garder concentration extrême et condition physique irréprochable." — image `/images/onday/Fred_Fugen.png`
5. Hannah Romao — CEO de TheLyfe & Créatrice de contenus — "Ma journée file à 100 à l'heure. Ce geste simple est devenu mon pilier bien-être et longévité pour rester au top de ma forme." — image `/images/onday/Hannah_Romao.png`
6. Louis Margot (Human Impulse) — Athlète & Aventurier — "Lors de mes expéditions, chaque gramme compte. Avoir 43 nutriments essentiels dans une seule boisson est un atout inestimable." — image `/images/onday/Louis_Margot.png`
7. Antoine Soave — Rugbyman Professionnel — "Concilier rugby pro et vie de papa demande une énergie folle. Onday est mon allié pour assurer sur le terrain comme à la maison." — no photo found, use a neutral initials avatar
8. Laurence Fugen — Championne du Monde de Parachutisme — "Les sports extrêmes pompent beaucoup d'énergie. J'ai enfin trouvé le complément idéal pour soutenir mon corps au fil des sauts." — image `/images/onday/Laurence_Fugen.png`
9. Patrick Legrand — Médecin en Traumatologie du Sport — "Un corps bien nourri est un corps qui se blesse moins. Cette formule ultra-complète est un excellent bouclier pour l'organisme." — image `/images/onday/Patrick_Legrand.png`
10. François Fontaine — Rugbyman Professionnel — "Sur le terrain ou en coaching, je dois être à 200%. C'est le seul complément que je prends chaque matin pour encaisser les chocs." — image `/images/onday/Francois_fontaine.png`
11. Sylvie Gagean-Mauffré — Docteure en Pharmacie, DU en Nutrition — "Je suis très exigeante sur la qualité des compléments. Ici, la biodisponibilité et le choix des 43 actifs sont remarquables." — image `/images/onday/Sylvie_Mauffre_e2250266-62a5-4341-97df-ca5f816878ec.png`
12. Delphine Grobotek — Championne de France d'Haltérophilie — "En tant qu'athlète et coach, je ne laisse rien au hasard. Les 43 actifs de cette formule optimisent ma force et ma récupération." — no photo found, use a neutral initials avatar
13. Christophe Journet — Athlète Multidisciplinaire — "Entre compétitions et marathons, j'ai besoin d'un soutien fiable pour nourrir mon endurance et protéger mon socle métabolique." — no photo found, use a neutral initials avatar

## Responsive
- **Mobile (390px):** 1 card + peek, same content/order.

## Notes
- Implement autoplay via `setInterval` scrolling the container by one card width, pausing on hover/touch. Client component.
- For the 3 testimonials without a downloaded photo, render a simple circular avatar with the person's initials on a `#e1e8ea` background — do not fabricate a stock photo.
