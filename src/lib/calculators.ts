/**
 * Calculation engine for `/calculators`.
 *
 * Every formula below is a **verbatim port** of the minified `<script>` that
 * ships inside the single Webflow embed on https://www.fundup.au/calculators.
 * The embed is a complete nested HTML document (its own `<style>` + `<script>`),
 * so none of this maths is inferred — see
 * `docs/research/components/calculators.spec.md` for the decompiled source of
 * each function and the two places where the shipped markup disagrees with the
 * shipped script.
 *
 * Nothing here touches the DOM: the components are purely presentational and
 * call these functions during render.
 */

import type {
  AustralianState,
  BorrowingPowerResult,
  BuyerType,
  LoanInputs,
  PaygInputs,
  SelfEmployedInputs,
  StampDutyInputs,
} from "@/types";

/* -------------------------------------------------------------------------- */
/*  Formatting                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The source's `AU` helper: `"$" + Math.round(n).toLocaleString("en-AU")`.
 *
 * Implemented with manual thousands grouping rather than `toLocaleString` so
 * the server and the client always agree — `Intl` output depends on the host's
 * ICU build, and a mismatch would produce a hydration error.
 */
export function formatAud(value: number): string {
  const rounded = Math.round(value);
  const grouped = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rounded < 0 ? `$-${grouped}` : `$${grouped}`;
}

/** `n.toFixed(digits) + "%"` — the source formats every percentage this way. */
export function formatPercent(value: number, fractionDigits: number): string {
  return `${value.toFixed(fractionDigits)}%`;
}

/**
 * The source reads every `<input type="number">` as `+el.value || 0`, so an
 * empty or unparseable field contributes zero rather than `NaN`.
 */
export function parseAmount(raw: string): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Red-to-grey split point of a range input's track, as a percentage.
 * Ported from the source's `track()` / `sdTrack()` helpers.
 */
