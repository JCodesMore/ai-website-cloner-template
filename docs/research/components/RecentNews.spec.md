# RecentNews Specification

## Overview
- **Target file:** `src/components/RecentNews.tsx`
- **Interaction model:** Static 3-card news section (2 large + 1 smaller card)
- **Screenshot:** `docs/design-references/recent-news.png`

## DOM Structure
```
.MoreArticles (section, white background)
  h2 "Noticias Recientes" + gold divider
  .ArticlesGrid (flex/grid layout)
    ArticleCard × 3
      div.ImageWrapper (relative)
        img (news photo)
        .DateBadge (date overlay on image bottom-left)
          img icon_date_white.svg
          span "31 de marzo de 2026"
      div.CardBody
        .ArtName (title, bold)
        .ArtP (excerpt text)
        button.Button "Leer Más"
```

## Computed Styles

### Section
- backgroundColor: rgb(255, 255, 255)
- padding: 60px 0

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

### Articles grid
- display: flex
- gap: 24px
- maxWidth: ~900px
- margin: 0 auto
- flexWrap: wrap
- justifyContent: center

### Article card
- backgroundColor: rgb(255, 255, 255)
- border: 1px solid rgb(230, 230, 230)
- borderRadius: 4px
- overflow: hidden
- width: ~380px (first two cards side by side)
- cursor: pointer

### Card image
- width: 100%
- height: ~200px
- objectFit: cover
- position: relative

### Date badge (on image, bottom-left)
- position: absolute
- bottom: 10px
- left: 10px
- display: flex
- alignItems: center
- gap: 6px
- color: rgb(255, 255, 255)
- fontFamily: Montserrat, sans-serif
- fontSize: 14px
- img (icon_date_white.svg, ~16px)

### Card body
- padding: 20px 24px

### .ArtName (article title)
- fontFamily: Montserrat, sans-serif
- fontSize: 20px
- fontWeight: 700
- color: rgb(0, 0, 0)
- marginBottom: 30px

### .ArtP (excerpt)
- fontFamily: Montserrat, sans-serif
- fontSize: 16px
- fontWeight: 400
- color: rgb(0, 0, 0)
- marginBottom: 20px

### "Leer Más" button
- backgroundColor: rgb(209, 159, 70)
- border: 1px solid rgb(209, 159, 70)
- borderRadius: 23px
- color: rgb(255, 255, 255)
- fontFamily: Montserrat, sans-serif
- fontSize: 17px
- fontWeight: 700
- padding: 10px 30px
- width: 100%
- cursor: pointer

## News Data (3 articles)
1. Date: "31 de marzo de 2026"
   Image: /images/news1.webp
   Title: "The Perigon Miami Beach alcanza su altura máxima: La primera nueva torre frente al mar de este ciclo en completarse estructuralmente"
   Excerpt: "The Perigon Miami Beach ha alcanzado oficialmente su altura máxima de 17 pisos en el 5333 Collins Avenue, en la sección Mid-Beach de Miami Beach..."
   
2. Date: "30 de marzo de 2026"
   Image: /images/news2.jpg
   Title: "La Torre Este de Oasis Hallandale alcanza su altura máxima"
   Excerpt: "La Torre Este de Oasis Hallandale ha alcanzado oficialmente su punto máximo de 25 pisos, marcando el hito vertical final para el componente residencial de este extenso desarrollo de uso mixto de 10 acres."

3. Date: (visible in image)
   Image: /images/news3.jpg
   Title: "7200 Collins en North Beach inicia construcción con el 93% de sus unidades vendidas"
   Excerpt: "El desarrollador Northlink Capital ha comenzado oficialmente la construcción de 7200 Collins, un proyecto residencial de lujo de 12 pisos ubicado en el vecindario de North Beach en Miami Beach."

## Assets
- Date icon: `/images/icon_date_white.svg`

## Layout
- First two articles side by side (2-column)
- Third article centered below (single card, centered)
- At mobile: all stack vertically

## Responsive Behavior
- **Desktop:** 2 articles side by side, 1 below centered
- **Mobile:** All 3 stacked vertically, full width
