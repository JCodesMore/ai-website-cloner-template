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
  CreditCard,
  Flame,
  Gauge,
  Monitor,
  Shield,
  Wifi,
  Zap,
} from "lucide-react";

export const metadata = docMetadata(
  "Support",
  "/support",
  "Help topics, troubleshooting, and where to look first.",
);

export default function SupportPage() {
  return (
    <SimpleDocPage
      title="Help and support"
      description="Most connection issues are solved by checking protocol, server choice, firewall rules, and app version. Use the buckets below to narrow your search before opening a ticket."
    >
      <DocSectionLabel>Troubleshooting</DocSectionLabel>
      <DocH2 icon={Gauge}>Connection and speed</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Zap,
            text: "Try another server country or a different protocol (e.g. WireGuard vs OpenVPN).",
          },
          {
            icon: Flame,
            text: "Disable third-party firewalls or antivirus HTTPS scanning temporarily to test.",
          },
          {
            icon: Wifi,
            text: "On Wi‑Fi, rule out captive portals — connect once without VPN, accept terms, then enable VPN.",
          },
        ]}
      />

      <DocH2 icon={CreditCard}>Token and billing</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Shield,
            text: "Confirm you are using the same token on all devices.",
          },
          {
            icon: CreditCard,
            text: "For Business seats, your admin manages invitations and role changes.",
          },
          {
            icon: Shield,
            text: "Refund windows depend on merchant of record — check your plan terms.",
          },
        ]}
      />

      <DocH2 icon={Monitor}>Devices and installs</DocH2>
      <p>
        Platform-specific packages and extension builds are listed on the{" "}
        <DocInlineLink href={ROUTES.download}>Download</DocInlineLink> hub. Each
        section has an anchor (for example{" "}
        <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[13px] text-zinc-300">
          #windows
        </code>
        ) for deep links from the header menu.
      </p>

      <DocCallout title="FAQ on the home page">
        <p className="text-sm leading-relaxed">
          Quick answers for streaming, installs, legality, and device limits:{" "}
          <DocInlineLink href={ROUTES.faq}>
            Frequently asked questions
          </DocInlineLink>
          .
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
