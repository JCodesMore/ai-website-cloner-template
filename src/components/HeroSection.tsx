import { ArrowRightIcon } from "@/components/icons";
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

        {/* 60px flat, dropping to 36px at ≤479px — the source states both sizes
            explicitly on `.fu-hero-embed__h1`; there is no fluid step between. */}
        <h1 className="mb-[24px] font-inter text-[60px] leading-[1.1] font-bold text-white max-[480px]:mb-[16px] max-[480px]:text-[36px]">
          Funding solutions for <span className="text-[#bc1a1a]">wealth building</span> Australians
        </h1>

        {/* The dash before "tailored" is an em dash (U+2014); `self‑employed` is joined by a
            non-breaking hyphen (U+2011), not an ASCII `-`. Both are verbatim from the source. */}
        <p className="mx-auto mb-[16px] max-w-[672px] font-inter text-[14px] leading-[1.6] font-normal text-[#ffffffcc] max-[480px]:mb-[12px] max-[480px]:text-[16px]">
          Compare 40+ lenders in minutes. Home loans, investment loans, refinancing &amp; more —
          tailored for the self‑employed.
        </p>

        {/* Glyphs verbatim from the source: U+2713 ticks, each separator a space plus two
            U+00A0 plus a space, and `Australia‑wide` on a U+2011 non-breaking hyphen. */}
        <p className="mb-[32px] font-inter text-[14px] font-semibold text-[#bc1a1a]">
          {"✓ Free consultation    ✓ No obligation    ✓ Australia‑wide"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-[16px]">
          <a
            href="#bpa-consent2"
            className="inline-flex h-[52px] items-center gap-[10px] rounded-[8px] bg-[#bc1a1a] px-[32px] font-inter text-[15px] font-bold whitespace-nowrap text-white shadow-[0_4px_20px_#0000004d] transition-[filter] duration-200 hover:brightness-110"
          >
            Book a Free Consult
            {/* 16×16 in the source; `ArrowRightIcon` already ships `stroke-width: 2.5`. */}
            <ArrowRightIcon className="size-[16px] shrink-0" />
          </a>

          {/* No icon, and therefore no gap — `.fu-hero-embed__btn-ghost` declares neither. */}
          <a
            href="#services"
            className="inline-flex h-[52px] items-center justify-center rounded-[8px] border-2 border-[#bc1a1a] bg-transparent px-[32px] font-inter text-[15px] font-bold whitespace-nowrap text-[#bc1a1a] transition-[filter] duration-200 hover:brightness-110"
          >
            Our Services
          </a>
        </div>
      </div>
    </section>
  );
}
