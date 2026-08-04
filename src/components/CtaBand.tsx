import { cn } from "@/lib/utils";
import type { CtaLink } from "@/types";

/**
 * The two `.ctab-btns` anchors, verbatim from the source markup.
 *
 * `primary` renders `.ctab-btn-dark`, `ghost` renders `.ctab-btn-light`.
 *
 * `#bpa-consent2` is the source's own target — the consent checkbox inside
 * `section#booking.bpa-section` further down `/`. Unusual, but the element does
 * exist, so this is not one of the broken anchors listed in
 * `docs/research/FIXES.md`.
 */
export const CTA_BAND_LINKS: readonly CtaLink[] = [
  { label: "Book Free Consultation →", href: "#bpa-consent2", variant: "primary" },
  { label: "Call 0412 885 734", href: "tel:0412885734", variant: "ghost" },
];

interface CtaBandProps {
  /** Defaults to "Ready to get the right loan?". */
  heading?: string;
  /** Defaults to the source's middle-dot separated trust line. */
  subheading?: string;
  /** Defaults to {@link CTA_BAND_LINKS}. */
  links?: readonly CtaLink[];
  /** Extra classes merged onto the outer `<section>`. */
  className?: string;
}

/**
 * `section.ctab-section` — the full-bleed red CTA band on `/`.
 *
 * Static, no interaction: the source declares no hover or transition rules for
 * any `.ctab-*` selector, and **no responsive overrides at all** — the 44px
 * heading and 64px/24px padding hold at every width, with the buttons wrapping
 * via `flex-wrap`.
 *
 * `#e61919` is a brighter red than the brand `#bc1a1a`; it is preserved
 * literally per the "three reds" decision in `docs/research/FIXES.md`.
 *
 * The light button carries a 2px border the dark one lacks, so on the original
 * it is 4px taller and `align-items: stretch` pulls the dark button up to match.
 * Rendering both as centred inline-flex reproduces that end state exactly —
 * both labels land 16px from the top of their border box.
 */
export function CtaBand({
  heading = "Ready to get the right loan?",
  subheading = "Free consultation · No obligation · Compare 40+ lenders in minutes",
  links = CTA_BAND_LINKS,
  className,
}: CtaBandProps) {
  return (
    <section className={cn("font-inter bg-[#e61919] px-[24px] py-[64px]", className)}>
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-[16px] text-center">
        <h2 className="font-inter m-0 text-[44px] leading-[1.15] font-bold text-white">
          {heading}
        </h2>
        <p className="font-inter m-0 text-[15px] text-[#ffffffd9]">{subheading}</p>
        <div className="mt-[8px] flex flex-wrap justify-center gap-[16px]">
          {links.map(({ label, href, variant }) => (
            <a
              key={href}
              href={href}
              className={cn(
                "font-inter inline-flex items-center justify-center gap-[6px] rounded-[8px] px-[28px] py-[14px] text-[15px] font-semibold no-underline",
                variant === "primary"
                  ? "bg-[#1a1a1a] text-white"
                  : "border-2 border-white bg-white text-[#1a1a1a]",
              )}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
