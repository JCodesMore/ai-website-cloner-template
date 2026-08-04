# Testimonials + JourneyTimeline Specification

## Overview
- **Target files:** `src/components/Testimonials.tsx`, `src/components/JourneyTimeline.tsx`,
  `src/hooks/useInView.ts`
- **Used by:** `/` only
- **Interaction model:** Testimonials = time + click + touch driven carousel.
  JourneyTimeline = scroll-driven one-shot entrance.

> **Font note:** both sections are bespoke `fu-`/`journey-` embeds. `.journey-section_container`
> declares `Inter, sans-serif` → use `font-inter`. The testimonials embed declares
> `'CameraPlainVariable', -apple-system, BlinkMacSystemFont, sans-serif`; the CDN font is
> **omitted per `FIXES.md` #12** (`cdn.gpteng.co` third-party leftover), so the section falls
> back to the project `font-sans` stack, which is what the live site resolves to anyway
> whenever that CDN request fails.

---

## Colour audit — read this before touching the reds

The source uses **four** distinct reds across these two sections. `FIXES.md` records the
decision to *preserve each red exactly where it appears*, so all four are reproduced verbatim.

| Hex | Where in these sections | Token in `globals.css` |
|---|---|---|
| `#bc1a1a` | `journey-section_eyebrow`, `journey-accent`, `journey-step_label`, `journey-timeline-line` (`#bc1a1a26`), icon-wrap hover | `--brand` |
| `#e5341a` | **Every** red in the testimonials embed — badge star, heading accent, avatar, stars, dot active, arrow hover, mini-card active border, CTA hover | `--brand-faq` (named for `/low-doc-loans`, same value) |
| `#E63946` | `stroke` on all six `journey-step` SVGs — a *fifth* red not in `DESIGN_TOKENS.md` | none |
| `rgba(229,52,26,.35)` | `.fu-testi__mini-card:hover` border | none |

Components use **literal arbitrary values** (`bg-[#e5341a]`), matching the convention already
established in `SiteHeader.tsx` (`bg-[#bc1a1a]`), rather than the `--color-brand-*` utilities.
This keeps the sections independent of another agent's edits to `globals.css`.

---

## Testimonials — `section.rs2-section` › `section.fu-testi`

`rs2-section` is the Webflow `w-embed w-script` wrapper; `fu-testi` is the embedded markup.
**One component.** The wrapper is not cosmetic — see the double-padding note below.

### DOM structure
```
section.rs2-section                       bg #0f0f0f, padding 80px 24px
  div.w-embed.w-script
    section.fu-testi                      bg #111111, padding 80px 24px
      div.fu-testi__inner                 max-width 960px, centred
        div.fu-testi__badge
          span.fu-testi__badge-line       32x1px
          span.fu-testi__badge-star       ★
          span.fu-testi__badge-text       "5.0 on Google — 36 Reviews"
          span.fu-testi__badge-line
        div.fu-testi__heading
          h2                              "Trusted by Australians"
            span.fu-red                   "nationwide"
        div.fu-testi__carousel            relative
          div.fu-testi__track             overflow hidden, radius 16
            div#fuSlides.fu-testi__inner-slides   flex, transform target
              div.fu-testi__slide  x3
                p.fu-testi__quote
                div.fu-testi__reviewer
                  div.fu-testi__avatar    initial letter
                  div
                    div.fu-testi__name
                    div.fu-testi__stars   5x span ★
          button#fuPrev.fu-testi__arrow--prev      ‹  (&#8249;)
          button#fuNext.fu-testi__arrow--next      ›  (&#8250;)
          div#fuDots.fu-testi__dots       3x button.fu-testi__dot
        div.fu-testi__mini-grid           3x div.fu-testi__mini-card[data-idx]
          div.fu-testi__mini-stars        5x span ★
          p.fu-testi__mini-quote          3-line clamp
          div.fu-testi__mini-name
        div.fu-testi__cta
          a.fu-testi__btn                 ★ See all Google Reviews
```

