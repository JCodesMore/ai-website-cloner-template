import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { EventEmitter } from "node:events";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  CliUsageError,
  buildDoctorReport,
  buildEvidenceInitArgs,
  buildEvidenceVerifyArgs,
  buildResearchInitArgs,
  buildResearchVerifyArgs,
  distributionName,
  packageManagerInvocation,
  parseCli,
  prerequisitesForCommand,
  qualitySteps,
  resolveCommandPrerequisites,
  resolveLocalBinary,
  resolvePackageManager,
  resolvePython,
  resolveSkill,
  resolveToolchain,
  runPackageManager,
  runSteps,
} from "./lib/codex-pipeline.mjs";

const temporaryDirectories = [];
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function temporaryDirectory() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "codex-pipeline-"));
  temporaryDirectories.push(directory);
  return directory;
}

async function touch(file) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, "", "utf8");
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function evidenceFixture(records) {
  const root = await temporaryDirectory();
  const packagePath = path.join(root, "package");
  const artifactRoot = path.join(root, "artifacts");
  await mkdir(packagePath);
  await mkdir(artifactRoot);
  const documents = {
    "PROJECT.json": {
      active_headline_claim_id: null,
      authority_boundary: {
        external_actions: "EXPLICIT_TASK_AUTHORITY_REQUIRED",
        scientific_outcomes: "NOT_AUTHORIZED_BY_SCAFFOLD",
      },
      created_at: "2026-10-22T01:00:00Z",
      lifecycle_state: "IDEA",
      mode: "COMPUTATIONAL",
      project_id: "audit-fixture",
      schema_version: "research-evidence-package/v1",
      title: "Artifact audit fixture",
    },
    "CLAIMS.json": {
      claims: [],
      schema_version: "research-evidence-package/v1",
    },
  };
  for (const [name, value] of Object.entries(documents)) {
    await writeFile(path.join(packagePath, name), `${JSON.stringify(value)}\n`, "utf8");
  }
  for (const name of ["SOURCES.jsonl", "EXPERIMENTS.jsonl", "DECISIONS.jsonl"]) {
    await writeFile(path.join(packagePath, name), "", "utf8");
  }
  await writeFile(
    path.join(packagePath, "EVIDENCE.jsonl"),
    records.map((record) => JSON.stringify(record)).join("\n") + (records.length ? "\n" : ""),
    "utf8",
  );
  await writeFile(
    path.join(packagePath, "REPORT.md"),
    "# Supported\n\n# Unsupported\n\n# Blocked\n\n# Refuted\n\n# Next Decision\n",
    "utf8",
  );
  return { artifactRoot, packagePath, root };
}

function evidenceRecord(evidenceId, artifact, expectedHash) {
  return {
    attempt_ids: [],
    claim_ids: [],
    evidence_id: evidenceId,
    experiment_ids: [],
    kind: "STATIC_CONTRACT",
    provenance: {
      artifact,
      producer: "codex-test",
      sha256: expectedHash,
    },
    source_ids: [],
    summary: "Fixture artifact.",
  };
}

function fakeSpawn(outcomes, calls = []) {
  return (command, args, options) => {
    calls.push({ command, args, options });
    const child = new EventEmitter();
    const outcome = outcomes.shift();
    queueMicrotask(() => {
      if (outcome.error) {
        child.emit("error", outcome.error);
      } else {
        child.emit("exit", outcome.code ?? null, outcome.signal ?? null);
      }
    });
    return child;
  };
}

