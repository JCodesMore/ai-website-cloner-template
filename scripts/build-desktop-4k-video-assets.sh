#!/usr/bin/env bash
set -euo pipefail

OUT="/Users/majovega/Desktop/bajablue-videos/public/videos"

encode_4k_landscape() {
  local source="$1"
  local output="$2"

  ffmpeg -hide_banner -loglevel error -y \
    -i "$OUT/$source" \
    -an \
    -vf "scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,fps=30,setsar=1,format=yuv420p" \
    -c:v h264_videotoolbox -b:v 24M -maxrate 34M -bufsize 48M -profile:v high -tag:v avc1 -movflags +faststart \
    "$OUT/$output"
}

encode_4k_landscape "hero-1080p.mp4" "hero-4k.mp4"
encode_4k_landscape "tours-1080p.mp4" "tours-4k.mp4"
encode_4k_landscape "season-1080p.mp4" "season-4k.mp4"
encode_4k_landscape "gallery-1080p.mp4" "gallery-4k.mp4"
encode_4k_landscape "about-1080p.mp4" "about-4k.mp4"
encode_4k_landscape "tours-page-1080p.mp4" "tours-page-4k.mp4"

find "$OUT" -maxdepth 1 -name '*-4k.mp4' -print | sort
