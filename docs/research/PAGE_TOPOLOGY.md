# Page Topology — help.hbomax.com/us/Home/Index

Single-page help center. All content fits within approximately 1415px tall (desktop 1440px wide).

## Top-to-bottom sections

1. **Site Header** (`#Site-header.Site-header.AtTop`) — fixed top, z-100
   - bg `#252525`, height 94px, full width
   - Flex: left = HBO Max logo SVG + "Help Center" title text in white
   - right = Globe icon + "United States" + chevron + "English" + chevron
   - Interaction: static (no scroll change observed — has "AtTop" class which never changes during normal scroll since page fits viewport)

2. **Alert Section** (`#AlertSection > section.alertsv2.AlignCenter.info`)
   - bg `rgba(113,184,242,0.1)` (soft blue tint), height 73px
   - Inline info icon + message + inline "Read more" blue link + right-side X close button
   - Content: "'This account belongs to someone else' message Read more — If you're getting this..."
   - Interaction: X closes it (toggle hidden)
   - Sits below fixed header (top padding on main content accounts for header)

3. **Main content wrapper** (`main.Site-content.Site-content--full`)
   - bg inherited from `.SiteParent.Home` = `#f5f5f5`
   - Vertical flex column, no padding
   - Side gutters: content-containers use `margin: 0 122px` giving max-effective-width ~1353px at 1597px viewport.

   Within main:

   3a. **Search block** (`.SearchTitle` + search input + `.PopularBlock`)
       - `.SearchTitle` div: "How can we help?" — 40px/47px weight 500 #000, padding 70px 0 32px
       - Search input: rounded-pill, white bg, 1px light gray border, 50px radius, padding 6px 35px 6px 15px, placeholder "Example: How do I sign in?", magnifier icon on left inside rounded box
       - `.PopularBlock`: "**Popular:**" label + 3 blue links separated by commas

   3b. **Categories** (`section.categories` containing 2× `.CategoryGroup`, each with 2× `.CategoryHolder`)
       - h2.CategoriesTitle "Topics" — 24px weight 500 #0f0f0f
       - `.categories`: flex row gap 25px, justify-center, padding 30px 0 18px, margin 0 122px
       - `.CategoryGroup`: flex row gap 25px (holds 2 cards)
       - `.CategoryHolder`: flex col (width 319px)
         - `.category`: bg white, radius 8px, padding 30px 30px 23px 32px, shadow rgba(223,223,223,0.2) 0 0 30px 0, text-align center
           - `.CategoryHeaderRow > a.cat-link`: circle icon bg (black 70px diameter) with white SVG + h2.cat-heading (18px 500 #0f0f0f)
           - `.CategoryBody`: 3 list items (each an `<a>` 16px 400 #545454) + `.ViewAll` link (blue #116fbb, 16px 500 "View all")
       - 4 cards: Sign Up & Get Started, Watch HBO Max, Account & Sign In, Billing & Subscription

   3c. **KBLists** (`.KBLists` with `.FeaturedBlock` + `.HowDoIBlock`)
       - Two white rounded boxes (radius 8px), padding 25px 45px 31px
       - Each has `.FeatureWidth` with `.FeaturedTitle` (24px weight 500 #0f0f0f)
       - Featured articles: bullet list of 2 links (blue)
       - How do I...?: bullet list of 3 links (blue)
       - Layout: flex row gap 25px, padding 42px 0 40px, margin 0 122px

4. **Site Footer** (`.Site-footer`) bg `#252525`, 211px tall
   - Footer links: Give Feedback, Privacy Policy, Terms of Use, Cookie Settings
   - "Follow us" + X/Twitter SVG icon link
   - Copyright: "© 2026 WarnerMedia Direct, LLC. All Rights Reserved. HBO Max is used under license."

5. **Floating Contact Us button** (fixed bottom-right)
   - Rounded pill, "Contact Us" white text, dark background
   - Position: fixed, right, bottom

## Interaction model
- Entire page is **static** — no scroll-driven animations, no tabs, no carousels
- Only interactions: search submit, alert close (X), Contact Us click, link hovers (color/underline)
- No Lenis / Locomotive Scroll — uses standard browser scroll
- Body fits viewport at desktop 1440px — page height ~1415px

## Page-level layout
```
body
└─ .SiteParent.Home (bg #f5f5f5, flex col)
   ├─ #Site-header (fixed, bg #252525)
   ├─ #AlertSection (bg #71b8f2 @ 10%)
   ├─ main.Site-content (flex col)
   │  ├─ .SearchTitle
   │  ├─ search input
   │  ├─ .PopularBlock
   │  ├─ h2.CategoriesTitle "Topics"
   │  ├─ section.categories
   │  └─ .KBLists
   └─ .Site-footer (bg #252525)
```
Plus a fixed `.ContactUs` button overlay (bottom-right).