test.after(async () => {
  await Promise.all(
    temporaryDirectories.map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

test("distributionName maps every supported official platform and architecture", () => {
  const cases = [
    ["win32", "x64", "node-v24.19.0-win-x64"],
    ["win32", "arm64", "node-v24.19.0-win-arm64"],
    ["linux", "x64", "node-v24.19.0-linux-x64"],
    ["linux", "arm64", "node-v24.19.0-linux-arm64"],
    ["darwin", "x64", "node-v24.19.0-darwin-x64"],
    ["darwin", "arm64", "node-v24.19.0-darwin-arm64"],
  ];

  for (const [platform, architecture, expected] of cases) {
    assert.equal(distributionName(platform, architecture), expected);
  }
});

test("distributionName rejects unsupported platform and architecture combinations", () => {
  assert.throws(
    () => distributionName("freebsd", "x64"),
    /unsupported platform\/architecture: freebsd\/x64/,
  );
  assert.throws(
    () => distributionName("linux", "s390x"),
    /unsupported platform\/architecture: linux\/s390x/,
  );
});

test("resolvePackageManager honors a complete CODEX_NODE_HOME", async () => {
  const root = await temporaryDirectory();
  const nodePath = path.join(root, "node.exe");
  const npmCliPath = path.join(root, "node_modules", "npm", "bin", "npm-cli.js");
  await touch(nodePath);
  await touch(npmCliPath);

  const result = resolvePackageManager({
    env: { CODEX_NODE_HOME: root },
    platform: "win32",
    arch: "x64",
    homedir: "C:\\unused",
  });

  assert.deepEqual(result, {
    available: true,
    distribution: "node-v24.19.0-win-x64",
    nodePath,
    npmCliPath,
    root,
    source: "CODEX_NODE_HOME",
  });
});

test("resolvePackageManager uses the default portable distribution below CODEX_HOME", async () => {
  const codexHome = await temporaryDirectory();
  const root = path.join(codexHome, "toolchains", "node-v24.19.0-linux-arm64");
  const nodePath = path.join(root, "bin", "node");
  const npmCliPath = path.join(root, "lib", "node_modules", "npm", "bin", "npm-cli.js");
  await touch(nodePath);
  await touch(npmCliPath);

  const result = resolvePackageManager({
    env: { CODEX_HOME: codexHome },
    platform: "linux",
    arch: "arm64",
    homedir: "/unused",
  });

  assert.equal(result.available, true);
  assert.equal(result.source, "portable-default");
  assert.equal(result.root, root);
  assert.equal(result.nodePath, nodePath);
  assert.equal(result.npmCliPath, npmCliPath);
});

test("resolvePackageManager fails closed for an incomplete explicit payload", async () => {
  const root = await temporaryDirectory();
  await touch(path.join(root, "node.exe"));

  const result = resolvePackageManager({
    env: { CODEX_NODE_HOME: root },
    platform: "win32",
    arch: "x64",
    homedir: "C:\\unused",
  });

  assert.equal(result.available, false);
  assert.equal(result.source, "CODEX_NODE_HOME");
  assert.match(result.reason, /npm-cli\.js/);
});

test("packageManagerInvocation preserves non-ASCII argv without a shell", () => {
  const invocation = packageManagerInvocation(
    ["run", "研究:验证", "--", "C:\\资料\\证据 包"],
    {
      packageManager: {
        available: true,
        nodePath: "C:\\工具\\node.exe",
        npmCliPath: "C:\\工具\\npm-cli.js",
      },
    },
  );

  assert.deepEqual(invocation, {
    command: "C:\\工具\\node.exe",
    args: [
      "C:\\工具\\npm-cli.js",
      "run",
      "研究:验证",
      "--",
      "C:\\资料\\证据 包",
    ],
    options: { shell: false },
  });
});

test("runPackageManager exposes the child nonzero exit", async () => {
  const calls = [];
  const result = await runPackageManager(["ci"], {
    packageManager: {
      available: true,
      nodePath: "/portable/node",
      npmCliPath: "/portable/npm-cli.js",
    },
    spawn: fakeSpawn([{ code: 7 }], calls),
    cwd: "/project",
  });

  assert.equal(result.ok, false);
  assert.equal(result.code, 7);
  assert.equal(calls[0].options.shell, false);
  assert.equal(calls[0].options.cwd, "/project");
});

test("runPackageManager prepends portable Node to the npm child PATH only", async () => {
  const calls = [];
  const portableRoot = path.join("C:\\", "portable tools", "node");
  const packageManager = {
    available: true,
    nodePath: path.join(portableRoot, "node.exe"),
    npmCliPath: path.join(portableRoot, "node_modules", "npm", "bin", "npm-cli.js"),
  };
  const env = {
    CUSTOM_VALUE: "preserved",
    Path: ["C:\\existing tools", "C:\\Windows"].join(path.delimiter),
  };
  const originalEnv = { ...env };

  const result = await runPackageManager(["--version"], {
    env,
    packageManager,
    spawn: fakeSpawn([{ code: 0 }], calls),
  });

  assert.equal(result.ok, true);
  assert.deepEqual(env, originalEnv);
  assert.notEqual(calls[0].options.env, env);
  assert.deepEqual(calls[0].options.env, {
    ...env,
    Path: `${portableRoot}${path.delimiter}${env.Path}`,
  });
  assert.equal(Object.hasOwn(calls[0].options.env, "PATH"), false);
});

test("runPackageManager creates a usable child PATH when it is absent or empty", async () => {
  const portableRoot = path.join("C:\\", "portable", "node");
  const packageManager = {
    available: true,
    nodePath: path.join(portableRoot, "node.exe"),
    npmCliPath: path.join(portableRoot, "node_modules", "npm", "bin", "npm-cli.js"),
  };

  for (const env of [{ CUSTOM_VALUE: "preserved" }, { PATH: "" }]) {
    const calls = [];
    const originalEnv = { ...env };
    await runPackageManager(["--version"], {
      env,
      packageManager,
      spawn: fakeSpawn([{ code: 0 }], calls),
    });

    assert.deepEqual(env, originalEnv);
    assert.equal(calls[0].options.env.PATH, portableRoot);
    assert.equal(calls[0].options.env.CUSTOM_VALUE, env.CUSTOM_VALUE);
  }
});

test("resolveLocalBinary reads a package bin entry and rejects an absent entrypoint", async () => {
  const root = await temporaryDirectory();
  const packageRoot = path.join(root, "node_modules", "example-tool");
  await mkdir(packageRoot, { recursive: true });
  await writeFile(
    path.join(packageRoot, "package.json"),
    JSON.stringify({ name: "example-tool", bin: { example: "bin/cli.mjs" } }),
  );
  await touch(path.join(packageRoot, "bin", "cli.mjs"));

  assert.equal(
    resolveLocalBinary(root, "example-tool", "example"),
    path.join(packageRoot, "bin", "cli.mjs"),
  );
  assert.throws(
    () => resolveLocalBinary(root, "example-tool", "missing"),
    /does not expose binary missing/,
  );
});

test("resolvePython gives CODEX_PYTHON precedence over PATH candidates", () => {
  const probes = [];
  const result = resolvePython({
    env: { CODEX_PYTHON: "C:\\Python 专用\\python.exe" },
    probe(command) {
      probes.push(command);
      return command === "C:\\Python 专用\\python.exe";
    },
  });

  assert.deepEqual(probes, ["C:\\Python 专用\\python.exe"]);
  assert.deepEqual(result, {
    available: true,
    command: "C:\\Python 专用\\python.exe",
    source: "CODEX_PYTHON",
  });
});

test("resolvePython tries python and then python3 when not configured", () => {
  const probes = [];
  const result = resolvePython({
    env: {},
    probe(command) {
      probes.push(command);
      return command === "python3";
    },
  });

  assert.deepEqual(probes, ["python", "python3"]);
  assert.equal(result.command, "python3");
  assert.equal(result.source, "PATH");
});

test("resolveSkill uses CODEX_HOME before the home-directory fallback", async () => {
  const codexHome = await temporaryDirectory();
  const fallbackHome = await temporaryDirectory();
  const skillRoot = path.join(codexHome, "skills", "daily-dev-experiment-pipeline");
  await touch(path.join(skillRoot, "scripts", "scaffold_day.py"));

  const result = resolveSkill("daily-dev-experiment-pipeline", {
    env: { CODEX_HOME: codexHome },
    homedir: fallbackHome,
  });

  assert.equal(result.available, true);
  assert.equal(result.root, skillRoot);
  assert.equal(result.source, "CODEX_HOME");
});

test("resolveSkill fails closed when explicit CODEX_HOME is incomplete", async () => {
  const explicitCodexHome = await temporaryDirectory();
  const fallbackHome = await temporaryDirectory();
  await touch(
    path.join(
      fallbackHome,
      ".codex",
      "skills",
      "daily-dev-experiment-pipeline",
      "scripts",
      "scaffold_day.py",
    ),
  );

  const result = resolveSkill("daily-dev-experiment-pipeline", {
    env: { CODEX_HOME: explicitCodexHome },
    homedir: fallbackHome,
  });

  assert.equal(result.available, false);
  assert.equal(result.source, "CODEX_HOME");
  assert.equal(
    result.root,
    path.join(explicitCodexHome, "skills", "daily-dev-experiment-pipeline"),
  );
});

test("qualitySteps run direct local entrypoints in the required order", async () => {
  const root = await temporaryDirectory();
  const packages = [
    ["eslint", { eslint: "bin/eslint.js" }],
    ["next", { next: "dist/bin/next" }],
    ["typescript", { tsc: "bin/tsc" }],
  ];
  for (const [name, bin] of packages) {
    const packageRoot = path.join(root, "node_modules", name);
    await mkdir(packageRoot, { recursive: true });
    await writeFile(path.join(packageRoot, "package.json"), JSON.stringify({ name, bin }));
    await touch(path.join(packageRoot, Object.values(bin)[0]));
  }

  const steps = qualitySteps(root, { execPath: "/portable/node" });

  assert.deepEqual(
    steps.map(({ name, args }) => [name, args.slice(1)]),
    [
      ["lint", []],
      ["typegen", ["typegen"]],
      ["typecheck", ["--noEmit"]],
      ["build", ["build"]],
    ],
  );
  assert.ok(steps.every((step) => step.command === "/portable/node"));
  assert.ok(steps.every((step) => step.options.shell === false));
});

test("buildResearchInitArgs validates daily package inputs and preserves protected paths", () => {
  assert.deepEqual(
    buildResearchInitArgs({
      outputRoot: "C:\\研究 根",
      date: "2026-10-22",
      start: "2026-10-22T09:00:00+08:00",
      hardStop: "2026-10-22T18:00:00+08:00",
      timezone: "Asia/Shanghai",
      protect: ["BASE=C:\\模型 基线"],
    }),
    [
      "--output-root",
      "C:\\研究 根",
      "--date",
      "2026-10-22",
      "--start",
      "2026-10-22T09:00:00+08:00",
      "--hard-stop",
      "2026-10-22T18:00:00+08:00",
      "--timezone",
      "Asia/Shanghai",
      "--protect",
      "BASE=C:\\模型 基线",
    ],
  );
  assert.throws(
    () =>
      buildResearchInitArgs({
        outputRoot: "out",
        date: "2026-10-22",
        start: "2026-10-22T09:00:00",
        hardStop: "2026-10-22T18:00:00+08:00",
        timezone: "Asia/Shanghai",
      }),
    CliUsageError,
  );
  assert.throws(
    () =>
      buildResearchInitArgs({
        outputRoot: "out",
        date: "2026-10-23",
        start: "2026-10-22T09:00:00+08:00",
        hardStop: "2026-10-22T18:00:00+08:00",
        timezone: "Asia/Shanghai",
      }),
    /date must match/,
  );
  assert.throws(
    () =>
      buildResearchInitArgs({
        outputRoot: "out",
        date: "2026-10-22",
        start: "2026-10-22T18:00:00+08:00",
        hardStop: "2026-10-22T09:00:00+08:00",
        timezone: "Asia/Shanghai",
      }),
    /hardStop must be later/,
  );
});

test("daily and evidence verify builders reject incomplete inputs", () => {
  assert.deepEqual(
    buildResearchVerifyArgs({
      packagePath: "C:\\研究 包",
      at: "2026-10-22T18:00:00+08:00",
    }),
    ["C:\\研究 包", "--at", "2026-10-22T18:00:00+08:00"],
  );
  assert.throws(
    () => buildResearchVerifyArgs({ packagePath: "pkg", at: "2026-10-22T10:00:00" }),
    CliUsageError,
  );
  assert.throws(() => buildEvidenceVerifyArgs({ packagePath: "" }), CliUsageError);
});

test("buildEvidenceInitArgs emits only validated Skill arguments", () => {
  assert.deepEqual(
    buildEvidenceInitArgs({
      output: "C:\\证据 包",
      title: "可复现实验",
      mode: "COMPUTATIONAL",
      projectId: "rd-core",
      createdAt: "2026-10-22T09:00:00+08:00",
    }),
    [
      "--output",
      "C:\\证据 包",
      "--title",
      "可复现实验",
      "--mode",
      "COMPUTATIONAL",
      "--project-id",
      "rd-core",
      "--created-at",
      "2026-10-22T09:00:00+08:00",
    ],
  );
  assert.throws(
    () => buildEvidenceInitArgs({ output: "out", title: "title", mode: "" }),
    CliUsageError,
  );
});

test("parseCli recognizes every Task 1 command without consuming Unicode values", () => {
  assert.deepEqual(parseCli(["doctor", "--json"]), {
    command: "doctor",
    json: true,
    values: {},
  });
  assert.deepEqual(parseCli(["quality"]), {
    command: "quality",
    json: false,
    values: {},
  });
  assert.deepEqual(parseCli(["verify"]), {
    command: "verify",
    json: false,
    values: {},
  });
  assert.equal(
    parseCli(["evidence:verify", "C:\\证据 包"]).values.packagePath,
    "C:\\证据 包",
  );
  assert.equal(
    parseCli([
      "research:verify",
      "C:\\研究 包",
      "--at",
      "2026-10-22T18:00:00+08:00",
    ]).values.at,
    "2026-10-22T18:00:00+08:00",
  );
  assert.throws(() => parseCli(["unknown"]), CliUsageError);
});

test("prerequisitesForCommand isolates optional capabilities from core quality", () => {
  assert.deepEqual(prerequisitesForCommand("quality"), ["node", "localBinaries"]);
  assert.deepEqual(prerequisitesForCommand("verify"), ["node", "localBinaries"]);
  assert.deepEqual(prerequisitesForCommand("research:init"), ["python", "dailySkill"]);
  assert.deepEqual(prerequisitesForCommand("evidence:verify"), [
    "python",
    "evidenceSkill",
  ]);
});

test("resolveCommandPrerequisites invokes only resolvers selected for the command", () => {
  const calls = [];
  const resolvers = Object.fromEntries(
    [
      "node",
      "localBinaries",
      "packageManager",
      "python",
      "dailySkill",
      "evidenceSkill",
      "codexCli",
    ].map((name) => [
      name,
      () => {
        calls.push(name);
        return { available: true, name };
      },
    ]),
  );

  assert.deepEqual(Object.keys(resolveCommandPrerequisites("quality", resolvers)), [
    "node",
    "localBinaries",
  ]);
  assert.deepEqual(calls.splice(0), ["node", "localBinaries"]);

  assert.deepEqual(
    Object.keys(resolveCommandPrerequisites("research:verify", resolvers)),
    ["python", "dailySkill"],
  );
  assert.deepEqual(calls.splice(0), ["python", "dailySkill"]);

  assert.deepEqual(
    Object.keys(resolveCommandPrerequisites("evidence:init", resolvers)),
    ["python", "evidenceSkill"],
  );
  assert.deepEqual(calls.splice(0), ["python", "evidenceSkill"]);

  assert.deepEqual(Object.keys(resolveCommandPrerequisites("doctor", resolvers)), [
    "node",
    "localBinaries",
    "packageManager",
    "python",
    "dailySkill",
    "evidenceSkill",
    "codexCli",
  ]);
  assert.deepEqual(calls, [
    "node",
    "localBinaries",
    "packageManager",
    "python",
    "dailySkill",
    "evidenceSkill",
    "codexCli",
  ]);
});

test("resolveToolchain supports Node 24+ and marks non-baseline versions inexact", () => {
  assert.deepEqual(resolveToolchain({ execPath: "/node", nodeVersion: "24.20.0" }), {
    available: true,
    exact: false,
    execPath: "/node",
    version: "24.20.0",
  });
  assert.deepEqual(resolveToolchain({ execPath: "/node", nodeVersion: "25.1.0" }), {
    available: true,
    exact: false,
    execPath: "/node",
    version: "25.1.0",
  });
});

test("buildDoctorReport distinguishes READY, READY_WITH_GAPS, and BLOCKED", () => {
  const base = {
    node: { available: true, version: "24.19.0", exact: true },
    localBinaries: { available: true },
    packageManager: { available: true },
    python: { available: true },
    dailySkill: { available: true },
    evidenceSkill: { available: true },
    codexCli: { available: false },
  };

  assert.equal(buildDoctorReport(base).status, "READY");
  assert.equal(
    buildDoctorReport({ ...base, python: { available: false } }).status,
    "READY_WITH_GAPS",
  );
  assert.equal(
    buildDoctorReport({ ...base, localBinaries: { available: false } }).status,
    "BLOCKED",
  );
  assert.equal(
    buildDoctorReport({
      ...base,
      node: { available: true, version: "24.20.0", exact: false },
    }).status,
    "READY",
  );
  assert.match(
    buildDoctorReport({
      ...base,
      node: { available: true, version: "24.20.0", exact: false },
    }).warnings[0],
    /24\.19\.0/,
  );
});

test("runSteps stops after the first nonzero exit and names the failed step", async () => {
  const calls = [];
  const result = await runSteps(
    [
      { name: "lint", command: "node", args: ["eslint.js"], options: {} },
      { name: "typegen", command: "node", args: ["next.js", "typegen"], options: {} },
      { name: "typecheck", command: "node", args: ["tsc.js"], options: {} },
    ],
    { spawn: fakeSpawn([{ code: 0 }, { code: 2 }], calls) },
  );

  assert.equal(result.ok, false);
  assert.equal(result.step, "typegen");
  assert.equal(result.code, 2);
  assert.equal(calls.length, 2);
});

test("runSteps preserves a spawn error category", async () => {
  const launchError = Object.assign(new Error("spawn ENOENT"), { code: "ENOENT" });
  const result = await runSteps(
    [{ name: "lint", command: "missing", args: [], options: {} }],
    { spawn: fakeSpawn([{ error: launchError }]) },
  );

  assert.equal(result.ok, false);
  assert.equal(result.kind, "spawn-error");
  assert.equal(result.step, "lint");
  assert.equal(result.error, launchError);
});

test("runSteps preserves termination signals", async () => {
  const result = await runSteps(
    [{ name: "build", command: "node", args: ["next.js", "build"], options: {} }],
    { spawn: fakeSpawn([{ signal: "SIGTERM" }]) },
  );

  assert.equal(result.ok, false);
  assert.equal(result.kind, "signal");
  assert.equal(result.signal, "SIGTERM");
  assert.equal(result.step, "build");
});

test("pipeline CLI emits a machine-readable doctor report", () => {
  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, "scripts", "codex-pipeline.mjs"), "doctor", "--json"],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        CODEX_NODE_HOME: path.dirname(process.execPath),
      },
      shell: false,
    },
  );

  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.match(report.status, /^(?:READY|READY_WITH_GAPS)$/);
  assert.equal(report.prerequisites.node.version, process.versions.node);
  assert.equal(report.prerequisites.localBinaries.available, true);
});

