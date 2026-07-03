# AI Website Cloner Template

<a href="https://github.com/JCodesMore/ai-website-cloner-template/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a> <a href="https://github.com/JCodesMore/ai-website-cloner-template/stargazers"><img src="https://img.shields.io/github/stars/JCodesMore/ai-website-cloner-template?style=flat" alt="Stars" /></a> <a href="https://discord.gg/hrTSX5yTpB"><img src="https://img.shields.io/discord/1400896964597383279?label=discord" alt="Discord" /></a>

A reusable template for reverse-engineering any website into a clean, modern Next.js codebase using AI coding agents. 

**Recommended: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with Opus 4.7 for best results** — but works with a variety of AI coding agents.

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
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | **Recommended** — Opus 4.7 |
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
| [Kiro](https://kiro.dev/)                                     | Supported                  |
| [Augment Code](https://www.augmentcode.com/)                  | Supported                  |
| [Aider](https://aider.chat/)                                  | Supported                  |

## Using Kiro

[Kiro](https://kiro.dev/) is an agentic IDE (with a companion CLI) built around **steering**, **specs**, and **skills**. This template ships first-class Kiro support: Kiro reads `AGENTS.md` automatically, a steering pointer keeps the project rules in view, and the `/clone-website` skill is available as a Kiro skill.

### Install Kiro

1. Download Kiro for your operating system (Windows, macOS, or Linux) from [kiro.dev](https://kiro.dev/).
2. Open the downloaded file and follow the installer for your platform.
3. Launch Kiro and sign in.

> Prefer the terminal? The Kiro CLI (`kiro-cli`) uses the same `.kiro/` configuration described below.

### Open the project in Kiro

After creating your repository from this template (see [Quick Start](#quick-start)) and cloning it locally, open the project folder in Kiro (**File → Open Folder**, or `kiro-cli chat` from the project root). Kiro loads the workspace configuration from `.kiro/` and the project instructions from `AGENTS.md` automatically.

### Required setup

1. **Install dependencies:** `npm install` (Node.js 24+ — see [Prerequisites](#prerequisites)).
2. **Add a browser automation MCP server.** The `/clone-website` skill inspects live sites and cannot run without one. Configure a browser MCP server (Chrome MCP, Playwright MCP, Puppeteer MCP, or Browserbase MCP) in `.kiro/settings/mcp.json` for this workspace, or globally in `~/.kiro/settings/mcp.json`. Chrome MCP is preferred when multiple are available.

   ```json
   {
     "mcpServers": {
       "chrome": {
         "command": "npx",
         "args": ["-y", "your-browser-mcp-server"]
       }
     }
   }
   ```

   Replace `your-browser-mcp-server` with the package for the browser MCP you use. The CLI equivalent is `kiro-cli mcp add`.

### Recommended settings

- **Model:** use a strong model for extraction and code generation. In the CLI: `kiro-cli settings chat.defaultModel "<model-id>"`; in the IDE, pick the model from the chat panel.
- **Tool trust:** the clone pipeline reads, writes, and runs `npm`/`git` frequently. Auto-approving read/write/shell and your browser MCP avoids repeated prompts — see Kiro's trust configuration (agent `allowedTools`, or `kiro-cli chat --trust-tools=...`). Grant only what you're comfortable with.
- **Keep steering lean:** the provided `.kiro/steering/project.md` is a thin pointer to `AGENTS.md`; leave detailed rules in `AGENTS.md` so context stays small.

### Using the provided Kiro resources

- **`.kiro/steering/project.md`** — an always-included steering pointer to `AGENTS.md`, the single source of truth for project conventions (tech stack, code style, structure).
- **`.kiro/skills/clone-website/SKILL.md`** — the full `/clone-website` pipeline as a Kiro skill. Ask Kiro to clone a site (for example, "clone https://example.com") and it loads the skill on demand, or invoke it directly from the chat.

Both files are generated/maintained from the same sources as every other platform — see [Updating for Other Platforms](#updating-for-other-platforms).

### Example workflows

**Clone a single site**

1. Open the project in Kiro with a browser MCP configured.
2. In chat: `/clone-website https://example.com` (or "clone https://example.com").
3. Kiro runs reconnaissance, builds the foundation, writes component specs, dispatches builders, and assembles the page.
4. Run `npm run dev` to preview and `npm run check` to validate.

**Clone multiple sites at once**

```
/clone-website https://site-one.com https://site-two.com
```

Each site's extraction artifacts are kept isolated under `docs/research/<hostname>/`.

**Customize after cloning**

Once the base clone builds, ask Kiro to adjust content, colors, or layout — the steering rules and `AGENTS.md` keep changes consistent with the project's conventions.

### Troubleshooting

- **Skill doesn't trigger:** confirm `.kiro/skills/clone-website/SKILL.md` exists. Regenerate it with `node scripts/sync-skills.mjs`.
- **"Browser automation is required":** no browser MCP server is reachable. Add one under `.kiro/settings/mcp.json` (see [Required setup](#required-setup)) and reload the workspace.
- **Project rules ignored:** ensure `AGENTS.md` is at the workspace root and `.kiro/steering/project.md` is present. In the CLI, `/context show` lists the loaded steering files.
- **Build fails:** run `npm install` and verify Node.js 24+ (`node --version`), then `npm run check`.

## Prerequisites

- [Node.js](https://nodejs.org/) 24+
- An AI coding agent (see [Supported Platforms](#supported-platforms))

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript strict
- **shadcn/ui** — Radix primitives + Tailwind CSS v4
- **Tailwind CSS v4** — oklch design tokens
- **Lucide React** — default icons (replaced by extracted SVGs during cloning)

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
  lib/utils.ts      # cn() utility
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/           # Downloaded images from target
  videos/           # Downloaded videos from target
  seo/              # Favicons, OG images
docs/
  research/         # Extraction output & component specs
  design-references/ # Screenshots
scripts/
  sync-agent-rules.sh  # Regenerate agent instruction files
  sync-skills.mjs      # Regenerate /clone-website for all platforms
AGENTS.md           # Agent instructions (single source of truth)
CLAUDE.md           # Claude Code config (imports AGENTS.md)
GEMINI.md           # Gemini CLI config (imports AGENTS.md)
.kiro/              # Kiro steering pointer + /clone-website skill
```

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint check
npm run typecheck # TypeScript check
npm run check  # Run lint + typecheck + build
```

### If using docker

```bash
docker compose up app --build # build and run the app
docker compose up dev --build # run the app in dev mode on port 3001
```

## Updating for Other Platforms

Two source-of-truth files power all platform support. Edit the source, then run the sync script:

| What                   | Source of truth                         | Sync command                       |
| ---------------------- | --------------------------------------- | ---------------------------------- |
| Project instructions   | `AGENTS.md`                             | `bash scripts/sync-agent-rules.sh` |
| `/clone-website` skill | `.claude/skills/clone-website/SKILL.md` | `node scripts/sync-skills.mjs`     |

Each script regenerates the platform-specific copies automatically. Agents that read the source files natively need no regeneration.


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JCodesMore/ai-website-cloner-template&type=Date)](https://star-history.com/#JCodesMore/ai-website-cloner-template&Date)

## License

MIT
