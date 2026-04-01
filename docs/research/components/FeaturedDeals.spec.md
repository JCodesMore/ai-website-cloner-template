# FeaturedDeals Specification

## Overview
- **Target file:** `src/components/FeaturedDeals.tsx`
- **Interaction model:** Static grid of property cards; each card has internal image carousel (slick slider)
- **Screenshot:** `docs/design-references/featured-deals.png`

## DOM Structure
```
.FeaturedSmartDeals (section)
  .GridMain
    a → (title link)
      h2 "Ofertas SMART destacadas" + gold underline divider
    br br
    .Grid (3-column responsive grid, last item is "Find More")
      .OfferParent (property card) × 7
      .OfferParent (find more button card) × 1
```

### Property Card (.OfferParent) structure:
```
.OfferParent
  .OfferTitle (overlay on image, shows location)
  .OfferLocation (below image, shows location)
  slick carousel (images)
    img (property photo from cloudfront CDN)
  .InfoRow
    .InfoRowItem "Dormitorios" + value
    .InfoRowItem "Baños" + value
    .InfoRowItem "Pie cuadrado" + value
    .InfoRowItem "Precio de lista:" + price
  deal badge image (smart_deal / great_deal / excellent_deal overlay, top-right)
  speedometer/gauge image
```

## Computed Styles

### Section wrapper
- backgroundColor: rgb(255, 255, 255)
- padding: ~40px 0

### Section title (h2)
- fontFamily: "Red Hat Display", sans-serif
- fontSize: 40px
- fontWeight: 700
- color: rgb(0, 0, 0)
- textAlign: center
- marginTop: 33px

### Gold underline divider (after title)
- width: 80px
- height: 3px
- backgroundColor: rgb(209, 159, 70)
- margin: 10px auto 30px

### .Grid (card grid)
- display: grid
- gridTemplateColumns: repeat(3, 1fr) on desktop, repeat(2, 1fr) on tablet, 1fr on mobile
- gap: 20px
- maxWidth: ~1188px
- margin: 0 auto
- padding: 0 20px

### .OfferParent (card)
- backgroundColor: rgb(255, 255, 255)
- border: 1px solid rgb(230, 230, 230)
- borderRadius: 4px
- overflow: hidden
- cursor: pointer

### Card image area
- position: relative
- height: ~220px
- overflow: hidden

### .OfferTitle (location on image)
- position: absolute
- bottom: 0
- left: 0
- right: 0
- backgroundColor: rgba(0,0,0,0.5)
- color: rgb(255, 255, 255)
- fontFamily: Montserrat, sans-serif
- fontSize: 16px
- fontWeight: 700
- padding: 8px 12px
- display: flex
- alignItems: center
- gap: 6px (pin icon + text)

### Location pin icon
- Image: /images/s_location_offer.png (small ~20px icon)

### Deal badge (smart_deal / excellent_deal)
- position: absolute
- top: 10px
- right: 10px
- width: ~90px
- zIndex: 10

### .InfoRow (stats grid below image)
- display: grid
- gridTemplateColumns: repeat(2, 1fr)
- gap: 12px
- padding: 16px 12px

### .InfoRowItem
- fontFamily: Montserrat, sans-serif
- fontSize: 13px
- fontWeight: 400
- color: rgb(90, 90, 90)
- display: flex
- flexDirection: column
- gap: 2px

### InfoRowItem value (span)
- fontSize: 15px
- fontWeight: 700
- color: rgb(0, 0, 0)

### Find More card (last .OfferParent)
- Has background image: /images/find_more_deals.jpg
- Contains centered button: "Encuentre Más Ofertas"
- Button: gold background rgb(209, 159, 70), borderRadius 23px, white text

## Property Data (7 cards)
1. Location: "Sunny Isles Beach, FL 33160", Beds: 4.0, Baths: 4.5, Sqft: 2682, Price: $3,990,000
   Images: /images/property1_1.jpeg, /images/property1_2.jpeg
2. Location: "Sunny Isles Beach, FL 33160", Beds: 3.0, Baths: 4.0, Sqft: 3312, Price: $1,890,000
   Images: /images/property2_1.jpeg, /images/property2_2.jpeg
3. Location: "Miami, FL 33132", Beds: 1.0, Baths: 1.5, Sqft: 865, Price: $415,000
   Images: /images/property3_1.jpeg, /images/property3_2.jpeg — badge: /images/excellent_deal_es.png
4. Location: "Miami, FL 33132", Beds: 1.0, Baths: 1.5, Sqft: 937, Price: $550,000
   Images: /images/property4_1.jpeg, /images/property4_2.jpeg
5. Location: "North Miami Beach, FL 33160", Beds: 2.0, Baths: 2.5, Sqft: 1999, Price: $1,095,000
   Images: /images/property5_1.jpeg, /images/property5_2.jpeg
6. Location: "Bay Harbor Islands, FL 33154", Beds: 3.0, Baths: 4.5, Sqft: 3075, Price: $3,995,000
   Images: /images/property6_1.jpeg, /images/property6_2.jpeg — badge: /images/smart_deal_es.png
7. Location: "Aventura, FL 33180", Beds: 2.0, Baths: 2.0, Sqft: 1181, Price: $295,000
   Images: /images/property7_1.jpeg, /images/property7_2.jpeg

## Labels (Spanish)
- "Dormitorios" (Bedrooms)
- "Baños" (Bathrooms)
- "Pie cuadrado" (Square Feet)
- "Precio de lista:" (List Price)
- "Encuentre Más Ofertas" (Find More Deals)

## Assets
- Location pin icon: `/images/s_location_offer.png`
- Smart deal badge: `/images/smart_deal_es.png`
- Great deal badge: `/images/great_deal_es.png`
- Excellent deal badge: `/images/excellent_deal_es.png`
- Find more bg: `/images/find_more_deals.jpg`

## Responsive Behavior
- **Desktop (1440px):** 3-column grid (3 cards + last row has 1 card + find more)
- **Tablet (768px):** 2-column grid
- **Mobile (390px):** Single column

## Implementation Notes
- Use Next.js `<Image>` for property photos
- Image carousel: implement as simple CSS-controlled slider or use the images as static (first image shown)
- No need to implement slick — show first image of each property statically
- The deal badge overlays top-right of the card image
