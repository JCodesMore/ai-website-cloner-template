import {
  DocFeatureGrid,
  DocH2,
  DocInlineLink,
  DocSectionLabel,
} from "@/components/proton/DocBlocks";
import { SimpleDocPage } from "@/components/proton/SimpleDocPage";
import { docMetadata } from "@/lib/page-meta";
import { ROUTES } from "@/lib/site-routes";
import { Cookie, MapPin, Network, Terminal } from "lucide-react";

export const metadata = docMetadata(
  "What is my IP",
  "/what-is-my-ip",
  "Public IP address — demo explainer.",
);

export default function WhatIsMyIpPage() {
  return (
    <SimpleDocPage
      title="What is my IP?"
      description="Your public IPv4 or IPv6 address is what servers on the internet use to return traffic to your network. It usually belongs to your ISP or mobile carrier unless you route through another network such as a VPN."
    >
      <DocSectionLabel>Context</DocSectionLabel>
      <DocH2 icon={MapPin}>Why it matters</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: MapPin,
            text: "Rough geolocation databases map IPs to cities — not always accurate.",
          },
          {
            icon: Cookie,
            text: "Sites use IP + cookies together for fraud scoring and content licensing.",
          },
          {
            icon: Network,
            text: "IPv6 can expose more granular routing if not firewalled properly.",
          },
        ]}
      />
      <DocH2 icon={Terminal}>Implementation note</DocH2>
      <p>
        A production widget would call a minimal API (ideally your own edge
        function) that echoes the client address and ASN. Until then, connect
        through{" "}
        <DocInlineLink href={ROUTES.download}>the VPN apps</DocInlineLink> and
        use the built-in leak checker where available.
      </p>
    </SimpleDocPage>
  );
}
