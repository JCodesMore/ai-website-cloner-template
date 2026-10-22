# Codex Development and Research Pipeline Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Each behavior change follows test-driven-development, each task receives an independent review, and branch-wide completion requires verification-before-completion.

**Goal:** Deliver a generic, clean-commit-verifiable Codex development and research pipeline without touching the user's protected Techmeme work.

**Architecture:** Add a Node 24 control plane with portable npm and installed-Skill adapters, a fail-closed local evidence-artifact hash audit, and a Playwright Chromium lane against Next.js standalone output. Keep repository verification self-contained after `npm ci`, and keep scientific, visual, pixel, and remote-CI claims explicitly separate.

**Tech Stack:** Node.js 24.19.0 ESM, `node:test`, Next.js 16.3.5 standalone output, TypeScript strict, Playwright Chromium, Python Skill adapters, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-10-22-codex-rd-pipeline-core-design.md`

## Global constraints

- Work only in `C:\Users\12\.codex\worktrees\codex-rd-pipeline-core\前端clone` on `codex/rd-pipeline-core`.
- Do not modify `src/app`, `src/components/techmeme`, `src/types/techmeme.ts`, `public/techmeme`, `scripts/download-techmeme-assets.mjs`, `docs/design-references/techmeme`, or `docs/research`.
- Do not copy Techmeme-specific smoke assertions or visual snapshots into the generic core.
- Do not edit or overwrite the sealed first-phase evidence package in the original dirty checkout.
- Do not mutate persistent PATH, install global software, update snapshots, push, open a pull request, or trigger remote CI.
- Use argv arrays and `shell: false` for repository-owned process launches.
- Keep structural verification, local byte equality, engineering smoke, scientific support, and production evidence as separate claims.
- Every task must end with a focused test run and a local commit; no task starts while another implementer is active.

## Review focus

- Explicit `CODEX_NODE_HOME` must fail closed if incomplete and must not silently fall back.
- Distribution discovery must use the real platform and architecture rather than hard-coded x64.
- Paths containing spaces and non-ASCII characters must remain single argv entries.
- Spawn errors, signals, and child exit codes must remain distinguishable.
- Artifact locators must not escape the declared root, including through symlinks.
- The standalone launcher must remove stale generated destinations before copying current assets.
- Browser readiness must not reuse an existing server, and CI must not update or require visual baselines.
- Documentation must not claim remote success or upgrade the research claim.
- `quality` is exactly lint → `next typegen` → `tsc --noEmit` → build; `verify` adds control-plane tests first; `check` aliases `verify`; `test:e2e` always performs its own new build.
- The protected `next/font/google` build-time network dependency must be reported as a bounded gap, not edited around.

---

### Task 1: Repository control plane and portable package manager

**Files:**

- Create: `scripts/lib/codex-pipeline.mjs`
- Create: `scripts/codex-pipeline.mjs`
- Create: `scripts/codex-npm.mjs`
- Create: `scripts/codex-pipeline.test.mjs`
- Modify: `package.json`
- Modify: `.nvmrc`
- Modify: `Dockerfile`
- Modify: `Dockerfile.dev`

**Interfaces:**

- Export `resolvePackageManager`, `packageManagerInvocation`, `runPackageManager`, `resolveToolchain`, Python/Skill resolvers, `buildDoctorReport`, `qualitySteps`, `runSteps`, argument builders, prerequisite selection, and `parseCli`.
- Provide CLI commands `doctor`, `quality`, `verify`, `research:init`, `research:verify`, `evidence:init`, and `evidence:verify`.
- Provide npm scripts `pipeline:doctor`, `pipeline:test`, `pipeline:quality`, `codex:npm`, `research:day`, `research:verify`, `evidence:init`, `evidence:verify`, and make `check` call `verify`.

- [ ] Write failing `node:test` cases for configured/default portable npm resolution, Windows/Linux/macOS x64/arm64 naming, unsupported combinations, incomplete payloads, non-ASCII argv, local binary discovery, exact-version warnings, `READY`/`READY_WITH_GAPS`/`BLOCKED`, Python precedence, Skill-root precedence, quality-step order, daily/evidence argument validation, CLI parsing, prerequisite isolation, spawn errors, signals, and nonzero exits.
- [ ] Run `node --test scripts/codex-pipeline.test.mjs` and capture the expected missing-module/export failures in the task report.
- [ ] Implement the smallest dependency-injectable library and both CLIs. Do not use shell interpolation or nested npm for quality steps; run `next typegen` before `tsc`.
- [ ] Pin `.nvmrc`, both Dockerfiles, and CI-facing documentation to Node 24.19.0; make the development Dockerfile use the lockfile with `npm ci`.
- [ ] Re-run `node --test scripts/codex-pipeline.test.mjs` until green.
- [ ] Run `node scripts/codex-pipeline.mjs doctor --json` and compare every reported prerequisite with a direct local probe.
- [ ] Run `node scripts/codex-pipeline.mjs verify` and confirm unit tests, lint, typecheck, and build execute in order.
- [ ] Run `git diff --check`, inspect protected-path status, and commit only Task 1 files.

### Task 2: Read-only research artifact integrity audit

**Files:**

- Create: `scripts/lib/evidence-artifact-audit.mjs`
- Modify: `scripts/lib/codex-pipeline.mjs`
- Modify: `scripts/codex-pipeline.mjs`
- Modify: `scripts/codex-pipeline.test.mjs`
- Modify: `package.json`

**Interfaces:**

- Export `auditEvidenceArtifacts(options)` from the dedicated audit module with deterministic result records and no writes.
- Add `evidence:audit <package> --artifact-root <directory>`.
- Add npm alias `evidence:audit`.
- Require the installed structural verifier to succeed before artifact dereferencing.

- [ ] Build temporary seven-file package fixtures and write failing tests for matching hashes, hash mismatch, missing file, directory locator, absolute locator, URI locator, `..` escape, symlink escape where supported, malformed JSONL, duplicate evidence IDs, and deterministic ordering.
- [ ] Write failing CLI/parser and prerequisite tests for the required `--artifact-root` option and structural-verifier short circuit.
- [ ] Run the focused test names and capture the expected failures.
- [ ] Implement containment using resolved and real paths, regular-file checks, streaming SHA-256, deterministic JSON with separate `structure`/`artifacts` facts and `scientific_claim_effect: "NONE"`, and 0/1/2 exit semantics without modifying package or artifact metadata.
- [ ] Re-run the full control-plane unit suite.
- [ ] Run a real scaffold/verify/audit/tamper smoke in a temporary directory; confirm tampering fails and neither verifier nor audit rewrites any file.
- [ ] Run `git diff --check`, inspect protected-path status, and commit only Task 2 files.

### Task 3: Generic production Chromium smoke and Linux CI lane

**Files:**

- Create: `scripts/lib/playwright-server.mjs`
- Create: `scripts/start-playwright-server.mjs`
- Create: `playwright.config.ts`
- Create: `e2e/template.smoke.spec.ts`
- Modify: `scripts/codex-pipeline.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Export `resolveE2EPort`, `prepareStandaloneAssets`, and the minimal server-environment/start seam needed to avoid orphaned child processes.
- Add `start:e2e` and `test:e2e`; add exact `@playwright/test` development dependency.
- CI provides a `quality` job and a dependent Linux `e2e` job using Node 24.19.0 on `ubuntu-24.04` with official actions pinned to verified commit SHAs.

