# Product Data Sync Tool Design

## Purpose

Replace reactive "find difference → manually patch" cycle with a unified CLI tool that brings product data fully in sync in one command.

## Trigger

Manual: `node scripts/sync-products.mjs`

## Workflow

1. Scan product IDs from 1 to (max existing ID + 200), probing bbxin.com
2. For each ID not in local data: fetch the product detail page
3. Write all fields to both listing JSON and detail JSON in one pass
4. Skip existing IDs (no overwrite)

## Fields scraped per product

| Field | Destination |
|-------|-------------|
| id, name, institution (short), image | `*Products.json` |
| maxAmount, term, rate, repayment | `*Products.json` |
| institutionFullName, institutionHref | `productDetails.json` |
| advantages (tags) | `productDetails.json` |
| introHtml | `productDetails.json` |

## Output

- `src/data/personProducts.json` — new products appended
- `src/data/productDetails.json` — new detail entries appended

## What this eliminates

- Missing products causing 404 detail pages
- Missing `institutionFullName` causing search gaps
- Missing `advantages` causing filter gaps
- Missing `image` causing broken logos

## What stays unchanged

- Search logic (already fixed: full-name matching, dedup)
- Filter logic (already fixed: category fallback in `filterByAdv`)
- UI styles (reserved for future ui-ux-pro-max-skill redesign)

## Related scripts (deprecated)

- `scripts/scrape-advantages.mjs` — superseded
- `scripts/scrape-advantages-full.mjs` — superseded
- `scripts/fill-details.mjs` — superseded
