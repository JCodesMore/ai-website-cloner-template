#!/usr/bin/env bash
# 一键部署：本机源码 rsync 到服务器 → 服务器上构建 → 重启服务
# 用法: bash scripts/deploy/deploy.sh
# 可用环境变量: SSH_KEY（私钥路径）, SERVER（默认 root@47.79.16.39）
set -euo pipefail

SERVER="${SERVER:-root@47.79.16.39}"
SSH_KEY="${SSH_KEY:-$HOME/Downloads/HD_Mac.pem}"
APP_DIR=/opt/demo-lamafo/app
SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new"

cd "$(dirname "$0")/../.."

echo "==> rsync source to $SERVER:$APP_DIR"
rsync -az --delete \
  -e "$SSH" \
  --exclude .git \
  --exclude node_modules \
  --exclude '.next*' \
  --exclude docs \
  --exclude '.claude/worktrees' \
  ./ "$SERVER:$APP_DIR/"

echo "==> build & restart on server"
$SSH "$SERVER" bash -s <<'REMOTE'
set -euo pipefail
cd /opt/demo-lamafo/app
npm ci --no-audit --no-fund
npm run build
rm -rf .next/standalone/public .next/standalone/.next/static
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
systemctl restart demo-lamafo
sleep 2
code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/)
echo "local health check: HTTP $code"
REMOTE

echo "==> done: http://demo.lamafo.com"
