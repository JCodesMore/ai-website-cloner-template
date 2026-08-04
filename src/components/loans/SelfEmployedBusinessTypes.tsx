import { CheckCircleBigIcon } from "@/components/icons";

/** `.sel-types-item` ×6, in source order. */
const BUSINESS_TYPES: readonly string[] = [
  "Sole traders & freelancers",
  "Partnerships & joint ventures",
  "Company directors & shareholders",
  "Trust structures (family & discretionary)",
  "Contractors & subcontractors",
  "ABN holders with 1+ year trading",
];

/**
 * `section.sel-types` — the "every business type" checklist.
 *
 * Note the asymmetric section padding (`80px 24px 64px`) and that the 2-up grid survives the 992px
 * breakpoint — it only becomes a single column below 768px.
 *
 * Each row carries a `#f0f0f0` bottom rule, including the last two, so the block ends on a hairline.
 */
export function SelfEmployedBusinessTypes() {
  return (
    <section className="bg-white px-[24px] pt-[80px] pb-[64px] font-inter max-[768px]:px-[16px] max-[768px]:py-[48px]">
      <div className="mx-auto max-w-[760px]">
        <h2 className="m-0 mb-[48px] text-center font-inter text-[36px] leading-[1.2] font-extrabold text-[#111111] max-[992px]:text-[30px] max-[768px]:mb-[32px] max-[768px]:text-[24px]">
          Self-employed home loans for every business type
        </h2>

        <div className="grid grid-cols-2 gap-x-[48px] gap-y-[24px] max-[768px]:grid-cols-1 max-[768px]:gap-[16px]">
          {BUSINESS_TYPES.map((type) => (
            <div
              key={type}
              className="flex items-center gap-[12px] border-b border-[#f0f0f0] pb-[20px] text-[15px] leading-[20px] text-[#333333]"
            >
              <CheckCircleBigIcon className="size-[18px] shrink-0 text-[#e63946]" />
              <span className="font-inter">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
