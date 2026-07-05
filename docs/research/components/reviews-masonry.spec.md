# ReviewsMasonry Specification

## Overview
- **Target file:** `src/components/sections/ReviewsMasonry.tsx`
- **Interaction model:** static masonry-style grid (cards of varying height, CSS columns or grid with `row-span`), "Afficher plus d'avis" button at the bottom (can be a no-op / show-all toggle client-side — no real pagination backend to hit).

## Layout
White background, centered heading block, then a 4-column masonry grid (CSS `columns-4` with `break-inside-avoid` cards, gap ~20px) desktop; 1 column mobile. Padding 80px vertical, max-width ~1200px centered.

## Header content
- Heading (font-heading, dark green, centered, ~32px): "Ils ont sauté le pas"
- Subtext (gray, centered): "Découvrez ce que nos 5000 clients disent de nous."
- Trustpilot badge row (centered): "4,7 Excellent" (bold) + 5-star icon (`StarRatingIcon` from `src/components/icons.tsx`, or `/images/onday/stars-5.svg`)

## Card style
White bg, border `#dbd8d8` or subtle shadow, rounded-xl, padding ~20px. Top: 5 green stars (small, `#00b67a`). Bold uppercase title (dark green, ~14px). Quote paragraph (gray `#1a1a1a`/muted, ~14px, in "quotes"). Divider line. Bottom row: circular avatar with 2-letter initials (bg `#e1e8ea`, dark green text) + name (bold, ~14px) + small line "✓ Vérifié sur Trustpilot" (green check + gray text, ~12px).

## Content (8 reviews)
1. **TRÈS BON PRODUIT** — "Je prends Onday chaque matin depuis plusieurs semaines. Je m'entraîne de façon intensive et je supporte beaucoup mieux les grosses charges d'entraînement. Le produit est bio, ce qui est un vrai +. Le goût n'est ni bon ni mauvais, mais en tout cas, ce n'est pas difficile à boire." — Caro C. (CC)
2. **BLUFFANT** — "Enfin je ne subis plus mes journées ! C'est la première fois que j'ai un tel résultat sur mon état général. Sans parler de mes ongles qui ne cassent plus!" — Judith R. (JR)
3. **DÉJÀ 2 MOIS AVEC ONDAY** — "Déjà plus de deux mois avec Onday ! Courant plus de 100 km par semaine, j'avais besoin d'un complément alimentaire capable de subvenir à mes besoins quotidiens et c'est chose faite. Le produit est top : j'avais peur de retrouver le goût du thé matcha ou de la spiruline, mais au contraire, la boisson a un goût très naturel et agréable. C'est devenu un vrai rituel, hyper simple à prendre chaque matin. Je recommande à tous ceux qui veulent simplifier leur routine de compléments alimentaires !" — Jérémy S. (JS)
4. **SIMPLE ET EFFICACE** — "J'aime le site simple et efficace. Dialogue facile si problème ! Bon produit au goût neutre.. facile à prendre. Les résultats se sont fait sentir en un peu moins d'un mois.. je valide ses bienfaits." — Annick C. (AC)
5. **WHOUAAAA** — "Excellente expérience en dose d'essai. Du coup je me suis abonné au pack Doses+ boîte + gourde et je ne le regrette pas du tout...Pour voyager au Népal, cela me sera très utile pour ne manquer de rien niveau nutritionnel....Merciiii" — Stéphane M. (SM)
6. **EXCELLENT PRODUIT** — "Excellent produit ! Je suis client depuis 6 mois et Onday a changé mon quotidien ! Il vous apporte un réel confort intestinal ainsi qu'un véritable coup de boost pour votre journée. Un jour sans et la différence est flagrante… Un des gros points positifs est la personnalisation de la commande, si vous partez vous pouvez facilement changer d'adresse ou de formule pour vous adaptez au mieux. Je vous le conseil vivement, ce produit est vraiment top !" — Malko (M)
7. **EFFICACE ET BON** — "Ravi de mon expérience avec Onday. Dès la commande, tout est clair, professionnel et soigné. La livraison a été rapide. Au niveau du produit, la formule est top et très pratique au quotidien (j'avais auparavant plein de compléments différents, c'est beaucoup plus pratique de n'avoir plus qu'une seule solution :)) Concernant le goût : très agréable, facile à boire (je vous conseille de le boire très frais). Le packaging, les accessoires (gourde, cuillère doseuse, pot en inox) sont aussi hyper quali." — Arthur R. (AR)
8. **MERCI À ONDAY** — "Merci à Onday : livraison parfaite, packaging nickel. J'utilise quotidiennement Onday depuis 3 semaines et les effets positifs commencent à se faire sentir, notamment sur la régulation de mon sommeil." — Laurent B. (LB)

Below the grid: outlined pill button, centered: "Afficher plus d'avis"

## Responsive
- **Mobile (390px):** single column stack, same cards full width.
