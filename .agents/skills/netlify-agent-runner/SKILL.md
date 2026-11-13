---
name: netlify-agent-runner
description: Run AI agent tasks remotely on Netlify using Claude, Codex, or Gemini. Use when the user wants to run an AI agent on their site, get a second opinion from another model, or delegate development tasks to run remotely against their repo.
---

# Netlify Agent Runner

Run AI coding agents (Claude, Codex, Gemini) remotely on Netlify infrastructure to automate development tasks on your site.

## Prerequisites

- The site must be **linked to a Netlify project** (via `netlify link` or `netlify init`).
- **Or skip linking entirely:** pass `--project <name>` (a project ID or name) directly to `netlify agents:create` to target any Netlify site without linking first.
- The Netlify CLI must be installed and authenticated
- Agent runs **consume plan credits**. If the account has no available credits — or the agent/AI usage limit has been reached — `netlify agents:create` is **blocked** and the run won't start. That's an account/plan-state issue to surface to the user, not something to work around.

## Use only documented CLI surfaces

Interact with agent tasks only through the documented `netlify agents:*` commands (plus `netlify --help` and the public CLI reference). Do **not** go around the CLI:

- **Do not curl `https://api.netlify.com/...`** to fetch, create, or stop a task — the endpoint shapes are not part of the public contract.
- **Do not run `netlify api <method>`** as a recovery hatch when a documented command fails.
- **Do not read auth tokens** out of `~/Library/Preferences/netlify/config.json` (or anywhere on disk) to authenticate side-channel calls.

If a documented command fails, report the exact error and context to the user and stop — don't invent an undocumented way to reach the task.

## How Agent Tasks Run

Read this before creating a task — agent tasks behave differently from running an agent locally, and the differences are easy to miss.

- **Remote, not local.** Tasks run on Netlify infrastructure, not on your machine. They operate on the site's **connected repository**, not your local working tree. The remote agent only sees what has been pushed to the remote — it cannot see uncommitted or unpushed changes.
- **Branch-based.** By default a task runs against the production branch (`main` or `master`). To choose a different *base* branch for the agent to start from, use `-b <branch>` and make sure that branch has been **pushed to the remote first**, or the agent will be working from code that doesn't exist remotely. `-b` sets the base (starting) branch — not where the results are written (see the next bullet).
- **Output lands on a new branch — not in place.** The agent does **not** commit its changes onto the base branch you selected. It pushes its work to a **new branch** with its own **Deploy Preview**, so your existing branch (or `main`) is never overwritten. Review the task's results on that new branch / Deploy Preview — don't expect the base branch to change directly.
- **Asynchronous.** `netlify agents:create` returns as soon as the task is queued — it does **not** block until the work is finished. When the command returns, the task is still running remotely.
- **No webhooks or callbacks.** Nothing notifies you when a task changes state or completes. To find out what's happening, you have to **poll** with `netlify agents:show <task-id>` or `netlify agents:list`.
- **Statuses are terminal or not.** A task moves through `new` → `running` → one of `done`, `error`, or `cancelled`. Keep polling until the status is one of those last three before you act on the results.

### Typical workflow

1. **Create** a task: `netlify agents:create "<prompt>" -a <agent>`. Note the task ID it returns (use `--json` to capture it reliably).
2. **Poll** for status: `netlify agents:show <task-id>`. Repeat periodically — there is no completion notification — until the status is `done`, `error`, or `cancelled`.
3. **Review** the results once the task reaches `done` (or inspect the failure on `error`).

## Creating Agent Tasks

```bash
# Run a prompt with the default agent
netlify agents:create "Add a contact form"

# Choose a specific agent: claude, codex, or gemini
netlify agents:create --prompt "Add dark mode" --agent claude
netlify agents:create -p "Update the README" -a codex
netlify agents:create -p "Write unit tests" -a gemini

# Target a specific branch
netlify agents:create -p "Fix the login bug" -a claude -b feature-branch

# Specify a project by name (if not in a linked directory)
netlify agents:create "Add tests" --project my-site-name

# Output result as JSON
netlify agents:create "Add a footer" --json
```

### Options

| Flag | Description |
|------|-------------|
| `-a, --agent <agent>` | Agent type: `claude`, `codex`, or `gemini` |
| `-p, --prompt <prompt>` | The prompt for the agent to execute |
| `-b, --branch <branch>` | Git branch to work on |
| `-m, --model <model>` | Model to use for the agent |
| `--project <project>` | Project ID or name |
| `--json` | Output result as JSON |

## Managing Agent Tasks

