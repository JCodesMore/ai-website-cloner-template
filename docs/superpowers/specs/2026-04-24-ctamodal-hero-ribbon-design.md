# CtaModal — Hero + Vertical Stepper redesign (Aurora Emerald)

**Date:** 2026-04-24
**Component:** `src/components/ui/CtaModal.tsx`
**Scope:** Windows-only install flow; visual + interaction redesign. Logic frozen.

## Goal

Replace the current "4 equal cards + Try Free first" layout with a clear **single-hero-action + instruction-stepper** hierarchy. The user must understand at a glance: (1) press the big button, (2) then do these 3 keystrokes in the Explorer dialog that opens. All 4 things are visible from the start; the button dominates; the 3 keystrokes read as a cheat-sheet, not as buttons.

Preserve `useCtaModal`, `copyAndLaunch`, escape-to-close, body scroll lock, focus management, AbortError handling, `showOpenFilePicker` → `<input type=file>` fallback.

## Non-goals

- macOS / Linux / mobile install flows.
- `CtaModalContext` API, trigger call sites, CSS variables.
- New dependencies. motion@12.38, lucide, shadcn (base-nova) already in stack.
- Light mode.
- Test infrastructure.
- Secondary accent colors. **Pure emerald on dark. Violet is banned in this surface.** Depth comes from luminance layers, blur, and frost — not a second hue.

## Design pillars (grounded in research)

1. **ProtonVPN's own onboarding** uses a 2-col "decorative left + actionable right" modal. We preserve that lineage.
2. **Premium monochrome accent** (Linear / Vercel / Apple Pro) — hierarchy from tonal elevation, not a second color. Each surface tint lifts slightly toward emerald as it gains importance.
3. **Keyboard shortcuts as discrete chips, never prose** (VS Code, Raycast). Spatial-visual recognition beats reading.
4. **Connector progression via opacity/color shift, not animated stroke-dashoffset.** Production premium keeps it simple; the luxury is in timing, not in SVG theatrics.
5. **One master breathing rhythm** for the modal: 4.8s master beat. Orbit pulse-rings 4.8s. Hero glow 2.4s (phase-aligned, half-beat). Stepper cascade 150ms stagger. Aurora atmosphere 60s slow rotate. Modal feels like one organism.

## Layout (900px modal, 2-column)

```
┌──────────────────────────────────────────────────────────────┐
│ [status-dot]  AuraVPN Free (HyperScramble)           [X]    │  ← header 48px
├──────────────────┬───────────────────────────────────────────┤
│                  │ Install AuraVPN on Windows                │
│                  │ One secure tunnel. One click. Three keys. │
│  ░░ VPNOrbit ░░  │                                           │
│  (280px wide)    │ AuraVPN-Setup-1.2.0.exe · 48 MB · SHA ✓  │
│                  │                                           │
│  opacity 0.55    │ ╔═══════════════════════════════════════╗ │
│  saturate 0.7    │ ║       GET AURAVPN          →        ║ │ ← HERO
│                  │ ╚═══════════════════════════════════════╝ │
│  pulse rings     │                                           │
│  4.8s master     │ │ Затем в Проводнике:                     │ ← divider
│                  │                                           │
│  on-click:       │ ① Open address bar         [Ctrl] [L]    │ ← card
│  brief brighten  │ │ Focus the path input at the top         │
│  (0.55→0.9,      │ │·                                         │
│  pulse 1→1.3,    │ ② Paste command            [Ctrl] [V]    │
│  600ms)          │ │ Clipboard already filled for you        │
│                  │ │·                                         │
│                  │ ③ Run installer            [Enter]       │
│                  │ │ Windows installer launches               │
│                  │                                           │
│                  │ Encrypted · WireGuard · SHA-256  [Cancel] │ ← footer 56px
└──────────────────┴───────────────────────────────────────────┘
```

Below `md:` breakpoint the left aside is hidden; right column goes full width. Cards restructure to stack (number + keycap top row, label + desc bottom row) if width < 400px.

## Components (all inside `CtaModal.tsx`)

### Preserved
- `MeshOrbs` — behind modal, unchanged (emerald + black radial bleeds).
- `NoiseLayer` — SVG turbulence film grain, unchanged.
- `StatusDot` — pulsing emerald dot in header.
- `HyperScramble` — A-Z glitch badge for variant name, unchanged.
- `ModalShell` — widened max-w to 900px (already in place).