export function trackPercent(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

/* -------------------------------------------------------------------------- */
/*  Shared constants                                                          */
/* -------------------------------------------------------------------------- */

/**
 * `stroke-dasharray` used by both donut widgets. The rings are `r="52"`
 * (circumference 326.7256…) but the source hardcodes `327`, so the arcs are
 * driven with 327 here too — anything else shifts the sweep by ~0.1%.
 */
export const DONUT_CIRCUMFERENCE = 327;

/** Slider bounds, lifted from the `min` / `max` / `step` attributes. */
export const LOAN_AMOUNT_RANGE = { min: 50_000, max: 2_000_000, step: 5_000 } as const;
export const LOAN_RATE_RANGE = { min: 2, max: 12, step: 0.1 } as const;
export const LOAN_TERM_RANGE = { min: 1, max: 30, step: 1 } as const;
export const PROPERTY_PRICE_RANGE = { min: 100_000, max: 3_000_000, step: 5_000 } as const;

/* -------------------------------------------------------------------------- */
/*  1. Self-employed borrowing power                                          */
/* -------------------------------------------------------------------------- */

export type SelfEmployedSegmentKey =
  | "netProfit"
  | "depreciation"
  | "interestExpenses"
  | "superContributions"
  | "directorsWages"
  | "otherAddBacks";

export interface SelfEmployedSegment {
  key: SelfEmployedSegmentKey;
  value: number;
  /** Share of assessable income, 0–100. Clamped at zero like the source. */
  widthPercent: number;
}

export interface SelfEmployedResult {
  netProfit: number;
  totalAddBacks: number;
  /** Net profit plus every add-back — the headline "Full Assessable Income". */
  assessableIncome: number;
  borrowingPower: BorrowingPowerResult;
  /** Stacked-bar composition, in the source's segment order. */
  segments: SelfEmployedSegment[];
}

/** Income multiples the self-employed panel presents. */
export const SELF_EMPLOYED_MULTIPLES = {
  conservative: 4,
  moderate: 4.5,
  optimistic: 5,
} as const;

export const SELF_EMPLOYED_DEFAULTS: SelfEmployedInputs = {
  netProfit: 120_000,
  depreciation: 15_000,
  interestExpenses: 10_000,
  superContributions: 12_000,
  directorsWages: 0,
  otherAddBacks: 0,
};

/**
 * Port of `calcSE()`.
 *
 * ```js
 * a = dep + int + super + wages + other   // total add-backs
 * c = profit + a                          // full assessable income
 * cons = 4 * c, mod = 4.5 * c, opt = 5 * c
 * width(x) = (Math.max(x, 0) / c * 100).toFixed(2) + "%"   // only when c > 0
 * ```
 */
export function calculateSelfEmployed(inputs: SelfEmployedInputs): SelfEmployedResult {
  const {
    netProfit,
    depreciation,
    interestExpenses,
    superContributions,
    directorsWages,
    otherAddBacks,
  } = inputs;

  const totalAddBacks =
    depreciation + interestExpenses + superContributions + directorsWages + otherAddBacks;
  const assessableIncome = netProfit + totalAddBacks;

  // The source only rewrites the bar widths inside an `if (c > 0)` guard; the
  // segments keep their initial (unset, i.e. zero) width otherwise.
  const share = (value: number): number =>
    assessableIncome > 0 ? (Math.max(value, 0) / assessableIncome) * 100 : 0;

  return {
    netProfit,
    totalAddBacks,
    assessableIncome,
    borrowingPower: {
      conservative: assessableIncome * SELF_EMPLOYED_MULTIPLES.conservative,
      moderate: assessableIncome * SELF_EMPLOYED_MULTIPLES.moderate,
      optimistic: assessableIncome * SELF_EMPLOYED_MULTIPLES.optimistic,
    },
    segments: [
      { key: "netProfit", value: netProfit, widthPercent: share(netProfit) },
      { key: "depreciation", value: depreciation, widthPercent: share(depreciation) },
      { key: "interestExpenses", value: interestExpenses, widthPercent: share(interestExpenses) },
      {
        key: "superContributions",
        value: superContributions,
        widthPercent: share(superContributions),
      },
      { key: "directorsWages", value: directorsWages, widthPercent: share(directorsWages) },
      { key: "otherAddBacks", value: otherAddBacks, widthPercent: share(otherAddBacks) },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  2. PAYG borrowing power                                                   */
/* -------------------------------------------------------------------------- */

export type PaygSegmentKey = "primary" | "partner" | "other";

export interface PaygSegment {
  key: PaygSegmentKey;
  value: number;
  /** Share of total gross income, 0–100. */
  widthPercent: number;
}

export interface PaygResult {
  primaryIncome: number;
  partnerIncome: number;
  otherIncome: number;
  totalGrossIncome: number;
  /** Household Expenditure Measure applied for the selected income type. */
  hemsAnnual: number;
  /** Income the multiples are applied to, after debts and living expenses. */
  assessableIncome: number;
  borrowingPower: BorrowingPowerResult;
  segments: PaygSegment[];
}

/** Flat HEMS figures — the source has no dependants input (see the spec). */
export const HEMS_SINGLE = 30_000;
export const HEMS_HOUSEHOLD = 44_000;

/** Existing repayments are shaded at 120% before being deducted. */
export const DEBT_LOADING = 1.2;

/** Assessable income never drops below half of gross income. */
export const ASSESSABLE_INCOME_FLOOR_RATIO = 0.5;

/** Income multiples the PAYG panel presents. */
export const PAYG_MULTIPLES = {
  conservative: 4.5,
  moderate: 5,
  optimistic: 5.5,
} as const;

export const PAYG_DEFAULTS: PaygInputs = {
  incomeType: "single",
  grossIncome: 85_000,
  partnerGrossIncome: 65_000,
  otherIncome: 0,
  existingDebtRepayments: 0,
  // The embed ships no dependants control; the field is carried for the shared
  // `PaygInputs` shape and is deliberately not part of the maths.
  dependants: 0,
};

/**
 * Port of `calcPayg()`.
 *
 * ```js
 * o = income1 + income2 + other                        // total gross income
 * l = mode === "household" ? 44000 : 30000             // HEMS
 * a = Math.max(o - 1.2 * debt - l, 0.5 * o)            // assessable income
 * cons = 4.5 * a, mod = 5 * a, opt = 5.5 * a
 * ```
 *
 * Partner income only counts in household mode — the source reads it from an
 * input that is hidden (and therefore ignored) while "Single" is selected.
 */
export function calculatePayg(inputs: PaygInputs): PaygResult {
  const isHousehold = inputs.incomeType === "household";

  const primaryIncome = inputs.grossIncome;
  const partnerIncome = isHousehold ? inputs.partnerGrossIncome : 0;
  const otherIncome = inputs.otherIncome;

  const totalGrossIncome = primaryIncome + partnerIncome + otherIncome;
  const hemsAnnual = isHousehold ? HEMS_HOUSEHOLD : HEMS_SINGLE;

  const assessableIncome = Math.max(
    totalGrossIncome - DEBT_LOADING * inputs.existingDebtRepayments - hemsAnnual,
    ASSESSABLE_INCOME_FLOOR_RATIO * totalGrossIncome,
  );

  // Widths are only recomputed when `o > 0`; otherwise the markup's initial
  // 100% / 0% / 0% split stands.
  const segments: PaygSegment[] =
    totalGrossIncome > 0
      ? [
          {
            key: "primary",
            value: primaryIncome,
            widthPercent: (primaryIncome / totalGrossIncome) * 100,
          },
          {
            key: "partner",
            value: partnerIncome,
            widthPercent: (partnerIncome / totalGrossIncome) * 100,
          },
          { key: "other", value: otherIncome, widthPercent: (otherIncome / totalGrossIncome) * 100 },
        ]
      : [
          { key: "primary", value: primaryIncome, widthPercent: 100 },
          { key: "partner", value: partnerIncome, widthPercent: 0 },
          { key: "other", value: otherIncome, widthPercent: 0 },
        ];

  return {
    primaryIncome,
    partnerIncome,
    otherIncome,
    totalGrossIncome,
    hemsAnnual,
    assessableIncome,
    borrowingPower: {
      conservative: assessableIncome * PAYG_MULTIPLES.conservative,
      moderate: assessableIncome * PAYG_MULTIPLES.moderate,
      optimistic: assessableIncome * PAYG_MULTIPLES.optimistic,
    },
    segments,
  };
}

/* -------------------------------------------------------------------------- */
/*  3. Loan repayments                                                        */
/* -------------------------------------------------------------------------- */

export interface LoanResult {
  principal: number;
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterest: number;
  /** Whole-number share of the total repayment that is principal. */
  principalPercent: number;
  /** `stroke-dasharray` for both donut arcs. */
  arcLength: number;
  /** `stroke-dashoffset` for the red principal arc. */
  principalArcOffset: number;
}

export const LOAN_DEFAULTS: LoanInputs = {
  amount: 500_000,
  interestRate: 6.5,
  termYears: 30,
};

/**
 * Port of `calcLoan()` — the standard amortising-loan formula.
 *
 * ```js
 * t = rate / 100 / 12                                  // monthly rate
 * n = 12 * termYears                                   // payment count
 * d = t === 0 ? e / n : e * t * (1 + t)^n / ((1 + t)^n - 1)
 * o = d * n                                            // total repayment
 * l = o - e                                            // total interest
 * pct = Math.round(e / o * 100)
 * arcOffset = 327 - (e / o) * 327
 * ```
 */
export function calculateLoan(inputs: LoanInputs): LoanResult {
  const principal = inputs.amount;
  const monthlyRate = inputs.interestRate / 100 / 12;
  const months = inputs.termYears * 12;

  const growth = Math.pow(1 + monthlyRate, months);
  const monthlyRepayment =
    monthlyRate === 0 ? principal / months : (principal * monthlyRate * growth) / (growth - 1);

  const totalRepayment = monthlyRepayment * months;
  const totalInterest = totalRepayment - principal;
  const principalRatio = totalRepayment > 0 ? principal / totalRepayment : 0;

  return {
    principal,
    monthlyRepayment,
    totalRepayment,
    totalInterest,
    principalPercent: Math.round(principalRatio * 100),
    arcLength: DONUT_CIRCUMFERENCE,
    principalArcOffset: DONUT_CIRCUMFERENCE - principalRatio * DONUT_CIRCUMFERENCE,
  };
}

/* -------------------------------------------------------------------------- */
/*  4. Stamp duty                                                             */
/* -------------------------------------------------------------------------- */

export interface StampDutyResult {
  propertyPrice: number;
  /** Duty payable, clamped at zero and rounded exactly as the source does. */
  duty: number;
  totalUpfrontCost: number;
  /** duty ÷ price, 0–100. */
  dutyPercentOfPrice: number;
  /** duty ÷ (price + duty), 0–100 — the figure inside the donut. */
  dutyPercentOfTotalCost: number;
  arcLength: number;
  /** `stroke-dashoffset` for the grey duty arc. */
  dutyArcOffset: number;
}

/** Every state and territory the calculator offers, in the source's order. */
export const AUSTRALIAN_STATES: readonly AustralianState[] = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "ACT",
  "NT",
] as const;

/**
 * First-home-buyer full-exemption thresholds. A purchase at or below the
 * threshold pays $0. SA is intentionally absent — the source ships no SA rule,
 * so an SA first home buyer pays the standard schedule.
 */
export const FIRST_HOME_BUYER_EXEMPTION_THRESHOLDS: Partial<Record<AustralianState, number>> = {
  NSW: 800_000,
  VIC: 600_000,
  QLD: 500_000,
  ACT: 600_000,
  WA: 430_000,
  TAS: 400_000,
  NT: 500_000,
};

export const STAMP_DUTY_DEFAULTS: StampDutyInputs = {
  propertyPrice: 600_000,
  state: "NSW",
  buyerType: "standard",
};

/**
 * Port of `stampDuty(price, state, buyerType)` — progressive brackets, one
 * schedule per state. SA, TAS, ACT and NT share the source's `default` branch.
 *
 * Returns the raw (unrounded, unclamped) duty; `calculateStampDuty` applies the
 * `Math.max(0, Math.round(...))` the source wraps around it.
 */
export function stampDutyForState(
  propertyPrice: number,
  state: AustralianState,
  buyerType: BuyerType,
): number {
  if (buyerType === "firstHomeBuyer") {
    const threshold = FIRST_HOME_BUYER_EXEMPTION_THRESHOLDS[state];
    if (threshold !== undefined && propertyPrice <= threshold) return 0;
  }

  const price = propertyPrice;

  switch (state) {
    case "NSW":
      if (price <= 17_000) return 0.0125 * price;
      if (price <= 36_000) return 212.5 + 0.015 * (price - 17_000);
      if (price <= 97_000) return 497.5 + 0.0175 * (price - 36_000);
      if (price <= 364_000) return 1_565 + 0.035 * (price - 97_000);
      if (price <= 1_214_000) return 10_910 + 0.045 * (price - 364_000);
      return 49_160 + 0.055 * (price - 1_214_000);

    case "VIC":
      if (price <= 25_000) return 0.014 * price;
      if (price <= 130_000) return 350 + 0.024 * (price - 25_000);
      if (price <= 960_000) return 2_870 + 0.06 * (price - 130_000);
      // Note: the source's top VIC bracket re-bases from $130k at 5.5%, which
      // makes duty *fall* as the price crosses $960k. Ported as shipped.
      return 2_870 + 0.055 * (price - 130_000);

    case "QLD":
      if (price <= 5_000) return 0;
      if (price <= 75_000) return 0.015 * (price - 5_000);
      if (price <= 540_000) return 1_050 + 0.035 * (price - 75_000);
      if (price <= 1_000_000) return 17_325 + 0.045 * (price - 540_000);
      return 38_025 + 0.0575 * (price - 1_000_000);

    case "WA":
      if (price <= 120_000) return 0.019 * price;
      if (price <= 150_000) return 2_280 + 0.0285 * (price - 120_000);
      if (price <= 360_000) return 3_135 + 0.038 * (price - 150_000);
      if (price <= 725_000) return 11_115 + 0.0475 * (price - 360_000);
      return 28_453 + 0.0515 * (price - 725_000);

    // SA, TAS, ACT, NT — the source's shared `default` schedule.
    default:
      if (price <= 100_000) return 0.02 * price;
      if (price <= 300_000) return 2_000 + 0.035 * (price - 100_000);
      if (price <= 500_000) return 9_000 + 0.04 * (price - 300_000);
      return 17_000 + 0.055 * (price - 500_000);
  }
}

/**
 * Port of `calcSD()`.
 *
 * ```js
 * t = Math.max(0, Math.round(stampDuty(e, state, type)))
 * n = e + t                                            // total upfront cost
 * pctOfPrice = (t / e * 100).toFixed(1)
 * pctOfTotal = (t / n * 100).toFixed(1)
 * arc = Math.min(t / n * 327, 325)   // capped so the ring never fully closes
 * ```
 */
export function calculateStampDuty(inputs: StampDutyInputs): StampDutyResult {
  const { propertyPrice } = inputs;

  const duty = Math.max(
    0,
    Math.round(stampDutyForState(propertyPrice, inputs.state, inputs.buyerType)),
  );
  const totalUpfrontCost = propertyPrice + duty;

  const dutyArcLength =
    totalUpfrontCost > 0
      ? Math.min((duty / totalUpfrontCost) * DONUT_CIRCUMFERENCE, 325)
      : 0;

  return {
    propertyPrice,
    duty,
    totalUpfrontCost,
    dutyPercentOfPrice: propertyPrice > 0 ? (duty / propertyPrice) * 100 : 0,
    dutyPercentOfTotalCost: totalUpfrontCost > 0 ? (duty / totalUpfrontCost) * 100 : 0,
    arcLength: DONUT_CIRCUMFERENCE,
    dutyArcOffset: DONUT_CIRCUMFERENCE - dutyArcLength,
  };
}
