/**
 * Unified analytics tracking for Bajablue Tours.
 *
 * One named event helper fans out to every analytics provider that's currently
 * configured — none of the call sites need to know which providers are active:
 *
 *  - Vercel Analytics (real-time visitor + custom events dashboard) — always on
 *  - Umami Cloud — fires only when window.umami exists (script loaded)
 *  - Google Analytics 4 — fires only when window.gtag exists (NEXT_PUBLIC_GA_ID set)
 *
 * That means when the client grants Workspace access and we add the GA4 ID, every
 * historical event call site already in the codebase starts populating GA4
 * automatically. No code change needed at the call sites.
 *
 * Usage (preferred): use the named `events.*` helpers below.
 *   events.whatsappClick("hero-mobile");
 *   events.bookingWeTravelClick("ocean-safari");
 *
 * Usage (escape hatch): pass a custom event name + payload through `track`.
 *   track("custom_event", { key: "value" });
 *
 * Contract tie:
 *  - Phase 2 — campaign setup + conversion tracking
 *  - Section 7 — baseline traffic + conversion data
 *  - Growth + ads management — conversion event mapping
 */

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Allowed value types for event properties.
 * Vercel Analytics rejects nested objects; we keep the surface flat to match.
 */
type EventProps = Record<string, string | number | boolean | null>;

interface UmamiAPI {
  track: (name: string, data?: EventProps) => void;
}
interface GtagFn {
  (command: "event", action: string, params?: EventProps): void;
}

declare global {
  interface Window {
    umami?: UmamiAPI;
    gtag?: GtagFn;
  }
}

/**
 * Low-level event dispatcher. Strips null/undefined values, then fires to
 * every analytics provider currently available in the window. Never throws —
 * a misconfigured provider should never break the page.
 *
 * Prefer the named helpers in `events` below over calling this directly.
 */
export function track(event: string, props?: EventProps): void {
  const clean: Record<string, string | number | boolean> = {};
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v !== null && v !== undefined) clean[k] = v;
    }
  }

  // Vercel Analytics — typed. Fires unconditionally (Pro tier always on).
  try {
    vercelTrack(event, clean);
  } catch {
    // ignore — possibly running on server / SSR
  }

  // Umami — fire-and-forget. Only active when the Umami script is loaded.
  try {
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track(event, clean);
    }
  } catch {
    // swallow
  }

  // GA4 — fire-and-forget. Only active when gtag is initialized.
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event, clean);
    }
  } catch {
    // swallow
  }
}

/**
 * Named event helpers. These are the single source of truth for what events
 * the site fires, what payload each one sends, and where each one is called
 * from. All call sites should use these helpers rather than calling `track`
 * directly so event names + payload shapes stay consistent across the app.
 */
export const events = {
  /**
   * Fires when the mobile booking drawer (Vaul bottom sheet) opens.
   *
   * Payload:
   *  - `source`: tour slug the drawer was opened with (or "unknown" if generic)
   *
   * Called from:
   *  - `src/components/mobile/BookingDrawer.tsx` (useEffect on `open` flip)
   *  - `src/components/mobile/MobileChrome.tsx` (raised "Book" tab in bottom nav)
   *
   * Conversion role: top-of-funnel intent signal. Visitor opened the drawer
   * but hasn't picked a tour or hit "Continue to WeTravel" yet.
   */
  bookingDrawerOpen: (source?: string) =>
    track("booking_drawer_open", { source: source ?? "unknown" }),

  /**
   * Fires when a guest taps a tour row inside the booking drawer to select it.
   *
   * Payload:
   *  - `tour`: slug ("ocean-safari" | "blue-expedition" | "master-seafari")
   *  - `tour_name`: human-readable name for downstream reporting
   *
   * Called from: `src/components/mobile/BookingDrawer.tsx`
   *
   * Conversion role: mid-funnel — guest has narrowed down which tour they
   * want. Useful for tour-tier popularity reporting.
   */
  bookingTourSelected: (tour: string, tourName?: string) =>
    track("booking_tour_selected", { tour, tour_name: tourName ?? tour }),

  /**
   * Fires when the guest taps "Continue to WeTravel →" to leave for checkout.
   *
   * Payload:
   *  - `tour`: tour slug
   *  - `tour_name`: human-readable name
   *  - `cta_location`: where on the site the click happened ("mobile-drawer", etc.)
   *
   * Called from: `src/components/mobile/BookingDrawer.tsx`
   *
   * Conversion role: PRIMARY conversion proxy until the WeTravel webhook
   * starts streaming actual purchase events. Until the WeTravel API key +
   * webhook secret are wired, this is our best bottom-of-funnel measurement.
   *
   * Maps to Meta's "InitiateCheckout" and Google Ads' "Begin checkout" events.
   */
  bookingWeTravelClick: (tour: string, tourName?: string, ctaLocation = "mobile-drawer") =>
    track("booking_wetravel_click", {
      tour,
      tour_name: tourName ?? tour,
      cta_location: ctaLocation,
    }),

  /**
   * Fires on every WhatsApp link click site-wide.
   *
   * Payload:
   *  - `source`: location identifier so we can rank the highest-converting
   *    placements. Format: `<page>-<position>` or `<component>-<intent>`.
   *    Examples: "hero-mobile", "footer-start-journey", "tour-detail-mobile-bottom-ocean-safari".
   *
   * Called from: every WhatsApp `<a>` in the site. As of audit, 16 components.
   *
   * Conversion role: lead-capture event. WhatsApp is the second conversion
   * path beyond WeTravel. Maps to Meta's "Contact" event and Google Ads'
   * "Contact" conversion.
   */
  whatsappClick: (source: string) =>
    track("whatsapp_click", { source }),

  /**
   * Fires when a guest taps a tour card on /tours or in a carousel.
   *
   * Payload:
   *  - `tour`: tour slug
   *  - `source`: where the card was rendered ("tours-page", "homepage-carousel")
   *
   * Currently unused — reserved for future tour-card click instrumentation.
   */
  tourCardClick: (tour: string, source?: string) =>
    track("tour_card_click", { tour, source: source ?? "unknown" }),

  /**
   * Fires when the desktop contact form is submitted.
   *
   * Payload:
   *  - `tour`: pre-selected tour interest if any
   *
   * Currently unused — reserved for when the contact form gets wired to a
   * server action.
   */
  contactFormSubmit: (tour?: string) =>
    track("contact_form_submit", { tour: tour ?? "unspecified" }),

  /**
   * Fires when the side menu / hamburger nav is opened. Currently unused —
   * reserved for when nav-open is added to MobileChrome side drawer.
   */
  navOpen: () => track("nav_open"),

  /**
   * Fires when an FAQ accordion item is expanded.
   *
   * Payload:
   *  - `question`: first 50 chars of the question (PII-safe)
   *
   * Currently unused — reserved for FAQ engagement tracking.
   */
  faqExpand: (question: string) =>
    track("faq_expand", { question: question.slice(0, 50) }),

  /**
   * Fires when an image is opened in the gallery lightbox.
   *
   * Payload:
   *  - `imageIdx`: 0-based index into the gallery
   *
   * Currently unused — reserved for gallery engagement reporting.
   */
  galleryOpen: (imageIdx: number) =>
    track("gallery_image_open", { imageIdx }),

  /**
   * Fires at scroll-depth milestones. Reserved.
   */
  pageScrollDepth: (depth: 25 | 50 | 75 | 100) =>
    track("scroll_depth", { depth }),
};
