---
name: netlify-config
description: Configure Netlify builds and routing via netlify.toml, _redirects, and _headers. Use when setting a build command or publish directory, adding redirects or rewrites or proxies, adding an SPA fallback rewrite, setting custom response headers or basic auth, managing environment variables and secrets, scoping vars per deploy context, marking a var as secret, disabling secret scanning, configuring functions bundling, ignoring builds, or wiring up a monorepo or JavaScript SPA on Netlify.
---

# Netlify configuration

Config lives in three files at the repo **root** (or the base/package directory for monorepos):
- `netlify.toml` — build, contexts, plugins, functions, redirects, headers, dev.
- `_redirects` — plain-text redirect/rewrite rules, saved to the **publish directory**, no extension.
- `_headers` — plain-text response headers, saved to the **publish directory**.

`netlify.toml` values **take precedence over the Netlify UI** when they conflict. Paths in `netlify.toml` are absolute relative to the **base directory** (root `/` by default).

## Modern vs legacy syntax to reach for
- Functions bundler: use `node_bundler = "esbuild"`. `zisi` is the legacy JS default; TypeScript always uses `esbuild`.
- Temporary redirect: use `status = 302`. `307` is **unsupported**.
- Gatsby Image CDN: use `NETLIFY_IMAGE_CDN`, not the deprecated `GATSBY_CLOUD_IMAGE_CDN`.
- Injecting env values into TOML: `key = "$VAR"` is **NOT supported** (except `signed` in proxy redirects). Use a build-command `sed` substitution or a build plugin (see below).

## `netlify.toml` build + contexts

```toml
[build]
  base = "frontend"
  publish = "dist"
  command = "npm run build"
  environment = { NODE_VERSION = "18" }

[context.production]
  publish = "output/"
  command = "make publish"

[context.deploy-preview]
  publish = "dist/"

[context."feat/branch"]        # quote names with special characters
  command = "npm run preview"
```

`[build]` runs in **Bash**. Context-aware keys include `[build]` and `[[plugins]]` — but **NOT** `[[redirects]]` or `[[headers]]` (those are always global). Precedence, least→most specific: UI < toml < any-context property < `[context.<name>]` < `[context.branchname]`.

## Redirects and rewrites

`_redirects` rules are processed **first**, then `netlify.toml`; within each, the **first matching rule top-to-bottom wins** — list specific rules before general ones. Edge functions run before redirects.

SPA history-`pushState` fallback (required for clean URLs):
```
/*  /index.html  200
```
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

`_redirects` syntax — `from to [status] [conditions]`, `#` comments, paths case-sensitive, URL-encode special chars:
```
/home         /              301
/my-redirect  /              302
/ecommerce    /store-closed  404          # custom 404 for a path
/pass-through /index.html    200          # rewrite
/best-pets/dogs /best-pets/cats.html 200! # force/shadow (! or force=true)
/news/*  /blog/:splat                     # splat
/news/:month/:date/:year/:slug  /blog/:year/:month/:date/:slug   # placeholders
/store id=:id  /blog/:id  301             # query params
/  /anz  302  Country=au,nz               # no spaces in value list
/israel/*  /israel/he/:splat  302  Language=he
/* /legacy/:splat 200 Cookie=is_legacy,my_other_cookie
```

`[[redirects]]` keywords: `from`, `to`, `status` (default `301`), `force` (default `false`; `!`/shadow), `query` (`query = {path = ":path"}`), `conditions` (`{Language, Country, Role, Cookie}`), `headers` (proxy request headers), `signed` (env var name for signed proxies).

**Gotchas:**
- You **cannot** add/remove a trailing slash with a redirect — CDN normalizes URLs first; a `/x/ → /x 301!` rule loops infinitely. Rely on Pretty URLs (default on).
- Splat asterisks work only at the **end** of a segment (`/jobs/*`), not mid-path (`/jobs/*.html` invalid). Placeholders (`:x`) only at the start of a segment; can't mix wildcard+placeholder in one segment.
- You can't exclude a path from a splat; put a more specific rule first.
- `Country` = ISO 3166-1 alpha-2; language redirects match only the **first** `Accept-Language` entry.
- Role-based redirects with external auth providers are **Enterprise-only**.
- 10,000+ redirects: use wildcards/placeholders or Edge Functions — oversized serialized output fails the deploy.

