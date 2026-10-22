# Codex R&D Pipeline

This repository owns a Node-based local verification control plane. It checks its prerequisites, runs the control-plane unit suite, performs lint/type generation/type checking/build, exercises the production standalone server in Chromium, delegates optional research-package work to installed Skills, and audits supported local evidence artifacts. Each command stops at its first failed step.

## Toolchain setup

Node 24 or newer is required. Node 24.19.0 is the reproducibility baseline in `.nvmrc`, Docker, and CI. On Windows, an operator can make the pinned portable distribution explicit for one PowerShell session:

```powershell
$env:CODEX_HOME = 'C:\Users\12\.codex'
$env:CODEX_NODE_HOME = 'C:\Users\12\.codex\toolchains\node-v24.19.0-win-x64'
$node = Join-Path $env:CODEX_NODE_HOME 'node.exe'
& $node scripts/codex-pipeline.mjs doctor --json
```

`process.execPath` is authoritative for control-plane child processes. `CODEX_NODE_HOME` controls portable npm discovery. If it is absent, discovery uses the official distribution name below `CODEX_HOME/toolchains`; if `CODEX_HOME` is absent it uses the current user's `.codex` directory. An explicit incomplete `CODEX_NODE_HOME` fails closed. No command edits `PATH`.

The recorded Windows archive provenance is `https://nodejs.org/dist/v24.19.0/node-v24.19.0-win-x64.zip`, SHA-256 `57f71ab3652e797d84acddc79c81cc9ff1c6ddb2a1974cdb83f00fee9bff4c73`. Finding the extracted `node.exe` and npm CLI does not revalidate that downloaded archive.

`doctor` reports `READY` when core and optional research capabilities are present, `READY_WITH_GAPS` when the core works but an optional capability is missing, and `BLOCKED` when a core prerequisite is missing. Codex CLI detection is informational.

## Core commands

The direct-Node commands work after dependencies have been restored even when npm is absent from `PATH`:

```powershell
& $node scripts/codex-pipeline.mjs doctor --json
& $node scripts/codex-pipeline.mjs quality
& $node scripts/codex-pipeline.mjs verify
```

`quality` runs ESLint, `next typegen`, `tsc --noEmit`, then `next build`. `verify` runs `node --test scripts/codex-pipeline.test.mjs` and then every `quality` step. The npm aliases are:

```powershell
& $node scripts/codex-npm.mjs run pipeline:doctor -- --json
& $node scripts/codex-npm.mjs run pipeline:test
& $node scripts/codex-npm.mjs run pipeline:quality
& $node scripts/codex-npm.mjs run verify
& $node scripts/codex-npm.mjs run check
```

`verify` and `check` are equivalent. Restore exactly from the lockfile with `& $node scripts/codex-npm.mjs ci`; the wrapper finds the npm CLI inside the configured portable distribution and preserves argv without a shell.

## Production browser smoke

Run the real desktop and mobile lane with:

```powershell
& $node scripts/codex-npm.mjs run test:e2e
```

The alias always creates a new Next.js production build before Playwright starts. The launcher requires `.next/standalone/server.js`, replaces only generated `public` and `.next/static` destinations inside `.next/standalone`, binds the server to `127.0.0.1`, and disables server reuse. `CODEX_E2E_PORT` may select an integer from 1024 through 65535; the default is 3100. `start:e2e` only validates and serves existing build outputs, so it makes no source-freshness claim.

The two Chromium projects assert HTTP 200 navigation, a visible `main`, a nonempty body, a successful `/_next/static/` response, no first-party document/script/stylesheet/font/image/media failure, no page or error-level console error, and no horizontal viewport overflow. They do not inspect optional external origins or application fetch/XHR traffic. This is smoke evidence only; it supplies no visual-regression or pixel-parity result.

