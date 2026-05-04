#!/usr/bin/env bash
set -euo pipefail

BUCKET="${CLOUDFLARE_R2_BUCKET:-bajablue-videos}"
ROOT="/Users/majovega/Desktop/bajablue-videos"
PUBLIC="$ROOT/public"

upload() {
  local file="$1"
  local key="${file#$PUBLIC/}"

  npx wrangler r2 object put "$BUCKET/$key" \
    --remote \
    --file "$file" \
    --content-type "video/mp4" \
    --cache-control "public, max-age=31536000, immutable"
}

upload_poster() {
  local file="$1"
  local key="${file#$PUBLIC/}"

  npx wrangler r2 object put "$BUCKET/$key" \
    --remote \
    --file "$file" \
    --content-type "image/jpeg" \
    --cache-control "public, max-age=31536000, immutable"
}

echo "Uploading videos to Cloudflare R2 bucket: $BUCKET"

find "$PUBLIC/videos" -type f -name "*.mp4" -print0 | while IFS= read -r -d "" file; do
  echo "video  ${file#$PUBLIC/}"
  upload "$file"
done

find "$PUBLIC/videos" -type f -name "*.jpg" -print0 | while IFS= read -r -d "" file; do
  echo "poster ${file#$PUBLIC/}"
  upload_poster "$file"
done

cat <<EOF

Done.

Set this in Vercel after you connect the custom domain:

NEXT_PUBLIC_VIDEO_CDN_BASE_URL=https://media.bajablue.mx

EOF
