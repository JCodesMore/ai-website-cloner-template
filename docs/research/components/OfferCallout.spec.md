# OfferCallout Specification

## Overview
- **Target file:** `src/components/OfferCallout.tsx`
- **Interaction model:** static
- **Component type:** Server component

## Structure
Two-column 50/50 split. Left side is a dark bg card with heading + paragraph + icon-row + CTA. Right side is a photo with two red angular shape decorations.

```
<section class="py-0 relative">
  <div class="max-w-full px-0 lg:px-0">
    <div class="grid lg:grid-cols-2">
      // LEFT — dark card
      <div class="bg-secondary py-20 lg:py-28 xl:py-36 px-8 xl:px-16 rounded-[10px] relative">
        <div class="max-w-[480px] mx-auto">
          <h2 class="yo-headline-split text-[48px] leading-none text-white mb-6">
            {OFFER.title} <span class="light">{OFFER.highlight}</span>
          </h2>
          <p class="text-white/80 mb-7 text-base leading-[1.8]">{OFFER.paragraph}</p>

          <div class="flex items-center mb-7">
            <Image src={OFFER.icon} width={60} height={60} alt="" class="shrink-0" />
            <div class="ml-4">
              <h5 class="text-white font-extrabold">{OFFER.bullet1}</h5>
              <span class="text-white/80 text-sm">{OFFER.bullet2}</span>
            </div>
          </div>
          
          <a href="#about" class="yo-btn yo-btn-white">Get Started</a>
        </div>
      </div>

      // RIGHT — photo with red triangular shapes
      <div class="relative bg-cover bg-center rounded-[10px] min-h-[400px] lg:min-h-full"
           style={{ backgroundImage: `url(${OFFER.image})` }}>
        // offer-shape1 — red triangle top-right
        <span class="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-t-primary border-l-[100px] border-l-transparent"></span>
        // offer-shape2 — smaller red triangle a bit lower
        <span class="absolute top-[120px] right-0 w-0 h-0 border-t-[60px] border-t-primary/80 border-l-[60px] border-l-transparent"></span>
      </div>
    </div>
  </div>
</section>
```

## Computed styles
- Left card: padding 96px top/bottom desktop, 30px sides; bg `#010101`; border-radius 10px
- H2 white; paragraph white opacity 80
- Right column: full-height image, no overlay
- Triangles use CSS borders for the angular shape

## Responsive
- Stack to single column below lg; photo first, then card
- Reduce vertical padding to ~60px on mobile

## Data
Import: `OFFER` from `@/lib/content`.
