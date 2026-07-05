# Routine Specification

## Overview
- **Target file:** `src/components/sections/Routine.tsx`
- **Interaction model:** static, id="routine" (anchor target for WhyOnday's CTA). Numbers/icons fade in on scroll.

## Layout
White or cream background, centered content, max-width ~1000px, padding 80px vertical. Heading centered, then a row of 4 steps (flex-row desktop with a connecting dashed/dotted line or arrow between them, stacked vertical on mobile), each step: circular icon badge (dark green bg, lime icon, ~64px) + step number small label + short instruction text below, centered.

## Content
- Heading (font-heading, dark green, ~32px): "La routine onday"
- Steps (numbered 1-4, centered text ~16px, dark green semi-bold for the action, e.g. "2 cuillères" bold + "de poudre" regular):
  1. "2 cuillères de poudre" — icon: scoop/spoon
  2. "250mL d'eau fraîche" — icon: water drop / glass
  3. "Secouez bien" — icon: shake/refresh arrows
  4. "Buvez, et profitez !" — icon: glass/cheers

## Responsive
- **Mobile:** steps stack vertically with a vertical dashed connector, icons same size.

## Assets
No specific downloaded images required — use simple lucide-react icons (e.g. `Utensils`/`Droplet`/`RotateCw`/`GlassWater`) colored lime `#e0ff0c` inside dark green `#003D2A` circular badges, since the original uses simple iconography here rather than photography.
