"use client";

import { useState } from "react";

import {
  BookConsultCta,
  CalcCard,
  Disclaimer,
  DonutLegend,
  LeftPanel,
  PanelTitle,
  ResultHeadline,
  RightPanel,
  RightPanelTitle,
  SliderField,
  SummaryRow,
} from "@/components/calculators/CalculatorPrimitives";
import { DonutChart } from "@/components/calculators/DonutChart";
import {
  LOAN_AMOUNT_RANGE,
  LOAN_DEFAULTS,
  LOAN_RATE_RANGE,
  LOAN_TERM_RANGE,
  calculateLoan,
  formatAud,
} from "@/lib/calculators";
import type { LoanInputs } from "@/types";

const PRINCIPAL_COLOUR = "#d62b2b";
const INTEREST_COLOUR = "#444444";

/**
 * Loan repayments — the standard amortisation formula driven by three sliders,
 * with a donut splitting the total repayment into principal and interest.
 */
export function LoanCalculator() {
  const [inputs, setInputs] = useState<LoanInputs>(LOAN_DEFAULTS);

  const result = calculateLoan(inputs);

  return (
    <CalcCard>
      <LeftPanel>
        <PanelTitle>Loan Details</PanelTitle>

        <SliderField
          id="ln-amount"
          label="Loan Amount"
          valueLabel={formatAud(inputs.amount)}
          min={LOAN_AMOUNT_RANGE.min}
          max={LOAN_AMOUNT_RANGE.max}
          step={LOAN_AMOUNT_RANGE.step}
          value={inputs.amount}
          onValueChange={(amount) => setInputs((previous) => ({ ...previous, amount }))}
          minLabel="$50K"
          maxLabel="$2M"
        />

        <SliderField
          id="ln-rate"
          label="Interest Rate"
          valueLabel={`${inputs.interestRate.toFixed(1)}%`}
          min={LOAN_RATE_RANGE.min}
          max={LOAN_RATE_RANGE.max}
          step={LOAN_RATE_RANGE.step}
          value={inputs.interestRate}
          onValueChange={(interestRate) => setInputs((previous) => ({ ...previous, interestRate }))}
          minLabel="2%"
          maxLabel="12%"
        />

        <SliderField
          id="ln-term"
          label="Loan Term"
          valueLabel={`${inputs.termYears} ${inputs.termYears === 1 ? "year" : "years"}`}
          min={LOAN_TERM_RANGE.min}
          max={LOAN_TERM_RANGE.max}
          step={LOAN_TERM_RANGE.step}
          value={inputs.termYears}
          onValueChange={(termYears) => setInputs((previous) => ({ ...previous, termYears }))}
          minLabel="1 yr"
          maxLabel="30 yrs"
        />
      </LeftPanel>

      <RightPanel>
        <RightPanelTitle>Your Estimated Repayments</RightPanelTitle>
        <ResultHeadline label="Monthly Repayment" value={formatAud(result.monthlyRepayment)} />

        {/* Grey interest ring first, red principal arc painted over it. */}
        <DonutChart
          arcs={[
            { color: INTEREST_COLOUR, dashOffset: 0 },
            { color: PRINCIPAL_COLOUR, dashOffset: result.principalArcOffset },
          ]}
          centreValue={`${result.principalPercent}%`}
          centreLabel="Principal"
        />

        <DonutLegend
          items={[
            { label: `Principal ${formatAud(result.principal)}`, color: PRINCIPAL_COLOUR },
            { label: `Interest ${formatAud(result.totalInterest)}`, color: INTEREST_COLOUR },
          ]}
        />

        <SummaryRow label="Total Repayment" value={formatAud(result.totalRepayment)} />
        <SummaryRow label="Total Interest" value={formatAud(result.totalInterest)} />
        <SummaryRow label="Loan Amount" value={formatAud(result.principal)} />

        <BookConsultCta className="mt-[16px]" />
        <Disclaimer>*Estimates only. Actual rates may vary. Contact us for accurate figures.</Disclaimer>
      </RightPanel>
    </CalcCard>
  );
}
