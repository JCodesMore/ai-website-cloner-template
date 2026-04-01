# Footer Specification

## Overview
- **Target file:** `src/components/Footer.tsx`
- **Interaction model:** Static
- **Screenshot:** `docs/design-references/footer.png`

## DOM Structure
```
.Footer (dark background)
  .FooterMain (4-column grid)
    .FooterCol1 (company info)
      img logo_negative_left.png
      p company name
      a (address with location icon)
      a (phone with phone icon)
      a (email with email icon)
      a (Facebook with fb_icon.svg)
      a (Instagram with instagram_icon.svg)
      a (LinkedIn with linkedin text icon)
    .FooterCol2 "ENLACES RÁPIDOS"
      nav links list
    .FooterCol3 "VECINDARIOS" (two-column)
      neighborhood links
    .FooterCol4 (legal text + copyright + real estate logos)
  .FooterBottom (dark, legal disclaimer)
```

## Computed Styles

### .Footer (wrapper)
- backgroundColor: rgb(18, 18, 18)
- color: rgb(255, 255, 255)
- fontFamily: Montserrat, sans-serif
- padding: 30px 0 0

### .FooterMain inner container
- maxWidth: 1188px
- margin: 0 auto
- display: grid
- gridTemplateColumns: ~280px 200px 1fr 280px
- gap: 40px
- padding: 0 20px 40px

### Company name text
- color: rgb(255, 255, 255)
- fontFamily: Montserrat, sans-serif
- fontSize: 14px
- fontWeight: 400
- marginBottom: 16px

### .FooterContacts (address, phone, email links)
- color: rgb(112, 112, 112)
- fontFamily: Montserrat, sans-serif
- fontSize: 16px
- fontWeight: 400
- display: flex
- alignItems: center
- gap: 8px
- marginBottom: 8px
- textDecoration: none

### Contact icons (small images)
- /images/s_location_footer.png (address icon, ~20px)
- /images/s_phone_footer.png (phone icon, ~20px)
- /images/s_letter_footer.png (email icon, ~20px)

### Social links in footer
- /images/fb_icon.svg + "Facebook" text → color rgb(112, 112, 112)
- /images/instagram_icon.svg + "Instagram" text → color rgb(112, 112, 112)
- LinkedIn icon + "LinkedIn" text → color rgb(112, 112, 112)

### .FooterBlockTitle (ENLACES RÁPIDOS, Vecindarios)
- fontFamily: gravesend-sans, sans-serif
- fontSize: 20px
- fontWeight: 700
- color: rgb(255, 255, 255)
- marginBottom: 10px
- textTransform: uppercase (for ENLACES RÁPIDOS)

### Quick links & neighborhood links
- color: rgb(112, 112, 112)
- fontFamily: Montserrat, sans-serif
- fontSize: 14px
- fontWeight: 400
- display: block
- marginBottom: 6px
- textDecoration: none
- textTransform: uppercase (quick links)

### Legal text (right column)
- color: rgb(112, 112, 112)
- fontFamily: Montserrat, sans-serif
- fontSize: 12px
- fontWeight: 400
- lineHeight: 1.6

### Copyright text
- color: rgb(112, 112, 112)
- fontFamily: Montserrat, sans-serif
- fontSize: 12px
- marginTop: 16px

## Text Content (verbatim)
- Company: "NG International Realty LLC (DBA SmartLuxe)"
- Address: "450 N. Park Road #801 Hollywood, FL 33021"
- Phone: "+1 305-760-4884"
- Email: "info@smartluxe.com"
- Quick links title: "ENLACES RÁPIDOS"
- Quick links: NUEVAS CONSTRUCCIONES, NOTICIAS RECIENTES, COMPRAR, VENDER, ACERCA, NUESTRO EQUIPO, CONTACTO, BÚSQUEDA, POLÍTICA DE PRIVACIDAD
- Neighborhoods title: "Vecindarios"
- Neighborhoods: Aventura, Bal Harbour, Bay Harbor Islands, Brickell, Coconut Grove, Coral Gables, Downtown, Fort Lauderdale, Hallandale / Hollywood, Miami Beach, Midtown / Edgewater, North Bay Village, Pompano Beach, South Beach, Sunny Isles Beach, Surfside
- Legal: "Las representaciones orales no pueden considerarse como declaraciones precisas del desarrollador. Para obtener información correcta, consulte los documentos requeridos por la sección 718.503 de los Estatutos de Florida, que deben ser proporcionados por el desarrollador al comprador o arrendatario. Las características y amenidades aquí representadas se basan en los planes de desarrollo actuales, los cuales están sujetos a cambios sin previo aviso."
- Copyright: "Smart Luxe, Copyright 2026."

## Assets
- Logo (white/negative): `/images/logo_negative_left.png`
- Location icon: `/images/s_location_footer.png`
- Phone icon: `/images/s_phone_footer.png`
- Email icon: `/images/s_letter_footer.png`
- Facebook icon: `/images/fb_icon.svg`
- Instagram icon: `/images/instagram_icon.svg`

## Responsive Behavior
- **Desktop:** 4-column grid layout
- **Mobile:** Stacked single column

## Notes
- The logo in footer is the white/negative version: logo_negative_left.png
- Two real-estate compliance logos at bottom right (Equal Housing Opportunity + REALTOR logos) — use placeholder icons or SVGs
