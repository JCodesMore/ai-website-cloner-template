<div align="center">

# AI Website Cloner Template

### Clone any website with one command

Give your AI coding agent a URL and watch it recreate the website as a clean Next.js app.

**Best results with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) + Opus 5. Works with Codex, Cursor, Gemini, and more.**

[![Use this template](https://img.shields.io/badge/Use_this_template-Create_your_copy-2ea44f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JCodesMore/ai-website-cloner-template/generate) [![Discord](https://img.shields.io/badge/Join_the_community-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/hrTSX5yTpB)

[Quick Start](#quick-start) · [Watch Demo](#demo) · [Supported Platforms](#supported-platforms)

<a href="https://github.com/JCodesMore/ai-website-cloner-template/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a> <a href="https://github.com/JCodesMore/ai-website-cloner-template"><img src="https://img.shields.io/github/stars/JCodesMore/ai-website-cloner-template?style=flat" alt="Stars" /></a> <img src="https://img.shields.io/endpoint?url=https://gittokens.rsamf.com/badge/JCodesMore/ai-website-cloner-template" alt="tokens" />

  <a href="https://trendshift.io/repositories/24302?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-24302" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/24302" alt="JCodesMore%2Fai-website-cloner-template | Trendshift" width="250" height="55" /></a> <a href="https://www.star-history.com/jcodesmore/ai-website-cloner-template/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/badge?repo=JCodesMore/ai-website-cloner-template&amp;theme=dark" /><source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/badge?repo=JCodesMore/ai-website-cloner-template" /><img alt="Star History Global Rank" src="https://api.star-history.com/badge?repo=JCodesMore/ai-website-cloner-template" width="216" height="55" /></picture></a>

<br />
<sub><strong>SPONSORED BY</strong></sub>
<br /><br />
<a href="https://www.rapidproxy.io/?ref=JCM"><img src="docs/assets/sponsors/rapidproxy-banner.png" alt="RapidProxy residential proxy service" width="680" /></a>
<br />
<sub>Power your scraping and automation with 90M+ residential IPs, 500MB free traffic, and non-expiring bandwidth. <a href="https://www.rapidproxy.io/?ref=JCM">Explore RapidProxy →</a></sub>

</div>

---

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

> Most supported clients expose `/clone-website` directly. If your client activates skills from natural-language requests, enter `Clone <target-url> using the clone-website workflow`. Project instructions are in `AGENTS.md`.

## Supported Platforms

| Agent                                                         | Status                     |
| ------------------------------------------------------------- | -------------------------- |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | **Recommended** — Opus 5   |
| [Codex CLI](https://github.com/openai/codex)                  | Supported                  |
| [OpenCode](https://opencode.ai/)                              | Supported                  |
| [GitHub Copilot](https://github.com/features/copilot)         | Supported                  |
| [Kiro](https://kiro.dev/)                                    | Supported                  |
| [Cursor](https://cursor.com/)                                 | Supported                  |
| [Windsurf](https://codeium.com/windsurf)                      | Supported                  |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli)     | Supported                  |
| [Cline](https://github.com/cline/cline)                       | Supported                  |
| [Roo Code](https://github.com/RooCodeInc/Roo-Code)            | Supported                  |
| [Continue](https://continue.dev/)                             | Supported                  |
| [Amazon Q](https://aws.amazon.com/q/developer/)               | Supported                  |
| [Augment Code](https://www.augmentcode.com/)                  | Supported                  |

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

```mermaid
flowchart LR
    P1["1. Reconnaissance"] --> P2["2. Foundation"]
    P2 --> P3["3. Component Specs"]
    P3 --> P4["4. Parallel Build"]
    P4 --> P5["5. Assembly and QA"]
```

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
.kiro/skills/          # Generated Kiro workspace skill
.cline/skills/         # Generated Cline workspace skill
.roo/skills/           # Generated Roo Code workspace skill
.roo/commands/         # Generated Roo Code slash command
AGENTS.md           # Agent instructions (single source of truth)
CLAUDE.md           # Claude Code config (imports AGENTS.md)
GEMINI.md           # Gemini CLI config (imports AGENTS.md)
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

![Star History Chart](docs/assets/star-history.png)

## License

MIT

<sub>Translations: <a href="README.ja.md">日本語</a> · <a href="README.zh-CN.md">Simplified Chinese</a></sub>
