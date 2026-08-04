import type { Metadata } from "next";
import { AboutNed } from "@/components/AboutNed";
import { ServicesGrid } from "@/components/ServicesGrid";

export const metadata: Metadata = {
  title: "Our Mortgage Broking Services for Self-Employed",
  description:
    "Whether you're buying your first home, expanding an investment portfolio, or funding your business — FundUp compares 40+ lenders to find the right loan.",
};

/**
 * `/services` reuses the homepage's services grid and about section verbatim —
 * the live site ships byte-identical markup for both. No page-specific sections.
 */
export default function ServicesPage() {
  return (
    // Nav clearance. This page opens with a section that has no built-in top
    // padding, so on the live site its eyebrow renders behind the fixed nav.
    // Reproducing that would hide content — see docs/research/FIXES.md.
    <div className="pt-14 min-[768px]:pt-16 min-[992px]:pt-28">
      <ServicesGrid />
      <AboutNed />
    </div>
  );
}
