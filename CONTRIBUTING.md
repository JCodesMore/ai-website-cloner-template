# Contributing to AI Website Cloner Template

Thank you for your interest in contributing! This project is a template used by thousands of developers to reverse-engineer websites into clean Next.js codebases using AI coding agents. Contributions that improve the template, agent skills, documentation, or platform support are very welcome.

## Table of Contents

- [Before You Start](#before-you-start)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure Overview](#project-structure-overview)
- [Making Changes](#making-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code Style](#code-style)
- [Important: Do Not Submit Generated Websites](#important-do-not-submit-generated-websites)

---

## Before You Start

- Check the [open issues](https://github.com/JCodesMore/ai-website-cloner-template/issues) to see if your idea or bug is already tracked.
- If you plan to work on something significant, leave a comment on the relevant issue first so maintainers can confirm it's the right direction before you invest time in it.
- Issue creation is currently restricted — please use existing issues or open a PR directly with a clear description.

---

## Ways to Contribute

### Bug Fixes
If you find a bug, look for an existing issue or open a PR with a clear description of the problem and your fix. Include steps to reproduce if applicable.

### New Agent Platform Support
The template currently supports 13 AI coding agents. To add support for a new one:

1. Edit the single source-of-truth files:
   - `AGENTS.md` — project-wide agent instructions
   - `.claude/skills/clone-website/SKILL.md` — the `/clone-website` skill definition
2. Run the sync scripts to regenerate all platform-specific files:
   ```bash
   bash scripts/sync-agent-rules.sh
   node scripts/sync-skills.mjs
   ```
3. Add the new agent to the **Supported Platforms** table in `README.md`.
4. Open a PR describing which agent you added and how you tested it.

### Improving the `/clone-website` Skill
The skill lives in `.claude/skills/clone-website/SKILL.md` and is the core of this project. Improvements to any pipeline phase (Reconnaissance, Foundation, Component Specs, Parallel Build, Assembly & QA) are welcome. After editing, run `node scripts/sync-skills.mjs` to sync changes to all platforms.

### Documentation
Clear docs lower the barrier for everyone. Good documentation PRs include:
- Fixing unclear or outdated sections in `README.md` or `AGENTS.md`
- Adding examples or clarifying agent-specific setup steps
- Improving inline comments in scripts

### Dependency / Tooling Updates
If you're updating `package.json` dependencies, make sure `npm run check` passes (lint + typecheck + build) before submitting.

---

## Development Setup

**Prerequisites:**
- [Node.js](https://nodejs.org/) 24+
- An AI coding agent (Claude Code recommended — see [README](./README.md#supported-platforms))

**Steps:**

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/YOUR-USERNAME/ai-website-cloner-template.git
cd ai-website-cloner-template

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

**Available commands:**

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run lint       # ESLint check
npm run typecheck  # TypeScript check
npm run check      # Run lint + typecheck + build together
```

---

## Project Structure Overview

```
.claude/skills/clone-website/   # Source of truth for the /clone-website skill
.codex/ .cursor/ .windsurf/ ... # Platform-specific copies (auto-generated — do not edit directly)
scripts/
  sync-agent-rules.sh           # Regenerates agent instruction files from AGENTS.md
  sync-skills.mjs               # Regenerates /clone-website skill for all platforms
AGENTS.md                       # Source of truth for agent project instructions
src/
  app/                          # Next.js App Router routes
  components/ui/                # shadcn/ui primitives
  lib/utils.ts                  # cn() utility
docs/research/                  # Component specs written during cloning (gitignored output)
```

> **Key rule:** Never edit platform-specific agent files (`.cursor/`, `.windsurf/`, `.codex/`, etc.) directly. Always edit the source files and run the sync scripts.

---

## Making Changes

1. Create a new branch from `master`:
   ```bash
   git checkout -b your-branch-name
   ```
2. Make your changes.
3. If you edited `AGENTS.md` or the skill, run the sync scripts:
   ```bash
   bash scripts/sync-agent-rules.sh
   node scripts/sync-skills.mjs
   ```
4. Run the full check before committing:
   ```bash
   npm run check
   ```
5. Commit with a clear message describing what changed and why.

---

## Submitting a Pull Request

- Keep PRs focused — one change per PR is easiest to review.
- Write a clear PR description: what you changed, why, and how to verify it.
- If your PR fixes an open issue, reference it in the description (e.g. `Fixes #22`).
- Make sure `npm run check` passes before opening the PR.
- The maintainer may request changes — please respond within a reasonable time.

---

## Code Style

- **TypeScript strict** — no `any` unless absolutely unavoidable.
- **Tailwind CSS v4** with oklch design tokens — follow existing patterns in `src/`.
- **shadcn/ui** components from `src/components/ui/` — do not re-implement primitives.
- ESLint is configured — run `npm run lint` and fix all warnings before submitting.

---

## Important: Do Not Submit Generated Websites

This is a **template repository**. Please do not open pull requests that contain websites you cloned using this tool. Generated output (component files, downloaded assets, `docs/research/` contents, etc.) belongs in your own forked repository, not here.

PRs containing generated website output will be closed without review.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
