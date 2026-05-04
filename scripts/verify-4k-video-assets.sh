#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/majovega/Desktop/bajablue-videos/public/videos"

check_video() {
  local file="$1"
  local expected="$2"
  local actual

  actual=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$file")
  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL $file expected $expected got $actual" >&2
    exit 1
  fi

  echo "OK   $actual  $file"
}

check_video "$ROOT/hero-4k.mp4" "3840x2160"
check_video "$ROOT/tours-4k.mp4" "3840x2160"
check_video "$ROOT/season-4k.mp4" "3840x2160"
check_video "$ROOT/gallery-4k.mp4" "3840x2160"
check_video "$ROOT/about-4k.mp4" "3840x2160"
check_video "$ROOT/tours-page-4k.mp4" "3840x2160"

check_video "$ROOT/mobile/home-hero-4k.mp4" "2160x3840"
check_video "$ROOT/mobile/home-hero-multicut-4k.mp4" "2160x3840"
check_video "$ROOT/mobile/tours-proof-4k.mp4" "2160x3840"
check_video "$ROOT/mobile/season-montage-4k.mp4" "2160x3840"
check_video "$ROOT/mobile/gallery-montage-4k.mp4" "2160x3840"
check_video "$ROOT/mobile/about-story-4k.mp4" "2160x3840"
check_video "$ROOT/mobile/ocean-safari-4k.mp4" "2160x3840"
check_video "$ROOT/mobile/blue-expedition-4k.mp4" "2160x3840"
check_video "$ROOT/mobile/master-seafari-4k.mp4" "2160x3840"
