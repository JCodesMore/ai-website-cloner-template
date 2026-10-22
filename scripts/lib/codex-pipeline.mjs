import { spawn as nodeSpawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export const PINNED_NODE_VERSION = "24.19.0";
export const PORTABLE_NODE_PROVENANCE = Object.freeze({
  archive: "node-v24.19.0-win-x64.zip",
  sha256: "57f71ab3652e797d84acddc79c81cc9ff1c6ddb2a1974cdb83f00fee9bff4c73",
  url: "https://nodejs.org/dist/v24.19.0/node-v24.19.0-win-x64.zip",
});

const SUPPORTED_PLATFORMS = new Set(["win32", "linux", "darwin"]);
const SUPPORTED_ARCHITECTURES = new Set(["x64", "arm64"]);
const EVIDENCE_MODES = new Set([
  "COMPUTATIONAL",
  "EXPERIMENTAL",
  "THEORETICAL",
  "SYSTEMATIC_REVIEW",
  "QUALITATIVE",
  "MIXED",
  "OTHER",
]);

export class CliUsageError extends Error {
  constructor(message) {
    super(message);
    this.name = "CliUsageError";
  }
}

function nonblank(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new CliUsageError(`${name} is required`);
  }
  return value;
}

function offsetTimestamp(value, name) {
  nonblank(value, name);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    ) ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new CliUsageError(`${name} must be an offset-aware ISO-8601 timestamp`);
  }
  return value;
}

export function distributionName(platform = process.platform, arch = process.arch) {
  if (!SUPPORTED_PLATFORMS.has(platform) || !SUPPORTED_ARCHITECTURES.has(arch)) {
    throw new Error(`unsupported platform/architecture: ${platform}/${arch}`);
  }
  return `node-v${PINNED_NODE_VERSION}-${platform === "win32" ? "win" : platform}-${arch}`;
}

function portablePaths(root, platform) {
  if (platform === "win32") {
    return {
      nodePath: path.join(root, "node.exe"),
      npmCliPath: path.join(root, "node_modules", "npm", "bin", "npm-cli.js"),
    };
  }
  return {
    nodePath: path.join(root, "bin", "node"),
    npmCliPath: path.join(
      root,
      "lib",
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    ),
  };
}

export function resolveToolchain({
  execPath = process.execPath,
  nodeVersion = process.versions.node,
} = {}) {
  const major = Number.parseInt(nodeVersion.split(".")[0], 10);
  const available = Number.isInteger(major) && major >= 24;
  return {
    available,
    exact: nodeVersion === PINNED_NODE_VERSION,
    execPath,
    version: nodeVersion,
    ...(available ? {} : { reason: `Node 24 or newer is required; found ${nodeVersion}` }),
  };
}

export function resolvePackageManager({
  env = process.env,
  platform = process.platform,
  arch = process.arch,
  homedir = os.homedir(),
  fileExists = existsSync,
} = {}) {
  let distribution;
  try {
    distribution = distributionName(platform, arch);
  } catch (error) {
    return {
      available: false,
      reason: error.message,
      source: Object.hasOwn(env, "CODEX_NODE_HOME")
        ? "CODEX_NODE_HOME"
        : "portable-default",
    };
  }

  const explicit = Object.hasOwn(env, "CODEX_NODE_HOME");
  const codexHome = env.CODEX_HOME || path.join(homedir, ".codex");
  const root = explicit
    ? env.CODEX_NODE_HOME
    : path.join(codexHome, "toolchains", distribution);
  const source = explicit ? "CODEX_NODE_HOME" : "portable-default";
  if (typeof root !== "string" || root.trim() === "") {
    return {
      available: false,
      distribution,
      reason: "CODEX_NODE_HOME is configured but empty",
      root,
      source,
    };
  }

  const { nodePath, npmCliPath } = portablePaths(root, platform);
  const missing = [nodePath, npmCliPath].filter((candidate) => !fileExists(candidate));
  if (missing.length > 0) {
    return {
      available: false,
      distribution,
      nodePath,
      npmCliPath,
      reason: `portable Node/npm payload is incomplete; missing: ${missing.join(", ")}`,
      root,
      source,
    };
  }
  return {
    available: true,
    distribution,
    nodePath,
    npmCliPath,
    root,
    source,
  };
}