All `netlify agents:*` commands are **project-scoped** — they operate on a single project (the one your directory is linked to, or the one named with `--project <name>`), not on your whole team. `netlify agents:list` shows the tasks for that one project only; there is no team-wide command that lists tasks across all your sites. To see a different site's tasks, run from its linked directory or pass `--project <name>` for it.

### List tasks

```bash
# List all tasks for the current site
netlify agents:list

# Filter by status
netlify agents:list --status running
netlify agents:list --status done
netlify agents:list --status error

# Output as JSON
netlify agents:list --json
```

Status values: `new`, `running`, `done`, `error`, `cancelled`.

### Show task details

```bash
netlify agents:show <task-id>
netlify agents:show <task-id> --json
```

### Stop a running task

```bash
netlify agents:stop <task-id>
```

## Use Cases

Some of the many things you can do with Agent Runners:

| Category | Example prompt |
|----------|---------------|
| Prototyping / internal tools | "Build an internal dashboard for our HR team" |
| Code reviews | "Audit the code with fresh eyes and identify areas for improvement" |
| Security audits | "Do a deep security audit of our codebase to identify any potential issues" |
| Feature suggestions | "Based on our current codebase & docs, what should we build next?" |
| Performance improvements | "Scan our codebase for performance bottlenecks and suggest improvements" |
| Telemetry & analytics | "What analytics things are we not tracking but probably should" |
| SEO audit | "Audit our site for SEO issues — missing meta tags, broken links, slow pages, missing alt text" |
| Copy improvements | "Rewrite our landing page copy to be more compelling and conversion-focused" |
| Accessibility | "Run an accessibility audit and fix all WCAG 2.1 AA violations" |
| Mobile responsiveness | "Improve the mobile responsiveness — audit every page on small viewports" |
| End-to-end tests | "Add end-to-end tests for our critical user flows using Playwright" |
| Unit tests | "Generate unit tests for our untested utility functions" |
| Documentation | "Generate a README and contributing guide based on our codebase" |
| Error handling | "Add proper error boundaries, logging, and user-friendly error states throughout the app" |
| UX polish | "Add loading states, skeleton screens, & transitions to improve perceived performance" |
| Form hardening | "Add form validation, rate limiting, and spam protection to our contact form" |
| Edge Functions | "Add an edge function for A/B testing on our landing page" |

## Using as an Agent

If you are an AI agent, you can use `netlify agents:create` to delegate work to an agent running remotely on Netlify — for example, to get a second opinion from a different model.

**IMPORTANT — ask for permission first, as a distinct confirmation step.** Agent tasks run on Netlify infrastructure and cost the user credits, so a real approval gate matters. Get explicit permission before running any `netlify agents:create` command — and treat that as its own turn, separate from the user's original request. A directive-sounding prompt ("start a task…", "use the claude agent and pin it to Opus") is **not** itself the approval: it tells you what they want, but the billable command still waits for a yes.

Make the permission request a concrete proposal, not a menu:

- **The exact command**, filled in — e.g. `netlify agents:create -p "<the real prompt>" -a codex` — not a `<placeholder>` and not a pick-one list of agents.
- **One agent, already chosen** — commit to a single `-a` value and say why you picked it ("codex for a second opinion on the auth logic"), rather than offering claude/codex/gemini as interchangeable options.
- **Why**, plus **what happens after "yes"**: the run is asynchronous — `agents:create` returns as soon as the task is queued, there's no callback, and you'll poll `netlify agents:show <task-id>` for the outcome.
- **Even if a prerequisite is missing** (not authenticated, not linked to a site, not a git repo yet), still show the exact command and chosen agent you'll run *once it's resolved* — surface the blocker **and** the concrete proposal, rather than collapsing to only describing the blocker.

Never run these commands without the user's approval.

Before delegating, understand what you're handing off (see [How Agent Tasks Run](#how-agent-tasks-run) above):

- **It runs remotely against the pushed branch — not your local work.** The remote agent only sees code that has been committed and pushed. Do **not** delegate work that depends on your local, in-progress changes; the remote agent can't see them and will work from stale code. If a task needs your current changes, commit and push them first (or finish the work yourself).
- **It's asynchronous — delegating does not block you.** The task runs remotely while you keep working. But because there are no callbacks, you have to poll (`netlify agents:show <task-id>`) to learn the outcome. Don't assume the task is done just because you delegated it — check the status before relying on or describing its results.
- **It's a separate, self-contained task — not a continuation of your session.** The remote agent starts fresh from the repo and the prompt you give it. It has none of your conversation context, so write a complete, standalone prompt.

Useful for:

- **Cross-validation** — get a second opinion on your implementation from a different model
- **Edge case discovery** — another model may catch issues you missed
- **Alternative approaches** — see how a different model would solve the same problem
- **Parallel work** — kick off an independent task remotely while you continue on other work, then poll for its result
