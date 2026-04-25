import { docMetadata } from "@/lib/page-meta";
import { ROUTES } from "@/lib/site-routes";
import { syne } from "@/lib/proton-fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Flame, Globe, Laptop, Monitor, Smartphone, Tv } from "lucide-react";

const PRIMARY_PLATFORMS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  blurb: string;
}[] = [
  {
    id: "windows",
    label: "Windows",
    Icon: Monitor,
    blurb:
      "Full GUI for Windows 10 and 11 with tray controls, split tunneling, and kill switch. Ideal for laptops moving between office, home, and public Wi‑Fi.",
  },
  {
    id: "macos",
    label: "macOS",
    Icon: Laptop,
    blurb:
      "Universal build for Apple silicon and Intel. Integrates with menu bar, supports per-app exclusions, and follows macOS network extensions guidelines.",
  },
  {
    id: "android",
    label: "Android",
    Icon: Smartphone,
    blurb:
      "Google Play build plus optional APK for sideloading. Supports always-on VPN and per-app split tunneling on recent Android versions.",
  },
  {
    id: "ios",
    label: "iPhone / iPad",
    Icon: Smartphone,
    blurb:
      "Distributed via the App Store with on-demand rules compatible with iOS network extensions. Use the Shortcuts widget for quick connect.",
  },
];

const SECONDARY_PLATFORMS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  blurb: string;
}[] = [
  {
    id: "linux",
    label: "Linux",
    Icon: Laptop,
    blurb:
      "CLI for servers and headless boxes; graphical builds exist for major desktops. Package formats vary by distro — .deb, .rpm, or community packages.",
  },
  {
    id: "chrome",
    label: "Chrome",
    Icon: Globe,
    blurb:
      "Lightweight extension for Chromium — proxies browser tabs only. Pair with the desktop app for system-wide coverage.",
  },
  {
    id: "firefox",
    label: "Firefox",
    Icon: Globe,
    blurb:
      "Signed WebExtension with the same scope model as Chrome: web traffic inside Firefox uses the tunnel; other apps do not.",
  },
  {
    id: "chromebook",
    label: "Chromebook",
    Icon: Laptop,
    blurb:
      "Many Chromebooks run Android VPN clients; Linux (Crostini) has separate networking — confirm which mode matches your policy.",
  },
  {
    id: "apple-tv",
    label: "Apple TV",
    Icon: Tv,
    blurb:
      "tvOS clients focus on streaming reliability. Use Ethernet where possible for 4K throughput through the tunnel.",
  },
  {
    id: "android-tv",
    label: "Android TV",
    Icon: Tv,
    blurb:
      "Navigate with the D-pad, pin the app to the launcher, and set automatic connect for guest networks.",
  },
  {
    id: "fire-tv",
    label: "Fire TV",
    Icon: Flame,
    blurb:
      "Amazon Fire OS build from the Appstore. Side-loaded APKs skip automatic updates — prefer the store listing when available.",
  },
];

export const metadata = docMetadata(
  "Download",
  "/download",
  "Download VPN apps — demo hub with in-app links.",
);

export default function DownloadPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20 xl:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgb(16_185_129/_0.06),transparent_75%)]"
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <Link
          href={ROUTES.home}
          className="group/back inline-flex items-center gap-1.5 font-medium text-zinc-400 transition-colors hover:text-emerald-300"
        >
          <ArrowLeft
            className="size-3.5 transition-transform duration-200 group-hover/back:-translate-x-0.5"
            strokeWidth={2.2}
          />
          Home
        </Link>
      </nav>

      <h1
        className={cn(
          syne.className,
          "text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-[40px]",
        )}
      >
        Download AuraVPN
      </h1>
      <div className="mt-6 max-w-2xl space-y-3 text-pretty text-[15.5px] leading-relaxed text-zinc-400">
        <p>
          Pick your platform below. URLs use in-app anchors so the mega menu
          can deep-link (
          <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-sm text-zinc-300">
            /download#windows
          </code>
          ,{" "}
          <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-sm text-zinc-300">
            #macos
          </code>
          , etc.).
        </p>
        <p>
          After install, open the app to get your anonymous token. If you need
          feature comparisons first, open{" "}
          <Link
            href={ROUTES.features}
            className="font-medium text-emerald-400 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-300"
          >
            Features
          </Link>{" "}
          or{" "}
          <Link
            href={ROUTES.pricing}
            className="font-medium text-emerald-400 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-300"
          >
            Pricing
          </Link>
          .
        </p>
      </div>

      {/* Primary platforms */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {PRIMARY_PLATFORMS.map((p) => (
          <section
            key={p.id}
            id={p.id}
            className="scroll-mt-24 rounded-2xl border border-emerald-400/15 bg-white/[0.02] p-6 shadow-[0_0_32px_rgb(16_185_129/_0.06)] backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/25 hover:shadow-[0_0_40px_rgb(16_185_129/_0.1)] md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20">
                <p.Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <h2 className={cn(syne.className, "text-xl font-semibold text-zinc-50")}>
                {p.label}
              </h2>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
              {p.blurb}
            </p>
            <p className="mt-4 text-xs text-zinc-600">
              Production builds would live here. For now, return to{" "}
              <Link href={ROUTES.home} className="text-emerald-500/70 hover:text-emerald-400">
                Home
              </Link>{" "}
              or see{" "}
              <Link href={ROUTES.pricing} className="text-emerald-500/70 hover:text-emerald-400">
                Pricing
              </Link>
              .
            </p>
          </section>
        ))}
      </div>

      {/* Divider */}
      <div className="my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-600">
          More platforms
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      {/* Secondary platforms */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECONDARY_PLATFORMS.map((p) => (
          <section
            key={p.id}
            id={p.id}
            className="scroll-mt-24 rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-400">
                <p.Icon className="size-4" strokeWidth={1.75} aria-hidden />
              </div>
              <h2 className="text-[15px] font-semibold text-zinc-200">
                {p.label}
              </h2>
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-500">
              {p.blurb}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
