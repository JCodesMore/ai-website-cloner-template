# Behaviors — help.hbomax.com

## Scroll behavior
- **Standard browser scroll** — no Lenis, Locomotive Scroll, or smooth-scroll library detected (`hasLenis: false`, `hasLocomotive: false`).
- Header has `.AtTop` class but stays fixed with same bg (`#252525`). No scroll-trigger transitions observed since page fits viewport at desktop.
- Body fits viewport (~1415px document, ~1297px viewport at 1440 target).

## Click behavior
- Navigation links route to other help pages (`/us/Answer/Detail/...`, `/us/Category/Detail/...`)
- Alert close (X) hides the banner
- Search input submits on Enter to `/us/Home/Search`
- Contact Us floating button opens contact form (standard link)
- Globe/country/language dropdowns: present but region-switcher UI not opened during recon

## Hover behavior (observed defaults)
- Links: cursor pointer, color is already set; likely underline on hover (standard)
- Cards: no transform observed on hover at first glance (subtle — may add shadow elevation)
- Buttons: default button hover state

## Animations / transitions
- None observed. Page is largely static.

## Responsive (to-verify)
- Desktop 1440: 4 topic cards across in 2×2 layout (two `.CategoryGroup` each holding 2 cards)
- Mobile 390: cards likely stack to 1 per row, side gutters collapse

## Misc
- Chat widget (third-party `.vw-...` elements) floats bottom-right — **out of scope** for clone
- Cookie consent banner (OneTrust cookielaw.org) — **out of scope** for clone
- The alert banner X close triggers a state change (toggled display) — implement as local React state
