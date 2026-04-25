# CtaModal Hero + Vertical Stepper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `src/components/ui/CtaModal.tsx` visually per the hero + vertical stepper spec (2026-04-24). Logic frozen. Pure emerald palette. Dominant "Try Free" hero button + 3 compact instruction cards. Dim-by-default cards cascade active on click. VPNOrbit demoted to atmosphere with acknowledgment flash. New Aurora backlight layer. Violet fully removed.

**Architecture:** Single file refactor — all sub-components stay inside `src/components/ui/CtaModal.tsx` matching existing project convention. No new files outside this one. Logic (copyAndLaunch, useCtaModal, escape, scroll lock, AbortError handling, file-input fallback, focus management) copied verbatim. Visual layers restructured: ModalShell → AuroraBacklight → NoiseLayer → 2-col grid (VPNOrbit aside | right content). Right content: header / title / meta / HeroButton + LaunchedChip overlay / SectionDivider / StepCard × 3 with connectors / footer.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, motion/react, lucide-react. Existing `MagneticButton` and `BorderTrail` reused. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-24-ctamodal-hero-ribbon-design.md` — sections A1-A4 contain absolute-grade values.

**Verify commands** (project convention, no test runner):
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — eslint
- `npm run build` — full Next.js build, 35 routes
- `npm run check` — runs all three above

**Commit format:** Conventional commits enforced by pre-commit hook. Valid types: feat, fix, refactor, docs, style, perf, chore. Use `feat(cta): ...` or `refactor(cta): ...` for these changes.

---

## File Structure

Only one file changes:

- **Modify:** `src/components/ui/CtaModal.tsx` — all edits happen here

Sub-components added / replaced inside this file:
- `AuroraBacklight` (new)
- `HeroButton` (replaces `TryFreeCard`)
- `LaunchedChip` (new)
- `SectionDivider` (new)
- `StepCard` (replaces `StepRow`)
- `StepperConnector` (new)

Sub-components modified in place:
- `MeshOrbs` — violet orb → emerald-700 orb
- `VPNOrbit` — filter, retimed pulses, radial bleed, acknowledgment flash
- `KeyCap` — restyled flat for instruction context (removes 3D depth)

Sub-components removed:
- `TryFreeCard` (absorbed into HeroButton + content row)
- `ConfettiBurst` (not in new design)
- `ProgressRing` (not used after HeroButton simplification)

State changes:
- `revealedIndex` state + cascade useEffect → removed; cascade driven by motion variants `staggerChildren`
- `copied`, `copying`, `platform` states preserved

---

## Task 1: Remove violet from MeshOrbs

**Files:**
- Modify: `src/components/ui/CtaModal.tsx:543-598` (the `MeshOrbs` function)

- [ ] **Step 1: Replace the violet orb background class**

Locate the second `motion.span` inside `MeshOrbs` (around line 573). Change:

```tsx
className="pointer-events-none absolute right-[10%] bottom-[10%] size-[380px] rounded-full bg-violet-500/[0.18] blur-[140px]"
```

To:

```tsx
className="pointer-events-none absolute right-[10%] bottom-[10%] size-[380px] rounded-full bg-emerald-700/25 blur-[140px]"
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS (both clean)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "style(cta): replace violet mesh orb with emerald-700"
```

---

## Task 2: Add radial bleed + retime pulse rings in VPNOrbit

**Files:**
- Modify: `src/components/ui/CtaModal.tsx:459-537` (the `VPNOrbit` function)

- [ ] **Step 1: Add filter wrapper + radial bleed, retime pulse rings**

Replace the entire `VPNOrbit` body (lines 459-537) with:

```tsx
function VPNOrbit({ reduceMotion, acknowledged }: { reduceMotion: boolean; acknowledged: boolean }) {
  return (
    <div
      className="relative flex h-full min-h-[340px] items-center justify-center overflow-hidden [filter:saturate(0.85)_brightness(0.95)]"
    >
      {/* radial bleed — soft emerald halo behind everything */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[80px]"
      />

      {/* outer pulse ring — master beat 4.8s */}
      <motion.span
        aria-hidden
        className="absolute z-10 size-[220px] rounded-full border border-emerald-400/10"
        animate={
          reduceMotion
            ? {}
            : acknowledged
              ? { scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }
              : { scale: [1, 1.1, 1], opacity: [0.5, 0.15, 0.5] }
        }
        transition={
          reduceMotion
            ? undefined
            : acknowledged
              ? { duration: 0.6, ease: "easeInOut" }
              : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* inner pulse ring — phase offset 1.6s (rolling wave) */}
      <motion.span
        aria-hidden
        className="absolute z-10 size-[170px] rounded-full border border-emerald-400/15"
        animate={reduceMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.6 }
        }
      />

      {/* orbit ring (dashed, static) */}
      <span
        aria-hidden
        className="absolute z-20 size-[180px] rounded-full border border-dashed border-emerald-400/20"
      />

      {/* orbiting icons */}
      {ORBIT_ICONS.map(({ Icon, angle, delay }, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute left-1/2 top-1/2 z-30 -ml-[14px] -mt-[14px] size-7"
          style={{ transformOrigin: "center" }}
          initial={{ rotate: angle }}
          animate={reduceMotion ? { rotate: angle } : { rotate: angle + 360 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 20, repeat: Infinity, ease: "linear", delay }
          }
        >
          <span
            className="absolute left-1/2 top-1/2 -ml-[14px] -mt-[14px] flex size-7 items-center justify-center rounded-full border border-emerald-400/25 bg-[oklch(0.12_0.005_260)]/85 text-emerald-300/75 shadow-[0_0_12px_-2px_rgb(16_185_129/0.5)] backdrop-blur-sm"
            style={{ transform: `translateX(90px)` }}
          >
            <Icon className="size-[14px]" strokeWidth={2} />
          </span>
        </motion.span>
      ))}

      {/* central shield — breathing at master beat 4.8s, acknowledgment flash on success */}
      <motion.div
        className="relative z-40 flex size-[88px] items-center justify-center rounded-full border border-emerald-400/40 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 shadow-[0_0_40px_-4px_rgb(16_185_129/0.55),inset_0_1px_0_rgb(16_185_129/0.4)] backdrop-blur-md"
        animate={
          reduceMotion
            ? {}
            : acknowledged
              ? { scale: [1, 1.08, 1], opacity: [0.55, 0.9, 0.55] }
              : { scale: [1, 1.04, 1], opacity: 1 }
        }
        transition={
          reduceMotion
            ? undefined
            : acknowledged
              ? { duration: 0.6, ease: "easeInOut" }
              : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <ShieldCheck className="size-10 text-emerald-300" strokeWidth={1.75} aria-hidden />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-emerald-300/20 to-transparent"
        />
      </motion.div>

      {/* bottom meta */}
      <div className="absolute bottom-2 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <div className="flex items-center gap-1.5">
          <Wifi className="size-3 text-emerald-400/80" strokeWidth={2} aria-hidden />
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-300/75">
            secured tunnel
          </span>
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-600">
          wireguard · sha-256
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update the call site to pass `acknowledged` prop**

Find where `<VPNOrbit reduceMotion={!!reduceMotion} />` is called (around line 312). Change to:

```tsx
<VPNOrbit reduceMotion={!!reduceMotion} acknowledged={copied} />
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "refactor(cta): demote VPNOrbit to atmosphere + acknowledgment flash"
```

---

## Task 3: Add AuroraBacklight component

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — add new function near `NoiseLayer` (around line 600)

- [ ] **Step 1: Add AuroraBacklight function**

After the `NoiseLayer` function definition, add:

```tsx
/* ══════════════════════════════════════════════════════════════
   AURORA BACKLIGHT — slow-rotating emerald atmosphere inside shell
═══════════════════════════════════════════════════════════════ */

function AuroraBacklight({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]"
    >
      <motion.span
        className="absolute left-1/2 top-1/2 block size-[180%] -translate-x-1/2 -translate-y-1/2 opacity-30 [background:conic-gradient(from_var(--aurora-angle,0deg)_at_50%_50%,oklch(0.28_0.20_143)_0%,oklch(0.12_0.005_260/0)_33%,oklch(0.48_0.18_141)_66%,oklch(0.12_0.005_260/0)_100%)] blur-[80px]"
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={
          reduceMotion ? undefined : { duration: 60, repeat: Infinity, ease: "linear" }
        }
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "feat(cta): add AuroraBacklight atmosphere layer"
```

---

## Task 4: Mount AuroraBacklight inside modal shell

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — inside the modal shell JSX (around line 293-294, right after the shell opens and before `<NoiseLayer />`)

- [ ] **Step 1: Add AuroraBacklight mount**

Locate the line:
```tsx
<NoiseLayer />
```

Replace it with:
```tsx
<AuroraBacklight reduceMotion={!!reduceMotion} />
<NoiseLayer />
```

(AuroraBacklight renders at z-0, NoiseLayer visually sits above it; both behind content which lives inside the 2-col grid.)

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "feat(cta): mount AuroraBacklight inside modal shell"
```

---

## Task 5: Add HeroButton component

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — add near the end of the file (after `ProgressRing` or wherever makes sense). Place this above `TryFreeCard` so later when we delete TryFreeCard everything still parses.

- [ ] **Step 1: Add HeroButton function**

Append near the bottom, before the `TryFreeCard` function:

```tsx
/* ══════════════════════════════════════════════════════════════
   HERO BUTTON — dominant primary action, dims but stays on click
═══════════════════════════════════════════════════════════════ */

function HeroButton({
  state,
  onClick,
}: {
  state: "idle" | "copying" | "copied";
  onClick: () => void;
}) {
  const disabled = state !== "idle";
  const isBusy = state === "copying";

  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <motion.div variants={itemVariants} className="relative px-8 pb-3">
      <MagneticButton
        strength={30}
        onClick={handleClick}
        disabled={disabled}
        aria-busy={isBusy}
        className={cn(
          "group relative flex h-16 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-8 text-[14px] font-semibold tracking-tight",
          "border-2 border-emerald-500/70",
          "bg-gradient-to-b from-emerald-500/20 via-emerald-600/15 to-emerald-500/[0.05] text-zinc-50",
          "shadow-[0_0_0_1px_rgb(16_185_129/0.4),0_10px_32px_-8px_rgb(16_185_129/0.6),inset_0_1px_0_rgb(255_255_255/0.3)]",
          "transition-[opacity,filter,box-shadow,transform] duration-200",
          "hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgb(16_185_129/0.5),0_14px_44px_-6px_rgb(16_185_129/0.7)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.12_0.005_260)]",
          disabled && "cursor-not-allowed opacity-[0.35] pointer-events-none",
          isBusy && "cursor-progress",
        )}
      >
        {/* inner ring */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[3px] rounded-full ring-1 ring-inset ring-emerald-400/30"
        />
        {/* conic shimmer on ring */}
        {!disabled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-[cta-spin_2400ms_linear_infinite] rounded-full [background:conic-gradient(from_var(--a,0deg)_at_50%_50%,rgb(16_185_129/0)_0%,rgb(110_231_183/0.4)_20%,rgb(16_185_129/0.3)_50%,rgb(110_231_183/0.15)_80%,rgb(16_185_129/0)_100%)] [mask-image:radial-gradient(circle_at_50%_50%,transparent_48%,black_50%,black_52%,transparent_54%)]"
          />
        )}
        <BorderTrail
          size={64}
          className="opacity-50"
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
        <span className="relative z-10 flex items-center gap-2">
          <span>Try Free</span>
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </span>
      </MagneticButton>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add the `cta-spin` keyframe**

Check if `src/app/globals.css` already has a generic `spin` animation usable. If not, add at the bottom of `src/app/globals.css`:

```css
@keyframes cta-spin {
  from {
    --a: 0deg;
  }
  to {
    --a: 360deg;
  }
}

@property --a {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
```

Actually — `@property` has limited browser support in SSR. Fallback: use a static conic gradient without animation for Task 5; the breathing glow (Task-based pulse shadow) carries the "alive" feel. Skip the keyframe and mask shimmer for now — we'll add it in Task 7 after verifying the rest. Remove the conic shimmer span from the HeroButton code above if needed.

**Decision for simplicity:** Remove the conic-shimmer `<span>` from the HeroButton implementation in Step 1 above. Keep only the static inner ring + BorderTrail + static emerald gradient + breathing shadow. This simplifies to:

Replace the HeroButton body inner JSX (after MagneticButton opens) with:

```tsx
        {/* inner ring */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[3px] rounded-full ring-1 ring-inset ring-emerald-400/30"
        />
        <BorderTrail
          size={64}
          className="opacity-50"
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
        <span className="relative z-10 flex items-center gap-2">
          <span>Try Free</span>
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </span>
```

**Do not edit globals.css in this task.** Revisit advanced shimmer later if desired.

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "feat(cta): add HeroButton primary CTA"
```

---

## Task 6: Add LaunchedChip component

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — add below `HeroButton`

- [ ] **Step 1: Add LaunchedChip function**

Append after the `HeroButton` function:

```tsx
function LaunchedChip() {
  return (
    <motion.span
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="absolute right-8 top-0 -translate-y-1/2 flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-[oklch(0.12_0.005_260)]/90 px-3 py-1 text-[12px] font-medium text-emerald-100 backdrop-blur-sm shadow-[0_0_18px_-4px_rgb(16_185_129/0.6)]"
    >
      <CheckCircle2 className="size-3.5 text-emerald-300" strokeWidth={2.5} aria-hidden />
      <span>Installer launched</span>
    </motion.span>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "feat(cta): add LaunchedChip confirmation pill"
```

---

## Task 7: Add SectionDivider component

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — add below `LaunchedChip`

- [ ] **Step 1: Add SectionDivider function**

Append after `LaunchedChip`:

```tsx
function SectionDivider() {
  return (
    <motion.div
      variants={itemVariants}
      className="relative flex items-center gap-3 px-8 pt-2 pb-3"
    >
      <span
        aria-hidden
        className="block h-4 w-0.5 rounded-full bg-emerald-400/50"
      />
      <span className="text-[13px] font-medium text-zinc-300">
        Затем в Проводнике:
      </span>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "feat(cta): add SectionDivider for hero/stepper separation"
```

---

## Task 8: Add StepCard component (replaces StepRow)

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — add below `SectionDivider` (do NOT delete StepRow yet; we'll swap the call site in Task 11)

- [ ] **Step 1: Add StepCard function**

Append after `SectionDivider`:

```tsx
function StepCard({
  step,
  index,
  active,
}: {
  step: StepSpec;
  index: number;
  active: boolean;
}) {
  return (
    <motion.li
      variants={stepVariants}
      aria-label={`Step ${index + 1}: ${step.label}, ${step.keys.join("+")}`}
      className={cn(
        "group relative grid h-[72px] grid-cols-[28px_1fr_auto] items-center gap-4 rounded-2xl border px-4 py-3 transition-[background-color,border-color,opacity,box-shadow] duration-[220ms] ease-out",
        active
          ? "border-emerald-400/30 bg-emerald-400/[0.06] opacity-100"
          : "border-white/[0.05] bg-white/[0.01] opacity-55 hover:border-white/[0.08] hover:bg-white/[0.02]",
      )}
    >
      {/* number chip */}
      <span
        aria-hidden
        className={cn(
          "flex size-7 items-center justify-center rounded-lg border font-mono text-[11px] font-semibold tracking-wider transition-colors duration-[220ms]",
          active
            ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200 shadow-[0_0_12px_-2px_rgb(16_185_129/0.5)]"
            : "border-white/[0.05] text-zinc-500",
        )}
      >
        {`0${index + 1}`}
      </span>

      {/* label + desc */}
      <div className="min-w-0">
        <p
          className={cn(
            "text-[13.5px] font-medium leading-tight tracking-tight transition-colors duration-[220ms]",
            active ? "text-zinc-50" : "text-zinc-100",
          )}
        >
          {step.label}
        </p>
        <p className="mt-1 text-[12px] leading-snug text-zinc-500">
          {step.desc}
        </p>
      </div>

      {/* keycaps */}
      <div className="flex shrink-0 items-center gap-1">
        {step.keys.map((key, i) => (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span className="select-none text-[11px] font-medium text-zinc-600">+</span>
            )}
            <kbd
              className={cn(
                "inline-flex items-center justify-center rounded-md border px-2 py-[3px] font-mono text-[11px] font-medium transition-colors duration-[220ms]",
                key.length > 1 ? "min-w-[32px]" : "min-w-[24px]",
                active
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                  : "border-white/[0.08] bg-white/[0.02] text-zinc-400",
              )}
            >
              {key}
            </kbd>
          </div>
        ))}
      </div>
    </motion.li>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "feat(cta): add StepCard vertical instruction card"
```

---

## Task 9: Add StepperConnector component

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — add below `StepCard`

- [ ] **Step 1: Add StepperConnector function**

Append after `StepCard`:

```tsx
function StepperConnector({ active }: { active: boolean }) {
  return (
    <motion.span
      aria-hidden
      variants={itemVariants}
      className={cn(
        "relative z-0 -my-1 block h-4 w-[2px] self-start transition-colors duration-[220ms] ease-out",
        active ? "bg-emerald-400/40" : "bg-white/[0.05]",
      )}
      style={{ marginLeft: "30px" }}
    />
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "feat(cta): add StepperConnector vertical line between cards"
```

---

## Task 10: Update stepsListVariants for cascade timing

**Files:**
- Modify: `src/components/ui/CtaModal.tsx:123-128` (the `stepsListVariants` definition)

- [ ] **Step 1: Adjust stepsListVariants**

Locate:
```tsx
const stepsListVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.44, staggerChildren: 0.08 },
  },
};
```

Replace with:
```tsx
const stepsListVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.64, staggerChildren: 0.08 },
  },
};
```

Rationale: SectionDivider takes a slot in the stagger now, so overall delay before cards slides slightly.

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "chore(cta): retune stepper cascade delay"
```

---

## Task 11: Replace content in the right column — hero + stepper

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — the right panel JSX between the `file meta row` and the `hairline` (roughly lines 375-410)

- [ ] **Step 1: Replace the `<motion.ol>` block and non-windows notice**

Locate the block starting at the comment `{/* ── steps (CTA card first, then keystrokes) ── */}` and ending just before the comment `{/* hairline */}`. This includes the `<motion.ol>` and the `{platform === "other" && (...)}` notice.

Replace it with:

```tsx
            {/* ── hero button + launched chip ── */}
            <div className="relative">
              <HeroButton
                state={copying ? "copying" : copied ? "copied" : "idle"}
                onClick={copyAndLaunch}
              />
              <AnimatePresence>
                {copied && <LaunchedChip />}
              </AnimatePresence>
            </div>

            {/* ── section divider ── */}
            <SectionDivider />

            {/* ── stepper cards ── */}
            <motion.ol
              variants={stepsListVariants}
              className="relative flex flex-col gap-0 px-8"
            >
              {WIN_STEPS.map((step, i) => (
                <div key={i}>
                  <StepCard step={step} index={i} active={copied} />
                  {i < WIN_STEPS.length - 1 && (
                    <StepperConnector active={copied} />
                  )}
                </div>
              ))}
            </motion.ol>

            {/* ── non-windows notice ── */}
            {platform === "other" && (
              <motion.div
                variants={itemVariants}
                className="relative mx-8 mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3"
              >
                <Sparkles
                  className="mt-0.5 size-4 shrink-0 text-amber-300/90"
                  strokeWidth={2}
                  aria-hidden
                />
                <p className="text-[12px] leading-relaxed text-amber-100/80">
                  Windows installer shown. macOS &amp; Linux builds are rolling
                  out — your clipboard will still receive the signed command.
                </p>
              </motion.div>
            )}
```

- [ ] **Step 2: Remove the now-unused `revealedIndex` state and cascade effect**

Locate line 149:
```tsx
  const [revealedIndex, setRevealedIndex] = useState(-1);
```
Delete this line entirely.

Locate lines 178-184:
```tsx
  useEffect(() => {
    if (!open) {
      setCopied(false);
      setCopying(false);
      setRevealedIndex(-1);
    }
  }, [open]);
```
Change to (removing the `setRevealedIndex(-1)` line):
```tsx
  useEffect(() => {
    if (!open) {
      setCopied(false);
      setCopying(false);
    }
  }, [open]);
```

Locate the sequential cascade useEffect (lines 186-193):
```tsx
  // sequential cascade after copy
  useEffect(() => {
    if (!copied) return;
    const timers = [0, 180, 360].map((delay, i) =>
      window.setTimeout(() => setRevealedIndex(i), delay),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [copied]);
```
Delete this entire block.

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "refactor(cta): swap TryFreeCard+StepRow for HeroButton+StepCard layout"
```

---

## Task 12: Remove unused components (TryFreeCard, StepRow, ConfettiBurst, ProgressRing, KeyCap)

**Files:**
- Modify: `src/components/ui/CtaModal.tsx` — delete unused sub-component definitions

- [ ] **Step 1: Delete TryFreeCard function**

Delete the entire `TryFreeCard` function block (comment header `/* ═… TRY FREE CARD … */` through closing brace). It's no longer called.

- [ ] **Step 2: Delete StepRow function**

Delete the entire `StepRow` function block (comment header `/* ═… STEP ROW … */` through closing brace).

- [ ] **Step 3: Delete KeyCap function**

Delete the entire `KeyCap` function block (comment header `/* ═… KEYCAP … */` through closing brace). The new `StepCard` uses inline `<kbd>` markup, no KeyCap needed.

- [ ] **Step 4: Delete ConfettiBurst function and BURST_PARTICLES constant**

Delete the `BURST_PARTICLES` constant and the `ConfettiBurst` function block.

- [ ] **Step 5: Delete ProgressRing function**

Delete the entire `ProgressRing` function block — not used by the simplified HeroButton.

- [ ] **Step 6: Clean unused imports**

In the `lucide-react` import at the top (around line 14-24), remove these now-unused icons: `Sparkles` is still used (non-windows notice), `Globe`, `Key`, `Lock` still used in ORBIT_ICONS. Keep them. But if `Sparkles` is imported twice or anywhere else is unused, clean up. Do NOT remove `CheckCircle2` (used by LaunchedChip) or `ArrowRight` (used by HeroButton).

Verify the import block still reads valid TypeScript after edits.

- [ ] **Step 7: Verify**

Run: `npm run typecheck && npm run lint`
Expected: PASS. If any icon is reported unused by eslint, remove it from the import list.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "refactor(cta): remove unused TryFreeCard, StepRow, KeyCap, ConfettiBurst, ProgressRing"
```

---

## Task 13: Full build verification

**Files:**
- No source changes in this task — verification only

- [ ] **Step 1: Run full check**

Run: `npm run check`
Expected: all three (lint + typecheck + build) pass clean. 35 routes build without warnings/errors.

- [ ] **Step 2: If any step fails — fix inline, rerun**

Common failures and fixes:
- **`react-hooks/set-state-in-effect`:** ensure no `setState` appears directly in an effect body (only inside timers / event callbacks).
- **Unused import:** delete the icon from the `lucide-react` import list.
- **Type error in HeroButton `disabled` prop:** `MagneticButton` may not accept `disabled`. If so, replace `disabled={disabled}` with `onClick={disabled ? undefined : handleClick}` and move the `disabled` styling to classes only.
- **motion variants type mismatch:** ensure all `motion.*` components with `variants={}` use compatible `Variants` objects.

After any fix, rerun `npm run check` until clean.

- [ ] **Step 3: Commit final polish (if fixes were needed)**

```bash
git add src/components/ui/CtaModal.tsx
git commit -m "fix(cta): resolve build issues in hero-ribbon refactor"
```

(Skip if no fixes needed.)

---

## Task 14: Final handoff to user

**Files:**
- No changes — just messaging

- [ ] **Step 1: Report status to user**

Tell the user:
> 🟢 CtaModal перестроен по спеке. Typecheck/lint/build чисты. Dev-server уже крутится на :3000 — открывай и смотри. Логику не трогал (`copyAndLaunch`, `useCtaModal`, escape, scroll lock, AbortError, fallback — дословно те же). Если визуально что-то не так — скажи какую секцию правим.

Do NOT dispatch Playwright / frontend-qa automatically — per project rule the user triggers visual QA themselves.

---

## Self-Review

### Spec coverage check

| Spec section | Implemented in task(s) |
|--------------|----------------------|
| Pure emerald palette (no violet) | Task 1 (mesh orb) |
| VPNOrbit demoted + acknowledgment flash | Task 2 |
| VPNOrbit pulse rings retimed to 4.8s + phase offset | Task 2 |
| VPNOrbit radial bleed | Task 2 |
| AuroraBacklight inside shell | Tasks 3-4 |
| HeroButton label "Try Free" + magnetic + glow | Task 5 |
| HeroButton post-click disabled, stays in place | Task 5 (disabled/opacity-35/pointer-events-none) |
| LaunchedChip above button, slide-in | Task 6 + Task 11 mount |
| SectionDivider "Затем в Проводнике:" | Task 7 + Task 11 mount |
| Vertical StepCard × 3 with dim/active states | Task 8 + Task 11 mount |
| StepperConnector vertical segments | Task 9 + Task 11 mount |
| Cascade via motion variants staggerChildren | Task 10 (timing) + Task 11 (no revealedIndex) |
| Remove `revealedIndex` state + cascade effect | Task 11 Step 2 |
| Remove unused TryFreeCard/StepRow/ConfettiBurst/ProgressRing/KeyCap | Task 12 |
| Logic preserved verbatim | Not changed by any task (copyAndLaunch, useCtaModal, escape, scroll lock, AbortError, fallback, focus management all untouched) |
| Reduced motion handling | Preserved via existing `reduceMotion` prop plumbing in Tasks 2, 3, 5 |
| Mobile <md: aside hidden, content full-width | Preserved via existing `hidden md:block` on aside (no change needed) |
| Number chip "01/02/03" rounded-lg (no Unicode) | Task 8 (`{`0${index + 1}`}` inside rounded-lg) |

All spec sections covered.

### Placeholder scan

No TBD / TODO / "implement later" markers. Every code block is complete and runnable.

### Type consistency

- `HeroButton` props: `state: "idle" | "copying" | "copied"`, `onClick: () => void` — matches call site.
- `StepCard` props: `step: StepSpec, index: number, active: boolean` — `StepSpec` exists at line 31; `active` driven by `copied`.
- `StepperConnector` props: `active: boolean` — same source.
- `VPNOrbit` props: `reduceMotion: boolean, acknowledged: boolean` — call site passes `!!reduceMotion` and `copied`.
- `AuroraBacklight` props: `reduceMotion: boolean` — call site passes `!!reduceMotion`.
- `LaunchedChip` props: none.
- `SectionDivider` props: none.
- Imports: `MagneticButton`, `BorderTrail`, `CheckCircle2`, `ArrowRight`, `ShieldCheck`, `Wifi`, `Sparkles`, `Globe`, `Key`, `Lock`, `X` all still referenced after cleanup.

### Tech-stack notes

- Project has no test runner by design. Verification = typecheck + lint + build. TDD loop replaced with "write → verify → commit" per task.
- Pre-commit hook enforces conventional commit format. All task commits use `feat/refactor/fix/style/chore(cta): ...`.
- Project lesson `react-hooks/set-state-in-effect`: no `setState` directly in `useEffect` body in any new code. All state changes happen in event handlers (onClick) or sync-setup paths, not effect bodies.

---

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-04-24-ctamodal-hero-ribbon.md`.

Два варианта запуска:

**1. Subagent-Driven (рекомендую)** — свежий subagent на каждую задачу, я ревьюю между тасками, быстрые итерации. Плюс: изоляция контекста. Минус: чуть дольше из-за переключений.

**2. Inline Execution** — выполняю задачи в этой же сессии через executing-plans, батчами с чекпоинтами. Плюс: один поток, без переключений. Минус: засоряется текущий контекст.

Какой вариант?
