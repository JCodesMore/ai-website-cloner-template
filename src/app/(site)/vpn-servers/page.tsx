import {
  DocFeatureGrid,
  DocH2,
  DocH3,
  DocSectionLabel,
  DocStat,
} from "@/components/proton/DocBlocks";
import { SimpleDocPage } from "@/components/proton/SimpleDocPage";
import { docMetadata } from "@/lib/page-meta";
import { Globe2, Lock, Podcast, Shuffle } from "lucide-react";

export const metadata = docMetadata(
  "VPN servers",
  "/vpn-servers",
  "Locations, capacity, and how servers are used.",
);

export default function VpnServersPage() {
  return (
    <SimpleDocPage
      title="VPN servers"
      description="A large, geographically diverse network helps you pick an exit country that fits speed, latency, and access goals. Physical racks are operated in partner data centers under strict access policies."
    >
      <DocStat
        items={[
          { value: "120+", label: "countries" },
          { value: "15k+", label: "servers" },
          { value: "10 Gbps", label: "uplinks" },
        ]}
      />
      <DocSectionLabel>Network</DocSectionLabel>
      <DocH2 icon={Globe2}>Why location diversity matters</DocH2>
      <p>
        Closer servers often mean lower round-trip time; distant servers help
        when you need a specific region for testing or content availability.
        Automatic &quot;fastest server&quot; picks balance load and distance on your
        behalf.
      </p>
      <DocH3>Special-purpose groups</DocH3>
      <DocFeatureGrid
        items={[
          {
            icon: Podcast,
            text: "Streaming-optimized exits where platforms are supported on paid plans.",
          },
          {
            icon: Shuffle,
            text: "Tor-capable or P2P-friendly regions where policy allows those use cases.",
          },
          {
            icon: Lock,
            text: "Secure Core entry and exit pairs for multi-hop setups.",
          },
        ]}
      />
    </SimpleDocPage>
  );
}
