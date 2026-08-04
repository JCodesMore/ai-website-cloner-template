import { ArrowRightIcon, PhoneIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  /** Extra classes merged onto the outer `<section>`. */
  className?: string;
}

/**
 * `section#home.fu-hero-embed` — the homepage hero.
 *
 * Layered exactly like the source: a `background-image` div (z-0, swapped for a
 * mobile asset at `≤479px`), a gradient overlay div carrying the 1px `#6d5555`
 * outline (z-1), and the animated content column (z-10).
 *
 * The `heroSlideUp` keyframe lives in `globals.css`; the animation is skipped
 * for visitors who ask for reduced motion, which leaves the content in its
 * settled state (`opacity: 1`, untranslated).
 *
 * This is one of the bespoke `fu-` sections, so every text node is Inter rather
 * than the Flowkit body font.
 */
export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      id="home"
      className={cn(
        "relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-[#121212] pt-[140px] pb-[80px]",
        // `max-[480px]` compiles to `not all and (min-width:480px)`, i.e. the
        // source's `≤479px` query. `max-[479px]` would wrongly skip 479px itself.
        "max-[480px]:min-h-[auto] max-[480px]:pt-[100px] max-[480px]:pb-[60px]",
        className,
      )}
    >
      {/* Background — desktop asset, hidden below 480px. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[url('/images/hero-bg-desktop.webp')] bg-cover bg-no-repeat max-[480px]:hidden"
      />
      {/* Background — mobile asset, shown at ≤479px only. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 hidden bg-[url('/images/hero-bg-mobile.jpg')] bg-cover bg-no-repeat max-[480px]:block"
      />
      {/* Darkening overlay — keeps the reddish-grey hairline outline. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] border border-[#6d5555] bg-[linear-gradient(#000000bf,#000000a6)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[768px] animate-[heroSlideUp_0.7s_ease-out_forwards] px-[16px] text-center motion-reduce:animate-none">
        <p className="mb-[16px] font-inter text-[12px] font-semibold tracking-[0.15em] text-[#bfbfbf] uppercase">
          AUSTRALIAN MORTGAGE BROKER
        </p>

        <h1 className="mb-[24px] font-inter text-[clamp(2rem,8vw,3.75rem)] leading-[1.1] font-bold text-white">
          Funding solutions for <span className="text-[#bc1a1a]">wealth building</span> Australians
        </h1>

        <p className="mx-auto mb-[16px] max-w-[672px] font-inter text-[14px] leading-[1.6] font-normal text-[#ffffffcc]">
          Whether you&apos;re buying your first home, expanding an investment portfolio, or funding
          your business — we&apos;ve got you covered.
        </p>

        <p className="mb-[32px] font-inter text-[14px] font-semibold text-[#bc1a1a]">
          Free consultation &middot; No obligation &middot; Compare 40+ lenders
        </p>

        <div className="flex flex-wrap items-center justify-center gap-[16px]">
          <a
            href="#bpa-consent2"
            className="inline-flex h-[52px] items-center gap-[10px] rounded-[8px] bg-[#bc1a1a] px-[32px] font-inter text-[15px] font-bold whitespace-nowrap text-white shadow-[0_4px_20px_#0000004d] transition-[filter] duration-200 hover:brightness-110"
          >
            Get Your Free Assessment
            <ArrowRightIcon className="size-[18px] shrink-0" />
          </a>

          <a
            href="tel:0412885734"
            className="inline-flex h-[52px] items-center justify-center gap-[10px] rounded-[8px] border-2 border-[#bc1a1a] bg-transparent px-[32px] font-inter text-[15px] font-bold whitespace-nowrap text-[#bc1a1a] transition-[filter] duration-200 hover:brightness-110"
          >
            <PhoneIcon className="size-[18px] shrink-0" />
            Call 0412 885 734
          </a>
        </div>
      </div>
    </section>
  );
}
