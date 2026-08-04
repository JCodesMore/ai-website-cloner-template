import type { ProcessStep } from "@/types";

/** `.ldl-doc-item` ×4 — a vertical timeline of acceptable income evidence. */
const DOCUMENTS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "BAS (Business Activity Statements)",
    description: "6–12 months of BAS showing your business turnover and GST.",
  },
  {
    number: "02",
    title: "Accountant's Declaration",
    description:
      "A letter from your accountant confirming your income — no full tax return needed.",
  },
  {
    number: "03",
    title: "Bank Statements",
    description: "Some lenders assess income from 3–6 months of business bank statements.",
  },
  {
    number: "04",
    title: "Self-Declaration",
    description:
      "For strong equity positions, certain lenders accept a signed income declaration.",
  },
];

/**
 * `section.ldl-docs` — "Documents we can work with".
 *
 * Numbered circles joined by a 2px `#333` connector that flexes to fill the row; the fourth item
 * carries a bare `last` class (declared nowhere in the stylesheet) and simply omits the connector.
 * `.ldl-doc-body`'s 36px bottom padding still applies to it, so the list ends on a gap.
 *
 * Below 992px both `.ldl-docs` and `.ldl-docs-container` take horizontal padding, so the gutters
 * compound — 24+24, then 16+16. Reproduced verbatim.
 */
export function LowDocDocuments() {
  return (
    <section className="bg-[#1a1a1a] px-[64px] py-[80px] font-inter max-[992px]:px-[24px] max-[768px]:px-[16px] max-[768px]:py-[48px]">
      <div className="mx-auto max-w-[700px] max-[992px]:px-[24px] max-[768px]:px-[16px]">
        <p className="m-0 mb-[12px] text-center font-inter text-[11px] leading-[20px] font-bold tracking-[2.5px] text-[#bc1a1a] uppercase">
          WHAT YOU&apos;LL NEED
        </p>

        <h2 className="m-0 mb-[48px] text-center font-inter text-[36px] leading-[36px] font-bold text-white max-[992px]:text-[28px] max-[768px]:mb-[32px] max-[768px]:text-[24px]">
          Documents we can work with
        </h2>

        <div className="flex flex-col">
          {DOCUMENTS.map(({ number, title, description }, index) => (
            <div key={number} className="flex gap-[24px]">
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#bc1a1a] text-[13px] font-bold text-white">
                  {number}
                </div>
                {index < DOCUMENTS.length - 1 && (
                  <div className="my-[4px] w-[2px] min-h-[32px] flex-1 bg-[#333333]" />
                )}
              </div>

              <div className="pb-[36px]">
                <h3 className="my-[8px] font-inter text-[16px] leading-[30px] font-bold text-white">
                  {title}
                </h3>
                <p className="m-0 font-inter text-[14px] leading-[1.6] text-[#aaaaaa]">
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
