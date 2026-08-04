import type { ComponentType } from "react";

import {
  BriefcaseIcon,
  FileTextIcon,
  GridPlusIcon,
  HeartIcon,
  type IconProps,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import type { FeatureCard } from "@/types";

/**
 * One `.fd-diff-card`: a {@link FeatureCard} whose serialisable `icon` key is
 * swapped for the rendered component, matching `TrustStat` in `TrustBar.tsx`.
 */
export interface DifferenceCard extends Omit<FeatureCard, "icon"> {
  Icon: ComponentType<IconProps>;
}

/** The four `.fd-diff-card` entries, copy verbatim from the source markup. */
export const DIFFERENCE_CARDS: readonly DifferenceCard[] = [
  {
    Icon: BriefcaseIcon,
    title: "Self-Employed Specialists",
    description:
      "We understand the unique challenges of self-employed income. From low-doc to full-doc, we find the right path.",
  },
  {
    Icon: GridPlusIcon,
    title: "Access to Accountants, Planners & Buyers Agents",
    description:
      "We connect you with trusted professionals — accountants, financial planners, and buyers agents — to support your goals.",
  },
  {
    Icon: FileTextIcon,
    title: "Self Declared Income Loans",
    description:
      "Flexible lending options that let you declare your income without traditional documentation hurdles.",
  },
  {
    Icon: HeartIcon,
    title: "Long Term Relationship",
    description:
      "We're not about one-off transactions. We build lasting partnerships to support your financial journey for years to come.",
  },
];

interface FundUpDifferenceProps {
  /** Defaults to {@link DIFFERENCE_CARDS}. */
  cards?: readonly DifferenceCard[];
  /** Extra classes merged onto the outer `<section>`. */
  className?: string;
}

/**
 * `section.fd-diff-section` — the dark "why choose us" band on `/`.
 *
 * Static, no interaction: the source declares no hover or transition rules for
 * any `.fd-diff-*` selector.
 *
 * Breakpoints are ported mobile-first so the source's `max-width` queries land
 * exactly — base = its `≤767px` block, `md:` (768px) = its `≤991px` block, and
 * `min-[992px]:` = the unqualified desktop values. See
 * `docs/research/components/difference-idealclient-cta.spec.md`.
 */
export function FundUpDifference({
  cards = DIFFERENCE_CARDS,
  className,
}: FundUpDifferenceProps) {
  return (
    <section
      className={cn(
        "font-inter bg-[#111] py-[48px] md:py-[64px] min-[992px]:py-[96px]",
        className,
      )}
    >
      <div className="mx-auto max-w-[1100px] px-[20px] md:px-[24px] min-[992px]:px-[40px]">
        <div className="mb-[36px] text-center md:mb-[48px] min-[992px]:mb-[64px]">
          <p className="mt-0 mb-[12px] text-[12px] font-semibold tracking-[0.15em] text-[#bc1a1a] uppercase">
            WHY CHOOSE US
          </p>
          <h2 className="font-inter mt-0 mb-[16px] text-[28px] leading-[1.15] font-bold tracking-[0] text-white md:text-[34px] md:tracking-[-0.5px] min-[992px]:text-[44px]">
            The FundUp difference
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] font-normal text-[#ffffff8c] md:text-[17px]">
            We&apos;re more than brokers — we&apos;re your lending partners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[36px] text-left md:grid-cols-2 md:gap-y-[40px] min-[992px]:grid-cols-4 min-[992px]:gap-x-[32px] min-[992px]:gap-y-0">
          {cards.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center p-[8px] text-center"
            >
              <div className="mb-[20px] flex size-[64px] shrink-0 items-center justify-center rounded-full border border-[#bc1a1a4d] bg-[#bc1a1a26] text-[#bc1a1a]">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-0 mb-[12px] text-[17px] leading-[1.3] font-bold text-white md:text-[18px]">
                {title}
              </h3>
              <p className="m-0 max-w-[260px] text-[15px] leading-[1.7] text-[#ffffff8c]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
