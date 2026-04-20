/**
 * SMB Liability Checkup — the Available Law homepage assessment.
 *
 * Top-of-funnel: tests whether a small business is "buttoned up" enough
 * that the LLC/corp actually holds up, contracts are in writing, and the
 * obvious liability leaks are closed. The final two questions surface
 * Colorado AI Act awareness and FAIIR-style AI policy — the bridge into
 * the FAIIR self-check that lives at /faiir-check.
 *
 * Scoring: each question is 0 (no), 1 (partial), 2 (yes). 12 questions, 24 max.
 *
 *   Green  (>=75%)  — 18-24  "Buttoned up"
 *   Yellow (>=40%)  — 10-17  "Some real gaps"
 *   Red    (<40%)   —  0-9   "Exposed"
 */
import type { AssessmentDefinition } from "./types";

export const smbCheckup: AssessmentDefinition = {
  id: "smb",
  name: "SMB Liability Checkup",
  pitch: {
    eyebrow: "Small Business Liability Checkup",
    heading: "How buttoned up is your business, really?",
    body: "Twelve plain-English questions. If your LLC got sued tomorrow, would the protection actually hold? Find out in four minutes.",
    startCta: "Start the checkup",
    meta: ["12 questions", "~4 minutes", "Free · no login"],
  },
  thresholds: {
    green: 0.75,
    yellow: 0.42,
  },
  areas: [
    {
      id: "foundation",
      label: "Foundation & entity health",
      description:
        "Whether your business is a real, in-good-standing legal entity — the thing that carries liability instead of you.",
      recommendations: {
        red: "Fix this first. Without a formed, in-good-standing entity and a current operating agreement, there is no LLC protection to pierce — it was never there. This is a weekend-fixable problem.",
        yellow:
          "You have most of the pieces but something is off — either the operating agreement is missing, the annual filing lapsed, or the registered agent is outdated. Each of these will be the one fact opposing counsel asks about first.",
        green:
          "Your foundation is solid. Keep the annual filing on your calendar and refresh the operating agreement any time ownership or operations change.",
      },
    },
    {
      id: "separation",
      label: "Liability separation",
      description:
        "Whether the business and you are treated as genuinely separate — the single biggest reason courts pierce the corporate veil.",
      recommendations: {
        red: "This is how owners lose LLC protection in practice. Commingled funds and personal-name contracts let a plaintiff argue the entity is a sham. Open a dedicated business account this week and route everything through it.",
        yellow:
          "You're partially separated, which under stress reads as not separated. Tighten the edges: one business account, one business card, and the entity name on every contract and invoice.",
        green:
          "You're treating the business as genuinely separate. That's the posture that holds up under scrutiny.",
      },
    },
    {
      id: "contracts",
      label: "Contracts & people",
      description:
        "Whether your customer and contractor relationships are in writing, your IP is assigned to the business, and your 1099s would survive an IRS look.",
      recommendations: {
        red: "Unwritten customer deals and no contractor paper is how small businesses lose their best cases and their IP. The fix is a customer services agreement, a contractor agreement with IP assignment, and a one-pager on 1099 vs W-2.",
        yellow:
          "You have some contracts but gaps — either no IP assignment, no contractor paper, or a 1099 classification you haven't pressure-tested. Close each one; they compound.",
        green:
          "Contracts and worker relationships look well-papered. Review templates annually and whenever you add a new service line.",
      },
    },
    {
      id: "web-insurance",
      label: "Web presence & insurance",
      description:
        "Whether your website protects you and whether you have the insurance backstop every SMB should carry.",
      recommendations: {
        red: "Your website is likely exposing you (no Privacy Policy or generic dropped-in ToS) and you're carrying risk without an insurance floor. Both are inexpensive to fix and material to your liability profile.",
        yellow:
          "You have some coverage but something is stale — policies not updated since launch, or a GL policy that doesn't match what you actually do today. Refresh both.",
        green:
          "Website legal is current and insurance is in force. Schedule an annual review so drift doesn't creep back in.",
      },
    },
    {
      id: "ai",
      label: "AI risk exposure",
      description:
        "Whether your use of AI is compliant with the Colorado AI Act and whether your team operates under written AI rules.",
      recommendations: {
        red: "If you're using AI in your business at all — and most SMBs are — you are almost certainly carrying AI risk you haven't named. This is exactly what the FAIIR framework is built for.",
        yellow:
          "You've started thinking about AI exposure but haven't written it down. Writing down what's allowed and what isn't closes the biggest gap with the smallest amount of work.",
        green:
          "Your AI hygiene is ahead of the curve. The logical next step is formal FAIIR alignment so you can prove it.",
      },
    },
  ],
  questions: [
    /* Foundation ----------------------------------------------------- */
    {
      id: "f1-entity",
      areaId: "foundation",
      prompt:
        "My business is organized as a formal entity (LLC, corporation, PLLC, etc.) — not a sole proprietorship.",
      options: [
        { label: "No — sole prop / DBA only", value: 0 },
        { label: "Filed but not sure it's active", value: 1 },
        { label: "Yes — formed and active", value: 2 },
      ],
    },
    {
      id: "f2-opagreement",
      areaId: "foundation",
      prompt:
        "I have a written operating agreement (LLC) or bylaws (corp) — signed, and reflective of how the business actually runs today.",
      helper:
        "Counts as 'partial' if you have a generic template from formation that you've never touched.",
      options: [
        { label: "No", value: 0 },
        { label: "Have one — never updated", value: 1 },
        { label: "Yes — signed and current", value: 2 },
      ],
    },
    {
      id: "f3-goodstanding",
      areaId: "foundation",
      prompt:
        "The business is in good standing with the state — annual report filed, registered agent current.",
      options: [
        { label: "Not sure / lapsed", value: 0 },
        { label: "Mostly, but overdue for something", value: 1 },
        { label: "Yes — up to date", value: 2 },
      ],
    },
    /* Separation ----------------------------------------------------- */
    {
      id: "s1-bankaccount",
      areaId: "separation",
      prompt:
        "The business has its own bank account and card, and I do not mix personal and business funds.",
      helper:
        "Occasional reimbursable transfers are fine; 'dip into the business card for groceries' is not.",
      options: [
        { label: "No — funds get mixed", value: 0 },
        { label: "Mostly separate, sometimes blurred", value: 1 },
        { label: "Yes — fully separate", value: 2 },
      ],
    },
    {
      id: "s2-entityonpaper",
      areaId: "separation",
      prompt:
        "The business's legal name (not my personal name) is on every contract, invoice, lease, and payment processor.",
      options: [
        { label: "Often my personal name", value: 0 },
        { label: "Mixed — depends on the vendor", value: 1 },
        { label: "Yes — business name everywhere", value: 2 },
      ],
    },
    /* Contracts ------------------------------------------------------ */
    {
      id: "c1-customercontracts",
      areaId: "contracts",
      prompt:
        "I use written, signed contracts with my customers or clients — not just verbal agreements or emailed quotes.",
      options: [
        { label: "Verbal / handshake mostly", value: 0 },
        { label: "Sometimes — depends on deal size", value: 1 },
        { label: "Yes — always", value: 2 },
      ],
    },
    {
      id: "c2-contractoripassign",
      areaId: "contracts",
      prompt:
        "Anyone who does creative or development work for me has signed a contractor agreement that assigns the IP to my business.",
      helper:
        "'Work for hire' language alone is not enough for most deliverables — you want explicit assignment.",
      options: [
        { label: "No written contractor paper", value: 0 },
        { label: "Have agreements but no IP clause", value: 1 },
        { label: "Yes — with IP assignment", value: 2 },
      ],
    },
    {
      id: "c3-workerclass",
      areaId: "contracts",
      prompt:
        "Everyone I pay as a 1099 contractor would hold up under the IRS / state worker classification test if audited.",
      helper:
        "The test is control + economic reality, not whatever you wrote on the invoice.",
      options: [
        { label: "Honestly, probably not", value: 0 },
        { label: "Mostly — one or two are borderline", value: 1 },
        { label: "Yes — all 1099s are clearly independent", value: 2 },
      ],
    },
    /* Web + insurance ----------------------------------------------- */
    {
      id: "w1-privacyterms",
      areaId: "web-insurance",
      prompt:
        "My website has a current Privacy Policy and Terms of Service that reflect what I actually do and collect.",
      options: [
        { label: "No, or generic template", value: 0 },
        { label: "Have them but outdated", value: 1 },
        { label: "Yes — current and specific to us", value: 2 },
      ],
    },
    {
      id: "w2-insurance",
      areaId: "web-insurance",
      prompt:
        "The business carries appropriate insurance (general liability and, where relevant, professional / E&O or cyber) and it's current.",
      options: [
        { label: "No business insurance in force", value: 0 },
        { label: "GL only / policy is stale", value: 1 },
        { label: "Yes — appropriate coverage, current", value: 2 },
      ],
    },
    /* AI ------------------------------------------------------------ */
    {
      id: "a1-coaia",
      areaId: "ai",
      prompt:
        "If my business uses AI to make consequential decisions about people (hiring, lending, housing, healthcare, insurance, education), I know what the Colorado AI Act requires of me.",
      helper:
        "The Colorado AI Act (effective 2026) regulates 'high-risk' AI decision systems. Ignorance isn't a defense.",
      options: [
        { label: "I use AI that way and haven't checked", value: 0 },
        { label: "I've read about it but haven't acted", value: 1 },
        {
          label: "Yes — or I don't use AI for consequential decisions",
          value: 2,
        },
      ],
    },
    {
      id: "a2-aup",
      areaId: "ai",
      prompt:
        "My team operates under a written AI use policy — what's allowed, what isn't, and what data can or can't go into an AI tool.",
      options: [
        { label: "No — just vibes", value: 0 },
        { label: "Verbal rules only", value: 1 },
        { label: "Yes — written and shared", value: 2 },
      ],
    },
  ],
  overall: {
    green: {
      title: "Buttoned up",
      summary:
        "You're operating at a defensible posture most SMBs aren't close to. The payoff is formalization — turning 'we do it right' into 'we can prove it' when someone asks.",
    },
    yellow: {
      title: "Some real gaps",
      summary:
        "You've done the obvious work but you're carrying at least one or two exposures that would be the first thing opposing counsel — or a regulator — would ask about.",
    },
    red: {
      title: "Exposed",
      summary:
        "You're where most small businesses are. Using the protections you think you have, but with enough gaps that the protections might not actually hold. The good news: everything on this list is fixable in weeks, not months.",
    },
  },
  nextStep: {
    red: {
      label: "Book a Liability Audit",
      summary:
        "One working session to triage the highest-risk gaps and give you a one-page fix list. Most clients close half of it that week.",
      ctaLabel: "Book a free consultation",
      ctaHref: "/contact",
      secondary: {
        ctaLabel: "Check your AI exposure next →",
        ctaHref: "/faiir-check",
        summary:
          "Your AI section scored low. The 15-question FAIIR check tells you exactly where, by category.",
      },
    },
    yellow: {
      label: "Close the specific gaps",
      summary:
        "Your results page shows the specific areas that came back yellow. Most of these are one-document fixes — an operating agreement refresh, a contractor agreement with an IP clause, a real Privacy Policy.",
      ctaLabel: "Book a gap-closing call",
      ctaHref: "/contact",
      secondary: {
        ctaLabel: "Now check your AI exposure →",
        ctaHref: "/faiir-check",
        summary:
          "If you use AI at all in the business, take the 15-question FAIIR check. It goes deeper than the two AI questions here.",
      },
    },
    green: {
      label: "Formalize what you've built",
      summary:
        "You're ready to go from 'we're being careful' to 'we can prove it.' That's what the FAIIR certification program is for.",
      ctaLabel: "Explore FAIIR for your business",
      ctaHref: "/faiir",
      secondary: {
        ctaLabel: "Take the FAIIR AI self-check →",
        ctaHref: "/faiir-check",
        summary:
          "Fifteen deeper questions across Fitness, Accountability, Integrity, Informed use, and Risk management.",
      },
    },
  },
  disclaimer:
    "This checkup is educational — not legal advice. Your industry, jurisdiction, and contracts may impose obligations beyond what's here. For guidance specific to your business, talk to counsel.",
};