## Proxies

```
/api/*           https://api.example.com/:splat        200
/netlify-site/*  https://my-other-site.netlify.app/:splat  200   # use .netlify.app, not custom domain
```
```toml
[[redirects]]                     # custom request headers + force
  from = "/search"
  to = "https://api.mysearch.com"
  status = 200
  force = true
  headers = {X-From = "Netlify"}
```
Signed proxy (`signed` names an env var scoped to **Runtime**; must live in `netlify.toml`; JWS is external-only, not Netlify→Netlify):
```toml
[[redirects]]
  from = "/search"
  to = "https://api.mysearch.com"
  status = 200
  force = true
  signed = "API_SIGNATURE_TOKEN_PLACEHOLDER"
```

**Gotchas:** cross-team rewrites disallowed; same-password-site rewrites OK but not across separate protected sites; proxy timeout **26 s**; one hop by default; relative-path assets break (use absolute or `<base>`); loops silently ignored.

## Custom headers

```
/*
  X-Frame-Options: DENY
/templates/index2.html
  X-Frame-Options: SAMEORIGIN
```
Multi-value — repeat the key (`_headers`) or a multiline TOML string:
```toml
[[headers]]
  for = "/*"
  [headers.values]
  cache-control = '''
  max-age=0,
  no-cache,
  no-store,
  must-revalidate'''
```

**Gotchas:**
- Headers in `_headers`/`netlify.toml` are **global** — NOT scoped to branch/context. Workaround: strip global headers, keep header files in a custom dir, and `cp` them into the publish dir from a per-context build command:
  ```toml
  [context.staging]
    command = "npm run build && cp ./custom-headers/_stagingHeaders ./dist/_headers"
  ```
- Headers apply only to files from Netlify's store — **NOT** to proxied content or function/edge (SSR) responses; those must set their own headers.
- Ignored (server-set) names include `Content-Length`, `Content-Encoding`, `Location` (use redirects), `Set-Cookie`, `Server`, etc.
- Basic auth headers: **Pro/Enterprise only**. Cross-subdomain cookies need a custom domain (`netlify.app` is on the Public Suffix List).

## Functions

```toml
[functions]
  directory = "myfunctions/"          # default: <base>/netlify/functions
  node_bundler = "esbuild"
  external_node_modules = ["package-1"]  # esbuild only; native add-ons etc.
  included_files = ["files/*.md"]        # ! prefix excludes

[functions."api_*"]                    # glob/named blocks concatenate with top-level
  external_node_modules = ["package-2"]
  included_files = ["!files/post-1.md"]
```

## Environment variables

Two storage methods:
- **UI / CLI / API** — stored on Netlify (not the repo). Supports site + shared vars, per-context values, scopes; reaches builds, functions/edge/ODB, snippet injection, forms, signed proxies. **Recommended for anything sensitive.**
- **`netlify.toml`** — stored in the repo. Site vars only, per-context values, **no scope selection** (everything gets **Builds** + **Post processing**), reaches builds + snippet injection only.

`netlify.toml` env vars **override** same-key UI/CLI/API vars.

Per-context values in TOML:
```toml
[context.production]
  environment = { NODE_VERSION = "14.15.3" }
[context.deploy-preview.environment]
  NOT_PRIVATE_ITEM = "not so secret"
[context.branch-deploy.environment]
  NODE_ENV = "development"
```

CLI:
```bash
netlify env:set KEY value          # --secret marks it a secret
netlify env:import .env             # site vars; --replace-existing wipes others first
netlify env:unset KEY
netlify env:list --plain --context production > .env
netlify build                       # local build with Netlify's env vars
```
API: `createEnvVars` / `updateEnvVar` (`is_secret: true`) / `setEnvVarValue` / `deleteEnvVar` / `deleteEnvVarValue`.

