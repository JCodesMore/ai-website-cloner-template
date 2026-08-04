import type { ComponentType } from "react";

import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, type IconProps } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ContactItem {
  Icon: ComponentType<IconProps>;
  text: string;
  /** Absent for the two non-link rows, which the source renders as `div.git-item`. */
  href?: string;
}

/** The four `.git-item` rows, verbatim from the source markup. */
export const GET_IN_TOUCH_ITEMS: readonly ContactItem[] = [
  { Icon: PhoneIcon, text: "0412 885 734", href: "tel:0412885734" },
  { Icon: MailIcon, text: "ned@fundup.au", href: "mailto:ned@fundup.au" },
  { Icon: MapPinIcon, text: "Australia-wide" },
  { Icon: ClockIcon, text: "Available 24/7/365" },
];

interface GetInTouchProps {
  /** Defaults to the `/` and `/contact` heading. `/book-a-consultation` passes its own. */
  heading?: string;
  /** Defaults to the `/` and `/contact` sub-copy. */
  subheading?: string;
  /** `/book-a-consultation` omits `.git-list` entirely — pass `false` there. */
  showContactList?: boolean;
  /** Extra classes merged onto the outer `<main>`. */
  className?: string;
}

/**
 * `main#contact-git.git-section` — the black contact band on `/`, `/contact` and
 * `/book-a-consultation`.
 *
 * Fully static: the source declares **zero** `:hover`, `:focus` or `transition` rules for any
 * `.git-*` selector.
 *
 * Two things that look like mistakes but are faithful to the original:
 *
 * 1. **It really is a `<main>`.** And it is the only `<main>` in the document on every page that
 *    carries it. `layout.tsx` wraps children in a plain `<div>`, so this stays valid — but route
 *    agents must not wrap the page in a second `<main>`.
 * 2. **It starts at `<h2>`; there is no `<h1>` on these pages.** Recorded under "Deliberately
 *    preserved" in `docs/research/FIXES.md`.
 *
 * 3. **Contrast fix applied.** The source sets `.git-text` to `#333` on a `#000` section — a
 *    1.3:1 ratio that makes all four contact lines effectively invisible on the live site. We
 *    use `#fdf6f6` (the colour `.git-h2` already uses in the same section) instead. This is a
 *    deliberate divergence, logged in `docs/research/FIXES.md`.
 */
export function GetInTouch({
  heading = "Ready to get funded?",
  subheading = "Book a free, no-obligation consultation. We'll review your situation and find the right lending solution for you.",
  showContactList = true,
  className,
}: GetInTouchProps) {
  return (
    <main
      id="contact-git"
      className={cn(
        "box-border bg-black px-[16px] pt-[32px] pb-[10px] font-inter min-[480px]:pt-[40px] md:pt-[48px] min-[992px]:px-0 min-[992px]:pt-[96px]",
        className,
      )}
    >
      {/* .git-container — block padding only below 768px */}
      <div className="mx-auto box-border w-full max-w-full px-[16px] py-[32px] text-center font-inter min-[480px]:py-[40px] md:max-w-[600px] md:py-0">
        <p className="mb-[16px] text-[12px] font-semibold tracking-[0.15em] text-[#bc1a1a] uppercase">
          Get In Touch
        </p>

        <h2 className="mb-[20px] text-center font-inter text-[22px] leading-[1.15] font-bold text-[#fdf6f6] min-[480px]:text-[26px] md:text-[32px] min-[992px]:text-[44px]">
          {heading}
        </h2>

        <p className="mb-[32px] block max-w-full px-[8px] text-center text-[14px] leading-[1.7] text-[#888888] md:mb-[48px] md:inline-block md:max-w-[480px] md:px-0">
          {subheading}
        </p>

        {showContactList && (
          <div className="inline-flex flex-col gap-[20px] text-left">
            {GET_IN_TOUCH_ITEMS.map(({ Icon, text, href }) => {
              const body = (
                <>
                  <span className="flex size-[36px] shrink-0 items-center justify-center rounded-full border border-[#bc1a1a26] bg-[#bc1a1a14]">
                    <Icon className="size-[18px] text-brand-contact" />
                  </span>
                  {/* FIXED: source is #333 on a #000 section — 1.3:1 contrast, which
                      renders the phone, email and hours effectively invisible. Uses
                      #fdf6f6, the colour .git-h2 already uses in this same section. */}
                  <span className="text-[15px] font-medium text-[#fdf6f6]">{text}</span>
                </>
              );

              return href ? (
                <a
                  key={text}
                  href={href}
                  className="flex items-center gap-[14px] text-inherit no-underline"
                >
                  {body}
                </a>
              ) : (
                <div key={text} className="flex items-center gap-[14px] text-inherit">
                  {body}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
