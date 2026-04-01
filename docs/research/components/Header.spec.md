# Header Specification

## Overview
- **Target file:** `src/components/Header.tsx`
- **Interaction model:** Static layout with sticky nav on scroll (the .HeaderBottomPart becomes sticky at top on scroll)
- **Screenshot:** `docs/design-references/header.png`

## DOM Structure
```
.TopHeader
  .HeaderMain (desktop only, hidden on mobile)
    .HeaderTopLine (white bar: logo left, social icons + language right, "Impulsado por Smart Luxe AI" right)
    .HeaderBottomPart (black nav bar: nav links centered)
    .HeaderBottomPart (sticky version, same content, becomes visible on scroll)
  .HeaderMainMobile (mobile only, white bg)
    .HeaderTop
      logo + hamburger
```

## Computed Styles (exact from getComputedStyle)

### .HeaderTopLine (top white bar)
- backgroundColor: rgb(255, 255, 255)
- color: rgb(0, 0, 0)
- fontFamily: Montserrat, sans-serif
- fontSize: 16px
- display: flex
- alignItems: center
- justifyContent: space-between
- padding: ~10px 0 (estimated from visual)
- maxWidth: 1188px, centered

### Logo image
- src: /images/logo_positive_center.svg
- height: approximately 60px
- Display: block

### Social icons in header top
- Facebook: /images/fb_black_icon.svg
- Instagram: /images/instagram_black_icon.svg  
- LinkedIn: /images/linkedin_icon.svg
- Separator between: "|" text in rgb(0,0,0)

### Language switcher
- "EN | ES | PT" text links
- Active (ES): bold/darker
- fontFamily: Montserrat, sans-serif
- fontSize: 14px

### "Impulsado por Smart Luxe AI" text
- color: rgb(0, 0, 0) for "Impulsado por "
- "Smart Luxe AI" link: color rgb(209, 159, 70) (gold)
- fontFamily: Montserrat, sans-serif
- fontSize: 14px

### .HeaderBottomPart (black nav bar)
- backgroundColor: rgb(18, 18, 18)
- color: rgb(255, 255, 255)
- display: flex
- justifyContent: center
- alignItems: center
- padding: 0

### Nav links (inside HeaderBottomPart)
- fontFamily: gravesend-sans, sans-serif
- fontSize: 16px
- fontWeight: 500
- lineHeight: 30px
- color: rgb(255, 255, 255)
- padding: 0px 15px
- textTransform: uppercase
- Separator between links: "|" in rgb(255,255,255)

## Nav Items (verbatim)
- NUEVAS CONSTRUCCIONES → /projects
- VECINDARIOS → /neighborhoods
- COMPRAR → /find-my-deal
- VENDER → /sell
- ACERCA → /about
- NUESTRO EQUIPO → /team
- CONTACTO → /contact

## States & Behaviors

### Sticky Nav
- **Trigger:** When user scrolls down past the HeaderTopLine (~90px)
- **State A (before):** Both HeaderTopLine and HeaderBottomPart visible normally in flow
- **State B (after):** HeaderBottomPart becomes position: fixed, top: 0, width: 100%, zIndex: 1000; logo (smaller, white variant) appears in nav
- **Transition:** No animation, instant
- **Implementation:** useEffect with scroll listener; add 'scrolled' class to nav after scrollY > 90

### Scrolled nav logo
- When scrolled, a small white logo appears left-aligned in the black nav bar
- Logo: /images/logo_negative_no_text.png or similar (the negative/white version)

## Assets
- Logo (color): `/images/logo_positive_center.svg`
- Logo (white, scrolled): `/images/logo_negative_no_text.png`
- FB icon: `/images/fb_black_icon.svg`
- Instagram icon: `/images/instagram_black_icon.svg`
- LinkedIn icon: `/images/linkedin_icon.svg`

## Text Content
- Top bar right: "Impulsado por Smart Luxe AI"
- Nav items: NUEVAS CONSTRUCCIONES | VECINDARIOS | COMPRAR | VENDER | ACERCA | NUESTRO EQUIPO | CONTACTO
- Language: EN | ES | PT

## Responsive Behavior
- **Desktop (1188px+):** .HeaderMain shown, .HeaderMainMobile hidden
- **Mobile:** .HeaderMainMobile shown (white bar with logo + hamburger), .HeaderMain hidden
- The full nav becomes a hamburger menu on mobile
