import type { ProcessStep } from "@/types";

/** `.ldl-exit-card` ×3. */
const EXIT_STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Secure the deal",
    description:
      "We place you with a low doc lender now — using BAS, bank statements, or an accountant's letter — so you don't miss out on the property you want.",
  },
  {
    number: "02",
    title: "Build your financials",
    description:
      "Over the next 6–24 months, your accountant prepares your tax returns and financials. We stay in touch and monitor the market for the right time to move.",
  },
  {
    number: "03",
    title: "Refinance to a prime rate",
    description:
      "Once your tax returns are lodged, we refinance you to a full doc lender at a lower rate — minimising the time and cost spent on the low doc product.",
  },
];

/**
 * `section.ldl-exit` — the three-step exit strategy and its dark result callout.
 *
 * 3-up card grid that drops straight to a single column at 992px (it never passes through 2-up),
 * followed by the `#1a1a1a` `.ldl-result-card`.
 *
 * `.ldl-exit-h2` declares no `line-height`, so it renders on Webflow's 36px `h2` line box — at its
 * 36px desktop size that is `line-height: 1`.
 */
export function LowDocExitStrategy() {
  return (
    <section className="bg-[#f5f5f5] px-[64px] py-[80px] font-inter max-[992px]:px-[24px] max-[768px]:px-[16px] max-[768px]:py-[48px]">
      <div className="mx-auto max-w-[900px] text-center font-inter max-[992px]:px-[24px] max-[768px]:px-[16px]">
        <p className="m-0 mb-[12px] font-inter text-[11px] leading-[20px] font-bold tracking-[2.5px] text-[#bc1a1a] uppercase">
          SMART STRATEGY
        </p>

        <h2 className="m-0 mb-[16px] font-inter text-[36px] leading-[36px] font-bold text-[#111111] max-[992px]:text-[30px] max-[768px]:text-[24px]">
          The low doc exit strategy
        </h2>

        <p className="mx-auto mt-0 mb-[48px] max-w-[580px] font-inter text-[16px] leading-[1.7] text-[#666666]">
          A low doc loan doesn&apos;t have to be forever. We use it as a bridge to get you into the
          market now, then refinance you to a better rate once your financials are ready.
        </p>

        <div className="mb-[32px] grid grid-cols-3 gap-[20px] max-[992px]:grid-cols-1">
          {EXIT_STEPS.map(({ number, title, description }) => (
            <div
              key={number}
              className="rounded-[12px] border border-[#e8e8e8] bg-white px-[24px] py-[32px] text-center"
            >
              <div className="mx-auto mb-[16px] flex size-[48px] items-center justify-center rounded-full bg-[#bc1a1a] text-[14px] font-bold text-white">
                {number}
              </div>
              <h3 className="m-0 mb-[12px] font-inter text-[16px] leading-[30px] font-bold text-[#111111]">
                {title}
              </h3>
              <p className="m-0 text-center font-inter text-[14px] leading-[1.6] text-[#666666]">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* .ldl-result-card */}
        <div className="rounded-[12px] bg-[#1a1a1a] px-[48px] py-[36px] text-center">
          <p className="m-0 mb-[12px] font-inter text-[18px] leading-[20px] font-bold text-white">
            The result?
          </p>
          <p className="m-0 font-inter text-[15px] leading-[1.7] text-[#ffffffbf]">
            You get into the market today instead of waiting years for perfect paperwork — then
            transition to a competitive prime rate as soon as you&apos;re ready. Most clients save
            thousands in the long run.
          </p>
        </div>
      </div>
    </section>
  );
}
