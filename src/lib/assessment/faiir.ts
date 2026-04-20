/**
 * FAIIR AI Self-Check — 15 questions across the five FAIIR pillars.
 *
 * Adapted from LeadMagnet-01-SMB-AI-Compliance-Self-Check.md in the
 * AvailableLaw-FAIIR project folder. This is the deeper AI-specific
 * assessment that the SMB Liability Checkup hands off to.
 *
 * Scoring: 2 / 1 / 0 per question, 15 questions, 30 max.
 *   Green  (>=80%) — 24-30 "Certified-ready"
 *   Yellow (>=33%) — 10-23 "Getting started" / "Defensible"
 *   Red    (<33%)  —  0-9  "Exposed"
 */
import type { AssessmentDefinition } from "./types";

export const faiirCheck: AssessmentDefinition = {
  id: "faiir",
  name: "FAIIR AI Self-Check",
  pitch: {
    eyebrow: "FAIIR AI Compliance Self-Check",
    heading: "How FAIIR is your AI use?",
    body: "Fifteen questions across the five FAIIR pillars — Fitness for purpose, Accountability, Integrity of data, Informed use, Risk management. Ten minutes, no login.",
    startCta: "Start the FAIIR check",
    meta: ["15 questions", "~10 minutes", "Based on the FAIIR framework"],
  },
  thresholds: {
    green: 0.8,
    yellow: 0.34,
  },
  areas: [
    {
      id: "fitness",
      label: "F — Fitness for purpose",
      description:
        "Whether each AI tool has a named job, a defined scope, and a human in the loop where the output actually matters.",
      recommendations: {
        red: "You likely can't, under pressure, produce a complete list of the AI tools in use and what each one is for. Start there — a one-page inventory closes this pillar faster than anything else.",
        yellow:
          "You know most of your AI surface area but not all of it, and the 'what this tool is not for' boundary is implicit. Write it down; that's the shift from fitness-shaped to fitness-documented.",
        green:
          "You're operating with clear fit-for-purpose boundaries. Formalize via a lightweight AI inventory you update quarterly.",
      },
    },
    {
      id: "accountability",
      label: "A — Accountability",
      description:
        "Whether there's a named owner for AI use, contractual indemnities, and a record of AI-involved decisions.",
      recommendations: {
        red: "No named owner means no one to call, no one accountable, and no one to improve the posture. Assign a role-level owner this week — 'the owner is COO' beats 'everyone and no one.'",
        yellow:
          "Ownership exists informally; indemnity and decision logging are uneven. Tighten contracts on renewal and stand up a simple decision log.",
        green:
          "Accountability is wired. Review owner assignments annually and when key vendors change.",
      },
    },
    {
      id: "integrity",
      label: "I — Integrity of data",
      description:
        "Whether your team knows what data can touch an AI tool, whether vendor training is configured correctly, and whether PII handling is rule-bound.",
      recommendations: {
        red: "This is the pillar most likely to produce a quiet disaster — a paste into ChatGPT you can't take back. Issue a one-page 'what can go in an AI tool' doc and audit vendor training settings this month.",
        yellow:
          "Rules exist but aren't uniform. Close the loop by naming PII categories explicitly and requiring a DPA for any vendor that touches them.",
        green:
          "Data integrity is under control. Re-check vendor training settings quarterly — they silently change.",
      },
    },
    {
      id: "informed",
      label: "I — Informed use",
      description:
        "Whether your team and your customers know when AI is in the loop and what the rules are.",
      recommendations: {
        red: "No AUP and no training means every employee is making their own call about AI — and at least one is making the wrong one. A one-page AUP plus a 20-minute training closes most of this pillar.",
        yellow:
          "You have some awareness and disclosure, but it's patchy. The gap is usually customer-facing disclosure — tell them plainly where AI touches their experience.",
        green:
          "Your team and your customers both know. That's the posture regulators and buyers will reward.",
      },
    },
    {
      id: "risk",
      label: "R — Risk management",
      description:
        "Whether you have a defined notion of an AI incident, a response plan, and a periodic attestation.",
      recommendations: {
        red: "If an AI incident happened today, you'd be figuring out the response in real time. Define the incident, define the call tree, define who signs the notification. It's one page.",
        yellow:
          "You've thought about this but haven't written it down. Convert the plan in your head into a one-page runbook.",
        green:
          "You're operating like a regulated enterprise on AI risk. Consider formal FAIIR Certification.",
      },
    },
  ],
  questions: [
    /* F — Fitness for purpose --------------------------------------- */
    {
      id: "f1-inventory",
      areaId: "fitness",
      prompt:
        "I can name every AI tool my business uses and what each is for.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "f2-scope",
      areaId: "fitness",
      prompt:
        "For each AI tool, I have written (or could write in ten minutes) what it is not to be used for.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "f3-human",
      areaId: "fitness",
      prompt:
        "Where an AI output reaches a customer or affects a decision, a human reviews it first.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    /* A — Accountability -------------------------------------------- */
    {
      id: "a1-owner",
      areaId: "accountability",
      prompt:
        "There is one named person (by role) in my business responsible for how we use AI.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "a2-indemnity",
      areaId: "accountability",
      prompt:
        "I know, for each AI vendor, whether they contractually indemnify us when their tool fails.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "a3-decisionlog",
      areaId: "accountability",
      prompt:
        "I have a place (spreadsheet, doc, ticket system) where material AI-involved decisions are logged.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    /* I — Integrity of data ----------------------------------------- */
    {
      id: "i1-datarules",
      areaId: "integrity",
      prompt:
        "My team knows — in writing — what kinds of data they can and cannot paste into an AI tool.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "i2-training",
      areaId: "integrity",
      prompt:
        "For every AI tool we use, the setting that controls whether the vendor trains on our inputs has been reviewed and configured.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "i3-pii",
      areaId: "integrity",
      prompt:
        "We have a documented rule that PII (customer names, emails, addresses, SSNs, etc.) does not go into a consumer AI tool without a DPA in place.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    /* I — Informed use ---------------------------------------------- */
    {
      id: "u1-aup",
      areaId: "informed",
      prompt:
        "We have a written AI Acceptable Use Policy (AUP) distributed to everyone who works here.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "u2-training",
      areaId: "informed",
      prompt:
        "Every employee who uses AI at work has been trained, at least once, on what's allowed and what isn't.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "u3-disclosure",
      areaId: "informed",
      prompt:
        "Where customers interact with AI in our business (chatbot, AI-generated content, AI decisions), they are told in plain language.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    /* R — Risk management ------------------------------------------- */
    {
      id: "r1-incidentdef",
      areaId: "risk",
      prompt:
        "I have a written definition of what counts as an 'AI incident' in my business.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "r2-runbook",
      areaId: "risk",
      prompt:
        "If an AI incident happened tomorrow, I know — or could find on one page — who gets called, what gets logged, and who the customer notification goes to.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
    {
      id: "r3-attestation",
      areaId: "risk",
      prompt:
        "Once a year, someone in my business signs something stating we are operating within our AI rules.",
      options: [
        { label: "No", value: 0 },
        { label: "Partial", value: 1 },
        { label: "Yes", value: 2 },
      ],
    },
  ],
  overall: {
    green: {
      title: "Certified-ready",
      summary:
        "You're operating at a standard most regulated enterprises would recognize. The next step is formal FAIIR Certification — turning 'we can prove it' into a credential buyers and regulators recognize.",
    },
    yellow: {
      title: "Defensible — but undocumented",
      summary:
        "You can credibly demonstrate reasonable care in some areas, but the pieces aren't written down, and in a dispute undocumented is barely distinguishable from absent. Formalization is the next move.",
    },
    red: {
      title: "Exposed",
      summary:
        "You're where most SMBs are in 2026 — using AI, benefitting from it, and carrying meaningful uncovered risk. Every one of these 15 items can be closed in a weekend or two with the right guidance.",
    },
  },
  nextStep: {
    red: {
      label: "Take the course",
      summary:
        "The AI-Safe Small Business is built to walk you from this score to at least a mid-Yellow in one weekend.",
      ctaLabel: "See the course",
      ctaHref: "/course",
      secondary: {
        ctaLabel: "Download the free templates",
        ctaHref: "/resources",
        summary:
          "AI Acceptable Use Policy, Vendor Intake Questionnaire, Data Classification Cheat Sheet.",
      },
    },
    yellow: {
      label: "Close the documentation gap",
      summary:
        "Most yellow scores become green with a one-page AUP, a vendor intake questionnaire, and a one-page incident runbook. We have templates for all three.",
      ctaLabel: "Download the templates",
      ctaHref: "/resources",
      secondary: {
        ctaLabel: "Talk to us about FAIIR Aligned",
        ctaHref: "/faiir",
        summary:
          "FAIIR Aligned is the tier that says 'written down and in force' — the natural next step from here.",
      },
    },
    green: {
      label: "Apply for FAIIR Certification",
      summary:
        "You're operating at a level worth certifying. FAIIR Certified is the signal that separates 'we're being careful' from 'we can prove it.'",
      ctaLabel: "Explore FAIIR Certification",
      ctaHref: "/faiir",
      secondary: {
        ctaLabel: "Book a certification scoping call",
        ctaHref: "/contact",
        summary:
          "Thirty minutes to scope what your FAIIR Certification engagement would look like.",
      },
    },
  },
  disclaimer:
    "This self-check is a compressed version of the FAIIR Framework. It is educational — not legal advice. Your industry, jurisdiction, and contracts may impose obligations beyond what's here.",
};
