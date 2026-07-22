import type { DesignPage } from "@/lib/design";

/** 虚拟卡演示数据注入 — 与生产同构：把设计稿预留给服务端的占位符
 *  （BINS_START/SPEND_START 注释块、__CARD_FEE_CENTS__ 等）替换成一套
 *  自洽的演示数据，让未登录预览也能看到完整的虚拟信用卡体验：
 *  卡段 BIN 选择、卡片列表（迷你卡面 + 掩码卡号）、卡片详情抽屉、
 *  交易记录、消费趋势与支出分布。
 *
 *  数据自洽性：本月消费 KPI = 各卡月消费之和 = 支出分布合计；
 *  成员 KPI（陈墨视角）= 陈墨两张卡的余额/消费之和。 */

interface DemoCard {
  color: "blue" | "navy" | "sky" | "indigo" | "teal" | "emerald";
  name: string;
  owner: string;
  ownerEmail: string;
  scheme: "visa" | "mastercard";
  bin: string;
  last: string;
  exp: string;
  created: string;
  month: string; // 本月消费（展示字符串）
  limit: string; // 月度限额
  pct: number;
  balance: string;
  status: "ok" | "enabled" | "frozen" | "closed";
  statusLabel: string;
  /** i 供抽屉脚本渲染（头像已按用户要求用 CSS 隐藏，字段保底防 undefined 文案） */
  tx: { i: string; m: string; a: string; credit?: boolean; decline?: boolean }[];
}

const CARDS: DemoCard[] = [
  {
    color: "blue", name: "Meta 广告 01", owner: "林一帆", ownerEmail: "leo@acme.com",
    scheme: "visa", bin: "493823", last: "4021", exp: "09/28", created: "2026-05-12",
    month: "2,318.40", limit: "5,000", pct: 46, balance: "1,681.60", status: "ok", statusLabel: "活跃",
    tx: [
      { i: "f", m: "Facebook Ads", a: "-$412.00" },
      { i: "f", m: "Facebook Ads", a: "-$388.00" },
      { i: "f", m: "Facebook Ads", a: "-$500.00", decline: true },
    ],
  },
  {
    color: "navy", name: "Google 广告 02", owner: "陈墨", ownerEmail: "mo@acme.com",
    scheme: "visa", bin: "493823", last: "8842", exp: "11/28", created: "2026-05-28",
    month: "1,904.75", limit: "4,000", pct: 48, balance: "2,095.25", status: "ok", statusLabel: "活跃",
    tx: [
      { i: "G", m: "Google Ads", a: "-$286.40" },
      { i: "G", m: "Google Ads 退款", a: "+$56.20", credit: true },
    ],
  },
  {
    color: "sky", name: "TikTok 投放 03", owner: "陈墨", ownerEmail: "mo@acme.com",
    scheme: "mastercard", bin: "552461", last: "1096", exp: "04/29", created: "2026-06-03",
    month: "1,486.10", limit: "3,000", pct: 50, balance: "513.90", status: "ok", statusLabel: "活跃",
    tx: [
      { i: "T", m: "TikTok Ads", a: "-$150.00" },
      { i: "T", m: "TikTok Ads", a: "-$220.00" },
    ],
  },
  {
    color: "indigo", name: "SaaS 订阅 04", owner: "赵薇", ownerEmail: "vivian@acme.com",
    scheme: "visa", bin: "442830", last: "3377", exp: "06/29", created: "2026-06-19",
    month: "428.00", limit: "1,000", pct: 43, balance: "572.00", status: "enabled", statusLabel: "已启用",
    tx: [
      { i: "O", m: "OpenAI", a: "-$20.00" },
      { i: "A", m: "AWS", a: "-$128.00" },
    ],
  },
  {
    color: "teal", name: "电商采购 05", owner: "王睿", ownerEmail: "ray@acme.com",
    scheme: "mastercard", bin: "532105", last: "6650", exp: "01/29", created: "2026-06-27",
    month: "2,099.15", limit: "6,000", pct: 35, balance: "900.85", status: "frozen", statusLabel: "已冻结",
    tx: [
      { i: "a", m: "Amazon", a: "-$96.35", decline: true },
      { i: "a", m: "Amazon", a: "-$1,240.00" },
    ],
  },
  {
    color: "emerald", name: "差旅备用 06", owner: "Sara Hu", ownerEmail: "sara@acme.com",
    scheme: "visa", bin: "493823", last: "9913", exp: "03/28", created: "2026-04-02",
    month: "0.00", limit: "2,000", pct: 0, balance: "0.00", status: "closed", statusLabel: "已注销",
    tx: [],
  },
];

