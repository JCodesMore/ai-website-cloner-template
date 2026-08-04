"use client";

import type { ComponentType } from "react";

import type { IconProps } from "@/components/icons";
import {
  CheckCircleIcon,
  FileSearchIcon,
  FolderUpIcon,
  HeartPulseIcon,
  HomeIcon,
  MessageSquareIcon,
} from "@/components/icons";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import type { ProcessStep } from "@/types";

/**
 * `section.journey-section` from fundup.au.
 *
 * Six steps that fade + rise into place as they scroll in — one-shot, never replayed,
 * staggered 150ms apart. The source observes EACH step with its own IntersectionObserver
 * (`threshold: 0.1`, `unobserve` on first hit), which is why every step here calls
 * `useInView` for itself rather than sharing one observer on the grid: on mobile the steps
 * stack into a tall column and enter the viewport at genuinely different times.
 *
 * The section uses Inter and the site's `#bc1a1a` red, except the step SVGs, which the
 * source strokes in `#E63946` — a distinct red preserved verbatim (see FIXES.md).
 *
 * See docs/research/components/testimonials-and-journey.spec.md.
 */

interface JourneyStepItem extends ProcessStep {
  readonly Icon: ComponentType<IconProps>;
}

const JOURNEY_STEPS: readonly JourneyStepItem[] = [
  {
    number: "01",
    title: "Enquiry",
    description:
      "Reach out for a free, no-obligation chat. We learn about your goals and situation.",
    Icon: MessageSquareIcon,
  },
  {
    number: "02",
    title: "Pre-Assessment",
    description:
      "We analyse your financials, assess borrowing power, and identify the best lender options.",
    Icon: FileSearchIcon,
  },
  {
    number: "03",
    title: "Doc Collection & Lodgement",
    description:
      "We handle the paperwork, package your application, and lodge it with the chosen lender.",
    Icon: FolderUpIcon,
  },
  {
    number: "04",
    title: "Approval",
    description:
      "Your loan is assessed and approved. We keep you updated at every stage and negotiate on your behalf.",
    Icon: CheckCircleIcon,
  },
  {
    number: "05",
    title: "Settlement",
    description:
      "Everything is finalised and funds are released. You get the keys — we make sure it's seamless.",
    Icon: HomeIcon,
  },
  {
    number: "06",
    title: "Post-Settlement Health Checks",
    description:
      "We don't disappear after settlement. Regular reviews ensure your loan stays competitive as life changes.",
    Icon: HeartPulseIcon,
  },
];

/**
 * The source's `setTimeout(..., idx * 150)` expressed as CSS transition-delay. Spelled out
 * as literals so Tailwind's scanner emits every class; a template string would not be seen.
 */
const STAGGER_DELAYS = [
  "delay-0",
  "delay-[150ms]",
  "delay-[300ms]",
  "delay-[450ms]",
  "delay-[600ms]",
  "delay-[750ms]",
] as const;

/** `.journey-step` — one observer each, matching the source's per-element observation. */
function JourneyStep({ step, index }: { step: JourneyStepItem; index: number }) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { Icon } = step;

  return (
    <div
      ref={ref}
      className={cn(
        // ≤767px: row, left-aligned, 24px gap. ≥768px: centred column, 16px gap.
        "flex flex-row items-start gap-6 text-left min-[768px]:flex-col min-[768px]:items-center min-[768px]:gap-4 min-[768px]:text-center",
        // State A → State B: opacity 0/1, translateY(20px)/0, 700ms ease-out.
        // `translate` is listed alongside `transform`: Tailwind v4 compiles `translate-y-*`
        // to the standalone `translate` property, so a bare `transform` list would let the
        // rise snap into place and animate only the fade.
        // `ease-[ease-out]` is the literal CSS keyword the source uses. Tailwind's bare
        // `ease-out` maps to `--ease-out: cubic-bezier(0,0,.2,1)`, a different curve.
        "transition-[opacity,transform,translate] duration-700 ease-[ease-out]",
        STAGGER_DELAYS[index],
        "motion-reduce:transition-none motion-reduce:delay-0",
        isInView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      {/* .journey-step_icon-wrap */}
      <div className="flex size-14 shrink-0 cursor-default flex-col items-center justify-center gap-2 rounded-[12px] border border-[#3a3a3a] bg-[#2a2a2a] p-4 transition-all duration-500 hover:border-[#bc1a1a66] hover:bg-[#bc1a1a1a] min-[768px]:mb-6 min-[768px]:size-[110px] min-[768px]:rounded-[20px]">
        <Icon className="size-7 shrink-0 text-[#E63946]" />
        <span className="text-[10px] font-bold tracking-[1.5px] text-[#bc1a1a] uppercase">
          STEP {step.number}
        </span>
      </div>

      {/* .journey-step_content */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-inter m-0 text-center text-[15px] leading-[1.3] font-bold text-white">
          {step.title}
        </h3>
        <p className="m-0 text-center text-[13px] leading-[1.6] text-[#aaa]">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function JourneyTimeline() {
  return (
    <section className="relative overflow-hidden bg-[#0f0f0f] py-24">
      {/* .journey-section_container — same box as .container-site, but in Inter */}
      <div className="container-site font-inter">
        {/* .journey-section_header */}
        <div className="mx-auto max-w-[640px] text-center">
          <p className="mb-3 text-center text-[12px] font-semibold tracking-[0.15em] text-[#bc1a1a] uppercase">
            HOW IT WORKS
          </p>
          <h2 className="font-inter m-0 mb-4 text-center text-[32px] leading-[1.15] font-bold text-white min-[992px]:text-[44px]">
            Your <span className="text-[#bc1a1a]">journey</span> with us
          </h2>
          <p className="m-0 mb-16 text-center text-[16px] leading-[1.6] text-[#aaa]">
            From the first conversation to ongoing support — here&rsquo;s what working with
            FundUp looks like.
          </p>
        </div>

        {/* .journey-section_grid */}
        <div
          id="journey-grid"
          className="relative flex flex-col gap-10 min-[768px]:grid min-[768px]:grid-cols-3 min-[768px]:items-start min-[768px]:gap-x-4 min-[768px]:gap-y-0 min-[992px]:grid-cols-6"
        >
          {/* .journey-timeline-line — the connector behind the stacked mobile steps only */}
          <div className="absolute top-0 bottom-0 left-[27px] w-px bg-[#bc1a1a26] min-[768px]:hidden" />

          {JOURNEY_STEPS.map((step, index) => (
            <JourneyStep key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
