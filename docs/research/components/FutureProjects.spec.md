# FutureProjects Specification

## Overview
- **Target file:** `src/components/FutureProjects.tsx`
- **Interaction model:** Static 3-column horizontal scrolling carousel with dot pagination
- **Screenshot:** `docs/design-references/future-projects.png`

## DOM Structure
```
.FeatureProducts (section)
  h2 "Proyectos Futuros" + gold divider
  slick carousel (3 cards visible at desktop, scrollable)
    project card × 7
    "Más Proyectos" card
```

### Project Card structure:
```
div.ProjectCard
  div (image container, position: relative)
    img (project photo, height: 250px)
    .Location badge (position: absolute, bottom-left)
      img (s_location_offer.png icon)
      span (neighborhood name)
  div (card body)
    h2.ProjectName (project name)
    .FeatureRow
      .Featuretitle "Tiempo de Entrega:" / "Completado:"
      .FeatureDescription (value, bold)
    .FeatureRow
      .Featuretitle "Precio Inicial:"
      .FeatureDescription (price, bold)
```

## Computed Styles

### Section container
- backgroundColor: rgb(255, 255, 255) or rgb(249, 249, 249) (light gray)
- padding: 40px 0 60px

### h2 section title
- fontFamily: "Red Hat Display", sans-serif
- fontSize: 40px
- fontWeight: 700
- color: rgb(0, 0, 0)
- textAlign: center

### Gold divider
- width: 80px, height: 3px
- backgroundColor: rgb(209, 159, 70)
- margin: 10px auto 40px

### Carousel track
- Shows 3 cards at desktop, 2 at tablet, 1 at mobile
- Cards have ~20px gap
- Dot indicators below (pagination dots)

### Project card
- width: ~350px (1/3 of ~1100px container with gaps)
- border: 1px solid rgb(220, 220, 220)
- borderRadius: 4px
- overflow: hidden
- backgroundColor: rgb(255, 255, 255)
- cursor: pointer

### Card image (top)
- width: 100%
- height: 250px
- objectFit: cover
- position: relative

### Location badge on image
- position: absolute
- bottom: 10px
- left: 10px
- backgroundColor: rgba(0,0,0,0.5)
- color: rgb(255, 255, 255)
- display: flex, alignItems: center, gap: 6px
- fontFamily: Montserrat, sans-serif
- fontSize: 14px
- fontWeight: 400
- padding: 4px 10px

### Location icon img
- src: /images/s_location_offer.png
- width: ~16px, height: ~16px

### .ProjectName (project name h2)
- fontFamily: gravesend-sans, sans-serif
- fontSize: 14px
- fontWeight: 700
- color: rgb(0, 0, 0)
- textTransform: uppercase
- padding: 12px 12px 0
- margin: 0

### .FeatureRow
- display: flex
- justifyContent: space-between
- alignItems: center
- padding: 4px 12px
- borderBottom: 1px solid rgb(240, 240, 240)

### .Featuretitle
- fontFamily: Montserrat, sans-serif
- fontSize: 14px
- fontWeight: 400
- color: rgb(90, 90, 90)

### .FeatureDescription
- fontFamily: Montserrat, sans-serif
- fontSize: 14px
- fontWeight: 700
- color: rgb(0, 0, 0)

### "Más Proyectos" button card
- Background image: /images/more_projects.jpg
- Contains "Más Proyectos" text button (gold, centered)
- height: 250px, same card width

## Project Data (7 projects)
1. Name: "EDITION RESIDENCES EDGEWATER", Neighborhood: "Midtown / Edgewater"
   Image: /images/project_edition.jpeg, Delivery: "Invierno 2030", Price: "$1,955,000"
2. Name: "COVE MIAMI", Neighborhood: "Midtown / Edgewater"
   Image: /images/project_cove.jpg, Delivery: "Primavera 2027", Price: "$1,380,000"
3. Name: "ONDA RESIDENCES", Neighborhood: "Bay Harbor, Miami"
   Image: /images/project_onda.jpg, Delivery label: "Completado:", Delivery: "Veranó 2024", Price: "$1,628,000"
4. Name: "1428 BRICKELL", Neighborhood: "Brickell"
   Image: /images/project_1428brickell.jpeg, Delivery: "Veranó 2027", Price: "$3,000,000"
5. Name: "ARMANI/CASA RESIDENCES POMPANO BEACH", Neighborhood: "Pompano Beach"
   Image: /images/project_armani.png, Delivery: "Invierno 2028", Price: "$5,000,000"
6. Name: "NATIIVO Fort Lauderdale", Neighborhood: "Fort Lauderdale"
   Image: /images/project_natiivo.jpg, Delivery: "Invierno 2029", Price: "$594,000"
7. Name: "AVENIA", Neighborhood: "Aventura"
   Image: /images/project_avenia.png, Delivery: "Invierno 2029", Price: "$5,250,000"

## Assets
- Location pin: `/images/s_location_offer.png`
- More projects bg: `/images/more_projects.jpg`

## Responsive Behavior
- **Desktop (1440px):** 3 cards visible
- **Tablet (768px):** 2 cards visible
- **Mobile (390px):** 1 card visible, swipeable

## Implementation Notes
- Implement as a simple horizontal scroll container or use CSS scroll snapping
- Show 3 cards on desktop with overflow hidden, add previous/next arrows OR just show all 3+ scrollable
- Dot navigation below the carousel
- The "Más Proyectos" tile at end has background image with button overlay
