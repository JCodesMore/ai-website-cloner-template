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
    <>
      <ServicesGrid />
      <AboutNed />
    </>
  );
}
