# BajaBlue 4K Video Hosting and AI Upscale Runbook

Updated: April 28, 2026

## Decision

Use two layers:

1. AI enhancement layer: Topaz Video for real 1080p-to-4K enhancement.
2. Hosting layer: Cloudflare Stream first choice for 4K delivery, or a static CDN origin if we keep MP4 background loops.

The repo currently contains local 4K web masters so the site can reference 4K immediately. These are not AI-enhanced Topaz renders yet. They are production placeholders that can be replaced by AI-enhanced files with the same filenames.

## What To Pay For

### AI Upscale

Buy Topaz Video.

- Personal: good if commercial use is covered by the org size/license terms.
- Pro: safest for client/commercial delivery.

Use Topaz for:

- 4K upscale
- Denoise
- Stabilization
- Motion deblur where needed
- Frame interpolation only when the clip needs slow motion

## Exact AI Upscale Queue

Minimum required for the live site: 14 final videos.

Run these through Topaz first. Use the current final site cuts as the input for the fastest production path. For the absolute cleanest path, upscale the original source clips first and rerun `scripts/build-mobile-video-assets.sh` from enhanced sources.

### Mobile Edited Cuts

These are the edited phone-first cuts that are already made:

| Site use | Topaz input | Final output |
|---|---|---|
| Mobile home hero | `public/videos/mobile/home-hero-1080.mp4` | `public/videos/mobile/home-hero-4k.mp4` |
| Mobile tours page hero | `public/videos/mobile/tours-proof-1080.mp4` | `public/videos/mobile/tours-proof-4k.mp4` |
| Mobile season section | `public/videos/mobile/season-montage-1080.mp4` | `public/videos/mobile/season-montage-4k.mp4` |
| Mobile gallery hero | `public/videos/mobile/gallery-montage-1080.mp4` | `public/videos/mobile/gallery-montage-4k.mp4` |
| Mobile about hero | `public/videos/mobile/about-story-1080.mp4` | `public/videos/mobile/about-story-4k.mp4` |
| Ocean Safari mobile detail | `public/videos/mobile/ocean-safari-1080.mp4` | `public/videos/mobile/ocean-safari-4k.mp4` |
| Blue Expedition mobile detail | `public/videos/mobile/blue-expedition-1080.mp4` | `public/videos/mobile/blue-expedition-4k.mp4` |
| Master Seafari mobile detail | `public/videos/mobile/master-seafari-1080.mp4` | `public/videos/mobile/master-seafari-4k.mp4` |

Preview page:

`/video-preview.html`

### Desktop / Landscape Site Videos

These are the existing desktop site videos that need the same AI-enhanced 4K treatment:

| Site use | Topaz input | Final output |
|---|---|---|
| Desktop home hero | `public/videos/hero-1080p.mp4` | `public/videos/hero-4k.mp4` |
| Desktop tours section | `public/videos/tours-1080p.mp4` | `public/videos/tours-4k.mp4` |
| Desktop season section | `public/videos/season-1080p.mp4` | `public/videos/season-4k.mp4` |
| Desktop gallery hero | `public/videos/gallery-1080p.mp4` | `public/videos/gallery-4k.mp4` |
| Desktop about hero | `public/videos/about-1080p.mp4` | `public/videos/about-4k.mp4` |
| Desktop tours page hero | `public/videos/tours-page-1080p.mp4` | `public/videos/tours-page-4k.mp4` |

### Optional Source Library Upscale

Only do this after the final site videos are approved. These are the raw phone clips that fed the edited mobile cuts:

- `bajablue-mobile-01-blue-whale-overhead-breath.mov`
- `bajablue-mobile-02-whale-pod-surface-close.mov`
- `bajablue-mobile-04-island-beach-establishing.mov`
- `bajablue-mobile-05-dolphin-pod-turquoise-aerial.mov`
- `bajablue-mobile-06-orca-pod-aerial-close.mov`
- `bajablue-mobile-08-orcas-beside-boat.mov`
- `bajablue-mobile-09-blue-whale-surface-boat.mov`
- `bajablue-mobile-10-sperm-whales-topdown-formation.mov`
- `bajablue-mobile-11-orca-pod-bluewater-aerial.mov`
- `bajablue-mobile-13-sea-lions-rocky-shallows-aerial.mov`
- `bajablue-mobile-15-sea-lion-colony-turquoise.mov`
- `bajablue-mobile-16-blue-whale-tail-boat-follow.mov`
- `bajablue-mobile-17-blue-whale-overhead-glide.mov`
- `bajablue-mobile-18-humpback-whale-sunlit-aerial.mov`
- `bajablue-mobile-19-mobula-rays-underwater-dark.mov`
- `bajablue-mobile-20-orca-underwater-encounter.mov`

Raw clips not currently used in the final site cuts:

