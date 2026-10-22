# Codex Development and Research Pipeline Core Design

## Intent

Build a repository-owned, cross-platform control plane that can verify this Next.js template, exercise a production build in Chromium, and audit local artifacts referenced by a research-evidence package without touching the user's in-progress website implementation. The result must be independently replayable from a clean checkout of one exact commit.

The current upstream baseline is `ee3f5a2f31fd549b9593fa4f7cf6d2955ee593bb`. It passes lint, TypeScript, and a Next.js 16.3.5 production build with Node.js 24.19.0. Earlier pipeline work in the dirty `master` checkout is reference material only; it is not an integration base and must not be copied with Techmeme-specific behavior.

## Protected boundary

The implementation must not modify or include changes from:

- `src/app`
- `src/components/techmeme`
- `src/types/techmeme.ts`
- `public/techmeme`
- `scripts/download-techmeme-assets.mjs`
- `docs/design-references/techmeme`
- `docs/research`
- the sealed first-phase evidence package in the original dirty checkout

All work happens on `codex/rd-pipeline-core` in its managed worktree. No persistent PATH change, destructive Git operation, snapshot update, push, pull request, or remote workflow run is part of this local implementation.

## Goals

1. Give operators one Node-based control plane for diagnostics, unit tests, lint, typecheck, build, daily-package adapters, and persistent-evidence adapters.
2. Discover a complete portable Node/npm distribution without depending on a machine-wide npm command or mutating persistent PATH.
3. Preserve child-process launch errors, exit codes, and signals so failures remain diagnosable.
4. Run generic Chromium smoke tests against the Next.js standalone production server at desktop and mobile viewports.
5. Add a read-only artifact audit that proves only whether supported local evidence locators exist and match their declared SHA-256 values.
6. Make GitHub Actions replay the portable quality gate and browser smoke on Linux with pinned Node and package versions.
7. Record exact commands, tool versions, boundaries, and local results without upgrading an `EXPLORATORY_SUPPORT` claim.

## Non-goals

- No Techmeme content, layout, or asset assertion belongs in the generic smoke suite.
- No visual snapshot or pixel-comparison baseline belongs in the core pipeline.
- No verifier result is treated as scientific correctness, production reliability, provenance truth, or reviewer independence.
- No local result is reported as a remote GitHub Actions result.
- No dynamic dependency installation occurs during `doctor`, `quality`, `verify`, or browser test execution.
- No repair of the user's global PATH, global Codex configuration, or authentication state.

## Trust model and maturity

The pipeline reports distinct evidence layers:

1. **Static/unit evidence:** control-plane tests exercise argument construction, path handling, failure propagation, and audit semantics.
2. **Local worktree evidence:** lint, typecheck, build, and Chromium smoke run against current files.
3. **Clean-commit evidence:** the same gates run after all implementation commits on one exact local SHA.
4. **Remote evidence:** GitHub Actions must run on that same SHA; this design does not create that evidence.

Local success may reach `CLEAN_COMMIT_VERIFIED`. It must not be labeled `REMOTE_SINGLE_PASS` or `REMOTE_REPEATED_PASS` until matching remote runs exist.

## Architecture

### 1. Node control plane

`scripts/lib/codex-pipeline.mjs` contains pure or dependency-injectable functions. `scripts/codex-pipeline.mjs` is the CLI, and `scripts/codex-npm.mjs` is the argv-preserving npm wrapper. `scripts/codex-pipeline.test.mjs` uses `node:test` and temporary fixtures.

The control plane exposes:

- `doctor [--json]`
- `quality`
- `verify`
- `research:init ...`
- `research:verify <package> --at <offset-aware timestamp>`
- `evidence:init ...`
- `evidence:verify <package>`
- `evidence:audit <package> --artifact-root <directory>`

The script graph is exact:

- `quality`: ESLint, `next typegen`, `tsc --noEmit`, then `next build`.
- `verify`: control-plane unit tests, then every `quality` step.
- `npm run check`: an alias for `verify`.
- `npm run test:e2e`: Playwright owns a new production build, stages it, starts it, and runs smoke tests. It never consumes the earlier quality-job build.

