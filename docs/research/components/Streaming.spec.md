# Streaming Specification

## Overview
- **Target file:** `src/components/Streaming.tsx`
- **Interaction model:** time-driven (auto-cycling carousel) + click-driven (arrows)
- **Component type:** Client component (`"use client"`)

## Structure
Full-bleed dark-photo background. Centered heading, then a horizontal carousel that shows 5 cards at desktop, fewer at smaller breakpoints.

```
<section class="relative py-[120px] bg-cover bg-center" style={{ backgroundImage: `url(${STREAMING_BG})` }}>
  <div class="absolute inset-0 bg-secondary/80" />

  <div class="yo-container relative z-10 text-center mb-16">
    <span class="yo-subtitle text-white before:bg-primary">Now Streaming</span>
    <h2 class="yo-headline-split text-[48px] leading-none text-white w-full md:w-2/3 xl:w-1/2 mx-auto mt-5">
      Watch anything anytime <span class="light">anywhere instantly</span>
    </h2>
  </div>

  <div class="relative z-10 px-7 lg:px-12 xl:px-16">
    // For pixel-perfect parity with the 5-up owl carousel we use a horizontal scroll snap row + auto-advance
    <div ref={trackRef} class="overflow-hidden">
      <div class="flex gap-6 transition-transform duration-700 ease-out" style={{ transform: `translateX(-${active * cardW}px)` }}>
        for s in STREAMING_CARDS (loop = double the list):
          <div class="shrink-0 w-[calc((100%-4*1.5rem)/5)] min-w-[200px]">
            <div class="relative overflow-hidden rounded-md mb-3 group">
              <Image src={s.image} width={300} height={400} alt="" class="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" />
              <a href={STREAMING_VIDEO_HREF} target="_blank" rel="noreferrer"
                 class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
                <PlayIcon class="size-4" />
              </a>
            </div>
            <h4 class="text-white text-xl font-extrabold"><a href="#">{s.title}</a></h4>
          </div>
      </div>
    </div>
  </div>

  // optional decorative wave
  <span class="hidden md:block absolute right-0 bottom-10 w-40 h-40 border border-white/10 rounded-full"></span>
</section>
```

## Behavior
- Cards visible per breakpoint: 1 / 2 / 3 / 4 / 5 (sm/md/lg/xl)
- Auto-advance: `setInterval(() => setActive(i => i + 1), 4000)`
- When `active` reaches the end of the duplicated list, reset to 0 (modulo wrap)
- For simplicity: instead of a complex true-loop, just translate-X by `cardWidth + gap` each tick and snap back using duplicated list trick.

A pragmatic implementation: animate a CSS keyframe `marquee` on the flex track scrolling left, infinite linear, 30s duration. This gives a continuous slow drift without click controls — and looks great. Use this approach for v1:

```
<div class="flex gap-6 animate-marquee">
  [...STREAMING_CARDS, ...STREAMING_CARDS].map(...)
</div>
```

With keyframes:
```css
@keyframes yo-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.animate-marquee { animation: yo-marquee 30s linear infinite; }
```

Pick whichever fits your time budget — the marquee version is fine for visual parity.

## Computed styles
- Section padding: 120px top/bottom
- Overlay: `rgba(1,1,1,0.8)` over bg image
- Card title: 20px / weight 800 / color white
- Play button: 48×48 round, bg primary, transitions to white on hover

## Data
Import: `STREAMING_CARDS`, `STREAMING_BG`, `STREAMING_VIDEO_HREF` from `@/lib/content`.
Icons: `PlayIcon` from `@/components/icons`.
