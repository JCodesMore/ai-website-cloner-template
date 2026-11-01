# Netlify CLI Commands Reference

Quick reference for common Netlify CLI commands used in deployments. Commands can be run from a global install (`netlify <command>`) or without installing (`npx netlify <command>`).

## Authentication

```bash
# Login via browser OAuth
netlify login

# Logout
netlify logout
```

For CI, set `NETLIFY_AUTH_TOKEN` (and `NETLIFY_SITE_ID` to select the target site) instead of logging in interactively. Don't pre-check auth — run the real command and only surface `netlify login` if it fails with an auth error.

## Site Management

```bash
# Link current directory to an existing site (interactive)
netlify link

# Link by Git remote URL
netlify link --git-remote-url <url>

# Create and link a new site
netlify init           # With Git CI/CD setup
netlify init --manual  # Without Git CI/CD

# Unlink from the current site
netlify unlink

# List sites for the account
netlify sites:list

# Open the site in the Netlify dashboard
netlify open
netlify open:admin     # Admin panel
netlify open:site      # Live site in the browser
```

## Deployment

```bash
# Draft deploy (preview URL) — safe for testing
netlify deploy

# Deploy to production
netlify deploy --prod

# Deploy a specific directory
netlify deploy --dir=dist

# Add a deploy message
netlify deploy --message="Deploy message"

# List past deploys
netlify deploy:list
```

The primary deploy path is Git-based continuous deployment (push to deploy). Use `netlify deploy` for manual/local uploads — prototypes, sites with no Git remote, or CI pipelines that upload a prebuilt artifact.

## Build

```bash
# Show build settings without building
netlify build --dry

# Run the build locally (mimics the Netlify build environment)
netlify build
```

## Functions (Serverless)

```bash
# List functions
netlify functions:list

# Invoke a function locally
netlify functions:invoke FUNCTION_NAME

# Scaffold a new function
netlify functions:create FUNCTION_NAME
```

## Logs

```bash
# View recent logs from functions and edge functions (defaults to last 10m)
netlify logs

# Stream logs in real time
netlify logs --follow

# Stream logs for a specific function
netlify logs --source functions --function FUNCTION_NAME --follow

# View historical logs for a specific function over a longer window
netlify logs --source functions --function FUNCTION_NAME --since 24h

# Include deploy logs alongside function logs
netlify logs --source deploy --source functions --since 1h
```

Sources accepted by `--source`: `functions`, `edge-functions`, `deploy`. When omitted, it defaults to `functions` and `edge-functions`. Run `netlify logs --help` for the full option list.

## Environment variables and local dev

These belong to other skills:

- **Environment variables** (`env:set`, `env:get`, `env:list`, `env:import`, context scoping) — see the **netlify-config** skill.
- **Local development** (`netlify dev`, the Netlify Vite plugin) — see the **netlify-frameworks** skill.

## Troubleshooting Commands

```bash
# Check CLI version
netlify --version

# Get help for any command
netlify help [command]
```

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Authentication error
- `3` - Site not found
- `4` - Build failed

## Common Flags

- `--json` - Output as JSON
- `--silent` - Suppress output
- `--debug` - Show debug information
- `--force` - Skip confirmation prompts

## Resources

- Full CLI documentation: https://docs.netlify.com/cli/get-started/
- CLI GitHub repository: https://github.com/netlify/cli
