import type { Metadata } from "next";

import {
  CalculatorDivider,
  CalculatorSection,
} from "@/components/calculators/CalculatorSection";
import { LoanCalculator } from "@/components/calculators/LoanCalculator";
import { PaygCalculator } from "@/components/calculators/PaygCalculator";
import { SelfEmployedCalculator } from "@/components/calculators/SelfEmployedCalculator";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { BriefcaseIcon, DollarSignIcon, HomeIcon, UserIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Mortgage & Borrowing Power Calculator",
  description:
    "Use FundUp's free mortgage calculators to estimate your borrowing power, repayments, and loan options as a self-employed Australian. Plan smarter today.",
};

/**
 * `/calculators`.
 *
 * The whole suite ships from the live site as one Webflow embed containing a
 * nested HTML document — its `<style>` leaks out and repaints the page body
 * (`#f2f2f2`, Inter, `#222` text), which is why `<main>` carries those here.
 *
 * This shell is a Server Component; only the four cards are client-side.
 */
export default function CalculatorsPage() {
  // leading-[20px], not 1.5 — the embed inherits Webflow's `body { line-height: 20px }` and
  // never redeclares it. Tailwind Preflight zeroes that, so every label, result and legend
  // without explicit leading was rendering 2–5px short (~20px of drift per panel).
  return (
    <main className="flex-1 bg-[#f2f2f2] font-inter leading-[20px] text-[#222222]">
      {/* section#home.fu-hero-embed — same hero shell as the other inner pages,
          minus the background image layers this page never had. */}
      <section
        id="home"
        className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-[#121212] pt-[140px] pb-[80px] max-[480px]:min-h-[auto] max-[480px]:pt-[100px] max-[480px]:pb-[60px]"
      >
        <div className="relative z-10 mx-auto w-full max-w-[768px] animate-[heroSlideUp_0.7s_ease-out_forwards] px-[16px] text-center motion-reduce:animate-none">
          <h1 className="mb-[24px] font-inter text-[60px] leading-[1.1] font-bold text-white max-[480px]:mb-[16px] max-[480px]:text-[36px]">
            Financial Calculators
          </h1>
          {/* Source copy reads "estimate you rloan repayments stamps duty" —
              three typos in one sentence, corrected here. */}
          <p className="mx-auto mb-[16px] max-w-[672px] font-inter text-[14px] leading-[1.6] font-normal text-[#ffffffcc] max-[480px]:mb-[12px] max-[480px]:text-[16px]">
            Use our free tools to estimate your loan repayments and stamp duty costs across
            Australia
          </p>
        </div>
      </section>

      <section>
        <CalculatorSection
          badge="Self-Employed Borrowing Calculator"
          icon={<BriefcaseIcon className="size-[13px] shrink-0" />}
          title="Self-Employed? See Your True Borrowing Power"
          description="As a business owner, your taxable income doesn't tell the full story. Lenders add back expenses like depreciation, interest and super to reveal your real earning capacity."
        >
          <SelfEmployedCalculator />
        </CalculatorSection>

        <CalculatorDivider />

        <CalculatorSection
          badge="PAYG Borrowing Calculator"
          icon={<UserIcon className="size-[13px] shrink-0" />}
          title="Salaried? Estimate Your Borrowing Power"
          description="For PAYG employees, lenders assess your gross salary, existing debts and living expenses (HEMS) to determine how much you can borrow — solo or with a partner."
        >
          <PaygCalculator />
        </CalculatorSection>

        <CalculatorDivider />

        <CalculatorSection
          badge="Loan Calculator"
          icon={<DollarSignIcon className="size-[13px] shrink-0" />}
          title="Estimate Your Repayments"
          description="Get a quick estimate of your monthly repayments. For a personalised assessment, book a free consult."
        >
          <LoanCalculator />
        </CalculatorSection>

        <CalculatorDivider />

        <CalculatorSection
          badge="Stamp Duty Calculator"
          icon={<HomeIcon className="size-[13px] shrink-0" />}
          title="Estimate Your Stamp Duty"
          description="Get a quick estimate of stamp duty costs across Australian states and territories."
        >
          <StampDutyCalculator />
        </CalculatorSection>
      </section>
    </main>
  );
}
