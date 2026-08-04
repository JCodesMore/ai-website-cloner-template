import Image from "next/image";
import type { ComponentType, ReactElement } from "react";

import { AwardIcon, type IconProps, PhoneIcon, UserIcon, UsersIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * `section#about.about-section` from fundup.au — Ned McLachlan's bio block,
 * rendered identically on `/` and `/services`.
 *
 * Fully static: nothing in this section has a `:hover`, a transition, or a
 * script attached. See `docs/research/components/services-and-about.spec.md`
 * for the CSS extraction and the two Webflow inheritance quirks that are
 * reproduced deliberately (the `h2` reset's 20px `margin-top`, and the body's
 * absolute `line-height: 20px` on the elements that never declare one).
 */

/** All three award credits use the same rosette SVG in the source. */
const AWARDS: readonly string[] = [
  "Emerging Broker of the Year 2023",
  "National Winner — Most Sales, Emerging Broker Q3 & Q4 2023",
  "State Winner — Most Sales, Emerging Broker Q3 & Q4 2023",
];

interface KeyPoint {
  icon: ComponentType<IconProps>;
  title: string;
  body: string;
}

const KEY_POINTS: readonly KeyPoint[] = [
  {
    icon: PhoneIcon,
    title: "No Chatbots",
    body: "You’ll speak directly with me – a real person who understands your situation.",
  },
  {
    icon: UsersIcon,
    title: "No Telemarketers",
    body: "No call centres, no being passed around. I handle your loan from start to finish.",
  },
  {
    icon: UserIcon,
    title: "One Point of Contact",
    body: "I’m your broker, your advocate, and your go-to throughout the entire process.",
  },
];

const BODY_ONE =
  "I started FundUp because I was frustrated by the mortgage industry’s obsession with volume over " +
  "people. Too many brokers treat clients like numbers. I built this business around the opposite " +
  "philosophy — that every borrower deserves honest, personalised advice from someone who actually " +
  "picks up the phone.";

const BODY_TWO =
  "With 40+ lenders on my panel and a deep specialisation in self-employed lending, I have the tools " +
  "to find solutions that the big banks and call centres simply can’t. My results speak for " +
  "themselves — but more importantly, so do my clients.";

/**
 * `.about-section_photo` — `width: 100%; height: auto; min-height: 300px`,
 * capped at 400px tall below 768px.
 *
 * The source's ≤479px rule is `width: 479px; max-width: 361px; height: 767px`,
 * which overflows a 390px viewport by 3px. Kept as `w-full max-w-[361px]` so it
 * matches at every width the original didn't already break at.
 */
const PHOTO_CLASS =
  "block h-auto min-h-[300px] w-full rounded-2xl bg-[#f3f4f6] object-cover " +
  "shadow-[0_20px_40px_#00000026] max-md:max-h-[400px] " +
  "max-[480px]:h-[400px] max-[480px]:max-w-[361px]";

/** `.about-section_badge` — 12px/700 on the body's inherited `line-height: 20px`. */
const BADGE_CLASS =
  // Source declares 8px — `rounded-lg` is 12px against this project's scale.
  "absolute -bottom-3 -right-3 whitespace-nowrap rounded-[8px] bg-[#1a1a1a] px-4 py-2 " +
  "text-xs font-bold leading-5 text-white shadow-[0_2px_8px_#0003]";

/** `.about-award-item` */
const AWARD_ITEM_CLASS =
  // Source declares 12px — `rounded-xl` is 16px against this project's scale.
  "flex items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 " +
  "shadow-[0_1px_3px_#00000014]";

/** `.about-body` — `--last` bumps the bottom margin to 24px. */
const BODY_CLASS = "mt-0 mb-4 text-sm leading-[1.6] text-[#6b7280]";

interface AboutNedProps {
  /** Extra classes for the `<section>` — e.g. per-page vertical rhythm. */
  className?: string;
}

export function AboutNed({ className }: AboutNedProps): ReactElement {
  return (
    <section id="about" className={cn("bg-white py-20 font-inter", className)}>
      {/* .about-section_container */}
      <div className="mx-auto grid max-w-[1024px] grid-cols-1 items-start gap-10 px-4 md:grid-cols-[2fr_3fr]">
        {/* .about-section_left */}
        <div>
          <div className="relative">
            <Image
              src="/images/ned-mclachlan.webp"
              alt="Ned McLachlan – FundUp Mortgage Broker"
              width={479}
              height={767}
              loading="eager"
              sizes="(max-width: 767px) 100vw, 400px"
              className={PHOTO_CLASS}
            />
            <div className={BADGE_CLASS}>Director &amp; Broker</div>
          </div>

          {/* .about-section_awards */}
          <div className="mt-6 flex flex-col gap-3">
            {AWARDS.map((award) => (
              <div key={award} className={AWARD_ITEM_CLASS}>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#bc1a1a1a]">
                  <AwardIcon className="size-4 text-[#bc1a1a]" />
                </div>
                <div className="text-xs font-bold leading-[1.4] text-[#111827]">{award}</div>
              </div>
            ))}
          </div>
        </div>

        {/* .about-section_right */}
        <div>
          {/* Not the `.eyebrow` utility — that one is .9rem/.01em. This is 12px/.15em. */}
          <p className="mb-2 text-xs font-semibold uppercase leading-5 tracking-[.15em] text-[#bc1a1a]">
            About Me
          </p>
          <h2 className="mb-2 mt-5 font-inter text-[36px] font-bold leading-[1.15] text-[#111827] min-[992px]:text-[44px]">
            Ned McLachlan
          </h2>
          <p className="mt-0 mb-5 text-base font-medium leading-5 text-[#bc1a1a]">
            Award-Winning Broker – Not a Call Centre
          </p>
          <p className={BODY_CLASS}>{BODY_ONE}</p>
          <p className={cn(BODY_CLASS, "mb-6")}>{BODY_TWO}</p>

          {/* .about-section_features */}
          <div className="flex flex-col gap-4">
            {KEY_POINTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4">
                {/* .about-feature_icon-wrap — source declares 8px, not 12px. */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#bc1a1a1a]">
                  <Icon className="size-[18px] text-[#bc1a1a]" />
                </div>
                <div>
                  <div className="mb-0.5 text-sm font-semibold leading-5 text-[#111827]">
                    {title}
                  </div>
                  <div className="text-sm leading-[1.5] text-[#6b7280]">{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