- [ ] Restore the exact Playwright development dependency through the portable npm wrapper; do not install globally.
- [ ] Write failing unit tests for valid/default/invalid ports, absent standalone output, fresh public/static copy, removal of stale generated files, forced loopback endpoint, and `reuseExistingServer: false`.
- [ ] Run the focused tests and capture the expected failures.
- [ ] Implement the launcher and config using the current Next.js 16.3.5 standalone contract documented under `node_modules/next/dist/docs`. `test:e2e` must build afresh before staging; direct `start:e2e` must not claim freshness.
- [ ] Add generic smoke assertions for HTTP 200, visible `main`, nonempty body, at least one served `/_next/static/` asset, page/console errors, first-party document/script/style/font/image/media failures, and horizontal overflow at desktop and mobile sizes. Use `load`, not `networkidle`, and do not police external origins or fetch/XHR.
- [ ] Update CI while preserving the verified v7 releases of `actions/checkout` and `actions/setup-node` through exact commit pins; install Chromium through `node node_modules/@playwright/test/cli.js install --with-deps chromium`, disable Playwright retries, and upload failure artifacts only on failure.
- [ ] Install local Chromium through the locked CLI, run `npm run test:e2e`, and confirm a fresh production build is used with no server reuse.
- [ ] Re-run control-plane tests and `npm run check`.
- [ ] Run `git diff --check`, inspect protected-path status, and commit only Task 3 files.