test("codex-npm CLI runs portable npm and preserves argv", () => {
  const npmNodePath = process.env.npm_node_execpath ?? process.execPath;
  const nodeDistributionRoot =
    process.platform === "win32"
      ? path.dirname(npmNodePath)
      : path.dirname(path.dirname(npmNodePath));
  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, "scripts", "codex-npm.mjs"), "--version"],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        CODEX_NODE_HOME: nodeDistributionRoot,
      },
      shell: false,
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout.trim(), /^\d+\.\d+\.\d+$/);
});

test("codex-npm CLI exposes portable Node to PATH-free npm lifecycle scripts", async () => {
  const root = await temporaryDirectory();
  await writeFile(
    path.join(root, "package.json"),
    `${JSON.stringify({
      name: "path-free-portable-npm-probe",
      private: true,
      scripts: { probe: "node --version" },
    })}\n`,
    "utf8",
  );
  const npmNodePath = process.env.npm_node_execpath ?? process.execPath;
  const nodeDistributionRoot =
    process.platform === "win32"
      ? path.dirname(npmNodePath)
      : path.dirname(path.dirname(npmNodePath));
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([name]) => name.toLowerCase() !== "path"),
  );
  env.PATH = "";
  env.CODEX_NODE_HOME = nodeDistributionRoot;

  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, "scripts", "codex-npm.mjs"), "run", "probe", "--silent"],
    {
      cwd: root,
      encoding: "utf8",
      env,
      shell: false,
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.signal, null);
  assert.equal(result.stdout.trim(), `v${process.versions.node}`);
});

