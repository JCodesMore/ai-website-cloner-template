#!/usr/bin/env bash
set -euo pipefail

SRC="/Users/majovega/Downloads/bajablue verticle vids"
OUT="/Users/majovega/Desktop/bajablue-videos/public/videos/mobile"
TMP="/Users/majovega/Desktop/bajablue-mobile-video-review/mobile-build"

mkdir -p "$OUT" "$TMP"

encode_segment() {
  local input="$1"
  local start="$2"
  local duration="$3"
  local width="$4"
  local height="$5"
  local crf="$6"
  local output="$7"

  if [[ "$width" == "2160" || "$height" == "3840" ]]; then
    ffmpeg -hide_banner -loglevel error -y \
      -ss "$start" -t "$duration" -i "$input" \
      -an \
      -vf "scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},fps=30,setsar=1,format=yuv420p" \
      -c:v h264_videotoolbox -b:v 20M -maxrate 28M -bufsize 40M -profile:v high -tag:v avc1 -movflags +faststart \
      "$output"
  else
    ffmpeg -hide_banner -loglevel error -y \
      -ss "$start" -t "$duration" -i "$input" \
      -an \
      -vf "scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},fps=30,setsar=1,format=yuv420p" \
      -c:v libx264 -preset medium -crf "$crf" -movflags +faststart \
      "$output"
  fi
}

poster_from_video() {
  local video="$1"
  local output="$2"

  ffmpeg -hide_banner -loglevel error -y \
    -ss 1 -i "$video" \
    -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1" \
    -frames:v 1 -q:v 3 "$output"
}

build_single() {
  local name="$1"
  local source="$2"
  local start="$3"
  local duration="$4"

  encode_segment "$SRC/$source" "$start" "$duration" 2160 3840 0 "$OUT/${name}-4k.mp4"
  encode_segment "$SRC/$source" "$start" "$duration" 1080 1920 23 "$OUT/${name}-1080.mp4"
  encode_segment "$SRC/$source" "$start" "$duration" 720 1280 24 "$OUT/${name}-720.mp4"
  poster_from_video "$OUT/${name}-1080.mp4" "$OUT/${name}-poster.jpg"
}

build_montage() {
  local name="$1"
  shift

  for size in "2160:3840:0" "1080:1920:23" "720:1280:24"; do
    IFS=":" read -r width height crf <<< "$size"
    local suffix="$width"
    if [[ "$width" == "2160" ]]; then
      suffix="4k"
    fi
    local list="$TMP/${name}-${width}.txt"
    : > "$list"

    local idx=0
    for spec in "$@"; do
      IFS="|" read -r source start duration <<< "$spec"
      local segment="$TMP/${name}-${width}-${idx}.mp4"
      encode_segment "$SRC/$source" "$start" "$duration" "$width" "$height" "$crf" "$segment"
      printf "file '%s'\n" "$segment" >> "$list"
      idx=$((idx + 1))
    done

    ffmpeg -hide_banner -loglevel error -y \
      -f concat -safe 0 -i "$list" \
      -c copy -movflags +faststart \
      "$OUT/${name}-${suffix}.mp4"
  done

  poster_from_video "$OUT/${name}-1080.mp4" "$OUT/${name}-poster.jpg"
}

rm -f "$TMP"/*.mp4 "$TMP"/*.txt

# Homepage opener: multi-cut wildlife proof loop.
build_montage "home-hero-multicut" \
  "bajablue-mobile-01-blue-whale-overhead-breath.mov|0.4|3.2" \
  "bajablue-mobile-05-dolphin-pod-turquoise-aerial.mov|0.6|3" \
  "bajablue-mobile-08-orcas-beside-boat.mov|0.2|3" \
  "bajablue-mobile-18-humpback-whale-sunlit-aerial.mov|0|3" \
  "bajablue-mobile-15-sea-lion-colony-turquoise.mov|1.2|3" \
  "bajablue-mobile-19-mobula-rays-underwater-dark.mov|1.2|3" \
  "bajablue-mobile-20-orca-underwater-encounter.mov|0.5|3.6"

# Real-trip proof for booking/tours: boat proximity plus whales/orcas.
build_montage "tours-proof" \
  "bajablue-mobile-08-orcas-beside-boat.mov|0|5.2" \
  "bajablue-mobile-09-blue-whale-surface-boat.mov|2|5" \
  "bajablue-mobile-16-blue-whale-tail-boat-follow.mov|2|5"

# Seasonal variety: place, whales, orcas, mobulas, sea lions.
build_montage "season-montage" \
  "bajablue-mobile-04-island-beach-establishing.mov|0|3.5" \
  "bajablue-mobile-18-humpback-whale-sunlit-aerial.mov|0|4" \
  "bajablue-mobile-06-orca-pod-aerial-close.mov|0|4" \
  "bajablue-mobile-19-mobula-rays-underwater-dark.mov|0|4" \
  "bajablue-mobile-15-sea-lion-colony-turquoise.mov|0|4"

# Gallery mood reel: underwater and rare encounters.
build_montage "gallery-montage" \
  "bajablue-mobile-20-orca-underwater-encounter.mov|0|5.5" \
  "bajablue-mobile-01-blue-whale-overhead-breath.mov|0|5" \
  "bajablue-mobile-10-sperm-whales-topdown-formation.mov|3|5" \
  "bajablue-mobile-15-sea-lion-colony-turquoise.mov|0|5" \
  "bajablue-mobile-19-mobula-rays-underwater-dark.mov|0|4"

# About page: real boat/whale context for trust and operating style.
build_single "about-story" \
  "bajablue-mobile-16-blue-whale-tail-boat-follow.mov" \
  1 10

# Tour detail hero cutdowns.
build_montage "ocean-safari" \
  "bajablue-mobile-05-dolphin-pod-turquoise-aerial.mov|0|5" \
  "bajablue-mobile-13-sea-lions-rocky-shallows-aerial.mov|0|4" \
  "bajablue-mobile-15-sea-lion-colony-turquoise.mov|0|5" \
  "bajablue-mobile-19-mobula-rays-underwater-dark.mov|0|4"

build_montage "blue-expedition" \
  "bajablue-mobile-17-blue-whale-overhead-glide.mov|0|5" \
  "bajablue-mobile-02-whale-pod-surface-close.mov|0|5" \
  "bajablue-mobile-10-sperm-whales-topdown-formation.mov|3|5" \
  "bajablue-mobile-18-humpback-whale-sunlit-aerial.mov|0|5" \
  "bajablue-mobile-09-blue-whale-surface-boat.mov|2|4"

build_montage "master-seafari" \
  "bajablue-mobile-06-orca-pod-aerial-close.mov|0|5" \
  "bajablue-mobile-11-orca-pod-bluewater-aerial.mov|0|4" \
  "bajablue-mobile-08-orcas-beside-boat.mov|0|5" \
  "bajablue-mobile-20-orca-underwater-encounter.mov|0|6"

find "$OUT" -maxdepth 1 -type f | sort
