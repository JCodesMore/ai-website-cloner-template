import {
  DocFeatureGrid,
  DocH2,
  DocH3,
  DocSectionLabel,
} from "@/components/proton/DocBlocks";
import { SimpleDocPage } from "@/components/proton/SimpleDocPage";
import { docMetadata } from "@/lib/page-meta";
import { MapPin, Shield, ShieldOff, Wifi } from "lucide-react";

export const metadata = docMetadata(
  "Security model",
  "/security-model",
  "What the VPN protects — and what it does not.",
);

export default function SecurityModelPage() {
  return (
    <SimpleDocPage
      title="Threat model"
      description="A VPN encrypts traffic between your device and the VPN provider's network. It does not turn a compromised laptop into a safe laptop, and it does not stop you from typing your password into a fake login form."
    >
      <DocSectionLabel>Protection scope</DocSectionLabel>
      <DocH2 icon={Shield}>In scope</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Wifi,
            text: "Local network attackers on untrusted Wi‑Fi sniffing plaintext or performing DNS spoofing.",
          },
          {
            icon: Shield,
            text: "ISP visibility into destination domains and timing metadata for tunneled traffic.",
          },
          {
            icon: MapPin,
            text: "Casual IP-based geolocation for services that see the VPN exit address.",
          },
        ]}
      />
      <DocH2 icon={ShieldOff}>Out of scope</DocH2>
      <DocH3>Endpoint compromise</DocH3>
      <p>
        Malware with root access can read keystrokes and screen contents before
        traffic ever reaches the VPN.
      </p>
      <DocH3>Token phishing</DocH3>
      <p>
        Training and password managers matter as much as tunnel encryption.
      </p>
      <DocH3>Legal compulsion</DocH3>
      <p>
        Providers respond to lawful requests within their jurisdiction. Read
        transparency reporting for historical examples.
      </p>
    </SimpleDocPage>
  );
}
