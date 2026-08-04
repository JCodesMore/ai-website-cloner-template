import type { FaqItem } from "@/types";

/** `.sel-faq-item` ×5. */
export const SELF_EMPLOYED_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Can I get a home loan if I've only been self-employed for 1 year?",
    answer:
      "Yes. Several lenders on our panel accept just 1 year of trading history, especially with strong BAS or accountant-prepared financials.",
  },
  {
    question: "Do I need two years of tax returns?",
    answer:
      "Not always. Many lenders accept alternative documentation such as 6–12 months of BAS, bank statements, or an accountant's letter confirming income.",
  },
  {
    question: "What if my taxable income is low because of deductions?",
    answer:
      "We specialise in this exact scenario. Certain lenders 'add back' depreciation and other non-cash deductions, giving you significantly higher borrowing power.",
  },
  {
    question: "Is a self-employed home loan more expensive?",
    answer:
      "Not necessarily. With the right lender match, self-employed borrowers can access the same competitive rates as PAYG earners.",
  },
  {
    question: "Do you charge a fee?",
    answer:
      "No. Our service is completely free to you — we're paid by the lender when your loan settles.",
  },
];

/**
 * `section.sel-faq` — **static** FAQ, not an accordion.
 *
 * Unlike `/`, `/contact` and `/low-doc-loans`, this page does not ship the `.fu-faq2` embed. The
 * source is five `div.sel-faq-item` cards, each holding a plain `h3.sel-faq-q` and `p.sel-faq-a`:
 * no `<button>`, no `aria-expanded`, no script, nothing to expand. `FaqAccordion` is intentionally
 * not used here.
 *
 * `.sel-faq-h2` and `.sel-faq-q` both omit `line-height`, so they inherit Webflow's `h2` 36px and
 * `h3` 30px line boxes — the headings actually get *tighter* as the font size steps down.
 */
export function SelfEmployedFaq() {
  return (
    <section className="bg-[#f5f5f5] px-[24px] py-[80px] font-inter max-[768px]:px-[16px] max-[768px]:py-[48px]">
      <div className="mx-auto max-w-[700px]">
        <h2 className="m-0 mb-[40px] text-center font-inter text-[36px] leading-[36px] font-extrabold text-[#111111] max-[992px]:text-[28px] max-[768px]:text-[24px]">
          Self-employed home loan FAQs
        </h2>

        <div className="flex flex-col gap-[16px]">
          {SELF_EMPLOYED_FAQ_ITEMS.map(({ question, answer }) => (
            <div
              key={question}
              className="rounded-[10px] border border-[#e8e8e8] bg-white px-[28px] py-[24px] max-[768px]:p-[16px]"
            >
              <h3 className="m-0 mb-[10px] font-inter text-[15px] leading-[30px] font-semibold text-[#111111] max-[768px]:text-[16px]">
                {question}
              </h3>
              <p className="m-0 font-inter text-[14px] leading-[1.6] text-[#666666]">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
