#!/usr/bin/env bash
# 服务器一次性初始化：Node 24 + nginx + systemd 服务 + demo.lamafo.com 站点
# 用法（在服务器上以 root 运行）: bash setup-server.sh
set -euo pipefail

DOMAIN=demo.lamafo.com
APP_DIR=/opt/demo-lamafo/app

# ---- Node.js 24 ----
NODE_MAJOR=0
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR=$(node -v | sed 's/^v//' | cut -d. -f1)
fi
if [ "$NODE_MAJOR" -lt 24 ]; then
  if command -v apt-get >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
    apt-get install -y nodejs
  else
    curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -
    dnf install -y nodejs || yum install -y nodejs
  fi
fi

# ---- nginx + rsync ----
if command -v apt-get >/dev/null 2>&1; then
  apt-get install -y nginx rsync
  rm -f /etc/nginx/sites-enabled/default
else
  dnf install -y nginx rsync || yum install -y nginx rsync
  rm -f /etc/nginx/conf.d/default.conf
fi

mkdir -p "$APP_DIR"

# ---- systemd 服务（跑 Next standalone，监听 127.0.0.1:3000）----
cat > /etc/systemd/system/demo-lamafo.service <<'UNIT'
[Unit]
Description=demo.lamafo.com Next.js app
After=network.target

[Service]
WorkingDirectory=/opt/demo-lamafo/app/.next/standalone
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/env node server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable demo-lamafo

# ---- nginx 站点（仅域名可访问，裸 IP / 未知 Host 直接断开）----
cat > /etc/nginx/conf.d/demo-lamafo.conf <<NGINX
server {
    listen 80 default_server;
    server_name _;
    return 444;
}

server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX

# 裸 IP / 未知域名: 443 拒绝 TLS 握手（HTTPS 由 certbot --nginx 配置，证书在 /etc/letsencrypt）
cat > /etc/nginx/conf.d/zz-default-reject.conf <<'NGINX'
server {
    listen 443 ssl default_server;
    server_name _;
    ssl_reject_handshake on;
}
NGINX

nginx -t
systemctl enable nginx
systemctl restart nginx

echo "setup done: $(node -v), nginx ready, service demo-lamafo enabled"
