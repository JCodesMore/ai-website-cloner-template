"use client";

/** 全球 IP 代理 — 客户端交互层。
 *  五视图原地切换（同 /merchant 惯例，?view= 深链 + replaceState 保持）；
 *  纯前端演示壳：余额充值 / 购买 / 订单为会话内状态（预置样本订单），刷新即重置。
 *  价格与国家覆盖对齐 LamaProxy 后端 seed，ISP / 数据中心按 $/IP/天 计费。 */

import { useEffect, useRef, useState } from "react";
import { IP_PROXY_CONFIG } from "@/lib/proxy-ip-config";
import { TRAFFIC_COUNTRIES } from "@/lib/traffic-countries";

export type ViewKey =
  | "overview"
  | "residential"
  | "mobile"
  | "isp"
  | "datacenter"
  | "purchased";

type BuyKey = Exclude<ViewKey, "overview" | "purchased">;

/* ── mock 数据（LamaProxy PRD §6 + 后端 seed）───────────── */

interface TrafficPlan {
  id: number;
  gb: number;
  pricePerGB: number;
  /** 折扣系数，1=原价，<1 打折（0.92 = 8% off），对齐原站 /api/proxy/{type}/plans */
  discount: number;
}

/* 对齐原站 /api/proxy/{type}/plans：住宅 $2.50/GB、移动 $5.00/GB，长档阶梯折扣（1/0.92/0.88/0.84/0.72） */
const TRAFFIC_PLANS: Record<"residential" | "mobile", TrafficPlan[]> = {
  residential: [
    { id: 1, gb: 1, pricePerGB: 2.5, discount: 1 },
    { id: 2, gb: 5, pricePerGB: 2.5, discount: 0.92 },
    { id: 3, gb: 10, pricePerGB: 2.5, discount: 0.88 },
    { id: 4, gb: 50, pricePerGB: 2.5, discount: 0.84 },
    { id: 5, gb: 100, pricePerGB: 2.5, discount: 0.72 },
  ],
  mobile: [
    { id: 1, gb: 1, pricePerGB: 5, discount: 1 },
    { id: 2, gb: 5, pricePerGB: 5, discount: 0.92 },
    { id: 3, gb: 10, pricePerGB: 5, discount: 0.88 },
    { id: 4, gb: 20, pricePerGB: 5, discount: 0.84 },
  ],
};

/* 已购流量套餐（演示样本，结构对齐原站 my/traffic）——住宅 / 移动各多条在用。
 *  whitelist 为国家白名单（渲染为国旗）；原站另有黑名单，本克隆按要求不做。 */
interface TrafficProxy {
  id: string;
  usedGb: number;
  totalGb: number;
  host: string;
  httpPort: number;
  socksPort: number;
  stickyStart: number;
  stickyEnd: number;
  username: string;
  password: string;
  whitelist: string[];
  /** 出口 IP 自动轮换间隔（分钟），0 = 关闭。对齐原站 my/traffic/{id}/config 默认值 30 */
  pollingInterval: number;
}

/* 流量型套餐没有到期日，状态只看用量；样本保证 正常 / 快用完（≥80%）/ 已用完 三种状态各有展示 */
const SAMPLE_TRAFFIC: Record<"residential" | "mobile", TrafficProxy[]> = {
  residential: [
    {
      id: "res_8f21c40a",
      usedGb: 3.4,
      totalGb: 10,
      host: "gw.huoad.com",
      httpPort: 823,
      socksPort: 824,
      stickyStart: 11000,
      stickyEnd: 12000,
      username: "icVwrpJC",
      password: "UAs1mFAB",
      whitelist: ["US", "GB", "DE"],
      pollingInterval: 30,
    },
    {
      id: "res_2d9b71e5",
      usedGb: 42.7,
      totalGb: 50,
      host: "gw.huoad.com",
      httpPort: 833,
      socksPort: 834,
      stickyStart: 13000,
      stickyEnd: 14000,
      username: "kQz3XvNp",
      password: "T7mWr2Ld",
      whitelist: [],
      pollingInterval: 0,
    },
    {
      id: "res_c05e33a9",
      usedGb: 5,
      totalGb: 5,
      host: "gw.huoad.com",
      httpPort: 843,
      socksPort: 844,
      stickyStart: 15000,
      stickyEnd: 16000,
      username: "bH8sYcRe",
      password: "nF4kPw6J",
      whitelist: ["HK", "JP", "SG"],
      pollingInterval: 10,
    },
  ],
  mobile: [
    {
      id: "mob_5fd0a927",
      usedGb: 1.2,
      totalGb: 5,
      host: "gw.huoad.com",
      httpPort: 7101,
      socksPort: 7102,
      stickyStart: 21000,
      stickyEnd: 22000,
      username: "wS9dQm3T",
      password: "cV5xKr8N",
      whitelist: ["US"],
      pollingInterval: 30,
    },
    {
      id: "mob_e3b48c61",
      usedGb: 8.9,
      totalGb: 10,
      host: "gw.huoad.com",
      httpPort: 7201,
      socksPort: 7202,
      stickyStart: 23000,
      stickyEnd: 24000,
      username: "jL2fBn7W",
      password: "qZ6tGy4M",
      whitelist: ["GB", "FR", "DE", "NL"],
      pollingInterval: 5,
    },
    {
      id: "mob_71c2f4b8",
      usedGb: 1,
      totalGb: 1,
      host: "gw.huoad.com",
      httpPort: 7301,
      socksPort: 7302,
      stickyStart: 25000,
      stickyEnd: 26000,
      username: "xD4hUv9C",
      password: "mK8pEs3R",
      whitelist: [],
      pollingInterval: 0,
    },
  ],
};

/* 概览流量卡：住宅 / 移动的已用 / 总量（与各自「已购套餐」列表一致） */
const trafficTotals = (list: TrafficProxy[]) => {
  const used = list.reduce((s, p) => s + p.usedGb, 0);
  const total = list.reduce((s, p) => s + p.totalGb, 0);
  return { used, total, left: total - used };
};

/* ISP / 数据中心：数量档、时长档折扣、国家覆盖均取自原站接口（见 proxy-ip-config）。
 *  自定义数量按「≤ 输入值的最大档」取折扣，与原站 me() 一致。 */
const qtyDiscountFor = (kind: "isp" | "datacenter", qty: number) => {
  const opts = IP_PROXY_CONFIG[kind].quantityOptions;
  const tier = [...opts].sort((a, b) => b.qty - a.qty).find((o) => o.qty <= qty);
  return tier ? tier.discount : 1;
};

const VIEW_TITLE: Record<ViewKey, string> = {
  overview: "概览",
  residential: "住宅代理",
  mobile: "移动代理",
  isp: "ISP 代理",
  datacenter: "数据中心代理",
  purchased: "订单列表",
};

const fmt = (n: number) => `$${n.toFixed(2)}`;

/* 国家码 → 国旗 emoji（白名单展示用） */
const flagOf = (code: string) =>
  [...code.toUpperCase()].map((c) => String.fromCodePoint(127462 + c.charCodeAt(0) - 65)).join("");

const orderId = () =>
  Array.from({ length: 4 }, () => Math.random().toString(16).slice(2, 10).padEnd(8, "0")).join("");

const pad = (n: number) => String(n).padStart(2, "0");

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const nowStr = () => {
  const d = new Date();
  return `${todayIso()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/* 续费延期：未到期从截止日起算，已到期从今天起算 */
const addDaysIso = (iso: string, days: number) => {
  const base = iso >= todayIso() ? iso : todayIso();
  const d = new Date(`${base}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/* ── 订单模型：样本 + 会话内新订单共用一份状态 ────────────
 *  date 存 ISO（YYYY-MM-DD），与 <input type="date"> 值同格式，字典序即时间序；
 *  time 用于概览「时间」列（样本仅有日期，新订单含时分）；
 *  gb / ips 供概览 KPI 汇总（失败订单不计）。 */

interface DemoOrder {
  id: string; // 32 位十六进制完整单号（表内截断为前 8 位，悬停 title 看全号）
  type: string;
  spec: string; // 概览「规格」列（IP 型含时长）
  qty: string; // 订单列表「数量」列
  amount: number;
  date: string; // ISO YYYY-MM-DD
  time: string;
  status: "done" | "failed";
  isTopup?: boolean;
  gb?: number;
  ips?: number;
}

/* 样本订单取自原站 LamaProxy 订单列表示例 */
const SEED_ORDERS: DemoOrder[] = [
  { id: "0a00d846f463142a2a7b1f8b97200ebc", type: "移动代理", spec: "5 GB", qty: "5 GB", amount: 23.0, date: "2026-07-03", time: "2026-07-03", status: "done", gb: 5 },
  { id: "84f0889f36dc2651e35b72eaa57f314c", type: "ISP 代理", spec: "1 IP", qty: "1 IP", amount: 5.0, date: "2026-06-24", time: "2026-06-24", status: "done", ips: 1 },
  { id: "b27c615f514bca8f7f6e202268b16ba6", type: "数据中心代理", spec: "2 IP", qty: "2 IP", amount: 3.5, date: "2026-06-19", time: "2026-06-19", status: "done", ips: 2 },
  { id: "9940761663a576aea99a188716d6acea", type: "ISP 代理", spec: "3 IP", qty: "3 IP", amount: 7.79, date: "2026-06-19", time: "2026-06-19", status: "done", ips: 3 },
  { id: "42dfcc07fda8a61a39007a0ebc616ea3", type: "住宅代理", spec: "5 GB", qty: "5 GB", amount: 11.5, date: "2026-06-07", time: "2026-06-07", status: "done", gb: 5 },
  { id: "bc1566bcc1d0aebd52728ea5dacde743", type: "住宅代理", spec: "10 GB", qty: "10 GB", amount: 22.0, date: "2026-06-06", time: "2026-06-06", status: "failed" },
  { id: "afef53c4bd4b8f390bb75933fb3ae50a", type: "住宅代理", spec: "10 GB", qty: "10 GB", amount: 22.0, date: "2026-06-06", time: "2026-06-06", status: "failed" },
  { id: "1425daefe2622bb8804f851cc36285b0", type: "移动代理", spec: "5 GB", qty: "5 GB", amount: 23.0, date: "2026-05-21", time: "2026-05-21", status: "done", gb: 5 },
  { id: "8bad22ad68e7024c5bf56cfd9d27addb", type: "住宅代理", spec: "+5 GB", qty: "+5 GB", amount: 11.5, date: "2026-05-20", time: "2026-05-20", status: "done", gb: 5 },
  { id: "41483051508e36fde0da75e34685020b", type: "住宅代理", spec: "+5 GB", qty: "+5 GB", amount: 11.5, date: "2026-05-20", time: "2026-05-20", status: "done", gb: 5 },
  { id: "242c407430cad3fbf286117403df2a44", type: "住宅代理", spec: "+5 GB", qty: "+5 GB", amount: 11.5, date: "2026-05-20", time: "2026-05-20", status: "done", gb: 5 },
  { id: "838742bcd26ecdcaac0159018e6e2b5c", type: "住宅代理", spec: "5 GB", qty: "5 GB", amount: 11.5, date: "2026-05-19", time: "2026-05-19", status: "done", gb: 5 },
  { id: "511054517757783c972b3a06e34dbce3", type: "住宅代理", spec: "5 GB", qty: "5 GB", amount: 11.5, date: "2026-05-19", time: "2026-05-19", status: "done", gb: 5 },
  { id: "12d99a39706839ca76a38ace57310fc6", type: "住宅代理", spec: "5 GB", qty: "5 GB", amount: 11.5, date: "2026-05-19", time: "2026-05-19", status: "done", gb: 5 },
];

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/* time 可能是纯日期（样本单）或「日期 时:分」（会话内新单），
   日期部分统一走 fmtDate，与订单列表/截止日期一列同格式 */
const fmtDateTime = (t: string) =>
  t.length > 10 ? `${fmtDate(t.slice(0, 10))} ${t.slice(11)}` : fmtDate(t);

/* 中文日期检索：「7月24号」「7月24日」「2026年7月」「24号」等写法解析成年/月/日，
   缺省的部分不参与比对（如「7月」= 任意年份的 7 月）。非中文日期写法返回 null。 */
interface CnDate {
  y?: number;
  m?: number;
  d?: number;
}

function parseCnDate(q: string): CnDate | null {
  if (!/[年月日号]/.test(q)) return null;
  const y = q.match(/(\d{4})\s*年/);
  const m = q.match(/(\d{1,2})\s*月/);
  const d = q.match(/(\d{1,2})\s*[日号]/);
  if (!y && !m && !d) return null;
  return {
    ...(y && { y: Number(y[1]) }),
    ...(m && { m: Number(m[1]) }),
    ...(d && { d: Number(d[1]) }),
  };
}

function matchCnDate(cn: CnDate, iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return (
    (cn.y === undefined || cn.y === y) &&
    (cn.m === undefined || cn.m === m) &&
    (cn.d === undefined || cn.d === d)
  );
}

/* ── 图标（lucide 同款线稿）────────────────────────────── */

function Icon({ d, children }: { d?: string; children?: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d ? <path d={d} /> : children}
    </svg>
  );
}