test("evidence audit reports matching hashes and deterministic ordering", async () => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const alpha = "alpha artifact\n";
  const zeta = "zeta artifact\n";
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-zeta", "nested/zeta.txt", sha256(zeta)),
    evidenceRecord("evidence-alpha", "alpha.txt", sha256(alpha)),
  ]);
  await mkdir(path.join(fixture.artifactRoot, "nested"));
  await writeFile(path.join(fixture.artifactRoot, "nested", "zeta.txt"), zeta);
  await writeFile(path.join(fixture.artifactRoot, "alpha.txt"), alpha);

  const result = await auditEvidenceArtifacts(fixture);

  assert.deepEqual(result, {
    checked_record_count: 2,
    findings: [],
    record_count: 2,
    records: [
      {
        actual_sha256: sha256(alpha),
        artifact: "alpha.txt",
        evidence_id: "evidence-alpha",
        expected_sha256: sha256(alpha),
        status: "MATCH",
      },
      {
        actual_sha256: sha256(zeta),
        artifact: "nested/zeta.txt",
        evidence_id: "evidence-zeta",
        expected_sha256: sha256(zeta),
        status: "MATCH",
      },
    ],
    status: "PASS",
    unique_file_count: 2,
  });
});

test("evidence audit reports hash mismatch, missing files, and directories", async () => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-directory", "directory", sha256("unused")),
    evidenceRecord("evidence-mismatch", "changed.txt", sha256("original")),
    evidenceRecord("evidence-missing", "missing.txt", sha256("missing")),
  ]);
  await mkdir(path.join(fixture.artifactRoot, "directory"));
  await writeFile(path.join(fixture.artifactRoot, "changed.txt"), "changed");

  const result = await auditEvidenceArtifacts(fixture);

  assert.equal(result.status, "FINDINGS");
  assert.equal(result.record_count, 3);
  assert.equal(result.checked_record_count, 1);
  assert.equal(result.unique_file_count, 1);
  assert.deepEqual(
    result.records.map(({ evidence_id, status }) => ({ evidence_id, status })),
    [
      { evidence_id: "evidence-directory", status: "NOT_REGULAR_FILE" },
      { evidence_id: "evidence-mismatch", status: "HASH_MISMATCH" },
      { evidence_id: "evidence-missing", status: "MISSING" },
    ],
  );
});

