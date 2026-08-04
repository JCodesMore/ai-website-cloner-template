import type { Metadata } from "next";

import { ExploreMore } from "@/components/loans/ExploreMore";
import { SelfEmployedBusinessTypes } from "@/components/loans/SelfEmployedBusinessTypes";
import { SelfEmployedCtaBand } from "@/components/loans/SelfEmployedCtaBand";
import { SelfEmployedFaq } from "@/components/loans/SelfEmployedFaq";
import { SelfEmployedHero } from "@/components/loans/SelfEmployedHero";
import { SelfEmployedProcess } from "@/components/loans/SelfEmployedProcess";
import { SelfEmployedWhy } from "@/components/loans/SelfEmployedWhy";
import type { ExploreLink } from "@/components/loans/ExploreMore";

export const metadata: Metadata = {
  title: "Self-Employed Home Loans Australia",
  description:
    "Are you self-employed and struggling to get a home loan? FundUp helps business owners, sole traders & contractors find the right loan across 40+ lenders.",
};

/** `.sel-explore-links` on this page. */
const EXPLORE_LINKS: readonly ExploreLink[] = [
  { label: "Low Doc Loans →", href: "/low-doc-loans" },
  { label: "Calculators →", href: "/calculators" },
  { label: "All Services →", href: "/#services" },
];

/**
 * `/self-employed-loans`.
 *
 * Seven `<section>` elements carrying eight content blocks — `SelfEmployedWhy` holds both the
 * problem statement and the four-card feature grid. The source has no `<main>` and no shared
 * sections beyond the global nav and footer; the FAQ here is static markup, **not** the `.fu-faq2`
 * accordion embed the other pages use.
 *
 * Full extraction, including every verbatim string and the two fixed anchors, is in
 * `docs/research/components/loan-pages.spec.md`.
 */
export default function SelfEmployedLoansPage() {
  return (
    <>
      <SelfEmployedHero />
      <SelfEmployedWhy />
      <SelfEmployedProcess />
      <SelfEmployedBusinessTypes />
      <SelfEmployedCtaBand />
      <SelfEmployedFaq />
      <ExploreMore links={EXPLORE_LINKS} />
    </>
  );
}
