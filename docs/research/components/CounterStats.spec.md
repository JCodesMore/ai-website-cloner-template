# CounterStats Specification

## Overview
- **Target file:** `src/components/CounterStats.tsx`
- **Interaction model:** scroll-triggered (counters animate from 0 → target when in viewport)
- **Component type:** Client component (`"use client"`) — IntersectionObserver + setInterval

## Structure
Full-bleed red band, 4 stats arranged horizontally on desktop.

```
<section class="bg-primary relative overflow-hidden py-[120px]">
  <div class="yo-container relative z-10">
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
      for each counter:
        <div class="flex items-start gap-5">
          <h3 class="text-[40px] font-extrabold text-white leading-none whitespace-nowrap"><CountUp value={counter.value} /></h3>
          <span class="text-white leading-tight">{counter.label1}<br />{counter.label2}</span>
        </div>
    </div>
  </div>

  // decorative shapes
  // counter-shape1 — large outlined rounded rect 390×380, top: 26px, right: -110px, border: 1px solid rgba(255,255,255,0.25), border-radius 10px
  // counter-shape2 — small filled translucent rect 130×100, top: 116px, right: -60px, bg rgba(255,255,255,0.3), border-radius 10px
  // counter-shape3 — outlined rect 160×130, bottom area, border 1px rgba(255,255,255,0.2), border-radius 10px
  <span class="hidden lg:block absolute top-[26px] right-[-110px] w-[390px] h-[380px] border border-white/25 rounded-[10px]"></span>
  <span class="hidden lg:block absolute top-[116px] right-[-60px] w-[130px] h-[100px] bg-white/30 rounded-[10px]"></span>
  <span class="hidden lg:block absolute bottom-10 left-[10%] w-[160px] h-[130px] border border-white/20 rounded-[10px]"></span>
</section>
```

## Computed styles
- Section bg: `#df0303` (`bg-primary`)
- Section padding: 120px top and bottom (3rem mobile)
- H3 number: 40px / 700 / white
- Label: 16px / 1.7 / white

## CountUp behavior
Implement `<CountUp value={n} />` as a client subcomponent:
- Use `useRef` on the element + `IntersectionObserver` with threshold 0.5
- When entering view, start counter: animate from 0 to `value` over 1.5s using `requestAnimationFrame`. Format as integer.
- Only fire once.

## Data
Import: `COUNTERS` from `@/lib/content`.
