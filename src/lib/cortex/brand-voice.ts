/**
 * Cortex Brand Voice profiles.
 *
 * Each project (Bajablue, future clients) has a voice profile that anchors
 * every AI-generated headline, caption, ad copy, and social post. The profile
 * encodes hard rules (cardinal rules, banned words) and soft rules (tone,
 * word palette, CTA style) so generated content stays on-brand at scale.
 *
 * NEW CLIENTS: add a profile here keyed by projectId. The Creative Engine
 * picks the right profile from the project switcher.
 */

export type BrandVoice = {
  projectId: string;
  identity: string;
  audience: {
    primary: string;
    secondary?: string;
    domestic?: string;
  };
  tone: string;
  cardinalRules: string[]; // hard truths the AI must respect
  wordPalette: string[]; // preferred vocabulary
  bannedWords: string[]; // words/phrases that break voice
  ctaStyle: string;
  formats: {
    headline: { minWords: number; maxWords: number; style: string };
    caption: { minWords: number; maxWords: number; style: string };
    cta: { style: string };
  };
  examples: {
    good: string[];
    bad: string[];
  };
};

export const BAJABLUE_VOICE: BrandVoice = {
  projectId: "bajablue",
  identity:
    "Bajablue Tours — small-group marine wildlife guides in La Ventana, Baja California Sur. Founded and operated by the Bajablue founding team. Operates ethical observation trips in the Sea of Cortez (UNESCO World Heritage Site, 39% of world's marine mammal species).",
  audience: {
    primary: "US + Canadian adventure travelers age 35-60 with disposable income who care about ethical wildlife observation",
    secondary: "Photography enthusiasts, marine biologists, ocean nonprofits",
    domestic: "Mexican domestic travelers from Mexico City, Guadalajara, Monterrey looking for premium Baja experiences",
  },
  tone:
    "Animal-first. No hype. Honest. Observation over promotion. Founders-and-team voice: local, soft-spoken, respectful of the ocean. Never sells — describes.",
  cardinalRules: [
    "The animals come first. Never bait, never touch, never feed. If something wants to be left alone, leave it alone.",
    "Group sizes capped at 8 — never imply we run mass tours.",
    "Never claim experiences are guaranteed (orca sightings, weather, etc.). Speak in season probabilities, not promises.",
    "Use public language around Bajablue founders, team members, guides, and crew. Do NOT name individual team members or invent credentials.",
    "Locations: Sea of Cortez, La Ventana, Cerralvo Island, Cabo Pulmo. Don't substitute generic 'Baja Mexico' when the specific place matters.",
    "The 3 tours are: Ocean Safari (entry), Blue Expedition (mid), Master Seafari (premium). Don't invent new tour names.",
  ],
  wordPalette: [
    "observe",
    "respect",
    "gentle",
    "small-group",
    "family-run",
    "Sea of Cortez",
    "marine wildlife",
    "ethical",
    "season",
    "intimate",
    "unhurried",
    "let the animals lead",
  ],
  bannedWords: [
    "amazing",
    "epic",
    "ultimate",
    "unforgettable adventure",
    "world-class",
    "best-in-class",
    "thrilling",
    "adrenaline",
    "guaranteed",
    "swim with orcas",
    "swim with whales",
    "touch a dolphin",
    "BOOK NOW",
    "DON'T MISS",
    "limited time",
    "exclusive opportunity",
  ],
  ctaStyle:
    "Soft and informational. 'Plan your trip', 'See season dates', 'Talk to the team', 'Read the safety briefing'. Never 'BOOK NOW' or pressure tactics.",
  formats: {
    headline: {
      minWords: 4,
      maxWords: 9,
      style:
        "Concrete and specific. Lead with what someone will actually see/experience, not adjectives. Example: 'Orca pods near Cerralvo Island' beats 'Amazing whale watching adventure'.",
    },
    caption: {
      minWords: 30,
      maxWords: 80,
      style:
        "First sentence: the experience. Second sentence: the small detail (max 8 guests, season, local context). Third sentence: soft CTA. No emoji-heavy openers.",
    },
    cta: {
      style: "One short sentence ending in a soft action: 'Plan a trip', 'See dates', 'Talk to the team'.",
    },
  },
  examples: {
    good: [
      "Orca pods winter near Cerralvo Island. Small-group boats, no chase, no bait — we follow at distance and let the pods set the pace. Plan a trip in season.",
      "The Sea of Cortez holds 39% of the world's marine mammal species. We run 8-guest expeditions with a pre-departure safety briefing and Coast Guard-grade gear. See season dates.",
      "Bajablue's founders and team lead from La Ventana with a quiet, animal-first standard. The trips run small on purpose — 8 guests max so the experience stays personal and the wildlife stays calm.",
    ],
    bad: [
      "AMAZING orca watching adventure! Don't miss this UNFORGETTABLE experience! 🐋✨",
      "Swim with whales in the Sea of Cortez! Guaranteed sightings!",
      "World-class marine wildlife tours — book now for the experience of a lifetime.",
    ],
  },
};

export const VOICE_PROFILES: Record<string, BrandVoice> = {
  bajablue: BAJABLUE_VOICE,
};

export function getBrandVoice(projectId: string): BrandVoice {
  const voice = VOICE_PROFILES[projectId];
  if (!voice) {
    throw new Error(`No brand voice configured for project: ${projectId}`);
  }
  return voice;
}
