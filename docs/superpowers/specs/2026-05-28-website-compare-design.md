# Website Comparison Tool — Pixel + DOM Validation

## Problem

The bbxin.com website clone at `my-clone` has high completion but pixel and structural discrepancies remain. Manual comparison of 164 product detail pages × 2 viewports (desktop + mobile) is impractical. An automated tool is needed to detect differences in rendering (pixel-level) and structure (DOM-level including computed styles).

## Architecture

Three-phase pipeline with disk-based intermediate storage:

```
capture.mjs  ──→  compare.mjs  ──→  report.mjs
  (采集)              (对比)              (报告)
```

Each phase is independently runnable. Failed/corrupted outputs from any phase can be re-generated without re-running prior phases.

### Output Layout

```
docs/compare/
  captures/
    local/
      desktop/  <productId>.png
      mobile/   <productId>.png
    remote/
      desktop/  <productId>.png
      mobile/   <productId>.png
    dom/
      local/    <productId>.json       DOM snapshot + computed styles
      remote/   <productId>.json       DOM snapshot + computed styles
  results/
    pixel/
      <productId>_desktop_diff.png     Diff highlight images
      <productId>_mobile_diff.png
      score.json                       Aggregate pixel diff scores
    dom/
      <productId>.json                 Structured diff output
  report.html                          Visual comparison report
```

## Phase 1 — Capture (capture.mjs)

### Input
- `src/data/productDetails.json` — 164 products with `id` fields

### URLs
- **Local:** `http://localhost:3000/products/{id}`
- **Remote:** `https://bbxin.com/products/{id}.html`

### Viewports
- Desktop: 1280×800
- Mobile: 375×812

### Process
1. For each product × viewport:
   - Navigate to URL with `networkidle` wait
   - Wait for `.ley-detail-content` element to be visible
   - Take full-page screenshot (PNG)
   - Extract DOM snapshot via `page.evaluate()`:
     - `document.title`, `<meta description>`
     - Recursive element walk: tagName, className, textContent, attributes
     - Computed style for each element: color, font-size, font-weight, line-height, text-align, padding, margin, background-color, border, border-radius, box-shadow, display, width, height
     - `<a>` href, `<img>` src/alt
   - Save screenshot + DOM JSON to `docs/compare/captures/`
2. Concurrency: 4 parallel pages
3. Timeout: 30s per page, skip on failure (log to error list)
4. Idempotent: skip existing files unless `--force` flag passed

### Notes
- Products with external jump URLs in `productJumpUrls.json` are still captured — the product detail page is accessible at `/products/{id}.html` on bbxin.com regardless of the "立即申请" button's destination.
- Products whose local route 404s (not in `productDetails.json` with matching ID) are skipped.

## Phase 2 — Compare (compare.mjs)

### Pixel Comparison
- Load local + remote screenshots using sharp + PixelMatch
- For each product × viewport:
  - Resize to same dimensions if mismatched (pad/crop to match)
  - Run PixelMatch diff (threshold: 0.1)
  - Output diff highlight image (red = changed pixels)
  - Calculate diff percentage: `diffPixels / totalPixels * 100`
  - Threshold: >5% diff = PIXEL_FAIL, else PIXEL_PASS
- Save per-viewport diff images to `docs/compare/results/pixel/`
- Save aggregate scores to `score.json`

### DOM Comparison
- Load both DOM snapshots
- Compare at these levels:

**Metadata:**
- Title match
- Meta description match

**Structural:**
- Total element count diff
- Missing/extra structural sections (by className or tag path)
- Element count per section

**Text content:**
- Extract all text nodes, compare per section
- Highlight missing/extra/changed text fragments

**Attributes:**
- `<a href>` — compare target URLs (handle relative vs absolute)
- `<img src>` — compare image paths
- `<img alt>` — compare alt text
- Class list diff per element

**Computed Styles:**
- For each matched element, compare key style properties:
  - `color`, `font-size`, `font-weight`, `line-height`
  - `padding`, `margin` (all sides)
  - `background-color`, `border`, `border-radius`, `box-shadow`
  - `display`, `width`, `height`
  - `text-align`
- Tolerance: ±1px for dimensions, exact match for colors (hex comparison)
- Flag any property outside tolerance as a style diff
- Count style diffs per product

**Output:** Per-product JSON with structured diff data to `docs/compare/results/dom/`

### Overall Scoring
Each product gets a combined verdict:
- **PASS** — No pixel diff >5%, no structural diffs, no style diffs
- **PIXEL_WARN** — Pixel diff >5% but no structural/style diffs
- **MINOR** — Style-only diffs (e.g., font-size off by 1px)
- **FAIL** — Structural differences (missing/extra elements, text mismatch)
- **ERROR** — Capture failed for either local or remote

## Phase 3 — Report (report.mjs)

Generate `docs/compare/report.html` — a self-contained HTML file (no external deps):

### Dashboard Section
- Summary bar: Pass / Pixel Warn / Minor / Fail / Error counts
- Filter buttons to show only FAIL, MINOR, etc.
- Search by product name or ID

### Product Cards (sorted by severity)
Each card shows:
- Product name + ID + overall verdict badge
- Desktop view: side-by-side local vs remote screenshot with diff overlay
- Mobile view: same layout below desktop
- Pixel diff percentage for each viewport
- DOM diff summary count (structural / text / style)
- Expandable detail section:
  - Structural diffs list
  - Text diffs with before/after
  - Attribute diffs per element
  - Computed style diffs table (property | local | remote | diff)

### Interaction
- Click to expand/collapse DOM diff details
- Hover on diff image highlights pixel-change regions
- Sort by: severity (worst first), product ID, diff percentage

## Implementation Plan

### Scripts

All scripts live in `scripts/`:

1. `scripts/compare-capture.mjs` — Phase 1: capture screenshots + DOM
2. `scripts/compare-pixel.mjs` — Phase 2a: pixel diff
3. `scripts/compare-dom.mjs` — Phase 2b: DOM comparison
4. `scripts/compare-report.mjs` — Phase 3: HTML report

### Dependencies to install
- `pixelmatch` — pixel-level image diffing
- `sharp` — image resizing/handling (already likely present)
- `playwright` — browser automation (to be installed)

### Package.json scripts
```json
{
  "compare:capture": "node scripts/compare-capture.mjs",
  "compare:pixel": "node scripts/compare-pixel.mjs",
  "compare:dom": "node scripts/compare-dom.mjs",
  "compare:report": "node scripts/compare-report.mjs",
  "compare:all": "npm run compare:capture && npm run compare:pixel && npm run compare:dom && npm run compare:report"
}
```

### Notes
- Remote URL pattern to verify during implementation: `https://bbxin.com/products/{id}.html`
- Products with external jump URLs are still compared — the product detail page itself is accessible