If a server/cache symptom appears, stop any prior server, remove only generated `.next` output, and rerun `test:e2e`. Do not reuse a prior quality build as browser evidence. Failure traces, screenshots, video, and the HTML report are diagnostic outputs retained on failure; they are not package evidence unless separately governed and hashed.

## Optional research adapters

Research commands require Python plus the corresponding installed Skill. `CODEX_HOME` is authoritative when set. Without it, discovery uses the current user's `.codex` directory. `CODEX_PYTHON` may select an explicit Python executable; otherwise the adapter tries `python` and then `python3`.

Daily-package commands require `skills/daily-dev-experiment-pipeline`:

```powershell
& $node scripts/codex-pipeline.mjs research:init --output-root <root> --date 2026-10-22 --start 2026-10-22T09:00:00+08:00 --hard-stop 2026-10-22T18:00:00+08:00 --timezone Asia/Shanghai --protect LABEL=<path>
& $node scripts/codex-pipeline.mjs research:verify <package> --at 2026-10-22T17:00:00+08:00
```

Persistent evidence commands require `skills/research-evidence-pipeline`:

```powershell
& $node scripts/codex-pipeline.mjs evidence:init --output <package> --title <title> --mode COMPUTATIONAL --project-id <id> --created-at 2026-10-22T09:00:00+08:00
& $node scripts/codex-pipeline.mjs evidence:verify <package>
& $node scripts/codex-pipeline.mjs evidence:audit <package> --artifact-root .
```

Equivalent npm aliases are `research:day`, `research:verify`, `evidence:init`, `evidence:verify`, and `evidence:audit`; pass adapter arguments after `--`. `evidence:init` creates a new exact-seven-file v1 package and refuses an existing target. It does not provide transactionality or crash/power-loss atomicity. The structural verifier checks package shape, values, and links without dereferencing artifacts. The audit first requires structural success, then accepts only normalized relative regular-file locators below the explicit artifact root and streams SHA-256. A passing byte audit proves file existence and byte equality at read time only.

Research adapters never substitute a local schema when a Skill or Python is missing. A missing optional capability leaves core `verify` usable and makes only the affected research command fail.

## Evidence boundaries and maturity

The local package is `docs/operations/research/codex-rd-pipeline-core`; its single governed artifact is `docs/operations/evidence/2026-10-22-codex-rd-pipeline-core-verification.json`. Keep artifacts outside the exact-seven-file package and audit this package from the repository root with `--artifact-root .`.

Maturity advances only with matching evidence:

1. `STATIC_UNIT_VERIFIED`: control-plane unit/static checks passed.
2. `LOCAL_WORKTREE_VERIFIED`: local quality and desktop/mobile smoke passed against current files.
3. `CLEAN_COMMIT_VERIFIED`: lockfile restore, `check` or `verify` (the unit suite plus every quality step), smoke, structure, byte audit, diff checks, and protected-path checks passed on one clean exact local commit.
4. `REMOTE_SINGLE_PASS`: the configured GitHub Actions jobs passed on that same SHA.
5. `REMOTE_REPEATED_PASS`: separate matching remote runs passed.

Local results cannot establish a remote state. Structural verification and byte equality do not establish scientific correctness, truthful provenance, immutability, reviewer independence, production reliability, novelty, statistical validity, or reproducibility.

## Recovery and bounded gaps

For a failed core command, rerun `doctor --json`, restore from the lockfile with portable npm, then rerun the failed command. Preserve the original exit category: spawn failure, signal, or nonzero code. For a research failure, check `CODEX_HOME`, `CODEX_PYTHON`, the named Skill directory, the package's exact root shape, and the explicit artifact root. Never repair a missing Skill by inventing package fields.

The protected application imports `next/font/google`; a clean build can therefore require access to Google's font endpoint. Removing that network dependency would change protected application code and is outside this pipeline branch. The observed npm audit signal on the bounded base run was 17 findings: 3 moderate, 12 high, and 2 critical. This record makes no remediation or causality claim.
