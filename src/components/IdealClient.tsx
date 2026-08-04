import type { ComponentType } from "react";

import {
  CheckCircleIcon,
  HandshakeIcon,
  TrendingUpIcon,
  WalletIcon,
  type IconProps,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import type { FeatureCard } from "@/types";

/**
 * One `.oc-card`: a {@link FeatureCard} plus the ghost numeral behind it and
 * the three ticked traits under the divider. The serialisable `icon` key is
 * swapped for the rendered component, matching `TrustStat` in `TrustBar.tsx`.
 */
export interface IdealClientCard extends Omit<FeatureCard, "icon"> {
  /** Two-digit ghost numeral, e.g. "01". */
  number: string;
  Icon: ComponentType<IconProps>;
  /** The three `.oc-list-item` labels. */
  traits: readonly string[];
}

/**
 * The three `.oc-card` entries, copy verbatim from the source markup.
 *
 * The hyphens in "Wealth‑Building", "long‑term", "Budget‑Conscious",
 * "Goal‑driven", "Long‑Term" and "one‑off" are U+2011 NON-BREAKING HYPHENs, not
 * ASCII `-`. Preserve them byte-for-byte — they stop those pairs wrapping.
 */
export const IDEAL_CLIENT_CARDS: readonly IdealClientCard[] = [
  {
    number: "01",
    Icon: TrendingUpIcon,
    title: "Wealth‑Building Mindset",
    description:
      "You see property as a vehicle for long‑term wealth — not just a place to live. You're ready to think strategically about your next move.",
    traits: ["Property investors", "Portfolio builders", "Strategic thinkers"],
  },
  {
    number: "02",
    Icon: WalletIcon,
    title: "Budget‑Conscious & Prepared",
    description:
      "You understand the value of a solid budget. Whether buying your first home or expanding a portfolio, you come prepared to invest wisely.",
    traits: ["Financially organised", "Goal‑driven savers", "Ready to act"],
  },
  {
    number: "03",
    Icon: HandshakeIcon,
    title: "Long‑Term Partnership",
    description:
      "You want a broker who grows with you — not a one‑off transaction. We're here for every milestone, from your first loan to your fifth.",
    traits: ["Relationship focused", "Repeat borrowers", "Trust over transactions"],
  },
];

interface IdealClientProps {
  /** Defaults to {@link IDEAL_CLIENT_CARDS}. */
  cards?: readonly IdealClientCard[];
  /** Extra classes merged onto the outer `<section>`. */
  className?: string;
}

/**
 * `section.oc-section` — the light "Our ideal client" band on `/`.
 *
 * Static, no interaction: the source declares no hover or transition rules for
 * any `.oc-*` selector.
 *
 * The source has **no** 991px or 767px overrides for this section — the header
 * stays a two-column flex row and the grid stays 3-up all the way down to
 * 480px. Its only query flips `.oc-grid` to `display:block` at `≤479px`, which
 * kills the 24px gaps and stacks the cards flush against each other.
 *
 * FIXED: kept as a grid at every width so the gap survives. Logged in
 * `docs/research/FIXES.md`; extraction detail in
 * `docs/research/components/difference-idealclient-cta.spec.md`.
 *
 * `min-[480px]:` is the mobile-first inverse of the source's `≤479px` query.
 * `max-[479px]:` would compile to `not all and (min-width:479px)` and wrongly
 * exclude 479px itself.
 */
export function IdealClient({ cards = IDEAL_CLIENT_CARDS, className }: IdealClientProps) {
  return (
    <section className={cn("font-inter box-border bg-[#eee] py-[96px]", className)}>
      <div className="mx-auto max-w-[1280px] px-[16px]">
        <div className="font-inter mb-[64px] flex flex-row items-end justify-end gap-[24px]">
          <div className="flex-1">
            <p className="m-0 mb-[12px] text-[12px] font-semibold tracking-[0.15em] text-[#bc1a1a] uppercase">
              Who We Work With
            </p>
            <h2 className="font-inter m-0 text-[44px] leading-[1.15] font-bold text-[#111]">
              Our ideal
              <br />
              <span className="text-[#bd1f1f]">client</span>
            </h2>
          </div>
          <p className="m-0 max-w-[420px] text-right text-[14px] leading-[1.7] text-[#666]">
            We do our best work with people who share these values — driven individuals
            building wealth through property.
          </p>
        </div>

        {/* FIXED: the source flips `.oc-grid` to `display:block` below 480px, which
            makes its 24px gaps inert and stacks the three cards flush against each
            other. Kept as a grid throughout so the gap survives; single column below
            480px, 3-up above — matching the source everywhere it isn't broken.
            See docs/research/FIXES.md. */}
        <div className="mx-auto grid max-w-[1024px] grid-cols-1 gap-[24px] min-[480px]:grid-cols-3">
          {cards.map(({ number, Icon, title, description, traits }) => (
            <div
              key={number}
              className="relative block overflow-hidden rounded-[16px] border-[1.5px] border-[#e5e7eb] bg-white p-[40px]"
            >
              <span className="absolute top-[16px] right-[24px] text-[64px] leading-none font-bold text-[#0000000f] select-none">
                {number}
              </span>
              <div className="relative z-10">
                <div className="mb-[24px] flex size-[56px] items-center justify-center rounded-[12px] border border-[#dc262633] bg-[#dc262614]">
                  <Icon className="size-[28px] text-[#dc2626]" />
                </div>
                <h3 className="font-inter m-0 mb-[12px] text-[20px] font-bold text-[#111]">{title}</h3>
                <p className="m-0 mb-[24px] text-[14px] leading-[1.7] text-[#555]">
                  {description}
                </p>
                <div className="flex flex-col gap-[10px] border-t border-[#e5e7eb] pt-[16px]">
                  {traits.map((trait) => (
                    <div
                      key={trait}
                      className="flex items-center gap-[10px] text-[14px] text-[#444]"
                    >
                      <CheckCircleIcon className="size-[16px] shrink-0 text-[#dc2626]" />
                      <span>{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
