# Behaviors observed during interaction sweep

## Scroll behaviors
- **Native browser scroll** — no Lenis, no Locomotive, no scroll-snap on the body. Smooth scroll feel is the default native one.
- **Header transition:** the `<header>` is given an additional class `fixedHeader` once you scroll past ~80px. On the home variant, this swaps the background from transparent → white and swaps logo white → dark. CSS class is added by `main.js`. (Class actually present in DOM after page settles: `header.header-style1.menu_area-light.fixedHeader`)
- **WOW.js reveals:** sections with `.wow.fadeInUp` (and `data-wow-delay`) start at `visibility:hidden; opacity:0; transform: translate3d(0, 30px, 0)` and animate to `opacity:1; transform: none` after IntersectionObserver fires.
- **Odometer counters** (about-us "28+", counter-style1 268/823/252/964): trigger when the counter enters viewport, animate 0→target over ~1.5s.

## Hero carousel
- 3 slides, owl-carousel, autoplay 7000ms, `animateIn: fadeIn / animateOut: fadeOut`, smartSpeed 900ms
- Left/right arrow buttons (round dark-red, themify chevrons) visible only on xl
- Dots visible only mobile
- Bottom-left decorative red square (10×10 absolute), bottom-left border box, top-left animated white dot, right-side animated red dot, and a giant red gradient diamond shape on right (`banner-shape1`, `banner-shape2`)

## Services grid
- First card is `.active` (pink wash bg). Hover any other card → it gets the same pink wash + icon round-shape pops a red ring
- 4 cards arranged 2×2 with no gap (g-0)
- Each card has a small pink circle (`.round-shape`) behind a 60×60 PNG icon

## About Us
- Two stacked images on the left: `about-01.jpg` (400×609 portrait, radius 10) is the base, `about-02.jpg` (300×262) sits as a positioned-absolute card top-15 right
- White card overlay bottom-10 left-10 with odometer "28+" and "Years of experience"
- Two red watercolor shapes (`about-shape1` and `about-shape2`) accent the right edge of the image
- Right column: heading + lead (`text-primary` red lead) + 3 checklist items (first `.active`) + video CTA card with play button and "Sandra Braun / Senior Executive"
- Decorative `line-01.png` red squiggle floating in the top right

## Counter
- Red full-bleed section, 4 stat columns
- Behind: three decorative shapes (`counter-shape1/2/3`) — large red pie outline, smaller decorations
- 41% / 30% pie-charts visible in earlier screenshots come from CSS conic-gradient circles (banner shape decoration that extends from hero — but they actually originate from `.banner-shape` decorations in CSS; double-check at build time)

## Why Choose Us
- H2 centered up top
- Three left-side feature cards, three right-side feature cards, central girl-headphones illustration (`why-choose-us-01.png`)
- Each feature has a round pink "icon-box" pill behind a small PNG icon
- Left side text aligns right, right side text aligns left
- Decorative `line-02.png` red squiggle at bottom-left

## Offer
- Left half: dark `bg-secondary` block with white H2, white paragraph, small icon row, "Get Started" white pill button
- Right half: photo (`01.jpg`) with no overlay; two triangular red shape decorations on top-right edges

## Pricing plans
- 3 cards, equal width
- Cards 1 & 2: white bg, ti-rss-alt and ti-desktop circular icons on top
- Card 3: dark `bg-secondary` with two stacked icons, white text, white CTA button
- Hover: lifts card and adds shadow
- Three ambient decorations (red dot, outlined dot, large outlined rectangle) floating around

## Streaming
- Section has dark photo bg (`bg-02.jpg`) with 80% dark overlay
- Centered white H2
- 5-up owl carousel (responsive 1/2/3/4/5 across breakpoints), autoplay 7s, 25px gap
- Each card: rounded image with centered red play button (`.video_btn`), white channel title under
- `streaming-shape2` decorative wave on right

## Blog
- 3 blog cards in 1/3 columns
- Each card: image with rounded-top, large red date pill overlapping top-left of card body, category tag (uppercase red), title link, footer with author+comment count

## Footer
- Dark `bg-secondary` everywhere
- Top contact row: logo, phone, email, location — each with a white icon and left border separator
- Mid row: Newsletter form (email input + paper-plane btn), Quick Links, Our Services, Schedule with `ti-time` icons
- Bottom bar: copyright left, "Follow Us:" + 4 social icons right (facebook, x-twitter, youtube, linkedin)

## Hover states
- `.butn:hover`: text color flips, bg shrinks via `transform: translateY` (subtle), via `transition: all`
- `.text-primary` heading title links: color stays red on hover
- `.white-hover:hover`: forces white text
- Image card hover (blog, service): scale 1.05 inside overflow-hidden parent
- Nav top-level items: red underline / red text on hover

## Responsive
- Container max widths step through Bootstrap breakpoints (576/768/992/1200/1400)
- Hero text drops from `display-1` (80px) down at md/sm — content stacks
- Service grid goes 4→2→1 across breakpoints
- Why Choose Us: middle illustration hidden below lg (`d-none d-lg-block`)
- Streaming carousel: 1 → 2 → 3 → 4 → 5 cards depending on viewport
- Footer collapses to single column below sm

## Excluded from clone
- Cookiebot banner, themeforest preview chrome (buy-theme pill, wlt-sidebar)
- Preloader (`#preloader`)
- Top search overlay
- Mobile hamburger menu animation (we'll keep a simpler responsive nav)
