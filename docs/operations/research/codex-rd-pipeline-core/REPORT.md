# Research Evidence Report

## Supported

- **Headline claim:** `claim-codex-rd-pipeline-core-local-001` remains `EXPLORATORY_SUPPORT`. At base implementation commit `e6d89d95f1406f286ed54a9c8d7e827f9f6d7a85`, one local Windows x64 / Node.js 24.19.0 attempt recorded 46/46 unit tests, lint, route type generation, TypeScript, production build, and two Chromium smoke projects exiting successfully. The protected-path inspection returned no paths.
- **Structural verifier:** the scaffold passed the installed v1 structural verifier before population. The populated package is reverified after each bounded update. This establishes only the verifier's package-shape, field, ID, link, and selected status-gate checks.
- **Byte audit:** the external artifact is addressed by repository-relative locator and audited from the repository root with `--artifact-root .`. The audit result is a byte-existence/hash observation at read time and has `scientific_claim_effect: "NONE"`; the hashed artifact deliberately does not claim its own audit result.
- **Local smoke:** `desktop-chromium` and `mobile-chromium` each passed the generic production smoke suite. The suite checks document health, staged static assets, first-party resource failures, page/console errors, and horizontal overflow.
- **Chronology:** base engineering evidence belongs to implementation commit `e6d89d95f1406f286ed54a9c8d7e827f9f6d7a85`. Project and decision `created_at` use `2026-10-22T18:10:52+08:00`, the author timestamp returned by `git show -s --format=%aI 0520b945e0b270db65e89ad261e920c8b4aa892c` for the first repository publication of these records. It is not an experimental execution time.
- **Immutable Git range:** `origin/master` resolved to `ee3f5a2f31fd549b9593fa4f7cf6d2955ee593bb`; `git merge-base e6d89d95f1406f286ed54a9c8d7e827f9f6d7a85 origin/master` returned the same commit. Diff and protected-path evidence use `ee3f5a2f31fd549b9593fa4f7cf6d2955ee593bb...e6d89d95f1406f286ed54a9c8d7e827f9f6d7a85`.
- Source `source-codex-rd-pipeline-core-design-001`, protocol `experiment-codex-rd-pipeline-core-local-001`, attempt `attempt-codex-rd-pipeline-core-local-001`, evidence `evidence-codex-rd-pipeline-core-local-001`, and decision `decision-codex-rd-pipeline-core-local-001` are linked explicitly.

## Unsupported

- **Visual regression:** none; no screenshot baseline or visual comparison was run.
- **Pixel parity:** none; no pixel-diff baseline or threshold was defined.
- **Remote Linux CI:** not run; workflow configuration is not remote execution evidence.
- **Science and production reliability:** not proved. Local commands, structural verification, and byte equality do not prove scientific correctness, truthful provenance, immutability, reviewer independence, reproducibility, security remediation, or production reliability.
- The observed npm audit signal was 17 findings (3 moderate, 12 high, 2 critical). No remediation, exploitability, or causality conclusion is supported.
- Results do not extrapolate beyond the exact base commit, Windows x64 host, Node.js 24.19.0, and recorded command revisions.

## Blocked

- Final-commit closeout cannot be embedded in the artifact that must be hashed before the documentation commit exists. The exact final SHA replay is retained in the ignored Task 4 closeout report.
- The protected application imports `next/font/google`; a clean production build can require access to Google's font endpoint. Removing that dependency would cross the protected application boundary.
- `REMOTE_SINGLE_PASS` and `REMOTE_REPEATED_PASS` remain blocked until matching remote workflow runs exist.

## Refuted

- None.

## Next Decision

- After committing these records, replay lockfile restoration, `check`, desktop/mobile `test:e2e`, structural verification, byte audit, diff checking, exact-seven-entry checking, referential review, and protected-path inspection on the clean final SHA. Keep the claim exploratory; decide separately whether to obtain a matching remote Linux run.
