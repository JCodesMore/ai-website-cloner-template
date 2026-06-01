// Usage: npx tsx --env-file=.env scripts/data-check.ts
// Read-only data integrity check. Exit code 1 if errors found.

import { validateAndRepair, printDataReport } from "../src/lib/data-guard/runner";

async function main() {
  console.log("Running data integrity check (read-only)...\n");
  const report = await validateAndRepair();
  printDataReport(report);
  const hasErrors = report.domains.some(d => d.errors.length > 0);
  process.exit(hasErrors ? 1 : 0);
}

main().catch(e => {
  console.error("data:check failed:", e.message);
  process.exit(1);
});
