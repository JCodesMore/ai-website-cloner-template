---
name: netlify-image-cdn
description: Transforms images on demand via Netlify Image CDN's /.netlify/images endpoint with query parameters for resizing/cropping/format/quality. Use when adding image optimization or responsive images, converting formats (WebP/AVIF/PNG), generating thumbnails or blur placeholders, serving remote/third-party images through the CDN, allowlisting remote domains in netlify.toml, setting up image redirects or cache headers, building user-uploaded image pipelines, or debugging a 404 on /.netlify/images. Also covers framework image handling for Angular/Astro/Gatsby/Next.js/Nuxt.
---

# Netlify Image CDN

Transform images by requesting the endpoint with a `url` query parameter. This is the current and only documented surface — there is no legacy form.

```
GET /.netlify/images?url=<source>[&w=][&h=][&fit=][&position=][&fm=][&q=]
```

```bash
# resize a deployed image to 50px wide
curl -vs 'https://mysitename.netlify.app/.netlify/images?url=/owl.jpeg&w=50'
```

`url` is required; all other parameters are optional.

## Query parameters

| Parameter | Purpose | Values | Default |
|-----------|---------|--------|---------|
| `url` | Source asset (required) | Relative path or remote URL | — |
| `w` | Width in pixels | Integer | — |
| `h` | Height in pixels | Integer | — |
| `fit` | Resize behavior | `contain`, `cover`, `fill` | `contain` |
| `position` | Crop anchor when `fit=cover` | `top`, `bottom`, `left`, `right`, `center` | `center` |
| `fm` | Output format | `avif`, `jpg`, `png`, `webp`, `gif`, `blurhash` | content-negotiated |
| `q` | Quality for lossy output | Integer `1`–`100` | `75` |

## Common transformations

```bash
# resize + crop to a 50px square, retaining the left side
curl -vs 'https://mysitename.netlify.app/.netlify/images?url=/owl.jpeg&fit=cover&w=50&h=50&position=left'

# convert JPEG to PNG (response carries content-type: image/png)
curl -vs 'https://mysitename.netlify.app/.netlify/images?url=/owl.jpeg&fm=png'

# convert JPEG to AVIF at medium quality
curl -vs 'https://mysitename.netlify.app/.netlify/images?url=/owl.jpeg&fm=avif&q=50'
```

### fit behavior

- **`contain` (default):** maintains aspect ratio; one dimension may come back smaller than requested. Supply one dimension and the other is computed.
- **`cover`:** fills exactly, cropping excess. **Requires BOTH `w` and `h`** — omitting either is invalid. Use `position` to choose what's retained.
- **`fill`:** fills exactly, stretching/squishing if aspect ratios differ.

### Format notes

- `q` applies only when output is `avif`, `jpg`, `gif`, or `webp`.
- `webp` and `gif` can be static or animated.
- If `fm` is omitted, format is content-negotiated from the `Accept` header: `webp` if accepted, else `avif` if accepted, else the original format. A source-only request (no other params) still converts to `webp`/`avif` but keeps size and shape.

## Remote source images

Remote sources must be allowlisted in `netlify.toml` before transformation, or the request fails.

```toml
[images]
  remote_images = ['https://my-images\.com/.*', 'https://animals.more-images.com/[bcr]at/.*']
```

Percent-encode remote source URLs before placing them in the `url` parameter with `encodeURIComponent` — a URL containing `?` or `&` breaks otherwise.

```js
const src = `/.netlify/images?url=${encodeURIComponent('https://my-images.com/owl.jpeg?v=2')}&w=400`;
```

Constraints:
- Remote sources must be **publicly accessible**.
- Credential-bearing headers (`Authorization`, `Cookie`) are **NOT forwarded** when fetching a remote source. For authenticated sources, use URLs that carry their own authorization (e.g. S3 presigned URLs) and make sure your `remote_images` patterns match those full URLs.

### remote_images regex escaping

The only meaningful escape is the literal dot (`\.`). Forward slashes are NOT metacharacters — never write `https:\/\/`. In `netlify.toml`, use single-quoted literal strings (`'https://example\.com/.*'`) or double the backslash in double-quoted strings (`"https://example\\.com/.*"`). A bare `\.` inside double quotes is invalid TOML.

## Response codes

- Invalid transformation parameter values → `404`.
- Valid new transformation → `200` with content and matching `content-type`.
- Previously transformed (cached) image → `304`.

## Reusing parameters across images

Map a friendly path to the endpoint with a redirect/rewrite.

`_redirects`:
```
/transform-small/* /.netlify/images?url=/:splat&w=50&h=50 200
```

`netlify.toml`:
```toml
[[redirects]]
  from = "/transform-small/*"
  to = "/.netlify/images?url=/:splat&w=50&h=50"
  status = 200
```

