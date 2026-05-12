# AboutUs Specification

## Overview
- **Target file:** `src/components/AboutUs.tsx`
- **Interaction model:** static (video link opens external)
- **Component type:** Server component

## Structure
Two-column layout on light-gray background.

```
<section class="bg-[#f8f9fa] pt-[184px] pb-[120px] relative overflow-visible">
  <div class="yo-container">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      // LEFT column — image collage
      <div class="relative">
        <div class="text-center lg:text-right relative overflow-hidden">
          <Image src="/img/content/about-01.jpg" width={400} height={609} alt="" class="rounded-[10px] inline-block" />
          // about-shape1 (dark filled rect behind image right edge)
          <span class="absolute right-[50px] -bottom-20 w-[190px] h-[140px] bg-secondary rounded-[10px] -z-10"></span>
          // about-shape2 (outlined rect)
          <span class="absolute right-[55px] -bottom-12 w-[180px] h-[160px] border border-secondary/20 rounded-[10px] -z-10"></span>
        </div>
        // small overlapping secondary photo (about-02.jpg) — top-right
        <Image src="/img/content/about-02.jpg" width={300} height={262} alt="" class="hidden sm:block absolute top-[15%] right-0 rounded-[10px]" />
        // 28+ years experience badge — bottom-left
        <div class="absolute bottom-10 left-10 bg-white rounded-[10px] p-7 text-center shadow-lg">
          <h4 class="text-[80px] leading-none font-extrabold">28+</h4>
          <span class="text-body text-base">Years of experience</span>
        </div>
      </div>

      // RIGHT column — headline + checklist + video CTA
      <div class="pl-0 xl:pl-12">
        <h2 class="yo-headline-split text-[48px] leading-none mb-6">
          Discover a wider <span class="light">world of recreation facility</span>
        </h2>
        <p class="text-primary text-lg font-medium mb-3">Broadband provider offers a higher-speed of data transmission.</p>
        <p class="text-body mb-7">We've streamlined our plans to give you the fastest internet available at your address for one low monthly price.</p>
        for each feature in ABOUT_FEATURES:
          <div class="flex items-center mb-4 {feature.active ? 'about-list-active' : ''}">
            <CheckIcon class="size-6 text-primary" />
            <h4 class="ml-3 text-base font-extrabold">{feature.label}</h4>
          </div>
        // video CTA row
        <div class="mt-10 flex items-center gap-6">
          <a href={ABOUT_VIDEO.href} target="_blank" rel="noreferrer"
             class="relative w-[120px] h-[100px] rounded-[10px] border-2 border-primary bg-cover bg-center flex items-center justify-center"
             style={{ backgroundImage: `url(${ABOUT_VIDEO.poster})` }}>
            <PlayIcon class="size-7 text-primary" />
          </a>
          <div>
            <h4 class="text-lg font-extrabold">{ABOUT_VIDEO.name}</h4>
            <span class="text-sm text-body">{ABOUT_VIDEO.role}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  // line-01.png decorative red squiggle, top-right, animates vertically
  <Image src="/img/content/line-01.png" width={149} height={379} class="hidden xl:block absolute top-[-15%] right-[5%] yo-anim-y" alt="" />
</section>
```

## Computed styles
- Section bg: `#f8f9fa` (light)
- Section padding: 184px top, 120px bottom desktop; mobile shrink to 80px/64px
- about-shape1: 190×140, bg `#010101`, border-radius 10px, positioned BEHIND image bottom-right corner
- about-shape2: 180×160, 2px secondary border, border-radius 10px, positioned similarly
- Badge: white bg, 30.4px padding, 10px radius, soft shadow `0 6px 20px rgba(0,0,0,0.06)`
- "28+" number: uses h1 size (80px) but with line-height tight
- about-list-active background: light pink subtle? — Actually, per CSS the active class adds a small pink pill behind. For simplicity, render the active variant with `bg-primary/5 px-3 py-2 rounded-md -mx-3` so it gets a soft halo.
- Video play CTA: `border: 3px solid var(--primary)` around poster bg

## Responsive
- **Desktop (1440):** two-column, image left, content right
- **Tablet:** stack to single column, image first (centered, max-width 500)
- **Mobile:** stack, decorative shapes hidden, about-02.jpg hidden

## Data
Import: `ABOUT_FEATURES`, `ABOUT_VIDEO` from `@/lib/content`.
Icons: `CheckIcon`, `PlayIcon` from `@/components/icons`.
Images: `/img/content/about-01.jpg`, `about-02.jpg`, `about-03.jpg`, `/img/content/line-01.png`.
