"use client";

/** LamaProxy 仪表盘外壳 + 导航 — 对齐原站 DashboardLayout（header / sidebar / 悬浮联系）。
 *  单页演示：侧栏原地切换视图并同步 URL；住宅/移动为完整购买页，其余为占位卡。
 *  登录态、余额为演示数据；退出/账号安全等仅作交互演示，不接后端。 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LANGUAGES,
  SITE_LINKS,
  T,
  fmtPrice,
  type ProxyType,
} from "@/lib/lamaproxy-data";
import { Card, ContentArea } from "./ui";
import { TrafficProxyPage } from "./traffic-proxy-page";
import {
  NAV_ITEMS,
  type NavKey,
  ChevronDownIcon,
  WarningIcon,
  TelegramIcon,
  WhatsappIcon,
  LiveChatIcon,
} from "./icons";

const DEMO_USER = { email: "demo@lamaproxy.com", balance: 128.5 };

const NAV_PATH: Record<NavKey, string> = {
  dashboard: "/zh/dashboard",
  isp: "/zh/isp",
  datacenter: "/zh/datacenter",
  residential: "/zh/residential",
  mobile: "/zh/mobile",
  myProxies: "/zh/my-proxies",
};

/* ── 语言切换器 ───────────────────────────────────────── */

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES[0]; // 中文

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <span className="text-base">{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setOpen(false)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  l.code === current.code
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── 顶部栏 ───────────────────────────────────────────── */

function DashHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = DEMO_USER.email[0].toUpperCase();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[60px] z-50 bg-white border-b border-gray-200 flex items-center px-6">
        <Link href="/zh/residential" className="w-[220px] flex items-center shrink-0 hover:opacity-80 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/lamaproxy/lama-light.png" alt="LamaProxy" className="h-10 w-auto" />
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <span className="text-gray-600">{T.balance}:</span>
            <span className="font-semibold text-gray-900">{fmtPrice(DEMO_USER.balance)}</span>
          </div>
          <LanguageSwitcher />
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-gray-700 max-w-[160px] truncate hidden sm:block">{DEMO_USER.email}</span>
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold select-none">
                {initial}
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(false)}>
                  {T.accountSecurity}
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  onClick={() => {
                    setMenuOpen(false);
                    setLogoutOpen(true);
                  }}
                >
                  {T.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {logoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
            <h3 className="text-base font-semibold text-gray-900 mb-2">{T.logoutConfirmTitle}</h3>
            <p className="text-sm text-gray-600 mb-5">{T.logoutConfirmText}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setLogoutOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {T.cancel}
              </button>
              <button
                onClick={() => setLogoutOpen(false)}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                {T.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── 侧栏 ─────────────────────────────────────────────── */

function Sidebar({ active, onNavigate }: { active: NavKey; onNavigate: (key: NavKey) => void }) {
  return (
    <aside className="fixed top-[60px] left-0 w-[220px] h-[calc(100vh-60px)] bg-white border-r border-gray-200 flex flex-col py-4 overflow-y-auto">
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? "bg-primary-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
            >
              {item.icon}
              <span>{T.nav[item.key]}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">LamaProxy v1.0</p>
      </div>
    </aside>
  );
}

/* ── 悬浮联系入口 ─────────────────────────────────────── */

const CONTACTS = [
  { key: "telegram", label: "Telegram", bg: "bg-[#2AABEE]", hover: "hover:bg-[#1a9bde]", href: SITE_LINKS.telegram, icon: <TelegramIcon /> },
  { key: "whatsapp", label: "WhatsApp", bg: "bg-[#25D366]", hover: "hover:bg-[#1db954]", href: SITE_LINKS.whatsapp, icon: <WhatsappIcon /> },
  { key: "livechat", label: "Live Chat", bg: "bg-[#1B6EF3]", hover: "hover:bg-[#1560d4]", href: SITE_LINKS.livechat, icon: <LiveChatIcon /> },
];

function FloatingContacts() {
  return (
    <div className="fixed bottom-6 right-5 flex flex-col gap-3 z-50">
      {CONTACTS.map((c) => (
        <div key={c.key} className="relative group flex items-center justify-end">
          <span className="absolute right-14 px-2.5 py-1 rounded-md text-xs font-medium text-white bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap">
            {c.label}
            <span className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-4 border-transparent border-l-gray-800" />
          </span>
          <a
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${c.bg} ${c.hover} w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-150 hover:-translate-y-1 hover:shadow-lg`}
          >
            {c.icon}
          </a>
        </div>
      ))}
    </div>
  );
}

/* ── 视图占位（住宅/移动之外，不在本次克隆范围） ──────── */

function PlaceholderView({ nav }: { nav: NavKey }) {
  return (
    <ContentArea>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{T.nav[nav]}</h1>
      <Card className="p-10">
        <p className="text-sm text-gray-500 text-center">本演示聚焦「住宅代理」与「移动代理」购买页。</p>
      </Card>
    </ContentArea>
  );
}

/* ── 应用壳 ───────────────────────────────────────────── */

export function DashboardApp({ initial }: { initial: NavKey }) {
  const [active, setActive] = useState<NavKey>(initial);

  const navigate = (key: NavKey) => {
    setActive(key);
    window.history.replaceState(null, "", NAV_PATH[key]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <DashHeader />
      <Sidebar active={active} onNavigate={navigate} />
      <main className="ml-[220px] mt-[60px]">
        {active === "residential" || active === "mobile" ? (
          <TrafficProxyPage key={active} type={active as ProxyType} />
        ) : (
          <PlaceholderView nav={active} />
        )}
      </main>
      <FloatingContacts />
    </div>
  );
}
