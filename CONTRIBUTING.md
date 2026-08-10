# Contributing

Thanks for your interest in improving the **AI Website Cloner Template**! This guide covers how to contribute to the template itself.

> **Note:** This repository is a *template*. If you just want to clone a website, don't open a PR here — click **Use this template** to make your own copy and work there (see the [README](README.md#quick-start)). Pull requests should improve the template: the `/clone-website` skill, agent platform support, the scaffold, or the docs.

## Ways to contribute

- **Improve the `/clone-website` skill** — sharper extraction, better prompts, new behaviors to detect
- **Add or fix agent platform support** — new coding agents, or fixes to existing generated configs
- **Fix bugs** in the Next.js scaffold or the sync scripts
- **Improve documentation** — the README, `AGENTS.md`, or the inspection guides under `docs/research/`

Browse the [open issues](https://github.com/JCodesMore/ai-website-cloner-template/issues) for something to pick up. For substantial or potentially breaking changes, consider opening an issue first so we can align on the approach before significant work begins.

## Development setup

**Prerequisites:** [Node.js](https://nodejs.org/) 24+.

```bash
git clone https://github.com/YOUR-USERNAME/ai-website-cloner-template.git
cd ai-website-cloner-template
npm ci
```

Before opening a PR, make sure the project is green:

```bash
npm run check   # lint + typecheck + build
```

## Source-of-truth files & the sync scripts

This is the most important thing to know. Two source files generate the platform-specific project instructions and `/clone-website` skill copies. Edit the source files rather than their generated copies.

| What                   | Edit this (source of truth)             | Then run                           |
| ---------------------- | --------------------------------------- | ---------------------------------- |
| Project instructions   | `AGENTS.md`                             | `bash scripts/sync-agent-rules.sh` |
| `/clone-website` skill | `.claude/skills/clone-website/SKILL.md` | `node scripts/sync-skills.mjs`     |

After editing a source file, run the matching sync command and commit the regenerated files along with your change. CI verifies that the generated files are in sync — if you forget to regenerate, CI will fail with a reminder.

## Submitting a pull request

1. **Fork** the repo and create a branch off `master` (e.g. `fix/skill-hover-extraction` or `docs/clarify-setup`).
2. Make your change. If you touched a source-of-truth file, **run the relevant sync script** (see above).
3. Run `npm run check` and make sure it passes.
4. Write a clear commit message that describes the change. Prefixes such as `fix:`, `feat:`, or `docs:` are welcome but not required.
5. Open a PR against `master`, fill out the PR template, and link a relevant issue when one exists (for example, `Closes #123`).
6. Keep PRs focused — one logical change per PR is much easier to review and merge.

## Questions

Ask in the [Discord community](https://discord.gg/hrTSX5yTpB) — happy to help you get started.
