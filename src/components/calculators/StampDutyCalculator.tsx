"use client";

import { useState } from "react";

import {
  BookConsultCta,
  CalcCard,
  Disclaimer,
  DonutLegend,
  FieldLabel,
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
  AUSTRALIAN_STATES,
  PROPERTY_PRICE_RANGE,
  STAMP_DUTY_DEFAULTS,
  calculateStampDuty,
  formatAud,
  formatPercent,
} from "@/lib/calculators";
import { cn } from "@/lib/utils";
import type { AustralianState, BuyerType, StampDutyInputs } from "@/types";

const PROPERTY_COLOUR = "#d62b2b";
const DUTY_COLOUR = "#444444";

const BUYER_TYPES: readonly { value: BuyerType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "firstHomeBuyer", label: "First Home Buyer" },
];

/** `.radio-option` — a custom radio rendered as an accessible button. */
function RadioOption({
  active,
  label,
  onSelect,
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className="flex cursor-pointer items-center gap-[7px] text-[13px] font-medium text-[#222222] select-none"
    >
      <span
        className={cn(
          "flex size-[16px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150",
          active ? "border-[#d62b2b]" : "border-[#e0e0e0]",
        )}
      >
        {active ? <span className="size-[7px] rounded-full bg-[#d62b2b]" /> : null}
      </span>
      {label}
    </button>
  );
}

/**
 * Stamp duty — progressive per-state brackets plus first-home-buyer
 * exemptions, with a donut showing duty as a share of the total upfront cost.
 */
export function StampDutyCalculator() {
  const [inputs, setInputs] = useState<StampDutyInputs>(STAMP_DUTY_DEFAULTS);

  const result = calculateStampDuty(inputs);

  const setState = (state: AustralianState) =>
    setInputs((previous) => ({ ...previous, state }));
  const setBuyerType = (buyerType: BuyerType) =>
    setInputs((previous) => ({ ...previous, buyerType }));

  return (
    <CalcCard>
      <LeftPanel>
        <PanelTitle>Property Details</PanelTitle>

        <SliderField
          id="sd-price"
          label="Property Price"
          valueLabel={formatAud(inputs.propertyPrice)}
          min={PROPERTY_PRICE_RANGE.min}
          max={PROPERTY_PRICE_RANGE.max}
          step={PROPERTY_PRICE_RANGE.step}
          value={inputs.propertyPrice}
          onValueChange={(propertyPrice) =>
            setInputs((previous) => ({ ...previous, propertyPrice }))
          }
          minLabel="$100K"
          maxLabel="$3M"
        />

        <FieldLabel className="mt-[4px]">State / Territory</FieldLabel>
        <div className="mb-[20px] grid grid-cols-4 gap-[6px]">
          {AUSTRALIAN_STATES.map((state) => {
            const active = inputs.state === state;
            return (
              <button
                key={state}
                type="button"
                aria-pressed={active}
                onClick={() => setState(state)}
                className={cn(
                  "h-[34px] cursor-pointer rounded-[7px] border-[1.5px] text-[12px] font-semibold transition-all duration-150",
                  active
                    ? "border-[#d62b2b] bg-[#d62b2b] text-white"
                    : "border-[#e0e0e0] bg-[#fafafa] text-[#222222] hover:border-[#d62b2b] hover:text-[#d62b2b]",
                )}
              >
                {state}
              </button>
            );
          })}
        </div>

        <FieldLabel>Buyer Type</FieldLabel>
        <div role="radiogroup" aria-label="Buyer Type" className="mt-[8px] flex gap-[20px]">
          {BUYER_TYPES.map((option) => (
            <RadioOption
              key={option.value}
              active={inputs.buyerType === option.value}
              label={option.label}
              onSelect={() => setBuyerType(option.value)}
            />
          ))}
        </div>
      </LeftPanel>

      <RightPanel>
        <RightPanelTitle>Stamp Duty Estimate</RightPanelTitle>
        <ResultHeadline label="Estimated Stamp Duty" value={formatAud(result.duty)} />

        {/* Red property ring first, grey duty arc painted over it. */}
        <DonutChart
          arcs={[
            { color: PROPERTY_COLOUR, dashOffset: 0 },
            { color: DUTY_COLOUR, dashOffset: result.dutyArcOffset },
          ]}
          centreValue={formatPercent(result.dutyPercentOfTotalCost, 1)}
          centreLabel="of total cost"
        />

        <DonutLegend
          items={[
            { label: `Property ${formatAud(result.propertyPrice)}`, color: PROPERTY_COLOUR },
            { label: `Duty ${formatAud(result.duty)}`, color: DUTY_COLOUR },
          ]}
        />

        <SummaryRow label="Property Price" value={formatAud(result.propertyPrice)} />
        <SummaryRow label="Total Upfront Cost" value={formatAud(result.totalUpfrontCost)} />
        <SummaryRow
          label="Duty as % of Price"
          value={formatPercent(result.dutyPercentOfPrice, 1)}
        />

        <BookConsultCta className="mt-[16px]" />
        <Disclaimer>
          *Estimates only. Concessions &amp; exemptions may apply. Contact us for accurate figures.
        </Disclaimer>
      </RightPanel>
    </CalcCard>
  );
}
