import AssessmentRunner from "./AssessmentRunner";
import { smbCheckup } from "@/lib/assessment/smb";

/**
 * Top-of-funnel SMB Liability Checkup embedded on the homepage.
 * Replaces the (never-shipped) COAIA-only widget with a broader entity /
 * separation / contracts / AI readiness quiz. Results page hands off to
 * /faiir-check for the deeper AI compliance assessment.
 */
export default function LiabilityCheckupSection() {
  return <AssessmentRunner definition={smbCheckup} context="inline" />;
}
