# Newsletter (inline section) Specification

## Overview
- **Target file:** `src/components/sections/NewsletterSection.tsx`
- **Interaction model:** simple client-side form (no real backend — on submit just show a local success state, no network call).

## Layout
Full-bleed section, background lime `#e0ff0c`, centered content, max-width ~600px, padding ~64px vertical, text-align center.

## Content
- Heading (font-heading, dark green `#003D2A`, ~36px): "Rejoignez-nous !"
- Paragraph (dark green, ~15px): "Profitez de 10% offerts en vous inscrivant à notre newsletter : recevez des conseils nutrition pour prendre soin de vous au quotidien."
- Form row (centered, gap 12px, wraps on mobile): email input (white/transparent bg, rounded-full border dark green, placeholder "Votre email") + submit button (dark green bg, white text, rounded-full, small lime circular arrow-right icon): "Je m'inscris"

## Responsive
- **Mobile (390px):** input and button stack vertically, both full width.

## Notes
- This is the persistent inline section near the footer — distinct from the timed newsletter POPUP modal (that's a separate global overlay component, not built here).
