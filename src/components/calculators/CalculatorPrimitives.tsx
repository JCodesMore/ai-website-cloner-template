"use client";

import type { ReactNode } from "react";

import { ConsultDialog } from "@/components/calculators/ConsultDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { trackPercent } from "@/lib/calculators";

/**
 * Presentational building blocks shared by the four calculators.
 *
 * Class names are a one-to-one translation of the `<style>` block inside the
 * Webflow embed — the comment above each component names the original selector.
 * The embed carries its own palette (`--red:#d62b2b`), which is why these use
 * `#d62b2b` rather than the site token `--brand: #bc1a1a`; see the spec.
 */

/** Shared easing: the CSS keyword `ease`, spelled out for Tailwind. */
const EASE = "ease-[cubic-bezier(0.25,0.1,0.25,1)]";

/* -------------------------------------------------------------------------- */
/*  Card + panels                                                             */
/* -------------------------------------------------------------------------- */

/** `.calc-card` — two equal columns, collapsing to one at ≤700px. */
export function CalcCard({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[18px] bg-white shadow-[0_4px_40px_rgba(0,0,0,0.1)] min-[701px]:grid-cols-2">
      {children}
    </div>
  );
}

/** `.left-panel` — white input side. */
export function LeftPanel({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-[#e0e0e0] bg-white px-[28px] py-[32px] min-[701px]:border-r min-[701px]:border-b-0">
      {children}
    </div>
  );
}

/** `.right-panel` — near-black results side. */
export function RightPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col bg-[#111111] px-[28px] py-[32px] text-white">{children}</div>
  );
}

/** `.panel-title` — heading above the inputs. */
export function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-[22px] text-[14px] font-bold tracking-[0.02em] text-[#222222]">
      {children}
    </div>
  );
}

/** `.right-panel-title` — muted heading above the results. */
export function RightPanelTitle({ children }: { children: ReactNode }) {
  return <div className="mb-[6px] text-[13px] font-semibold text-white/50">{children}</div>;
}

