import { DONUT_CIRCUMFERENCE } from "@/lib/calculators";

/**
 * `.donut-wrap` — the 140x140 ring used by the loan and stamp-duty panels.
 *
 * The source ships this as a static SVG whose two overlapping arcs are mutated
 * at runtime by `document.getElementById(...).setAttribute("stroke-dashoffset", …)`.
 * Here the offsets are props, so the arcs are simply re-rendered by React and
 * no ids are needed.
 *
 * Both calculators stack the same three circles — a `#252525` base ring, then
 * two arcs drawn in the order given. The arc listed first is painted
 * underneath, exactly matching the source's element order.
 */
export interface DonutArc {
  /** Stroke colour, e.g. `#d62b2b`. */
  color: string;
  /** `stroke-dashoffset`; `0` draws the ring in full. */
  dashOffset: number;
}

export interface DonutChartProps {
  /** `[under, over]` — painted in this order. */
  arcs: readonly [DonutArc, DonutArc];
  /** Large figure in the middle of the ring, e.g. `"44%"`. */
  centreValue: string;
  /** Caption beneath it, e.g. `"Principal"`. */
  centreLabel: string;
}

function Arc({ color, dashOffset }: DonutArc) {
  return (
    <circle
      cx="70"
      cy="70"
      r="52"
      fill="none"
      stroke={color}
      strokeWidth={16}
      strokeDasharray={DONUT_CIRCUMFERENCE}
      strokeDashoffset={dashOffset}
      transform="rotate(-90 70 70)"
    />
  );
}

export function DonutChart({ arcs, centreValue, centreLabel }: DonutChartProps) {
  const [under, over] = arcs;

  return (
    <div className="relative mt-[8px] mb-[14px] flex h-[140px] justify-center">
      <svg viewBox="0 0 140 140" width={140} height={140} aria-hidden="true" className="block">
        <circle cx="70" cy="70" r="52" fill="none" stroke="#252525" strokeWidth={16} />
        <Arc {...under} />
        <Arc {...over} />
      </svg>
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-[18px] leading-[1.1] font-bold text-white">{centreValue}</div>
        <div className="text-[9px] text-white/45">{centreLabel}</div>
      </div>
    </div>
  );
}
