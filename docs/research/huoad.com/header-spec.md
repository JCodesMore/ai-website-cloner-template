# HUOAD Header — Extraction Spec

Source: https://huoad.com/zh/category/gmail-accounts (extracted 2026-07-13, viewport 1440×900)
Font: Geist (site loads Geist via next/font; CJK falls back to system fonts)
Brand primary: `#fa6b1f` · hover `#e55a0f` · active `#d44d0f` (Ant Design css vars)

## Structure

```
header.wrapper          position: fixed; top: 0; z-index: 10; total height 143px
├── .top                h 30px; bg #000; color #fff; font-size 14px
│   └── .inner          flex; justify-between; align-center; gap 20px
│       ├── .slogan     flex; gap 10px — text + 5 payment icons 17×17
│       └── .right      flex; gap 20px — lang switch + 3 links
├── .middle             h 68px; bg #fff
│   └── .inner
│       ├── .logo       a: inline-flex gap 10px; img 40×40; strong 20px/700 #000
│       ├── .search     672px; wrapper bg #f9fafb; border 1px #d9d9d9; radius 8px;
│       │               padding 7px 11px; h 36px; suffix: lucide-search 14px rgba(0,0,0,.88)
│       └── .user       flex-end; login btn
└── .bottom             h 45px; bg #fff; border-top & border-bottom 1px solid #f0f0f0
    └── .inner > nav    flex; gap 20px — 2 dropdown triggers
```

## Container (.inner)

- `width: 100%; min-width: 1200px; max-width: 1320px; margin: 0 auto; padding: 0 20px`
- Site is NOT responsive below 1200px (content overflows, matches original).

## Content

- Slogan: `欢迎来到 HUOAD，专业数字商城，客服时间：10:00 - 23:00`
- Payment icons (after slogan text, gap 10px, 17×17): usdt.png, trx.png, alipay.png, wechatpay.png, ethereum.svg
- Right links: `简体中文  |  USD-$` (globe 15px + chevron 16px, gap 5px) · 教程 → /zh/blog · 我的店铺 → /zh/shop · 2FA → https://www.2fa.money/zh
- Logo: logo.png 40×40 + `HUOAD` (20px/700), link → /zh
- Search placeholder: `搜索商品...`; placeholder color rgb(106,114,130); input 14px rgba(0,0,0,.88)
- Login button: lucide-user 16px + `登录` → /zh/login
- Nav items (16px/500, color #364153, icon 16×16 + label + chevron 16px, gap 5px):
  - 社交账号 (lucide-users icon)
  - 全球 IP 代理 (custom gradient shield SVG, gradient #17D2C7 → #1D73FF, stroke #1B67FF)

## Login button (antd primary, customized)

- h 36px; padding 0 15px; radius 22px; gap 8px; font 14px/500
- bg `#fa6b1f`; border 1px transparent; box-shadow `0 2px 0 rgba(255,130,5,0.08)`
- transition `all .2s cubic-bezier(.645,.045,.355,1)`

## Behaviors (INTERACTION MODEL: hover color transitions only)

- Header is always fixed; no scroll-driven changes.
- Top-bar links: `color #fff → rgba(255,255,255,.8)`, transition `color .3s`
- Bottom nav items: `color #364153 → #fa6b1f`, transition `color .2s`; cursor pointer
- Login button: bg `#fa6b1f → #e55a0f` (hover) → `#d44d0f` (active)
- Search focus: no visible border/shadow change (antd activeBorderColor disabled)
- Dropdown menus for 社交账号 / 全球 IP 代理 did NOT open on hover or click on the
  live site (empty overlay on this deployment) — triggers replicated, menus omitted.