**Access syntax:** Bash `$VAR` in `build.command`/`ignore.command`; `process.env.VAR` in Node scripts and plugins.

**Scopes** (Pro/Enterprise; default all): Builds (site builds) · Functions (Functions/Edge/ODB) · Runtime (forms, signed proxies) · Post processing (snippet injection). Shared vars are Pro/Enterprise and **Team-Owner-only** to read/edit. Precedence for a site+shared key collision resolves **per scope** — a site var only wins within the scopes it actually carries.

**Naming/limits:** keys alphanumeric + underscore, must start with a letter (`1KEY`, `_KEY1` invalid); keys ≤255 chars, values ≤5,000 chars. Read-only variable names are reserved. Changes need a build + deploy.

**Set the build language via reserved config vars** — `NODE_VERSION`, `NPM_FLAGS`, `YARN_VERSION`, `BUN_VERSION`, `RUBY_VERSION`, `PHP_VERSION`, `PYTHON_VERSION`, `GO_VERSION`, `HUGO_VERSION`, `PNPM_FLAGS`, `NPM_TOKEN` (Yarn: `YARN_NPM_AUTH_TOKEN`), etc.

**Must be set in UI/CLI/API, NOT `netlify.toml`** (read after the repo is cloned or a runtime-only var): `AWS_LAMBDA_JS_RUNTIME`, `GIT_LFS_ENABLED`, `GIT_LFS_FETCH_INCLUDE`, `NETLIFY_BUILD_DEBUG`.

**`CI` gotcha:** defaults to `true`; if it breaks a build, prepend `CI='' ` to the build command.

### Injecting env values into headers/redirects
`key = "$VAR"` is unsupported. Only path (scope must include **Builds**):
```toml
[build]
  command = "sed -i \"s|HEADER_PLACEHOLDER|${PROD_API_LOCATION}|g\" netlify.toml && yarn build"
```
`sed` substitution works **only** for `[[headers]]`/`[[redirects]]` (read after the build) and is **not** visible to build plugins (they run before the build command). For plugin-visible changes, use a local build plugin editing `netlifyConfig`.

### Useful read-only build vars
`CONTEXT` (`production`/`deploy-preview`/`branch-deploy`/`dev`), `BRANCH`, `COMMIT_REF`, `CACHED_COMMIT_REF`, `PULL_REQUEST`, `REVIEW_ID`, `URL`, `DEPLOY_URL`, `DEPLOY_PRIME_URL`, `SITE_ID`, `SITE_NAME`.

## Secrets Controller

Flag a var as secret: `Contains secret values` (UI) / `--secret` (CLI) / `is_secret: true` (API). Enforced, non-customizable policy:
- Secret values are **write-only** — no readable version after set; the flag can't be removed to reveal it.
- Secrets need explicit contexts + scopes; **cannot** carry the `post processing` scope.
- Only code on Netlify (edge/serverless/build) reads unmasked values; off-Netlify sees masked. The `dev`-context value is exempt (unmasked from UI/CLI/API); `netlify build` never emits raw values.

**Secret scanning** runs automatically once any var is secret (and via smart detection). Fails the build on detection and logs the location. Configure via env vars set per context:
- `SECRETS_SCAN_ENABLED=false` — disables **all** scanning (loses all secret protection).
- `SECRETS_SCAN_SMART_DETECTION_ENABLED=false` — disables smart detection only.
- `SECRETS_SCAN_OMIT_KEYS`, `SECRETS_SCAN_OMIT_PATHS` (comma lists; paths from repo root, globs OK).
- `SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES` — safelist false positives (**prefer** this over disabling). Smart detection is Personal/Pro/Enterprise.

Scanning covers all build files, values >4 chars and non-boolean, searching plaintext + base64 + URI-encoded permutations.

### Sensitive variable policy (public repos only)
Governs whether **untrusted** deploys (unrecognized authors) get sensitive vars. Site members' Git deploys are always trusted, even from forks. Set at Project configuration > Environment variables > Site policies:
- **Require approval** (default) — untrusted deploys wait for a member's approval.
- **Deploy without sensitive variables** — builds run, sensitive vars withheld.
- **Deploy without restrictions** — all vars present.