Then `GET /transform-small/owl.jpeg` returns the transformed image. **Cross-site redirects for transformations are NOT recommended** — they can degrade site performance.

## Caching headers

Apply custom headers to source images on the site's own domain; they carry through to the transformed output.

`netlify.toml`:
```toml
[[headers]]
  for = "/source-images/*"
  [headers.values]
    Cache-Control = "public, max-age=604800, must-revalidate"
```

- Custom headers can be applied to source images on the site's domain only — NOT to remote source images (Netlify does respect cache headers the external domain sends).
- `Cache-Control` on source images applies only to browsers and CDNs in front of Netlify, NOT the Netlify Cache itself.

## Blur placeholders (fm=blurhash)

`fm=blurhash` returns a BlurHash **text string**, not image bytes. Pointing an `<img src>` (or CSS background) at it renders nothing. Fetch the string ahead of time, decode it client-side with a BlurHash library (https://blurha.sh), and load the real image as a separate request without `fm=blurhash`.

## Local development

The `/.netlify/images` endpoint, `[images]` allowlisting, and image redirects only exist under `netlify dev` (Netlify CLI). A local **404 on `/.netlify/images` almost always means a framework dev server (`vite`, `next dev`, `astro dev`) is running instead of `netlify dev`** — the URL itself is usually fine. Start the local environment with `netlify dev`.

## User-uploaded image pipelines

For pipelines composing Functions + Blobs + Image CDN (handling user-uploaded images), see `references/user-uploads.md`.

## Framework image handling

Many frameworks route their built-in image optimization through Netlify Image CDN — use the framework's standard image component/syntax and only configure the remote allowlist. For unlisted frameworks, call `/.netlify/images` directly.

| Framework | Prerequisites | Remote allowlist location |
|-----------|---------------|---------------------------|
| Angular | None; `NgOptimizedImage` uses it automatically | `[images] remote_images` in `netlify.toml` |
| Astro | None; `<Image />` uses it automatically | `image.domains` or `image.remotePatterns` in `astro.config.mjs` |
| Gatsby (both 5.13+ and 5.11 or earlier) | Set env `NETLIFY_IMAGE_CDN=true`; use Contentful/Drupal/WordPress source plugins | `[images] remote_images` in `netlify.toml` |
| Next.js | Next.js 13.5+ and Next.js adapter v5 | `remotePatterns` in `next.config.js` |
| Nuxt | None; `nuxt/image` module uses it automatically | `image.domains` in `nuxt.config.ts` |

Setup guides: [Angular](https://docs.netlify.com/build/frameworks/framework-setup-guides/angular#netlify-image-cdn), [Astro](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro#netlify-image-cdn), [Gatsby](https://docs.netlify.com/build/frameworks/framework-setup-guides/gatsby/#netlify-image-cdn), [Next.js](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview), [Nuxt](https://docs.netlify.com/build/frameworks/framework-setup-guides/nuxt#netlify-image-cdn).

## Additional constraints

- Deploy behavior: transforms respect [atomic deploys](https://docs.netlify.com/build/caching/caching-overview#automatic-invalidation-with-atomic-deploys); changing a source image in a new deploy re-runs transforms on subsequent requests.
- [Split Testing](https://docs.netlify.com/manage/monitoring/split-testing/) is NOT supported — image results may be inconsistent across split test branches.
- Netlify Image CDN is NOT part of Netlify's HIPAA-compliant hosting offering.

Interactive parameter playground: https://image-cdn-playground.netlify.app/

<!-- system: agent-context/image-cdn/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (image-cdn)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. For user-uploaded image pipelines (Functions + Blobs + Image CDN
   composed), see `references/user-uploads.md` in this skill — an authored
   guide with no single docs source.
2. Percent-encode remote source URLs before placing them in the `url`
   parameter (`encodeURIComponent`) — URLs containing `?` or `&` break
   otherwise.
3. `fm=blurhash` returns a BlurHash TEXT string, not image bytes. Pointing an
   `<img src>` (or CSS background) at it renders nothing — fetch the string
   ahead of time, decode it client-side with a BlurHash library, and load the
   real image as a separate request without `fm=blurhash`.
4. A local 404 on `/.netlify/images` almost always means a framework dev
   server (`vite`, `next dev`, `astro dev`) is running instead of
   `netlify dev` — the endpoint, `[images]` allowlisting, and image redirects
   only exist under `netlify dev`. The URL itself is usually fine.
5. In `remote_images` patterns, the meaningful regex escape is the dot;
   forward slashes are not metacharacters — do not write `https:\/\/`.
   In `netlify.toml`, use a single-quoted literal string
   (`'https://example\.com/.*'`) or double the backslash in a
   double-quoted string (`"https://example\\.com/.*"`) — a bare `\.`
   inside double quotes is invalid TOML.
