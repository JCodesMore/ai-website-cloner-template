# Framer and animated pages

Use for Framer-generated pages or animation beyond simple hover transitions. Framer is the publishing tool; reproduce its rendered design and behavior in the target framework.

## Framer inspection

Framer can render duplicate desktop/mobile variants and hide one with breakpoint classes. Read **visible** layout/computed styles at each viewport instead of copying all nodes. `data-framer-name` identifies sections; generated classes are not component architecture.

Wait for hydration/entrance animations and scroll through content below the fold. Capture initial/revealed positions when movement matters. Full-page screenshots alone can leave offscreen reveal content invisible.

Use `currentSrc`, enough resolution for the largest rendered size, and the observed crop. Framer CDN image URLs can return AVIF despite PNG filenames. Verify bytes and use the actual format locally. Fonts and SVG definitions are part of fidelity.

Check each font's actual weight/style before declaring `@font-face`; a static medium file advertised as a variable family makes regular text too heavy. If asset bundling misses a public font, retrieve its observed URL directly. Exported inline SVGs need their namespace and referenced definitions to work as standalone files; confirm they render through the local `<img>` URL, not only inline.

Animated SVGs can depend on ancestor selectors, shared symbols, fonts, and stylesheet keyframes. Preserve those asset dependencies and watch a full cycle: replacing a repeating sequence with a few objects that pulse together loses the source behavior.

For CMS grids, visit supplied routes and exercise every filter. Map destinations: a static first-state list does not reproduce filtering/navigation.

Rebuild semantic components/data. Deployment scripts and minified wrappers are evidence, not code to paste into a new app.

## Motion inspection

| Driver | Evidence | Typical implementation |
|---|---|---|
| Time | cycle, pause, direction, looping media | CSS keyframes, video, animation library |
| Scroll reveal | entry boundary, start/end positions, reverse replay | IntersectionObserver + CSS |
| Continuous scroll | progress, pin duration, layer speeds | scroll progress + CSS variables or library |
| Click/hover | alternate content, transition, dismissal/navigation | React state + CSS |
| Pointer/canvas | response, renderer/media identity | matched renderer or disclosed approximation |

Observe both directions and mobile. A pinned scene needs scroll distance and release behavior, not just sticky positioning. An animated visual may be a video: use actual media when available.

Match measurable easing/duration. Clean up animation loops with component lifecycle. Framer's smooth scrolling is Lenis: a `lenis` class on `html` or a `window.lenis` global exposes the options to reproduce.

## Verify the experience

Compare initial, active, and settled states at comparable positions. Test controls during motion and navigate away/back to detect stuck states. Confirm motion does not widen the document or hide content permanently. Name any unimplemented shader/canvas behavior rather than presenting a still as proof.
