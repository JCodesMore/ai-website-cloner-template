import {
  DocCallout,
  DocFeatureGrid,
  DocH2,
  DocSectionLabel,
} from "@/components/proton/DocBlocks";
import { SimpleDocPage } from "@/components/proton/SimpleDocPage";
import { docMetadata } from "@/lib/page-meta";
import { FileText, Info, Shield } from "lucide-react";

export const metadata = docMetadata(
  "Transparency",
  "/transparency",
  "Disclosure practices and accountability.",
);

export default function TransparencyPage() {
  return (
    <SimpleDocPage
      title="Transparency report"
      description="Periodic transparency reports summarize how many requests for user data arrived, how many could be fulfilled, and why. They do not list individual users — only aggregate statistics and narrative context."
    >
      <DocSectionLabel>Report contents</DocSectionLabel>
      <DocH2 icon={FileText}>What you typically find</DocH2>
      <DocFeatureGrid
        items={[
          {
            icon: FileText,
            text: "Counts of criminal, civil, and national-security requests (where legally permissible to disclose).",
          },
          {
            icon: Info,
            text: "Explanation of what metadata exists under normal operation.",
          },
          {
            icon: Shield,
            text: "Pointers to warrant canary or similar signals if the provider maintains one.",
          },
        ]}
      />
      <DocCallout title="Demo placeholder">
        <p className="text-sm leading-relaxed">
          This static site does not publish live numbers. In production, replace
          this section with PDF or HTML reports dated by quarter, and link
          archived copies for year-over-year comparison.
        </p>
      </DocCallout>
    </SimpleDocPage>
  );
}
