#!/usr/bin/env bash
# Re-encode hero/section videos to web-appropriate bitrates.
# The originals were encoded at near-broadcast bitrates (24 Mbps for 1080p)
# which made them 50-233 MB per file. Mobile users couldn't download them
# fast enough → constant stutter loop.
#
# This script takes the 4K version of each named video as the source and
# re-encodes it at 4 sizes with sensible bitrates.
#
# Usage: bash scripts/reencode-web-videos.sh [video-name ...]

set -euo pipefail

cd "$(dirname "$0")/.."
VIDEO_DIR="public/videos"
NAMES=("$@")
[ ${#NAMES[@]} -eq 0 ] && NAMES=(hero season tours about gallery tours-page)

# Tier table: TIER:TARGET:MAX:HEIGHT
# Bitrates tuned for web hero loops with lots of water motion.
TIERS="4k:5M:6M:2160 1080p:1800k:2400k:1080 720p:1000k:1400k:720 480p:500k:800k:480"

for NAME in "${NAMES[@]}"; do
  SRC="$VIDEO_DIR/${NAME}-4k.mp4"
  if [ ! -f "$SRC" ]; then
    echo "SKIP $NAME -- no 4k source at $SRC"
    continue
  fi
  ORIG_SIZE=$(stat -f%z "$SRC")
  ORIG_MB=$(echo "scale=1; $ORIG_SIZE/1048576" | bc)
  echo "===== $NAME (4k source: ${ORIG_MB} MB) ====="

  for TIER_SPEC in $TIERS; do
    TIER=$(echo "$TIER_SPEC" | cut -d: -f1)
    TARGET=$(echo "$TIER_SPEC" | cut -d: -f2)
    MAXR=$(echo "$TIER_SPEC" | cut -d: -f3)
    HEIGHT=$(echo "$TIER_SPEC" | cut -d: -f4)

    OUT="$VIDEO_DIR/${NAME}-${TIER}.mp4"
    TMP="$VIDEO_DIR/${NAME}-${TIER}.tmp.mp4"

    # Backup the existing file before overwriting (one-time)
    if [ -f "$OUT" ] && [ ! -f "$OUT.original" ]; then
      cp "$OUT" "$OUT.original"
    fi

    echo "  -> $TIER  bitrate=$TARGET  height=$HEIGHT"
    # Write to temp first so we can read FROM the same path we're about
    # to overwrite (the 4k tier re-encodes itself).
    ffmpeg -y -loglevel error \
      -i "$SRC" \
      -c:v libx264 \
      -preset fast \
      -tune fastdecode \
      -profile:v main \
      -level 4.0 \
      -b:v "$TARGET" \
      -maxrate "$MAXR" \
      -bufsize 4M \
      -vf "scale=-2:${HEIGHT}:flags=lanczos" \
      -movflags +faststart \
      -pix_fmt yuv420p \
      -an \
      -threads 0 \
      "$TMP"
    mv -f "$TMP" "$OUT"
    NEW_SIZE=$(stat -f%z "$OUT")
    NEW_MB=$(echo "scale=1; $NEW_SIZE/1048576" | bc)
    PCT=$(echo "scale=0; $NEW_SIZE * 100 / $ORIG_SIZE" | bc)
    echo "     done: ${NEW_MB} MB (${PCT}% of 4k source)"
  done
  echo
done

echo "All re-encodes complete. Now upload to R2 with:"
echo "  bash scripts/upload-cloudflare-r2.sh"
