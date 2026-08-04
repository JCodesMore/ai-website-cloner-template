import type { ComponentType } from "react";

import {
  ClockIcon,
  DollarSignIcon,
  type IconProps,
  LayoutIcon,
  StarIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Stat } from "@/types";

/** A trust-bar figure: a {@link Stat} plus the icon that leads it. */
export interface TrustStat extends Stat {
  Icon: ComponentType<IconProps>;
}

/**
 * The four figures under the hero.
 *
 * Icons are the source's own inline SVGs, in the source's own order:
 * dollar-sign, star, layout, clock (each shipped at 20×20).
 *
 * "24hr" is labelled "Turnaround" — the live site repeats "Lenders Compared"
 * there, which is a copy/paste bug (see `docs/research/FIXES.md` #5).
 */
export const TRUST_STATS: readonly TrustStat[] = [
  { value: "40+", label: "Lenders Compared", Icon: DollarSignIcon },
  { value: "500+", label: "Clients Helped", Icon: StarIcon },
  { value: "24hr", label: "Turnaround", Icon: LayoutIcon },
  { value: "10+ Yrs", label: "Industry Experience", Icon: ClockIcon },
];

interface TrustBarProps {
  /** Defaults to {@link TRUST_STATS}. */
  stats?: readonly TrustStat[];
  /** Extra classes merged onto the outer `<section>`. */
  className?: string;
}

/**
 * `section.trust-bar` — the static stats band directly below the hero.
 *
 * Four columns on the source; collapsed to two below `md` so the figures stay
 * legible at 390px instead of crushing 4-up.
 */
export function TrustBar({ stats = TRUST_STATS, className }: TrustBarProps) {
  return (
    <section
      className={cn("border-b border-[#ffffff1a] bg-[#0f0f0f] pt-[24px] pb-[24px]", className)}
    >
      <div className="mx-auto max-w-[1280px] px-[16px]">
        <div className="grid auto-rows-[minmax(55px,1fr)] grid-cols-2 gap-[24px] md:grid-cols-4">
          {stats.map(({ value, label, Icon }) => (
            <div key={label} className="flex items-center justify-center gap-[12px]">
              <Icon className="size-5 shrink-0 text-[#bc1a1a]" />
              <div className="flex flex-col gap-[2px]">
                <p className="text-[18px] leading-none font-bold text-white">{value}</p>
                <p className="font-inter text-[12px] text-[#ffffff99]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