Every sequence stops on the first failure. The control plane uses project-local JavaScript entrypoints rather than nested npm commands, so it works when npm is absent from PATH after dependencies have been restored. `next typegen` precedes `tsc` because the installed Next.js 16.3.5 documentation requires generated route types and `next-env.d.ts` to exist before external type-checking.

The current `process.execPath` is authoritative for control-plane children. Node versions below 24 block the core; a Node 24 version other than 24.19.0 is supported but reported as a reproducibility warning. Exact local closeout, `.nvmrc`, Docker build/runtime stages, and CI use 24.19.0.

Portable npm discovery first honors `CODEX_NODE_HOME`, then resolves the official Node v24.19.0 extracted-distribution name for `win32`, `linux`, or `darwin` on `x64` or `arm64`. Unsupported platform/architecture pairs fail with an explicit diagnostic. Explicit incomplete configuration fails closed and never silently falls back. The repository records the official distribution URL and archive SHA-256 used by the current Windows x64 installation as provenance, but does not claim that checking extracted file presence re-verifies the original archive. Child processes receive argv arrays with `shell: false`; only Playwright's documented static `webServer.command` crosses a shell boundary.

Daily and persistent research commands delegate to the installed Skills. Skill discovery uses `CODEX_HOME` when present, otherwise `<home>/.codex`, and then the fixed installed paths `skills/daily-dev-experiment-pipeline` and `skills/research-evidence-pipeline`. Python discovery uses `CODEX_PYTHON` when explicitly supplied, otherwise `python` and then `python3`; the selected executable is retained as one argv-safe command. The repository does not duplicate Skill schemas. Missing Python or Skills is a capability failure for the affected command, not a core quality failure and not permission to improvise a replacement.

`doctor` reports `READY` only when core and optional local research capabilities pass, `READY_WITH_GAPS` when core is ready but an optional capability is unavailable, and `BLOCKED` when the core cannot run. Codex CLI availability is informational and never changes the repository quality result.

### 2. Local evidence artifact audit

The structural verifier and artifact audit remain separate claims:

- `evidence:verify` proves only the checks implemented by the installed v1 structural verifier.
- `evidence:audit` first requires structural verification to pass, then reads `EVIDENCE.jsonl` and checks supported local files.

To remove locator ambiguity, `evidence:audit` requires `--artifact-root`. Supported locators are normalized relative paths below that root. Absolute paths, URI schemes, traversal outside the root, directories, missing files, and symlink escapes fail closed. Each regular file is streamed through SHA-256 and compared with `provenance.sha256`. The byte-audit implementation lives in `scripts/lib/evidence-artifact-audit.mjs`, separate from structural adapters.

The command first runs the installed structural verifier. Only a structural success permits hashing. It prints deterministic JSON with separate `structure` and `artifacts` sections, one artifact result per evidence ID, `scientific_claim_effect: "NONE"`, record and unique-file counts, and a stable status vocabulary. Success is exit 0, any verification/audit finding is exit 1, and CLI misuse is exit 2. A passing audit proves existence and byte equality at read time only. It does not prove truthful provenance, valid science, immutability, or later availability.

### 3. Production browser lane

`next.config.ts` already enables `output: "standalone"`. Each Playwright run first invokes the project-local Next CLI to create a new production build. The launcher then verifies `.next/standalone/server.js`, removes only generated asset destinations beneath `.next/standalone`, copies fresh `public` and `.next/static`, and starts the standalone entrypoint in a process Playwright can terminate directly with `HOSTNAME=127.0.0.1` and a validated port. Direct `start:e2e` only validates that build outputs exist; it makes no source-freshness claim. The freshness guarantee belongs to `test:e2e`, which always rebuilds.

`CODEX_E2E_PORT` may select an integer from 1024 through 65535; the default is 3100. Playwright always uses `reuseExistingServer: false`, so an unrelated old server cannot satisfy readiness. CI uses one worker and retains trace, screenshot, video, and HTML output only as failure evidence.

