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
import { CreditCard, Info, Tv, Zap } from "lucide-react";

export const metadata = docMetadata(
  "Netflix VPN",
  "/netflix-vpn",
  "VPN use with Netflix — technical and policy context.",
);

export default function NetflixVpnPage() {
  return (
    <SimpleDocPage
      title="Netflix and VPN"
      description="Netflix catalogues differ by licensing region. A VPN can change which regional edge you hit, but availability is never guaranteed — platforms update blocking heuristics over time."
    >
      <DocSectionLabel>Before you connect</DocSectionLabel>
      <DocH2 icon={Info}>What users should know</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: CreditCard,
            text: "You still need a valid Netflix subscription.",
          },
          {
            icon: Zap,
            text: "4K and HDR may require more bandwidth through the tunnel — pick a fast server.",
          },
          {
            icon: Tv,
            text: "If a stream refuses to start, rotate server or disable IPv6 leak protection tests temporarily to isolate the issue.",
          },
        ]}
      />
      <DocCallout title="Related">
        <p className="text-sm">
          For general streaming guidance, see{" "}
          <DocInlineLink href={ROUTES.streaming}>
            VPN for streaming
          </DocInlineLink>
          .
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