### Double padding is real
Outer `.rs2-section` = `padding: 80px 24px; background: #0f0f0f`.
Inner `.fu-testi` = `padding: 80px 24px; background: #111111`.
Total vertical padding is **160px**, and `#0f0f0f` shows as a 80px/24px band around the
`#111111` block. Reproduced as nested elements, not collapsed.

### Computed styles (verbatim from the embed's scoped `<style>`)

**`.fu-testi`** — width `100%`; padding `80px 24px`; background `#111111`
**`.fu-testi__inner`** — max-width `960px`; margin `0 auto`

**`.fu-testi__badge`** — flex; align/justify center; gap `10px`; margin-bottom `24px`
- `__badge-line` — `32px × 1px`; background `rgba(255,255,255,0.2)`
- `__badge-star` — color `#e5341a`; font-size `14px`
- `__badge-text` — `11px` / `600`; letter-spacing `2px`; uppercase; `rgba(255,255,255,0.6)`

**`.fu-testi__heading`** — text-align center; margin-bottom `40px`
- `h2` — `clamp(34px, 5vw, 54px)` / `700`; line-height `1.15`; `#ffffff`; letter-spacing `-1px`
- `.fu-red` — `#e5341a`; font-style italic; **display block** (forces the line break)

**`.fu-testi__carousel`** — position relative; margin-bottom `32px`
**`.fu-testi__track`** — overflow hidden; border-radius `16px`
**`.fu-testi__inner-slides`** — display flex;
`transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

**`.fu-testi__slide`** — min-width `100%`; background `#1e1e1e`;
border `1px solid rgba(255,255,255,0.08)`; border-radius `16px`; padding `36px 48px`
- `@media (max-width: 600px)` → padding `24px 20px`

**`.fu-testi__quote`** — `clamp(14px, 2.2vw, 17px)`; italic; line-height `1.75`;
`rgba(255,255,255,0.82)`; margin-bottom `28px`; `::before` `\201C` / `::after` `\201D`
**`.fu-testi__reviewer`** — flex; align center; gap `14px`
**`.fu-testi__avatar`** — `42×42`; radius 50%; background `#e5341a`; flex centred;
`16px` / `700`; `#fff`; flex-shrink `0`
**`.fu-testi__name`** — `14px` / `600`; `#ffffff`; margin-bottom `5px`
**`.fu-testi__stars`** — flex; gap `2px`; `span` → `#e5341a`, `13px`

**`.fu-testi__arrow`** — absolute; top `50%`; `translateY(-50%)`; `38×38`;
border `1px solid rgba(255,255,255,0.15)`; radius 50%; background `rgba(30,30,30,0.92)`;
`#fff`; flex centred; z-index `2`; font-size `18px`; line-height `1`;
`transition: background .2s, border-color .2s`; `user-select: none`; `outline: none`;
`-webkit-tap-highlight-color: transparent`
- `:hover` → background `#e5341a`; border-color `#e5341a`
- `--prev` `left: -19px`; `--next` `right: -19px`
- `@media (max-width: 600px)` → `left: 4px` / `right: 4px`

**`.fu-testi__dots`** — flex; justify center; gap `8px`; margin-top `16px`
**`.fu-testi__dot`** — `24×4`; radius `2px`; `rgba(255,255,255,0.2)`; cursor pointer;
`transition: background .25s, width .25s`; border none; padding `0`
- `.is-active` → background `#e5341a`; **width `32px`**

**`.fu-testi__mini-grid`** — grid; `repeat(3, 1fr)`; gap `14px`; margin-bottom `32px`
- `@media (max-width: 640px)` → `grid-template-columns: 1fr`

**`.fu-testi__mini-card`** — `#1e1e1e`; border `1px solid rgba(255,255,255,0.08)`;
radius `12px`; padding `18px`; cursor pointer; `transition: border-color .2s, transform .2s`
- `:hover` → border-color `rgba(229,52,26,0.35)`; `translateY(-2px)`
- `.is-active` → border-color `#e5341a`
- `__mini-stars` — flex; gap `2px`; margin-bottom `10px`; `span` → `#e5341a`, `11px`
- `__mini-quote` — `12px`; line-height `1.6`; `rgba(255,255,255,0.6)`; margin-bottom `10px`;
  `-webkit-line-clamp: 3` (→ Tailwind `line-clamp-3`)