/** `.result-label` + `.result-big` — the headline figure. */
export function ResultHeadline({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="mb-[4px] text-[11px] font-medium tracking-[0.04em] text-white/45 uppercase">
        {label}
      </div>
      <div
        className={cn(
          "mb-[18px] text-[clamp(28px,4vw,40px)] leading-none font-bold tracking-[-0.01em] text-[#d62b2b] transition-all duration-[250ms]",
          EASE,
        )}
      >
        {value}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inputs                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * `.field-label`. Renders a real `<label>` when it is bound to a control and a
 * plain block otherwise — the source uses bare `<label>` elements as sub-heads.
 */
export function FieldLabel({
  htmlFor,
  className,
  children,
}: {
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(
    "mb-[7px] block text-[12px] leading-[20px] font-semibold text-[#222222]",
    className,
  );

  if (htmlFor === undefined) {
    return <div className={classes}>{children}</div>;
  }
  return (
    <Label htmlFor={htmlFor} className={classes}>
      {children}
    </Label>
  );
}

/** `.addbacks-title` — bolder sub-head introducing the add-back fields. */
export function FieldGroupTitle({ children }: { children: ReactNode }) {
  return (
    <span className="mt-[20px] mb-[4px] block text-[12px] font-bold text-[#222222]">
      {children}
    </span>
  );
}

/** `.addbacks-hint` — explanatory copy under a group title. */
export function FieldGroupHint({ children }: { children: ReactNode }) {
  return (
    <span className="mb-[14px] block text-[11px] leading-[1.5] text-[#888888]">{children}</span>
  );
}

/**
 * `.input-wrap` + `input[type=number]` — a dollar-prefixed currency field.
 *
 * Kept as a raw string in state so the field can be cleared; the numeric value
 * is derived with `parseAmount`, mirroring the source's `+el.value || 0`.
 */
export function CurrencyField({
  id,
  label,
  value,
  onValueChange,
  labelClassName,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (next: string) => void;
  labelClassName?: string;
}) {
  return (
    <>
      <FieldLabel htmlFor={id} className={labelClassName}>
        {label}
      </FieldLabel>
      <div className="relative mb-[16px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-[12px] -translate-y-1/2 text-[13px] font-medium text-[#888888]"
        >
          $
        </span>
        <Input
          id={id}
          type="number"
          min={0}
          inputMode="numeric"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="h-[40px] w-full rounded-[8px] border-[1.5px] border-[#e0e0e0] bg-[#fafafa] py-0 pr-[12px] pl-[26px] text-[14px] text-[#222222] transition-colors duration-150 [appearance:textfield] focus-visible:border-[#d62b2b] focus-visible:bg-white focus-visible:ring-0 md:text-[14px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
    </>
  );
}

/**
 * `.slider-row` — a labelled `<input type="range">`.
 *
 * The track's red fill is a `linear-gradient` computed from the current value,
 * exactly as the source's `track()` helper does.
 */
export function SliderField({
  id,
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onValueChange,
  minLabel,
  maxLabel,
}: {
  id: string;
  label: string;
  /** Formatted current value shown at the right of the label row. */
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (next: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  const fill = trackPercent(value, min, max).toFixed(2);

  return (
    <div className="mb-[22px]">
      <div className="mb-[8px] flex items-center justify-between">
        <Label htmlFor={id} className="text-[12px] leading-[20px] font-semibold text-[#222222]">
          {label}
        </Label>
        <span className="text-[13px] font-bold text-[#d62b2b]">{valueLabel}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        style={{ background: `linear-gradient(to right,#d62b2b ${fill}%,#ddd ${fill}%)` }}
        className="h-[4px] w-full cursor-pointer appearance-none rounded-[2px] outline-none [&::-moz-range-thumb]:size-[18px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#d62b2b] [&::-moz-range-thumb]:shadow-[0_2px_6px_rgba(214,43,43,0.35)] [&::-webkit-slider-thumb]:size-[18px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#d62b2b] [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(214,43,43,0.35)]"
      />
      <div className="mt-[4px] flex justify-between">
        <span className="text-[10px] text-[#888888]">{minLabel}</span>
        <span className="text-[10px] text-[#888888]">{maxLabel}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Results                                                                   */
/* -------------------------------------------------------------------------- */

export interface StackedBarSegment {
  /** Legend/accessibility name — also the React key. */
  label: string;
  color: string;
  /** 0–100. Written out with two decimals, as the source does. */
  widthPercent: number;
}

/** `.stacked-bar` + `.bar-segment` — income composition. */
export function StackedBar({ segments }: { segments: readonly StackedBarSegment[] }) {
  return (
    <div className="mb-[8px] flex h-[8px] overflow-hidden rounded-[4px] bg-[#333333]">
      {segments.map((segment) => (
        <div
          key={segment.label}
          className={cn("h-full min-w-0 transition-[width] duration-[350ms]", EASE)}
          style={{ width: `${segment.widthPercent.toFixed(2)}%`, backgroundColor: segment.color }}
        />
      ))}
    </div>
  );
}

export interface LegendItem {
  label: string;
  color: string;
}

/** `.bar-legend` — square swatches beneath a stacked bar. */
export function BarLegend({ items }: { items: readonly LegendItem[] }) {
  return (
    <div className="mb-[18px] flex flex-wrap gap-[10px]">
      {items.map((item) => (
        <div key={item.color} className="flex items-center gap-[5px] text-[10px] text-white/55">
          <div
            className="size-[8px] shrink-0 rounded-[2px]"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}

/** `.donut-legend` — round swatches beneath a donut. */
export function DonutLegend({ items }: { items: readonly LegendItem[] }) {
  return (
    <div className="mb-[14px] flex justify-center gap-[20px]">
      {items.map((item) => (
        <div key={item.color} className="flex items-center gap-[6px] text-[10px] text-white/55">
          <div className="size-[8px] shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * `.summary-row` — a label/value pair with a hairline rule.
 *
 * `:last-of-type` drops the rule only when the row is the last `div` in the
 * panel, so the self-employed card keeps both rules while the loan and stamp
 * duty cards lose their last one — matching the source exactly.
 */
export function SummaryRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/7 py-[8px] [&:last-of-type]:border-b-0">
      <span className="text-[12px] text-white/50">{label}</span>
      <span className={cn("text-[13px] font-semibold", accent ? "text-[#d62b2b]" : "text-white")}>
        {value}
      </span>
    </div>
  );
}

export interface BorrowingPowerRow {
  /** e.g. `"Conservative"`. */
  label: string;
  /** e.g. `"(4x)"` — the source includes the parentheses in the text node. */
  multiple: string;
  value: string;
  highlight?: boolean;
}

/** `.bp-section-title` + `.bp-rows` — the three borrowing-power multiples. */
export function BorrowingPowerRows({ rows }: { rows: readonly BorrowingPowerRow[] }) {
  return (
    <>
      <div className="mt-[18px] mb-[10px] text-[10px] font-bold tracking-[0.08em] text-white/40 uppercase">
        Estimated Borrowing Power
      </div>
      <div className="mb-[18px] flex flex-col gap-[7px]">
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center justify-between rounded-[8px] px-[14px] py-[10px]",
              row.highlight ? "bg-[#d62b2b]/18" : "bg-white/5",
            )}
          >
            <div className="text-[12px] text-white/60">
              {row.label}
              <span className="ml-[3px] text-[10px] text-white/35">{row.multiple}</span>
            </div>
            <div
              className={cn(
                "text-[14px] font-bold transition-all duration-[250ms]",
                EASE,
                row.highlight ? "text-[#d62b2b]" : "text-white",
              )}
            >
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * `.cta-btn` — "Book Free Consult".
 *
 * **No longer navigates anywhere** (client direction — see `docs/research/FIXES.md`). The source
 * is a `<button onclick='window.open("https://fundup.au/contact","_blank")'>`, and `/contact`
 * carries no form at all, so the button used to abandon the calculator for a dead end. It now
 * opens `ConsultDialog` in place. The `.cta-btn` treatment below is unchanged — only the element
 * and its behaviour differ.
 *
 * `mt-auto` survives the switch because `Dialog.Root` renders no DOM element of its own, so the
 * trigger is still a direct flex child of `.right-panel`.
 */
export function BookConsultCta({ className }: { className?: string }) {
  return (
    <ConsultDialog
      triggerClassName={cn(
        "mt-auto flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#d62b2b] text-[13px] font-bold tracking-[0.01em] text-white transition-[background-color,translate] duration-150 hover:-translate-y-px hover:bg-[#b82020] active:translate-y-0",
        className,
      )}
    />
  );
}

/** `.disclaimer` — small print under the CTA. */
export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="mt-[10px] text-center text-[10px] leading-[1.5] text-white/30">{children}</p>
  );
}
