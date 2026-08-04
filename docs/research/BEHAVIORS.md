# Behaviours — fundup.au

Every interactive behaviour on the site, extracted from the source's inline scripts and CSS.
The site ships **no animation library** — everything is hand-rolled vanilla JS plus CSS
transitions, so all of it ports to React state + CSS with no new dependency.

> **No smooth-scroll library.** No Lenis, no Locomotive, no `scroll-snap`. Native scrolling
> only. `scroll-behavior: smooth` is set in our `globals.css` for the in-page `#services` anchor.

---

## 1. Header — `nav.fu-nav-1`

**No scroll-triggered state change.** The nav is `position: fixed` and looks identical at scroll
0 and scrolled — no shrink, no background swap, no shadow change. The only behaviour is the
mobile menu.

- **Mobile menu:** click `.fu-nav__mobile-btn-1`, hidden ≥992px. Original uses
  `mobile_nav_toggle-1.0.0.js`; ours uses React state.
- **Link hover:** `color: #fffc → #fff`, `transition: color .2s`
- **Call button hover:** `transition: filter .2s`

---

## 2. Hero — `section#home.fu-hero-embed`

Entrance animation, keyframe injected inline by the source:

```css
@keyframes heroSlideUp {
  0%   { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

Runs on page load (not scroll-triggered — it's above the fold). Already in our `globals.css`.

**Layered background.** `.fu-hero-embed__bg` is a CSS `background-image` with a separate
`.fu-hero-embed__overlay` element stacked on top (`z-index: 0` on the bg). Two distinct source
images, swapped by breakpoint:
- default → `public/images/hero-bg-desktop.webp`
- `≤479px` → `public/images/hero-bg-mobile.jpg`

---

## 3. Services grid — `section#services.services-section`

**Interaction model: hover-driven.** Original uses `services_card_hover_effects-1.0.0.js`.
Cards carry ghost numerals `01`–`06` behind the content. Port hover states as CSS transitions.

---

## 4. Testimonials — `section.rs2-section` › `.fu-testi`

> `rs2-section` and `fu-testi` are the **same section** — `rs2-section` is the Webflow
> `w-embed w-script` wrapper around the `fu-testi` markup. Build as ONE component.

**Interaction model: time-driven carousel + click-driven + touch-driven.**

- **3 slides**, translated with `transform: translateX(-${index * 100}%)` on `#fuSlides`
- **Auto-advance every 5000ms.** The timer **resets on every interaction** (`resetTimer()` is
  called at the end of `go()`), so a manual change restarts the full 5s dwell.
- Index wraps both ways: `cur = (n + total) % total`
- **Controls, all calling the same `go(n)`:**
  - `#fuPrev` → `go(cur - 1)`, `#fuNext` → `go(cur + 1)`
  - Dots `#fuDots .fu-testi__dot` → `go(i)`; active dot gets `.is-active`
  - Mini-cards `.fu-testi__mini-card[data-idx]` → `go(data-idx)`; active card gets `.is-active`
- **Touch swipe:** `touchstart` records `clientX`; on `touchend`, if
  `Math.abs(startX - endX) > 40` then advance (`diff > 0` → next, else prev). Listener is
  `{ passive: true }`.

**React implementation:** `"use client"`, `useState` for index, `useEffect` with `setInterval`
keyed on the index so it resets naturally on change. Clear the interval on unmount. Respect
`prefers-reduced-motion` by pausing auto-advance.

---

## 5. Journey timeline — `section.journey-section`

**Interaction model: scroll-driven entrance, one-shot.**

- **Trigger:** `IntersectionObserver` with `{ threshold: 0.1 }`
- **`obs.unobserve(el)` fires after the first intersection** — the animation plays once and
  never replays
- **State A (initial):** `opacity: 0`, `transform: translateY(20px)`
- **State B (visible):** `opacity: 1`, `transform: translateY(0)`
- **Transition:** `opacity 700ms ease-out, transform 700ms ease-out`
- **Stagger:** `setTimeout(..., index * 150)` — each step delays 150ms more than the last
  (6 steps → 0/150/300/450/600/750ms)