- `__mini-name` — `11px` / `600`; `rgba(255,255,255,0.45)`

**`.fu-testi__cta`** — flex; justify center
**`.fu-testi__btn`** — inline-flex; align center; gap `8px`; padding `13px 28px`;
background transparent; border `1px solid rgba(255,255,255,0.2)`; radius `8px`; `#ffffff`;
`14px` / `600`; letter-spacing `0.3px`; no underline;
`transition: background .2s, border-color .2s`
- `:hover` → background `#e5341a`; border-color `#e5341a`; color `#fff`
- `__btn-star` — `#e5341a`, `14px`, `transition: color .2s`; on button hover → `#fff`
- `href="https://www.google.com/search?q=fundup+au+reviews"` `target="_blank"`

### Content — verbatim

Badge: `5.0 on Google — 36 Reviews` (`&mdash;`)
Heading: `Trusted by Australians` + block accent `nationwide`

**Slides** (in DOM order — this is the carousel order):

| # | Author | Rating | Avatar | Quote |
|---|---|---|---|---|
| 0 | `Martin – Returning Client` | 5 | M | Excellent service, quick replies to emails and phone calls. Always available and on hand to help with any queries or assistance required. Second time we have used Ned for mortgage advice. |
| 1 | `Shannon – First Home Buyer` | 5 | S | Ned was absolutely fantastic! As first home buyers, we couldn't have asked for a better broker. He guided us through every step and made the whole process completely stress free. |
| 2 | `Daniel – Upgrader` | 5 | D | Absolutely fantastic Mortgage Broker. Would highly recommend this bloke to anyone looking to buy a home. He has made the whole experience so easy for us and stress free. He really goes above and beyond and cares about his customers. Thankyou mate for all your help! |

(The separator in every name is an en dash `&ndash;` / U+2013, not a hyphen.)

**Mini-cards** (in DOM order, with their `data-idx`):

| DOM pos | `data-idx` | Name shown | Excerpt shown |
|---|---|---|---|
| 0 | `0` | `Daniel – Upgrader` | `"Absolutely fantastic Mortgage Broker. Would highly recommend this bloke to anyone looking to buy a home..."` |
| 1 | `1` | `Shannon – First Home Buyer` | `"Ned was absolutely fantastic! As first home buyers, we couldn't have asked for better help..."` |
| 2 | `2` | `Martin – Returning Client` | `"Excellent service, quick replies to emails and phone calls. Always available and on hand..."` |

All mini-card excerpts carry their own literal `"` straight quotes in the source markup —
they are part of the text, not pseudo-elements. Kept.

### ⚠️ Live-site defect — reproduced verbatim, needs a call

**The mini-cards are ordered in reverse of the slides, but their `data-idx` counts up 0→1→2.**
Consequences on the live site:

- Clicking the **Daniel** mini-card (`data-idx="0"`) advances the carousel to slide 0 =
  **Martin**. Clicking **Martin** (`data-idx="2"`) shows **Daniel**.
- `is-active` is toggled by `i === cur`, so on load the **Daniel** card is highlighted while
  the **Martin** slide is showing. Cards 0 and 2 are permanently mismatched with the slide.

Reproduced as-is (visuals are identical either way, and this was not one of the defects agreed
during reconnaissance). It is modelled explicitly in code as a `targetIndex` field on
`TESTIMONIAL_MINI_CARDS` so the fix is a one-line change to `[2, 1, 0]` if the user wants it.
**Worth adding to `FIXES.md` once the user decides.**

### Behaviour — source script, verbatim

```js
var cur = 0, total = 3, timer;
function go(n) {
  cur = (n + total) % total;
  slides.style.transform = 'translateX(-' + (cur * 100) + '%)';
  dots.forEach(function (d, i) { d.classList.toggle('is-active', i === cur); });
  minis.forEach(function (c, i) { c.classList.toggle('is-active', i === cur); });
  resetTimer();
}
function resetTimer() {
  clearInterval(timer);
  timer = setInterval(function () { go(cur + 1); }, 5000);
}
fuPrev.onclick = go(cur - 1);  fuNext.onclick = go(cur + 1);
dots[i].onclick = go(i);       minis[i].onclick = go(parseInt(data-idx));

var tx = 0;
slides.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
slides.addEventListener('touchend', e => {
  var diff = tx - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) go(diff > 0 ? cur + 1 : cur - 1);
});
resetTimer();
```

