# Recover animations from the source code

Screenshots show *what* moves; the site's own JS and CSS say *how*: library, timeline, constants, shaders, trigger rules. Read them before building any non-trivial motion. Guessing produces a generic look-alike (a grid instead of a WebGL helix, a fade instead of a GSAP char timeline). Recovered code is evidence to **port** into clean components, not a bundle to paste.

Scripts live in `scripts/` next to this skill; run them from the app root.

## 1. Get the raw files, all of them

Markdown/reader fetches drop CSS and JS. Download the real ones:

```
node .agents/skills/clone-website/scripts/fetch-source.mjs <url> --out docs/research/<site>/source
```

It follows `<script>`/`<link>` tags, Next.js RSC chunk references, webpack lazy-chunk maps, and **script paths written inside other JS** (layout chunks that inject `/vendor/js/*.js`, loaders that add `ripple.js` later). These second- and third-level files are often where all the animation lives; a scan of first-level bundles alone finds only libraries. `REPORT.md` ranks files by library/runtime signals (`webgl`, `shader`, `IntersectionObserver`, `injectsScripts`, …) and `shaders/` holds every GLSL string found in app code, named by its variable (`fragmentHelix`, `vertexFlow`, …).

App code shows signals with few libraries; big files with one library are vendor bundles. If something visible is still unexplained, open files flagged `injectsScripts` with find-code and follow what they load.

## 2. Look at the rendered page, not the SSR HTML

```
node .agents/skills/clone-website/scripts/capture.mjs <url> --out docs/research/<site>/capture --outline --rem
```

`outline.txt` is the DOM after JS ran and the page was scrolled through, with sizes and `fixed`/`sticky` markers. Elements absent from the SSR HTML (canvases, overlays, cursor labels, injected sliders, menu backgrounds) were created by script — their class names are your search terms. `canvas … <-- runtime renderer` lines mean WebGL/2D effects you must recover, not draw.

`rem.txt` shows the root font-size across widths. Sites that set `html { font-size: 1vw }` (or similar) scale every `rem`; reproduce that rule first or all sizes drift at other widths.

## 3. Read the code for each effect

```
node .agents/skills/clone-website/scripts/find-code.mjs docs/research/<site>/source/files "<class-or-name>" --context 800
```

For each visible effect, search the class names from the outline, then follow the function you land in. Record:

- **Trigger**: load timeline, IntersectionObserver (`rootMargin`, `threshold`, which class it adds — e.g. `show`, `on-show`, `fade`), scroll formula, pointer, click handler, timer interval.
- **Numbers**: durations, eases (`expo.out`, `power2`), staggers, delays, intervals (`data-time`), speeds (`px/frame`), lerp factors, clamp ranges, parallax `data-speed` per element group.
- **Library options**: Splide/Swiper config objects, ScrollTrigger `start`/`end`/`scrub`, Lenis options.
- **Renderers**: camera (fov, position), geometry segments, uniforms and their drivers, the shader pair (already in `shaders/`), texture loading, hover raycasts, resize logic, mobile/desktop gating (`isMobileDevice`, `matchMedia`).
- **Hidden state**: classes toggled on `html`/`body` (`no-scroll`, ratio classes chosen from `innerHeight / innerWidth`), DOM injected at runtime (SVG blob paths with `pathshow`/`pathhide` attributes, labels, clones).

Port the algorithm with the same constants and shaders into a typed module (`mountX(canvas, items) => dispose`) and install the same library (gsap, three, …) when the source uses one. Only fall back to an approximation when the code truly cannot be obtained, and say so in the delivery notes.

## 4. Port the CSS with its context

```
node .agents/skills/clone-website/scripts/css-pick.mjs <css dir> --base
node .agents/skills/clone-website/scripts/css-pick.mjs <css dir> --match "title-page|text-inner|link-other" --exclude "slidebox"
```

`--base` prints `:root` variables, `html`/`body` sizing per breakpoint, `@font-face` families, `@keyframes`, `@property`. `--match` prints matching rules grouped under their original `@media`. Porting these into a scoped stylesheet that keeps the source class names is faster and more faithful than translating to utilities; plain (unlayered) CSS already outranks Tailwind's layers. Rename only classes that collide with utilities you use (`.grid`, `.hidden`, `.container`).

Keep `@property` declarations (animated custom properties such as a rotating conic border `--angle`) and per-breakpoint overrides together with the base rules.

## 5. Extract content instead of retyping it

Copy, lists, logos and project data come out of the rendered DOM with a small Playwright/DOM script into one data module (`data.ts`). Download images to `public/sites/<site>/` and generate the data from the same pass so paths match. Check that two sources don't map to one filename.

## 6. Compare like with like

Run capture with identical options on source and local:

- Time-driven scenes (slideshows, intros): `--timeline 1000,2500,6000,11000`.
- Tall/sticky scroll scenes: `--progress ".scene" --steps 0.1,0.4,0.8`.
- Menus, tabs, modals: `--click ".menu-button" --click-times 150,400,2500`.
- Whole pages: `--scroll`, and compare `page height` lines — a large difference points to a missing or mis-sized section.

When something still looks off, **measure it in the source** with `getBoundingClientRect()` rather than estimating from a screenshot (one clone sized logo tiles at 7rem; the source used 25rem because each logo image contained three logos).

Pitfalls seen in practice:

- `scroll-behavior: smooth` on `html` makes `scrollTo` animate; measure with `behavior: "instant"` or results are taken mid-scroll.
- Sites with their own smooth-scroller lag behind programmatic scroll; wait or compare at several positions.
- Turbopack can serve a stale stylesheet or client bundle after edits on slow/network drives; if served CSS or hydration output doesn't match the file, stop the dev server and delete `.next`.
- New React lint rules reject `setState` called synchronously in effects and reading `ref.current` during render; structure controllers (menus, labels, observers) around event handlers and lazily created objects.
- A dev server left running holds port 3000; a second `next dev` exits. Stop the old one instead of switching ports.
