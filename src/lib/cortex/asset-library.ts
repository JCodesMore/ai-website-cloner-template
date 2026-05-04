/**
 * Cortex Asset Library.
 *
 * Indexes the existing Bajablue footage + photos that ship with the project,
 * augmented by user uploads stored in Firestore. Each asset has metadata that
 * the Creative Engine uses to match clips to ad/social campaigns:
 *
 *   - tour: which tour the asset features (master-seafari, ocean-safari, blue-expedition, general)
 *   - subjects: what's in the frame (orca, whale, mobula, sea-lion, boat, guest, sunset, ...)
 *   - mood: the feel (action, golden-hour, contemplative, intimate, dramatic)
 *   - aspect: aspect ratio for fit detection (16:9, 9:16, 1:1, 4:5)
 *   - format: video | image
 *   - duration_sec: video only
 *   - tags: free-form tags
 *
 * The seed library below catalogs everything in /public/{videos,images}/.
 * New uploads append to Firestore at projects/{projectId}/assets/{id}.
 */

export type AssetFormat = "video" | "image";
export type AssetTour = "master-seafari" | "blue-expedition" | "ocean-safari" | "general";
export type AssetMood = "action" | "golden-hour" | "contemplative" | "intimate" | "dramatic" | "establishing";
export type AssetAspect = "16:9" | "9:16" | "1:1" | "4:5" | "3:2";

export type Asset = {
  id: string;
  projectId: string;
  format: AssetFormat;
  tour: AssetTour;
  subjects: string[];
  mood: AssetMood;
  aspect: AssetAspect;
  duration_sec?: number;
  url: string; // public URL or Cloudflare Stream
  posterUrl?: string;
  tags: string[];
  caption?: string; // short descriptive caption (one sentence)
  source: "seed" | "uploaded" | "stream";
  createdAt: string;
};

/**
 * Seed library — every clip + photo currently shipping with the public site.
 * The Creative Engine uses this as the starting set; uploads from the
 * dashboard get added on top.
 */
