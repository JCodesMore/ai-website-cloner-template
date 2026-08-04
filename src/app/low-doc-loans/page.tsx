import type { Metadata } from "next";

import { FaqAccordion } from "@/components/FaqAccordion";
import { ExploreMore } from "@/components/loans/ExploreMore";
import { LowDocCtaBand } from "@/components/loans/LowDocCtaBand";
import { LowDocDocuments } from "@/components/loans/LowDocDocuments";
import { LowDocEligibility } from "@/components/loans/LowDocEligibility";
import { LowDocExitStrategy } from "@/components/loans/LowDocExitStrategy";
import { LowDocExplainer } from "@/components/loans/LowDocExplainer";
import { LowDocHero } from "@/components/loans/LowDocHero";
import type { ExploreLink } from "@/components/loans/ExploreMore";
import type { FaqItem } from "@/types";

export const metadata: Metadata = {
  title: "Low Doc Home Loans for Self-Employed Australians",
  description:
    "No payslips or tax returns? No problem. FundUp specialises in low doc home loans for self-employed Australians. Compare flexible lenders and get approved fast.",
};

/**
 * The six `.fu-faq2__item` entries in this page's embed — entirely different questions from the
 * set on `/` and `/contact`.
 */
const LOW_DOC_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "What is a low doc loan?",
    answer:
      "A low doc (low documentation) loan is a home loan designed for self-employed borrowers who can't provide the full financial documentation that traditional loans require — like two years of tax returns.",
  },
  {
    question: "Are low doc loan rates higher?",
    answer:
      "Low doc loans often carry slightly higher interest rates than standard loans because they are perceived as higher risk by lenders. However, rates vary significantly between lenders, and we'll help you find the most competitive option available.",
  },
  {
    question: "What's the maximum LVR for a low doc loan?",
    answer:
      "Most lenders cap low doc loans at 80% LVR (Loan to Value Ratio), meaning you'll need at least a 20% deposit. Some specialist lenders may offer higher LVRs under specific conditions.",
  },
  {
    question: "Can I get a low doc investment loan?",
    answer:
      "Yes, low doc loans are available for both owner-occupied and investment properties. The criteria may vary slightly, but we can help you navigate the options for your investment strategy.",
  },
  {
    question: "How long do I need to be self-employed?",
    answer:
      "Typically, lenders look for at least 12–24 months of self-employment. Some specialist lenders may consider shorter periods if you have a strong history in the same industry.",
  },
  {
    question: "Is there a cost to use FundUp?",
    answer:
      "Our service is completely free to you. We are paid a commission by the lender when your loan settles. This means you get expert guidance without any out-of-pocket costs.",
  },
];

/** `.sel-explore-links` on this page. */
const EXPLORE_LINKS: readonly ExploreLink[] = [
  { label: "Self-Employed Loans →", href: "/self-employed-loans" },
  { label: "Calculators →", href: "/calculators" },
  { label: "All Services →", href: "/#services" },
];

/**
 * `/low-doc-loans`.
 *
 * Seven `<section>` elements carrying nine content blocks — the stats band sits inside
 * `LowDocHero`'s right column and the feature grid inside `LowDocExplainer`'s. No `<main>` in the
 * source.
 *
 * This page *does* ship the `.fu-faq2` embed, so `FaqAccordion` is reused for it. Unlike the `/`
 * and `/contact` copies — where the "close others" loop is commented out — this page's script
 * runs it, so the accordion is single-open. Hence no `allowMultiple`.
 *
 * Full extraction is in `docs/research/components/loan-pages.spec.md`.
 */
export default function LowDocLoansPage() {
  return (
    <>
      <LowDocHero />
      <LowDocExplainer />
      <LowDocDocuments />
      <LowDocEligibility />
      <LowDocExitStrategy />
      <LowDocCtaBand />
      <FaqAccordion
        items={LOW_DOC_FAQ_ITEMS}
        heading="Low doc loan questions answered"
        badge="FAQ"
      />
      <ExploreMore links={EXPLORE_LINKS} />
    </>
  );
}
