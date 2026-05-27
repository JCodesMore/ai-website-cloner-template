# Data Scraping Design — Missing Detail Filler

## Problem

The clone project at `C:\Users\Z1858\my-clone` has complete listing data (products, articles, institutions) but lacks detail page content for most items. Comparison against `sitemap.xml` shows:

| Data | Existing | Required | Missing |
|------|----------|----------|---------|
| Product details | ~12 | ~214 | ~202 |
| Article details | ~3 | ~108 | ~105 |
| Institution details | ~5 | ~34 | ~29 |

The live website `bbxin.com` is server-rendered PHP with no public JSON API. HTML scraping is the only viable approach.

## Approach

Build a standalone Node.js scraper (`scripts/fetch-missing-data.mjs`) that:

1. Parses `sitemap.xml` to get all URLs
2. Categorizes URLs by type (product, article, institution, page)
3. Cross-references against existing JSON data files to identify missing IDs
4. Fetches each missing page via HTTP and extracts structured data using cheerio
5. Appends extracted data to the appropriate JSON files

## Architecture

```
sitemap.xml
    ↓ (parse & classify)
URL Categorizer ──→ Missing ID Detector
                         ↓ (missing IDs only)
                    Scraper Orchestrator
                      ↙    ↓    ↘
               Product   Article  Institution
               Extractor Extractor Extractor
                      ↓    ↓    ↓
               data/productDetails.json
               data/articleDetails.json
               data/institutionDetails.json
               data/scraper-errors.json (failures)
```

### Components

**URL Categorizer** — parses sitemap XML, groups URLs by type:
- `/products/:id` or `/products/:category/:id` → product
- `/articles/:id` → article
- `/institutions/:id` → institution
- `/pages/*`, `/comments`, `/cates/*`, etc. → page (static, skip)

**Missing ID Detector** — reads existing JSON files, compares against sitemap IDs, produces a list of missing IDs for each type.

**Scraper Orchestrator** — iterates over missing IDs, fetches each page, delegates to the appropriate extractor, writes results. Implements rate limiting, retry, and progress reporting.

## Extractors

### Product Extractor

**Input:** HTML of `/products/{id}.html` or `/products/{category}/{id}.html`

**Fields to extract:**
- `id` — from URL
- `name` — `.ley-prodetail-name` text
- `maxAmount` — `#maxAmount` sibling value
- `term` — text from detail table
- `rate` — text from detail table  
- `repayment` — text from detail table
- `applyCount` — text from detail table
- `institution` — institution name
- `advantages` — from `.ley-prodetail-adv` list items
- `introHtml` — `.ley-prodetail-intro` inner HTML

**Note:** Only `introHtml` is truly missing from existing data. Other fields may already exist in listing data. The scraper collects all fields for completeness but primarily fills the detail blob.

### Article Extractor

**Input:** HTML of `/articles/{id}.html`

**Fields to extract:**
- `id` — from URL
- `title` — article title text
- `date` — publish date string
- `viewCount` — view count number
- `bodyHtml` — `.ley-article-body` inner HTML

### Institution Extractor

**Input:** HTML of `/institutions/{id}.html`

**Fields to extract:**
- `id` — from URL
- `name` — institution name
- `fullName` — full institution name
- `logo` — logo image URL
- `website` — official website URL
- `introHtml` — `.ley-inst-profile-intro` inner HTML

## Implementation Details

### Tech Stack
- **Runtime:** Node.js 18+ (built-in `fetch`)
- **Parsing:** `cheerio` (npm package for server-side jQuery-like API)
- **No build step:** plain `.mjs` script, run with `node scripts/fetch-missing-data.mjs`

### Rate Limiting
- 1-2 second random delay between consecutive requests
- Configurable via `SCRAPER_DELAY_MS` environment variable

### Error Handling
- Per-page try/catch, failures logged to `data/scraper-errors.json`
- Automatic retry (2 attempts per failed page)
- Script is idempotent — safe to re-run, skips already-filled IDs

### Progress Reporting
- Console output: `[products] 12/202 | [articles] 5/105 | [institutions] 3/29`
- Updates every 5 items

### Resume / Interrupt Safety
- Before writing to JSON, the script records the ID in a temporary set
- On restart, already-processed IDs are skipped
- Atomic writes: data is written to a temp file, then renamed

## Error States

| Scenario | Behavior |
|----------|----------|
| Page returns 404 | Skip, log to errors, continue |
| Network timeout (10s) | Retry once, then skip and log |
| cheerio parse failure | Log error with HTML snippet, continue |
| JSON file write failure | Abort with error message |
| Invalid HTML / missing selectors | Log warning, store partial data |
| Script interrupted mid-run | Resume on next run (tracks progress) |

## Files Modified
- `scripts/fetch-missing-data.mjs` — new file, the scraper
- `package.json` — add `cheerio` dependency
- `data/productDetails.json` — updated
- `data/articleDetails.json` — updated
- `data/institutionDetails.json` — updated
- `data/scraper-errors.json` — new file, error log

## Out of Scope
- No changes to any Next.js routes or components
- No CSS/visual changes
- No SPA-style data fetching — this is a one-time data population script
