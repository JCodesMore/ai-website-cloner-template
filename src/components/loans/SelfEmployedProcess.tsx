import type { ProcessStep } from "@/types";

/** `.sel-how-step` ×4. */
const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Free Discovery Call",
    description:
      "We learn about your business structure, income, and property goals — no obligation.",
  },
  {
    number: "02",
    title: "Income Assessment",
    description:
      "We review your financials and identify which lenders best suit your self-employed situation.",
  },
  {
    number: "03",
    title: "Lender Matching",
    description:
      "We compare rates and policies across 40+ lenders and present your best options.",
  },
  {
    number: "04",
    title: "Application & Settlement",
    description:
      "We handle the paperwork, chase the lender, and keep you updated until settlement day.",
  },
];

/**
 * `section.sel-how` — the numbered 01–04 approval process.
 *
 * 2-up grid with a 48px column gap and a 36px row gap, collapsing to one column at 992px. Below
 * 768px each step gains 16px of its own padding while the grid gap tightens to 24px.
 */
export function SelfEmployedProcess() {
  return (
    <section className="bg-[#f5f5f5] px-[24px] py-[80px] font-inter max-[768px]:px-[16px] max-[768px]:py-[48px]">
      <div className="mx-auto max-w-[860px]">
        <h2 className="m-0 mb-[48px] text-center font-inter text-[36px] leading-[1.2] font-extrabold text-[#111111] max-[992px]:text-[30px] max-[768px]:mb-[32px] max-[768px]:text-[24px]">
          How we get self-employed borrowers approved
        </h2>

        <div className="grid grid-cols-2 gap-x-[48px] gap-y-[36px] max-[992px]:grid-cols-1 max-[768px]:gap-[24px]">
          {PROCESS_STEPS.map(({ number, title, description }) => (
            <div
              key={number}
              className="flex items-start gap-[20px] max-[768px]:p-[16px]"
            >
              <span className="w-[36px] shrink-0 font-inter text-[28px] leading-none font-extrabold text-[#bc1a1a]">
                {number}
              </span>

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
