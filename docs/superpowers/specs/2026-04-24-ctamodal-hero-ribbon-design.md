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
  - Full-width pill inside right col content, 64px tall. Label: **"Get AuraVPN"** (idle) → check-chip (post-click).
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

## Risks & mitigations

- **Multiple blur layers on low-end GPUs** (AuroraBacklight + modal backdrop-blur + mesh orbs blur). Mitigation: AuroraBacklight uses plain `blur()` (non backdrop-filter); only modal shell uses backdrop-blur.
- **Conic shimmer perf on the button** — cheap CSS mask, GPU-composited. Mitigation: throttle to 2.4s, no repaints beyond transform.
- **Magnetic pull on primary CTA** conflicts with click timing on slow devices. Mitigation: disable magnetic when reduced motion or touch input.
- **Cascade visible through reduced motion** — verify by forcing `matchMedia('(prefers-reduced-motion: reduce)')` in devtools.
- **Button stays visible but disabled post-click** — new behavior; verify user doesn't attempt second click. Visual hint: `cursor-not-allowed` + 35% opacity should communicate.
