# AI Website Cloner Template

<a href="https://github.com/JCodesMore/ai-website-cloner-template/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a> <a href="https://github.com/JCodesMore/ai-website-cloner-template/stargazers"><img src="https://img.shields.io/github/stars/JCodesMore/ai-website-cloner-template?style=flat" alt="Stars" /></a> <a href="https://discord.gg/hrTSX5yTpB"><img src="https://img.shields.io/discord/1400896964597383279?label=discord" alt="Discord" /></a>

A reusable template for reverse-engineering any website into a clean, modern Next.js codebase using AI coding agents. 

**Recommended: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with Opus 4.8 for best results** — but works with a variety of AI coding agents.

Point it at a URL, run `/clone-website`, and your AI agent will inspect the site, extract design tokens and assets, write component specs, and dispatch parallel builders to reconstruct every section.

## Demo

[![Watch the demo](docs/design-references/comparison.png)](https://youtu.be/O669pVZ_qr0)

> Click the image above to watch the full demo on YouTube.

## Quick Start

> **Important:** Start by making your own copy with GitHub's **Use this template** button. Do not clone this template repository directly for your website project, and do not open pull requests here with your generated website.

1. **Create your own repository from this template**

   On the GitHub page for this project, click **Use this template**, then click **Create a new repository**.

   Give your new repository a name, choose whether it should be public or private, then click **Create repository**. If GitHub shows an **Include all branches** option, you can leave it off.

   This gives you your own separate project to work in, so your website changes stay in your account instead of coming back to the main template.

2. **Open your new repository on your computer**

   After GitHub creates your copy, open that new repository. Click **Code** and open or clone your new repository with your preferred coding tool.

   If you use the terminal, the command will look like this:

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-NEW-REPOSITORY.git
   cd YOUR-NEW-REPOSITORY
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start your AI agent** — Claude Code recommended:
   ```bash
   claude --chrome
   ```
5. **Run the skill**:
   ```
   /clone-website <target-url1> [<target-url2> ...]
   ```
6. **Customize** (optional) — after the base clone is built, modify as needed

> Using a different agent? Open `AGENTS.md` for project instructions — most agents pick it up automatically.

## Supported Platforms

| Agent                                                         | Status                     |
| ------------------------------------------------------------- | -------------------------- |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | **Recommended** — Opus 4.8 |
| [Codex CLI](https://github.com/openai/codex)                  | Supported                  |
| [OpenCode](https://opencode.ai/)                              | Supported                  |
| [GitHub Copilot](https://github.com/features/copilot)         | Supported                  |
| [Cursor](https://cursor.com/)                                 | Supported                  |
| [Windsurf](https://codeium.com/windsurf)                      | Supported                  |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli)     | Supported                  |
| [Cline](https://github.com/cline/cline)                       | Supported                  |
| [Roo Code](https://github.com/RooCodeInc/Roo-Code)            | Supported                  |
| [Continue](https://continue.dev/)                             | Supported                  |
| [Amazon Q](https://aws.amazon.com/q/developer/)               | Supported                  |
| [Augment Code](https://www.augmentcode.com/)                  | Supported                  |
| [Aider](https://aider.chat/)                                  | Supported                  |

## Prerequisites

- [Node.js](https://nodejs.org/) 24+
- An AI coding agent (see [Supported Platforms](#supported-platforms))
- **Optional (native sync tools):** [NASM](https://www.nasm.us/) + MSVC Build Tools — see [docs/research/ASSEMBLY.md](docs/research/ASSEMBLY.md)

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript strict
- **shadcn/ui** — Radix primitives + Tailwind CSS v4
- **Tailwind CSS v4** — oklch design tokens
- **Lucide React** — default icons (replaced by extracted SVGs during cloning)
- **WebAssembly** — `cn()` class merge and homepage copy (`asm/wasm/*.wat`)
- **x86-64 assembly** — Windows sync CLIs (`asm/native/*.asm` → `bin/*.exe`)

## How It Works

The `/clone-website` skill runs a multi-phase pipeline:

1. **Reconnaissance** — screenshots, design token extraction, interaction sweep (scroll, click, hover, responsive)
2. **Foundation** — updates fonts, colors, globals, downloads all assets
3. **Component Specs** — writes detailed spec files (`docs/research/components/`) with exact computed CSS values, states, behaviors, and content
4. **Parallel Build** — dispatches builder agents in git worktrees, one per section/component
5. **Assembly & QA** — merges worktrees, wires up the page, runs visual diff against the original

Each builder agent receives the full component specification inline — exact `getComputedStyle()` values, interaction models, multi-state content, responsive breakpoints, and asset paths. No guessing.

## Use Cases

- **Platform migration** — rebuild a site you own from WordPress/Webflow/Squarespace into a modern Next.js codebase
- **Lost source code** — your site is live but the repo is gone, the developer left, or the stack is legacy. Get the code back in a modern format
- **Learning** — deconstruct how production sites achieve specific layouts, animations, and responsive behavior by working with real code

## Not Intended For

- **Phishing or impersonation** — this project must not be used for deceptive purposes, impersonation, or any activity that breaks the law.
- **Passing off someone's design as your own** — logos, brand assets, and original copy belong to their owners.
- **Violating terms of service** — some sites explicitly prohibit scraping or reproduction. Check first.

## Project Structure

```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # Extracted SVG icons
  lib/
    utils.ts        # cn() host ABI → WebAssembly
    page-message.ts # Homepage copy from WASM
    generated/      # Emitted WASM byte arrays
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
asm/
  wasm/             # Hand-written .wat modules
  native/           # Windows x86-64 NASM sources
bin/                # Built sync-skills.exe / sync-agent-rules.exe
public/
  wasm/             # Compiled .wasm binaries
  images/           # Downloaded images from target
  videos/           # Downloaded videos from target
  seo/              # Favicons, OG images
docs/
  research/         # Extraction output, component specs, ASSEMBLY.md
  design-references/ # Screenshots
scripts/
  build-wasm.mjs       # Compile .wat → .wasm + TS
  build-asm.ps1        # Assemble/link native PE tools
  sync-agent-rules.sh  # Format-aware AGENTS.md sync (reference)
  sync-skills.mjs      # Format-aware skill sync (reference)
AGENTS.md           # Agent instructions (single source of truth)
CLAUDE.md           # Claude Code config (imports AGENTS.md)
GEMINI.md           # Gemini CLI config (imports AGENTS.md)
```

## Commands

```bash
npm run dev           # Start dev server
npm run build:wasm    # Compile WebAssembly modules
npm run build:asm     # Assemble Windows sync CLIs (NASM + MSVC)
npm run build         # Production Next.js build (runs build:wasm first)
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm run check         # Run lint + typecheck + build
npm run sync:skills   # Native PE: propagate SKILL.md
npm run sync:rules    # Native PE: propagate AGENTS.md
```

### If using docker

```bash
docker compose up app --build # build and run the app
docker compose up dev --build # run the app in dev mode on port 3001
```

## Updating for Other Platforms

Two source-of-truth files power all platform support. Edit the source, then run the sync script:

| What                   | Source of truth                         | Sync command                    |
| ---------------------- | --------------------------------------- | ------------------------------- |
| Project instructions   | `AGENTS.md`                             | `npm run sync:rules`            |
| `/clone-website` skill | `.claude/skills/clone-website/SKILL.md` | `npm run sync:skills`           |

`sync:skills` / `sync:rules` run WebAssembly text transforms via thin Node I/O hosts. PE byte-copy tools: `sync:skills:pe` / `sync:rules:pe`. See [docs/research/ASSEMBLY.md](docs/research/ASSEMBLY.md).


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JCodesMore/ai-website-cloner-template&type=Date)](https://star-history.com/#JCodesMore/ai-website-cloner-template&Date)

## License

MIT
