import {
  DocCallout,
  DocFeatureGrid,
  DocH2,
  DocInlineLink,
  DocSectionLabel,
} from "@/components/proton/DocBlocks";
import { SimpleDocPage } from "@/components/proton/SimpleDocPage";
import { docMetadata } from "@/lib/page-meta";
import { ROUTES } from "@/lib/site-routes";
import { Gauge, Monitor, Sparkles, Wifi } from "lucide-react";

export const metadata = docMetadata(
  "Free VPN",
  "/free-vpn",
  "Free tier: what you get and when to upgrade.",
);

export default function FreeVpnPage() {
  return (
    <SimpleDocPage
      title="Free VPN"
      description="The free tier exists so anyone can improve baseline privacy without a credit card. It is not time-limited trial spam — but capacity and feature depth differ from paid plans."
    >
      <DocSectionLabel>Free tier</DocSectionLabel>
      <DocH2 icon={Sparkles}>What the free tier is good for</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Monitor,
            text: "Daily browsing on one device with encrypted tunnel to the VPN network.",
          },
          {
            icon: Sparkles,
            text: "Trying the apps and UX before committing to Plus.",
          },
          {
            icon: Wifi,
            text: "Travel or café Wi‑Fi where you only need the phone or laptop protected.",
          },
        ]}
      />
      <DocH2 icon={Gauge}>Typical limits (conceptual)</DocH2>
      <p>
        Free plans usually offer fewer simultaneous countries, moderate speeds,
        and a single active connection. Streaming-optimized locations, highest
        speeds, and advanced routing often require{" "}
        <DocInlineLink href={ROUTES.pricing}>VPN Plus</DocInlineLink>.
      </p>
      <DocCallout title="Compare visually">
        <p className="text-sm leading-relaxed">
          Open the{" "}
          <DocInlineLink href={ROUTES.pricingSection}>
            pricing block on the home page
          </DocInlineLink>{" "}
          for side-by-side cards, or visit the dedicated{" "}
          <DocInlineLink href={ROUTES.pricing}>Pricing</DocInlineLink> page.
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
