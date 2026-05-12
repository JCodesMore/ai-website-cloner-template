# HeroBanner Specification

## Overview
- **Target file:** `src/components/HeroBanner.tsx`
- **Interaction model:** time-driven (auto-cycling slides, 7s each) + click-driven (arrow buttons)
- **Component type:** Client component

## Structure
A full-bleed section, 750px tall on desktop (`min-height: 100vh` is original — clamp to `min-h-[750px]` to avoid going taller than necessary).

Each slide is an absolute-positioned `<div>` stacked, with `opacity` controlled by active state.

```
<section class="relative h-[750px] overflow-hidden">
  for each slide:
    <div absolute inset-0 bg-[url] bg-cover bg-center>
      <div absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent />  // left overlay secondary
      <div container max-w-1320 mx-auto px-... flex items-center h-full relative z-10>
        <div max-w-[700px]>
          <h1 yo-headline-split text-white text-[80px] leading-none>
            heading <span class="light">{highlight}</span>
          </h1>
          <p text-white/80 text-[17.6px] leading-[1.7] mt-7 mb-9 max-w-[560px] hidden md:block>{intro}</p>
          <div flex gap-3>
            <a yo-btn yo-btn-primary>Read More</a>
            <a yo-btn yo-btn-outline-white>Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  
  // arrow nav (only xl+)
  <button absolute left-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-primary/70 text-white hidden xl:flex>
    <ArrowLeftIcon />
  </button>
  <button absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-primary/70 text-white hidden xl:flex>
    <ArrowRightIcon />
  </button>
  
  // decorative elements (banner-shape1, banner-shape2 + ambient dots)
  // banner-shape1: red rounded-rect (10px radius), 320×270, absolute, right ~ -8% top ~10%
  // banner-shape2: outline rounded-rect (border 2px rgba(255,255,255,0.4)), 420×360, slightly behind shape1
  // small red square 30×30 absolute bottom-12 left-12
  // outlined square 50×50 absolute bottom-24 left-24
  // small red dot ani-move absolute bottom-1/4 right-[20%]
  // small white dot ani-move absolute top-[20%] left-[15%]
</section>
```

## Computed styles
- Section: relative, height 750px desktop, overflow-hidden
- H1 (display-1): 80px / 80px / weight 800 / letter-spacing -2px / color white / margin-bottom 30.4px
- Hero intro: 17.6px / 29.92px / color white / margin-bottom 35.2px
- Buttons: standard `.yo-btn` height 43px

### banner-shape1
- 320×270px, background rgb(223, 3, 3), border-radius 10px
- position: absolute, top 82.5px, right -112px (peeks off screen). Animated up/down (use `yo-anim-y` class).
- Only show at xl breakpoint (`hidden xl:block`)

### banner-shape2
- 420×360px, border 2px solid rgba(225,225,225,0.4), border-radius 10px (transparent fill)
- position: absolute, top -22px, right -98px
- Only show at lg+ (`hidden lg:block`)

### Decorative ambient elements
- A red rounded square (40×40, border-radius 5px, bg primary), bottom-32 left-8 (`hidden sm:block`)
- A bordered transparent square (40×40, 1px border, border-radius 5px), bottom-12 left-12
- A small red dot (16×16, rounded full, bg primary), bottom-1/4 right-[18%], `yo-anim-drift`
- A small white dot (16×16, rounded full, bg white), top-[20%] left-[15%], `yo-anim-drift`

## Behavior
- Auto-advance: `setInterval(() => setActive(i => (i+1) % 3), 7000)` in useEffect
- Transition between slides: `opacity` over 0.9s, with `transition-opacity duration-[900ms] ease`
- Arrow buttons: `setActive(i => (i+slides.length+dir) % slides.length)` where dir is ±1
- Clicking arrow restarts the 7s timer (clearInterval + setInterval again)

## Left overlay gradient
The original uses `left-overlay-secondary` data-overlay-dark="8" which renders as:
`background: linear-gradient(-90deg, transparent 0%, rgba(1,1,1,0.8) 65%)`
(left side dark, right side reveals image). Mirror with Tailwind:
`bg-gradient-to-r from-black/85 from-30% via-black/40 via-60% to-transparent`

## Responsive
- **1440px (desktop):** H1 80px, both decorative shapes visible
- **768px (tablet):** H1 ~56px (`md:text-[56px]`), banner-shape1 hidden, banner-shape2 hidden
- **390px (mobile):** H1 ~40px (`text-[40px]`), buttons stack? — keep horizontal but smaller padding
- Arrow nav hidden below xl

## Data
Import: `HERO_SLIDES` from `@/lib/content`. Icons: `ArrowLeftIcon`, `ArrowRightIcon` from `@/components/icons`.

Images: `/img/banner/banner-01.jpg`, `banner-02.jpg`, `banner-03.jpg` (~1920×1080 each). Use `next/image` with `fill` and `priority` on the active slide (or just on banner-01 — first slide).
