# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Interaction model:** Static video player with overlay text
- **Screenshot:** `docs/design-references/hero.png`

## DOM Structure
```
.Video (container, position: relative, overflow: hidden)
  .MainPageVideoDiv (display: flex, position: relative)
    .Slogan.Slogan_es (position: absolute, zIndex: 100, overlay on top of video)
      .SloganPart1
        span.SloganWord "INFORMACIÓN IMPULSADA POR IA"
        br
      .SloganPart2
        span "OFERTAS MÁS INTELIGENTES"
    .Location (position: absolute, bottom-left, zIndex: 1000)
      "MIAMI"
    .player-wrapper.PlayerDiv (contains video player)
      .PlayerBlock
        .react-player.MainPageVideo (display: flex)
          video (autoplay, muted, loop)
```

## Computed Styles

### .MainPageVideoDiv (wrapper)
- display: flex
- position: relative
- width: 100% (fills container)
- height: ~325px (video aspect ratio driven)
- overflow: hidden

### .Slogan (text overlay)
- position: absolute
- top: 0, left: 0, right: 0, bottom: 0
- display: flex
- flexDirection: column
- justifyContent: center
- padding-left: ~30px
- zIndex: 100
- color: rgb(255, 255, 255)
- pointerEvents: none

### .SloganWord / slogan spans
- fontFamily: "Red Hat Display", sans-serif
- fontSize: 45px
- fontWeight: 900
- color: rgb(255, 255, 255)
- lineHeight: 80px
- display: block

### .Location (city badge)
- position: absolute
- bottom: 10px
- left: 10px
- zIndex: 1000
- backgroundColor: rgba(4, 90, 166, 0.35) (semi-transparent blue)
- color: rgb(255, 255, 255)
- fontFamily: Montserrat, sans-serif
- fontSize: 28px
- fontWeight: 400
- padding: ~4px 12px
- display: block

### video element
- width: 100%
- height: 100%
- objectFit: cover
- autoPlay: true
- muted: true
- loop: true
- playsInline: true

## Assets
- Video: `https://smartluxe.s3.amazonaws.com/smart_luxe_intro.mp4` (load directly from CDN, NOT downloaded)
- Preview image (poster fallback): `/images/video_preview.jpg`

## Text Content (verbatim)
- Line 1: "INFORMACIÓN IMPULSADA POR IA"
- Line 2: "OFERTAS MÁS INTELIGENTES"
- Location badge: "MIAMI"

## Responsive Behavior
- **Desktop:** Full width, ~325px tall, text overlay left-aligned
- **Mobile:** Same structure but text may be smaller, video still full width

## Implementation Notes
- Use HTML5 `<video>` element directly (not react-player)
- Video autoplay with muted + playsInline for browser compatibility
- The slogan text sits as absolute overlay on top of the video
- No controls shown on the video
