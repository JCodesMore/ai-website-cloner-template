"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types";

/**
 * The six questions inside the `.fu-faq2` embed on `/`.
 *
 * `/contact` ships the same six with one word changed ("over **30** lenders" in Q3), and
 * `/low-doc-loans` ships six entirely different ones — both belong to their own route agents.
 * See `docs/research/components/faq-getintouch-booking.spec.md`.
 */
export const HOME_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Can I get a home loan if I'm self-employed?",
    answer:
      "Absolutely. We specialise in self-employed lending and work with lenders who accept BAS statements, accountant letters, and alternative income verification — not just traditional payslips.",
  },
  {
    question: "How much does it cost to use a mortgage broker?",
    answer:
      "Our service is typically free for you. We are paid a commission by the lender when your loan settles. We'll always be transparent about how we are compensated.",
  },
  {
    question: "How many lenders do you compare?",
    answer:
      "We have access to a wide panel of over 40 lenders, including major banks, second-tier lenders, and specialist providers, to ensure we find the right fit for your needs.",
  },
  {
    question: "How long does pre approval take?",
    answer:
      "Pre-approval can take anywhere from 24 hours to a few business days, depending on the complexity of your situation and the lender's current processing times.",
  },
  {
    question: "Do you help with refinancing?",
    answer:
      "Yes! Refinancing is a core part of what we do. We can help you compare your current rate against the market to see if you can save on interest or consolidate debt.",
  },
  {
    question: "What areas do you service?",
    answer:
      "We provide our services nationally. Whether you're in a major city or a regional area, we can assist you via phone, email, and video consultation.",
  },
];

/**
 * The badge accent. Kept as a token union rather than a raw hex so the class stays static and
 * no inline `style` is needed — all three are declared in `globals.css` `@theme inline`.
 *
 * Every `.fu-faq2` embed on the live site uses `brand-faq` (`#e5341a`); the other two exist
 * because the brief anticipated per-page accents.
 */
export type FaqAccent = "brand" | "brand-contact" | "brand-faq";

const ACCENT_CLASS: Record<FaqAccent, string> = {
  brand: "text-brand",
  "brand-contact": "text-brand-contact",
  "brand-faq": "text-brand-faq",
};

interface FaqAccordionProps {
  /** One entry per `.fu-faq2__item`. */
  items: readonly FaqItem[];
  /** Defaults to the `/` and `/contact` heading. */
  heading?: string;
  /** Defaults to "FAQ"; pass `null` to drop the badge row entirely. */
  badge?: string | null;
  /** Defaults to `brand-faq` (`#e5341a`) — what every embed on the site actually uses. */
  accentColor?: FaqAccent;
  /** Extra classes merged onto the outer `.faq-section` element. */
  className?: string;
}

/**
 * `section.faq-section` › `section.fu-faq2` — the FAQ accordion on `/`, `/contact` and
 * `/low-doc-loans`.
 *
 * The original is a Webflow embed with its own inline `<style>` and a hand-rolled click
 * handler that toggles `.is-open` and animates `max-height: 0 → 500px`. This ports it to Base
 * UI's accordion, which animates real `height` — visually identical, minus the 500px ceiling
 * that would clip a long answer on the original.
 *
 * **Open behaviour is a deliberate divergence from the live site** (client direction — see
 * `docs/research/FIXES.md`). Every FAQ here is single-open with the first question already
 * expanded. Live, the three embeds disagree with each other: `/` and `/contact` have their
 * "close the others" loop commented out so any number can be open, `/low-doc-loans` runs it,
 * and all three load with everything closed. Hence no per-page prop — the consistency is the
 * point, and a prop would just let the old inconsistency back in.
 *
 * The embed's `CameraPlainVariable` webfont is omitted (FIXES.md #12 — a `cdn.gpteng.co`
 * third-party leftover), so this falls back to the project `font-sans` stack, matching the
 * decision already taken for the testimonials embed.
 *
 * `Accordion.Header` / `.Trigger` / `.Panel` come straight from `@base-ui/react/accordion` —
 * the same library `ui/accordion.tsx` wraps. The shadcn `AccordionTrigger` / `AccordionContent`
 * hardcode two Lucide chevrons, `text-sm`, `hover:underline` and a focus ring that the source
 * has none of, and don't expose merge points for the parts that need overriding.
 */
export function FaqAccordion({
  items,
  heading = "Frequently asked questions",
  badge = "FAQ",
  accentColor = "brand-faq",
  className,
}: FaqAccordionProps) {
  return (
    <section
      className={cn(
        // .faq-section — 16px gutters and overflow clamp below 992px, flush above it.
        "w-full overflow-x-hidden bg-white px-[16px] py-0 min-[992px]:overflow-x-visible min-[992px]:px-0",
        className,
      )}
    >
      {/* .fu-faq2 */}
      <div className="w-full bg-[#f9f9f9] px-[20px] py-[60px] font-sans text-[#1a1a1a] min-[601px]:px-[24px] min-[601px]:py-[100px]">
        <div className="mx-auto max-w-[800px]">
          {badge !== null && (
            <div className="mb-[12px] flex items-center justify-center">
              <span
                className={cn(
                  "text-[14px] font-semibold tracking-[0.1em] uppercase",
                  ACCENT_CLASS[accentColor],
                )}
              >
                {badge}
              </span>
            </div>
          )}

          <div className="mb-[60px] text-center">
            <h2 className="font-sans text-[clamp(32px,5vw,48px)] leading-[1.2] font-bold tracking-[-0.02em] text-[#1a1a1a]">
              {heading}
            </h2>
          </div>

          {/*
            `multiple` / `defaultValue` are Base UI's props — not Radix's
            `type="single" | "multiple"`. `AccordionItem` keys off `value={index}`, so `[0]`
            is the first question; on an empty `items` list it simply matches nothing.
            Clicking the open item still collapses it, leaving none open — Base UI's default
            with `multiple={false}`, and the same toggle the source's own handler performs.
          */}
          <Accordion
            multiple={false}
            defaultValue={[0]}
            className="flex w-full flex-col gap-[12px]"
          >
            {items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={index}
                className="overflow-hidden rounded-[12px] border border-[#0000000f] bg-white transition-shadow duration-300 ease-[ease] not-last:border-b hover:shadow-[0_4px_20px_#00000008]"
              >
                <AccordionPrimitive.Header className="flex font-sans">
                  <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-[16px] border-none bg-transparent px-[24px] py-[20px] text-left outline-none min-[601px]:px-[32px] min-[601px]:py-[24px]">
                    <span className="font-sans text-[16px] leading-[1.4] font-semibold text-[#1a1a1a] min-[601px]:text-[18px]">
                      {item.question}
                    </span>
                    <span className="flex size-[20px] shrink-0 items-center justify-center text-[#666666] transition-transform duration-300 ease-[ease] group-aria-expanded:rotate-180">
                      <ChevronDownIcon className="size-full" strokeWidth={2.5} />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>

                <AccordionPrimitive.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-[ease-out] data-ending-style:h-0 data-starting-style:h-0">
                  <div className="px-[24px] pt-0 pb-[24px] min-[601px]:px-[32px] min-[601px]:pb-[32px]">
                    <p className="font-sans text-[16px] leading-[1.6] text-[#666666]">
                      {item.answer}
                    </p>
                  </div>
                </AccordionPrimitive.Panel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
