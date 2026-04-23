"use client";

import { type CtaVariant, useCtaModal } from "@/context/CtaModalContext";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import {
  Apple,
  CheckCircle2,
  ClipboardCopy,
  Laptop,
  Lock,
  Monitor,
  ShieldCheck,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─── OS detection ─── */
type Platform = "windows" | "macos" | "linux" | "android" | "ios" | "other";

type PlatformMeta = {
  label: string;
  fileName: string;
  size: string;
  installCmd: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  steps: readonly StepSpec[];
};

type StepSpec = {
  keys: readonly (string | { icon: "win" })[];
  label: string;
  desc: string;
};

const WIN_STEPS: readonly StepSpec[] = [
  {
    keys: [{ icon: "win" }, "R"],
    label: "Open the Run dialog",
    desc: "Press Win+R to launch Windows Run.",
  },
  {
    keys: ["Ctrl", "V"],
    label: "Paste the install command",
    desc: "We already copied it to your clipboard.",
  },
  {
    keys: ["Enter"],
    label: "Press Enter to install",
    desc: "Signed PowerShell script downloads, verifies SHA-256, and launches AuraVPN.",
  },
];

const MAC_STEPS: readonly StepSpec[] = [
  {
    keys: ["⌘", "Space"],
    label: "Open Spotlight",
    desc: "Spotlight lets you launch Terminal quickly.",
  },
  {
    keys: ["T", "E", "R", "M"],
    label: "Type 'Terminal' then Return",
    desc: "Any terminal works — iTerm or Warp are fine too.",
  },
  {
    keys: ["⌘", "V"],
    label: "Paste and run the command",
    desc: "We already copied the signed install script to your clipboard.",
  },
];

const LINUX_STEPS: readonly StepSpec[] = [
  {
    keys: ["Ctrl", "Alt", "T"],
    label: "Open a terminal",
    desc: "Standard shortcut on GNOME, KDE, Xfce, and most desktops.",
  },
  {
    keys: ["Ctrl", "Shift", "V"],
    label: "Paste the install command",
    desc: "We already copied it to your clipboard.",
  },
  {
    keys: ["Enter"],
    label: "Press Enter",
    desc: "The script adds the APT/RPM repo, installs the daemon, and starts it.",
  },
];

const MOBILE_STEPS: readonly StepSpec[] = [
  {
    keys: ["TAP"],
    label: "Open the store link",
    desc: "We'll redirect you to the official AuraVPN app listing.",
  },
  {
    keys: ["GET"],
    label: "Install the app",
    desc: "Tap Install/Get and wait for the download to finish.",
  },
  {
    keys: ["RUN"],
    label: "Launch and paste your token",
    desc: "Open AuraVPN, paste the access token, and tap Connect.",
  },
];

const PLATFORMS: Record<Platform, PlatformMeta> = {
  windows: {
    label: "Windows",
    fileName: "auravpn-win-x64-setup.exe",
    size: "48 MB",
    installCmd: `powershell -Command "iwr -useb https://auravpn.example/install.ps1 | iex"`,
    Icon: Monitor,
    steps: WIN_STEPS,
  },
  macos: {
    label: "macOS",
    fileName: "install.sh",
    size: "62 MB",
    installCmd: `/bin/bash -c "$(curl -fsSL https://auravpn.example/install.sh)"`,
    Icon: Apple,
    steps: MAC_STEPS,
  },
  linux: {
    label: "Linux",
    fileName: "install.sh",
    size: "22 MB",
    installCmd: `curl -fsSL https://auravpn.example/install.sh | sudo bash`,
    Icon: Terminal,
    steps: LINUX_STEPS,
  },
  android: {
    label: "Android",
    fileName: "Play Store · AuraVPN",
    size: "28 MB",
    installCmd: "https://play.google.com/store/apps/details?id=com.auravpn",
    Icon: Laptop,
    steps: MOBILE_STEPS,
  },
  ios: {
    label: "iOS",
    fileName: "App Store · AuraVPN",
    size: "—",
    installCmd: "https://apps.apple.com/app/auravpn",
    Icon: Apple,
    steps: MOBILE_STEPS,
  },
  other: {
    label: "Your device",
    fileName: "install.sh",
    size: "—",
    installCmd: `curl -fsSL https://auravpn.example/install.sh | bash`,
    Icon: Laptop,
    steps: LINUX_STEPS,
  },
};

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  const plat = (navigator.platform || "").toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/mac/.test(plat) || /mac/.test(ua)) return "macos";
  if (/win/.test(plat) || /windows/.test(ua)) return "windows";
  if (/linux|x11/.test(plat) || /linux/.test(ua)) return "linux";
  return "other";
}