const STATUS_PILL: Record<DemoCard["status"], string> = {
  ok: "ok", enabled: "info", frozen: "warn", closed: "off",
};

const SCHEME_LOGO: Record<DemoCard["scheme"], string> = {
  visa: '<img class="scm visa" src="/assets/card-logo-visa.svg" alt="Visa">',
  mastercard: '<img class="scm mc" src="/assets/card-logo-mastercard.svg" alt="Mastercard">',
};

function statusDot(): string {
  return '<i data-lucide="circle" style="width:8px;height:8px;fill:currentColor"></i>';
}

function pill(card: DemoCard): string {
  return `<span class="pill ${STATUS_PILL[card.status]}">${statusDot()}${card.statusLabel}</span>`;
}

function swatch(card: DemoCard): string {
  return `<span class="swatch ${card.color}">${SCHEME_LOGO[card.scheme]}<span class="swn">${card.last}</span></span>`;
}

/** 抽屉与筛选读取的行级 data-* 契约（openDetail / fchips / openWithdraw）。 */
function cardDataAttrs(card: DemoCard): string {
  const tx = JSON.stringify(card.tx).replace(/'/g, "&#39;");
  return [
    `data-card data-fkey="${card.status}"`,
    `data-color="${card.color}" data-name="${card.name}" data-owner="${card.owner}"`,
    `data-scheme="${card.scheme}" data-bin="${card.bin}" data-last="${card.last}"`,
    `data-exp="${card.exp}" data-created="${card.created}"`,
    `data-status="${card.status === "ok" ? "ok" : card.status === "enabled" ? "info" : card.status === "frozen" ? "warn" : "off"}"`,
    `data-status-label="${card.statusLabel}"`,
    `data-month="${card.month}" data-recharge="${card.limit}" data-pct="${card.pct}"`,
    `data-balance="${card.balance}" data-tx='${tx}'`,
  ].join(" ");
}

/** 副标题放银行返回的最近一笔交易信息（清算描述符 + 金额，TXS 已按时间倒序），
 *  被拒付标注「拒付」，无交易回退「暂无交易」。 */
function cardCell(card: DemoCard): string {
  const tx = TXS.find((t) => t.last === card.last);
  const sub = tx ? `${tx.ref} · ${tx.amount}${tx.status === "declined" ? " 拒付" : ""}` : "暂无交易";
  return `<div class="card-cell clickable" data-open-detail>${swatch(card)}<div><div class="cl-name">${card.name}</div><div class="cl-pan">${sub}</div></div></div>`;
}

function rowMenu(): string {
  return `<div style="position:relative;display:inline-block"><button class="icon-btn" data-menu aria-label="更多操作"><i data-lucide="more-horizontal"></i></button><div class="menu"><button data-open-detail><i data-lucide="eye"></i>查看详情</button><button><i data-lucide="plus-circle"></i>卡片充值</button><button><i data-lucide="arrow-up-to-line"></i>卡片提现</button><div class="sep"></div><button><i data-lucide="snowflake"></i>冻结卡片</button><button class="danger"><i data-lucide="trash-2"></i>销卡</button></div></div>`;
}

/** 我的卡片：卡片 | 归属成员 | 卡号 | 余额 | 状态 | 操作 */
function cardsRows(): string {
  return CARDS.map((c) => `
<tr ${cardDataAttrs(c)}>
  <td>${cardCell(c)}</td>
  <td class="col-owner"><div><div class="cl-name" style="font-size:13.5px">${c.owner}</div><div style="color:var(--ink-3);font-size:12px">${c.ownerEmail}</div></div></td>
  <td><span class="cl-pan">${c.bin} •••• ${c.last}</span></td>
  <td class="spendcell balance-only"><div class="sv"><span>$${c.balance}</span></div></td>
  <td>${pill(c)}</td>
  <td style="text-align:right">${rowMenu()}</td>
</tr>`).join("");
}

/** 仪表盘·最近卡片：卡片 | 卡号 | 本月消费 | 状态 | 详情 */
function recentRows(): string {
  return CARDS.slice(0, 4).map((c) => `
<tr ${cardDataAttrs(c)}>
  <td>${cardCell(c)}</td>
  <td><span class="cl-pan">•••• ${c.last}</span></td>
  <td><span style="font-family:var(--ff-mono)">$${c.month}</span></td>
  <td>${pill(c)}</td>
  <td style="text-align:right"><button class="icon-btn" data-open-detail aria-label="查看详情"><i data-lucide="chevron-right"></i></button></td>
</tr>`).join("");
}

interface DemoTx {
  member: "leo" | "mo" | "vivian" | "ray" | "sara";
  memberName: string;
  brand: string;
  ref: string;
  last: string;
  time: string;
  amount: string;
  credit?: boolean;
  status: "captured" | "authorized" | "declined" | "refunded";
  statusLabel: string;
  reason: string;
}

const TXS: DemoTx[] = [
  { member: "leo", memberName: "林一帆", brand: "Facebook Ads", ref: "FB*ADS 84921KQ", last: "4021", time: "07-15 11:26", amount: "-$412.00", status: "captured", statusLabel: "已结算", reason: "—" },
  { member: "mo", memberName: "陈墨", brand: "Google Ads", ref: "GOOGLE*ADS 77213", last: "8842", time: "07-15 10:03", amount: "-$286.40", status: "authorized", statusLabel: "已授权", reason: "—" },
  { member: "mo", memberName: "陈墨", brand: "TikTok Ads", ref: "TIKTOK*ADS 55801", last: "1096", time: "07-15 09:12", amount: "-$150.00", status: "captured", statusLabel: "已结算", reason: "—" },
  { member: "vivian", memberName: "赵薇", brand: "OpenAI", ref: "OPENAI*API 30112", last: "3377", time: "07-14 22:47", amount: "-$20.00", status: "captured", statusLabel: "已结算", reason: "—" },
  { member: "ray", memberName: "王睿", brand: "Amazon", ref: "AMZN*MKTP 90417", last: "6650", time: "07-14 18:20", amount: "-$96.35", status: "declined", statusLabel: "被拒付", reason: "卡片已冻结" },
  { member: "leo", memberName: "林一帆", brand: "Facebook Ads", ref: "FB*ADS 84756TT", last: "4021", time: "07-14 15:02", amount: "-$388.00", status: "captured", statusLabel: "已结算", reason: "—" },
  { member: "mo", memberName: "陈墨", brand: "Google Ads", ref: "GOOGLE*ADS 76002", last: "8842", time: "07-13 20:15", amount: "+$56.20", credit: true, status: "refunded", statusLabel: "已退款", reason: "—" },
  { member: "vivian", memberName: "赵薇", brand: "AWS", ref: "AWS*EMEA 41220", last: "3377", time: "07-13 11:40", amount: "-$128.00", status: "captured", statusLabel: "已结算", reason: "—" },
  { member: "leo", memberName: "林一帆", brand: "Facebook Ads", ref: "FB*ADS 83310MD", last: "4021", time: "07-12 09:58", amount: "-$500.00", status: "declined", statusLabel: "被拒付", reason: "超出单笔限额" },
];

const TX_PILL: Record<DemoTx["status"], string> = {
  captured: "ok", authorized: "info", declined: "declined", refunded: "off",
};

/** 交易记录：交易成员(owner) | 交易信息 | 卡片 | 时间 | 金额 | 状态 | 失败原因 */
function txRows(): string {
  return TXS.map((t) => {
    const amtColor = t.credit ? "color:var(--green)" : t.status === "declined" ? "color:#d23b3b" : "";
    return `
<tr data-fkey="${t.status}">
  <td data-allow="owner"><span class="cl-name" style="font-size:13px">${t.memberName}</span></td>
  <td><div><div class="cl-name" style="font-size:13.5px">${t.brand}</div><div class="cl-pan" style="font-size:11.5px">${t.ref}</div></div></td>
  <td><span class="cl-pan">•••• ${t.last}</span></td>
  <td style="white-space:nowrap;color:var(--ink-2);font-family:var(--ff-mono);font-size:12.5px">${t.time}</td>
  <td><b style="font-family:var(--ff-mono);font-weight:600;white-space:nowrap;${amtColor}">${t.amount}</b></td>
  <td><span class="pill ${TX_PILL[t.status]}">${t.statusLabel}</span></td>
  <td style="color:var(--ink-3);font-size:12.5px">${t.reason}</td>
</tr>`;
  }).join("");
}

/** 成员视角·我的最近交易：时间 | 类型 | 金额 | 关联对象 | 状态 */
function memberTxRows(): string {
  const mine = TXS.filter((t) => t.member === "mo");
  return mine.map((t) => `
<tr>
  <td style="white-space:nowrap;color:var(--ink-2);font-family:var(--ff-mono);font-size:12.5px">${t.time}</td>
  <td>${t.credit ? "退款入账" : "广告扣款"}</td>
  <td><b style="font-family:var(--ff-mono);font-weight:600;${t.credit ? "color:var(--green)" : ""}">${t.amount}</b></td>
  <td><span class="cl-name" style="font-size:13px">${t.brand}</span> <span class="cl-pan">·&nbsp;•••• ${t.last}</span></td>
  <td><span class="pill ${TX_PILL[t.status]}">${t.statusLabel}</span></td>
</tr>`).join("");
}

interface DemoBin {
  bin: string;
  scheme: DemoCard["scheme"];
  color: DemoCard["color"];
  note: string;
  rec?: boolean;
  rules: {
    allowedUses: { title: string; description: string }[];
    prohibitedUses: string[];
    freezeNotice: string;
    googlePayFeePercent: number;
  };
}

const PROHIBITED = [
  "进行政务、法律、信贷机构等敏感行业交易",
  "实施套利、薅羊毛行为，如阿里云、各类视频网站、游戏平台等试用活动",
  "虚假注册、批量绑定及小额多次验证交易（如 $0、$0.01、$1 等）",
  "在虚拟货币、博彩、毒品、色情、交友等违法或敏感平台交易",
];
const FREEZE = "一经发现将冻结卡片，且卡内余额及账户余额均无法退回。";

const BINS: DemoBin[] = [
  {
    bin: "493823", scheme: "visa", color: "blue", note: "VISA · 美国 · 通用消费", rec: true,
    rules: {
      allowedUses: [
        { title: "网络营销推广", description: "如 Facebook、Google、TikTok、Twitter 等" },
        { title: "电商平台费用", description: "如 Amazon、Etsy、eBay、Aliexpress 等" },
        { title: "开发者账号支付", description: "如 Google、Apple、OpenAI、LinkedIn 等" },
        { title: "软件服务费用", description: "如云服务器、域名、软件授权、在线课程等" },
        { title: "商旅出行", description: "如预订国际机票、酒店、租车等商旅服务" },
        { title: "外贸与跨境服务", description: "如支付货款、运费等相关费用" },
      ],
      prohibitedUses: PROHIBITED, freezeNotice: FREEZE, googlePayFeePercent: 0.4,
    },
  },
  {
    bin: "442830", scheme: "visa", color: "indigo", note: "VISA · 美国 · 广告投放专用",
    rules: {
      allowedUses: [
        { title: "Meta 系广告", description: "Facebook、Instagram、Audience Network 扣款" },
        { title: "Google 系广告", description: "Google Ads、YouTube Ads 等" },
        { title: "短视频信息流", description: "TikTok Ads、Snapchat、X(Twitter) Ads 等" },
        { title: "广告代理充值", description: "各平台一级代理与海外户充值" },
      ],
      prohibitedUses: PROHIBITED, freezeNotice: FREEZE, googlePayFeePercent: 0.4,
    },
  },
  {
    bin: "552461", scheme: "mastercard", color: "sky", note: "万事达 · 香港 · 跨境电商",
    rules: {
      allowedUses: [
        { title: "电商平台采购", description: "Amazon、eBay、Etsy、AliExpress 货款" },
        { title: "独立站收付", description: "Shopify、WooCommerce 订单与月租" },
        { title: "物流运费", description: "国际小包、专线、海外仓费用" },
        { title: "平台佣金与广告", description: "站内推广、佣金结算等费用" },
      ],
      prohibitedUses: PROHIBITED, freezeNotice: FREEZE, googlePayFeePercent: 0.9,
    },
  },
  {
    bin: "532105", scheme: "mastercard", color: "teal", note: "万事达 · 英国 · 订阅扣款",
    rules: {
      allowedUses: [
        { title: "SaaS 订阅", description: "Notion、Figma、Slack、Adobe 等月付年付" },
        { title: "AI 工具", description: "OpenAI、Anthropic、Midjourney 等 API 与会员" },
        { title: "云服务", description: "AWS、GCP、Azure、Vercel 等账单" },
        { title: "域名与软件授权", description: "域名注册、SSL、桌面软件 License" },
      ],
      prohibitedUses: PROHIBITED, freezeNotice: FREEZE, googlePayFeePercent: 0.9,
    },
  },
];

function binPills(): string {
  return BINS.map((b, i) => {
    const mini = `<span class="swatch ${b.color}">${SCHEME_LOGO[b.scheme]}<span class="swn">${b.bin.slice(0, 4)} ${b.bin.slice(4)}</span></span>`;
    return `
<div class="bin-pill${i === 0 ? " on" : ""}" data-bin="${b.bin}" data-scheme="${b.scheme}" data-can-issue="1">
  <span class="radio"></span>
  ${mini}
  <div class="bn">${b.bin}<small>${b.note}</small></div>
  ${b.rec ? '<span class="rec">推荐</span>' : ""}
</div>`;
  }).join("");
}

function cardRulesJson(): string {
  const rules: Record<string, DemoBin["rules"]> = {};
  for (const b of BINS) rules[b.bin] = b.rules;
  return JSON.stringify(rules).replace(/</g, "\\u003c");
}

/** 支出分布（与卡片月消费合计一致：$8,236.40）。 */
const SPEND = [
  { name: "Facebook Ads", amount: "$3,214.60", pct: 39.0, color: "#fa6b1f" },
  { name: "Google Ads", amount: "$2,286.20", pct: 27.8, color: "#f0a11c" },
  { name: "TikTok Ads", amount: "$1,486.10", pct: 18.0, color: "#c25231" },
  { name: "SaaS 订阅", amount: "$428.00", pct: 5.2, color: "#8a6244" },
  { name: "其他", amount: "$821.50", pct: 10.0, color: "#9aa2ad" },
];

function spendBlock(): string {
  let acc = 0;
  const segs = SPEND.map((s) => {
    const seg = `<circle cx="60" cy="60" r="45" pathLength="100" fill="none" stroke="${s.color}" stroke-width="12" stroke-dasharray="${Math.max(s.pct - 1, 0.5)} ${100 - Math.max(s.pct - 1, 0.5)}" stroke-dashoffset="${-acc}" transform="rotate(-90 60 60)"></circle>`;
    acc += s.pct;
    return seg;
  }).join("");
  const items = SPEND.map((s) => `<div class="spend-item"><span class="spend-dot" style="background:${s.color}"></span><div class="spend-item-name"><b>${s.name}</b><span>${s.pct.toFixed(1)}%</span></div><strong>${s.amount}</strong></div>`).join("");
  return `
<div class="spend-layout">
  <div class="spend-donut">
    <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="45" pathLength="100" fill="none" stroke="var(--bg-2)" stroke-width="12"></circle>${segs}</svg>
    <div class="spend-total"><span>本月支出</span><b title="$8,236.40">$8,236.40</b></div>
  </div>
  <div class="spend-list">${items}</div>
</div>
<div class="spend-note"><span>按本月已结算交易统计</span><button type="button" data-view="transactions">查看明细 <i data-lucide="arrow-right"></i></button></div>`;
}

const TREND_SERIES = {
  d7: {
    values: [612, 884, 1120, 968, 1342, 1486, 1204],
    labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  d30: {
    values: [
      284, 342, 296, 418, 388, 452, 512, 476, 548, 620,
      584, 668, 712, 656, 788, 842, 796, 904, 968, 1022,
      956, 1088, 1146, 1064, 1212, 1268, 1186, 1342, 1486, 1204,
    ],
    labels: ["30天前", "24天前", "18天前", "12天前", "6天前", "今天"],
  },
};

/** 精确替换：占位符找不到说明设计稿变了，直接抛错以免静默展示半成品。 */
function sub(body: string, needle: string | RegExp, replacement: string): string {
  if (typeof needle === "string" ? !body.includes(needle) : !needle.test(body)) {
    throw new Error(`merchant-demo: placeholder not found: ${needle}`);
  }
  return body.replace(needle, replacement);
}

export function applyMerchantDemoData(page: DesignPage): DesignPage {
  let body = page.body;

  // KPI（所有者视角）
  body = sub(body, "data-kpi-monthspend>$0.00<", "data-kpi-monthspend>$8,236.40<");
  body = sub(body, "data-kpi-total>0<", "data-kpi-total>6<");
  body = sub(body, "data-kpi-total-sub>—<", "data-kpi-total-sub>3 张活跃 · 1 张冻结<");
  body = sub(body, "data-kpi-passrate>—<", "data-kpi-passrate>98.2%<");
  body = sub(body, "data-kpi-wallet>$0.00<", "data-kpi-wallet>$12,480.00<");
  // KPI（成员视角·陈墨：两张卡 8842 + 1096 的余额/消费之和）
  body = sub(body, "data-mkpi-avail>$0.00<", "data-mkpi-avail>$1,860.00<");
  body = sub(body, "data-mkpi-cards>$0.00<", "data-mkpi-cards>$2,609.15<");
  body = sub(body, "data-mkpi-spend>$0.00<", "data-mkpi-spend>$3,390.85<");
  body = sub(body, "data-mkpi-refund>$0.00<", "data-mkpi-refund>$56.20<");
  // 钱包
  body = sub(body, "data-wallet-usd>$0.00<", "data-wallet-usd>$12,480.00<");

  // 消费趋势 + 支出分布
  body = sub(body, 'data-series=""', `data-series='${JSON.stringify(TREND_SERIES)}'`);
  body = sub(body, /<!--SPEND_START-->[\s\S]*?<!--SPEND_END-->/, spendBlock());

  // 表格：最近卡片 / 我的卡片 / 交易记录 / 成员资金流水
  body = sub(body, /<tr><td colspan="5"[^>]*>暂无卡片<\/td><\/tr>/, recentRows());
  body = sub(body, /<tr><td colspan="6"[^>]*>暂无卡片<\/td><\/tr>/, cardsRows());
  body = sub(body, /<tr><td colspan="7"[^>]*>暂无交易记录<\/td><\/tr>/, txRows());
  body = sub(body, /<tr><td colspan="5"[^>]*>暂无资金流水<\/td><\/tr>/, memberTxRows());

  // 开新卡：卡段 BIN、开卡费、规则 JSON；充值：手续费率
  body = sub(body, /<!--BINS_START-->[\s\S]*?<!--BINS_END-->/, binPills());
  body = sub(body, 'data-card-fee-cents="__CARD_FEE_CENTS__"', 'data-card-fee-cents="200"');
  body = sub(body, "data-nc-fee-unit>$0.00<", "data-nc-fee-unit>$2.00<");
  body = sub(body, "__CARD_RULES_JSON__", cardRulesJson());
  body = sub(body, 'data-topup-fee-rate="__TOPUP_FEE_RATE__"', 'data-topup-fee-rate="0.015"');
  body = sub(body, "data-topup-fee-label>—<", "data-topup-fee-label>1.5%<");

  // 开新卡计算器里的钱包余额字面量（生产由服务端注入，演示态给足额度避免误报「余额不足」）
  const steps = page.steps.map((step) =>
    step.type === "inline" && step.code.includes("const WALLET_USD = 0;")
      ? { ...step, code: step.code.replace("const WALLET_USD = 0;", "const WALLET_USD = 12480;") }
      : step
  );

  return { body, steps };
}
