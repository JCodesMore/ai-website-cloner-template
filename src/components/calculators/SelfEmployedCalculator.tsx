"use client";

import { useState } from "react";

import {
  BarLegend,
  BookConsultCta,
  BorrowingPowerRows,
  CalcCard,
  CurrencyField,
  Disclaimer,
  FieldGroupHint,
  FieldGroupTitle,
  LeftPanel,
  PanelTitle,
  ResultHeadline,
  RightPanel,
  RightPanelTitle,
  StackedBar,
  SummaryRow,
  type StackedBarSegment,
} from "@/components/calculators/CalculatorPrimitives";
import {
  SELF_EMPLOYED_DEFAULTS,
  calculateSelfEmployed,
  formatAud,
  parseAmount,
} from "@/lib/calculators";
import type { SelfEmployedInputs } from "@/types";

type FieldKey = keyof SelfEmployedInputs;

/** Fields are held as raw strings so the user can clear one without it snapping to 0. */
const DEFAULT_RAW: Record<FieldKey, string> = {
  netProfit: String(SELF_EMPLOYED_DEFAULTS.netProfit),
  depreciation: String(SELF_EMPLOYED_DEFAULTS.depreciation),
  interestExpenses: String(SELF_EMPLOYED_DEFAULTS.interestExpenses),
  superContributions: String(SELF_EMPLOYED_DEFAULTS.superContributions),
  directorsWages: String(SELF_EMPLOYED_DEFAULTS.directorsWages),
  otherAddBacks: String(SELF_EMPLOYED_DEFAULTS.otherAddBacks),
};

/** Segment colours, in the source's stacking order. */
const SEGMENT_COLOURS: Record<FieldKey, string> = {
  netProfit: "#d62b2b",
  depreciation: "#e8724c",
  interestExpenses: "#f0a040",
  superContributions: "#4a90d9",
  directorsWages: "#7c4dff",
  otherAddBacks: "#26a69a",
};

/** The source's legend lists only the first four segments. */
const LEGEND = [
  { label: "Net Profit", color: SEGMENT_COLOURS.netProfit },
  { label: "Depreciation", color: SEGMENT_COLOURS.depreciation },
  { label: "Interest", color: SEGMENT_COLOURS.interestExpenses },
  { label: "Super", color: SEGMENT_COLOURS.superContributions },
] as const;

/**
 * Self-employed borrowing power — net profit plus five add-backs, presented as
 * a stacked bar and three income multiples (4x / 4.5x / 5x).
 */
export function SelfEmployedCalculator() {
  const [raw, setRaw] = useState<Record<FieldKey, string>>(DEFAULT_RAW);

  const update = (key: FieldKey) => (next: string) =>
    setRaw((previous) => ({ ...previous, [key]: next }));

  const inputs: SelfEmployedInputs = {
    netProfit: parseAmount(raw.netProfit),
    depreciation: parseAmount(raw.depreciation),
    interestExpenses: parseAmount(raw.interestExpenses),
    superContributions: parseAmount(raw.superContributions),
    directorsWages: parseAmount(raw.directorsWages),
    otherAddBacks: parseAmount(raw.otherAddBacks),
  };

  const result = calculateSelfEmployed(inputs);

  const segments: StackedBarSegment[] = result.segments.map((segment) => ({
    label: segment.key,
    color: SEGMENT_COLOURS[segment.key],
    widthPercent: segment.widthPercent,
  }));

  return (
    <CalcCard>
      <LeftPanel>
        <PanelTitle>Your Financials</PanelTitle>

        <CurrencyField
          id="se-profit"
          label="Net Profit (from tax return)"
          value={raw.netProfit}
          onValueChange={update("netProfit")}
        />

        <FieldGroupTitle>Add-Back Expenses</FieldGroupTitle>
        <FieldGroupHint>
          These are expenses lenders typically add back to your net profit to calculate your
          borrowing capacity.
        </FieldGroupHint>

        <CurrencyField
          id="se-dep"
          label="Depreciation"
          value={raw.depreciation}
          onValueChange={update("depreciation")}
        />
        <CurrencyField
          id="se-int"
          label="Interest Expenses"
          value={raw.interestExpenses}
          onValueChange={update("interestExpenses")}
        />
        <CurrencyField
          id="se-super"
          label="Director's Super Contributions"
          value={raw.superContributions}
          onValueChange={update("superContributions")}
        />
        <CurrencyField
          id="se-wages"
          label="Director's Wages"
          value={raw.directorsWages}
          onValueChange={update("directorsWages")}
        />
        <CurrencyField
          id="se-other"
          label="Other Add-Backs"
          value={raw.otherAddBacks}
          onValueChange={update("otherAddBacks")}
        />
      </LeftPanel>

      <RightPanel>
        <RightPanelTitle>Your Adjusted Income</RightPanelTitle>
        <ResultHeadline
          label="Full Assessable Income"
          value={formatAud(result.assessableIncome)}
        />

        <StackedBar segments={segments} />
        <BarLegend items={LEGEND} />

        <SummaryRow label="Net Profit" value={formatAud(result.netProfit)} />
        <SummaryRow label="Total Add-Backs" value={`+${formatAud(result.totalAddBacks)}`} accent />

        <BorrowingPowerRows
          rows={[
            {
              label: "Conservative",
              multiple: "(4x)",
              value: formatAud(result.borrowingPower.conservative),
            },
            {
              label: "Moderate",
              multiple: "(4.5x)",
              value: formatAud(result.borrowingPower.moderate),
              highlight: true,
            },
            {
              label: "Optimistic",
              multiple: "(5x)",
              value: formatAud(result.borrowingPower.optimistic),
            },
          ]}
        />

        <BookConsultCta />
        <Disclaimer>
          *This is a simplified estimate. Lender policies vary — contact us for an accurate
          assessment.
        </Disclaimer>
      </RightPanel>
    </CalcCard>
  );
}
