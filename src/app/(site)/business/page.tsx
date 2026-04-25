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
import {
  Banknote,
  GitBranch,
  Headphones,
  Server,
  UserCheck,
} from "lucide-react";

export const metadata = docMetadata(
  "Business VPN",
  "/business",
  "VPN for teams: deployment, billing, and support.",
);

export default function BusinessPage() {
  return (
    <SimpleDocPage
      title="Business VPN"
      description="Give every employee encrypted egress without shipping hardware VPN concentrators. Central dashboards help IT provision tokens, revoke leavers, and prove coverage during audits."
    >
      <DocSectionLabel>Enterprise features</DocSectionLabel>
      <DocH2 icon={UserCheck}>Common requirements</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: UserCheck,
            text: "SSO or directory sync for onboarding at scale.",
          },
          {
            icon: Banknote,
            text: "Invoice-friendly billing and optional purchase orders.",
          },
          {
            icon: Server,
            text: "Dedicated gateways or static egress IPs for allow-lists.",
          },
          {
            icon: Headphones,
            text: "Priority support SLAs and named customer success for larger seats.",
          },
        ]}
      />
      <DocH2 icon={GitBranch}>Rollout pattern</DocH2>
      <p>
        Pilot on a single team, gather latency feedback, then expand with MDM
        packages for macOS and Windows and managed app configs for mobile. Use
        the{" "}
        <DocInlineLink href={ROUTES.download}>Download</DocInlineLink> page to
        deep-link installers per platform.
      </p>
      <DocCallout title="Talk to sales">
        <p className="text-sm leading-relaxed">
          <DocInlineLink href={ROUTES.businessContact}>
            Business contact
          </DocInlineLink>{" "}
          — demo form placeholder. For quotes, attach expected seat count and
          regions.
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
