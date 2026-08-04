import type { ReactNode } from "react";

import { ClockIcon, FileTextIcon, LaptopIcon, ShieldIcon } from "@/components/icons";

interface WhyCard {
  icon: ReactNode;
  title: string;
  description: string;
}

/** `.sel-why-card` ×4. Every inline SVG on this page strokes `#E63946`, not the brand `#bc1a1a`. */
const WHY_CARDS: readonly WhyCard[] = [
  {
    icon: <FileTextIcon className="size-[24px]" />,
    title: "Flexible Income Verification",
    description:
      "We work with lenders who accept BAS statements, accountant declarations, and tax returns — not just payslips.",
  },
  {
    icon: <LaptopIcon className="size-[24px]" />,
    title: "40+ Lender Panel",
    description:
      "Access major banks, non-banks, and specialist self-employed lenders to find the most competitive deal.",
  },
  {
    icon: <ShieldIcon className="size-[24px]" />,
    title: "All Business Structures",
    description:
      "Sole traders, partnerships, trusts, and company structures — we've helped them all secure home loans.",
  },
  {
    icon: <ClockIcon className="size-[24px]" />,
    title: "Fast Pre-Approval",
    description:
      "Most self-employed pre-approvals processed within 24–48 hours so you can bid with confidence.",
  },
];

/**
 * `section.sel-why` — the problem statement and the four-card answer to it.
 *
 * One section in the source, two content blocks: the centred heading + subheading, then a 2-up
 * grid that collapses to a single column at 992px.
 *
 * `.sel-why-card-title` is an `h3` with no `line-height`, so it renders 15px text on Webflow's
 * 30px `h3` line box — restated here because Preflight drops that reset.
 */
export function SelfEmployedWhy() {
  return (
    <section className="bg-white px-[24px] py-[80px] font-inter max-[768px]:px-[16px] max-[768px]:py-[48px]">
      <div className="mx-auto max-w-[860px]">
        <h2 className="m-0 mb-[20px] text-center font-inter text-[36px] leading-[1.2] font-extrabold text-[#111111] max-[992px]:text-[30px] max-[768px]:text-[24px]">
          Why self-employed Australians struggle to get home loans
        </h2>

        <p className="mx-auto mt-0 mb-[48px] max-w-[560px] text-center font-inter text-[15px] leading-[1.7] text-[#777777]">
          Banks often penalise self-employed borrowers with rigid income requirements. If your
          taxable income is reduced by legitimate deductions, many lenders simply say no.
          That&apos;s where we come in.
        </p>

        <div className="grid grid-cols-2 gap-[20px] max-[992px]:grid-cols-1">
          {WHY_CARDS.map(({ icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-[16px] rounded-[12px] border border-[#e8e8e8] bg-[#fafafa] p-[24px] max-[768px]:p-[16px]"
            >
              <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[#fff5f5] text-[#e63946]">
                {icon}
              </div>

              <div>
                <h3 className="m-0 mb-[8px] font-inter text-[15px] leading-[30px] font-bold text-[#111111]">
                  {title}
                </h3>
                <p className="m-0 font-inter text-[14px] leading-[1.6] text-[#666666]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
