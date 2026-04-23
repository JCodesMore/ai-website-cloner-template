import {
  DocFeatureGrid,
  DocH2,
  DocInlineLink,
  DocSectionLabel,
} from "@/components/proton/DocBlocks";
import { SimpleDocPage } from "@/components/proton/SimpleDocPage";
import { docMetadata } from "@/lib/page-meta";
import { ROUTES } from "@/lib/site-routes";
import { Banknote, Handshake, Plug, Scale } from "lucide-react";

export const metadata = docMetadata(
  "Partners",
  "/partners",
  "Affiliates, integrations, and co-marketing.",
);

export default function PartnersPage() {
  return (
    <SimpleDocPage
      title="Partners and affiliates"
      description="Structured partner programmes define commission tiers, cookie windows, brand usage, and compliance wording. This demo page outlines what legal and marketing teams usually align on before launch."
    >
      <DocSectionLabel>Programme terms</DocSectionLabel>
      <DocH2 icon={Handshake}>Affiliate programme basics</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Scale,
            text: "Clear attribution window (e.g. 30-day last-click).",
          },
          {
            icon: Handshake,
            text: "Prohibited traffic sources: brand bidding, coupon farms, misleading claims.",
          },
          {
            icon: Banknote,
            text: "Payout thresholds, tax forms, and currency settlement.",
          },
        ]}
      />
      <DocH2 icon={Plug}>Technology partners</DocH2>
      <p>
        Router vendors, MDM platforms, and privacy education nonprofits may
        integrate deep links to{" "}
        <DocInlineLink href={ROUTES.download}>Download</DocInlineLink> or SSO
        guides. For commercial integration requests, start from{" "}
        <DocInlineLink href={ROUTES.contact}>Contact</DocInlineLink>.
      </p>
    </SimpleDocPage>
  );
}
