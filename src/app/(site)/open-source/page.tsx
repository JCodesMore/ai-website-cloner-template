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
import { Code2, GitBranch, Users } from "lucide-react";

export const metadata = docMetadata(
  "Open source",
  "/open-source",
  "Public code, audits, and community review.",
);

export default function OpenSourcePage() {
  return (
    <SimpleDocPage
      title="Open source"
      description="Publishing client source code allows reproducible scrutiny: researchers can diff releases, track cryptographic choices, and file responsible disclosures against a public baseline."
    >
      <DocSectionLabel>Why it matters</DocSectionLabel>
      <DocH2 icon={Code2}>Why it matters for VPN software</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Code2,
            text: "Kill switch, reconnect, and DNS leak logic are visible instead of black-box.",
          },
          {
            icon: GitBranch,
            text: "Packaging scripts and update channels can be verified by third parties.",
          },
          {
            icon: Users,
            text: "Community ports and niche platforms become feasible where volunteers contribute.",
          },
        ]}
      />
      <DocCallout title="Read more">
        <p className="text-sm">
          <DocInlineLink href={ROUTES.blogOpenSource}>
            Blog: Open source VPN apps
          </DocInlineLink>
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