export function packageManagerInvocation(args, { packageManager } = {}) {
  const resolved = packageManager ?? resolvePackageManager();
  if (!resolved.available) {
    throw new Error(resolved.reason || "portable npm is unavailable");
  }
  return {
    command: resolved.nodePath,
    args: [resolved.npmCliPath, ...args],
    options: { shell: false },
  };
}

export async function runPackageManager(
  args,
  { packageManager, spawn = nodeSpawn, cwd, env, stdio = "inherit" } = {},
) {
  const invocation = packageManagerInvocation(args, { packageManager });
  return runProcess(invocation.command, invocation.args, {
    ...invocation.options,
    spawn,
    cwd,
    env,
    stdio,
  });
}

export function resolveLocalBinary(
  projectRoot,
  packageName,
  binaryName = packageName,
  { fileExists = existsSync, readFile = readFileSync } = {},
) {
  const packageRoot = path.join(projectRoot, "node_modules", ...packageName.split("/"));
  const manifestPath = path.join(packageRoot, "package.json");
  if (!fileExists(manifestPath)) {
    throw new Error(`missing local package: ${packageName}`);
  }
  let manifest;
  try {
    manifest = JSON.parse(readFile(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(`cannot read local package manifest for ${packageName}: ${error.message}`);
  }
  const relative =
    typeof manifest.bin === "string"
      ? binaryName === packageName || binaryName === manifest.name
        ? manifest.bin
        : undefined
      : manifest.bin?.[binaryName];
  if (typeof relative !== "string" || relative === "") {
    throw new Error(`${packageName} does not expose binary ${binaryName}`);
  }
  const entrypoint = path.resolve(packageRoot, relative);
  if (!fileExists(entrypoint)) {
    throw new Error(`missing local binary entrypoint: ${entrypoint}`);
  }
  return entrypoint;
}

function defaultProbe(command) {
  const result = spawnSync(command, ["--version"], {
    shell: false,
    stdio: "ignore",
  });
  return !result.error && result.status === 0;
}

export function resolvePython({ env = process.env, probe = defaultProbe } = {}) {
  if (Object.hasOwn(env, "CODEX_PYTHON")) {
    const command = env.CODEX_PYTHON;
    if (typeof command !== "string" || command.trim() === "") {
      return {
        available: false,
        reason: "CODEX_PYTHON is configured but empty",
        source: "CODEX_PYTHON",
      };
    }
    return probe(command)
      ? { available: true, command, source: "CODEX_PYTHON" }
      : {
          available: false,
          command,
          reason: `configured Python is unavailable: ${command}`,
          source: "CODEX_PYTHON",
        };
  }
  for (const command of ["python", "python3"]) {
    if (probe(command)) {
      return { available: true, command, source: "PATH" };
    }
  }
  return {
    available: false,
    reason: "neither python nor python3 is available on PATH",
    source: "PATH",
  };
}

export function resolveSkill(
  name,
  { env = process.env, homedir = os.homedir(), fileExists = existsSync } = {},
) {
  const configured = typeof env.CODEX_HOME === "string" && env.CODEX_HOME !== "";
  const codexHome = configured ? env.CODEX_HOME : path.join(homedir, ".codex");
  const root = path.join(codexHome, "skills", name);
  return fileExists(root)
    ? {
        available: true,
        root,
        source: configured ? "CODEX_HOME" : "home-default",
      }
    : {
        available: false,
        reason: `installed Skill not found: ${root}`,
        root,
        source: configured ? "CODEX_HOME" : "home-default",
      };
}

export function qualitySteps(projectRoot, { execPath = process.execPath } = {}) {
  const eslint = resolveLocalBinary(projectRoot, "eslint", "eslint");
  const next = resolveLocalBinary(projectRoot, "next", "next");
  const tsc = resolveLocalBinary(projectRoot, "typescript", "tsc");
  const step = (name, entrypoint, args = []) => ({
    name,
    command: execPath,
    args: [entrypoint, ...args],
    options: { shell: false },
  });
  return [
    step("lint", eslint),
    step("typegen", next, ["typegen"]),
    step("typecheck", tsc, ["--noEmit"]),
    step("build", next, ["build"]),
  ];
}

export function verifySteps(projectRoot, options = {}) {
  const execPath = options.execPath ?? process.execPath;
  return [
    {
      name: "pipeline:test",
      command: execPath,
      args: ["--test", "scripts/codex-pipeline.test.mjs"],
      options: { shell: false },
    },
    ...qualitySteps(projectRoot, { execPath }),
  ];
}

function runProcess(
  command,
  args,
  { spawn = nodeSpawn, cwd, env, stdio = "inherit", shell = false } = {},
) {
  return new Promise((resolve) => {
    let settled = false;
    let child;
    try {
      child = spawn(command, args, { cwd, env, shell, stdio });
    } catch (error) {
      resolve({ ok: false, kind: "spawn-error", error });
      return;
    }
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    child.once("error", (error) =>
      finish({ ok: false, kind: "spawn-error", error }),
    );
    child.once("exit", (code, signal) => {
      if (signal) {
        finish({ ok: false, kind: "signal", code, signal });
      } else if (code === 0) {
        finish({ ok: true, kind: "exit", code: 0, signal: null });
      } else {
        finish({ ok: false, kind: "exit", code, signal: null });
      }
    });
  });
}

export async function runSteps(
  steps,
  { spawn = nodeSpawn, cwd, env, stdio = "inherit", onStepStart } = {},
) {
  const completed = [];
  for (const step of steps) {
    onStepStart?.(step);
    const result = await runProcess(step.command, step.args, {
      spawn,
      cwd,
      env,
      stdio,
      ...(step.options ?? {}),
    });
    if (!result.ok) {
      return { ...result, completed, step: step.name };
    }
    completed.push(step.name);
  }
  return { ok: true, completed };
}

export function buildResearchInitArgs({
  outputRoot,
  date,
  start,
  hardStop,
  timezone,
  protect = [],
}) {
  nonblank(outputRoot, "outputRoot");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nonblank(date, "date"))) {
    throw new CliUsageError("date must use YYYY-MM-DD");
  }
  offsetTimestamp(start, "start");
  offsetTimestamp(hardStop, "hardStop");
  if (start.slice(0, 10) !== date) {
    throw new CliUsageError("date must match the local date in start");
  }
  if (Date.parse(hardStop) <= Date.parse(start)) {
    throw new CliUsageError("hardStop must be later than start");
  }
  nonblank(timezone, "timezone");
  if (!Array.isArray(protect) || protect.some((value) => !/^[^=\s][^=]*=.+$/.test(value))) {
    throw new CliUsageError("protect values must use LABEL=PATH");
  }
  const args = [
    "--output-root",
    outputRoot,
    "--date",
    date,
    "--start",
    start,
    "--hard-stop",
    hardStop,
    "--timezone",
    timezone,
  ];
  for (const value of protect) args.push("--protect", value);
  return args;
}