const SELECTABLE: readonly Platform[] = ["windows", "macos", "linux"];

/* ─── per-variant copy ─── */
const VARIANT_CONFIG: Record<
  CtaVariant,
  { badge: string; badgeCls: string; title: string; desc: string }
> = {
  free: {
    badge: "FREE",
    badgeCls: "bg-zinc-700/80 text-zinc-300 border-zinc-600/50",
    title: "Install AuraVPN in three keystrokes",
    desc: "Click Install — we'll copy the signed command to your clipboard. Then follow the three steps on the right.",
  },
  plus: {
    badge: "PLUS",
    badgeCls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    title: "Install AuraVPN Plus",
    desc: "10 Gbps · 15 000+ servers. Click Install to copy the signed command, then follow the keystrokes on the right.",
  },
  business: {
    badge: "BUSINESS",
    badgeCls: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
    title: "Install AuraVPN for Business",
    desc: "MDM-friendly installers. Click Install to copy the signed enrollment command, then run it on each seat.",
  },
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export function CtaModal() {
  const { open, variant, closeModal } = useCtaModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cfg = VARIANT_CONFIG[variant];

  const [platform, setPlatform] = useState<Platform>("other");
  const [copied, setCopied] = useState(false);

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

  const handleClose = () => {
    setCopied(false);
    closeModal();
  };

  const meta = PLATFORMS[platform];
  const copyAndLaunch = async () => {
    const cmd = meta.installCmd;
    try {
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
      setCopied(true);
      if (platform === "android" || platform === "ios") {
        window.open(cmd, "_blank", "noopener,noreferrer");
      }
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {/* ── backdrop ── */}
      <div
        aria-hidden
        onClick={handleClose}
        className={cn(
          "fixed inset-0 z-[80] transition-opacity duration-300",
          "bg-black/88 backdrop-blur-md",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      <div
        className={cn(
          "fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal
          aria-label="Install AuraVPN"
          tabIndex={-1}
          className={cn(
            "relative w-full max-w-[900px] overflow-hidden rounded-[28px]",
            "border border-white/[0.07]",
            "bg-[oklch(0.07_0_0)]",
            "shadow-[0_48px_120px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.04)]",
            "flex flex-col md:flex-row",
            "transition-all duration-300 ease-out will-change-transform",
            open
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-[0.94] opacity-0 translate-y-4",
            "focus-visible:outline-none",
          )}
        >
          <LeftPanel
            cfg={cfg}
            meta={meta}
            copied={copied}
            platform={platform}
            onPick={(p) => {
              setPlatform(p);
              setCopied(false);
            }}
          />

          {/* ════════════ RIGHT PANEL ════════════ */}
          <div className="relative flex flex-1 flex-col p-7 sm:p-9">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-white/[0.07] hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              <X className="size-4" strokeWidth={2} />
            </button>

            <div className="mb-6 pr-8">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-400/60">
                {copied
                  ? "Command copied — follow these steps"
                  : "Click Install below, then follow these steps"}
              </p>
              <h2 className="text-[22px] font-semibold leading-[1.2] tracking-[-0.025em] text-zinc-50">
                {cfg.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
                {cfg.desc}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {meta.steps.map((step, i) => (
                <StepRow
                  key={i}
                  step={step}
                  index={i}
                  active={copied && i === 0}
                />
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="text-[12.5px] font-medium uppercase tracking-wider text-zinc-600 transition-colors hover:text-zinc-400 focus-visible:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={copyAndLaunch}
                className={cn(
                  "group inline-flex items-center gap-2.5 rounded-xl px-7 py-3 text-[14px] font-bold uppercase tracking-[0.01em]",
                  "bg-emerald-500 text-[oklch(0.07_0_0)]",
                  "shadow-[0_0_0_1px_rgb(16_185_129/0.4),0_6px_24px_rgb(16_185_129/0.35),0_3px_0_rgb(0_0_0/0.3)]",
                  "transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_0_1px_rgb(16_185_129/0.5),0_8px_32px_rgb(16_185_129/0.5)] active:translate-y-[1px] active:scale-[0.97] active:shadow-[0_0_0_1px_rgb(16_185_129/0.4),0_4px_16px_rgb(16_185_129/0.35)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
                )}
              >
                {copied ? (
                  <>
                    Copied — follow steps
                    <CheckCircle2 className="size-4" strokeWidth={2.5} />
                  </>
                ) : (
                  <>
                    Install · {meta.label}
                    <ClipboardCopy className="size-4" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP ROW — key caps like the reference
═══════════════════════════════════════════════════════════ */
function StepRow({
  step,
  index,
  active,
}: {
  step: StepSpec;
  index: number;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-5 rounded-2xl px-4 py-3.5 transition-all duration-200",
        active
          ? "border border-emerald-500/[0.22] bg-[oklch(0.09_0.005_156)] hover:border-emerald-500/[0.32] hover:bg-[oklch(0.095_0.006_156)]"
          : "border border-white/[0.05] bg-[oklch(0.085_0_0)] hover:border-white/[0.1] hover:bg-[oklch(0.09_0_0)]",
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        {step.keys.map((key, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span
                className={cn(
                  "select-none font-mono text-base font-semibold",
                  active ? "text-emerald-500/50" : "text-zinc-700",
                )}
              >
                +
              </span>
            )}
            <KeyCap accent={active} wide={typeof key === "string" && key.length > 1}>
              {typeof key === "string" ? (
                <span
                  className={cn(
                    "font-mono text-[11.5px] font-bold uppercase tracking-[0.08em]",
                    active ? "text-emerald-200" : "text-zinc-300",
                  )}
                >
                  {key}
                </span>
              ) : (
                <WinLogo active={active} />
              )}
            </KeyCap>
          </div>
        ))}
      </div>

      <div className="flex-1">
        <p
          className={cn(
            "text-[14px] font-semibold leading-tight tracking-[-0.01em]",
            active ? "text-zinc-50" : "text-zinc-200",
          )}
        >
          {step.label}
        </p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-600">
          {step.desc}
        </p>
      </div>

      <div
        className={cn(
          "ml-auto flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
          active
            ? "bg-emerald-500/15 text-emerald-400/70"
            : "bg-white/[0.05] text-zinc-600",
        )}
      >
        {index + 1}
      </div>
    </div>
  );
}

function WinLogo({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn(
        "size-[14px]",
        active ? "fill-emerald-200" : "fill-zinc-300",
      )}
      aria-hidden
    >
      <path d="M0 2.25L6.5 1.36v6.21H0V2.25zM7.25 1.26L16 0v7.57H7.25V1.26zM0 8.43h6.5v6.21L0 13.75V8.43zM7.25 8.43H16V16l-8.75-1.26V8.43z" />
    </svg>
  );
}

function KeyCap({
  children,
  accent,
  wide,
}: {
  children: ReactNode;
  accent?: boolean;
  wide?: boolean;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex select-none items-center justify-center",
        "rounded-[9px]",
        wide ? "h-[42px] min-w-[56px] px-3" : "size-[42px]",
        accent
          ? [
              "border border-b-black/70 border-l-emerald-500/20 border-r-emerald-500/20 border-t-emerald-500/30",
              "bg-gradient-to-b from-[oklch(0.14_0.02_156)] to-[oklch(0.10_0.015_156)]",
              "shadow-[0_4px_0_rgb(0_0_0/0.55),0_8px_24px_rgb(16_185_129/0.12),inset_0_1px_0_rgb(16_185_129/0.25)]",
            ].join(" ")
          : [
              "border border-b-black/70 border-l-white/[0.10] border-r-white/[0.10] border-t-white/[0.16]",
              "bg-gradient-to-b from-[oklch(0.15_0_0)] to-[oklch(0.10_0_0)]",
              "shadow-[0_4px_0_rgb(0_0_0/0.6),0_8px_20px_rgb(0_0_0/0.25),inset_0_1px_0_rgb(255_255_255/0.10)]",
            ].join(" "),
      )}
    >
      {children}
    </kbd>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEFT PANEL  — preview + OS switcher
═══════════════════════════════════════════════════════════ */
function LeftPanel({
  cfg,
  meta,
  copied,
  platform,
  onPick,
}: {
  cfg: (typeof VARIANT_CONFIG)[CtaVariant];
  meta: PlatformMeta;
  copied: boolean;
  platform: Platform;
  onPick: (p: Platform) => void;
}) {
  const PlatIcon = meta.Icon;

  return (
    <div
      className={cn(
        "relative hidden flex-col justify-between overflow-hidden md:flex",
        "w-[288px] shrink-0 rounded-l-[28px] p-7",
        "border-r border-white/[0.05] bg-[oklch(0.045_0_0)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/[0.12] blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/[0.06] blur-[80px]"
      />

      {/* TOP */}
      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-zinc-600">
            INSTALLER
          </span>
          <span
            className={cn(
              "rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]",
              cfg.badgeCls,
            )}
          >
            {cfg.badge}
          </span>
        </div>

        {/* installer card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="relative flex items-center justify-center py-8">
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-500/[0.08] to-transparent"
            />
            <span
              aria-hidden
              className="absolute size-[110px] animate-ping rounded-full border border-emerald-500/[0.12]"
              style={{ animationDuration: "3.5s" }}
            />
            <span
              aria-hidden
              className="absolute size-[80px] animate-pulse rounded-full border border-emerald-500/[0.22]"
              style={{ animationDuration: "2s" }}
            />
            <div className="relative flex size-[64px] items-center justify-center rounded-[20px] border border-emerald-500/30 bg-gradient-to-b from-emerald-500/20 to-emerald-500/8 shadow-[0_0_40px_rgb(16_185_129/0.3),0_4px_16px_rgb(0_0_0/0.4),inset_0_1px_0_rgb(16_185_129/0.4)]">
              <PlatIcon className="size-8 text-emerald-400" strokeWidth={1.5} />
            </div>
          </div>

          <div className="border-t border-white/[0.06] bg-black/20 px-5 py-3.5">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-zinc-600">
              {meta.label} · {meta.size}
            </p>
            <p className="mt-0.5 truncate font-mono text-[12px] font-semibold tracking-tight text-zinc-100">
              {meta.fileName}
            </p>
            <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
              <span
                aria-hidden
                className={cn(
                  "block h-full rounded-full",
                  copied
                    ? "w-full bg-emerald-400 transition-all duration-500"
                    : "w-[55%] bg-gradient-to-r from-transparent via-emerald-400 to-transparent",
                )}
                style={
                  copied
                    ? undefined
                    : { animation: "cta-scan 2.4s ease-in-out infinite" }
                }
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span
                className={cn(
                  "font-mono text-[9px] uppercase",
                  copied ? "text-emerald-300" : "text-zinc-700",
                )}
              >
                {copied ? "COMMAND COPIED" : "READY"}
              </span>
              <span className="font-mono text-[9px] text-zinc-600">
                {meta.size}
              </span>
            </div>
          </div>
        </div>

        {/* OS picker */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
          {SELECTABLE.map((p) => {
            const isActive = p === platform;
            const P = PLATFORMS[p];
            const Ico = P.Icon;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPick(p)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors",
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
                aria-pressed={isActive}
              >
                <Ico className="size-3" strokeWidth={2} />
                {P.label}
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1">
            <Zap className="size-2.5 text-zinc-600" strokeWidth={2} aria-hidden />
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              WireGuard
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1">
            <Lock className="size-2.5 text-zinc-600" strokeWidth={2} aria-hidden />
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              No Logs
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/50" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[8.5px] font-bold uppercase tracking-[0.22em] text-emerald-400/80">
            Signed command
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-zinc-200">
          <ShieldCheck className="size-3.5 text-emerald-400" strokeWidth={2} aria-hidden />
          AuraVPN Install Protocol
        </p>
        <p className="mt-0.5 text-[10px] text-zinc-600">
          SHA-256 verified · Auto-update enabled
        </p>
      </div>
    </div>
  );
}
