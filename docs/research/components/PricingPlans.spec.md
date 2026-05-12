# PricingPlans Specification

## Overview
- **Target file:** `src/components/PricingPlans.tsx`
- **Interaction model:** static (hover lift)
- **Component type:** Server component

## Structure
Section with centered heading and 3 pricing cards in a responsive grid.

```
<section class="relative py-[120px] overflow-hidden">
  <div class="yo-container relative z-10">
    <div class="text-center mb-20">
      <span class="yo-subtitle">Our Pricing</span>
      <h2 class="yo-headline-split text-[48px] leading-none w-full md:w-2/3 xl:w-1/2 mx-auto mt-5">
        Premium service without <span class="light">premium price tag</span>
      </h2>
    </div>

    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10">
      for plan in PRICING_PLANS:
        <div class={cn(
          "relative rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2",
          plan.highlighted ? "bg-secondary text-white" : "bg-white"
        )}>
          // icon badges on top (one or two)
          <div class="absolute -top-[30px] left-1/2 -translate-x-1/2 flex gap-2">
            <span class="size-[60px] rounded-full bg-primary text-white flex items-center justify-center text-[26px]">
              {plan.icon === "rss" ? <RssIcon /> : <DesktopIcon />}
            </span>
            {plan.extraIcon && (
              <span class="size-[60px] rounded-full bg-primary text-white flex items-center justify-center text-[26px] -ml-3">
                <DesktopIcon />
              </span>
            )}
          </div>
          
          // header
          <div class={cn(
            "text-center pt-14 px-9 pb-9 border-b",
            plan.highlighted ? "border-white/10" : "border-black/8"
          )}>
            <h4 class={cn("text-2xl font-extrabold mb-3", plan.highlighted && "text-white")}>{plan.title}</h4>
            <h3 class={cn("text-[50px] font-bold leading-none mb-3", plan.highlighted ? "text-white" : "text-secondary")}>
              {plan.price}<span class="text-[16px] font-normal opacity-80">{plan.unit}</span>
            </h3>
            <span class={cn("block w-[80%] mx-auto text-sm", plan.highlighted ? "text-white/80" : "text-body")}>{plan.caption}</span>
          </div>

          // body
          <div class="p-9 pb-12">
            <ul class="space-y-4 mb-8 list-none">
              for f in plan.features:
                <li class="flex items-center gap-3">
                  <CheckIcon class={cn("size-5 shrink-0", plan.highlighted ? "text-primary" : "text-secondary")} />
                  <span class={plan.highlighted ? "text-white" : "text-heading"}>{f}</span>
                </li>
            </ul>
            <a href="#contact" class={cn("yo-btn w-full", plan.highlighted ? "yo-btn-white" : "yo-btn-primary")}>Choose Plan</a>
          </div>
        </div>
    </div>
  </div>

  // decorative ambient elements
  <span class="hidden md:block absolute right-[5%] bottom-1/4 size-3 rounded-full bg-primary yo-anim-x"></span>
  <span class="hidden md:block absolute right-[10%] top-1/4 size-3 border-2 border-secondary yo-anim-drift"></span>
  <span class="hidden md:block absolute left-[5%] top-[5%] w-12 h-16 border border-black/10 rounded-md yo-anim-drift"></span>
</section>
```

## Computed styles
- Card border-radius: 10px
- Card padding: top header 48px + 36.8px sides + 36.8px bottom; body 36.8px-ish
- Icon badge: 60×60 round, bg primary, white icon, font-size 26px, positioned absolute top -30px
- Price h3: 50px / 700 / color secondary (or white if highlighted)
- Hover: translateY(-8px), shadow increase

## Data
Import: `PRICING_PLANS` from `@/lib/content`.
Icons: `RssIcon`, `DesktopIcon`, `CheckIcon` from `@/components/icons`.
Note: When `plan.icon === "rss"`, render `<RssIcon />`; when `"desktop"`, render `<DesktopIcon />`. Handle the `plan.extraIcon` for the combined plan.
