# netlify.toml — Build Configuration for Deploys

`netlify.toml` at the repository root controls how Netlify builds and deploys the site (in monorepos, the first config found wins — see the discovery order under "Monorepo with a Base Directory" below). This reference covers the **deploy-relevant** build settings. For the complete `netlify.toml` syntax — redirects, headers, deploy contexts, functions and edge-functions config, plugins, and the Image CDN block — see the **netlify-config** skill, which is the source of truth for configuration.

## Build Settings

```toml
[build]
  # Command to build the site
  command = "npm run build"

  # Directory to publish, relative to `base` when set, otherwise the repo root
  publish = "dist"

  # Base directory the build runs from (default: repo root)
  base = "packages/frontend"

  # Functions directory (default: netlify/functions)
  functions = "netlify/functions"

  # Skip a build when nothing relevant changed
  ignore = "git diff --quiet HEAD^ HEAD package.json"
```

**`publish` is resolved relative to `base`.** With `base = "packages/frontend"` and `publish = "dist"`, Netlify publishes `packages/frontend/dist` — not `dist` at the repo root. Set `publish` relative to the base directory or the deploy will fail with "publish directory not found."

**`netlify.toml` overrides the Netlify UI.** When a build setting is in both, the committed file wins; the UI field becomes inert until you change the file and redeploy.

## Monorepo with a Base Directory

```toml
[build]
  base = "packages/web"
  command = "npm run build"
  publish = "dist"    # publishes packages/web/dist
```

In a monorepo, Netlify uses the first `netlify.toml` it finds: the package directory, then the base directory, then the repo root.

## Build-Time Environment and Context Overrides

Build-scoped environment variables and per-context build overrides can live in `netlify.toml`:

```toml
[build.environment]
  NODE_VERSION = "20"

[context.production]
  command = "npm run build:prod"

[context.deploy-preview]
  command = "npm run build:preview"
```

Values under `[build.environment]` and `[context.*.environment]` are **build-scoped only** — they are not injected into the Functions/Edge runtime. For runtime variables, set them with `netlify env:set` or in the UI. Never put secrets in `netlify.toml` (it's committed). See the **netlify-config** skill for the full environment-variable and deploy-context reference.

## Validating

```bash
netlify build --dry   # Show resolved build settings without building
```

## Resources

- Full configuration reference: https://docs.netlify.com/build/configure-builds/file-based-configuration/
- Framework-specific guides: https://docs.netlify.com/frameworks/