### Reworked
- **`VPNOrbit`** (left aside, 280px):
  - Same structure: central ShieldCheck, 3 orbiting icons (Lock / Globe / Key), dashed orbit ring, 2 pulse rings, bottom meta "secured tunnel · wireguard · sha-256".
  - Demoted visual: `opacity-[0.55]`, `filter: saturate(0.7)`. Reads as atmosphere, not focal element.
  - Pulse rings re-timed to **4.8s** master beat.
  - Adds state prop `acknowledged: boolean`. When true (copyAndLaunch succeeds): 600ms brightness flash — opacity eases to 0.9, pulse ring scale 1→1.3, then returns to calm. Purely acknowledgment; not a progress indicator.

### New / replaced
- **`HeroButton`** (replaces `TryFreeCard`):
  - Full-width pill inside right col content, 64px tall. Label: **"Try Free"** (idle) → check-chip (post-click).
  - Wrapped in existing `MagneticButton` (strength 0.25, radius 120px).
  - Double border: outer `border-emerald-500/70`, inner `ring-1 ring-inset ring-emerald-400/30`.
  - Background: `bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-transparent`.
  - Glow: `shadow-[0_0_40px_-8px_oklch(0.78_0.17_156/0.55)]`, pulses 2.4s ease-in-out (phase-half of orbit master beat).
  - Conic-gradient shimmer on inner ring (shiny-button pattern), 2.4s rotation.
  - On hover: shadow grows to `0_0_60px_-8px`, scale 1.01.
  - On click (copyAndLaunch success): fades to `opacity-35`, `pointer-events-none`, `cursor-not-allowed`. **Stays in place.** A separate `LaunchedChip` slides in above it.

- **`LaunchedChip`** (new):
  - Small pill above HeroButton, appears after successful copyAndLaunch.
  - Content: `<CheckCircle2 className="emerald-400" /> Installer launched`.
  - Enter: `opacity 0 → 1`, `x: 12 → 0`, 220ms. Persists until modal close.

- **`SectionDivider`** (new):
  - Between hero and stepper. 40px vertical space.
  - Content: `border-l-2 border-emerald-400/50` left bar, label **"Затем в Проводнике:"** in zinc-300 14px medium.
  - Establishes "step 1 done → now do these" narrative.

- **`StepperRail`** (replaces horizontal ribbon / old StepRow stack):
  - Vertical list of 3 `StepCard`s, 12px gap.
  - Between cards: 2px vertical segment line, absolute positioned in the 12px gap, `bg-white/5` dim / `bg-emerald-400/40` active. Height 16px so it visually bridges card borders.
  - Segments activate in cascade post-copyAndLaunch with 150ms stagger.

- **`StepCard`** (replaces old `StepRow`):
  - Height 72px, full width, rounded-[16px], border.
  - Internal grid: `[28px_1fr_auto]` columns, 16px gap, 14px padding.
  - **Number chip** (28px circle, composed `<span>` with `rounded-full` + inline digit "1" / "2" / "3"): border-emerald-400/40 dim with zinc-400 digit / solid emerald-400 bg with black-900 digit active. Avoid Unicode ① ② ③ (renders inconsistently across fonts).
  - **Label column**: 14px zinc-200 title ("Open address bar") + 12px zinc-500 desc ("Focus the path input at the top").
  - **Keycap column**: shadcn `Kbd` / `KbdGroup` — JetBrains Mono 13px. Dim zinc-400, active emerald-200.
  - States:
    - **Dim** (default): `bg-white/[0.01]`, `border-white/[0.05]`, text/chip/keycap muted.
    - **Active** (post-copyAndLaunch, cascade): `bg-emerald-400/[0.05]`, `border-emerald-400/30`, chip solid, label zinc-50, keycap emerald-200.
  - Transition: 220ms ease-out on bg/border/color. No layout shift.

- **`AuroraBacklight`** (new, below modal shell content, above mesh orbs):
  - Repeating-linear-gradient `emerald-900/20 → transparent → emerald-950/25 → transparent`.
  - `blur-[80px]`, `opacity-30`, slow rotate 60s linear infinite.
  - Delivers the Aurora Glass promise without introducing a second color.

### Removed
- `TryFreeCard` — absorbed into HeroButton.
- The 01 numbering on what was step-01 (hero) — hero has no number, it's THE action. Stepper cards are ① ② ③ (not 02 03 04 anymore — they're the only numbered sequence now).
- Old horizontal `StepRow` ribbon semantics.

## Motion choreography

