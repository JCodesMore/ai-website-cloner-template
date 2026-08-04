import type { ReactNode } from "react";

/**
 * `.calc-section` — the heading block that introduces each calculator.
 *
 * The embed lays every calculator out identically: a pill badge, a centred
 * title, a 480px-wide description, then the two-panel card. This wrapper is a
 * Server Component so only the card itself ships to the browser.
 */
export interface CalculatorSectionProps {
  /** Pill label. Rendered uppercase by CSS — pass the source's own casing. */
  badge: string;
  /** 13x13 stroke icon shown inside the pill. */
  icon: ReactNode;
  title: string;
  description: string;
  /** The `.calc-card` for this calculator. */
  children: ReactNode;
}

export function CalculatorSection({
  badge,
  icon,
  title,
  description,
  children,
}: CalculatorSectionProps) {
  return (
    <div className="mx-auto max-w-[980px] px-[24px] pt-[70px] pb-[80px]">
      <div className="text-center">
        <span className="mb-[18px] inline-flex items-center gap-[6px] rounded-[100px] border border-[#d62b2b]/15 bg-[#d62b2b]/8 px-[14px] py-[5px] font-inter text-[11px] font-semibold tracking-[0.04em] text-[#d62b2b] uppercase">
          {icon}
          {badge}
        </span>
        <h2 className="mb-[10px] text-center font-inter text-[clamp(26px,4vw,38px)] leading-[1.15] font-extrabold text-[#222222]">
          {title}
        </h2>
        <p className="mx-auto mb-[36px] max-w-[480px] text-center font-inter text-[14.5px] leading-[1.6] text-[#888888]">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

/** `hr.calc-divider` — the hairline between two calculators. */
export function CalculatorDivider() {
  return <hr className="mx-auto max-w-[980px] border-0 border-t border-[#e0e0e0]" />;
}