export function buildResearchVerifyArgs({ packagePath, at }) {
  nonblank(packagePath, "packagePath");
  offsetTimestamp(at, "at");
  return [packagePath, "--at", at];
}

export function buildEvidenceInitArgs({
  output,
  title,
  mode,
  projectId,
  createdAt,
}) {
  nonblank(output, "output");
  nonblank(title, "title");
  if (!EVIDENCE_MODES.has(mode)) {
    throw new CliUsageError(`unsupported evidence mode: ${mode ?? ""}`);
  }
  const args = ["--output", output, "--title", title, "--mode", mode];
  if (projectId !== undefined) args.push("--project-id", nonblank(projectId, "projectId"));
  if (createdAt !== undefined) {
    args.push("--created-at", offsetTimestamp(createdAt, "createdAt"));
  }
  return args;
}

export function buildEvidenceVerifyArgs({ packagePath }) {
  return [nonblank(packagePath, "packagePath")];
}

export function prerequisitesForCommand(command) {
  if (command === "doctor") {
    return [
      "node",
      "localBinaries",
      "packageManager",
      "python",
      "dailySkill",
      "evidenceSkill",
      "codexCli",
    ];
  }
  if (command === "quality" || command === "verify") {
    return ["node", "localBinaries"];
  }
  if (command === "research:init" || command === "research:verify") {
    return ["python", "dailySkill"];
  }
  if (command === "evidence:init" || command === "evidence:verify") {
    return ["python", "evidenceSkill"];
  }
  throw new CliUsageError(`unknown command: ${command}`);
}