### Master rhythm
| Clock | Bound to |
|-------|----------|
| 4.8s | VPNOrbit pulse rings |
| 2.4s | HeroButton glow pulse, inner conic shimmer |
| 60s | AuroraBacklight rotation |
| 20s | VPNOrbit icon orbit (unchanged) |
| 150ms | Stepper cascade stagger |

### Entrance (modal open)
- Backdrop fade 260ms.
- Modal shell spring `damping:24 stiffness:280`, `y:24 → 0`, `scale:0.96 → 1`, 80ms delay.
- Right column children cascade: header 240ms · title 320ms · meta 420ms · HeroButton 520ms · SectionDivider 640ms · StepCards stagger(0.08) starting 720ms · footer 980ms. All fade+rise-8.
- VPNOrbit: fade-in 600ms + scale 0.9→1, no delay.
- AuroraBacklight: fade 800ms, rotation starts immediately.

### Post-click (copyAndLaunch resolves successfully)
| t (ms) | Element | Change |
|--------|---------|--------|
| 0 | HeroButton | opacity → 0.35, disabled |
| 0 | VPNOrbit | brighten flash: opacity 0.55→0.9, pulse ring scale 1→1.3 |
| 0 | LaunchedChip | mount, slide-in from x:12 |
| 150 | StepCard ① | state → active (bg/border/text transition 220ms) |
| 150 | Segment ①→② | bg → emerald |
| 300 | StepCard ② + segment ②→③ | active |
| 450 | StepCard ③ | active |
| 600 | VPNOrbit | settle back to opacity 0.55, pulse scale 1 |

No auto-reset. State persists until modal close. Reopening modal = fresh idle state.

### Reduced motion
`useReducedMotion()` gate disables: orbit icon rotation, aurora rotation, pulse rings, conic shimmer, magnetic pull, cascade stagger (instant switch to active). Entrance becomes 120ms crossfade. LaunchedChip switches instantly.

## Typography & palette

| Role | Value |
|------|-------|
| Surface base | `oklch(0.12 0.005 260)` at 70% alpha + backdrop-blur |
| Emerald primary | `oklch(0.78 0.17 156)` (= emerald-400) |
| Emerald deep | `oklch(0.66 0.17 156)` (= emerald-500) |
| Text primary | `zinc-50` |
| Text secondary | `zinc-300` / `zinc-400` |
| Text muted / mono | `zinc-500` |
| Border dim | `white/[0.05]` |
| Border active | `emerald-400/30` |
| Glow shadow | `oklch(0.78 0.17 156 / 0.55)` |

- Inter: title 28px / semibold / tracking -0.03em, body 14px, small 12-13px.
- JetBrains Mono: keycaps, file meta, SHA hash.
- No Syncopate, no second sans, no second accent.

## shadcn primitives to use (research-confirmed available)

- `Button` — base for HeroButton (CVA variant extended in-file).
- `Kbd` + `KbdGroup` — stepper keycaps.
- `Badge` — (optional) for HyperScramble variant pill if we want to swap current custom.
- `Separator` — (optional) footer divider.

Must compose manually (no primitive):
- Glow + conic shimmer on button.
- Magnetic hover (already have `MagneticButton`).
- Filling connector segments (plain div bg transitions, no SVG).
- AuroraBacklight.
- VPNOrbit (already custom).
- Cascade timing (motion variants + staggerChildren).

## Logic preserved (verbatim, do not touch)

- `useCtaModal` hook.
- `copyAndLaunch` — clipboard write + `showOpenFilePicker({startIn:"downloads"})` with AbortError / SecurityError / NotAllowedError early return + `<input type=file>` fallback via `fileInputRef.current?.click()`.
- Escape listener, body scroll lock, focus management on open.
- `PLATFORMS.windows` meta + `WIN_STEPS`.
- Variant config (free / plus / business) — badge label + copy only.

## Logic removed / clean up

- `TryFreeCard` component definition (absorbed).
- `revealedIndex` state (replaced by simple `copied` boolean cascading via motion variants).
- Old horizontal ribbon styles.
- Any leftover `useDemoSequence` / auto-demo hooks (already removed in prior iteration — confirm gone).

## Acceptance criteria

1. `npm run typecheck` clean.
2. `npm run lint` clean (0 errors, 0 warnings; no `react-hooks/set-state-in-effect`).
3. `npm run build` clean (35 routes).
4. Visual verification (user-triggered, not auto):
   - Modal opens, staggered reveal plays, all 4 elements (HeroButton + 3 StepCards) visible from start.
   - HeroButton dominates; StepCards are clearly dim.
   - Click HeroButton → file picker opens exactly once (no double).
   - LaunchedChip appears above button, button fades to disabled state **but stays in place**.
   - StepCards cascade in ①→②→③ with visible 150ms stagger and connector segments filling.
   - VPNOrbit briefly brightens at t=0 and settles.
   - `prefers-reduced-motion: reduce` disables all orchestration.