Key point: **`go()` calls `resetTimer()` at the end**, so *any* manual change restarts the
full 5000 ms dwell. Every control routes through the same `go(n)`.

### React implementation notes
- `"use client"`. `useState` for the index; a `useEffect` that **reads `index`** and sets a
  5000 ms `setInterval`. Because `index` is a real dependency, the effect tears down and
  re-arms on every change — which *is* `resetTimer()`, with no extra machinery.
- Slide transform uses three **static** classes (`translate-x-0`, `-translate-x-full`,
  `-translate-x-[200%]`) rather than an inline style. The track's own width equals one slide
  width (each slide is `min-width: 100%` of the track's containing block and overflows), so
  `-100%` / `-200%` of the track are exactly one and two slides.
- Touch uses **native** `addEventListener` on the track with `{ passive: true }` on
  `touchstart`, matching the source. The `touchend` handler uses a functional `setIndex`
  update so the listeners never need re-binding on index change.
- Auto-advance is **paused** under `prefers-reduced-motion: reduce`.
- `‹` / `›` (U+2039 / U+203A) and `★` (U+2605) are kept as **literal glyphs**, not SVG. The
  embed sizes them typographically (`font-size: 18px` / `13px` / `11px` / `14px`) and neither
  the CDN brand font nor Instrument Sans contains them, so the live site falls back to a
  system font for these exact characters — using `StarIcon`/`ArrowRightIcon` (24-unit stroke
  geometry, `fill: none`) would change the optical weight and baseline alignment.

### Accessibility additions (no visual change)
The source ships zero a11y affordances beyond the two arrow `aria-label`s. Added:
- `aria-roledescription="carousel"` on the region, `aria-live="polite"` on the track
- `role="group"` + `aria-roledescription="slide"` + `aria-label="N of 3"` per slide, and
  `aria-hidden` on the two off-screen slides so only the current quote is announced
- Dots and mini-cards promoted from `div`/bare `button` to `<button type="button">` with
  `aria-label` and `aria-current`
- Descriptive `aria-label`s on the arrows ("Previous testimonial" / "Next testimonial")

Tailwind breakpoints are pinned to the source's own values with arbitrary variants:
`min-[601px]:` for the 600px slide/arrow query and `min-[641px]:` for the 640px mini-grid
query — Tailwind's stock `sm` (640px) would fire one pixel early.

---

## JourneyTimeline — `section.journey-section`

### DOM structure
```
section.journey-section                   bg #0f0f0f, py 96px, relative, overflow hidden
  div.journey-section_container           max-width 1280, px 16, font Inter
    div.journey-section_header            text centre, max-width 640, centred
      p.journey-section_eyebrow           "HOW IT WORKS"
      h2.journey-section_h2               "Your " + span.journey-accent "journey" + " with us"
      p.journey-section_subtext
    div#journey-grid.journey-section_grid
      div.journey-timeline-line           mobile-only vertical rule
      div.journey-step  x6                (each observed individually)
        div.journey-step_icon-wrap
          svg  28×28  stroke #E63946  stroke-width 2  round caps/joins
          span.journey-step_label         "STEP 0N"
        div.journey-step_content
          h3.journey-step_title
          p.journey-step_text
```

### Computed styles

**`.journey-section`** — background `#0f0f0f`; padding-block `96px`; relative; overflow hidden
**`.journey-section_container`** — max-width `1280px`; margin `0 auto`; padding-inline `16px`;
font-family `Inter, sans-serif`  → identical to the `.container-site` utility + `font-inter`
**`.journey-section_header`** — text-align center; max-width `640px`; margin `0 auto`
**`.journey-section_eyebrow`** — `#bc1a1a`; `12px` / `600`; letter-spacing `.15em`; uppercase;
margin-bottom `12px`
**`.journey-section_h2`** — `#fff`; `44px` / `700`; line-height `1.15`; margin `0 0 16px`
- `@media (max-width: 991px)` → `32px`
**`.journey-accent`** — `#bc1a1a`
**`.journey-section_subtext`** — `#aaa`; `16px`; line-height `1.6`; margin `0 0 64px`

**`.journey-section_grid`** — display grid; `repeat(6, 1fr)`; column-gap `16px`; row-gap `0`;
align-items start; position relative
- `@media (max-width: 991px)` → `grid-template-columns: 1fr 1fr 1fr`
- `@media (max-width: 767px)` → `display: flex; flex-direction: column; gap: 40px`

**`.journey-timeline-line`** — `display: none` on desktop
- `@media (max-width: 767px)` → `display: block`; absolute; `top: 0; bottom: 0; left: 27px`;
  `width: 1px`; background `#bc1a1a26` (= `rgba(188,26,26,.149)`)
- It is the connector behind the stacked mobile steps only; it never renders ≥768px.

**`.journey-step`** — flex; column; align center; gap `16px`; text-align center
- `@media (max-width: 767px)` → row; align-items flex-start; gap `24px`; text-align left

**`.journey-step_icon-wrap`** — flex column; justify/align center; gap `8px`;
`110×110`; padding `16px`; margin-bottom `24px`; background `#2a2a2a`;
border `1px solid #3a3a3a`; border-radius `20px`; flex-shrink `0`; `cursor: default`;
`transition: all .5s`
- `:hover` → border-color `rgba(188,26,26,0.40)`; background `rgba(188,26,26,0.10)`
  (injected at runtime by the section's own inline script, with `!important`)
- `@media (max-width: 767px)` → `56×56`; border-radius `12px`; margin-bottom `0`

**`.journey-step_label`** — `#bc1a1a`; `10px` / `700`; letter-spacing `1.5px`; uppercase
**`.journey-step_content`** — flex column; align center; gap `8px`
**`.journey-step_title`** — `#fff`; `15px` / `700`; line-height `1.3`; **text-align center**
**`.journey-step_text`** — `#aaa`; `13px`; line-height `1.6`; **text-align center**

> Note: on mobile `.journey-step` flips to `text-align: left`, but the title and text keep
> their own `text-align: center`, and `.journey-step_content` keeps `align-items: center`.
> The result is shrink-to-fit, centre-aligned copy in a left-flowing row. Reproduced verbatim.

### Content — verbatim

Eyebrow: `HOW IT WORKS`
Heading: `Your ` + accent `journey` + ` with us`
Subtext: `From the first conversation to ongoing support — here's what working with FundUp looks like.`

| Label | Title | Description | Icon (exact path match in `icons.tsx`) |
|---|---|---|---|
| STEP 01 | Enquiry | Reach out for a free, no-obligation chat. We learn about your goals and situation. | `MessageSquareIcon` |
| STEP 02 | Pre-Assessment | We analyse your financials, assess borrowing power, and identify the best lender options. | `FileSearchIcon` |
| STEP 03 | Doc Collection & Lodgement | We handle the paperwork, package your application, and lodge it with the chosen lender. | `FolderUpIcon` |
| STEP 04 | Approval | Your loan is assessed and approved. We keep you updated at every stage and negotiate on your behalf. | `CheckCircleIcon` |
| STEP 05 | Settlement | Everything is finalised and funds are released. You get the keys — we make sure it's seamless. | `HomeIcon` |
| STEP 06 | Post-Settlement Health Checks | We don't disappear after settlement. Regular reviews ensure your loan stays competitive as life changes. | `HeartPulseIcon` |

> **Icon correction:** step 05's source SVG is
> `M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z` + `polyline 9 22 9 12 15 12 15 22` — a
> **house**, i.e. `HomeIcon`, not `HandshakeIcon`. All six source paths are byte-identical to
> the corresponding `icons.tsx` components, so nothing needed re-drawing.

### Behaviour — source script, verbatim

```js
var styles = document.createElement('style');
styles.textContent =
  '.journey-step_icon-wrap:hover{border-color:rgba(188,26,26,0.40)!important;' +
  'background:rgba(188,26,26,0.10)!important;}';
document.head.appendChild(styles);

var obs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var el = entry.target;
      var idx = parseInt(el.getAttribute('data-step') || '0', 10);
      setTimeout(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, idx * 150);
      obs.unobserve(el);
    }
  });
}, { threshold: 0.1 });

steps.forEach(function (step, i) {
  step.setAttribute('data-step', i);
  step.style.opacity = '0';
  step.style.transform = 'translateY(20px)';
  step.style.transition = 'opacity 700ms ease-out, transform 700ms ease-out';
  obs.observe(step);
});
```

- Trigger: `IntersectionObserver`, `{ threshold: 0.1 }`
- **One-shot** — `obs.unobserve(el)` on first intersection; it never replays
- State A: `opacity: 0`, `translateY(20px)` → State B: `opacity: 1`, `translateY(0)`
- Transition: `opacity 700ms ease-out, transform 700ms ease-out`
- Stagger: `index * 150ms` → `0 / 150 / 300 / 450 / 600 / 750`

### React implementation notes
- **Each step owns its own observer**, exactly as the source does — not one observer on the
  grid. This matters on mobile, where the steps stack into a tall column and enter the
  viewport at different times; a single grid-level observer would fire all six staggers off
  the grid's entry instead of each step's own.
- The `index * 150ms` `setTimeout` becomes a CSS `transition-delay` (`delay-0`,
  `delay-[150ms]`, … `delay-[750ms]`, written as static literals so Tailwind's scanner sees
  them). Visually identical, and it cannot leak a pending timer on unmount.
- Observer logic lives in `src/hooks/useInView.ts`, which returns
  `readonly [RefObject<T | null>, boolean]`.
- `prefers-reduced-motion: reduce` → the hook skips observation entirely and reports `true`
  immediately, and the step drops its transition via `motion-reduce:transition-none`, so the
  section renders fully visible with no motion.
- Reduced motion is read via `useSyncExternalStore` (server snapshot `false`), not
  `useState` + `useEffect`. This is deliberate: the project's ESLint runs the React Compiler
  rule set, and `react-hooks/set-state-in-effect` errors on a synchronous `setState` inside an
  effect body — which is what the naive `matchMedia` pattern does. `useSyncExternalStore` is
  hydration-safe and lint-clean.
- The runtime `<style>` injection for the icon hover is unnecessary — it is a plain
  `hover:` utility pair (`hover:border-[#bc1a1a66] hover:bg-[#bc1a1a1a]`).

### ⚠️ Tailwind v4 gotcha — `transition-[…,transform]` does not animate `translate-*`

Tailwind v4 compiles `translate-y-5` / `-translate-y-0.5` to the **standalone `translate`
property**, not to `transform`:

```css
.translate-y-5 { --tw-translate-y: calc(var(--spacing) * 5);
                 translate: var(--tw-translate-x) var(--tw-translate-y) }
```

So an arbitrary `transition-[opacity,transform]` emits
`transition-property: opacity,transform` — which never matches `translate`, and the rise
**snaps** while only the fade animates. Stock `transition-transform` is safe (v4 expands it to
`transform, translate, scale, rotate`); arbitrary lists are not.

Both components therefore spell it out: `transition-[opacity,transform,translate]` on
`.journey-step` and `transition-[border-color,transform,translate]` on `.fu-testi__mini-card`.
Verified against the emitted chunk CSS. Anything else in this codebase pairing an arbitrary
transition list with a `translate-*` utility has the same latent bug.

---

### Responsive mapping (source is desktop-first max-width; inverted to mobile-first)

| Source query | Tailwind |
|---|---|
| base (> 991px) | `min-[992px]:` |
| `max-width: 991px` | `md:` (768–991) |
| `max-width: 767px` | base (mobile-first default) |

`md` is Tailwind's stock 768px, which matches the source's 767px max-width boundary exactly.
The 991px boundary needs `min-[992px]:` — Tailwind's `lg` is 1024px and would leave 992–1023px
rendering the 3-column layout instead of 6.