NOT available for GitHub Enterprise Server / GitLab self-managed repos (treated as private).

## Ignore builds

`ignore` under `[build]` decides whether to rebuild — runs from the base directory in Bash (or Node.js 18, fixed; site `package.json` deps **not** available). **Exit `1` = changed → build continues; exit `0` = no change → build stops.** A build hook always builds regardless of exit code.
```toml
[build]
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF packages/blog-1 packages/common"
```
```toml
[build]
  ignore = "node ignore_build.js"   # separate file paths must start with ./
```
```js
// ignore_build.js
process.exitCode = process.env.BRANCH.includes("debug") ? 0 : 1
```

## Monorepos

Set the site subdirectory as the **package directory** (keep its `netlify.toml` there), leave base at root `/`, declare deps at the subdirectory level. Package directory is **UI-only — cannot be set in `netlify.toml`** (Project configuration > Developer settings > Continuous deployment > Build settings). Config file discovery order: package dir → base dir → root. Paths in `netlify.toml` stay absolute relative to the base directory. `netlify <cmd> --filter <site>` selects a site.

## JavaScript SPAs

Build command `npm run <script>` / `yarn <script>`; publish dir often `dist` (framework-dependent). Add the `/*  /index.html  200` fallback (above) for `pushState` routing. Code splitting + hashed filenames with atomic deploys can throw `Uncaught SyntaxError: Unexpected token` on stale references — disable hashed filenames, use permalinks, or a service worker.

## Netlify Dev `[dev]`

Does **NOT** run in Bash (no Bash syntax in `command`). There is **no `environment` key** — set local env vars under `[context.dev.environment]`.
```toml
[dev]
  command = "yarn start"
  targetPort = 3000        # if both command + targetPort set, framework must be "#custom"
  port = 8888
  framework = "#custom"
  [dev.https]
    certFile = "cert.pem"
    keyFile = "key.pem"
```

## Plugins & extensions

```toml
[[plugins]]
package = "netlify-plugin-check-output-for-puppy-references"
  [plugins.inputs]
  breeds = ["pomeranian", "chihuahua"]

[[integrations]]              # build-time extension; install on team first
  name = "abc-performance-extension"
  [integrations.config]
    output_path = "reports/performance-reports.html"
```

Full reference pages: build environment variables at https://docs.netlify.com/build/configure-builds/environment-variables.md, env-var overview at https://docs.netlify.com/build/environment-variables/overview.md, Secrets Controller at https://docs.netlify.com/build/environment-variables/secrets-controller.md, redirects at https://docs.netlify.com/manage/routing/redirects/overview.md, redirect options at https://docs.netlify.com/manage/routing/redirects/redirect-options.md, rewrites/proxies at https://docs.netlify.com/manage/routing/redirects/rewrites-proxies.md, custom headers at https://docs.netlify.com/manage/routing/headers.md, and file-based config at https://docs.netlify.com/build/configure-builds/file-based-configuration.md.

<!-- Plan gating for the sensitive variable policy itself is unspecified in the sources; only its public-repo requirement and the smart-detection plan list are documented. -->

<!-- system: agent-context/config/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (config)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. Env vars set in `netlify.toml` are NOT available to functions or edge
   functions at runtime — reading them there returns `undefined`. Set
   runtime vars in the UI or with `netlify env:set`, not `netlify.toml`.
2. Never put secrets in client-prefixed env vars (`VITE_`, `NEXT_PUBLIC_`,
   `PUBLIC_`, ...) — they are inlined into the client bundle; `--secret`
   does not protect them.
3. When snapshotting env vars locally (`netlify env:list --plain > .env`),
   keep `.env` gitignored — never commit it.
4. State env-var scope interaction explicitly: a site variable scoped to
   Builds does not shadow the shared variable for other scopes — precedence
   resolves independently per scope (site beats shared only within the
   scopes the site variable actually carries).
