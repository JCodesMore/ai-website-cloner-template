# Contributing

Thanks for your interest in improving the **AI Website Cloner Template**! This guide covers how to contribute to the template itself.

> **Note:** This repository is a *template*. If you just want to clone a website, don't open a PR here — click **Use this template** to make your own copy and work there (see the [README](README.md#quick-start)). Pull requests should improve the template: the `/clone-website` skill, support for the four documented agents, the scaffold, or the docs.

## Ways to contribute

- **Improve the `/clone-website` skill** — sharper extraction, better prompts, new behaviors to detect
- **Improve agent support** — fixes for Claude Code, Codex, Cursor, or OpenCode
- **Fix bugs** in the Next.js scaffold
- **Improve documentation** — the README, `AGENTS.md`, or the skill references

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

## Source-of-truth files

Project instructions live in `AGENTS.md`. The canonical cloning workflow lives in `.agents/skills/clone-website/` and is read directly by Codex, Cursor, and OpenCode. Claude Code enters through `.claude/commands/clone-website.md`, which must remain a thin bridge rather than a second workflow copy.

Edit the canonical skill and its references directly. There is no generation or synchronization step.

## Submitting a pull request

1. **Fork** the repo and create a branch off `master` (e.g. `fix/skill-hover-extraction` or `docs/clarify-setup`).
2. Make your focused change in the appropriate source-of-truth file.
3. Run `npm run check` and make sure it passes.
4. Write a clear commit message that describes the change. Prefixes such as `fix:`, `feat:`, or `docs:` are welcome but not required.
5. Open a PR against `master`, fill out the PR template, and link a relevant issue when one exists (for example, `Closes #123`).
6. Keep PRs focused — one logical change per PR is much easier to review and merge.

## Questions

Ask in the [Discord community](https://discord.gg/hrTSX5yTpB) — happy to help you get started.
