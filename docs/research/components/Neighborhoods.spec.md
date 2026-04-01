# Neighborhoods Specification

## Overview
- **Target file:** `src/components/Neighborhoods.tsx`
- **Interaction model:** Horizontal scrolling carousel with prev/next arrows
- **Screenshot:** `docs/design-references/neighborhoods.png`

## DOM Structure
```
.Neighborhoods (section, light gray background)
  h2 "Vecindarios" + gold divider
  slick carousel
    NeighborhoodCard × 16
      img (neighborhood photo)
      div (neighborhood name)
```

## Computed Styles

### Section
- backgroundColor: rgb(245, 245, 245) or rgb(249, 249, 249) (light gray, different from white)
- padding: 40px 0

### h2 section title
- fontFamily: "Red Hat Display", sans-serif
- fontSize: 40px
- fontWeight: 700
- color: rgb(0, 0, 0)
- textAlign: center

### Gold divider
- width: 80px, height: 3px
- backgroundColor: rgb(209, 159, 70)
- margin: 10px auto 30px

### Neighborhood card
- width: ~160px
- cursor: pointer
- textAlign: center
- overflow: hidden

### Card image
- width: 100%
- height: ~120px
- objectFit: cover
- borderRadius: 4px

### Card name text
- fontFamily: Montserrat, sans-serif
- fontSize: 14px
- fontWeight: 600
- color: rgb(0, 0, 0)
- textAlign: center
- padding: 8px 0 4px

## Neighborhoods Data (16 items)
1. Pompano Beach → /images/neighborhood_pompano.jpg
2. South Beach → /images/neighborhood_south_beach.jpg
3. Sunny Isles Beach → /images/neighborhood_sunny_isles.jpg
4. Surfside → /images/neighborhood_surfside.jpg
5. Aventura → /images/neighborhood_aventura.jpg
6. Bal Harbour → /images/neighborhood_bal_harbour.jpg
7. Bay Harbor Islands → /images/neighborhood_bay_harbor.jpg
8. Brickell → /images/neighborhood_brickell.jpg
9. Coconut Grove → /images/neighborhood_coconut_grove.jpg
10. Coral Gables → /images/neighborhood_coral_gables.jpg
11. Downtown → /images/neighborhood_downtown.jpg
12. Fort Lauderdale → /images/neighborhood_fort_lauderdale.jpg
13. Hallandale / Hollywood → /images/neighborhood_hollywood.jpg
14. Miami Beach → /images/neighborhood_miami_beach.jpg
15. Midtown / Edgewater → /images/neighborhood_edgewater.jpg
16. North Bay Village → /images/neighborhood_north_bay.jpg

## Responsive Behavior
- **Desktop:** Shows ~6-7 neighborhood cards per row (scrollable)
- **Mobile:** Shows 3 cards per row, carousel scrolls

## Implementation Notes
- Implement as a flex row with overflow-x: scroll and snap
- Or show all 16 in a responsive grid (4-5 columns desktop, 3 mobile)
- Simple: show in a horizontally scrollable row with styled scrollbar hidden
