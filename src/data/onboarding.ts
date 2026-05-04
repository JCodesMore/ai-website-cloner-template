/**
 * Bajablue access-onboarding wizard configuration.
 * Each step is one question for the client. Steps are rendered in order.
 *
 * If a field is `secret`, we DON'T store the value in Firestore — we only
 * mark the step as "sent via 1Password" and rely on the client to share securely
 * out-of-band.
 */

export type OnboardingFieldType =
  | "url"
  | "text"
  | "email"
  | "confirm"
  | "secret";

export type OnboardingField = {
  id: string;
  label: string;
  type: OnboardingFieldType;
  placeholder?: string;
  helper?: string;
};

export type OnboardingStep = {
  id: string;
  num: number;
  tier: "Critical" | "High" | "Medium";
  title: string;
  why: string;
  how: string[];
  fields: OnboardingField[];
  estTime: string;
};

export const onboardingSteps: OnboardingStep[] = [
  // ─── TIER 1 — CRITICAL ─────────────────────────────────────
  {
    id: "wetravel-team",
    num: 1,
    tier: "Critical",
    title: "WeTravel — add Athena as team admin",
    why:
      "Beyond the trip URLs, Athena needs to be a full team member on your WeTravel account so we can monitor bookings live, respond to guest questions through the dashboard, and adjust trip settings without bothering you.",
    how: [
      "Open WeTravel → Settings → Team / Users.",
      "Click 'Invite team member'.",
      "Email: nicoreincarnate@gmail.com",
      "Role: Admin (full access — NOT Editor or Viewer).",
      "Send invite.",
    ],
    fields: [
      { id: "invited", label: "Invited Nico as Admin team member", type: "confirm" },
    ],
    estTime: "3 min",
  },
  {
    id: "wetravel",
    num: 2,
    tier: "Critical",
    title: "WeTravel — booking system data",
    why:
      "WeTravel is what guests use to book and pay for tours. Without it, the website's 'Book Now' buttons don't work. Once it's live, deposits flow into your bank account every 2 days.",
    how: [
      "Follow Guide 06 — WeTravel Setup Guide.",
      "Once your three trips are live, copy each trip's public URL.",
      "Settings → Integrations → API Keys → Create new key.",
      "Settings → Integrations → Webhooks → Reveal secret.",
    ],
    fields: [
      { id: "oceanSafariUrl", label: "Ocean Safari trip URL", type: "url",
        placeholder: "https://www.wetravel.com/trips/..." },
      { id: "blueExpeditionUrl", label: "Blue Expedition trip URL", type: "url",
        placeholder: "https://www.wetravel.com/trips/..." },
      { id: "masterSeafariUrl", label: "Master Seafari trip URL", type: "url",
        placeholder: "https://www.wetravel.com/trips/..." },
      { id: "apiKey", label: "WeTravel API key", type: "secret",
        helper: "Send via 1Password — never email it." },
      { id: "webhookSecret", label: "Webhook secret", type: "secret",
        helper: "Send via 1Password — never email it." },
    ],
    estTime: "30 min (excluding Stripe verification)",
  },
  {
    id: "google-workspace",
    num: 3,
    tier: "Critical",
    title: "Google Workspace — info@bajablue.mx",
    why:
      "This is your business email. Once Athena has admin access, we use it to verify Search Console, Analytics, Business Profile, Tag Manager, and Ads — all without bothering you again.",
    how: [
      "Open admin.google.com → Users.",
      "Click 'Invite admin'.",
      "Email: nicoreincarnate@gmail.com",
      "Role: Super Admin",
      "Click Send.",
    ],
    fields: [
      { id: "added", label: "Added Nico as Super Admin", type: "confirm" },
      { id: "workspaceTier", label: "Plan tier (optional)", type: "text",
        placeholder: "e.g. Business Starter" },
    ],
    estTime: "5 min",
  },
  {
    id: "meta-business",
    num: 4,
    tier: "Critical",
    title: "Meta Business Manager — Facebook + Instagram",
    why:
      "Meta Business Manager controls your Facebook page, Instagram business account, ad accounts, pixels, and Conversions API. Without it, we can't run ads or post to Instagram on your behalf.",
    how: [
      "Open business.facebook.com — claim or create your Business Manager.",
      "Settings → Users → Add People → enter nicoreincarnate@gmail.com",
      "Role: Admin (full)",
      "Add Bajablue Facebook page + Instagram account as Business Assets.",
      "On the asset detail screen, grant Nico Full control of each.",
    ],
    fields: [
      { id: "businessId", label: "Business Manager ID", type: "text",
        placeholder: "found in URL: business.facebook.com/settings/?business_id=..." },
      { id: "fbPage", label: "Facebook page URL", type: "url",
        placeholder: "https://facebook.com/bajabluetours" },
      { id: "added", label: "Added Nico as Admin with Full control of FB page + IG", type: "confirm" },
    ],
    estTime: "10 min",
  },
  {
    id: "google-business",
    num: 5,
    tier: "Critical",
    title: "Google Business Profile",
    why:
      "Your listing on Google Maps and the right-side panel that shows when someone searches 'Bajablue Tours.' Critical for local SEO and Google reviews — most international guests find tour operators this way.",
    how: [
      "Go to business.google.com.",
      "If you haven't claimed Bajablue: search Google Maps → 'Claim this business' → verify by postcard or phone.",
      "Once verified: Users → Add manager → nicoreincarnate@gmail.com → role: Owner.",
      "Owner gives Athena full ability to update photos, hours, posts, and respond to reviews. You stay as Primary Owner.",
    ],
    fields: [
      { id: "claimed", label: "Listing is claimed and verified", type: "confirm" },
      { id: "added", label: "Added Nico as Owner (not just Manager)", type: "confirm" },
    ],
    estTime: "10 min (postcard verification adds 5–10 days if needed)",
  },
  {
    id: "wix-hostel",
    num: 6,
    tier: "Critical",
    title: "Wix — La Ventana Hostel website",
    why:
      "The hostel website lives on Wix. Athena needs full admin access to manage SEO, content updates, integrations with the booking system, and to keep the hostel and Bajablue Tours brand presence aligned.",
    how: [
      "Log in to Wix → click your site.",
      "Settings → Roles & Permissions.",
      "Invite people by email → enter nicoreincarnate@gmail.com",
      "Role: Admin (Co-owner) — gives access to billing, domains, and apps.",
      "Send invite.",
    ],
    fields: [
      { id: "added", label: "Invited Nico as Co-owner", type: "confirm" },
      { id: "siteUrl", label: "Wix site URL (optional)", type: "url",
        placeholder: "https://laventanahostel.com" },
    ],
    estTime: "5 min",
  },

  // ─── TIER 2 — HIGH ─────────────────────────────────────────
  {
    id: "google-ads",
    num: 7,
    tier: "High",
    title: "Google Ads account",
    why:
      "Required for Google Search and YouTube paid traffic. Even before running ads, the account needs to exist for tracking and audience-building.",
    how: [
      "Go to ads.google.com → 'Start now' using info@bajablue.mx.",
      "Click 'Switch to Expert Mode' → 'Create account without a campaign' (skip the wizard).",
      "Tools → Account access → invite Nico as Admin.",
      "Add a billing card. Athena never charges your card — Google charges directly when ads run.",
    ],
    fields: [
      { id: "customerId", label: "Customer ID (10-digit, e.g. 123-456-7890)",
        type: "text", placeholder: "123-456-7890" },
      { id: "added", label: "Added Nico as Admin", type: "confirm" },
      { id: "billing", label: "Billing card on file", type: "confirm" },
    ],
    estTime: "10 min",
  },
  {
    id: "stripe",
    num: 8,
    tier: "High",
    title: "Stripe — Developer access",
    why:
      "Stripe gets connected automatically when you link it inside WeTravel. Athena needs Developer access to issue refunds, reconcile payouts, and connect the API for the dashboard. You stay as Administrator — bank account changes still require you.",
    how: [
      "Open dashboard.stripe.com → Settings → Team and security → Team.",
      "Add member → invite nicoreincarnate@gmail.com",
      "Role: Developer (gives API + refund access, NOT Administrator).",
      "Send invite. Athena accepts via email.",
    ],
    fields: [
      { id: "added", label: "Invited Nico with Developer role", type: "confirm" },
    ],
    estTime: "3 min",
  },

  // ─── TIER 3 — MEDIUM ───────────────────────────────────────
  {
    id: "instagram",
    num: 9,
    tier: "Medium",
    title: "Instagram — Business or Creator account",
    why:
      "Instagram must be a Business or Creator account (not personal) and connected to your Facebook page so we can post via Meta's Graph API and pull analytics.",
    how: [
      "Open Instagram on your phone.",
      "Settings → Account → Switch to Professional → choose Business.",
      "When prompted, connect to the Bajablue Facebook page.",
      "Once Meta Business Manager (step 4) is set up, no further action — Athena requests OAuth through Business Manager.",
    ],
    fields: [
      { id: "switched", label: "Switched to Business", type: "confirm" },
      { id: "connected", label: "Connected to Facebook Page", type: "confirm" },
      { id: "handle", label: "Instagram handle", type: "text",
        placeholder: "@bajabluetours" },
    ],
    estTime: "5 min",
  },
  {
    id: "telegram",
    num: 10,
    tier: "Medium",
    title: "Telegram — booking alert bot",
    why:
      "Every new booking, contact form submission, and Instagram message will land instantly in your Telegram. You run the entire business from your phone.",
    how: [
      "If you don't have Telegram, install it. Use your phone number to register.",
      "Open chat with @BotFather.",
      "Type /newbot",
      "Name: 'Bajablue Bot'  ·  Username: BajablueBot",
      "Save the token Telegram gives you.",
      "Send the token to Nico via 1Password (NOT email).",
    ],
    fields: [
      { id: "botUsername", label: "Bot username", type: "text",
        placeholder: "@BajablueBot" },
      { id: "tokenSent", label: "Bot token sent via 1Password", type: "secret",
        helper: "Never paste the token into this form — send via 1Password." },
    ],
    estTime: "8 min",
  },
  {
    id: "hosting-cards",
    num: 11,
    tier: "Medium",
    title: "Hosting infrastructure billing cards",
    why:
      "Athena will set up two small cloud services for the automation engine and analytics. Total monthly cost: about $15 USD. Both are billed to your card directly so Bajablue owns the infrastructure.",
    how: [
      "When Athena sends sign-up links for Hetzner ($6/mo) and Umami Cloud ($9/mo), open each link.",
      "Add your billing card — that's the only thing you do.",
      "Athena handles the actual server setup and configuration.",
    ],
    fields: [
      { id: "hetzner", label: "Hetzner billing card on file", type: "confirm" },
      { id: "umami", label: "Umami Cloud billing card on file", type: "confirm" },
    ],
    estTime: "5 min total",
  },
];

export const totalSteps = onboardingSteps.length;
