import { CheckCircleBigIcon } from "@/components/icons";

/**
 * The source's Webflow-generated label spans are only Inter for the first three
 * (`.text-span` … `.text-span-3`); `.text-span-4` … `.text-span-6` declare the system UI stack
 * instead, so the last three items render in a different typeface on the live site. Kept verbatim.
 */
const SYSTEM_UI_STACK =
  "font-[system-ui,-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira_Sans,Droid_Sans,Helvetica_Neue,sans-serif]";

interface EligibilityItem {
  label: string;
  fontClass: string;
}

/** `.ldl-who-item` ×6. */
const ELIGIBILITY_ITEMS: readonly EligibilityItem[] = [
  { label: "Sole traders & freelancers", fontClass: "font-inter" },
  { label: "Contractors & subcontractors", fontClass: "font-inter" },
  { label: "Small business owners", fontClass: "font-inter" },
  { label: "Company directors", fontClass: SYSTEM_UI_STACK },
  { label: "Partnership & trust structures", fontClass: SYSTEM_UI_STACK },
  { label: "ABN holders (6+ months)", fontClass: SYSTEM_UI_STACK },
];

/**
 * `section.ldl-who` — "Who can get a low doc home loan?".
 *
 * Full-bleed brand red with translucent white tiles, 3-up → 2-up at 992px → 1-up at 768px. Like
 * `.ldl-docs`, the section and its container both take horizontal padding below 992px.
 *
 * `.ldl-who` declares `font-family: Inte` — a truncated typo that resolves to nothing. Every
 * descendant sets its own family, so the declaration is inert and is not ported.
 *
 * "ABN holders (6+ months)" contradicts FAQ Q5 ("at least 12–24 months of self-employment"); the
 * client's copy, left as-is.
 */
export function LowDocEligibility() {
  return (
    <section className="bg-[#bc1a1a] p-[64px] max-[992px]:px-[24px] max-[768px]:px-[16px] max-[768px]:py-[48px]">
      <div className="mx-auto max-w-[900px] max-[992px]:px-[24px] max-[768px]:px-[16px]">
        <h2 className="m-0 mb-[36px] text-center font-inter text-[32px] leading-[36px] font-bold text-white max-[992px]:text-[30px] max-[768px]:text-[24px]">
          Who can get a low doc home loan?
        </h2>

        <div className="grid grid-cols-3 gap-[16px] max-[992px]:grid-cols-2 max-[768px]:grid-cols-1">
          {ELIGIBILITY_ITEMS.map(({ label, fontClass }) => (
            <div
              key={label}
              className="flex items-center gap-[12px] rounded-[8px] bg-[#ffffff26] px-[20px] py-[16px] text-[15px] leading-[20px] font-medium text-white"
            >
              <CheckCircleBigIcon className="size-[18px] shrink-0 text-white" />
              <span className={fontClass}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
