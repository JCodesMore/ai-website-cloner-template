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
import { Globe, KeyRound, LogIn, Zap } from "lucide-react";

export const metadata = docMetadata(
  "What is a VPN",
  "/what-is-a-vpn",
  "Virtual private networks explained in plain language.",
);

export default function WhatIsVpnPage() {
  return (
    <SimpleDocPage
      title="What is a VPN?"
      description="A VPN creates an encrypted tunnel from your device to a server operated by the VPN provider. Traffic exiting that server uses the server’s IP address, not your home or mobile IP."
    >
      <DocSectionLabel>How it works</DocSectionLabel>
      <DocH2 icon={KeyRound}>Step by step</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: LogIn,
            text: "You launch the VPN app and authenticate.",
          },
          {
            icon: KeyRound,
            text: "The app negotiates keys and selects a remote server.",
          },
          {
            icon: Globe,
            text: "Packets to the internet flow through the tunnel; local LAN access may bypass the tunnel depending on settings.",
          },
        ]}
      />
      <DocH2 icon={Zap}>What changes for you</DocH2>
      <p>
        Websites see the VPN egress IP. Your ISP sees encrypted blobs to the
        VPN, not final destinations. DNS may be handled by the VPN resolver to
        reduce leaks — verify with the app’s leak test tools.
      </p>
      <DocCallout title="Visual explainer">
        <p className="text-sm">
          On the home page, open{" "}
          <DocInlineLink href="/#vpn">How a VPN works</DocInlineLink> for the
          illustrated section, then explore{" "}
          <DocInlineLink href={ROUTES.features}>Features</DocInlineLink>.
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