5. Viewport < md (768px): left aside hidden, content full-width, StepCards usable.
6. A11y: HeroButton has `aria-busy="true"` while copying, StepCards have `aria-label` including label + shortcut (e.g., "Step 1: Open address bar, Ctrl+L").

## Out of scope

- Non-Windows flows.
- Haptics, sound.
- SSR-safe `detectPlatform` changes.
- Theming / light mode.
- Analytics events.

## Appendix: Absolute-grade specifications

Four specialist passes locked every value. Implementation pulls from this section.

### A1. Hero "Try Free" button (absolute)

- Height `64px`, border-radius `120px` (full pill), `px-8 py-4`.
- Inner layout: `flex items-center justify-center gap-2`. Label Inter 14px `font-semibold tracking-tight` "Try Free". Trailing `<ArrowRight className="size-4" strokeWidth={2.5} />`; on group-hover translate-x 0.5.
- Border stack: outer `border-2 border-emerald-500/70` + inner `ring-2 ring-inset ring-emerald-400/30`.
- Conic shimmer on ring (2.4s linear):
  - `conic-gradient(from var(--angle) at 50% 50%, emerald-400/0 0%, emerald-300/40 20%, emerald-400/30 50%, emerald-300/15 80%, emerald-400/0 100%)`
  - Mask `radial-gradient(circle at 50% 50%, transparent 42%, black 48%, black 52%, transparent 58%)`.
  - CSS var `--angle` animated 0→360deg. `background-clip: border-box`.
- Idle shadow stack:
  - `0 0 0 1px oklch(0.66 0.17 156 / 0.4)`
  - `0 10px 32px -8px oklch(0.66 0.17 156 / 0.6)` — breathes blur-radius 32→40 @ 2.4s ease-in-out (phase 0, half-beat of 4.8s master).
  - `inset 0 1px 0 oklch(1 0 0 / 0.3)`.
- Background fill: `bg-gradient-to-b from-emerald-500/20 via-emerald-600/15 to-emerald-500/[0.05]`.
- Hover 200ms cubic-bezier(0.16, 1, 0.3, 1): gradient stops lift one oklch-lightness tick (`from-emerald-400 via-emerald-400/90`), shadow `0 14px 44px -6px emerald-400/70`, `scale-[1.01]`. MagneticButton strength 0.30, radius 120px, spring stiffness 150 damping 15.
- Press 80ms ease-out: `scale-[0.98]`, shadow collapses to `0 2px 8px -2px emerald-500/40`.
- Post-click disabled: `opacity-35`, `pointer-events-none`, `cursor-not-allowed`. Shimmer CSS animation paused. Shadow freezes at `0 0 0 1px emerald-500/40, 0 10px 32px -8px emerald/0.3` (pulse stops). Button stays in place.
- Focus-visible: `outline-none ring-2 ring-emerald-400/70 ring-offset-2 ring-offset-[oklch(0.12_0.005_260)]`.
- Entrance variant: `{opacity:0, y:8} → {opacity:1, y:0}`, 400ms ease `[0.16,1,0.3,1]`, delay ~520ms after shell.
- Reduced motion: shimmer disabled, pulse disabled (shadow locked at mid value `0 8px 24px -6px emerald-400/40`), magnetic off, entrance collapses to 120ms opacity.
- a11y: `aria-busy` while `copying`. LaunchedChip (separate sibling) uses `aria-live="polite"`.

### A2. Vertical 3-card stepper (absolute)

