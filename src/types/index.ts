/**
 * Content shapes for the fundup.au clone.
 *
 * These mirror the repeated structures observed across the live site — see
 * docs/research/PAGE_TOPOLOGY.md for where each one is used.
 */

/** A link in the header or footer. */
export interface NavLink {
  label: string;
  href: string;
  /** True for `tel:` / `mailto:` and any off-site destination. */
  external?: boolean;
}

/** One of the six cards in the services grid (`/` and `/services`). */
export interface ServiceCard {
  /** Two-digit ghost numeral rendered behind the card, e.g. "01". */
  number: string;
  title: string;
  description: string;
  /** Key into the icon map, not a component — keeps this file serialisable. */
  icon: string;
  href?: string;
}

/** A figure in a trust/stats band. */
export interface Stat {
  value: string;
  label: string;
}

/** One question in an accordion. */
export interface FaqItem {
  question: string;
  answer: string;
}

/** A numbered step in a process or journey timeline. */
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

/** An icon + title + copy card, used by several feature grids. */
export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

/** A customer review. */
export interface Testimonial {
  quote: string;
  author: string;
  /** Rendered as filled stars, 1–5. */
  rating: number;
  location?: string;
}

/** A call-to-action button. */
export interface CtaLink {
  label: string;
  href: string;
  variant: "primary" | "ghost";
}

/* -------------------------------------------------------------------------- */
/*  Calculators (/calculators)                                                */
/* -------------------------------------------------------------------------- */

/** Australian states and territories offered by the stamp duty calculator. */
export type AustralianState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export type BuyerType = "standard" | "firstHomeBuyer";

export type IncomeType = "single" | "household";

/** Inputs to the self-employed borrowing power calculator. */
export interface SelfEmployedInputs {
  netProfit: number;
  depreciation: number;
  interestExpenses: number;
  superContributions: number;
  directorsWages: number;
  otherAddBacks: number;
}

/** Inputs to the PAYG borrowing power calculator. */
export interface PaygInputs {
  incomeType: IncomeType;
  grossIncome: number;
  partnerGrossIncome: number;
  otherIncome: number;
  existingDebtRepayments: number;
  dependants: number;
}

/** Inputs to the repayments calculator. */
export interface LoanInputs {
  amount: number;
  /** Annual rate as a percentage, e.g. 6.5 for 6.5%. */
  interestRate: number;
  /** Term in years. */
  termYears: number;
}

/** Inputs to the stamp duty calculator. */
export interface StampDutyInputs {
  propertyPrice: number;
  state: AustralianState;
  buyerType: BuyerType;
}

/** Borrowing power presented at three multiples of assessable income. */
export interface BorrowingPowerResult {
  conservative: number;
  moderate: number;
  optimistic: number;
}

/* -------------------------------------------------------------------------- */
/*  Consultation booking                                                      */
/* -------------------------------------------------------------------------- */

/**
 * One "Book Free Consult" submission from the `/calculators` modal.
 *
 * The first six fields mirror the homepage `BorrowingPowerForm` one-for-one; the two
 * `preferred*` fields are new to the modal. Nothing is sent anywhere yet — see
 * `submitConsultRequest()` in `src/lib/consult-request.ts`.
 */
export interface ConsultRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  /** One of `SITUATION_OPTIONS`; empty when left unselected. */
  situation: string;
  /** One of `INCOME_OPTIONS`; empty when left unselected. */
  income: string;
  /** ISO `YYYY-MM-DD`, verbatim from `<input type="date">`. */
  preferredDate: string;
  /** 24-hour `HH:MM`, verbatim from `<input type="time">`. */
  preferredTime: string;
  /** Required by the form — non-marketing SMS. */
  consentNonMarketing: boolean;
  /** Optional — marketing and promotional SMS. */
  consentMarketing: boolean;
}
