import {
  DocCallout,
  DocFeatureGrid,
  DocH2,
  DocH3,
  DocSectionLabel,
} from "@/components/proton/DocBlocks";
import { SimpleDocPage } from "@/components/proton/SimpleDocPage";
import { docMetadata } from "@/lib/page-meta";
import { Gavel, Lock, Scale, Users } from "lucide-react";

export const metadata = docMetadata(
  "Secure Core",
  "/secure-core-vpn",
  "Multi-hop VPN routing through hardened locations.",
);

export default function SecureCorePage() {
  return (
    <SimpleDocPage
      title="Secure Core VPN"
      description="Secure Core forwards your traffic through privacy-friendly countries first, then to your chosen exit. The design assumes a stronger adversary who might pressure a single data center — at the cost of extra latency."
    >
      <DocSectionLabel>Use cases</DocSectionLabel>
      <DocH2 icon={Lock}>When it helps</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Users,
            text: "Journalists, lawyers, or activists in higher-risk regions.",
          },
          {
            icon: Gavel,
            text: "Situations where you distrust the legal regime near the exit country.",
          },
          {
            icon: Scale,
            text: "Defense in depth on top of already-encrypted application traffic.",
          },
        ]}
      />
      <DocH3>Trade-offs</DocH3>
      <DocCallout>
        <p className="text-sm leading-relaxed">
          Each hop adds milliseconds. Use standard servers for gaming or
          latency-sensitive calls; enable Secure Core when the threat model
          warrants it.
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
