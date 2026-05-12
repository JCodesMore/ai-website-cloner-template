# WhyChooseUs Specification

## Overview
- **Target file:** `src/components/WhyChooseUs.tsx`
- **Interaction model:** static (hover on feature cards)
- **Component type:** Server component

## Structure
Three columns at lg+: 3 features (right-aligned text) on the left, illustration in the middle, 3 features (left-aligned text) on the right.

```
<section class="relative pt-[120px] pb-[120px] overflow-hidden">
  <div class="yo-container text-center mb-16 relative z-10">
    <span class="yo-subtitle">Why Choose Us</span>
    <h2 class="yo-headline-split text-[48px] leading-none w-full md:w-2/3 lg:w-1/2 mx-auto mt-5">
      Best internet facilities <span class="light">provider in town</span>
    </h2>
  </div>

  <div class="max-w-[1480px] mx-auto px-4">
    <div class="grid lg:grid-cols-12 items-center gap-y-12">
      // LEFT three features (text right-aligned at lg+)
      <div class="lg:col-span-4 space-y-12">
        for f in WHY_CHOOSE_LEFT:
          <div class="flex items-start gap-5 lg:flex-row-reverse lg:text-right lg:ml-12">
            <div class="relative shrink-0">
              <div class="relative size-[60px] flex items-center justify-center">
                <span class="absolute -right-3 -bottom-2 size-10 rounded-full bg-primary/10 -z-10"></span>
                <Image src={f.icon} width={50} height={50} alt="" />
              </div>
            </div>
            <div class="lg:mr-7">
              <h3 class="text-xl font-extrabold mb-2"><a href={f.href} class="hover:text-primary">{f.title}</a></h3>
              <p class="text-body">{f.description}</p>
            </div>
          </div>
      </div>

      // CENTER illustration
      <div class="lg:col-span-4 hidden lg:block">
        <Image src="/img/content/why-choose-us-01.png" width={500} height={620} alt="" class="mx-auto relative z-10" />
      </div>

      // RIGHT three features (text left-aligned)
      <div class="lg:col-span-4 space-y-12">
        for f in WHY_CHOOSE_RIGHT:
          <div class="flex items-start gap-5 lg:mr-12">
            <div class="relative shrink-0">
              <div class="relative size-[60px] flex items-center justify-center">
                <span class="absolute -left-3 -bottom-2 size-10 rounded-full bg-primary/10 -z-10"></span>
                <Image src={f.icon} width={50} height={50} alt="" />
              </div>
            </div>
            <div>
              <h3 class="text-xl font-extrabold mb-2"><a href={f.href} class="hover:text-primary">{f.title}</a></h3>
              <p class="text-body">{f.description}</p>
            </div>
          </div>
      </div>
    </div>
  </div>

  // why-choose-shape1 — large light/secondary triangle/wedge in background, sits behind illustration
  // For simplicity, render as a very light grey corner gradient using a CSS pseudo-element:
  <span class="hidden lg:block absolute right-0 top-[40%] w-[300px] h-[400px] bg-[#f8f9fa] -skew-y-12 -z-0"></span>

  // line-02 decorative red squiggle at bottom-left
  <Image src="/img/content/line-02.png" width={120} height={200} alt="" class="hidden sm:block absolute bottom-10 left-[5%] yo-anim-y" />
</section>
```

## Computed styles
- H3 (feature title): 20px / weight 800 / line-height 24px / color heading
- Icon halo: 40×40 rounded-full bg `rgba(223,3,3,0.10)` positioned bottom-right (left feature side: bottom-left; right feature side: bottom-right) of the icon
- Feature gap (between left/right groups): handled by space-y-12 (~48px)

## Responsive
- **lg+:** 4-4-4 grid with text alignment as above
- **md/sm:** stack to two columns then one, illustration hidden below lg, text always left-aligned, icons always on the left

## Data
Import: `WHY_CHOOSE_LEFT`, `WHY_CHOOSE_RIGHT` from `@/lib/content`.
Images: `/img/icons/icon-07..12.png`, `/img/content/why-choose-us-01.png`, `/img/content/line-02.png`.
