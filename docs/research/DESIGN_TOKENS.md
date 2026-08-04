# Design Tokens — fundup.au

Extracted from the `:root` block of the style-guide CSS bundle
(`review-showcase.webflow.69e0630d1da62a1e076d27b8.92a0690cd.opt.min.css`, 288 declarations),
cross-checked against occurrence counts across all 11 CSS bundles and 10 HTML documents.

---

## Colors

### The brand red is inconsistent in the source — resolve to `#BC1A1A`

Occurrence counts across the whole site:

| Value | CSS bundles | Inline HTML | What it is |
|---|---|---|---|
| **`#bc1a1a`** | **80** | **24** | The real brand red, used by all custom `fu-` styles |
| `#bd1f1f` | 11 | 0 | The Flowkit `accent-primary` token value |
| `#dc2626` | 2 | 20 | Tailwind red-600 — hardcoded in `/contact` icon SVGs |
| `#e5341a` | 0 | 15 | Orange-red — hardcoded in the `/low-doc-loans` FAQ embed |

**Decision: standardise on `#BC1A1A`** as `--primary`. The other three are drift from
hand-edited embeds, not deliberate design. Normalising them is the one place this clone
deliberately diverges from the source, because reproducing four near-identical reds would be
reproducing a defect. Flagged for the user.

### Core palette

```
accent-primary          #bd1f1f   (Flowkit token — superseded by #BC1A1A in practice)
accent-primary-hover    #8ca5fe   ⚠ UN-REBRANDED TEMPLATE BLUE — see warning below
accent-secondary        transparent
accent-tertiary         transparent
neutral-primary         #fff
neutral-secondary       #fbf9f5   (warm off-white — the section alternate surface)
neutral-inverse         #0f0f0f   (near-black ink)
```

> ⚠ **Un-rebranded template blue.** `accent-primary-hover` is `#8ca5fe` and every
> `accent-primary-a10…a90` tint is `#4f75fe` (130 occurrences). These are leftovers from the
> Flowkit demo template that the site owner never rebranded. They are **live bugs** — a red
> button hovers to *blue*. Do not port them. Derive hover states from `#BC1A1A` instead.

### Tints

```
neutral-inverse-a10  #1818181a      neutral-primary-a10  #ffffff1a
neutral-inverse-a20  #18181833      neutral-primary-a20  #fff3
neutral-inverse-a60  #18181899      neutral-primary-a60  #fff9
neutral-inverse-a80  #181818cc      neutral-primary-a80  #fffc
                                    neutral-primary-a90  #ffffffe6
```
Note the tints are built on `#181818`, not the `#0f0f0f` they nominally tint. Another source
inconsistency — minor, and invisible at these alpha levels.

### Semantic mapping → our shadcn tokens

| Flowkit token | Value | shadcn token |
|---|---|---|
| `bg-primary` | `#fff` | `--background` |
| `bg-secondary` | `#fbf9f5` | `--muted` / alternating section surface |
| `bg-inverse` | `#0f0f0f` | dark section surface |
| `text-primary` | `#0f0f0f` | `--foreground` |
| `text-secondary` | `#18181899` | `--muted-foreground` |
| `text-inverse-primary` | `#fff` | foreground on dark |
| `text-inverse-secondary` | `#fff9` | muted foreground on dark |
| `border-primary` | `#1818181a` | `--border` |
| `border-secondary` | `#18181833` | stronger border / card outline |
| accent (resolved) | `#BC1A1A` | `--primary` |
| `text-on-accent-primary` | `#fff` | `--primary-foreground` |

---

## Typography

```
--heading-font   "Plus Jakarta Sans", sans-serif
--body-font      "Instrument Sans", sans-serif
--button-font    "Instrument Sans", sans-serif
```
Also loaded: Inter (calculators embed + homepage custom CSS), Roboto Serif (homepage custom CSS).

Base: `font-size 1rem` · `line-height 1.6rem` · `weight 400` (bold `600`) · `letter-spacing 0em`
· `margin-bottom .75em`

### Heading scale — √2 (1.414) modular, four breakpoints

