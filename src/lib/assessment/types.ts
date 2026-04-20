/**
 * Shared types for the self-service assessments on availablelaw.com.
 * Two assessments today: SMB Liability Checkup (homepage) and FAIIR AI Self-Check (/faiir-check).
 */

export type AnswerValue = 0 | 1 | 2;

export type TierKey = "red" | "yellow" | "green";

export interface AnswerOption {
  label: string;
  helper?: string;
  value: AnswerValue;
}

export interface Question {
  id: string;
  areaId: string;
  prompt: string;
  helper?: string;
  /** Always three options, ordered weakest -> strongest (0, 1, 2). */
  options: [AnswerOption, AnswerOption, AnswerOption];
}

export interface Area {
  id: string;
  label: string;
  /** Short blurb shown in the per-area breakdown on the results page. */
  description: string;
  /** Per-tier recommendation body shown when this area lands in the given tier. */
  recommendations: Record<TierKey, string>;
}

export interface NextStep {
  label: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
  /** Optional second CTA (e.g. the FAIIR handoff on the SMB checkup). */
  secondary?: {
    ctaLabel: string;
    ctaHref: string;
    summary: string;
  };
}

export interface AssessmentDefinition {
  id: "smb" | "faiir";
  /** Short public name, used in UI copy. */
  name: string;
  /** Pitch above the "Start the checkup" CTA. */
  pitch: {
    eyebrow: string;
    heading: string;
    body: string;
    startCta: string;
    /** Trust stats shown under the CTA, e.g. "12 questions · ~4 min". */
    meta: string[];
  };
  /** Question set, ordered. */
  questions: Question[];
  /** Scoring areas. Max score per area is derived from the questions that target it. */
  areas: Area[];
  /**
   * Overall tier thresholds, expressed as a share of the max score.
   * e.g. green 0.75 means 75%+ of max points is green.
   */
  thresholds: {
    green: number;
    yellow: number;
  };
  /** Copy shown at the top of the results page based on overall tier. */
  overall: Record<
    TierKey,
    {
      title: string;
      summary: string;
    }
  >;
  /** Per-tier next-step CTA shown below the detailed breakdown. */
  nextStep: Record<TierKey, NextStep>;
  /** Required disclaimer — always rendered at the bottom. */
  disclaimer: string;
}

/* ------------------------------------------------------------------ */
/* Scoring helpers (pure)                                             */
/* ------------------------------------------------------------------ */

export interface AreaResult {
  area: Area;
  score: number;
  maxScore: number;
  tier: TierKey;
  pct: number;
}

export interface AssessmentResult {
  overallScore: number;
  overallMaxScore: number;
  overallPct: number;
  overallTier: TierKey;
  areas: AreaResult[];
}

export function tierFromPct(
  pct: number,
  thresholds: { green: number; yellow: number },
): TierKey {
  if (pct >= thresholds.green) return "green";
  if (pct >= thresholds.yellow) return "yellow";
  return "red";
}

export function scoreAssessment(
  def: AssessmentDefinition,
  answers: Record<string, AnswerValue>,
): AssessmentResult {
  const areas: AreaResult[] = def.areas.map((area) => {
    const areaQs = def.questions.filter((q) => q.areaId === area.id);
    const maxScore = areaQs.length * 2;
    const score = areaQs.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const pct = maxScore === 0 ? 0 : score / maxScore;
    return {
      area,
      score,
      maxScore,
      pct,
      tier: tierFromPct(pct, def.thresholds),
    };
  });

  const overallScore = areas.reduce((s, a) => s + a.score, 0);
  const overallMaxScore = areas.reduce((s, a) => s + a.maxScore, 0);
  const overallPct =
    overallMaxScore === 0 ? 0 : overallScore / overallMaxScore;

  return {
    overallScore,
    overallMaxScore,
    overallPct,
    overallTier: tierFromPct(overallPct, def.thresholds),
    areas,
  };
}