const ICONS: Record<ViewKey, React.ReactNode> = {
  overview: (
    <Icon>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="12" rx="1" />
    </Icon>
  ),
  /* residential=房+屋内 WiFi（家宽网络）、mobile=信号强度柱（蜂窝网络） */
  residential: (
    <Icon>
      <path d="M9.5 13.866a4 4 0 0 1 5 .01" />
      <path d="M12 17h.01" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M7 10.754a8 8 0 0 1 10 0" />
    </Icon>
  ),
  mobile: (
    <Icon>
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </Icon>
  ),
  /* isp=路由器（运营商线路）、datacenter=机房大楼（IDC） */
  isp: (
    <Icon>
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6.01 18H6" />
      <path d="M10.01 18H10" />
      <path d="M15 10v4" />
      <path d="M17.84 7.17a4 4 0 0 0-5.66 0" />
      <path d="M20.66 4.34a8 8 0 0 0-11.31 0" />
    </Icon>
  ),
  datacenter: (
    <Icon>
      <path d="M10 12h4" />
      <path d="M10 8h4" />
      <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    </Icon>
  ),
  purchased: (
    <Icon>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </Icon>
  ),
};

/* 侧栏项对齐原站 LamaProxy 顺序：概览 · ISP · 数据中心 · 住宅 · 移动 · 订单列表 */
const NAV: { key: ViewKey; label: string }[] = [
  { key: "overview", label: "概览" },
  { key: "isp", label: "ISP 代理" },
  { key: "datacenter", label: "数据中心代理" },
  { key: "residential", label: "住宅代理" },
  { key: "mobile", label: "移动代理" },
];

// 剪贴板 API 被权限策略拒绝时退回 execCommand（与已购代理列表同一策略）
async function copyText(text: string, notify: (msg: string) => void) {
  try {
    await navigator.clipboard.writeText(text);
    notify("已复制到剪贴板");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    notify(ok ? "已复制到剪贴板" : "复制失败，请手动复制");
  }
}

function StatusBadge({ status }: { status: DemoOrder["status"] }) {
  return (
    <span className={`hp-badge ${status}`}>{status === "done" ? "已完成" : "失败"}</span>
  );
}

/* ── 订单侧栏公共行：可用余额 + 充值入口 ─────────────────── */

function BalanceRow({ balance, onTopup }: { balance: number; onTopup: () => void }) {
  return (
    <div className="hp-or">
      <span>可用余额</span>
      <b>
        {fmt(balance)}
        <button type="button" className="hp-topup-link" onClick={onTopup}>
          充值
        </button>
      </b>
    </div>
  );
}

/* ── 概览 ─────────────────────────────────────────────── */

/* KPI 图标（lucide 线稿：wallet）；流量卡直接复用侧栏 ICONS 的住宅 / 移动图标 */
const KPI_ICONS = {
  balance: (
    <Icon>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </Icon>
  ),
  ips: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </Icon>
  ),
};

/* 快速购买入口：原站淡彩图标 + 名称，下附一句话说明 */
const QUICK: { key: BuyKey; desc: string }[] = [
  { key: "residential", desc: "真实家庭 IP，像普通网民，适合采集和多账号" },
  { key: "mobile", desc: "4G/5G 手机网络 IP，最难被封，适合养号" },
  { key: "isp", desc: "固定不变的住宅 IP，稳定独享，适合长期登录" },
  { key: "datacenter", desc: "机房 IP，速度最快最便宜，适合批量任务" },
];

/* 距到期天数（当天到期 = 0） */
const daysLeft = (iso: string) =>
  Math.max(0, Math.ceil((Date.parse(iso) - Date.now()) / 86400000));

/* 中文拼音排序（国家网格展示序，与原站一致） */
const zhCompare = new Intl.Collator("zh").compare;

/* 渠道商：三家上游 IP 池，单价一致；默认值持久化在 localStorage */
type Channel = "A" | "B" | "C";
const CHANNELS: Channel[] = ["A", "B", "C"];
const CHANNEL_KEY = "hp-default-channel";

