import { Sparkles } from "lucide-react"

import {
  AikidoLogo,
  ParimLogo,
  LiveforceLogo,
  ParcellyLogo,
  FinbiteLogo,
  ParcelTrackerLogo,
  WhaleLogo,
} from "@/components/sites/handhold-io-1ee60dfc/shared/logos"

const MARQUEE_LOGOS = [
  { Logo: AikidoLogo, name: "Aikido" },
  { Logo: ParimLogo, name: "Parim" },
  { Logo: LiveforceLogo, name: "Liveforce" },
  { Logo: ParcellyLogo, name: "Parcelly" },
  { Logo: FinbiteLogo, name: "Finbite" },
  { Logo: ParcelTrackerLogo, name: "Parcel Tracker" },
  { Logo: WhaleLogo, name: "Whale" },
]

export function Hero() {
  return (
    <section className="relative grid h-[calc(100vh-72px)] w-full grid-rows-[minmax(max-content,1fr)_minmax(150px,auto)] overflow-hidden">
      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="mx-auto max-w-[683px] font-serif text-[36px] leading-[1] font-extralight tracking-[-1.08px] text-content-primary md:text-[56px] md:tracking-[-1.68px] lg:text-[72px] lg:leading-[72px] lg:tracking-[-2.16px]"
          style={{ animation: "hero-fade-up 0.6s ease-out both" }}
        >
          A dedicated guide for every buyer
        </h1>

        <p
          className="mt-4 text-sm text-content-secondary md:text-base md:leading-6"
          style={{ animation: "hero-fade-up 0.6s ease-out 0.1s both" }}
        >
          AI agents running tailored demos &amp; onboarding 24/7
        </p>

        <div
          className="mt-6 flex flex-row flex-wrap items-center justify-center gap-3"
          style={{ animation: "hero-fade-up 0.6s ease-out 0.2s both" }}
        >
          <button
            type="button"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-black px-4 text-sm text-white transition-colors hover:bg-black/85"
          >
            <Sparkles size={16} />
            See AI demo
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full bg-surface-elevated px-4 text-sm text-content-primary transition-colors hover:bg-border-strong/40"
          >
            Try for free
          </button>
        </div>
      </div>

      {/* Wave visual (decorative approximation of the original WebGL canvas) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] w-full overflow-hidden"
      >
        <svg
          className="h-full w-full animate-[wave-drift_20s_ease-in-out_infinite]"
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hero-wave-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B8DEF" />
              <stop offset="100%" stopColor="#A9C4F5" />
            </linearGradient>
            <linearGradient id="hero-wave-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8C79A" />
              <stop offset="100%" stopColor="#D9A75C" />
            </linearGradient>
          </defs>
          <path
            d="M0,320 C240,220 360,420 600,340 C840,260 960,140 1200,220 C1320,260 1380,300 1440,280 L1440,500 L0,500 Z"
            fill="url(#hero-wave-blue)"
            opacity="0.8"
          />
          <path
            d="M0,380 C220,320 420,460 660,380 C900,300 1020,200 1260,280 C1350,310 1400,350 1440,360 L1440,500 L0,500 Z"
            fill="url(#hero-wave-gold)"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Logo marquee */}
      <div
        className="relative flex items-end justify-center overflow-hidden pb-8"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="animate-logo-slide flex w-max flex-row items-center gap-12">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex flex-row items-center gap-12">
              {MARQUEE_LOGOS.map(({ Logo, name }) => (
                <Logo
                  key={`${copy}-${name}`}
                  className="h-5 w-auto shrink-0 text-content-primary md:h-6 lg:h-7"
                  aria-label={name}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wave-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-2%); }
        }
      `}</style>
    </section>
  )
}
