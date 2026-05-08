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
import { Lightbulb, RefreshCw, Server, Tv } from "lucide-react";

export const metadata = docMetadata(
  "Streaming",
  "/streaming",
  "Using a VPN with streaming services.",
);

export default function StreamingPage() {
  return (
    <SimpleDocPage
      title="VPN for streaming"
      description="A VPN changes the network path your device uses to reach a streaming provider. What you can watch still depends on your subscription, the service’s catalogue for that region, and the provider’s terms of use."
    >
      <DocSectionLabel>Getting started</DocSectionLabel>
      <DocH2 icon={Lightbulb}>Practical tips</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Server,
            text: "Pick a server country that matches the library you expect.",
          },
          {
            icon: RefreshCw,
            text: "If playback fails, try another city or protocol — CDNs sometimes cache aggressively.",
          },
          {
            icon: Tv,
            text: "Paid VPN tiers usually unlock streaming-friendly servers; free tiers may be rate-limited.",
          },
        ]}
      />
      <DocH2 icon={Tv}>Platform-specific notes</DocH2>
      <p>
        Smart TVs and consoles may need router-level VPN, a dedicated TV app, or
        DNS-based approaches depending on hardware. Desktop and mobile apps are
        the simplest starting point — get builds from{" "}
        <DocInlineLink href={ROUTES.download}>Download</DocInlineLink>.
      </p>
      <DocCallout title="Related">
        <p className="text-sm">
          <DocInlineLink href={ROUTES.netflixVpn}>Netflix VPN</DocInlineLink>{" "}
          — focused notes on catalogue behaviour and compliance.
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