function Overview({
  go,
  balance,
  orders,
  onTopup,
  ipProxies,
  traffic,
  notify,
}: {
  go: (v: ViewKey, opts?: { expirySort?: boolean; focusId?: number | string }) => void;
  balance: number;
  orders: DemoOrder[];
  onTopup: () => void;
  ipProxies: Record<"isp" | "datacenter", PurchasedProxy[]>;
  traffic: Record<"residential" | "mobile", TrafficProxy[]>;
  notify: (msg: string) => void;
}) {
  // 即将到期数据从实时已购列表推导（只统计未到期条目，续费后即时更新）
  const active = [
    ...ipProxies.isp.map((p) => ({ ...p, kind: "isp" as const })),
    ...ipProxies.datacenter.map((p) => ({ ...p, kind: "datacenter" as const })),
  ].filter((p) => p.expiry >= todayIso());
  // 即将到期：面板与告急套餐混排后只亮最紧急 6 条稳住概览高度，
  // 放不下的走头部「查看全部」弹窗（全部 7 天内到期 + 流量告急，内部滚动）
  const sortedByExpiry = [...active].sort((a, b) => a.expiry.localeCompare(b.expiry));
  const urgent = sortedByExpiry.filter((p) => daysLeft(p.expiry) <= 7);
  const expiring7d = urgent.length;
  const [showAll, setShowAll] = useState(false);
  // IP 总数卡：有效 IP 按类型分项（与已购列表 / 即将到期同一份数据推导）
  const ispActive = active.filter((p) => p.kind === "isp").length;
  const dcActive = active.length - ispActive;
  // 快速购买卡右上角持有量角标：IP 型计有效 IP 数，流量型计套餐数
  const holdings: Record<BuyKey, string> = {
    isp: `${ispActive} IP`,
    datacenter: `${dcActive} IP`,
    residential: `${traffic.residential.length} 套餐`,
    mobile: `${traffic.mobile.length} 套餐`,
  };
  // 流量告急：住宅 / 移动套餐用量 ≥ 85% 时列入「需要关注」（流量型没有到期日，
  // 紧迫感来自快用尽），最紧张的排前面，点击去对应套餐页续购
  const trafficAlerts = (["residential", "mobile"] as const)
    .flatMap((kind) => traffic[kind].map((p) => ({ ...p, kind })))
    .filter((p) => p.usedGb / p.totalGb >= 0.85)
    .sort((a, b) => b.usedGb / b.totalGb - a.usedGb / a.totalGb);
  // KPI 流量卡与告急行共用实时套餐状态（购买 / 升级加量后即时更新）
  const stats = {
    residential: trafficTotals(traffic.residential),
    mobile: trafficTotals(traffic.mobile),
  };

  // 到期行 / 告急行：面板与「查看全部」弹窗共用同一渲染。
  // 行是 div 而非 button——中间嵌着「续费/续购」真按钮，按钮不能套按钮
  const ipRow = (p: (typeof sortedByExpiry)[number]) => {
    const days = daysLeft(p.expiry);
    // 行点击与行内按钮都具体到条目——预勾选该 IP，续费条直接展开
    const goRenew = () => go(p.kind, { expirySort: true, focusId: p.id });
    return (
      <div key={`${p.kind}-${p.id}`} className="hp-exp-row" onClick={goRenew}>
        <span className={`hp-exp-kind ${p.kind}`}>
          {p.kind === "isp" ? "ISP" : "数据中心"}
        </span>
        <span className="hp-exp-geo">
          <span className="hp-flag">{p.flag}</span>
          {p.country}
        </span>
        <span className="hp-exp-ip">
          {p.ip}:{p.httpPort}
        </span>
        <button
          type="button"
          className="hp-exp-renew"
          onClick={(e) => {
            e.stopPropagation();
            goRenew();
          }}
        >
          续费
        </button>
        <span className="hp-exp-date">{fmtDate(p.expiry)}</span>
        <span className={`hp-exp-days${days <= 7 ? " danger" : days <= 30 ? " warn" : ""}`}>
          {days === 0 ? "今日到期" : `剩 ${days} 天`}
        </span>
      </div>
    );
  };
  const trafficRow = (p: (typeof trafficAlerts)[number]) => {
    const pct = Math.round((p.usedGb / p.totalGb) * 100);
    const left = p.totalGb - p.usedGb;
    // 行内按钮具体到套餐——落地直接打开该套餐的续费弹窗
    const goRenew = () => go(p.kind, { focusId: p.id });
    return (
      <div key={p.id} className="hp-exp-row" onClick={goRenew}>
        <span className={`hp-exp-kind ${p.kind}`}>
          {p.kind === "residential" ? "住宅" : "移动"}
        </span>
        <span className="hp-exp-geo">{p.totalGb} GB 套餐</span>
        <span className="hp-exp-ip">
          {p.host}:{p.httpPort}
        </span>
        <button
          type="button"
          className="hp-exp-renew"
          onClick={(e) => {
            e.stopPropagation();
            goRenew();
          }}
        >
          续费
        </button>
        <span className="hp-exp-date">已用 {pct}%</span>
        <span className={`hp-exp-days${pct >= 95 ? " danger" : " warn"}`}>
          剩 {left >= 10 ? Math.round(left) : left.toFixed(1)} GB
        </span>
      </div>
    );
  };

  // 面板混排：到期 IP 与告急套餐按紧迫度归一后只亮最紧急的 6 条，其余进「查看全部」。
  // 归一口径：IP 取剩余天数 / 7 天徽标阈值，套餐取剩余流量比 / 15% 告急阈值，
  // 0 = 最紧急；同分时稳定排序保持到期 IP 在前
  const panelRows = [
    ...sortedByExpiry.slice(0, 6).map((p) => ({
      urgency: daysLeft(p.expiry) / 7,
      node: ipRow(p),
    })),
    ...trafficAlerts.map((p) => ({
      urgency: (1 - p.usedGb / p.totalGb) / 0.15,
      node: trafficRow(p),
    })),
  ]
    .sort((a, b) => a.urgency - b.urgency)
    .slice(0, 6)
    .map((r) => r.node);

  return (
    <>
      {/* KPI 行：余额 + 住宅/移动剩余流量（与各自「已购套餐」列表一致）；
          余额卡同钱包卡做橙调渐变高亮，并带充值药丸 */}
      <div className="hp-kpis">
        <div className="hp-kpi main">
          <div className="hp-kpi-top">
            账户余额
            <span className="hp-kpi-ic">{KPI_ICONS.balance}</span>
          </div>
          <div className="hp-kpi-v">
            <i>$</i>
            {balance.toFixed(2)}
          </div>
          <div className="hp-kpi-sub">
            可用于购买代理
            <button type="button" className="hp-kpi-topup" onClick={onTopup}>
              充值
            </button>
          </div>
        </div>
        <div className="hp-kpi residential">
          <div className="hp-kpi-top">
            住宅流量（剩余）
            <span className="hp-kpi-ic">{ICONS.residential}</span>
          </div>
          <div className="hp-kpi-v">
            {stats.residential.left.toFixed(1)}
            <em>GB</em>
          </div>
          <div className="hp-kpi-sub">
            已用 {stats.residential.used.toFixed(1)} /{" "}
            {stats.residential.total.toFixed(1)} GB
          </div>
          <div className="hp-kpi-bar">
            <span
              style={{
                width: `${Math.min(100, (stats.residential.used / stats.residential.total) * 100)}%`,
              }}
            />
          </div>
        </div>
        <div className="hp-kpi mobile">
          <div className="hp-kpi-top">
            移动流量（剩余）
            <span className="hp-kpi-ic">{ICONS.mobile}</span>
          </div>
          <div className="hp-kpi-v">
            {stats.mobile.left.toFixed(1)}
            <em>GB</em>
          </div>
          <div className="hp-kpi-sub">
            已用 {stats.mobile.used.toFixed(1)} /{" "}
            {stats.mobile.total.toFixed(1)} GB
          </div>
          <div className="hp-kpi-bar">
            <span
              style={{
                width: `${Math.min(100, (stats.mobile.used / stats.mobile.total) * 100)}%`,
              }}
            />
          </div>
        </div>
        <div className="hp-kpi ips">
          <div className="hp-kpi-top">
            IP 总数
            <span className="hp-kpi-ic">{KPI_ICONS.ips}</span>
          </div>
          <div className="hp-kpi-v">{active.length}</div>
          <div className="hp-kpi-sub">
            ISP {ispActive} 个 · 数据中心 {dcActive} 个
          </div>
        </div>
      </div>

      <div className="hp-panel hp-quick-panel">
        <div className="hp-quick-title">快速购买</div>
        <div className="hp-quick">
          {QUICK.map(({ key, desc }) => (
            <button
              key={key}
              type="button"
              className={`hp-qcard ${key}`}
              onClick={() => go(key)}
            >
              <span className="hp-qicon">{ICONS[key]}</span>
              <span className="hp-qtxt">
                <span className="hp-qlabel">{VIEW_TITLE[key]}</span>
                <span className="hp-qdesc">{desc}</span>
              </span>
              <span className="hp-qcount">{holdings[key]}</span>
              <span className="hp-qgo">
                <Icon>
                  <path d="m9 18 6-6-6-6" />
                </Icon>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 需要关注（通栏）——到期 IP 的续费时点 + 用量告急套餐的续购时点 */}
      <div className="hp-panel hp-exp-panel">
        <div className="hp-panel-head">
          需要关注
          {expiring7d > 0 && <span className="hp-exp-badge">7 天内 {expiring7d} 条到期</span>}
          {trafficAlerts.length > 0 && (
            <span className="hp-exp-badge warn">{trafficAlerts.length} 个套餐流量告急</span>
          )}
          {expiring7d + trafficAlerts.length > 6 && (
            <button type="button" className="hp-seeall" onClick={() => setShowAll(true)}>
              查看全部
              <Icon>
                <path d="m9 18 6-6-6-6" />
              </Icon>
            </button>
          )}
        </div>
        <div className="hp-exp">{panelRows}</div>
      </div>

      <div className="hp-panel">
        <div className="hp-panel-head">
          近期订单
        </div>
        <div className="hp-pp-scroll">
        <table className="hp-table hp-otable hp-otable-recent">
          <thead>
            <tr>
              <th>订单号</th>
              <th>类型</th>
              <th>规格</th>
              <th>金额</th>
              <th>状态</th>
              <th>时间</th>
            </tr>
          </thead>
          {orders.length > 0 && (
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id}>
                  <td className="hp-mono" title={o.id}>
                    <span className="hp-cred">
                      {o.id.slice(0, 8)}…
                      <button
                        type="button"
                        className="hp-icon-btn"
                        onClick={() => copyText(o.id, notify)}
                        aria-label="复制订单号"
                      >
                        {COPY_ICON}
                      </button>
                    </span>
                  </td>
                  <td>{o.type}</td>
                  <td>{o.spec}</td>
                  <td>{fmt(o.amount)}</td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td>{fmtDateTime(o.time)}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        </div>
        {orders.length === 0 && (
          <div className="hp-empty">
            <Icon>
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </Icon>
            暂无订单
            <button type="button" className="hp-empty-cta" onClick={() => go("residential")}>
              去购买 →
            </button>
          </div>
        )}
      </div>

      {/* 「查看全部」：7 天内到期全量 + 流量告急，行为与面板行完全一致；
          点行/按钮切视图后 Overview 卸载，弹窗随之关闭，无需手动收 */}
      {showAll && (
        <div className="hp-mask" onClick={() => setShowAll(false)}>
          <div className="hp-modal hp-modal-wide" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hp-modal-x"
              onClick={() => setShowAll(false)}
              aria-label="关闭"
            >
              ×
            </button>
            <h3>需要关注</h3>
            <p className="hp-modal-sub">
              7 天内 {expiring7d} 条到期
              {trafficAlerts.length > 0 && ` · ${trafficAlerts.length} 个套餐流量告急`}
            </p>
            <div className="hp-expall">
              {urgent.map(ipRow)}
              {trafficAlerts.map(trafficRow)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── 住宅 / 移动：流量套餐 ─────────────────────────────── */

const EYE_ICON = (
  <Icon>
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

const EYE_OFF_ICON = (
  <Icon>
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </Icon>
);

const DOWNLOAD_ICON = (
  <Icon>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </Icon>
);

/* 连接信息行：账号 / 密码支持遮罩 + 眼睛切换 */
function InfoRow({ label, value, secret = false }: { label: string; value: string; secret?: boolean }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="hp-conn-row">
      <span className="hp-conn-label">{label}</span>
      <span className="hp-conn-val hp-mono">{secret && !shown ? "••••••••" : value}</span>
      {secret && (
        <button
          type="button"
          className="hp-icon-btn"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? "隐藏" : "显示"}
        >
          {shown ? EYE_OFF_ICON : EYE_ICON}
        </button>
      )}
    </div>
  );
}

/* 代理列表生成器：轮询（共享端口）+ 粘滞（stickyStart+i）；协议切换 + 数量 → 复制 / 下载 */
function ProxyListGen({ entry, notify }: { entry: TrafficProxy; notify: (m: string) => void }) {
  const max = Math.min(500, entry.stickyEnd - entry.stickyStart + 1);
  const [protocol, setProtocol] = useState<"http" | "socks5">("http");
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  const n = Math.min(Math.max(1, qty), max);
  const port = protocol === "socks5" ? entry.socksPort : entry.httpPort;
  const rotating = Array.from({ length: n }, () => `${entry.username}:${entry.password}@${entry.host}:${port}`);
  const sticky = Array.from(
    { length: n },
    (_, i) => `${entry.username}:${entry.password}@${entry.host}:${entry.stickyStart + i}`,
  );

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(key);
    notify("已复制到剪贴板");
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
  };

  const download = (key: string, text: string, count: number) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proxies_${key}_${protocol}_${count}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const list = (key: "rotating" | "sticky", label: string, lines: string[]) => {
    const text = lines.join("\n");
    return (
      <div>
        <div className="hp-plist-head">
          <h5>{label}</h5>
          <span>{lines.length}</span>
        </div>
        <textarea readOnly value={text} rows={Math.min(lines.length, 8)} className="hp-plist-area" />
        <div className="hp-plist-btns">
          <button type="button" className="hp-plist-copy" onClick={() => copy(key, text)}>
            {copied === key ? "已复制" : "复制"}
          </button>
          <button type="button" className="hp-plist-dl" onClick={() => download(key, text, lines.length)}>
            {DOWNLOAD_ICON}下载
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="hp-plist-wrap">
      <div className="hp-plist-tools">
        <h4>代理列表</h4>
        <div className="hp-plist-ctl">
          <span>协议</span>
          {(["http", "socks5"] as const).map((p) => (
            <button
              key={p}
              type="button"
              className={`hp-proto${protocol === p ? " on" : ""}`}
              onClick={() => setProtocol(p)}
            >
              {p === "http" ? "HTTP/HTTPS" : "SOCKS5"}
            </button>
          ))}
          <span>数量</span>
          <input
            type="number"
            min={1}
            max={max}
            value={qty}
            onChange={(e) => setQty(Math.min(max, Math.max(1, Number(e.target.value) || 1)))}
            className="hp-plist-qty"
          />
        </div>
      </div>
      <div className="hp-plist-grid">
        {list("rotating", "轮询代理", rotating)}
        {list("sticky", "粘滞代理", sticky)}
      </div>
    </div>
  );
}

/* 已购套餐卡：用量条 + 配置/升级 + 连接信息 + 白名单国家 + 代理列表生成器（无黑名单）。
 *  流量型没有到期日，状态只看用量，三档递进：正常无徽标；≥80%「快用完」橙徽标 +
 *  升级变橙色实心「续购」；已用完红徽标 + 停服横幅，连接信息与代理列表置灰。 */
function TrafficPurchasedCard({
  entry,
  focus = null,
  notify,
  onConfig,
  onUpgrade,
}: {
  entry: TrafficProxy;
  /** 「需要关注」行内续购跳入的目标卡：弹窗期间常亮描边（hold）→ 关闭后渐隐（fade） */
  focus?: "hold" | "fade" | null;
  notify: (m: string) => void;
  onConfig: () => void;
  onUpgrade: () => void;
}) {
  const pct = Math.min(100, (entry.usedGb / entry.totalGb) * 100);
  const depleted = entry.usedGb >= entry.totalGb;
  const nearFull = pct >= 80;
  const low = !depleted && nearFull;
  // 用量三档：<40% 充足（绿）、40–80% 偏高（橙，默认色）、≥80% 告急（红）
  const fillTone = nearFull ? " full" : pct < 40 ? " ok" : "";
  const left = entry.totalGb - entry.usedGb;

  return (
    <div
      id={entry.id}
      className={`hp-panel hp-tp${depleted ? " depleted" : ""}${
        focus === "hold" ? " focus" : focus === "fade" ? " flash" : ""
      }`}
    >
      <div className="hp-tp-top">
        <div>
          <p className="hp-tp-id hp-mono">
            {entry.id}
            {depleted && <span className="hp-exp-days danger">已用完</span>}
            {low && <span className="hp-exp-days warn">快用完</span>}
          </p>
          <p className="hp-tp-usage">
            {entry.usedGb.toFixed(1)}
            <span> / {entry.totalGb} GB</span>
          </p>
        </div>
        <div className="hp-tp-actions">
          <button type="button" className="hp-tp-btn" onClick={onConfig}>
            配置
          </button>
          <button
            type="button"
            className={`hp-tp-btn${depleted || low ? " renew" : ""}`}
            onClick={onUpgrade}
          >
            {depleted || low ? "续费" : "升级"}
          </button>
        </div>
      </div>

      {depleted && (
        <div className="hp-tp-out-bar">
          流量已用完，代理已停止服务；续费流量后立即恢复。
        </div>
      )}

      <div className="hp-tp-bar">
        <div className={`hp-tp-fill${fillTone}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="hp-tp-meta">
        <span>已使用 {entry.usedGb.toFixed(1)} GB</span>
        <span className={nearFull ? "full" : undefined}>剩余 {left.toFixed(1)} GB</span>
      </div>

      <div className="hp-tp-grid">
        <div className="hp-tp-box">
          <p className="hp-tp-box-h">连接信息</p>
          <InfoRow label="HTTP" value={`${entry.host}:${entry.httpPort}`} />
          <InfoRow label="SOCKS5" value={`${entry.host}:${entry.socksPort}`} />
          <InfoRow label="粘滞端口" value={`${entry.host}:${entry.stickyStart}–${entry.stickyEnd}`} />
          <div className="hp-tp-div" />
          <InfoRow label="账号" value={entry.username} secret />
          <InfoRow label="密码" value={entry.password} secret />
        </div>
        <div className="hp-tp-box">
          <p className="hp-tp-box-h">白名单国家</p>
          {entry.whitelist.length > 0 ? (
            <div className="hp-wl">
              {entry.whitelist.map((c) => (
                <span key={c} title={c}>
                  {flagOf(c)}
                </span>
              ))}
            </div>
          ) : (
            <p className="hp-tp-empty">未设置白名单</p>
          )}
        </div>
      </div>

      <ProxyListGen entry={entry} notify={notify} />
    </div>
  );
}

/* ── 代理配置弹窗 ──────────────────────────────────────────
 *  对齐原站 TrafficConfigModal：轮询间隔（0–120 分钟，0=关闭）+ 白名单国家
 *  （搜索 / 全选 / 清空 / 已选药丸）。原站的黑名单本克隆按要求不做。
 *  国家池见 traffic-countries（对齐原站 my/traffic/{id}/countries）。 */

const CONFIG_COUNTRIES = TRAFFIC_COUNTRIES;
const POLL_MAX = 120;

function TrafficConfigModal({
  entry,
  onClose,
  onSave,
}: {
  entry: TrafficProxy;
  onClose: () => void;
  onSave: (cfg: { pollingInterval: number; whitelist: string[] }) => void;
}) {
  const [poll, setPoll] = useState(entry.pollingInterval);
  const [list, setList] = useState<string[]>(entry.whitelist);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const q = search.trim().toLowerCase();
  const shown = q
    ? CONFIG_COUNTRIES.filter(
        (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
      )
    : CONFIG_COUNTRIES;
  const allShownPicked = shown.length > 0 && shown.every((c) => list.includes(c.code));
  const picked = list.map((c) => CONFIG_COUNTRIES.find((x) => x.code === c)).filter((c) => !!c);

  const toggle = (code: string) => {
    setSaved(false);
    setList((p) => (p.includes(code) ? p.filter((x) => x !== code) : [...p, code]));
  };

  // 保存后先亮「配置已保存」，短暂停留再关闭（原站 800ms）
  const save = () => {
    onSave({ pollingInterval: poll, whitelist: list });
    setSaved(true);
    setTimeout(onClose, 800);
  };

  return (
    <div className="hp-mask" onClick={onClose}>
      <div className="hp-modal hp-modal-wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="hp-modal-x" onClick={onClose} aria-label="关闭">
          ×
        </button>
        <h3>代理配置</h3>
        <p className="hp-modal-sub hp-mono">{entry.id}</p>

        <div className="hp-cfg-body">
          <div className="hp-cfg-sec">
            <label className="hp-cfg-label" htmlFor="hp-poll">
              轮询间隔
              <span className="hp-cfg-val">{poll === 0 ? "关闭" : `${poll} min`}</span>
            </label>
            <input
              id="hp-poll"
              type="range"
              min={0}
              max={POLL_MAX}
              step={1}
              value={poll}
              onChange={(e) => {
                setSaved(false);
                setPoll(Number(e.target.value));
              }}
              className="hp-range"
              style={{
                background: `linear-gradient(90deg, #fa6b1f 0%, #fa6b1f ${(poll / POLL_MAX) * 100}%, #e3e3e3 ${(poll / POLL_MAX) * 100}%, #e3e3e3 100%)`,
              }}
            />
            <div className="hp-cfg-ends">
              <span>关闭</span>
              <span>{POLL_MAX} min</span>
            </div>
            <p className="hp-cfg-hint">设为 0 表示不自动轮换出口 IP</p>
          </div>

          <div className="hp-cfg-sec">
            <span className="hp-cfg-label">
              白名单国家
              {list.length > 0 && <span className="hp-cfg-count">（已选: {list.length}）</span>}
            </span>
            <p className="hp-cfg-hint">指定出口节点国家，留空则全球随机</p>

            {picked.length > 0 && (
              <div className="hp-cfg-chips">
                {picked.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className="hp-cfg-chip"
                    onClick={() => toggle(c.code)}
                    aria-label={`移除 ${c.name}`}
                  >
                    <span>{flagOf(c.code)}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            <input
              className="hp-cfg-search"
              type="text"
              placeholder="搜索国家"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="hp-cfg-tools">
              <span>{shown.length > 0 ? `当前显示 ${shown.length} 个国家` : "无匹配结果"}</span>
              <span className="hp-cfg-acts">
                <button
                  type="button"
                  className="hp-cfg-act"
                  disabled={shown.length === 0 || allShownPicked}
                  onClick={() => {
                    setSaved(false);
                    setList((p) => [...new Set([...p, ...shown.map((c) => c.code)])]);
                  }}
                >
                  全选国家
                </button>
                <button
                  type="button"
                  className="hp-cfg-act muted"
                  disabled={list.length === 0}
                  onClick={() => {
                    setSaved(false);
                    setList([]);
                  }}
                >
                  清空
                </button>
              </span>
            </div>

            <div className="hp-cfg-list">
              {shown.length === 0 ? (
                <p className="hp-cfg-none">无匹配结果</p>
              ) : (
                shown.map((c) => (
                  <label key={c.code} className="hp-cfg-row">
                    <input
                      type="checkbox"
                      checked={list.includes(c.code)}
                      onChange={() => toggle(c.code)}
                    />
                    <span className="hp-cfg-flag">{flagOf(c.code)}</span>
                    <span className="hp-cfg-name">{c.name}</span>
                    <span className="hp-cfg-code hp-mono">{c.code}</span>
                    <span className="hp-cfg-num">{c.count > 0 ? c.count.toLocaleString() : ""}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="hp-cfg-foot">
          <span className="hp-cfg-ok">{saved ? "配置已保存" : ""}</span>
          <span className="hp-cfg-btns">
            <button type="button" className="hp-tp-btn" onClick={onClose}>
              取消
            </button>
            <button type="button" className="hp-checkout hp-cfg-save" onClick={save}>
              保存配置
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── 升级流量套餐弹窗 ───────────────────────────────────────
 *  对齐原站：当前用量 + 档位列表（划线原价 / 折后单价 / 小计）+ 确认。
 *  原站确认后跳 /payment；本克隆是演示壳，改为走余额结算并把流量加到该套餐上。
 *  从快用完 / 已用完入口进来时口径改为「续购」（同一动作：购流量包补充该套餐）。 */

function TrafficUpgradeModal({
  entry,
  kind,
  onClose,
  onConfirm,
}: {
  entry: TrafficProxy;
  kind: "residential" | "mobile";
  onClose: () => void;
  onConfirm: (p: TrafficPlan) => void;
}) {
  const [pick, setPick] = useState<TrafficPlan | null>(null);
  const total = pick ? pick.gb * pick.pricePerGB * pick.discount : 0;
  const depleted = entry.usedGb >= entry.totalGb;
  const renewing = depleted || entry.usedGb / entry.totalGb >= 0.8;

  return (
    <div className="hp-mask" onClick={onClose}>
      <div className="hp-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="hp-modal-x" onClick={onClose} aria-label="关闭">
          ×
        </button>
        <h3>{renewing ? "续费流量" : "升级流量套餐"}</h3>
        <p className="hp-modal-sub">
          当前已用 {entry.usedGb.toFixed(1)} GB / {entry.totalGb} GB
          {depleted && " · 购买后服务立即恢复"}
        </p>

        <div className="hp-up-plans">
          {TRAFFIC_PLANS[kind].map((p) => {
            const off = p.discount < 1;
            const each = p.pricePerGB * p.discount;
            return (
              <button
                key={p.id}
                type="button"
                className={`hp-up-plan${pick?.id === p.id ? " on" : ""}`}
                onClick={() => setPick(p)}
              >
                <span className="hp-up-left">
                  <span className="hp-up-gb">{p.gb} GB</span>
                  {off && <span className="hp-up-off">-{discountOff(p.discount)}%</span>}
                </span>
                <span className="hp-up-price">
                  <b>{fmt(p.gb * each)}</b>
                  <span className="hp-up-unit">
                    {off && <s>{fmt(p.pricePerGB)}</s>}
                    {fmt(each)}/GB
                    {off && (
                      <em className="hp-up-save">省 {fmt(p.gb * (p.pricePerGB - each))}</em>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="hp-cfg-btns">
          <button type="button" className="hp-tp-btn hp-up-cancel" onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className="hp-checkout hp-up-ok"
            disabled={!pick}
            onClick={() => pick && onConfirm(pick)}
          >
            {renewing ? "确认续费" : "确认升级"}
            {pick ? ` · ${fmt(total)}` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrafficBuy({
  kind,
  planId,
  balance,
  purchased,
  onSelect,
  onTopup,
  onCheckout,
  onSaveConfig,
  onUpgrade,
  focusUpgradeId = null,
  notify,
}: {
  kind: "residential" | "mobile";
  planId: number | null;
  balance: number;
  purchased: TrafficProxy[];
  onSelect: (id: number) => void;
  onTopup: () => void;
  onCheckout: (picked: TrafficPlan) => void;
  onSaveConfig: (id: string, cfg: { pollingInterval: number; whitelist: string[] }) => void;
  onUpgrade: (entry: TrafficProxy, p: TrafficPlan) => boolean;
  /** 「需要关注」行内续购带过来的套餐 id：进入即打开该套餐的续费弹窗并高亮其卡片 */
  focusUpgradeId?: string | null;
  notify: (m: string) => void;
}) {
  const plans = TRAFFIC_PLANS[kind];
  // 打开的弹窗只记 id，套餐数据始终从 purchased 取，保存后弹窗内即刻反映最新值
  const [cfgId, setCfgId] = useState<string | null>(null);
  const [upId, setUpId] = useState<string | null>(focusUpgradeId);
  // 续购落地的高亮两阶段：弹窗打开期间目标卡常亮描边（hold），
  // 关闭弹窗后滚到该卡并渐隐（fade）——否则动画在弹窗背后早就放完了
  const [focusStage, setFocusStage] = useState<"hold" | "fade" | null>(
    focusUpgradeId ? "hold" : null,
  );
  const closeUpgrade = () => {
    setUpId(null);
    if (focusStage === "hold" && focusUpgradeId) {
      setFocusStage("fade");
      requestAnimationFrame(() =>
        document
          .getElementById(focusUpgradeId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
    }
  };
  // 已购套餐筛选：全部 / 只看已用完（续购加量后条目自动回到「全部」侧，筛选态显空提示）
  const [onlyDepleted, setOnlyDepleted] = useState(false);
  const depletedCount = purchased.filter((e) => e.usedGb >= e.totalGb).length;
  const shownPurchased = onlyDepleted
    ? purchased.filter((e) => e.usedGb >= e.totalGb)
    : purchased;
  const cfgEntry = purchased.find((e) => e.id === cfgId) ?? null;
  const upEntry = purchased.find((e) => e.id === upId) ?? null;
  const picked = plans.find((p) => p.id === planId) ?? null;
  const unit = picked ? picked.pricePerGB * picked.discount : 0;
  const total = picked ? picked.gb * unit : 0;
  const note = !picked
    ? "请先选择套餐"
    : total > balance
      ? "余额不足，请先充值"
      : "";

  return (
    <>
      <div className="hp-buy">
        <div className="hp-buy-main">
          <div className="hp-panel">
            <div className="hp-panel-head">选择流量套餐</div>
            <div className="hp-panel-body">
              <div className="hp-plans">
                {plans.map((p) => {
                  const off = p.discount < 1;
                  const each = p.pricePerGB * p.discount;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`hp-plan${p.id === planId ? " on" : ""}`}
                      onClick={() => onSelect(p.id)}
                    >
                      {off && <span className="hp-plan-off">-{discountOff(p.discount)}%</span>}
                      <b>{p.gb} GB</b>
                      <span>
                        {off && <s>{fmt(p.pricePerGB)}</s>}
                        {fmt(each)} / GB
                      </span>
                      <i>小计 {fmt(p.gb * each)}</i>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="hp-order">
          <h3>您的订单</h3>
          <BalanceRow balance={balance} onTopup={onTopup} />
          <div className="hp-or">
            <span>已选流量</span>
            <b>{picked ? `${picked.gb} GB` : "—"}</b>
          </div>
          <div className="hp-or">
            <span>单价</span>
            <b>{picked ? `${fmt(unit)} / GB` : "—"}</b>
          </div>
          {picked && picked.discount < 1 && (
            <div className="hp-or">
              <span>折扣</span>
              <b className="hp-disc">-{discountOff(picked.discount)}%</b>
            </div>
          )}
          <div className="hp-total">
            <span>总计</span>
            <b className={total > 0 ? "on" : undefined}>{fmt(total)}</b>
          </div>
          <button
            type="button"
            className="hp-checkout"
            disabled={!picked}
            onClick={() => picked && onCheckout(picked)}
          >
            结账
          </button>
          {note && <p className="hp-order-note">{note}</p>}
        </aside>
      </div>

      {purchased.length > 0 && (
        <div className="hp-tp-list">
          <div className="hp-tp-listhead">
            <h2 className="hp-tp-h">已购套餐</h2>
            <div className="hp-tp-filter">
              <button
                type="button"
                className={`hp-proto${!onlyDepleted ? " on" : ""}`}
                onClick={() => setOnlyDepleted(false)}
              >
                全部 {purchased.length}
              </button>
              <button
                type="button"
                className={`hp-proto${onlyDepleted ? " on" : ""}`}
                onClick={() => setOnlyDepleted(true)}
              >
                已用完 {depletedCount}
              </button>
            </div>
          </div>
          {shownPurchased.map((entry) => (
            <TrafficPurchasedCard
              key={entry.id}
              entry={entry}
              focus={entry.id === focusUpgradeId ? focusStage : null}
              notify={notify}
              onConfig={() => setCfgId(entry.id)}
              onUpgrade={() => setUpId(entry.id)}
            />
          ))}
          {shownPurchased.length === 0 && (
            <div className="hp-empty">没有流量用完的套餐</div>
          )}
        </div>
      )}

      {cfgEntry && (
        <TrafficConfigModal
          key={cfgEntry.id}
          entry={cfgEntry}
          onClose={() => setCfgId(null)}
          onSave={(cfg) => onSaveConfig(cfgEntry.id, cfg)}
        />
      )}
      {upEntry && (
        <TrafficUpgradeModal
          entry={upEntry}
          kind={kind}
          onClose={closeUpgrade}
          onConfirm={(p) => {
            // 余额不足时 onUpgrade 返回 false 并弹充值，此处保持弹窗打开
            if (onUpgrade(upEntry, p)) closeUpgrade();
          }}
        />
      )}
    </>
  );
}

/* ── ISP / 数据中心：数量 + 时长 + 单国选择 ─────────────────
 *  结构对齐原站 IpProxyPage：数量滑块 + 药丸、时长档（含折扣）、单选国家（含搜索、
 *  按时长过滤可用国家）。定价 = 数量 × 单价 × 天数 × 时长折扣 × 数量折扣。 */

const discountOff = (d: number) =>
  parseFloat(((1 - d) * 100).toPrecision(4)).toString();

/* 数量滑块的档位：pos 为该档在轨道上的位置（0..1），与档位序号解耦 */
type Stop = { qty: number; pos: number };

/* 给定所选数量，算出其轨道位置（0..1） */
function sliderPos(qty: number | null, stops: Stop[]) {
  if (qty === null || stops.length === 0) return 0;
  const last = stops.length - 1;
  const exact = stops.find((o) => o.qty === qty);
  if (exact) return exact.pos;
  if (qty <= stops[0].qty) return stops[0].pos;
  if (qty >= stops[last].qty) return stops[last].pos;
  const next = stops.findIndex((o) => o.qty > qty);
  const lo = stops[next - 1];
  const hi = stops[next];
  return lo.pos + ((qty - lo.qty) / (hi.qty - lo.qty)) * (hi.pos - lo.pos);
}

/* 滑块可停在任意数量：把轨道位置反解成相邻档位间线性插值后的整数数量 */
function qtyAtPos(pos: number, stops: Stop[]) {
  if (stops.length === 0) return 0;
  const last = stops.length - 1;
  if (pos <= stops[0].pos) return stops[0].qty;
  if (pos >= stops[last].pos) return stops[last].qty;
  const next = stops.findIndex((o) => o.pos > pos);
  const lo = stops[next - 1];
  const hi = stops[next];
  return Math.round(lo.qty + ((pos - lo.pos) / (hi.pos - lo.pos)) * (hi.qty - lo.qty));
}

/* 0 档（= 不购买）只占轨道最左端这一小段，其余轨道全部留给可购数量 */
const ZERO_DETENT = 0.04;

/* 把轨道细分为 SLIDER_STEPS 份，使拖动近似连续（range 的 step 用整数最稳） */
const SLIDER_STEPS = 10000;

function IpBuy({
  kind,
  qty,
  days,
  country,
  channel,
  defaultChannel,
  balance,
  onQty,
  onDays,
  onCountry,
  onChannel,
  onSaveDefaultChannel,
  onTopup,
  onCheckout,
}: {
  kind: "isp" | "datacenter";
  qty: number | null;
  days: number | null;
  country: string | null;
  channel: Channel;
  defaultChannel: Channel;
  balance: number;
  onQty: (n: number | null) => void;
  onDays: (d: number) => void;
  onCountry: (code: string | null) => void;
  onChannel: (c: Channel) => void;
  onSaveDefaultChannel: () => void;
  onTopup: () => void;
  onCheckout: () => void;
}) {
  const cfg = IP_PROXY_CONFIG[kind];
  const [search, setSearch] = useState("");
  // 移动端国家列表默认收起（原样展开有 ~23 国太占竖向空间）
  const [countryExpanded, setCountryExpanded] = useState(false);
  const qtyOpts = [...cfg.quantityOptions].sort((a, b) => a.qty - b.qty);
  // 0 档吸附在最左端，可购数量均分剩余轨道（药丸仍只列可购数量）
  const span = Math.max(qtyOpts.length - 1, 1);
  const sliderStops: Stop[] = [
    { qty: 0, pos: 0 },
    ...qtyOpts.map((o, i) => ({ qty: o.qty, pos: ZERO_DETENT + (i / span) * (1 - ZERO_DETENT) })),
  ];
  const pos = sliderPos(qty, sliderStops);
  const fillPct = pos * 100;
  const bubbleShift =
    fillPct <= 0 ? "translateX(0)" : fillPct >= 100 ? "translateX(-100%)" : "translateX(-50%)";

  // 时长决定可用国家；未选时长则全部可选，选后按当天档过滤
  const availCodes = days !== null ? cfg.countryAvailability[String(days)] ?? null : null;
  const available = availCodes
    ? cfg.countries.filter((c) => availCodes.includes(c.code))
    : cfg.countries;
  const q = search.trim().toLowerCase();
  const match = (c: { code: string; name: string }) =>
    c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  /* 原站国家网格按中文拼音序展示（ICU zh 排序带声调：台湾<泰国、
     以色列<意大利，与原站一致）；不可选国家沿用原站规则排在最后 */
  const availShown = (q ? available.filter(match) : available)
    .slice()
    .sort((a, b) => zhCompare(a.name, b.name));
  const unavailShown = (q ? cfg.unavailableCountries.filter(match) : cfg.unavailableCountries)
    .slice()
    .sort((a, b) => zhCompare(a.name, b.name));
  // 搜索时始终全展开；否则移动端可收起
  const countryTotal = availShown.length + unavailShown.length;
  const collapsible = !q && countryTotal > 10;
  const countryCollapsed = collapsible && !countryExpanded;

  const durOpt = cfg.durationOptions.find((d) => d.days === days) ?? null;
  const qtyDisc = qty !== null ? qtyDiscountFor(kind, qty) : 1;
  const durDisc = durOpt?.discount ?? 1;
  const total =
    qty !== null && days !== null
      ? qty * cfg.pricePerIpDay * days * durDisc * qtyDisc
      : 0;
  // 数量 0（或未选）视为「不购买」：结算不可点
  const ready = !!qty && days !== null && country !== null;
  const picked = cfg.countries.find((c) => c.code === country) ?? null;

  // 选时长时，若已选国家在新档不可用则清空（同原站）
  const selectDays = (d: number) => {
    onDays(d);
    const codes = cfg.countryAvailability[String(d)];
    if (country && codes && !codes.includes(country)) onCountry(null);
  };

  const setCustomQty = (raw: string) => {
    const n = Math.floor(Number(raw) || 0);
    onQty(n >= 0 && n <= 10000 ? n : null);
  };

  const orderNote =
    !qty
      ? "请先选择数量"
      : days === null
        ? "请选择时长"
        : country === null
          ? "请选择国家"
          : total > balance
            ? "余额不足，请先充值"
            : "";

  return (
    <div className="hp-buy">
      <div className="hp-buy-main">
        <div className="hp-panel">
          <div className="hp-panel-head">选择IP数量</div>
          <div className="hp-panel-body">
            <div className="hp-qslider">
              <div className="hp-qbubble-track">
                <span
                  className="hp-qbubble"
                  style={{ left: `${fillPct}%`, transform: bubbleShift }}
                >
                  {qty !== null ? qty.toLocaleString() : "—"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={SLIDER_STEPS}
                step={1}
                value={Math.round(pos * SLIDER_STEPS)}
                onChange={(e) =>
                  onQty(qtyAtPos(parseInt(e.target.value, 10) / SLIDER_STEPS, sliderStops))
                }
                className="hp-range"
                style={{
                  background: `linear-gradient(90deg, #fa6b1f 0%, #fa6b1f ${fillPct}%, #e3e3e3 ${fillPct}%, #e3e3e3 100%)`,
                }}
                aria-label="IP 数量"
              />
              <div className="hp-qticks">
                {/* 首个可购档位钉在 ZERO_DETENT（4%），刻度会压住「0」，故只留档位不画刻度 */}
                {sliderStops.filter((_, i) => i !== 1).map((o) => {
                  const left = o.pos * 100;
                  const shift =
                    left <= 0 ? "translateX(0)" : left >= 100 ? "translateX(-100%)" : "translateX(-50%)";
                  return (
                    <button
                      key={o.qty}
                      type="button"
                      className="hp-qtick"
                      style={{ left: `${left}%`, transform: shift }}
                      onClick={() => onQty(o.qty)}
                    >
                      {o.qty >= 1000 ? `${o.qty / 1000}k` : o.qty}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hp-qrow">
              <label className={`hp-qcustom${qty !== null && !qtyOpts.some((o) => o.qty === qty) ? " on" : ""}`}>
                <input
                  type="number"
                  min={0}
                  max={10000}
                  placeholder="自定义"
                  value={qty !== null ? qty : ""}
                  onChange={(e) => setCustomQty(e.target.value)}
                />
              </label>
              {qtyOpts.map((o) => (
                <button
                  key={o.qty}
                  type="button"
                  className={`hp-qpill${qty === o.qty ? " on" : ""}`}
                  onClick={() => onQty(o.qty)}
                >
                  {o.qty.toLocaleString()}
                  {o.discount < 1 && <span className="hp-off">{discountOff(o.discount)}% 优惠</span>}
                </button>
              ))}
            </div>
            <p className="hp-hint">单价 {fmt(cfg.pricePerIpDay)}/IP/天 · 独享静态</p>
          </div>
        </div>

        <div className="hp-panel">
          <div className="hp-panel-head">选择时长</div>
          <div className="hp-panel-body">
            <div className="hp-durrow">
              {cfg.durationOptions.map((d) => (
                <button
                  key={d.days}
                  type="button"
                  className={`hp-durpill${d.days === days ? " on" : ""}`}
                  onClick={() => selectDays(d.days)}
                >
                  {d.days} 天
                  {d.discount < 1 && <span className="hp-off">{discountOff(d.discount)}% 优惠</span>}
                </button>
              ))}
            </div>
            <p className="hp-hint">按天计费 · 到期可续费</p>
          </div>
        </div>

        <div className="hp-panel">
          <div className="hp-panel-head">
            选择渠道商            <button
              type="button"
              className="hp-setdef"
              disabled={channel === defaultChannel}
              onClick={onSaveDefaultChannel}
            >
              {channel === defaultChannel ? "已是默认" : "设为默认"}
            </button>
          </div>
          <div className="hp-panel-body">
            <div className="hp-durrow">
              {CHANNELS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`hp-durpill${channel === c ? " on" : ""}`}
                  onClick={() => onChannel(c)}
                >
                  渠道商 {c}
                </button>
              ))}
            </div>
            <p className="hp-hint">不同渠道商对应不同IP池</p>
          </div>
        </div>

        <div className="hp-panel">
          <div className="hp-panel-head">
            分配国家
            <span className="hp-alloc">
              可选 <b>{available.length}</b> 国
            </span>
          </div>
          <div className="hp-panel-body">
            <input
              type="text"
              className="hp-csearch"
              value={search}
              placeholder="搜索国家"
              onChange={(e) => setSearch(e.target.value)}
            />
            {available.length === 0 && (
              <p className="hp-hint" style={{ textAlign: "center", padding: "18px 0" }}>
                暂无可用国家，请稍后再试
              </p>
            )}
            <div
              className={`hp-cgrid${countryCollapsed ? " collapsed" : ""}`}
            >
              {availShown.map((c) => (
                <label
                  key={c.code}
                  className={`hp-copt${country === c.code ? " on" : ""}`}
                >
                  <input
                    type="radio"
                    name={`country-${kind}`}
                    checked={country === c.code}
                    onChange={() => onCountry(c.code)}
                  />
                  <span className="hp-flag">{c.flag}</span>
                  <span className="hp-cn">{c.name}</span>
                </label>
              ))}
              {unavailShown.map((c) => (
                <label key={c.code} className="hp-copt dis">
                  <input type="radio" disabled />
                  <span className="hp-flag">{c.flag}</span>
                  <span className="hp-cn">{c.name}</span>
                </label>
              ))}
            </div>
            {collapsible && (
              <button
                type="button"
                className="hp-cmore"
                onClick={() => setCountryExpanded((v) => !v)}
              >
                {countryExpanded ? "收起" : `展开全部 ${countryTotal} 国`}
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="hp-order">
        <h3>您的订单</h3>
        <BalanceRow balance={balance} onTopup={onTopup} />
        <div className="hp-or">
          <span>单价</span>
          <b>{fmt(cfg.pricePerIpDay)} / IP / 天</b>
        </div>
        <div className="hp-or">
          <span>租用时长</span>
          <b>{days !== null ? `${days} 天` : "—"}</b>
        </div>
        {qtyDisc < 1 && (
          <div className="hp-or">
            <span>数量折扣</span>
            <b className="hp-disc">-{Math.round((1 - qtyDisc) * 100)}%</b>
          </div>
        )}
        {durDisc < 1 && (
          <div className="hp-or">
            <span>时长折扣</span>
            <b className="hp-disc">-{Math.round((1 - durDisc) * 100)}%</b>
          </div>
        )}
        {picked && !!qty && (
          <div className="hp-ods">
            <div className="hp-od">
              <span>
                {picked.flag} {picked.name}
              </span>
              <b>× {qty.toLocaleString()} IP</b>
            </div>
          </div>
        )}
        <div className="hp-total">
          <span>总计</span>
          <b className={total > 0 ? "on" : undefined}>{fmt(total)}</b>
        </div>
        <button type="button" className="hp-checkout" disabled={!ready} onClick={onCheckout}>
          结账
        </button>
        {orderNote && <p className="hp-order-note">{orderNote}</p>}
      </aside>
    </div>
  );
}

/* ── ISP / 数据中心：已购买代理表 ────────────────────────
 *  行格式以原站瑞典第一条为准：HTTP / SOCKS5 列均展示完整
 *  ip:port:user:pass 串。ISP 与数据中心共用同一表结构，仅数据不同。 */

interface PurchasedProxy {
  id: number;
  country: string;
  flag: string;
  ip: string;
  httpPort: number;
  socksPort: number;
  user: string;
  pass: string;
  expiry: string; // ISO YYYY-MM-DD
}

const DC_COUNTRIES = [
  { name: "瑞典", flag: "🇸🇪" },
  { name: "美国", flag: "🇺🇸" },
  { name: "法国", flag: "🇫🇷" },
  { name: "加拿大", flag: "🇨🇦" },
  { name: "香港", flag: "🇭🇰" },
  { name: "韩国", flag: "🇰🇷" },
  { name: "巴西", flag: "🇧🇷" },
  { name: "德国", flag: "🇩🇪" },
  { name: "英国", flag: "🇬🇧" },
  { name: "新加坡", flag: "🇸🇬" },
  { name: "日本", flag: "🇯🇵" },
  { name: "荷兰", flag: "🇳🇱" },
  { name: "澳大利亚", flag: "🇦🇺" },
];

/* 定种 LCG：保证 SSR / 客户端渲染一致（避免 hydration mismatch） */
function makeRnd(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/* 前两条为原站瑞典参考记录（固定值），其余按定种 LCG 生成，仅用于演示分页。 */
function buildDcProxies(): PurchasedProxy[] {
  const seed: PurchasedProxy[] = [
    { id: 1, country: "瑞典", flag: "🇸🇪", ip: "45.199.234.118", httpPort: 63232, socksPort: 63233, user: "icVwrpJC", pass: "UAs1mFAB", expiry: "2026-06-24" },
    { id: 2, country: "瑞典", flag: "🇸🇪", ip: "95.214.82.180", httpPort: 63916, socksPort: 63917, user: "icVwrpJC", pass: "UAs1mFAB", expiry: "2026-06-24" },
  ];
  const rnd = makeRnd(0x9e3779b1);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const token = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(rnd() * chars.length)]).join("");
  const octet = () => 1 + Math.floor(rnd() * 254);
  const rest: PurchasedProxy[] = Array.from({ length: 128 }, (_, i) => {
    const c = DC_COUNTRIES[Math.floor(rnd() * DC_COUNTRIES.length)];
    const httpPort = 60000 + Math.floor(rnd() * 5000);
    return {
      id: i + 3,
      country: c.name,
      flag: c.flag,
      ip: `${octet()}.${octet()}.${octet()}.${octet()}`,
      httpPort,
      socksPort: httpPort + 1,
      user: token(8),
      pass: token(8),
      expiry: `2026-${pad(1 + Math.floor(rnd() * 12))}-${pad(1 + Math.floor(rnd() * 28))}`,
    };
  });
  return [...seed, ...rest];
}

const DC_PROXIES: PurchasedProxy[] = buildDcProxies();

/* ISP 已购买代理：前 4 条取自原站 ISP 代理列表（美国 ×1 + 巴西 ×3），其余同数据中心
   按定种生成以演示分页。ISP 端口固定 59100/59101、凭证为账号级（各行同一组）。 */
function buildIspProxies(): PurchasedProxy[] {
  const seed: PurchasedProxy[] = [
    { id: 1, country: "美国", flag: "🇺🇸", ip: "63.125.88.142", httpPort: 59100, socksPort: 59101, user: "huoad", pass: "Rk8mT09x", expiry: "2026-07-24" },
    { id: 2, country: "巴西", flag: "🇧🇷", ip: "200.152.132.246", httpPort: 59100, socksPort: 59101, user: "huoad", pass: "Rk8mT09x", expiry: "2026-06-26" },
    { id: 3, country: "巴西", flag: "🇧🇷", ip: "200.152.130.18", httpPort: 59100, socksPort: 59101, user: "huoad", pass: "Rk8mT09x", expiry: "2026-06-26" },
    { id: 4, country: "巴西", flag: "🇧🇷", ip: "200.152.135.222", httpPort: 59100, socksPort: 59101, user: "huoad", pass: "Rk8mT09x", expiry: "2026-06-26" },
  ];
  const rnd = makeRnd(0x2545f491);
  const octet = () => 1 + Math.floor(rnd() * 254);
  const countries = IP_PROXY_CONFIG.isp.countries;
  const rest: PurchasedProxy[] = Array.from({ length: 56 }, (_, i) => {
    const c = countries[Math.floor(rnd() * countries.length)];
    return {
      id: i + 5,
      country: c.name,
      flag: c.flag,
      ip: `${octet()}.${octet()}.${octet()}.${octet()}`,
      httpPort: 59100,
      socksPort: 59101,
      user: "huoad",
      pass: "Rk8mT09x",
      expiry: `2026-${pad(1 + Math.floor(rnd() * 12))}-${pad(1 + Math.floor(rnd() * 28))}`,
    };
  });
  return [...seed, ...rest];
}

const ISP_PROXIES: PurchasedProxy[] = buildIspProxies();

/* 首次购买后把新持有量即时并入列表（演示壳，随机 IP / 凭证）：
   ISP 端口与凭证为账号级固定值，数据中心逐条随机——与各自 seed 列表口径一致。 */
const RAND_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const randToken = (n: number) =>
  Array.from({ length: n }, () => RAND_CHARS[Math.floor(Math.random() * RAND_CHARS.length)]).join("");

function makeBoughtIps(
  kind: "isp" | "datacenter",
  country: { name: string; flag: string },
  qty: number,
  expiry: string,
  startId: number,
): PurchasedProxy[] {
  const octet = () => 1 + Math.floor(Math.random() * 254);
  return Array.from({ length: qty }, (_, i) => {
    const httpPort = kind === "isp" ? 59100 : 60000 + Math.floor(Math.random() * 5000);
    return {
      id: startId + i,
      country: country.name,
      flag: country.flag,
      ip: `${octet()}.${octet()}.${octet()}.${octet()}`,
      httpPort,
      socksPort: kind === "isp" ? 59101 : httpPort + 1,
      user: kind === "isp" ? "huoad" : randToken(8),
      pass: kind === "isp" ? "Rk8mT09x" : randToken(8),
      expiry,
    };
  });
}

/* 首次购买流量套餐后生成一条新套餐（用量清零、无白名单、默认 30 分钟轮询）。 */
function makeBoughtTraffic(kind: "residential" | "mobile", gb: number): TrafficProxy {
  const hex = () => Math.random().toString(16).slice(2, 10).padEnd(8, "0");
  const port = 800 + Math.floor(Math.random() * 8000);
  const sticky = 30000 + Math.floor(Math.random() * 40000);
  return {
    id: `${kind === "residential" ? "res" : "mob"}_${hex()}`,
    usedGb: 0,
    totalGb: gb,
    host: "gw.huoad.com",
    httpPort: port,
    socksPort: port + 1,
    stickyStart: sticky,
    stickyEnd: sticky + 1000,
    username: randToken(8),
    password: randToken(8),
    whitelist: [],
    pollingInterval: 30,
  };
}

/* 默认展示 10 条——把内容区 min-height 撑出的面板高度填满，不留空白；
 *  移动端屏幕短，默认只展示 3 条靠翻页看更多；
 *  超出后才出现分页，每页可选 20 / 50 / 100（不含 10） */
const DEFAULT_PAGE_SIZE = 10;
const MOBILE_PAGE_SIZE = 3;
const PAGE_SIZES = [20, 50, 100];

/* ≤768px 视为移动端（与 proxy-mobile.css 同一断点），SSR 首帧按桌面渲染。
   /proxy/m 是移动版固定入口，样式表无条件加载，这里也一并按移动端处理。 */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const forced = /\/m\/?$/.test(location.pathname);
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(forced || mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

const COPY_ICON = (
  <Icon>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Icon>
);

function PurchasedProxies({
  kind,
  proxies,
  notify,
  onRenew,
  sortByExpiry = false,
  focusId = null,
}: {
  kind: "isp" | "datacenter";
  proxies: PurchasedProxy[];
  notify: (msg: string) => void;
  onRenew: (ids: number[], days: number) => boolean;
  sortByExpiry?: boolean;
  /** 「需要关注」行内续费带过来的目标 IP：进入即勾选（续费条随之展开）并渐隐高亮 */
  focusId?: number | null;
}) {
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<Set<number>>(
    () => new Set(focusId != null ? [focusId] : []),
  );
  // pageSize=0 表示「默认」，随桌面 / 移动断点取 10 / 3
  const [pageSize, setPageSize] = useState(0);
  const [page, setPage] = useState(1);
  const isMobile = useIsMobile();
  const defaultSize = isMobile ? MOBILE_PAGE_SIZE : DEFAULT_PAGE_SIZE;
  const size = pageSize || defaultSize;
  // 续费时长与购买共用同一份时长档折扣（对齐原站续费条），默认选首档
  const renewOpts = IP_PROXY_CONFIG[kind].durationOptions;
  const [renewDays, setRenewDays] = useState(renewOpts[0].days);

  /* 单框同时匹配国家 / IP / 截止日期；日期支持 2026-07-24、24/07/2026
     两种字面写法，以及「7月24号 / 2026年7月 / 24日」等中文写法。 */
  const q = query.trim().toLowerCase();
  const cn = parseCnDate(q);
  // 从「需要关注」跳入：未到期按到期日升序在前，已到期条目沉底
  const today = todayIso();
  const source = sortByExpiry
    ? [...proxies].sort((a, b) => {
        const aLive = a.expiry >= today;
        const bLive = b.expiry >= today;
        if (aLive !== bLive) return aLive ? -1 : 1;
        return a.expiry.localeCompare(b.expiry);
      })
    : proxies;
  const filtered = source.filter((p) => {
    if (!q) return true;
    if (cn) return matchCnDate(cn, p.expiry);
    return (
      p.country.toLowerCase().includes(q) ||
      p.ip.includes(q) ||
      p.expiry.includes(q) ||
      fmtDate(p.expiry).includes(q)
    );
  });
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * size, current * size);
  const allChecked = rows.length > 0 && rows.every((p) => checked.has(p.id));

  const toggleRow = (id: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify("已复制到剪贴板");
    } catch {
      // 剪贴板 API 被权限策略拒绝时退回 execCommand
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      notify(ok ? "已复制到剪贴板" : "复制失败，请手动复制");
    }
  };

  const cred = (p: PurchasedProxy, port: number) => `${p.ip}:${port}:${p.user}:${p.pass}`;

  // 凭据文本区按全列最长凭据取宽（Geist Mono 下 1ch = 1 字符），
  // 复制按钮紧跟文本且各行垂直对齐，翻页/搜索也不漂移
  const credW = proxies.reduce(
    (w, p) => Math.max(w, cred(p, p.httpPort).length, cred(p, p.socksPort).length),
    0
  );

  // 续费总价 = 已选数量 × 单价 × 天数 × 时长折扣（与购买同一计价，无数量折扣）
  const renewDisc = renewOpts.find((d) => d.days === renewDays)?.discount ?? 1;
  const renewTotal = checked.size * IP_PROXY_CONFIG[kind].pricePerIpDay * renewDays * renewDisc;

  const renew = () => {
    // 余额不足时 onRenew 返回 false 并弹充值，保留勾选以便充值后重试
    if (checked.size > 0 && onRenew([...checked], renewDays)) setChecked(new Set());
  };

  return (
    <div className="hp-panel hp-pp">
      <div className="hp-panel-head">
        已购买代理
        {checked.size > 0 && (
          <div className="hp-renew">
            <span className="hp-renew-count">
              已选 <b>{checked.size}</b> 个 IP
            </span>
            {renewOpts.map((d) => (
              <button
                key={d.days}
                type="button"
                className={`hp-renew-pill${d.days === renewDays ? " on" : ""}`}
                onClick={() => setRenewDays(d.days)}
              >
                {d.days} 天
                {d.discount < 1 && (
                  <span className="hp-renew-off">省 {discountOff(d.discount)}%</span>
                )}
              </button>
            ))}
            <span className="hp-renew-cta">
              <span className="hp-renew-total">
                总计: <b>{fmt(renewTotal)}</b>
              </span>
              <button type="button" className="hp-renew-btn" onClick={renew}>
                续费
              </button>
            </span>
          </div>
        )}
        <input
          className="hp-pp-search"
          value={query}
          placeholder="搜索国家 / IP / 日期"
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        {total > defaultSize && (
          <div className="hp-pp-foot">
            <div className="hp-pp-footinfo">
              <span className="hp-pp-total">共 {total} 条</span>
              <label className="hp-pp-size">
                每页
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={0}>默认</option>
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="hp-pp-size-unit">条</span>
              </label>
            </div>
            <div className="hp-pager">
              <button
                type="button"
                disabled={current <= 1}
                onClick={() => setPage(current - 1)}
              >
                上一页
              </button>
              <span>
                {current} / {totalPages}
              </span>
              <button
                type="button"
                disabled={current >= totalPages}
                onClick={() => setPage(current + 1)}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="hp-pp-scroll">
      <table className="hp-table">
        <thead>
          <tr>
            <th className="hp-pp-check">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={() =>
                  setChecked(allChecked ? new Set() : new Set(rows.map((p) => p.id)))
                }
                aria-label="全选"
              />
            </th>
            <th>国家</th>
            <th>HTTP</th>
            <th>SOCKS5</th>
            <th>截止日期</th>
          </tr>
        </thead>
        {rows.length > 0 && (
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className={p.id === focusId ? "hp-flash" : undefined}>
                <td className="hp-pp-check">
                  <input
                    type="checkbox"
                    checked={checked.has(p.id)}
                    onChange={() => toggleRow(p.id)}
                    aria-label={`选择 ${p.ip}`}
                  />
                </td>
                <td>
                  <span className="hp-flag">{p.flag}</span> {p.country}
                </td>
                <td className="hp-mono">
                  <span className="hp-cred">
                    <span style={{ minWidth: `${credW}ch` }}>{cred(p, p.httpPort)}</span>
                    <button
                      type="button"
                      className="hp-icon-btn"
                      onClick={() => copy(cred(p, p.httpPort))}
                      aria-label="复制 HTTP 代理"
                    >
                      {COPY_ICON}
                    </button>
                  </span>
                </td>
                <td className="hp-mono">
                  <span className="hp-cred">
                    <span style={{ minWidth: `${credW}ch` }}>{cred(p, p.socksPort)}</span>
                    <button
                      type="button"
                      className="hp-icon-btn"
                      onClick={() => copy(cred(p, p.socksPort))}
                      aria-label="复制 SOCKS5 代理"
                    >
                      {COPY_ICON}
                    </button>
                  </span>
                </td>
                <td>{fmtDate(p.expiry)}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      </div>
      {total === 0 && <div className="hp-empty">未找到匹配的代理</div>}
    </div>
  );
}

/* ── 订单列表：可按日期区间搜索的订单表（列对齐原站「已购代理 · 订单列表」）
 *  顶部按类型分栏（对齐原站「已购代理」页签）：订单列表 = 全部，类型页签按 type 过滤 ── */

const ORDER_TABS = ["订单列表", "ISP 代理", "数据中心代理", "住宅代理", "移动代理"] as const;

/* 空值时隐藏浏览器自带的 "dd/mm/yyyy" 英文占位，改显中文占位；点击直接弹出日历 */
function OrderDateInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (v: string) => void;
}) {
  return (
    <span className={`hp-datebox${value ? "" : " empty"}`}>
      <input
        type="date"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        onMouseDown={(e) => {
          const el = e.currentTarget;
          if (!value && typeof el.showPicker === "function") {
            e.preventDefault();
            try {
              el.showPicker();
            } catch {
              el.focus();
            }
          }
        }}
      />
      {!value && <span className="hp-date-ph">{label}</span>}
    </span>
  );
}

function Purchased({
  orders,
  go,
  notify,
}: {
  orders: DemoOrder[];
  go: (v: ViewKey) => void;
  notify: (msg: string) => void;
}) {
  const [tab, setTab] = useState<(typeof ORDER_TABS)[number]>("订单列表");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const matched = orders.filter((o) => {
    if (tab !== "订单列表" && o.type !== tab) return false;
    if (start && o.date < start) return false;
    if (end && o.date > end) return false;
    return true;
  });
  const filtered = Boolean(start || end);
  const total = matched.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const rows = matched.slice((current - 1) * pageSize, current * pageSize);

  return (
    <div className="hp-panel">
      <div className="hp-ordertabs">
        {ORDER_TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`hp-ordertab${tab === t ? " on" : ""}`}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
          >
            {t}
          </button>
        ))}
        <div className="hp-ordertabs-search">
          <div className="hp-daterange">
            <OrderDateInput
              label="开始日期"
              value={start}
              max={end || undefined}
              onChange={(v) => {
                setStart(v);
                setPage(1);
              }}
            />
            <span className="hp-daterange-sep">→</span>
            <OrderDateInput
              label="结束日期"
              value={end}
              min={start || undefined}
              onChange={(v) => {
                setEnd(v);
                setPage(1);
              }}
            />
          </div>
          <button
            type="button"
            className="hp-orders-reset"
            disabled={!filtered}
            onClick={() => {
              setStart("");
              setEnd("");
              setPage(1);
            }}
          >
            重置
          </button>
        </div>
      </div>
      {total > DEFAULT_PAGE_SIZE && (
        <div className="hp-orders-bar">
          <div className="hp-pp-foot">
            <label className="hp-pp-size">
              每页
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={DEFAULT_PAGE_SIZE}>默认</option>
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              条
            </label>
            <div className="hp-pager">
              <button
                type="button"
                disabled={current <= 1}
                onClick={() => setPage(current - 1)}
              >
                上一页
              </button>
              <span>
                {current} / {totalPages}
              </span>
              <button
                type="button"
                disabled={current >= totalPages}
                onClick={() => setPage(current + 1)}
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hp-pp-scroll">
      <table className="hp-table hp-otable hp-otable-list">
        <thead>
          <tr>
            <th>订单号</th>
            <th>类型</th>
            <th>数量</th>
            <th>金额</th>
            <th>日期</th>
            <th>状态</th>
          </tr>
        </thead>
        {rows.length > 0 && (
          <tbody>
            {rows.map((o) => (
              <tr key={o.id}>
                <td className="hp-mono" title={o.id}>
                  <span className="hp-cred">
                    {o.id.slice(0, 8)}…
                    <button
                      type="button"
                      className="hp-icon-btn"
                      onClick={() => copyText(o.id, notify)}
                      aria-label="复制订单号"
                    >
                      {COPY_ICON}
                    </button>
                  </span>
                </td>
                <td>{o.type}</td>
                <td>{o.qty}</td>
                <td>{fmt(o.amount)}</td>
                <td>{fmtDate(o.date)}</td>
                <td>
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      </div>

      {total === 0 && (
        <div className="hp-empty">
          {ICONS.purchased}
          {filtered ? (
            "该日期区间内没有订单"
          ) : tab !== "订单列表" ? (
            "该类型暂无订单"
          ) : (
            <>
              暂无订单
              <button type="button" className="hp-empty-cta" onClick={() => go("residential")}>
                去购买 →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 余额充值弹窗 ──────────────────────────────────────── */

const TOPUP_PRESETS = [20, 50, 100, 500];

function TopupModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (amount: number) => void;
}) {
  const [amt, setAmt] = useState<number | null>(50);

  return (
    <div className="hp-mask" onClick={onClose}>
      <div className="hp-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="hp-modal-x" onClick={onClose} aria-label="关闭">
          ×
        </button>
        <h3>余额充值</h3>
        <p className="hp-modal-sub">演示环境 · 充值即时到账，可用于购买代理</p>
        <div className="hp-amounts">
          {TOPUP_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`hp-amount${amt === p ? " on" : ""}`}
              onClick={() => setAmt(p)}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          className="hp-amount-input"
          type="number"
          min={1}
          placeholder="自定义金额（美元）"
          value={amt !== null && !TOPUP_PRESETS.includes(amt) ? amt : ""}
          onChange={(e) => {
            const n = Math.floor(Number(e.target.value) || 0);
            setAmt(n > 0 ? n : null);
          }}
        />
        <button
          type="button"
          className="hp-checkout"
          disabled={!amt}
          onClick={() => amt && onConfirm(amt)}
        >
          确认充值{amt ? ` ${fmt(amt)}` : ""}
        </button>
      </div>
    </div>
  );
}

/* ── 页面壳 ───────────────────────────────────────────── */

export default function ProxyClient({ initialView }: { initialView: ViewKey }) {
  const [view, setView] = useState<ViewKey>(initialView);
  const [resPlan, setResPlan] = useState<number | null>(null);
  const [mobPlan, setMobPlan] = useState<number | null>(null);
  const [ispQty, setIspQty] = useState<number | null>(null);
  const [ispDays, setIspDays] = useState<number | null>(null);
  const [ispCountry, setIspCountry] = useState<string | null>(null);
  const [dcQty, setDcQty] = useState<number | null>(null);
  const [dcDays, setDcDays] = useState<number | null>(null);
  const [dcCountry, setDcCountry] = useState<string | null>(null);
  // 渠道商：channel 为本次选择（点药丸即换，不落盘），defaultChannel 为
  // 已保存默认（「设为默认」按钮写 localStorage，刷新后自动选中）。
  // SSR 一律先渲染 A，挂载后下一拍再应用本地保存值（同步 set 会被
  // React Compiler 判定级联渲染，也会造成水合不一致；用定时器而非 rAF，
  // 后台/离屏标签页 rAF 不触发）。
  const [channel, setChannel] = useState<Channel>("A");
  const [defaultChannel, setDefaultChannel] = useState<Channel>("A");
  useEffect(() => {
    const saved = localStorage.getItem(CHANNEL_KEY);
    if (saved === "A" || saved === "B" || saved === "C") {
      const id = setTimeout(() => {
        setDefaultChannel(saved);
        setChannel(saved);
      }, 0);
      return () => clearTimeout(id);
    }
  }, []);
  // 预置余额与 /zh 的 LamaProxy 对拍基准一致（$128.50），演示态不从空钱包开始
  const [balance, setBalance] = useState(128.5);
  const [orders, setOrders] = useState<DemoOrder[]>(SEED_ORDERS);
  // 已购套餐提到壳里：配置 / 升级要改它，切视图时也不能丢
  const [traffic, setTraffic] = useState(SAMPLE_TRAFFIC);
  // 已购 IP 代理同理：续费要延长截止日期，概览「需要关注」的到期行也从这里推导
  const [ipProxies, setIpProxies] = useState({ isp: ISP_PROXIES, datacenter: DC_PROXIES });
  const [topupOpen, setTopupOpen] = useState(false);
  // 已购列表是否按到期日升序（仅由「需要关注」面板到期行跳转触发）
  const [expirySort, setExpirySort] = useState(false);
  // 「需要关注」行内续费/续购点进来的目标条目：IP 表预勾选，套餐直接开续费弹窗
  const [focusId, setFocusId] = useState<number | string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const saveDefaultChannel = () => {
    setDefaultChannel(channel);
    try {
      localStorage.setItem(CHANNEL_KEY, channel);
      showToast(`已将渠道商 ${channel} 设为默认`);
    } catch {
      showToast("保存失败，默认渠道商仅本次生效");
    }
  };

  const switchView = (
    v: ViewKey,
    opts?: { expirySort?: boolean; focusId?: number | string },
  ) => {
    // 从「需要关注」到期行跳入时列表按到期日升序；常规切换视图即复位
    setExpirySort(opts?.expirySort ?? false);
    setFocusId(opts?.focusId ?? null);
    setView(v);
    window.history.replaceState(null, "", v === "overview" ? "/proxy" : `/proxy?view=${v}`);
    window.scrollTo(0, 0);
  };

  const confirmTopup = (amount: number) => {
    setBalance((b) => b + amount);
    setOrders((prev) => [
      {
        id: orderId(),
        type: "余额充值",
        spec: "—",
        qty: "—",
        amount,
        date: todayIso(),
        time: nowStr(),
        status: "done",
        isTopup: true,
      },
      ...prev,
    ]);
    setTopupOpen(false);
    showToast(`充值成功 · 余额 +${fmt(amount)}`);
  };

  /** 余额购买；不足时直接打开充值弹窗，流程不中断 */
  const doPurchase = (o: {
    key: BuyKey;
    spec: string;
    qty: string;
    amount: number;
    gb?: number;
    ips?: number;
  }) => {
    if (balance < o.amount) {
      showToast(`余额不足，请先充值（当前余额 ${fmt(balance)}）`);
      setTopupOpen(true);
      return false;
    }
    setBalance((b) => b - o.amount);
    setOrders((prev) => [
      {
        id: orderId(),
        type: VIEW_TITLE[o.key],
        spec: o.spec,
        qty: o.qty,
        amount: o.amount,
        date: todayIso(),
        time: nowStr(),
        status: "done" as const,
        gb: o.gb,
        ips: o.ips,
      },
      ...prev,
    ]);
    showToast(`购买成功 · 订单已生成（${fmt(o.amount)}）`);
    return true;
  };

  const trafficCheckout = (kind: "residential" | "mobile") => (p: TrafficPlan) => {
    const ok = doPurchase({
      key: kind,
      spec: `${p.gb} GB`,
      qty: `${p.gb} GB`,
      amount: p.gb * p.pricePerGB * p.discount,
      gb: p.gb,
    });
    if (ok) {
      (kind === "residential" ? setResPlan : setMobPlan)(null);
      setTraffic((prev) => ({
        ...prev,
        [kind]: [makeBoughtTraffic(kind, p.gb), ...prev[kind]],
      }));
    }
  };

  const saveTrafficConfig =
    (kind: "residential" | "mobile") =>
    (id: string, cfg: { pollingInterval: number; whitelist: string[] }) => {
      setTraffic((prev) => ({
        ...prev,
        [kind]: prev[kind].map((e) => (e.id === id ? { ...e, ...cfg } : e)),
      }));
    };

  /* 升级 / 续购 = 走余额结算，把流量加到该套餐上
   *（原站是跳 /payment，本克隆无支付页）。已用完的套餐加量后即恢复服务。 */
  const upgradeTraffic =
    (kind: "residential" | "mobile") => (entry: TrafficProxy, p: TrafficPlan) => {
      const renewing = entry.usedGb / entry.totalGb >= 0.8;
      const ok = doPurchase({
        key: kind,
        spec: `${p.gb} GB · ${renewing ? "续购" : "升级"} ${entry.id}`,
        qty: `${p.gb} GB`,
        amount: p.gb * p.pricePerGB * p.discount,
        gb: p.gb,
      });
      if (!ok) return false;
      setTraffic((prev) => ({
        ...prev,
        [kind]: prev[kind].map((e) =>
          e.id === entry.id ? { ...e, totalGb: e.totalGb + p.gb } : e,
        ),
      }));
      showToast(`已为 ${entry.id} 增加 ${p.gb} GB 流量`);
      return true;
    };

  const ipCheckout = (kind: "isp" | "datacenter") => () => {
    const [qty, days, country] =
      kind === "isp" ? [ispQty, ispDays, ispCountry] : [dcQty, dcDays, dcCountry];
    if (!qty || days === null || country === null) return;
    const cfg = IP_PROXY_CONFIG[kind];
    const durDisc = cfg.durationOptions.find((d) => d.days === days)?.discount ?? 1;
    const qtyDisc = qtyDiscountFor(kind, qty);
    const amount = qty * cfg.pricePerIpDay * days * durDisc * qtyDisc;
    const ok = doPurchase({
      key: kind,
      spec: `${qty} IP × ${days} 天`,
      qty: `${qty} IP`,
      amount,
      ips: qty,
    });
    if (ok) {
      const picked = cfg.countries.find((c) => c.code === country);
      if (picked) {
        const expiry = addDaysIso(todayIso(), days);
        setIpProxies((prev) => {
          const startId = prev[kind].reduce((m, p) => Math.max(m, p.id), 0) + 1;
          return {
            ...prev,
            [kind]: [...makeBoughtIps(kind, picked, qty, expiry, startId), ...prev[kind]],
          };
        });
      }
      if (kind === "isp") {
        setIspQty(null);
        setIspDays(null);
        setIspCountry(null);
      } else {
        setDcQty(null);
        setDcDays(null);
        setDcCountry(null);
      }
    }
  };

  /* 续费：按所选时长档结算（与购买共用时长折扣），成功后延长各 IP 截止日期 */
  const renewIp = (kind: "isp" | "datacenter") => (ids: number[], days: number) => {
    const cfg = IP_PROXY_CONFIG[kind];
    const durDisc = cfg.durationOptions.find((d) => d.days === days)?.discount ?? 1;
    const ok = doPurchase({
      key: kind,
      spec: `续费 ${ids.length} IP × ${days} 天`,
      qty: `${ids.length} IP`,
      amount: ids.length * cfg.pricePerIpDay * days * durDisc,
    });
    if (!ok) return false;
    setIpProxies((prev) => ({
      ...prev,
      [kind]: prev[kind].map((p) =>
        ids.includes(p.id) ? { ...p, expiry: addDaysIso(p.expiry, days) } : p,
      ),
    }));
    showToast(`续费成功 · ${ids.length} 个 IP 已延长 ${days} 天`);
    return true;
  };

  const openTopup = () => setTopupOpen(true);

  return (
    <div className="hp-page">
      <div className="hp-inner">
        <aside className="hp-side">
          <nav>
            {NAV.map((item) => (
              <a
                key={item.key}
                className={view === item.key ? "on" : undefined}
                onClick={() => switchView(item.key)}
              >
                {ICONS[item.key]}
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <section className="hp-content">
          {view === "overview" && (
            <Overview
              go={switchView}
              balance={balance}
              orders={orders}
              onTopup={openTopup}
              ipProxies={ipProxies}
              traffic={traffic}
              notify={showToast}
            />
          )}
          {view === "residential" && (
            <TrafficBuy
              kind="residential"
              planId={resPlan}
              balance={balance}
              purchased={traffic.residential}
              onSelect={setResPlan}
              onTopup={openTopup}
              onCheckout={trafficCheckout("residential")}
              onSaveConfig={saveTrafficConfig("residential")}
              onUpgrade={upgradeTraffic("residential")}
              focusUpgradeId={typeof focusId === "string" ? focusId : null}
              notify={showToast}
            />
          )}
          {view === "mobile" && (
            <TrafficBuy
              kind="mobile"
              planId={mobPlan}
              balance={balance}
              purchased={traffic.mobile}
              onSelect={setMobPlan}
              onTopup={openTopup}
              onCheckout={trafficCheckout("mobile")}
              onSaveConfig={saveTrafficConfig("mobile")}
              onUpgrade={upgradeTraffic("mobile")}
              focusUpgradeId={typeof focusId === "string" ? focusId : null}
              notify={showToast}
            />
          )}
          {view === "isp" && (
            <PurchasedProxies
              kind="isp"
              proxies={ipProxies.isp}
              notify={showToast}
              sortByExpiry={expirySort}
              focusId={typeof focusId === "number" ? focusId : null}
              onRenew={renewIp("isp")}
            />
          )}
          {view === "isp" && (
            <IpBuy
              kind="isp"
              qty={ispQty}
              days={ispDays}
              country={ispCountry}
              channel={channel}
              defaultChannel={defaultChannel}
              balance={balance}
              onQty={setIspQty}
              onDays={setIspDays}
              onCountry={setIspCountry}
              onChannel={setChannel}
              onSaveDefaultChannel={saveDefaultChannel}
              onTopup={openTopup}
              onCheckout={ipCheckout("isp")}
            />
          )}
          {view === "datacenter" && (
            <PurchasedProxies
              kind="datacenter"
              proxies={ipProxies.datacenter}
              notify={showToast}
              sortByExpiry={expirySort}
              focusId={typeof focusId === "number" ? focusId : null}
              onRenew={renewIp("datacenter")}
            />
          )}
          {view === "datacenter" && (
            <IpBuy
              kind="datacenter"
              qty={dcQty}
              days={dcDays}
              country={dcCountry}
              channel={channel}
              defaultChannel={defaultChannel}
              balance={balance}
              onQty={setDcQty}
              onDays={setDcDays}
              onCountry={setDcCountry}
              onChannel={setChannel}
              onSaveDefaultChannel={saveDefaultChannel}
              onTopup={openTopup}
              onCheckout={ipCheckout("datacenter")}
            />
          )}
          {view === "purchased" && (
            <Purchased orders={orders} go={switchView} notify={showToast} />
          )}
        </section>
      </div>

      {/* 移动端底部五格 tab 栏（≤768px 显示，样式在 proxy-mobile.css，配方同 /vcc）：
          四类代理直切视图；「我的」登录页未做，点击弹 toast 不跳转 */}
      <nav className="hp-mtab" aria-label="移动端导航">
        <a className={view === "isp" ? "on" : undefined} onClick={() => switchView("isp")}>
          {ICONS.isp}ISP代理
        </a>
        <a
          className={view === "datacenter" ? "on" : undefined}
          onClick={() => switchView("datacenter")}
        >
          {ICONS.datacenter}数据中心代理
        </a>
        <a
          className={view === "residential" ? "on" : undefined}
          onClick={() => switchView("residential")}
        >
          {ICONS.residential}住宅代理
        </a>
        <a className={view === "mobile" ? "on" : undefined} onClick={() => switchView("mobile")}>
          {ICONS.mobile}移动代理
        </a>
        <a onClick={() => showToast("个人中心即将上线，敬请期待")}>
          <Icon>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </Icon>
          我的
        </a>
      </nav>

      {topupOpen && <TopupModal onClose={() => setTopupOpen(false)} onConfirm={confirmTopup} />}
      {toast && <div className="hp-toast">{toast}</div>}
    </div>
  );
}
