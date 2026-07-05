# Footer Specification

## Overview
- **Target file:** `src/components/Footer.tsx`
- **Interaction model:** static, standard footer links (use `next/link`, hrefs can point to placeholder routes like `/pages/mission` — no need to build those destination pages).

## Layout
Full-bleed, background dark green `#003D2A`, white text, padding ~64px vertical / 32px horizontal, max-width ~1200px centered. Desktop: 4-column grid (tagline+social ~35%, "Onday" links, "Aide" links, language selector aligned right of those two link columns). Below the grid (full width): a large lime `#e0ff0c` "onday" wordmark logotype (reuse `LogoIcon` from `src/components/icons.tsx`, scaled up ~10x, `text-[#e0ff0c]`), then a bottom bar with copyright + legal links + contact email, separated by a dashed top border.

## Content
### Column 1 (tagline + social)
- "Soutenir vos vies bien remplies par une micronutrition française de précision" (white, ~20px, font-heading)
- Dashed horizontal divider
- Social icons row (lime `#e0ff0c` color): Facebook, Instagram, TikTok (use `lucide-react` `Facebook`, `Instagram` icons; for TikTok use a simple custom svg or omit if no exact icon available — do not fabricate an inaccurate icon, a music-note fallback is acceptable)

### Column 2 — "Onday"
- Nos ingrédients → `/pages/ingredients`
- Notre mission → `/pages/mission`
- Devenir ambassadeur → `/pages/ambassadeur`

### Column 3 — "Aide"
- Mon compte → `/account`
- FAQ → `/pages/faq`
- Contact → `/pages/contact`
- Demande de retour → `/pages/retour`
- Blog → `/blogs/news`

### Column 4 — language
- "FR" with a small France flag emoji or flag icon + chevron-down (static, non-functional dropdown affordance)

### Bottom bar (after the big logotype, small text, muted white/70%)
- "© 2024 ONDAY"
- "contact@onday.fr"
- Legal links inline: "CGV et mentions légales" · "Politique de confidentialité"

## Responsive
- **Mobile (390px):** columns stack vertically (tagline+social, then Onday links, then Aide links, then language), big logotype scales down proportionally, bottom bar wraps.