- `bajablue-mobile-03-blue-whale-topdown-turn.mov`
- `bajablue-mobile-07-blue-whale-breach-wide.mov`
- `bajablue-mobile-12-whale-pod-with-mountains.mov`
- `bajablue-mobile-14-sea-lion-raft-shallows.mov`

## Topaz Settings

Use this default for website footage:

- Mode: Enhance / Precise
- Model: Astra 2
- Creativity: 1
- Sharpness: 2
- Prompt: `Natural documentary marine wildlife footage. Preserve original animals, markings, water texture, boat details, and camera motion. Enhance clarity, reduce noise, and keep colors realistic. Do not invent new details or stylize the scene.`
- Output: 4K
- Mobile output dimensions: 2160x3840
- Desktop output dimensions: 3840x2160
- Frame interpolation: original frame rate unless a clip obviously needs smoothing
- Slow motion: none

Proof workflow:

1. Pick one representative clip: `home-hero`, `master-seafari`, or `blue-expedition`.
2. Export a Topaz 4K version.
3. Run `scripts/verify-4k-video-assets.sh`.
4. Build an A/B contact sheet from original vs Topaz result.
5. Approve settings, then batch the rest.

### Hosting

Preferred: Cloudflare Stream.

Why:

- Purpose-built video hosting
- Stores and delivers by video minutes, not file size
- Encoding is included
- Bandwidth is included in delivered-video pricing
- HLS/DASH playback is available for smooth delivery

Needed from the account owner:

- Cloudflare account with billing enabled
- Cloudflare Stream enabled
- Account ID
- API token with Stream upload/manage permissions

Upload command once credentials exist:

```bash
CLOUDFLARE_ACCOUNT_ID=... \
CLOUDFLARE_STREAM_TOKEN=... \
node scripts/upload-cloudflare-stream.mjs
```

The uploader uses Cloudflare's resumable TUS upload flow because the desktop hero 4K file is over 200 MB. It writes the resulting Stream IDs and playback URLs to:

`docs/video-hosting/cloudflare-stream-manifest.json`

Alternative: static CDN.

Use this if the site keeps short looping MP4 backgrounds and we want simpler implementation:

- Upload files under `/videos/...`
- Set `NEXT_PUBLIC_VIDEO_CDN_BASE_URL=https://media.bajablue.mx`
- The app will keep the same paths and prepend the CDN host automatically

## 4K Site Files To Upload

Desktop / landscape:

- `/videos/hero-4k.mp4`
- `/videos/tours-4k.mp4`
- `/videos/season-4k.mp4`
- `/videos/gallery-4k.mp4`
- `/videos/about-4k.mp4`
- `/videos/tours-page-4k.mp4`

Mobile / vertical:

- `/videos/mobile/home-hero-4k.mp4`
- `/videos/mobile/tours-proof-4k.mp4`
- `/videos/mobile/season-montage-4k.mp4`
- `/videos/mobile/gallery-montage-4k.mp4`
- `/videos/mobile/about-story-4k.mp4`
- `/videos/mobile/ocean-safari-4k.mp4`
- `/videos/mobile/blue-expedition-4k.mp4`
- `/videos/mobile/master-seafari-4k.mp4`

Fallbacks to upload for smooth delivery if using static CDN:

- All matching `*-1080.mp4`
- All matching `*-720.mp4`
- All posters
- Existing `*-1080p.mp4`, `*-720p.mp4`, `*-480p.mp4`, and posters used by desktop fallbacks

## Site Mapping

Desktop:

- Home hero: `hero-4k`
- Home tours section: `tours-4k`
- Home season section: `season-4k`
- About page hero: `about-4k`
- Tours page hero: `tours-page-4k`
- Gallery page hero: `gallery-4k`

Mobile:

- Home hero: `mobile/home-hero-4k`
- Tours page hero: `mobile/tours-proof-4k`
- Season section: `mobile/season-montage-4k`
- Gallery page hero: `mobile/gallery-montage-4k`
- About page hero: `mobile/about-story-4k`
- Ocean Safari detail: `mobile/ocean-safari-4k`
- Blue Expedition detail: `mobile/blue-expedition-4k`
- Master Seafari detail: `mobile/master-seafari-4k`

## Verification Commands

Generate local assets:

```bash
scripts/build-mobile-video-assets.sh
scripts/build-desktop-4k-video-assets.sh
```

Prove the 4K dimensions:

```bash
scripts/verify-4k-video-assets.sh
```

Expected:

- Desktop videos: `3840x2160`
- Mobile videos: `2160x3840`

## Smooth Playback Rule

Every video placement has a 4K source, but the site also keeps 1080p/720p fallbacks. That is intentional.

Do not force 4K on every phone. That makes the site feel worse, not better. The correct production setup is:

- 4K master exists
- browser/CDN/player can deliver 4K when appropriate
- smaller renditions load on smaller screens or slower networks
- posters render instantly while video buffers

That is how we get both requirements: 4K quality and smooth playback.
