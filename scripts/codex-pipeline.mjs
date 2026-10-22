#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CliUsageError,
  buildDoctorReport,
  buildEvidenceInitArgs,
  buildEvidenceVerifyArgs,
  buildResearchInitArgs,
  buildResearchVerifyArgs,
  parseCli,
  qualitySteps,
  resolveCommandPrerequisites,
  resolvePackageManager,
  resolvePython,
  resolveSkill,
  resolveToolchain,
  runEvidenceAudit,
  runSteps,
  verifyEvidenceStructure,
  verifySteps,
} from "./lib/codex-pipeline.mjs";
import { auditEvidenceArtifacts } from "./lib/evidence-artifact-audit.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function probeCommand(command, args = ["--version"]) {
  const result = spawnSync(command, args, { shell: false, stdio: "ignore" });
  return !result.error && result.status === 0;
}

function skillPrerequisite(name, scriptNames) {
  const skill = resolveSkill(name);
  if (!skill.available) return skill;
  const missing = scriptNames
    .map((script) => path.join(skill.root, "scripts", script))
    .filter((script) => !existsSync(script));
  return missing.length === 0
    ? { ...skill, scripts: scriptNames }
    : {
        ...skill,
        available: false,
        reason: `installed Skill payload is incomplete; missing: ${missing.join(", ")}`,
      };
}

function inspectLocalBinaries() {
  try {
    const steps = qualitySteps(projectRoot);
    return {
      available: true,
      entrypoints: Object.fromEntries(
        steps.map((step) => [step.name, step.args[0]]),
      ),
    };
  } catch (error) {
    return { available: false, reason: error.message };
  }
}

function collectPrerequisites(command) {
  return resolveCommandPrerequisites(command, {
    node: () => resolveToolchain(),
    localBinaries: () => inspectLocalBinaries(),
    packageManager: () => resolvePackageManager(),
    python: () => resolvePython(),
    dailySkill: () => skillPrerequisite("daily-dev-experiment-pipeline", [
      "scaffold_day.py",
      "verify_day.py",
    ]),
    evidenceSkill: () => skillPrerequisite("research-evidence-pipeline", [
      "scaffold_research.py",
      "verify_research.py",
    ]),
    codexCli: () => ({
      available: probeCommand("codex"),
      informational: true,
    }),
  });
}

function printDoctor(report, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }
  console.log(`Codex pipeline: ${report.status}`);
  for (const [name, prerequisite] of Object.entries(report.prerequisites)) {
    console.log(
      `${prerequisite.available ? "OK" : "MISSING"} ${name}${prerequisite.reason ? `: ${prerequisite.reason}` : ""}`,
    );
  }
  for (const warning of report.warnings) console.warn(`WARNING: ${warning}`);
}

function failedCapability(prerequisite, label) {
  if (prerequisite.available) return false;
  console.error(`${label} unavailable: ${prerequisite.reason}`);
  process.exitCode = 1;
  return true;
}

function researchStep(parsed, prerequisites) {
  if (
    failedCapability(prerequisites.python, "Python") ||
    failedCapability(prerequisites.dailySkill, "daily-dev-experiment-pipeline Skill")
  ) {
    return null;
  }
  const init = parsed.command === "research:init";
  return {
    name: parsed.command,
    command: prerequisites.python.command,
    args: [
      path.join(
        prerequisites.dailySkill.root,
        "scripts",
        init ? "scaffold_day.py" : "verify_day.py",
      ),
      ...(init
        ? buildResearchInitArgs(parsed.values)
        : buildResearchVerifyArgs(parsed.values)),
    ],
    options: { shell: false },
  };
}

function evidenceStep(parsed, prerequisites) {
  if (
    failedCapability(prerequisites.python, "Python") ||
    failedCapability(prerequisites.evidenceSkill, "research-evidence-pipeline Skill")
  ) {
    return null;
  }
  const init = parsed.command === "evidence:init";
  return {
    name: parsed.command,
    command: prerequisites.python.command,
    args: [
      path.join(
        prerequisites.evidenceSkill.root,
        "scripts",
        init ? "scaffold_research.py" : "verify_research.py",
      ),
      ...(init
        ? buildEvidenceInitArgs(parsed.values)
        : buildEvidenceVerifyArgs(parsed.values)),
    ],
    options: { shell: false },
  };
}

function printFailure(result) {
  if (result.kind === "spawn-error") {
    console.error(`${result.step} failed to launch: ${result.error.message}`);
  } else if (result.kind === "signal") {
    console.error(`${result.step} terminated by ${result.signal}`);
  } else {
    console.error(`${result.step} exited with code ${result.code}`);
  }
}

async function main() {
  let parsed;
  try {
    parsed = parseCli(process.argv.slice(2));
  } catch (error) {
    if (!(error instanceof CliUsageError)) throw error;
    console.error(`usage error: ${error.message}`);
    process.exitCode = 2;
    return;
  }

  const prerequisites = collectPrerequisites(parsed.command);
  if (parsed.command === "doctor") {
    const report = buildDoctorReport(prerequisites);
    printDoctor(report, parsed.json);
    process.exitCode = report.status === "BLOCKED" ? 1 : 0;
    return;
  }

  if (parsed.command === "evidence:audit") {
    if (
      failedCapability(prerequisites.python, "Python") ||
      failedCapability(prerequisites.evidenceSkill, "research-evidence-pipeline Skill")
    ) {
      return;
    }
    const result = await runEvidenceAudit({
      auditArtifacts: () => auditEvidenceArtifacts(parsed.values),
      verifyStructure: () =>
        verifyEvidenceStructure(parsed.values.packagePath, {
          cwd: projectRoot,
          pythonCommand: prerequisites.python.command,
          verifierPath: path.join(
            prerequisites.evidenceSkill.root,
            "scripts",
            "verify_research.py",
          ),
        }),
    });
    process.stdout.write(`${JSON.stringify(result.report)}\n`);
    process.exitCode = result.exitCode;
    return;
  }

  let steps;
  if (parsed.command === "quality" || parsed.command === "verify") {
    const report = buildDoctorReport(prerequisites);
    if (report.blocked.length > 0) {
      console.error(`core prerequisites are blocked: ${report.blocked.join(", ")}`);
      process.exitCode = 1;
      return;
    }
    steps =
      parsed.command === "quality"
        ? qualitySteps(projectRoot)
        : verifySteps(projectRoot);
  } else if (parsed.command.startsWith("research:")) {
    const step = researchStep(parsed, prerequisites);
    if (!step) return;
    steps = [step];
  } else {
    const step = evidenceStep(parsed, prerequisites);
    if (!step) return;
    steps = [step];
  }

  const result = await runSteps(steps, {
    cwd: projectRoot,
    onStepStart(step) {
      console.log(`==> ${step.name}`);
    },
  });
  if (!result.ok) {
    printFailure(result);
    process.exitCode = result.kind === "exit" && Number.isInteger(result.code) ? result.code : 1;
  }
}

await main();
