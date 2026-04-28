# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Interaction model:** time-driven (auto-cycling carousel) + click-driven (thumbnail jump)
- **Screenshots:** docs/design-references/ss_6121facf8 (initial KV), ss_2477w70ax (right thumb strip)

## Container
- Wrapping `<section class="overflow-hidden w-full pt-[6.5rem] h-screen-s lg:base-pr">`
- 100vh tall on small viewports (use `h-screen-s` = `100svh`)
- `pt-[6.5rem]` top padding (104px) so the in-page header doesn't overlap content
- `lg:base-pr` = right padding for thumbnail strip on desktop

## Layout
```
┌───────────────────────────────────────────────────┬──────┐
│                                                   │  ┌─┐ │
│                                                   │  ├─┤ │ ← thumbnail strip
│                                                   │  ├─┤ │   (vertical, 17 thumbs)
│                                                   │  ├─┤ │   visible only at lg+
│                                                   │  └─┘ │
│  未来に残したい景色をつくる。                        │      │ ← title (h1)
└───────────────────────────────────────────────────┴──────┘
```

The flex container is:
- `flex w-full h-full flex-col lg:flex-row pb-16 gap-4 md:pb-20 md:gap-10 lg:pb-0 lg:justify-between lg:gap-16`
- Left flex item: `flex-1 overflow-hidden relative` — holds the cycling KV stack + h1
- Right flex item: thumbnail strip (only visible at lg)

## Cycling KV stack (left side)
- 17 absolutely-positioned `<div>`s, one per kv image
- Each child class: `absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out-expo will-change-[opacity] z-0`
- Active KV: `opacity-100`; inactive: `opacity-0`
- Inside each: `<Image src={kv} fill className="object-cover" />`
- KV images live at `/images/kv/kv_01.jpg` ... `/images/kv/kv_17.jpg`

### Title overlay (h1)
- `absolute z-50 text-white left-0 bottom-0 base-px pb-5 md:pb-8 xl:pb-10`
- Class: `text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-[1.25] font-normal`
- Color: `text-white` (white)
- Text: `未来に残したい景色をつくる。`

## Thumbnail strip (right side)
- Container: `hidden lg:flex flex-col gap-2 overflow-y-auto h-full py-2 w-[140px]` — strip is ~147px wide per thumb
- Each thumbnail: `<button>` with the same KV image (using `<Image>` with `width={147} height={...}`)
- Active thumb: `opacity-100`; inactive: `opacity-50`
- Click thumbnail → jump to that index
- Container should scroll-snap or scroll-into-view active thumb

## Auto-cycling
- Every ~5s, advance to next KV (cycles 0 → 16 → 0)
- Use `useEffect` with `setInterval`
- When user clicks a thumb, restart the timer

## Computed styles
- h1 fontFamily: `YakuHanJP, neue-haas-unica` → use `var(--font-sans)`
- h1 fontSize: 40px @ desktop, 32px @ md, 24px @ sm
- h1 lineHeight: 1.25 (50px @ 40px font)
- h1 fontWeight: 400 (NOT bold)
- h1 padding: `0 40px 40px` (matches `base-px pb-10`)
- KV transition duration: 1000ms with `ease-out-expo`

## Implementation outline
```tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const KV_IMAGES = Array.from({ length: 17 }, (_, i) => ({
  src: `/images/kv/kv_${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Monochrome visual ${String(i + 1).padStart(2, "0")}`,
}));

export function HeroSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % KV_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, [active]);
  return (
    <section className="overflow-hidden w-full pt-[6.5rem] h-screen-s lg:base-pr">
      <div className="relative flex w-full h-full flex-col lg:flex-row pb-16 gap-4 md:pb-20 md:gap-10 lg:pb-0 lg:justify-between lg:gap-16">
        <div className="relative flex-1 overflow-hidden">
          <h1 className="absolute z-50 text-white text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-[1.25] left-0 bottom-0 base-px pb-5 md:pb-8 xl:pb-10 font-normal">
            未来に残したい景色をつくる。
          </h1>
          {KV_IMAGES.map((kv, i) => (
            <div key={kv.src} className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out-expo will-change-[opacity] z-0",
              active === i ? "opacity-100" : "opacity-0"
            )}>
              <Image src={kv.src} alt={kv.alt} fill className="object-cover" priority={i < 3} />
            </div>
          ))}
        </div>
        <ul className="hidden lg:flex flex-col gap-2 overflow-y-auto h-full py-2 w-[140px] shrink-0">
          {KV_IMAGES.map((kv, i) => (
            <li key={kv.src} className="shrink-0">
              <button onClick={() => setActive(i)} className={cn(
                "relative block w-[147px] h-[82px] overflow-hidden transition-opacity duration-300",
                active === i ? "opacity-100" : "opacity-50 hover:opacity-100"
              )}>
                <Image src={kv.src} alt="" fill className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

## Responsive
- Mobile (<1024px): thumbnail strip hidden, KV fills the entire viewport, h1 still bottom-left at smaller size
- Desktop (>=1024px): thumbnail strip visible on right, KV takes remaining width

## Real assets
All 17 KV images are downloaded to `/public/images/kv/kv_01.jpg` through `/public/images/kv/kv_17.jpg`. Use `next/image` for them.
