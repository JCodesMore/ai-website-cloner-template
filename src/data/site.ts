import type { Tour, SeasonEntry, SiteConfig, NavLink, FAQItem, Badge } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Bajablue Tours",
  tagline: "Swim Baja's Wild Side",
  phone: "+52 612 348 3865",
  email: "info@bajablue.mx",
  whatsapp: "+52 612 348 3865",
  whatsappLink: "https://wa.me/526123483865",
  instagram: "@bajabluetours",
  instagramUrl: "https://instagram.com/bajabluetours",
  facebook: "Bajablue Tours",
  facebookUrl: "https://facebook.com/people/Bajablue-Tours/61587824690924",
  youtube: "Bajablue Tours",
  youtubeUrl: "https://www.youtube.com/channel/UCBD7ieJnzgzf9M3uzvWaH1w",
  address: "Calle Medusa, Ejido El Sargento, Manzana y Sur",
  city: "La Ventana",
  state: "Baja California Sur",
  country: "Mexico",
  zip: "23232",
};

/**
 * WeTravel booking URLs — one per Bajablue tour tier.
 *
 * These are read from environment variables at build/runtime. When a value is
 * not set (the current state, blocked on the WeTravel account being live),
 * the booking flow falls back to "Booking opens soon — message us on WhatsApp"
 * rather than silently sending guests to a broken URL.
 *
 * Real values come from the Bajablue team once the WeTravel trips are published. See
 * .env.example for the env-var names and onboarding wizard step #2.
 *
 * Contract tie: Baja Blue Phase 2 — booking/payment integration.
 */
export const wetravelUrls: Record<string, string | null> = {
  "ocean-safari": process.env.NEXT_PUBLIC_WETRAVEL_OCEAN_SAFARI_URL ?? null,
  "blue-expedition": process.env.NEXT_PUBLIC_WETRAVEL_BLUE_EXPEDITION_URL ?? null,
  "master-seafari": process.env.NEXT_PUBLIC_WETRAVEL_MASTER_SEAFARI_URL ?? null,
};

/**
 * Returns the WeTravel URL for a tour slug, or null if not yet configured.
 * Callers should branch on null to fall back to a clear "booking opens soon"
 * state — never to a fabricated URL or a silent WhatsApp redirect.
 */
export function getWetravelUrl(slug: string): string | null {
  return wetravelUrls[slug] ?? null;
}