**Hover on `.journey-step_icon-wrap`:**
- `border-color: rgba(188, 26, 26, 0.40)`
- `background: rgba(188, 26, 26, 0.10)`

(`rgb(188,26,26)` is `#BC1A1A` — the brand red.)

---

## 6. FAQ accordions

> **Corrected during the build.** An earlier draft of this file claimed three separate accordion
> implementations keyed off a `.faq-item` class. That was wrong — `class="faq-item"` appears
> **zero times** on every page. Verified against the cached HTML.

There is **one** implementation, click-driven, shipped byte-identically on three pages:

| Page | Markup | Open behaviour |
|---|---|---|
| `/`, `/contact` | `section.fu-faq2` (`#fuFaqList2`), `max-height` transition | **multi-open** — the "close others" loop is commented out |
| `/low-doc-loans` | `section.fu-faq2` (`#fuLowDocFaqList`), same transition | **single-open** — its copy of the loop is **live code** |
| `/self-employed-loans` | **no accordion at all** — static `section.sel-faq` (`h3.sel-faq-q` + `p.sel-faq-a`) | not interactive |

> Verified by reading each page's own inline handler. The three embeds are *not* identical: only
> `/low-doc-loans` actually runs `items.forEach(i => i.classList.remove('is-open'))`. An earlier
> draft of this file had it backwards.

**The clone deliberately does not reproduce this.** The table above records the *live site*; the
inconsistency across the three embeds is an artefact, not a design decision. By client direction
every FAQ we ship is **single-open with the first question already expanded on load**. See
`FIXES.md` → *Requested changes*. `/self-employed-loans` is untouched — it has no accordion to
change.

The `.faq-item` *script* is shipped on four pages but has no matching markup anywhere — dead
code, same defect class as `FIXES.md` #11.

Accent is `#e5341a` on **all three** FAQ embeds, not per-page. (`#dc2626` on `/contact` is the
`.git-icon` SVG stroke, not the FAQ. `#bc1a1a` never appears in a FAQ embed.)
Panel bg `#f9f9f9`, body text `#666666`.

**Implementation:** shadcn `accordion` (base-nova / `@base-ui/react`), already installed. Base UI's
props are `multiple` and `defaultValue`, **not** Radix's `type="single" | "multiple"` — an earlier
draft of this line used the Radix names, and had the two pages the wrong way round besides. All
three render `<FaqAccordion>` with `multiple={false}` and `defaultValue={[0]}`.

---

## 7. Calculators — `/calculators`

**Interaction model: input-driven, fully client-side.** Four independent calculators inside one
embed. Sliders and number inputs recompute on every change; no debounce in the original.
All maths runs locally — no network calls. See `PAGE_TOPOLOGY.md` for the four calculators and
the stamp-duty bracket data.

---

## 8. Booking widget — `/book-a-consultation`

Third-party GoHighLevel iframe. Not our behaviour to reimplement — embed as-is:
```html
<iframe src="https://api.leadconnectorhq.com/widget/booking/cjRBEEobuaiBp31Omzz5" scrolling="no">
<script src="https://api.leadconnectorhq.com/js/form_embed.js">
```

---

## Responsive breakpoints

Source uses desktop-first `max-width` queries at **991 / 767 / 479px**. Key layout shifts:

| Section | ≤991 | ≤767 | ≤479 |
|---|---|---|---|
| Nav | height 112→64px, links hidden, hamburger shown | height 56px, logo 32px | logo width 76.8px |
| Sections | padding-y 8rem→7rem | →5rem | →4rem |
| Hero bg | — | — | swaps to `hero-bg-mobile.jpg` |
| Cards | padding 2rem→1.5rem | →1rem | — |
| Sliders | — | — | all slide counts collapse to 1 |

---

## Not verified in a live browser

Chrome automation was unavailable during extraction, so the above comes from reading the
source's own scripts and CSS rather than observing the rendered page. The mechanisms and exact
numeric values are quoted directly from source and are reliable. What still needs a live pass:

- Screenshots for the Phase 5 visual diff
- Confirming the hero entrance actually fires on load (the keyframe is defined and injected, but
  the element that consumes it wasn't traced)
- Any behaviour driven by the minified `webflow.*.js` runtime rather than the site's own inline
  scripts