export function resolveCommandPrerequisites(command, resolvers) {
  const prerequisites = {};
  for (const name of prerequisitesForCommand(command)) {
    const resolve = resolvers[name];
    if (typeof resolve !== "function") {
      throw new Error(`missing prerequisite resolver: ${name}`);
    }
    prerequisites[name] = resolve();
  }
  return prerequisites;
}

export function buildDoctorReport(prerequisites) {
  const coreNames = ["node", "localBinaries"];
  const optionalNames = ["packageManager", "python", "dailySkill", "evidenceSkill"];
  const blocked = coreNames.filter((name) => !prerequisites[name]?.available);
  const gaps = optionalNames.filter((name) => !prerequisites[name]?.available);
  const warnings = [];
  if (prerequisites.node?.available && !prerequisites.node.exact) {
    warnings.push(
      `Node ${prerequisites.node.version} is supported, but ${PINNED_NODE_VERSION} is required for exact replay`,
    );
  }
  return {
    status: blocked.length > 0 ? "BLOCKED" : gaps.length > 0 ? "READY_WITH_GAPS" : "READY",
    blocked,
    gaps,
    warnings,
    prerequisites,
  };
}

function parseOptions(args, definitions) {
  const values = {};
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    const definition = definitions[flag];
    if (!definition) throw new CliUsageError(`unknown option: ${flag}`);
    const value = args[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new CliUsageError(`${flag} requires a value`);
    }
    index += 1;
    if (definition.repeat) {
      (values[definition.name] ??= []).push(value);
    } else {
      if (values[definition.name] !== undefined) {
        throw new CliUsageError(`${flag} may be supplied only once`);
      }
      values[definition.name] = value;
    }
  }
  return values;
}

export function parseCli(argv) {
  const [command, ...args] = argv;
  if (!command) throw new CliUsageError("a command is required");
  if (command === "doctor") {
    if (args.length === 0) return { command, json: false, values: {} };
    if (args.length === 1 && args[0] === "--json") {
      return { command, json: true, values: {} };
    }
    throw new CliUsageError("doctor accepts only --json");
  }
  if (command === "quality" || command === "verify") {
    if (args.length > 0) throw new CliUsageError(`${command} accepts no arguments`);
    return { command, json: false, values: {} };
  }
  if (command === "research:init") {
    const values = parseOptions(args, {
      "--output-root": { name: "outputRoot" },
      "--date": { name: "date" },
      "--start": { name: "start" },
      "--hard-stop": { name: "hardStop" },
      "--timezone": { name: "timezone" },
      "--protect": { name: "protect", repeat: true },
    });
    values.protect ??= [];
    buildResearchInitArgs(values);
    return { command, json: false, values };
  }
  if (command === "research:verify") {
    if (args.length !== 3 || args[1] !== "--at") {
      throw new CliUsageError("research:verify requires <package> --at <timestamp>");
    }
    const values = { packagePath: args[0], at: args[2] };
    buildResearchVerifyArgs(values);
    return { command, json: false, values };
  }
  if (command === "evidence:init") {
    const values = parseOptions(args, {
      "--output": { name: "output" },
      "--title": { name: "title" },
      "--mode": { name: "mode" },
      "--project-id": { name: "projectId" },
      "--created-at": { name: "createdAt" },
    });
    buildEvidenceInitArgs(values);
    return { command, json: false, values };
  }
  if (command === "evidence:verify") {
    if (args.length !== 1) {
      throw new CliUsageError("evidence:verify requires exactly one package path");
    }
    const values = { packagePath: args[0] };
    buildEvidenceVerifyArgs(values);
    return { command, json: false, values };
  }
  throw new CliUsageError(`unknown command: ${command}`);
}
