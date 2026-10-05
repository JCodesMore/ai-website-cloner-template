# Inspect a source page

Capture evidence that changes the build: layout, content, assets, and states. One page brief usually suffices.

## Visual structure

Record section order, max-width, gutters, column proportions, and sticky/fixed layers. Measure heading/body family, weight, size, line height, and letter spacing. Match the actual font before adjusting widths to repair wrapping.

Sweep width from mobile to beyond the desktop design, narrowing around each transition; max-width caps only show on wider screens. Record stacking, navigation/menu changes, type reflow, and different crops/assets. A scaled desktop screenshot is not a mobile reference.

Capture whole-page evidence after visiting lazy/reveal sections, plus full-size hero and interaction views. Fonts or entry motion can make early screenshots misleading.

## Assets

Use available browser asset inventory/download tools or DOM-backed URLs with direct downloads. Include:

- Images: `currentSrc`, `srcset`, dimensions, `object-fit`, crop position, alt text.
- Layers: visible images/backgrounds/SVGs and stacking/positioning.
- Video: source, poster, autoplay/loop/mute behavior, aspect ratio, controls.
- Fonts: actual loaded family/weights and files used by the page.
- SVG: viewBox plus referenced gradients, masks, symbols, and filters.

Save assets used by the cloned scope and their source URL → local path mapping. Distinguish repeated filenames. Check content type, dimensions, and browser rendering: HTTP success can return an error page; CDNs may change formats without changing URL extensions.

If a browser bundle fails for a public font/image, download the observed URL directly. Keep unresolved assets explicit and preserve applicable attribution.

## State evidence

Record trigger → visible result. Scroll before clicking so pinned scenes are not mistaken for tabs. Inspect alternate content, selection, layout, and transition.

Measure important before/after styles using the browser's supported DOM evaluation. For a selector observed on the page, useful fields are textContent, getBoundingClientRect(), and computed font, letterSpacing, color, background, gap, padding, borderRadius, position, transform, and transition.

Page-wide scripts (smooth scrolling, snapping, cursor followers, page transitions) change every interaction. Identify them from root classes, globals, and loaded scripts, and record their options.

Evaluation environments differ: read-only DOM snapshots may omit APIs such as `document.fonts`. Use asset metadata or developer inspection for missing measurements rather than inferring values from an unsupported API.

## Handoff and comparison

Provide screenshots, geometry/type, content, local asset paths, responsive changes, and trigger/state behavior. Establish shared navigation/styles before parallel page work.

Keep comparison screenshots labeled by URL/route and viewport. Test controls and inspect their visible result. Check mobile overflow and failed assets separately from similarity.