test("evidence audit rejects absolute, URI, and lexical escape locators", async () => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-absolute", path.resolve("outside.txt"), sha256("x")),
    evidenceRecord("evidence-escape", "../outside.txt", sha256("x")),
    evidenceRecord("evidence-uri", "file:artifact.txt", sha256("x")),
  ]);

  const result = await auditEvidenceArtifacts(fixture);

  assert.deepEqual(
    result.records.map(({ evidence_id, status }) => ({ evidence_id, status })),
    [
      {
        evidence_id: "evidence-absolute",
        status: "UNSUPPORTED_ABSOLUTE_LOCATOR",
      },
      { evidence_id: "evidence-escape", status: "LEXICAL_ESCAPE" },
      { evidence_id: "evidence-uri", status: "UNSUPPORTED_URI_LOCATOR" },
    ],
  );
  assert.equal(result.checked_record_count, 0);
  assert.equal(result.unique_file_count, 0);
});

test("evidence audit rejects a realpath escape through a symlink", async (t) => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-symlink", "linked/outside.txt", sha256("outside\n")),
  ]);
  const outside = path.join(fixture.root, "outside");
  await mkdir(outside);
  await writeFile(path.join(outside, "outside.txt"), "outside\n");
  try {
    await symlink(
      outside,
      path.join(fixture.artifactRoot, "linked"),
      process.platform === "win32" ? "junction" : "dir",
    );
  } catch (error) {
    if (error.code === "EPERM" || error.code === "EACCES") {
      t.skip(`symlink creation is unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  const result = await auditEvidenceArtifacts(fixture);

  assert.equal(result.records[0].status, "REALPATH_ESCAPE");
  assert.equal(result.checked_record_count, 0);
});

test("evidence audit fails closed on malformed JSONL and duplicate evidence IDs", async () => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const malformed = await evidenceFixture([]);
  await writeFile(path.join(malformed.packagePath, "EVIDENCE.jsonl"), "{not json}\n");

  const malformedResult = await auditEvidenceArtifacts(malformed);

  assert.deepEqual(malformedResult.findings, [
    { line: 1, status: "MALFORMED_JSONL" },
  ]);
  assert.equal(malformedResult.status, "FINDINGS");
  assert.equal(malformedResult.checked_record_count, 0);

  const duplicate = await evidenceFixture([
    evidenceRecord("evidence-duplicate", "first.txt", sha256("first")),
    evidenceRecord("evidence-duplicate", "second.txt", sha256("second")),
  ]);

  const duplicateResult = await auditEvidenceArtifacts(duplicate);

  assert.deepEqual(duplicateResult.findings, [
    { evidence_id: "evidence-duplicate", status: "DUPLICATE_EVIDENCE_ID" },
  ]);
  assert.equal(duplicateResult.record_count, 2);
  assert.equal(duplicateResult.checked_record_count, 0);
  assert.deepEqual(duplicateResult.records, []);
});

test("evidence audit succeeds for empty EVIDENCE with explicit zero counts", async () => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const fixture = await evidenceFixture([]);

  const result = await auditEvidenceArtifacts(fixture);

  assert.deepEqual(result, {
    checked_record_count: 0,
    findings: [],
    record_count: 0,
    records: [],
    status: "PASS",
    unique_file_count: 0,
  });
});

test("evidence:audit parser requires exactly one package and --artifact-root", () => {
  const packagePath = "C:\\研究 包";
  const artifactRoot = "C:\\研究 产物";
  assert.deepEqual(
    parseCli(["evidence:audit", packagePath, "--artifact-root", artifactRoot]),
    {
      command: "evidence:audit",
      json: false,
      values: { artifactRoot, packagePath },
    },
  );
  assert.throws(
    () => parseCli(["evidence:audit", packagePath]),
    /evidence:audit requires <package> --artifact-root <directory>/,
  );
  assert.throws(
    () => parseCli(["evidence:audit", packagePath, "--artifact-root", artifactRoot, "extra"]),
    CliUsageError,
  );
});

test("structural verifier facts preserve every process and payload outcome", async () => {
  const { verifyEvidenceStructure } = await import("./lib/codex-pipeline.mjs");
  const payloadError = {
    code: "PACKAGE_FINDING",
    message: "The package is structurally invalid.",
  };
  const cases = [
    {
      name: "launch error",
      result: {
        error: Object.assign(new Error("spawn ENOENT"), { code: "ENOENT" }),
        signal: null,
        status: null,
        stdout: "",
      },
      expected: {
        errors: [{ code: "VERIFIER_LAUNCH_ERROR", message: "spawn ENOENT" }],
        exit_code: null,
        failure_kind: "launch_error",
        signal: null,
        status: "ERROR",
        step: "evidence:verify",
        valid: false,
      },
    },
    {
      name: "signal with valid payload",
      result: {
        signal: "SIGTERM",
        status: null,
        stdout: JSON.stringify({ errors: [payloadError], valid: false }),
      },
      expected: {
        errors: [payloadError],
        exit_code: null,
        failure_kind: "signal",
        signal: "SIGTERM",
        status: "ERROR",
        step: "evidence:verify",
        valid: false,
      },
    },
    {
      name: "numeric exit with valid payload",
      result: {
        signal: null,
        status: 7,
        stdout: JSON.stringify({ errors: [payloadError], valid: false }),
      },
      expected: {
        errors: [payloadError],
        exit_code: 7,
        failure_kind: "exit",
        signal: null,
        status: "ERROR",
        step: "evidence:verify",
        valid: false,
      },
    },
    {
      name: "invalid output",
      result: { signal: null, status: 0, stdout: "not JSON" },
      expected: {
        errors: [
          {
            code: "VERIFIER_OUTPUT_ERROR",
            message: "structural verifier did not emit valid JSON",
          },
        ],
        exit_code: 0,
        failure_kind: "invalid_output",
        signal: null,
        status: "ERROR",
        step: "evidence:verify",
        valid: false,
      },
    },
    {
      name: "structural findings",
      result: {
        signal: null,
        status: 0,
        stdout: JSON.stringify({ errors: [payloadError], valid: false }),
      },
      expected: {
        errors: [payloadError],
        exit_code: 0,
        failure_kind: "findings",
        signal: null,
        status: "FINDINGS",
        step: "evidence:verify",
        valid: false,
      },
    },
    {
      name: "success",
      result: {
        signal: null,
        status: 0,
        stdout: JSON.stringify({ errors: [], valid: true }),
      },
      expected: {
        errors: [],
        exit_code: 0,
        failure_kind: null,
        signal: null,
        status: "PASS",
        step: "evidence:verify",
        valid: true,
      },
    },
  ];

  for (const fixture of cases) {
    const calls = [];
    const actual = verifyEvidenceStructure("C:\\evidence package", {
      cwd: "C:\\project",
      pythonCommand: "C:\\Python\\python.exe",
      spawnSync(command, args, options) {
        calls.push({ command, args, options });
        return fixture.result;
      },
      verifierPath: "C:\\skills\\verify_research.py",
    });

    assert.deepEqual(actual, { fact: fixture.expected, ok: fixture.name === "success" }, fixture.name);
    assert.deepEqual(calls, [
      {
        command: "C:\\Python\\python.exe",
        args: ["C:\\skills\\verify_research.py", "C:\\evidence package"],
        options: {
          cwd: "C:\\project",
          encoding: "utf8",
          shell: false,
        },
      },
    ]);
  }
});

test("evidence:audit uses structural prerequisites and short-circuits artifact hashing", async () => {
  assert.deepEqual(prerequisitesForCommand("evidence:audit"), [
    "python",
    "evidenceSkill",
  ]);
  const { runEvidenceAudit } = await import("./lib/codex-pipeline.mjs");
  const calls = [];
  const result = await runEvidenceAudit({
    async auditArtifacts() {
      calls.push("artifacts");
      throw new Error("artifact audit must not run");
    },
    async verifyStructure() {
      calls.push("structure");
      return {
        fact: {
          errors: [{ code: "DUPLICATE_ID", message: "An identifier is duplicated." }],
          status: "FINDINGS",
          valid: false,
        },
        ok: false,
      };
    },
  });

  assert.deepEqual(calls, ["structure"]);
  assert.equal(result.exitCode, 1);
  assert.deepEqual(result.report.artifacts, {
    checked_record_count: 0,
    record_count: 0,
    records: [],
    status: "NOT_RUN",
    unique_file_count: 0,
  });
  assert.equal(result.report.scientific_claim_effect, "NONE");
});

test("evidence:audit composite keeps structure and artifact facts separate", async () => {
  const { runEvidenceAudit } = await import("./lib/codex-pipeline.mjs");
  const result = await runEvidenceAudit({
    async auditArtifacts() {
      return {
        checked_record_count: 1,
        findings: [],
        record_count: 1,
        records: [{ evidence_id: "evidence-1", status: "MATCH" }],
        status: "PASS",
        unique_file_count: 1,
      };
    },
    async verifyStructure() {
      return {
        fact: { errors: [], status: "PASS", valid: true },
        ok: true,
      };
    },
  });

  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.report, {
    artifacts: {
      checked_record_count: 1,
      findings: [],
      record_count: 1,
      records: [{ evidence_id: "evidence-1", status: "MATCH" }],
      status: "PASS",
      unique_file_count: 1,
    },
    scientific_claim_effect: "NONE",
    status: "PASS",
    structure: { errors: [], status: "PASS", valid: true },
  });
});

test("evidence audit rejects a canonical realpath case-variant escape", async () => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const expectedHash = sha256("outside");
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-case-escape", "escape.txt", expectedHash),
  ]);
  const canonicalRoot = "C:\\case-sensitive\\Artifacts";

  const result = await auditEvidenceArtifacts({
    ...fixture,
    dependencies: {
      async hashFile() {
        throw new Error("escaped file must not be hashed");
      },
      pathApi: path.win32,
      async realpath(candidate) {
        return candidate === canonicalRoot
          ? canonicalRoot
          : "C:\\case-sensitive\\artifacts\\escape.txt";
      },
      async stat(candidate) {
        return {
          isDirectory: () => candidate === canonicalRoot,
          isFile: () => candidate !== canonicalRoot,
        };
      },
    },
    artifactRoot: canonicalRoot,
  });

  assert.equal(result.records[0].status, "REALPATH_ESCAPE");
  assert.equal(result.checked_record_count, 0);
  assert.equal(result.unique_file_count, 0);
});

test("evidence audit preserves canonical case in unique-file cache keys", async () => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const upperHash = sha256("upper");
  const lowerHash = sha256("lower");
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-upper", "A.txt", upperHash),
    evidenceRecord("evidence-lower", "a.txt", lowerHash),
  ]);
  const canonicalRoot = "C:\\case-sensitive\\Artifacts";
  const hashCalls = [];

  const result = await auditEvidenceArtifacts({
    ...fixture,
    dependencies: {
      async hashFile(candidate) {
        hashCalls.push(candidate);
        return candidate.endsWith("\\A.txt") ? upperHash : lowerHash;
      },
      pathApi: path.win32,
      async realpath(candidate) {
        return candidate;
      },
      async stat(candidate) {
        return {
          isDirectory: () => candidate === canonicalRoot,
          isFile: () => candidate !== canonicalRoot,
        };
      },
    },
    artifactRoot: canonicalRoot,
  });

  assert.equal(result.status, "PASS");
  assert.equal(result.checked_record_count, 2);
  assert.equal(result.unique_file_count, 2);
  assert.deepEqual(hashCalls.sort(), [
    "C:\\case-sensitive\\Artifacts\\A.txt",
    "C:\\case-sensitive\\Artifacts\\a.txt",
  ]);
});

test("evidence audit rejects an alternate-data-stream locator before hashing", async () => {
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-ads", "dir/file.txt:stream", sha256("stream")),
  ]);
  const canonicalRoot = "C:\\artifact-root";
  let hashCalls = 0;

  const result = await auditEvidenceArtifacts({
    ...fixture,
    dependencies: {
      async hashFile() {
        hashCalls += 1;
        return sha256("stream");
      },
      pathApi: path.win32,
      async realpath(candidate) {
        return candidate;
      },
      async stat(candidate) {
        return {
          isDirectory: () => candidate === canonicalRoot,
          isFile: () => candidate !== canonicalRoot,
        };
      },
    },
    artifactRoot: canonicalRoot,
  });

  assert.equal(result.records[0].status, "UNSUPPORTED_COLON_LOCATOR");
  assert.equal(result.checked_record_count, 0);
  assert.equal(hashCalls, 0);
});

test("evidence audit distinguishes case-sensitive NTFS files when supported", async (t) => {
  if (process.platform !== "win32") {
    t.skip("case-sensitive NTFS coverage requires Windows");
    return;
  }
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const upper = "upper-case file";
  const lower = "lower-case file";
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-upper", "A.txt", sha256(upper)),
    evidenceRecord("evidence-lower", "a.txt", sha256(lower)),
  ]);
  const enabled = spawnSync(
    "fsutil.exe",
    ["file", "setCaseSensitiveInfo", fixture.artifactRoot, "enable"],
    { encoding: "utf8", shell: false },
  );
  if (enabled.error || enabled.status !== 0) {
    t.skip(
      `case-sensitive NTFS unavailable: ${enabled.error?.code ?? `fsutil exit ${enabled.status}`}`,
    );
    return;
  }
  await writeFile(path.join(fixture.artifactRoot, "A.txt"), upper);
  await writeFile(path.join(fixture.artifactRoot, "a.txt"), lower);

  const result = await auditEvidenceArtifacts(fixture);

  assert.equal(result.status, "PASS");
  assert.equal(result.unique_file_count, 2);
});

test("evidence audit rejects a real NTFS alternate data stream when supported", async (t) => {
  if (process.platform !== "win32") {
    t.skip("NTFS alternate-data-stream coverage requires Windows");
    return;
  }
  const { auditEvidenceArtifacts } = await import("./lib/evidence-artifact-audit.mjs");
  const fixture = await evidenceFixture([
    evidenceRecord("evidence-ads", "dir/carrier.txt:stream", sha256("stream")),
  ]);
  const directory = path.join(fixture.artifactRoot, "dir");
  await mkdir(directory);
  const carrier = path.join(directory, "carrier.txt");
  await writeFile(carrier, "carrier");
  try {
    await writeFile(`${carrier}:stream`, "stream");
  } catch (error) {
    t.skip(`NTFS alternate data streams unavailable: ${error.code ?? error.message}`);
    return;
  }

  const result = await auditEvidenceArtifacts(fixture);

  assert.equal(result.records[0].status, "UNSUPPORTED_COLON_LOCATOR");
  assert.equal(result.checked_record_count, 0);
});

test("resolveE2EPort defaults to 3100 and accepts the inclusive port range", async () => {
  let playwrightServer;
  try {
    playwrightServer = await import("./lib/playwright-server.mjs");
  } catch (error) {
    assert.fail(`Playwright server module must load: ${error.message}`);
  }

  assert.equal(playwrightServer.resolveE2EPort(undefined), 3100);
  assert.equal(playwrightServer.resolveE2EPort("1024"), 1024);
  assert.equal(playwrightServer.resolveE2EPort("65535"), 65535);
});

test("resolveE2EPort rejects malformed and out-of-range values", async () => {
  let playwrightServer;
  try {
    playwrightServer = await import("./lib/playwright-server.mjs");
  } catch (error) {
    assert.fail(`Playwright server module must load: ${error.message}`);
  }

  for (const value of ["", "1023", "65536", "3100.5", " 3100", "port"] ) {
    assert.throws(
      () => playwrightServer.resolveE2EPort(value),
      /CODEX_E2E_PORT must be an integer from 1024 through 65535/,
    );
  }
});

test("prepareStandaloneAssets rejects incomplete standalone build output", async () => {
  const { prepareStandaloneAssets } = await import("./lib/playwright-server.mjs");
  const root = await temporaryDirectory();

  await assert.rejects(
    prepareStandaloneAssets({ projectRoot: root }),
    /standalone server is missing/,
  );
  await touch(path.join(root, ".next", "standalone", "server.js"));
  await assert.rejects(
    prepareStandaloneAssets({ projectRoot: root }),
    /static build output is missing/,
  );
});

test("prepareStandaloneAssets replaces stale public and static assets only", async () => {
  const { prepareStandaloneAssets } = await import("./lib/playwright-server.mjs");
  const root = await temporaryDirectory();
  const standalone = path.join(root, ".next", "standalone");

  await touch(path.join(standalone, "server.js"));
  await writeFile(path.join(standalone, "keep.txt"), "keep", "utf8");
  await mkdir(path.join(root, "public", "nested"), { recursive: true });
  await writeFile(path.join(root, "public", "nested", "current.txt"), "public-current", "utf8");
  await mkdir(path.join(root, ".next", "static", "chunks"), { recursive: true });
  await writeFile(path.join(root, ".next", "static", "chunks", "current.js"), "static-current", "utf8");
  await mkdir(path.join(standalone, "public"), { recursive: true });
  await writeFile(path.join(standalone, "public", "stale.txt"), "stale", "utf8");
  await mkdir(path.join(standalone, ".next", "static"), { recursive: true });
  await writeFile(path.join(standalone, ".next", "static", "stale.js"), "stale", "utf8");

  const result = await prepareStandaloneAssets({ projectRoot: root });

  assert.equal(result.serverPath, path.join(standalone, "server.js"));
  assert.equal(
    await readFile(path.join(standalone, "public", "nested", "current.txt"), "utf8"),
    "public-current",
  );
  assert.equal(
    await readFile(path.join(standalone, ".next", "static", "chunks", "current.js"), "utf8"),
    "static-current",
  );
  await assert.rejects(readFile(path.join(standalone, "public", "stale.txt")), /ENOENT/);
  await assert.rejects(readFile(path.join(standalone, ".next", "static", "stale.js")), /ENOENT/);
  assert.equal(await readFile(path.join(standalone, "keep.txt"), "utf8"), "keep");
});

test("standalone server starts in-process with a forced production loopback endpoint", async () => {
  const { startStandaloneServer } = await import("./lib/playwright-server.mjs");
  const root = await temporaryDirectory();
  const standalone = path.join(root, ".next", "standalone");
  const serverPath = path.join(standalone, "server.js");
  await touch(serverPath);
  await mkdir(path.join(root, ".next", "static"), { recursive: true });
  await mkdir(path.join(root, "public"), { recursive: true });
  const env = {
    CODEX_E2E_PORT: "4321",
    HOSTNAME: "0.0.0.0",
    NODE_ENV: "development",
    NEXT_TELEMETRY_DISABLED: "0",
    PORT: "9999",
  };
  const loads = [];

  const result = await startStandaloneServer({
    env,
    async loadServer(candidate) {
      loads.push({
        candidate,
        hostname: env.HOSTNAME,
        nodeEnv: env.NODE_ENV,
        port: env.PORT,
        telemetry: env.NEXT_TELEMETRY_DISABLED,
      });
    },
    projectRoot: root,
  });

  assert.deepEqual(loads, [{
    candidate: serverPath,
    hostname: "127.0.0.1",
    nodeEnv: "production",
    port: "4321",
    telemetry: "1",
  }]);
  assert.deepEqual(result, {
    port: 4321,
    serverPath,
    url: "http://127.0.0.1:4321",
  });
});

test("Playwright config uses the selected loopback endpoint without server reuse", async () => {
  const probe = spawnSync(
    process.execPath,
    [
      "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
      "--input-type=module",
      "--eval",
      `
        const { default: config } = await import("./playwright.config.ts?test=${Date.now()}");
        console.log(JSON.stringify({
          projects: config.projects,
          retries: config.retries,
          use: config.use,
          webServer: config.webServer,
          workers: config.workers,
        }));
      `,
    ],
    {
      cwd: projectRoot,
      encoding: "utf8",
      env: { ...process.env, CI: "1", CODEX_E2E_PORT: "4123" },
      shell: false,
    },
  );
  assert.equal(probe.status, 0, probe.stderr);
  assert.equal(probe.stderr, "");
  const config = JSON.parse(probe.stdout);

  assert.equal(config.use.baseURL, "http://127.0.0.1:4123");
  assert.equal(config.webServer.url, "http://127.0.0.1:4123");
  assert.equal(config.webServer.reuseExistingServer, false);
  assert.equal(config.retries, 0);
  assert.equal(config.workers, 1);
  assert.deepEqual(
    config.projects.map(({ name, use }) => ({
      browserName: use.browserName,
      name,
      viewport: use.viewport,
    })),
    [
      {
        browserName: "chromium",
        name: "desktop-chromium",
        viewport: { height: 900, width: 1440 },
      },
      {
        browserName: "chromium",
        name: "mobile-chromium",
        viewport: { height: 844, width: 390 },
      },
    ],
  );
});
