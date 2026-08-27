# CTASection Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/CTASection.tsx`
- **Interaction model:** static

## DOM Structure
```
<div> heading: "Scale personalised sales without growing your team" + intro
<div class="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-[3fr_2fr]">
  <div> big card: "Create your own agent"
  <div class="flex flex-col gap-3"> 3 stacked feature cards
</div>
```

## Computed Styles

### Section heading
- Fraunces 40px/200/40px/-1.2px, `#000`; intro paragraph below: Inter 16px/400/24px, `text-content-secondary`, max-width ~500px

### Big card ("Create your own agent")
- `bg-surface-elevated flex h-full flex-col items-center rounded-3xl px-4 pt-16 pb-18` (32px radius, ~64px top padding, ~72px bottom padding)
- Inner content max-width ~480px (`max-w-120`), centered, flex column, gap 40px (`gap-10`)
- Heading: Fraunces 40px/200/-1.2px, `#000`, text-align center
- Body: Inter 14px/400/20px/-0.18px, `text-content-secondary`, text-align center
- Button "Generate your agent": `bg-black text-white rounded-full`, padding `10px 20px`, font-size 14px, margin-top ~24px
- Caption below button (small print): "No account needed. No cost. Create your agent in minutes." — Inter 12-14px, `text-content-tertiary`

### Feature cards (3x, stacked vertically, `flex flex-col gap-3`)
- Each: `bg-surface-elevated rounded-3xl p-7` (32px radius, 28px padding), flex row or column with icon + heading + body, `gap-8` internal
- Heading: Inter 16px/500, `#000`
- Body: Inter 14px/400, `text-content-secondary`
- No icons confirmed extracted — use a small lucide-react icon per card matching theme: `Clock` (Live 24/7), `Globe` (Multilingual), `UserCheck` (Personalised), size 20, color `#000`, in a small rounded-full bg-white/black-5% badge above each heading

## Text Content (verbatim)
- Section heading: "Scale personalised sales without growing your team"
- Intro: "Give a dedicated guide to every buyer – Handhold agents are always available. If human touch is needed, you'll know."
- Big card heading: "Create your own agent"
- Big card body: "Generate a sample demo agent from your website"
- Big card button: "Generate your agent"
- Big card caption: "No account needed. No cost. Create your agent in minutes."
- Feature 1: "Live 24/7" — "Always available to interact with visitors."
- Feature 2: "Multilingual" — "Supports 50+ languages."
- Feature 3: "Personalised for each prospect" — "Adapts every session to the buyer."

## Assets
- Icons: lucide-react `Clock`, `Globe`, `UserCheck`

## Responsive Behavior
- **Desktop (1440px):** `lg:grid-cols-[3fr_2fr]` — big card left (60%), feature cards column right (40%)
- **Mobile (390px):** single column, big card first, then 3 feature cards stacked
- **Breakpoint:** 1024px (`lg`)
