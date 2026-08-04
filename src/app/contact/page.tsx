import type { Metadata } from "next";

import { FaqAccordion } from "@/components/FaqAccordion";
import { GetInTouch } from "@/components/GetInTouch";
import type { FaqItem } from "@/types";

export const metadata: Metadata = {
  // The live page's <title> is the full string on its own. The root layout's
  // `%s | FundUp` template would append a second "FundUp", so opt out of it.
  title: { absolute: "Contact FundUp | Free Mortgage Consultation Australia" },
  description:
    "Ready to find the right loan? Contact FundUp for a free, no-obligation mortgage consultation. Call 0412 885 734 or send us a message — we're here to help.",
};

/**
 * The six `.fu-faq2__item` entries on `/contact`, verbatim from the source embed.
 *
 * Intentionally **not** `HOME_FAQ_ITEMS`: Q3 reads "over 30 lenders" here where the homepage
 * says "over 40 lenders". That contradiction is live-site copy and is already recorded under
 * *Deliberately preserved* in `docs/research/FIXES.md` — the two lists must stay separate.
 *
 * The `—` in Q1's answer is `&mdash;` (U+2014) in the source.
 */
const CONTACT_FAQ_ITEMS: readonly FaqItem[] = [
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
      "We have access to a wide panel of over 30 lenders, including major banks, second-tier lenders, and specialist providers, to ensure we find the right fit for your needs.",
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
 * `/contact` — two sections only:
 *
 *   main#contact-git.git-section → section.faq-section/.fu-faq2
 *
 * `GetInTouch` runs on its defaults here: the source's `h2` is "Ready to get funded?", the sub
 * is the shared `/` copy, and all four `.git-item` rows are present — verified byte-for-byte
 * against the cached `contact.html`.
 *
 * **There is no contact form on this page**, despite the meta description promising one; the
 * real booking flow lives at `/book-a-consultation`. Matches the original.
 *
 * **No `<h1>`** — the page starts at the `<h2>` inside `GetInTouch`. Also matches the original.
 * Header and footer are mounted globally in `layout.tsx`, and `GetInTouch` renders the page's
 * only `<main>`, so nothing here adds a second one.
 */
export default function ContactPage() {
  return (
    // Nav clearance — this page opens with a section that has no built-in top
    // padding, so the source renders its eyebrow behind the fixed nav.
    <div className="pt-14 min-[768px]:pt-16 min-[992px]:pt-28">
      <GetInTouch />
      {/* Same embed as the homepage, and the same deliberate divergence: single-open with
          the first question expanded. Live, this copy's "close others" loop is commented
          out, so any number of answers can be open and none are on load. */}
      <FaqAccordion items={CONTACT_FAQ_ITEMS} />
    </div>
  );
}