- Card: `h-[68px] rounded-2xl px-4 py-3 grid grid-cols-[28px_1fr_auto] items-center gap-4`.
- Dim state: `border border-white/[0.05] bg-white/[0.01] opacity-[0.55]`.
- Active state: `border border-emerald-400/30 bg-emerald-400/[0.06] opacity-100`.
- Transition on border/bg/text/opacity: `220ms ease-out`.
- Hover on dim (cursor-default, NOT pointer): border `white/[0.08]`, bg `white/[0.02]`, 160ms.
- **Number chip** (28×28): `rounded-lg` (not circle — matches premium rectangular language), centered "01" / "02" / "03" in JetBrains Mono 11px, tracking-wider. Dim: `border border-white/[0.05] text-zinc-500`. Active: `border border-emerald-400/30 bg-emerald-400/15 text-emerald-200 shadow-[0_0_12px_-2px_rgb(16_185_129/0.5)]`.
- **Label column**: title `text-[13.5px] font-medium text-zinc-100 leading-tight`. Description `text-[12px] text-zinc-500 leading-snug mt-1`.
- **Keycap column**: shadcn `KbdGroup` with individual `Kbd` per key, `+` separator between them. `Kbd` base: `font-mono text-[11px] px-2 py-[3px] rounded-md border border-white/[0.08] bg-white/[0.02] text-zinc-400`. Active-card Kbd: `border-emerald-400/30 bg-emerald-400/10 text-emerald-200`.
- **Connector segments** between cards (between card 1↔2 and 2↔3): `absolute left-[28px]` (aligned to chip column center), `w-[2px] h-4 -translate-y-2` positioned in 12px card gap. Dim `bg-white/[0.05]`, active `bg-emerald-400/40`. Transition 220ms.
- **Cascade timing** (triggered at `copied === true`):
  - Parent variants: `delayChildren: 0.15s` (initial), `staggerChildren: 0.15s`.
  - Each card activates: border+bg+chip+keycap+text all shift together at 220ms ease-out.
  - Concurrent **glow pulse** on activation: box-shadow `0 0 16px -8px emerald/0` → `0 0 24px -4px emerald/0.5` → `0 0 16px -8px emerald/0` over 600ms ease-out (one-shot).
  - Connector segment fills simultaneously with the card entering active state.
- Reduced motion: instant state switch, no pulse, no stagger. All three active at once when `copied` flips.
- Cards NOT focusable (`tabindex` default, no role="button"). Screen-reader semantics via `<ol>/<li>` with `aria-label="Step 1: Open address bar, Ctrl+L"`.
- Mobile <md: grid shifts to `grid-cols-[28px_1fr_auto] grid-rows-[auto_auto]`. Row 1: chip | label | keycap. Row 2: `col-start-2 col-span-2` description. Card height grows to `min-h-[76px]`.

### A3. VPNOrbit (absolute)

- Aside wrapper: `hidden md:flex h-full min-h-[340px] items-center justify-center overflow-hidden border-r border-white/[0.05] relative` + filter `saturate-[0.85] brightness-95`. `aria-hidden`.
- z-order (ascending): `0` radial bleed, `10` pulse rings, `20` orbit ring, `30` orbiting icons, `40` shield plate, `50` meta strip, `100` flash overlay.
- **Radial bleed**: `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[360px] rounded-full blur-[80px] bg-emerald-500/15 pointer-events-none z-0`.
- **Pulse ring outer**: `absolute ... size-[220px] rounded-full border border-emerald-400/10 z-10`. Motion: `scale: [1, 1.10, 1]`, `opacity: [0.5, 0.15, 0.5]`, duration 4.8s ease-in-out infinite.
- **Pulse ring inner**: `size-[170px] border border-emerald-400/15 z-10`. Motion: `scale: [1, 1.12, 1]`, `opacity: [0.6, 0.2, 0.6]`, duration 4.8s ease-in-out infinite, **delay 1.6s** (rolling wave).
- **Orbit ring** (static): `size-[180px] rounded-full border border-dashed border-emerald-400/20 z-20`.
- **Orbiting icons** (Lock / Globe / Key): 28px wrapper with `border border-emerald-400/25 bg-[oklch(0.12_0.005_260)]/85 text-emerald-300/75 shadow-[0_0_12px_-2px_rgb(16_185_129/0.5)]`. Inner lucide icon 14px stroke 1.75. Rotation 20s linear infinite, angles 0° / 120° / 240°, per-icon `delay: 0.5 * i`. Icons stay upright (counter-rotate per frame).
- **Shield plate**: 88px `rounded-full border border-emerald-400/40 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 shadow-[0_0_40px_-4px_rgb(16_185_129/0.55),inset_0_1px_0_rgb(16_185_129/0.4)] backdrop-blur-md z-40`. Breathing `scale: [1, 1.04, 1]` over 4.8s ease-in-out.
- **ShieldCheck icon** inside: `size-10 text-emerald-300 stroke-[1.75]`.
- **Meta strip** (bottom): top line `<Wifi size-3 emerald-400/80 stroke-2/>` + `secured tunnel` in JetBrains Mono `text-[9px] uppercase tracking-[0.22em] text-emerald-300/75`. Bottom line `wireguard · sha-256` mono `text-[8px] tracking-[0.18em] text-zinc-600`.
- **Acknowledgment flash** (on `copied === true`, 600ms): container opacity `[0.55, 0.9, 0.55]` easeInOut. Pulse rings concurrent scale spike `1 → 1.15 → 1`. Shield plate shadow radius pump `40 → 52 → 40`.
- Reduced motion: all animations freeze at base state. No rotation, no scale, no pulse. Visibility retained.

