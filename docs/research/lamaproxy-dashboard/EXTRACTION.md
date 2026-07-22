# LamaProxy Dashboard — Residential Page Clone

Target: `https://dashboard.lamaproxy.com/zh/residential`

## How it was reverse-engineered

The dashboard is a **Vite + React SPA** (not SSR). The page is auth-gated (visiting
it while logged out redirects to the login form), so the rendered DOM isn't reachable
anonymously. Instead the clone was reconstructed from the site's own **unminified-enough
JS bundles**, which contain the full component tree, Tailwind class strings, i18n
dictionaries, and route table:

- `/assets/index-*.js` — app shell: `DashHeader`, `Sidebar`, `DashboardLayout`,
  `LanguageSwitcher`, `FloatingContacts`, nav config, route table, i18n (zh/en/ru/vi).
- `/assets/TrafficProxyPage-*.js` — the residential/mobile purchase view (shared component).
- `/assets/ContentArea-*.js`, `Button-*.js`, `OrderPanelFooter-*.js` — shared UI primitives.

Live data pulled from the public API:

- `GET /api/proxy/residential/plans` → `pricePerGb: 2.5`, tiers `1/5/10/50/100 GB`
  with discounts `1 / 0.92 / 0.88 / 0.84 / 0.72`.
- `GET /api/proxy/mobile/plans` → `pricePerGb: 5`, tiers `1/5/10/20 GB`, same discount curve.
- `GET /api/proxy/site-links` → Telegram / WhatsApp / Live Chat floating buttons.

Assets: `lama-light.png` (logo), `favicon.png` → `public/images/lamaproxy/`.

## Design tokens (from compiled CSS)

- `primary-*` = Tailwind **indigo** (`50 #eef2ff … 600 #4f46e5 … 700 #4338ca`).
  Registered in `globals.css` via a Tailwind v4 `@theme` block so `bg/text/border/ring-primary-*` compile.
- App background: `#F5F7FA`. Cards: `bg-white rounded-2xl shadow-sm border-gray-100`.
- Layout: fixed `60px` top header, fixed `220px` left sidebar, `main` offset `ml-[220px] mt-[60px]`,
  content area `flex gap-6` with a `320px` sticky order panel (`top-[84px]`).

## Interaction model

- **Sidebar:** client nav; active item `bg-primary-600 text-white`.
- **Plan grid:** click-to-select; selected card gets indigo border + `primary-50` bg + filled radio.
  Order panel recomputes total as `trafficGb × pricePerGb × discount`.
- **Purchased-proxy card:** usage bar, maskable credentials (eye toggle), and a
  rotating/sticky **proxy-list generator** (protocol toggle + quantity → copy/download `.txt`).
  Rotating uses the shared HTTP/SOCKS5 port; sticky uses `stickyPortStart + i`.
- **Not responsive:** the real dashboard is desktop-first (fixed 220px sidebar, non-wrapping
  flex content) and overlaps on mobile — reproduced 1:1, not "fixed".

## Where the clone lives

- Routes: `src/app/zh/residential/page.tsx`, `src/app/zh/mobile/page.tsx`.
- Components: `src/components/lama/` (`dashboard-app`, `traffic-proxy-page`, `ui`, `icons`).
- Data/i18n: `src/lib/lamaproxy-data.ts`.

## Demo-only scope

Authenticated state, balance (`$128.50`), and one sample purchased proxy are mock data.
Checkout, logout, account-security, language switching, and the `dashboard / isp /
datacenter / my-proxies` sidebar destinations are out of scope (the last four render a
placeholder card). No real backend, auth, or payment.
