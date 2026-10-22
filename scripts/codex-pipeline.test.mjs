import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { EventEmitter } from "node:events";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
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
