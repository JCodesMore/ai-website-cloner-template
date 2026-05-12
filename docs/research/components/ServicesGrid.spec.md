# ServicesGrid Specification

## Overview
- **Target file:** `src/components/ServicesGrid.tsx`
- **Interaction model:** static (hover effects only)
- **Component type:** Server component

## Structure
Section sits below the hero with negative top margin so the cards overlap the hero bottom slightly.

```
<section class="relative overflow-visible -mt-16 lg:-mt-24 z-10">
  <div class="yo-container">
    <div class="grid lg:grid-cols-12 gap-0 items-center">
      // heading column (lg:col-span-4)
      <div class="lg:col-span-4 pb-10 lg:pb-0 px-5">
        <span class="yo-subtitle">Our Services</span>
        <h2 class="yo-headline-split text-[48px] leading-none mt-5">
          Explore our <span class="light">best services</span>
        </h2>
      </div>
      // cards column (lg:col-span-8)
      <div class="lg:col-span-8 grid md:grid-cols-2">
        for each service:
          <a class="card-style1 group block p-[50px] rounded-md transition-colors {active ? 'bg-primary/5' : 'hover:bg-primary/5'}">
            <div class="relative w-fit mb-4">
              <Image src={service.icon} width={60} height={60} alt="" class="relative z-10" />
              <span class="absolute -right-4 -bottom-2 w-10 h-10 rounded-full bg-primary/15 z-0"></span>
            </div>
            <h3 class="text-2xl font-extrabold mb-4 text-heading group-hover:text-primary transition-colors">{service.title}</h3>
            <p class="text-body leading-[1.7]">{service.description}</p>
          </a>
      </div>
    </div>
  </div>
  // decorative ambient: red dot bottom-left, outlined dot top-left (`yo-anim-x`, `yo-anim-drift`)
</section>
```

## Computed styles
- Card padding: 50px
- Card border-radius: 6px
- Card background (active or hovered): `rgba(223, 3, 3, 0.05)`
- Card transition: `background 0.3s ease, transform 0.3s ease`
- H3 (card title): 24px / weight 800 / line-height 28.8px / color `#232323`
- Card body text color: `#42545e` (per body)
- Icon wrap: 60×60 (PNG), round-shape pink halo is `42×42 background rgba(223,3,3,0.12) border-radius 999px` positioned bottom-right of icon
- Heading subtitle has left red bar (5px wide, 24px tall)

## Behavior
- First card has `active` flag set: render with pink background by default
- Hover any card: apply pink background, lift the title color to primary
- No active-state toggle on click — purely decorative

## Decorative
- Below the cards: a 12×12 red dot absolute bottom-32 left-8 (`yo-anim-x`)
- A 12×12 bordered transparent square top-32 left-16 (`yo-anim-drift`)
- Both `hidden sm:block`

## Data
Import: `SERVICES` from `@/lib/content`. Icons: PNGs at `/img/icons/icon-01.png` through `icon-04.png`.
