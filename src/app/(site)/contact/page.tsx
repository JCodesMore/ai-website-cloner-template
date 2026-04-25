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
import { Bug, ExternalLink, Newspaper, Wrench } from "lucide-react";

export const metadata = docMetadata(
  "Contact",
  "/contact",
  "Press, partnerships, and general inquiries.",
);

export default function ContactPage() {
  return (
    <SimpleDocPage
      title="Contact us"
      description="Route requests to the right inbox: press teams need fact sheets, affiliates need programme rules, and users with broken installs should start in Support so engineers see structured tickets."
    >
      <DocSectionLabel>Routing guide</DocSectionLabel>
      <DocH2 icon={ExternalLink}>Before you write</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: Wrench,
            text: "Connection problems — start with Support and the FAQ so logs can be attached.",
          },
          {
            icon: Newspaper,
            text: "Press / media — include outlet, deadline, and languages required.",
          },
          {
            icon: Bug,
            text: "Security research — use the vendor’s published disclosure address.",
          },
        ]}
      />
      <DocH2>Faster self-serve links</DocH2>
      <p>
        <DocInlineLink href={ROUTES.support}>Help and support</DocInlineLink>
        {" · "}
        <DocInlineLink href={ROUTES.faq}>FAQ</DocInlineLink>
        {" · "}
        <DocInlineLink href={ROUTES.partners}>Partners</DocInlineLink>
      </p>
      <DocCallout title="Demo">
        <p className="text-sm">
          Embed HubSpot, Formspree, or a simple{" "}
          <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-xs text-zinc-300">
            mailto:
          </code>{" "}
          button on this route when you deploy.
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