### A4. Atmospheric layer stack (absolute)

- **Page backdrop**: `fixed inset-0 bg-black/85`. NO `backdrop-filter` here (budget reserved for shell). Opacity 0→1 over 260ms on open.
- **Mesh orbs** (2, emerald-only, inside overlay behind shell):
  - Orb A: `absolute left-[15%] top-[12%] size-[420px] rounded-full bg-emerald-500/20 blur-[140px]`, drift 22s ease-in-out infinite `x: [0, 40, -20, 0]`, `y: [0, -28, 22, 0]`.
  - Orb B: `absolute right-[10%] bottom-[10%] size-[380px] rounded-full bg-emerald-700/25 blur-[140px]`, drift 26s `x: [0, -30, 24, 0]`, `y: [0, 22, -18, 0]`.
- **Modal shell**: `max-w-[900px] rounded-[26px] bg-[oklch(0.12_0.005_260)]/70 backdrop-blur-[28px] border border-white/[0.08]`.
  - Shadow stack: `0 50px 140px -20px rgba(0,0,0,0.9)`, `0 0 0 1px rgba(255,255,255,0.04)`, `inset 0 1px 0 rgba(255,255,255,0.06)`, `0 0 60px -20px oklch(0.5 0.20 143 / 0.25)` (static outer emerald bloom).
- **Aurora backlight** (inside shell, z-0, clipped to rounded-[26px]):
  - `absolute inset-0 rounded-[26px] overflow-hidden pointer-events-none`. Inner child: conic-gradient `from var(--aurora-angle) at 50% 50%` with stops oklch(0.28 0.20 143) 0% / oklch(0.12 0.005 260 / 0) 33.33% / oklch(0.48 0.18 141) 66.66% / oklch(0.12 0.005 260 / 0) 100%, `filter: blur(80px)`, `opacity 0.3`, rotation 60s linear infinite.
- **Noise overlay** (inside shell, z-10, above aurora, below content): SVG turbulence `baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"` + `feColorMatrix saturate 0`, applied via `<rect>` full-size. `opacity-[0.035] mix-blend-overlay pointer-events-none`.
- **Content grid** z-20 (header / hero / stepper / footer / aside-orbit).
- **LaunchedChip** z-50 absolute above hero button, `rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-100 text-[12px] px-3 py-1 flex items-center gap-1.5` with `<CheckCircle2 className="size-3.5 text-emerald-300"/>` + "Installer launched". Enter: `{opacity:0, x:12} → {opacity:1, x:0}`, 220ms ease-out.
- Entrance sequence:
  - t=0 backdrop fade 260ms.
  - t=0 orbs fade+scale 0.85→1 over 600-700ms.
  - t=80 shell spring `{y:24→0, scale:0.96→1, damping:24, stiffness:280}`.
  - t=120 aurora opacity 0→0.3 over 800ms.
  - t=120 noise opacity 0→0.035 over 400ms.
- Reduced motion: orbs static at midpoint, aurora static at 0.3 no rotate, shell instant, noise immediate.
- Performance budget: 1 `backdrop-blur` (shell) + 3 plain `blur()` (orb A, orb B, aurora). No `will-change` outside 120ms shell entrance window. No filters on content layer.

## Risks & mitigations

- **Multiple blur layers on low-end GPUs** (AuroraBacklight + modal backdrop-blur + mesh orbs blur). Mitigation: AuroraBacklight uses plain `blur()` (non backdrop-filter); only modal shell uses backdrop-blur.
- **Conic shimmer perf on the button** — cheap CSS mask, GPU-composited. Mitigation: throttle to 2.4s, no repaints beyond transform.
- **Magnetic pull on primary CTA** conflicts with click timing on slow devices. Mitigation: disable magnetic when reduced motion or touch input.
- **Cascade visible through reduced motion** — verify by forcing `matchMedia('(prefers-reduced-motion: reduce)')` in devtools.
- **Button stays visible but disabled post-click** — new behavior; verify user doesn't attempt second click. Visual hint: `cursor-not-allowed` + 35% opacity should communicate.
