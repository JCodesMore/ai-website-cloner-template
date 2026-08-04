import type { ReactNode } from "react";

import { FileTextIcon, ShieldIcon, TrendingUpIcon, UsersIcon } from "@/components/icons";

interface FeatureCardContent {
  icon: ReactNode;
  title: string;
  description: string;
}

/** `.ldl-feat-card` ×4. Inline SVGs on this page stroke the brand `#BC1A1A`. */
const FEATURE_CARDS: readonly FeatureCardContent[] = [
  {
    // The source's copy of this icon drops the second body line the identical icon on
    // /self-employed-loans keeps; the shared two-line component is reused.
    icon: <FileTextIcon className="size-[20px]" />,
    title: "Minimal Documentation",
    description:
      "No full tax returns required. Many lenders accept BAS, bank statements, or an accountant's letter as proof of income.",
  },
  {
    icon: <ShieldIcon className="size-[20px]" />,
    title: "Major & Specialist Lenders",
    description:
      "We access low doc products from mainstream banks and specialist non-bank lenders for the most competitive rates.",
  },
  {
    icon: <TrendingUpIcon className="size-[20px]" />,
    title: "Higher Borrowing Power",
    description:
      "Low doc lenders often 'add back' business deductions like depreciation, boosting what you can actually borrow.",
  },
  {
    icon: <UsersIcon className="size-[20px]" />,
    title: "Expert Self-Employed Guidance",
    description:
      "We understand ABN structures, GST cycles, and seasonal income — and we know which lenders do too.",
  },
];

/**
 * `section.ldl-what` — "What is a low doc loan?" plus the four-card feature grid.
 *
 * A two-column flex row (380px-capped prose on the left, the card stack on the right) that becomes
 * a single column at 992px.
 *
 * The source's responsive rules also set `grid-template-columns: 1fr 1fr` and `display: flex` on
 * `.ldl-what-right`, which is already a column flexbox — both are no-ops, so the cards stay in one
 * column at every width and neither rule is ported.
 */
export function LowDocExplainer() {
  return (
    <section className="flex items-start gap-[64px] bg-[#f5f5f5] px-[64px] py-[80px] font-inter max-[992px]:flex-col max-[992px]:px-[24px] max-[768px]:gap-[32px] max-[768px]:px-[16px] max-[768px]:py-[48px]">
      {/* .ldl-what-left */}
      <div className="max-w-[380px] flex-1 max-[992px]:w-full max-[992px]:max-w-full">
        <h2 className="m-0 mb-[20px] font-inter text-[36px] leading-[1.2] font-extrabold text-[#111111] max-[992px]:text-[30px] max-[768px]:text-[24px]">
          What is a <span className="text-[#bc1a1a]">low doc</span> loan?
        </h2>

        <p className="m-0 mb-[16px] font-inter text-[15px] leading-[1.7] text-[#555555]">
          Instead of two years of tax returns, you provide alternative proof of income — like BAS,
          bank statements, or an accountant&apos;s declaration. We match you with the right lender
          based on what documentation you have available.
        </p>

        <p className="m-0 mb-[16px] font-inter text-[15px] leading-[1.7] text-[#555555]">
          A low doc loan is designed for self-employed Australians who don&apos;t have the
          traditional paperwork banks typically require.
        </p>
      </div>

      {/* .ldl-what-right */}
      <div className="flex flex-1 flex-col gap-[16px] max-[992px]:w-full max-[992px]:max-w-full">
        {FEATURE_CARDS.map(({ icon, title, description }) => (
          <div
            key={title}
            className="flex items-start gap-[16px] rounded-[12px] border border-[#e8e8e8] bg-white px-[24px] py-[20px] max-[768px]:p-[16px]"
          >
            <div className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#fff5f5] text-[#bc1a1a]">
              {icon}
            </div>

            <div>
              <h3 className="m-0 mb-[6px] font-inter text-[15px] leading-[30px] font-bold text-[#111111]">
                {title}
              </h3>
              <p className="m-0 font-inter text-[13px] leading-[1.6] text-[#666666]">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
