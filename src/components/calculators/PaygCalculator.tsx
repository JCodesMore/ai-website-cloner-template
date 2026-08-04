"use client";

import { useState } from "react";

import {
  BarLegend,
  BookConsultCta,
  BorrowingPowerRows,
  CalcCard,
  CurrencyField,
  Disclaimer,
  FieldLabel,
  LeftPanel,
  PanelTitle,
  ResultHeadline,
  RightPanel,
  RightPanelTitle,
  StackedBar,
  type LegendItem,
  type StackedBarSegment,
} from "@/components/calculators/CalculatorPrimitives";
import { UserIcon, UsersIcon } from "@/components/icons";
import { PAYG_DEFAULTS, calculatePayg, formatAud, parseAmount } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import type { IncomeType, PaygInputs } from "@/types";

type AmountKey = "grossIncome" | "partnerGrossIncome" | "otherIncome" | "existingDebtRepayments";

const DEFAULT_RAW: Record<AmountKey, string> = {
  grossIncome: String(PAYG_DEFAULTS.grossIncome),
  partnerGrossIncome: String(PAYG_DEFAULTS.partnerGrossIncome),
  otherIncome: String(PAYG_DEFAULTS.otherIncome),
  existingDebtRepayments: String(PAYG_DEFAULTS.existingDebtRepayments),
};

const SEGMENT_COLOURS = {
  primary: "#d62b2b",
  partner: "#e8724c",
  other: "#4a90d9",
} as const;

const MUTED_LABEL = "font-normal text-[#888888]";

/** `.toggle-option` — one half of the Single / Household segmented control. */
function ToggleOption({
  active,
  onSelect,
  icon,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "flex h-[36px] flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[6px] border-none text-[13px] font-semibold transition-all duration-[180ms]",
        active ? "bg-[#d62b2b] text-white" : "bg-transparent text-[#888888]",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/**
 * PAYG borrowing power — gross salary (optionally with a partner's), other
 * income and existing repayments, netted against HEMS living expenses and
 * presented at 4.5x / 5x / 5.5x.
 */
export function PaygCalculator() {
  const [incomeType, setIncomeType] = useState<IncomeType>(PAYG_DEFAULTS.incomeType);
  const [raw, setRaw] = useState<Record<AmountKey, string>>(DEFAULT_RAW);

  const update = (key: AmountKey) => (next: string) =>
    setRaw((previous) => ({ ...previous, [key]: next }));

  const isHousehold = incomeType === "household";

  const inputs: PaygInputs = {
    incomeType,
    grossIncome: parseAmount(raw.grossIncome),
    partnerGrossIncome: parseAmount(raw.partnerGrossIncome),
    otherIncome: parseAmount(raw.otherIncome),
    existingDebtRepayments: parseAmount(raw.existingDebtRepayments),
    dependants: PAYG_DEFAULTS.dependants,
  };

  const result = calculatePayg(inputs);

  const segments: StackedBarSegment[] = result.segments.map((segment) => ({
    label: segment.key,
    color: SEGMENT_COLOURS[segment.key],
    widthPercent: segment.widthPercent,
  }));

  const legend: LegendItem[] = [
    { label: "Primary Income", color: SEGMENT_COLOURS.primary },
    ...(isHousehold ? [{ label: "Partner Income", color: SEGMENT_COLOURS.partner }] : []),
    { label: "Other Income", color: SEGMENT_COLOURS.other },
  ];

  return (
    <CalcCard>
      {/* The source puts the results panel first in this card — on mobile the
          dark panel therefore sits above the inputs. */}
      <RightPanel>
        <RightPanelTitle>Your Borrowing Estimate</RightPanelTitle>
        <ResultHeadline label="Total Gross Income" value={formatAud(result.totalGrossIncome)} />

        <StackedBar segments={segments} />
        <BarLegend items={legend} />

        <div className="mb-[4px] flex items-start justify-between border-t border-white/7 py-[10px]">
          <div>
            <div className="text-[12px] text-white/50">Living Expenses (HEMS)</div>
            <div className="mt-[2px] max-w-[200px] text-[10px] leading-[1.4] text-white/30">
              Based on Household Expenditure Measure for your income &amp; dependants
            </div>
          </div>
          <div className="text-[13px] font-semibold whitespace-nowrap text-white">
            {formatAud(result.hemsAnnual)}/yr
          </div>
        </div>

        <BorrowingPowerRows
          rows={[
            {
              label: "Conservative",
              multiple: "(4.5x)",
              value: formatAud(result.borrowingPower.conservative),
            },
            {
              label: "Moderate",
              multiple: "(5x)",
              value: formatAud(result.borrowingPower.moderate),
              highlight: true,
            },
            {
              label: "Optimistic",
              multiple: "(5.5x)",
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

      <LeftPanel>
        <PanelTitle>Your Income Details</PanelTitle>

        <FieldLabel>Income Type</FieldLabel>
        <div className="mb-[20px] flex gap-[2px] overflow-hidden rounded-[8px] border-[1.5px] border-[#e0e0e0] bg-[#fafafa] p-[2px]">
          <ToggleOption
            active={!isHousehold}
            onSelect={() => setIncomeType("single")}
            icon={<UserIcon className="size-[14px] shrink-0" />}
          >
            Single
          </ToggleOption>
          <ToggleOption
            active={isHousehold}
            onSelect={() => setIncomeType("household")}
            icon={<UsersIcon className="size-[14px] shrink-0" />}
          >
            Household
          </ToggleOption>
        </div>

        {isHousehold ? (
          <>
            <CurrencyField
              id="payg-inc1h"
              label="Your Gross Annual Income"
              value={raw.grossIncome}
              onValueChange={update("grossIncome")}
            />
            <CurrencyField
              id="payg-inc2"
              label="Partner's Gross Annual Income"
              value={raw.partnerGrossIncome}
              onValueChange={update("partnerGrossIncome")}
            />
          </>
        ) : (
          <CurrencyField
            id="payg-inc1"
            label="Gross Annual Income"
            value={raw.grossIncome}
            onValueChange={update("grossIncome")}
          />
        )}

        <FieldLabel className="mt-[6px]">Additional Details</FieldLabel>

        <CurrencyField
          id="payg-other"
          label="Other Annual Income (rental, investments, etc.)"
          labelClassName={cn("mt-[4px]", MUTED_LABEL)}
          value={raw.otherIncome}
          onValueChange={update("otherIncome")}
        />
        <CurrencyField
          id="payg-debt"
          label="Existing Annual Debt Repayments"
          labelClassName={MUTED_LABEL}
          value={raw.existingDebtRepayments}
          onValueChange={update("existingDebtRepayments")}
        />
      </LeftPanel>
    </CalcCard>
  );
}