### Task 4: Operations guide and bounded evidence package

**Files:**

- Create: `docs/operations/CODEX_RD_PIPELINE.md`
- Create: `docs/operations/evidence/2026-10-22-codex-rd-pipeline-core-verification.json`
- Create: `docs/operations/research/codex-rd-pipeline-core/PROJECT.json`
- Create: `docs/operations/research/codex-rd-pipeline-core/CLAIMS.json`
- Create: `docs/operations/research/codex-rd-pipeline-core/SOURCES.jsonl`
- Create: `docs/operations/research/codex-rd-pipeline-core/EVIDENCE.jsonl`
- Create: `docs/operations/research/codex-rd-pipeline-core/EXPERIMENTS.jsonl`
- Create: `docs/operations/research/codex-rd-pipeline-core/DECISIONS.jsonl`
- Create: `docs/operations/research/codex-rd-pipeline-core/REPORT.md`

**Interfaces:**

- Document direct-Node and npm aliases, toolchain discovery, browser boundaries, research package boundaries, recovery, and maturity states.
- Produce exactly one new v1 seven-file package whose external local artifact is below `docs/operations/evidence/`.
- Keep the headline claim at `EXPLORATORY_SUPPORT`.

- [ ] Scaffold the new package through `evidence:init`; verify it before populating records and confirm no existing package was overwritten.
- [ ] Capture machine-readable local outputs for tool versions, unit tests, lint, typecheck, build, browser smoke, structural verification, artifact audit, `git diff --check`, and protected-path inspection. Label working-tree versus exact-commit evidence.
- [ ] Populate claim, source, protocol/attempt, evidence, decision, and report links according to the v1 package contract. State unsupported scientific, visual, pixel, production, and remote-CI conclusions.
- [ ] Hash the external artifact, record the lowercase SHA-256, and run both `evidence:verify` and `evidence:audit`.
- [ ] Write the operations guide so every advertised command matches actual behavior and every optional dependency is named.
- [ ] Run `npm run check`, `npm run test:e2e`, structural verification, artifact audit, `git diff --check`, and protected-path inspection.
- [ ] Commit only Task 4 documentation and evidence files.

## Branch-wide closeout gate

- [ ] Confirm the worktree is clean and record `git rev-parse HEAD`.
- [ ] Re-run `node scripts/codex-npm.mjs ci` from the lockfile, then `node scripts/codex-npm.mjs run check` and `node scripts/codex-npm.mjs run test:e2e` on that exact SHA.
- [ ] Re-run structural evidence verification, artifact audit, `git diff --check`, and protected-path inspection.
- [ ] Request a whole-branch independent code review against `origin/master`; resolve all Critical and Important findings with focused tests and review each fix.
- [ ] Repeat the exact-SHA verification after any review fix.
- [ ] Report at most `CLEAN_COMMIT_VERIFIED`; present local merge, push/PR, or keep-branch options without taking an external action automatically.
