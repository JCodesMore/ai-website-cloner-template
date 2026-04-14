# Design Tokens — help.hbomax.com

## Fonts
Custom: **"Street 3"** family (HBO proprietary), fallback `NotoSans, Arial, sans-serif`.

Font files (WOFF2, self-hosted at `https://help.hbomax.com/fonts/`):
- `HandsetSansUI-Regular.woff2` → maps to weights 200, 400
- `HandsetSansUI-Bold.woff2` → maps to weights 500, 700

In the clone:
- Download both WOFF2 files to `public/fonts/`
- Declare via `@font-face` in `globals.css` with both `font-weight: 400` and `font-weight: 500 700` variants
- Set body font to `"Street 3", NotoSans, Arial, sans-serif`

## Colors

| Token              | Value                         | Usage                              |
|--------------------|-------------------------------|------------------------------------|
| `--page-bg`        | `#f5f5f5`                     | Main page background               |
| `--dark`           | `#252525`                     | Header + Footer background         |
| `--alert-info-bg`  | `rgba(113, 184, 242, 0.1)`    | Info alert banner background       |
| `--card-bg`        | `#ffffff`                     | Topic cards, featured boxes        |
| `--card-shadow`    | `rgba(223, 223, 223, 0.2) 0 0 30px 0` | Soft shadow on white cards  |
| `--text-black`     | `#000000`                     | "How can we help?" title           |
| `--heading`        | `#0f0f0f`                     | Topics, Featured, How do I, cat-heading |
| `--body`           | `#545454`                     | Regular body text + secondary links |
| `--link-blue`      | `#116fbb`                     | "View all", "Read more", Featured/HowDoI links, Popular links |
| `--icon-circle`    | `#000000`                     | Circle bg behind topic icons       |
| `--border`         | `#d9d9d9` approx              | Search input border                |

## Typography scale

- 40px / 47px, weight 500, #000 — Search title "How can we help?"
- 24px / normal, weight 500, #0f0f0f — Topics / Featured articles / How do I...?
- 18px / normal, weight 500, #0f0f0f — Category card heading
- 16px / 20px, weight 400, #545454 — Body + most links
- 16px / 28px, weight 400, #545454 — Popular block (bold "Popular:" label)
- 16px / 22px, weight 400, #000 — Search input text

## Spacing / layout
- Outer side gutters desktop: **122px** (margin-left/right on `.categories` and `.KBLists`)
- Effective content width at 1597 viewport: 1353px
- Vertical gap between sections: mainly 25px
- Card gap: 25px (in `.CategoryGroup` and `.KBLists`)
- `.SearchTitle` padding: 70px 0 32px
- `.categories` padding: 30px 0 18px
- `.KBLists` padding: 42px 0 40px
- Card inner padding: 30px 30px 23px 32px (top right bottom left)
- Featured/HowDoI box padding: 25px 45px 31px

## Radii
- Cards: 8px
- Search input: 50px (pill)
- Icon circle bg: circular (50%)
- Contact Us button: pill / full

## Shadows
- Card shadow: `0 0 30px 0 rgba(223,223,223,0.2)` (subtle halo)

## Breakpoints (inferred — to be verified mobile)
- Desktop layout: ≥ 992px (side margins reduce below this)
- Mobile: < 768px (cards likely stack)