Verified directly against the four `:root` blocks (base + `max-width` 991 / 767 / 479).

| Token | Desktop | ≤991 | ≤767 | ≤479 | Weight | Line-height | Tracking |
|---|---|---|---|---|---|---|---|
| `h0` | 7.99rem | 6.39rem | 5.12rem | 4.09rem | 600 | 1.04em → 1.2em | −.01em |
| `h1` | 5.65rem | 4.52rem | 3.62rem | 2.89rem | 600 | 1.04em → 1.2em | −.01em |
| `h2` | 2.83rem | 2.26rem | 1.81rem | 1.45rem | 600 | 1.04em | −.01em |
| `h3` | 2rem | 1.6rem | 1.28rem | 1.02rem | 500 | 1.04em → 1.5em | −.01em |
| `h4` | 1.41rem | 1.27rem | 1.15rem | 1.03rem | 500 | 1.3em → 1.5em | −.01em |
| `h5` | 1rem | — | — | — | 500 | 1.3em → 1.5em | 0em |
| `h6` | .71rem | — | — | — | 500 | 1.3em → 1.5em | .1em |

`h1` margin-bottom shifts `.3em` → `.5em` at the 767px breakpoint.

### Body scale

| Class | Desktop → mobile | Line-height |
|---|---|---|
| `text-xxl` | 2rem → 1.8 → 1.6 → 1.4rem | 1.6em |
| `text-xl` | 1.5rem → 1.4 → 1.3 → 1.2rem | 1.6em |
| `text-lg` | 1.13rem → 1.1rem | 1.6em |
| `text` (base) | 1rem | 1.6em |
| `text-sm` | .88rem | 1.6em |

### Other type tokens

```
eyebrow    .9rem → .8rem mobile · lh 1.3em · ls .01em · uppercase
tag        .75rem · ls .035em · uppercase
blockquote clamp(1.125rem, 1.5vw + .25rem, 1.5rem) · lh 1.5em · ls .01em · border 3px · radius 0
```

---

## Spacing

```
0-25x .25rem   0-5x .5rem    0-75x .75rem   1x 1rem
1-25x 1.25rem  1-5x 1.5rem   1-75x 1.75rem  2x 2rem
3x 3rem   4x 4rem   5x 5rem   6x 6rem   7x 7rem   8x 8rem
```

Gap aliases: `xxs .5rem · xs 1rem · sm 2rem · md 3rem · lg 4rem · xl 5rem · xxl 6rem`

All are plain `rem` multiples of 4 — they map onto Tailwind's default scale with no custom
spacing config needed (`1rem` = `4`, `2rem` = `8`, `3rem` = `12`, `4rem` = `16`, `8rem` = `32`).

## Radii

```
sm .25rem   md .5rem   lg .75rem   xl 1rem   round 100rem
button .25rem      card .5rem      input .25rem     tag .25rem
image  var(card-radius) = .5rem
```

The template's `globals.css` uses computed `--radius-*` multipliers off a single `--radius`.
That scheme does **not** reproduce this set cleanly — replace it with explicit values.

## Layout

```
container-width        1280px
container-lg-width     1440px
container-sm-width     1000px
container-padding-h    1rem
nav-height             4rem
section-padding-v      8rem → 7rem (≤991) → 5rem (≤767) → 4rem (≤479)
```

Width helpers: `xxs 12rem · xs 25rem · sm 35rem · md 40rem · lg 50rem · xl 60rem`

## Components

```
button   padding 1em / 1.5em · radius .25rem · font-size 1rem · weight 400 · line-height 1.2
         transition: border-color .3s, color .3s, background-color .3s cubic-bezier(.165,.84,.44,1)
         .is-small → font-size .75rem
card     radius .5rem · padding 2rem (→1.5rem →1rem) · padding-sm 1.5rem (→1.25rem →1rem)
input    radius .25rem · padding 1rem both axes
tag      radius .25rem · padding .5rem / .25rem
```

## Breakpoints

Source uses desktop-first `max-width` queries at **991 / 767 / 479 px**.
Our build is mobile-first Tailwind — invert to `lg:` / `md:` / `sm:`.
