# Netlify Deployment Patterns

Common deployment scenarios for Netlify. The primary path is **Git-based continuous deployment** (Netlify builds and deploys on every push); manual CLI uploads are the exception for prototypes, Git-less projects, and CI artifact uploads.

Don't gate deploys behind a `netlify status` pre-check. Run the real command; if it fails with an auth or link error, that failure tells you what to fix.

## Pattern 1: Git-Based Continuous Deployment (primary)

**Context**: A project in a Git repository that should deploy automatically.

**Setup once**:
```bash
netlify init   # Creates/links a site and connects Git CI/CD
```

After that, Netlify builds on its own servers on every push:
- Push to the production branch → production deploy.
- Open a pull request → deploy preview with a unique URL.
- Push to another branch → branch deploy, **only if** branch deploys are enabled (off by default; enable in the site's build & deploy settings).

Configure the build command, publish directory, and base directory in `netlify.toml` (see the **netlify-config** skill). No local build or upload step is needed — the build happens on Netlify.

## Pattern 2: Linking an Existing Repo to an Existing Site

**Context**: A site already exists on Netlify and you want the local repo linked to it.

```bash
# Link by Git remote
netlify link --git-remote-url https://github.com/user/my-app.git

# Or link interactively (pick from a list)
netlify link
```

If the site can't be found, create one with `netlify init`.

## Pattern 3: Manual / Local Deploy (secondary)

**Context**: A prototype, a project with no Git remote, or a CI pipeline that builds elsewhere and uploads the artifact.

```bash
# Draft deploy (preview URL) to test the upload
netlify deploy --dir=dist

# Production deploy
netlify deploy --dir=dist --prod
```

`--dir` names the already-built output directory to upload. Omit it to let the CLI resolve the publish directory from `netlify.toml`. If the site also has Git CD connected, remember a manual `--prod` deploy is replaced by the next push to the production branch unless you lock the deploy in the UI.

## Pattern 4: Preview Before Production

**Context**: You want to check a build before it goes live.

With Git CD, open a pull request — Netlify creates a deploy preview automatically. For a manual upload, `netlify deploy` (without `--prod`) produces a draft deploy with its own URL; deploy `--prod` once it looks right.

## Pattern 5: Monorepo Deployment

**Context**: The site lives in a subdirectory of a larger repo.

Set a base directory so Netlify runs the build from the right place:

```toml
[build]
  base = "packages/frontend"
  command = "npm run build"
  publish = "dist"
```

The publish directory is resolved **relative to `base`** — the config above publishes `packages/frontend/dist`. In a monorepo, Netlify uses the first `netlify.toml` it finds in the package directory, then the base directory, then the repo root. See the **netlify-config** skill for the full monorepo configuration reference.

## Environment Variables

Set environment variables with `netlify env:set` or in the Netlify UI, and access them in code with `Netlify.env.get("VAR")` (functions/edge) or the framework's client prefix for browser-exposed values. Full guidance — CLI management, context scoping, and how to read variables in code — lives in the **netlify-config** and **netlify-frameworks** skills. Never commit secrets to Git.

## Custom Domains

Custom domains are configured in the Netlify UI (Domain settings), not through a deploy command. Deploy the site first, then add the domain and follow Netlify's DNS instructions.

## Troubleshooting

### "Publish directory not found"

The build didn't produce the expected output directory, or the path is wrong.
- Run the build yourself (`netlify build`, or the project's own build command) and check which directory it actually emits — don't guess from the framework name or just `ls` for a missing folder.
- If the build fails, surface the error and stop — don't change `publish` to paper over a broken build.
- Once it succeeds, fix the `publish` path in `netlify.toml` (or `--dir`) to match that real output directory, remembering it's relative to any `base` directory.

### "Build failed" / exit code 1

The build command failed.
- Read the deploy log (the CLI prints a log URL) for the specific error.
- Fix the underlying cause and redeploy. A failed deploy never publishes, so the previous deploy is still live — there's nothing to roll back.

### "Not logged in"

Run `netlify login` (or set `NETLIFY_AUTH_TOKEN` in CI).

### "No site linked"

Run `netlify link` (existing site) or `netlify init` (new site). In CI, set `NETLIFY_SITE_ID`.

When a failure isn't resolved by the deploy log, report the exact error, the log URL, and the affected site to the user and stop — don't route around it with `netlify api` or direct API calls.

## Resources

- Netlify CLI Documentation: https://docs.netlify.com/cli/get-started/
- Framework Integration Guides: https://docs.netlify.com/frameworks/
- Build Configuration: https://docs.netlify.com/build/configure-builds/overview/