`e2e/template.smoke.spec.ts` runs desktop and mobile Chromium projects and checks:

- the document navigation returns HTTP 200;
- a visible `main` landmark and nonempty body exist;
- no uncaught page error or error-level console message occurs;
- at least one `/_next/static/` response succeeds, proving staged static assets are served;
- no first-party document, script, stylesheet, font, image, or media request fails or returns HTTP 4xx/5xx during initial load;
- the document has no horizontal viewport overflow.

Navigation waits for `load`, never `networkidle`; external origins and application fetch/XHR traffic are outside the generic assertion because cloned sites may use optional APIs or deliberate probes. These are smoke assertions. The core pipeline deliberately supplies no visual-regression or pixel-parity evidence.

### 4. GitHub Actions

The workflow pins the upstream `actions/checkout` and `actions/setup-node` v7 releases to verified commit SHAs with version comments, grants read-only contents permission, uses `ubuntu-24.04`, and pins Node to `24.19.0`. This task promises local Windows x64 execution and Linux x64 CI configuration. Other platforms and arm64 receive unit-tested discovery behavior but no execution claim.

- `quality`: checkout, `npm ci`, `npm run check`.
- `e2e`: depends on `quality`, repeats checkout and `npm ci`, installs only the locked Playwright Chromium through the local CLI, runs `npm run test:e2e`, and uploads failure artifacts.

The workflow does not install Codex Skills or run research commands. Those are local optional capabilities, while the repository verification gate remains self-contained after `npm ci`. Playwright retries are disabled so a nominal pass cannot hide a failed first attempt; repeated-pass maturity requires separate successful workflow runs.

### 5. Documentation and evidence

`docs/operations/CODEX_RD_PIPELINE.md` documents commands, capability boundaries, failure recovery, and the maturity ladder. A new seven-file research-evidence package lives at `docs/operations/research/codex-rd-pipeline-core`; it does not modify the sealed first-phase package. Its artifacts live outside the package under `docs/operations/evidence/` as required by the v1 contract.

The headline claim remains `EXPLORATORY_SUPPORT`. The evidence report explicitly distinguishes structural verification, byte-level artifact audit, browser smoke, visual regression, pixel parity, and remote CI. Exact local clean-commit replay output is also retained in the ignored SDD closeout workspace to avoid a self-referential commit-hash artifact.

## Failure behavior

- Missing project binaries block `quality` and `verify` with an actionable path.
- Missing portable npm blocks only package-manager operations.
- Missing Python or installed Skills blocks only the corresponding research command and prevents false success.
- Spawn errors, signals, and nonzero exits retain their original category and step name.
- Browser preparation refuses absent or stale build prerequisites before server launch.
- Artifact audit never writes the package or artifact files.
- Any protected-path diff or unexpected dirty file stops integration.

## Acceptance criteria

1. Unit tests cover portable toolchain architecture, non-ASCII argv preservation, prerequisites, process failures, safe evidence argument construction, artifact containment/hash outcomes, stale standalone assets, port validation, and no server reuse.
2. `doctor` emits human and JSON diagnostics that agree with actual prerequisites.
3. `verify` freshly passes control-plane tests, ESLint, TypeScript, and Next.js 16.3.5 build without requiring npm on PATH.
4. Generic Chromium smoke passes at desktop and mobile viewports against a newly built standalone server.
5. `npm ci` can recreate the dependency tree with an exact Playwright version.
6. The new evidence package passes the installed structural verifier and its supported local artifacts pass the byte-level audit while the claim remains `EXPLORATORY_SUPPORT`.
7. CI syntax contains separate dependent quality and e2e jobs with pinned Node and locked browser installation; no remote-pass claim is made locally.
8. `git diff --check`, protected-path inspection, and a clean exact-SHA replay pass before handoff.

## Known bounded gap

The protected upstream layout imports `next/font/google`, so a clean production build may require access to Google's font endpoint. Removing that network dependency would require an application change inside `src/app`, which is outside this pipeline-only branch. The limitation is documented rather than silently bypassed.