export const SEED_ASSETS: Asset[] = [
  // ── HERO video family ────────────────────────────────────────────────────
  {
    id: "hero-1080p",
    projectId: "bajablue",
    format: "video",
    tour: "general",
    subjects: ["orca", "boat", "ocean", "spray"],
    mood: "dramatic",
    aspect: "16:9",
    duration_sec: 30,
    url: "/videos/hero-1080p.mp4",
    posterUrl: "/videos/hero-poster.jpg",
    tags: ["hero", "orca", "establishing", "high-energy"],
    caption: "Orca pod surfacing near a Bajablue boat in the Sea of Cortez.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "hero-720p",
    projectId: "bajablue",
    format: "video",
    tour: "general",
    subjects: ["orca", "boat", "ocean"],
    mood: "dramatic",
    aspect: "16:9",
    duration_sec: 30,
    url: "/videos/hero-720p.mp4",
    posterUrl: "/videos/hero-poster.jpg",
    tags: ["hero", "orca", "compressed", "social-ready"],
    caption: "Orca pod surfacing — 720p compressed for social platforms.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },

  // ── ABOUT video family ───────────────────────────────────────────────────
  {
    id: "about-mobile",
    projectId: "bajablue",
    format: "video",
    tour: "general",
    subjects: ["team", "boat", "ocean", "guides"],
    mood: "intimate",
    aspect: "9:16",
    duration_sec: 25,
    url: "/videos/about-mobile.mp4",
    posterUrl: "/videos/about-poster.jpg",
    tags: ["about", "founders", "team", "vertical", "reel-ready"],
    caption: "Bajablue team on the water — a quiet portrait of the crew at work.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "about-1080p",
    projectId: "bajablue",
    format: "video",
    tour: "general",
    subjects: ["team", "boat", "ocean"],
    mood: "contemplative",
    aspect: "16:9",
    duration_sec: 25,
    url: "/videos/about-1080p.mp4",
    posterUrl: "/videos/about-poster.jpg",
    tags: ["about", "founders", "team", "horizontal"],
    caption: "Bajablue team on the water — landscape framing for desktop and YouTube.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },

  // ── GALLERY video family ─────────────────────────────────────────────────
  {
    id: "gallery-1080p",
    projectId: "bajablue",
    format: "video",
    tour: "general",
    subjects: ["mobula", "whale", "sea-lion", "ocean", "diver"],
    mood: "establishing",
    aspect: "16:9",
    duration_sec: 45,
    url: "/videos/gallery-1080p.mp4",
    posterUrl: "/videos/gallery-poster.jpg",
    tags: ["gallery", "wildlife-mix", "showcase", "long-form"],
    caption: "Multi-species reel — mobulas, whales, sea lions across a season.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },

  // ── SEASON video family ──────────────────────────────────────────────────
  {
    id: "season-mobile",
    projectId: "bajablue",
    format: "video",
    tour: "general",
    subjects: ["whale", "ocean", "horizon"],
    mood: "golden-hour",
    aspect: "9:16",
    duration_sec: 20,
    url: "/videos/season-mobile.mp4",
    posterUrl: "/videos/season-poster.jpg",
    tags: ["season", "calendar", "vertical", "golden-hour"],
    caption: "Late-season whale watch — golden-hour vertical, IG/TikTok ready.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "season-1080p",
    projectId: "bajablue",
    format: "video",
    tour: "general",
    subjects: ["whale", "ocean"],
    mood: "golden-hour",
    aspect: "16:9",
    duration_sec: 20,
    url: "/videos/season-1080p.mp4",
    posterUrl: "/videos/season-poster.jpg",
    tags: ["season", "horizontal", "golden-hour"],
    caption: "Late-season whale watch — landscape framing.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },

  // ── TOURS video family ───────────────────────────────────────────────────
  {
    id: "tours-1080p",
    projectId: "bajablue",
    format: "video",
    tour: "master-seafari",
    subjects: ["boat", "ocean", "guests", "wake"],
    mood: "establishing",
    aspect: "16:9",
    duration_sec: 35,
    url: "/videos/tours-1080p.mp4",
    posterUrl: "/images/tours/tours-hero.jpg",
    tags: ["tours", "master-seafari", "establishing", "boat"],
    caption: "Master Seafari boat at speed — premium expedition framing.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },

  // ── ORCA photos ──────────────────────────────────────────────────────────
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `orca-${i + 1}`,
    projectId: "bajablue",
    format: "image" as const,
    tour: "master-seafari" as const,
    subjects: ["orca", "ocean"],
    mood: "dramatic" as const,
    aspect: "3:2" as const,
    url: `/images/gallery/orca-${i + 1}.webp`,
    tags: ["orca", "hero-shot", "wildlife"],
    caption: `Orca photograph ${i + 1} from the Sea of Cortez — high-resolution.`,
    source: "seed" as const,
    createdAt: "2026-04-01T00:00:00Z",
  })),

  // ── HD gallery photos ────────────────────────────────────────────────────
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `hd-${i + 1}`,
    projectId: "bajablue",
    format: "image" as const,
    tour: "general" as const,
    subjects: ["wildlife", "ocean", "boat"],
    mood: "establishing" as const,
    aspect: "3:2" as const,
    url: `/images/gallery/hd-${i + 1}.webp`,
    tags: ["gallery", "hd", "wildlife"],
    caption: `Bajablue field photograph ${i + 1} — Sea of Cortez.`,
    source: "seed" as const,
    createdAt: "2026-04-01T00:00:00Z",
  })),

  // ── Tour heroes ──────────────────────────────────────────────────────────
  {
    id: "tour-master-seafari",
    projectId: "bajablue",
    format: "image",
    tour: "master-seafari",
    subjects: ["orca", "boat"],
    mood: "dramatic",
    aspect: "3:2",
    url: "/images/tours/master-seafari.jpg",
    tags: ["tour-hero", "master-seafari"],
    caption: "Master Seafari hero shot — orca encounter.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "tour-blue-expedition",
    projectId: "bajablue",
    format: "image",
    tour: "blue-expedition",
    subjects: ["whale", "ocean"],
    mood: "establishing",
    aspect: "3:2",
    url: "/images/tours/blue-expedition.jpg",
    tags: ["tour-hero", "blue-expedition"],
    caption: "Blue Expedition hero shot — whale season framing.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "tour-ocean-safari",
    projectId: "bajablue",
    format: "image",
    tour: "ocean-safari",
    subjects: ["mobula", "ocean", "guests"],
    mood: "intimate",
    aspect: "3:2",
    url: "/images/tours/ocean-safari.jpg",
    tags: ["tour-hero", "ocean-safari", "entry"],
    caption: "Ocean Safari hero shot — mobula encounter, guests onboard.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },

  // ── Hostel + about ───────────────────────────────────────────────────────
  {
    id: "about-hero",
    projectId: "bajablue",
    format: "image",
    tour: "general",
    subjects: ["team", "boat", "guests"],
    mood: "intimate",
    aspect: "3:2",
    url: "/images/about/about-hero.jpg",
    tags: ["about", "founders", "team"],
    caption: "About-page hero — Bajablue team members with guests on the water.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "hostel",
    projectId: "bajablue",
    format: "image",
    tour: "general",
    subjects: ["hostel", "terrace", "sunset"],
    mood: "golden-hour",
    aspect: "16:9",
    url: "/images/about/hostel.jpg",
    tags: ["accommodation", "hostel", "evening"],
    caption: "La Ventana Hostel terrace at sunset — Bajablue basecamp.",
    source: "seed",
    createdAt: "2026-04-01T00:00:00Z",
  },
];

/**
 * Filter assets by criteria. Used by the Creative Engine when matching clips
 * to a campaign brief (e.g., "find me 9:16 orca clips for an IG Reel").
 */
export type AssetFilter = {
  format?: AssetFormat;
  tour?: AssetTour;
  subjects?: string[]; // matches if asset has ANY subject in this list
  mood?: AssetMood;
  aspect?: AssetAspect;
  tags?: string[];
};

export function filterAssets(assets: Asset[], filter: AssetFilter): Asset[] {
  return assets.filter((a) => {
    if (filter.format && a.format !== filter.format) return false;
    if (filter.tour && a.tour !== filter.tour) return false;
    if (filter.aspect && a.aspect !== filter.aspect) return false;
    if (filter.mood && a.mood !== filter.mood) return false;
    if (filter.subjects && filter.subjects.length > 0) {
      if (!filter.subjects.some((s) => a.subjects.includes(s))) return false;
    }
    if (filter.tags && filter.tags.length > 0) {
      if (!filter.tags.some((t) => a.tags.includes(t))) return false;
    }
    return true;
  });
}
