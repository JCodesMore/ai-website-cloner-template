import Link from "next/link";

import type { Stat } from "@/types";

/** `.ldl-stat` ×4 — the white stats band in the hero's right column. */
const HERO_STATS: readonly Stat[] = [
  { value: "40+", label: "Lenders compared" },
  { value: "95%", label: "Max LVR available" },
  { value: "48hr", label: "Pre-approval turnaround" },
  { value: "$0", label: "Cost to you" },
];

/**
 * `section.ldl-hero` — the `/low-doc-loans` hero plus the stats band it contains.
 *
 * Two columns on desktop (`space-between`, 48px gap, 480px-capped copy on the left, a 2×2 stats
 * grid on the right), stacking at 992px. When it stacks the source keeps the 48px flex gap *and*
 * adds `margin-top: 40px` to the right column, so the real separation is 88px — reproduced rather
 * than tidied.
 *
 * The primary CTA targets `#contact`, which does not exist anywhere on this page; retargeted at
 * `/contact` (spec §5).
 *
 * "95% Max LVR available" contradicts FAQ Q3 ("most lenders cap low doc loans at 80% LVR") — the
 * client's copy, left verbatim.
 */
export function LowDocHero() {
  return (
    <section className="flex min-h-[480px] items-center justify-between gap-[48px] bg-[#111111] px-[64px] pt-[152px] pb-[80px] font-inter max-[992px]:flex-col max-[992px]:px-[24px] max-[992px]:pt-[104px] max-[992px]:pb-[60px] max-[768px]:px-[16px] max-[768px]:pt-[88px] max-[768px]:pb-[48px]">
      {/* .ldl-hero-left */}
      <div className="max-w-[480px] max-[992px]:w-full max-[992px]:max-w-full">
        <p className="m-0 mb-[16px] font-inter text-[11px] leading-[20px] font-bold tracking-[2.5px] text-[#bc1a1a] uppercase">
          LOW DOCUMENTATION LENDING
        </p>

        <h1 className="m-0 mb-[20px] font-inter text-[52px] leading-[1.15] font-bold text-white max-[992px]:text-[36px] max-[992px]:leading-[1.2] max-[768px]:text-[28px] max-[768px]:leading-[1.25] max-[480px]:text-[24px]">
          Low Doc Loans for <span className="text-[#bc1a1a]">Self-Employed</span> Australians
        </h1>

        <p className="m-0 mb-[12px] font-inter text-[18px] leading-[20px] font-bold text-white">
          No tax returns? No problem.
        </p>

        <p className="m-0 mb-[28px] font-inter text-[16px] leading-[1.7] text-[#ffffffbf]">
          Low doc home loans let self-employed Australians use BAS, bank statements, or accountant
          letters instead of full tax returns to get approved.
        </p>

        <div className="flex flex-wrap gap-[12px] max-[768px]:w-full max-[768px]:flex-col max-[768px]:items-stretch">
          <Link
            href="/contact"
            className="inline-flex h-[52px] items-center justify-center gap-[6px] rounded-[8px] bg-[#bc1a1a] px-[28px] font-inter text-[15px] leading-[20px] font-bold text-white no-underline max-[768px]:w-full max-[768px]:text-center"
          >
            Book a Free Consult →
          </Link>

          <a
            href="tel:0412885734"
            className="inline-flex h-[52px] items-center justify-center rounded-[8px] border-2 border-white bg-transparent px-[28px] font-inter text-[15px] leading-[20px] font-bold text-white no-underline max-[768px]:w-full max-[768px]:text-center"
          >
            Call 0412 885 734
          </a>
        </div>
      </div>

      {/* .ldl-hero-right */}
      <div className="shrink-0 max-[992px]:mt-[40px] max-[992px]:w-full max-[992px]:max-w-full max-[768px]:mt-[24px]">
        <div className="grid grid-cols-2 gap-[16px] max-[768px]:gap-[12px]">
          {HERO_STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex min-w-[160px] flex-col items-center gap-[6px] rounded-[10px] bg-white px-[28px] py-[24px]"
            >
              <span className="font-inter text-[36px] leading-none font-extrabold text-[#bc1a1a]">
                {value}
              </span>
              <span className="text-center font-inter text-[13px] leading-[20px] text-[#888888]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
