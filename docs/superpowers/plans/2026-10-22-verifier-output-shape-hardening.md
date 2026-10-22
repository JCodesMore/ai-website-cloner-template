# Verifier Output Shape Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development for this single bounded task. Follow test-driven-development, task review, and verification-before-completion.

**Goal:** Close the residual fail-closed gap found by the Codex R&D pipeline whole-branch re-review before integration.

**Architecture:** Validate the structural verifier's JSON shape before treating it as a structural fact, preserve primary process-failure metadata even when output is malformed, and make portable npm PATH-key matching platform-correct. Keep the existing artifact audit composition and evidence package unchanged.

**Tech Stack:** Node.js 24.19.0 ESM, `node:test`, Python research verifier adapter

**Spec:** `docs/superpowers/specs/2026-10-22-codex-rd-pipeline-core-design.md`

## Global constraints

- Work only in the managed `codex/rd-pipeline-core` worktree.
- Do not modify protected application/Techmeme/docs-research paths, the exact-seven evidence package, or its external governed artifact.
- Do not perform global installs, persistent PATH/Git changes, snapshots, push, PR, or remote CI.
- Preserve argv arrays, `shell: false`, audit outer exits 0/1/2, and artifact short-circuit on every structural failure.
- Use strict RED→GREEN tests and commit only the bounded hardening files.

## Review focus

- JSON parse success is not shape validity: the root must be a non-array object, `valid` must be boolean, and `errors` must be an array.
- A signal or numeric nonzero exit remains the primary `failure_kind` even if stdout is malformed; metadata must never be replaced by a generic adapter exception.
- Status-0 malformed output is `invalid_output`, is never PASS, and never permits artifact hashing.
- Unexpected adapter exceptions still emit the stable verifier step/process fact shape.
- PATH key matching is case-insensitive only on Windows; POSIX treats `Path` and `PATH` as different variables.

---

### Task 1: Fail-closed verifier shape and platform-correct PATH

**Files:**

- Modify: `scripts/lib/codex-pipeline.mjs`
- Modify: `scripts/codex-pipeline.test.mjs`
- Modify: `docs/operations/CODEX_RD_PIPELINE.md` only if behavior wording needs correction

**Interfaces:**

- Keep `verifyEvidenceStructure()` and `runEvidenceAudit()` public shapes compatible while making every returned structure fact contain `step`, `failure_kind`, `signal`, `exit_code`, `status`, `valid`, and `errors`.
- Extend the package-manager environment seam with platform-correct PATH key/delimiter behavior without mutating caller state.

- [ ] Write failing focused tests for JSON `null`, array roots, non-boolean `valid`, non-array `errors`, malformed shape under signal and nonzero exit, generic verifier-adapter rejection, artifact short-circuit, POSIX `Path` without `PATH`, and Windows mixed-case PATH reuse.
- [ ] Run the focused suite and record the expected RED results against commit `85e55768123d9f5146d6b1d05f2a22ea671d8d8a`.
- [ ] Implement a small verifier-payload validator. For execution failures, preserve `signal`/`exit` as primary and add an output-shape diagnostic; for status 0, classify invalid shape as `invalid_output`.
- [ ] Normalize `runEvidenceAudit()`'s unexpected verifier exception fact to the stable metadata shape and keep artifacts `NOT_RUN` with outer exit 1.
- [ ] Make PATH lookup case-insensitive on Windows and exact `PATH` on POSIX, using the matching platform delimiter and preserving unrelated variables.
- [ ] Run focused GREEN, the full control-plane suite, PATH-empty portable npm regression, `check`, desktop/mobile E2E, evidence structural verify and artifact audit, `git diff --check`, exact-seven/hash/link checks, protected-path checks, port/process cleanup, and a clean exact-SHA replay.
- [ ] Commit the bounded fix and write the persistent task report for independent review.