export const navLinks: NavLink[] = [
  { label: "Tours", href: "/tours" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Accommodations", href: "/accommodations" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const tours: Tour[] = [
  {
    name: "Ocean Safari",
    slug: "ocean-safari",
    tagline: "A Day in the Wild Blue",
    duration: "6 hours",
    pricePerPerson: "$3,000 Mexican Pesos",
    priceCurrency: "MXN",
    priceNote: "Private boat: $12,000 Mexican Pesos (1-4 guests)",
    season: "Year-round",
    description:
      "Our signature day trip to Cerralvo Island — the southernmost island in the Sea of Cortez. Encounter orcas, whales, dolphins, and massive mobula ray schools in their natural habitat.",
    includes: [
      "Experienced marine guide",
      "Full snorkeling equipment with fins",
      "Lunch on board",
      "Trip photos and video when conditions allow",
    ],
    image: "/images/tours/ocean-safari.jpg",
    imageAlt: "Humpback whale surfacing alongside a Bajablue Tours boat with guests watching — Ocean Safari day trip in the Sea of Cortez",
  },
  {
    name: "Blue Expedition",
    slug: "blue-expedition",
    tagline: "Three Days of Ocean Magic",
    duration: "3 water days · 4 nights · 5 days",
    pricePerPerson: "$35,000 Mexican Pesos",
    priceCurrency: "MXN",
    season: "Seasonal",
    description:
      "The ideal balance between adventure and relaxation. Three full days on the water maximizing your chances of megafauna encounters, with boutique accommodation and all meals included.",
    includes: [
      "Private room at La Ventana Hostel",
      "All meals included",
      "Airport transfers",
      "3 full days of ocean expeditions",
      "All equipment provided",
    ],
    image: "/images/tours/blue-expedition.jpg",
    imageAlt: "Four sperm whales swimming in formation in the Sea of Cortez — Blue Expedition multi-day marine safari",
  },
  {
    name: "Master Seafari",
    slug: "master-seafari",
    tagline: "The Ultimate Sea of Cortez Immersion",
    duration: "5 water days · 6 nights · 7 days",
    pricePerPerson: "$54,000 Mexican Pesos",
    priceCurrency: "MXN",
    priceNote: "$5,000 Mexican Pesos discount for double occupancy",
    season: "April – June",
    description:
      "Our most immersive experience, designed for true nature lovers and serious ocean travelers. Five full days on the water — 6 to 8 hours daily — seeking rare orca behaviors and massive mobula aggregations.",
    includes: [
      "Private room with en-suite bathroom",
      "Airport transfers (Los Cabos or La Paz)",
      "Marine education program",
      "All meals and snacks",
      "Trip photos and video when conditions allow",
      "Full snorkel gear and life jackets",
      "Experienced boat crew and marine guide",
    ],
    image: "/images/tours/master-seafari.jpg",
    imageAlt: "Bajablue expedition boat surrounded by an orca pod in the Sea of Cortez — Master Seafari flagship 7-day expedition",
  },
];

export const seasons: SeasonEntry[] = [
  {
    months: "November – Early May",
    name: "Season of Giants",
    description:
      "The great migration arrives. Mobula rays in massive schools, humpback whales breaching at sunrise, blue whales, grey whales, fin whales, and orcas hunting in the rich waters around Cerralvo Island.",
    wildlife: ["Mobula Rays", "Humpback Whales", "Blue Whales", "Grey Whales", "Fin Whales", "Orcas"],
  },
  {
    months: "April – July",
    name: "Spring & Summer Migration",
    description:
      "Peak season for megafauna encounters. Mobula rays, mantas, blue whales, sperm whales, dolphins, and orcas fill the waters around Cerralvo Island.",
    wildlife: ["Mobula Rays", "Mantas", "Blue Whales", "Sperm Whales", "Dolphins", "Orcas"],
  },
  {
    months: "Year-round resident life",
    name: "Always Wild",
    description:
      "The Sea of Cortez never sleeps. Dolphins, sea turtles, sea lions, reef fish, and other resident wildlife can be present year-round, while orcas and large whales move through opportunistically in seasonal windows.",
    wildlife: ["Dolphins", "Sharks", "Sea Turtles", "Sea Lions", "Reef Fish"],
  },
];

export const faqs: FAQItem[] = [
  {
    question: "Is it safe to swim with marine wildlife?",
    answer:
      "Yes — all encounters follow strict safety protocols and respectful wildlife-observation practices. Our guides keep a safe distance from every species, and swimming with whales is prohibited under Mexican federal law, so we observe them from the boat. To book a guided expedition, message us on WhatsApp at +52 612 348 3865.",
  },
  {
    question: "What should I bring on the boat?",
    answer:
      "Pack light: a swimsuit, reef-safe mineral sunscreen (zinc oxide based, no oxybenzone), a hat, polarized sunglasses, a quick-dry towel, and a light windbreaker for the return trip. We provide snorkeling kit, fins, and life jackets in all sizes. Please bring your own wetsuit. Bring a waterproof phone case if you want personal photos. Trip photos and video may be shared after the tour when conditions allow.",
  },
  {
    question: "How fit do I need to be?",
    answer:
      "Basic swimming ability is the only physical requirement — you should be able to tread water for 2-3 minutes and feel comfortable putting your face in the ocean. No diving certification, prior snorkeling experience, or specific fitness level is needed. Our guides match the pace to the slowest swimmer in the group, and we run small-group tours capped at 8 guests so nobody gets left behind. Children of all ages and adults are welcome.",
  },
  {
    question: "What's the cancellation policy?",
    answer:
      "A 60% deposit is required to confirm your reservation, with the remaining balance due 2 weeks before departure. Deposits are non-refundable but fully transferable to another date, another guest, or a different tour within 12 months. We also reschedule at no cost if weather conditions make the ocean unsafe — the final go/no-go call is made the morning of the tour. Read our full Terms of Service at /terms before booking.",
  },
  {
    question: "How do I get to La Ventana from La Paz?",
    answer:
      "La Ventana is a 45-minute drive south of La Paz (LAP) airport, and approximately 2.5 hours from Los Cabos (SJD) airport. The most reliable options are: rent a car at the airport (recommended for flexibility), book a private shuttle (~$80 USD one-way from La Paz), or take a taxi (~$60 USD). Multi-day packages including Blue Expedition and Master Seafari include round-trip airport transfers from either La Paz or Los Cabos at no extra cost.",
  },
  {
    question: "Do you guarantee wildlife sightings?",
    answer:
      "Wildlife encounters cannot be guaranteed — these are wild animals in their natural habitat, and that's exactly why the experience is meaningful. That said, the Sea of Cortez contains 39% of the world's marine mammal species (UNESCO World Heritage Centre), and our local crew knows the seasonal patterns of these waters. Orcas are opportunistic around Cerralvo and the southern Sea of Cortez, mobula ray aggregations build through spring and summer, and whale activity is strongest in the cooler months. If we have a tour with no wildlife sightings, we offer a free reschedule.",
  },
  {
    question: "Can I bring kids on a tour?",
    answer:
      "Children of all ages are welcome on Ocean Safari day trips. Multi-day expeditions are recommended for ages 12+. We provide child-sized fins and life jackets, and our guides have run dozens of family tours from La Ventana. Please bring your own wetsuits. For private family bookings, we can fully customize the route, pace, and snorkeling stops. Contact us to discuss your family.",
  },
  {
    question: "What about the accommodation on multi-day tours?",
    answer:
      "Blue Expedition and Master Seafari guests stay at La Ventana Hostel — our boutique basecamp 5 minutes from the boat ramp. Each booking includes a private room with an en-suite bathroom, 24/7 hot water, high-speed fiber internet, daily housekeeping, and a smoothie bar serving organic breakfast. The terrace has panoramic Sea of Cortez views and is the best sunrise spot in town. Single-occupancy and double-occupancy rates are both available.",
  },
];

export const badges: Badge[] = [
  { name: "Wildlife Respect", image: "/images/badges/wildlife-respect.png" },
  { name: "Small Groups", image: "/images/badges/small-groups.png" },
  { name: "Local Experts", image: "/images/badges/local-experts.png" },
  { name: "All-Inclusive", image: "/images/badges/all-inclusive.png" },
];
