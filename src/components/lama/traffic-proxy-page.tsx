"use client";

/** 住宅 / 移动代理购买页 — 对齐原站 TrafficProxyPage。
 *  流量套餐网格 + 右侧订单面板 + 已购套餐卡（含轮询/粘滞代理列表生成器）。
 *  纯演示壳：结账仅弹提示，不接入真实支付。 */

import { useMemo, useState } from "react";
import {
  PLANS,
  SAMPLE_PURCHASED,
  T,
  fmtPrice,
  discountPct,
  flagOf,
  type ProxyType,
  type TrafficPlan,
  type PurchasedProxy,
} from "@/lib/lamaproxy-data";
import { Button, Card, ContentArea, OrderPanel, OrderPanelFooter } from "./ui";
import { CheckIcon, EyeIcon, EyeOffIcon } from "./icons";

/* ── 套餐卡 ───────────────────────────────────────────── */

function PlanCard({
  plan,
  pricePerGb,
  selected,
  onSelect,
}: {
  plan: TrafficPlan;
  pricePerGb: number;
  selected: boolean;
  onSelect: (p: TrafficPlan) => void;
}) {
  const hasDiscount = plan.discount < 1;
  const discounted = pricePerGb * plan.discount;
  const total = plan.trafficGb * discounted;

  return (
    <button
      onClick={() => onSelect(plan)}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all
        ${
          selected
            ? "border-primary-600 bg-primary-50 shadow-sm"
            : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50"
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-base font-bold ${selected ? "text-primary-700" : "text-gray-900"}`}>
            {plan.trafficGb} GB
          </div>
          <div className="text-sm mt-0.5 flex items-center gap-1">
            {hasDiscount ? (
              <>
                <span className="text-gray-500 line-through">{fmtPrice(pricePerGb)}</span>
                <span className={selected ? "text-primary-600 font-semibold" : "text-green-600 font-semibold"}>
                  {fmtPrice(discounted)}
                </span>
              </>
            ) : (
              <span className="text-gray-600">{fmtPrice(pricePerGb)}</span>
            )}
            <span className="text-gray-500">{T.order.perGB}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {hasDiscount && (
            <span className="text-sm font-semibold text-white bg-green-500 px-1.5 py-0.5 rounded-full leading-none">
              -{discountPct(plan.discount)}%
            </span>
          )}
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all
              ${selected ? "border-primary-600 bg-primary-600" : "border-gray-300"}`}
          >
            {selected && <CheckIcon className="w-3 h-3 text-white" />}
          </div>
        </div>
      </div>
      <div className={`mt-1.5 text-sm font-medium ${selected ? "text-primary-600" : "text-gray-600"}`}>
        {T.order.total}: {fmtPrice(total)}
      </div>
    </button>
  );
}

/* ── 订单面板顶槽：已选套餐摘要 ───────────────────────── */

function OrderSummary({
  selectedTrafficGb,
  pricePerGb,
}: {
  selectedTrafficGb: number | null;
  pricePerGb: number | null;
}) {
  if (selectedTrafficGb === null || pricePerGb === null) {
    return <p className="text-sm text-gray-500 italic">{T.order.empty}</p>;
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm">{T.plan.traffic}</span>
        <span className="font-semibold text-gray-900">{selectedTrafficGb} GB</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm">{T.plan.price}</span>
        <span className="font-semibold text-gray-900">
          {fmtPrice(pricePerGb)}
          {T.order.perGB}
        </span>
      </div>
    </div>
  );
}

/* ── 连接信息行 ───────────────────────────────────────── */

function InfoRow({
  label,
  value,
  secret = false,
  compact = false,
}: {
  label: string;
  value: string;
  secret?: boolean;
  compact?: boolean;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className={`flex items-center gap-1.5 ${compact ? "text-xs" : "text-sm"}`}>
      <span className={`text-gray-500 shrink-0 ${compact ? "w-16" : "w-20"}`}>{label}</span>
      <span className="font-mono text-gray-800 flex-1 truncate">
        {secret && !shown ? "••••••••" : value}
      </span>
      {secret && (
        <button onClick={() => setShown((s) => !s)} className="text-gray-500 hover:text-gray-600 shrink-0">
          {shown ? (
            <EyeOffIcon className={compact ? "w-3 h-3" : "w-4 h-4"} />
          ) : (
            <EyeIcon className={compact ? "w-3 h-3" : "w-4 h-4"} />
          )}
        </button>
      )}
    </div>
  );
}

/* ── 代理列表生成器：轮询 + 粘滞 ─────────────────────── */

function ProxyListGenerator({ entry }: { entry: PurchasedProxy }) {
  const stickyCount = entry.stickyPortEnd - entry.stickyPortStart + 1;
  const [protocol, setProtocol] = useState<"http" | "socks5">("http");
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const max = Math.min(500, stickyCount);

  const rotating = useMemo(() => {
    const n = Math.min(Math.max(1, qty), max);
    const port = protocol === "socks5" ? entry.proxyPortSocks5 : entry.proxyPort;
    return Array.from({ length: n }, () => `${entry.proxyUsername}:${entry.proxyPassword}@${entry.proxyHost}:${port}`);
  }, [protocol, qty, max, entry]);

  const sticky = useMemo(() => {
    const n = Math.min(Math.max(1, qty), max);
    return Array.from({ length: n }, (_, i) => {
      const port = entry.stickyPortStart + i;
      return `${entry.proxyUsername}:${entry.proxyPassword}@${entry.proxyHost}:${port}`;
    });
  }, [qty, max, entry]);

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
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

  const list = (key: "rotating" | "sticky", lines: string[]) => {
    const text = lines.join("\n");
    return (
      <div className="min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">{T.proxyList[key]}</h4>
          <span className="text-xs text-gray-500">{lines.length}</span>
        </div>
        <textarea
          readOnly
          value={text}
          rows={Math.min(lines.length, 8)}
          className="w-full min-h-[104px] font-mono text-xs bg-gray-900 text-green-400 rounded-lg px-4 py-3 resize-none focus:outline-none"
        />
        <div className="flex gap-2 mt-2 justify-end">
          <Button size="sm" variant="secondary" onClick={() => copy(key, text)}>
            {copied === key ? T.proxyList.copied : T.proxyList.copy}
          </Button>
          <Button size="sm" onClick={() => download(key, text, lines.length)}>
            {T.proxyList.download}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{T.proxyList.title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 shrink-0">{T.proxyList.protocol}</span>
            {(["http", "socks5"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProtocol(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  protocol === p
                    ? "bg-primary-100 text-primary-700 ring-1 ring-primary-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p === "http" ? "HTTP/HTTPS" : "SOCKS5"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 shrink-0">{T.proxyList.quantity}</span>
            <input
              type="number"
              min={1}
              max={max}
              value={qty}
              onChange={(e) => setQty(Math.min(max, Math.max(1, Number(e.target.value) || 1)))}
              className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list("rotating", rotating)}
        {list("sticky", sticky)}
      </div>
    </div>
  );
}

/* ── 已购套餐卡 ───────────────────────────────────────── */

function PurchasedCard({ entry }: { entry: PurchasedProxy }) {
  const pct = Math.min(100, (entry.usedGb / entry.totalGb) * 100);
  const nearFull = pct >= 80;
  const hasCreds = Boolean(entry.proxyHost && entry.proxyUsername);
  const hasLists = entry.whitelist.length > 0;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 font-mono mb-0.5">{entry.id}</p>
          <p className="text-lg font-bold text-gray-900">
            {entry.usedGb.toFixed(1)}
            <span className="text-sm font-normal text-gray-500 ml-1">/ {entry.totalGb} GB</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">
            {T.myProxies.config}
          </Button>
          <Button size="sm" variant="secondary">
            {T.myProxies.upgrade}
          </Button>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all ${nearFull ? "bg-red-500" : "bg-primary-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>
          {T.myProxies.used}: {entry.usedGb.toFixed(1)} GB
        </span>
        <span className={nearFull ? "text-red-500" : ""}>
          {(entry.totalGb - entry.usedGb).toFixed(1)} GB {T.myProxies.remaining}
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">{T.myProxies.connectionInfo}</p>
            {hasCreds ? (
              <div className="space-y-0.5">
                <InfoRow label="HTTP" value={`${entry.proxyHost}:${entry.proxyPort}`} compact />
                <InfoRow label="SOCKS5" value={`${entry.proxyHost}:${entry.proxyPortSocks5}`} compact />
                <InfoRow
                  label={T.myProxies.stickyPort}
                  value={`${entry.proxyHost}:${entry.stickyPortStart}–${entry.stickyPortEnd}`}
                  compact
                />
                <div className="border-t border-gray-200 my-1.5" />
                <InfoRow label={T.myProxies.username} value={entry.proxyUsername} secret compact />
                <InfoRow label={T.myProxies.password} value={entry.proxyPassword} secret compact />
              </div>
            ) : (
              <div className="text-xs text-amber-600 bg-amber-50 rounded px-3 py-2">
                {T.myProxies.credentialsPending}
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            {hasLists ? (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">{T.myProxies.whitelist}</p>
                <div className="flex flex-wrap gap-0.5">
                  {entry.whitelist.map((c) => (
                    <span key={c} title={c} className="text-base leading-none">
                      {flagOf(c)}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[88px] items-center justify-center text-xs text-gray-500">
                {T.myProxies.whitelist}
              </div>
            )}
          </div>
        </div>
        <div>{hasCreds && <ProxyListGenerator entry={entry} />}</div>
      </div>
    </Card>
  );
}

/* ── 页面 ─────────────────────────────────────────────── */

export function TrafficProxyPage({ type }: { type: ProxyType }) {
  const { pricePerGb, plans } = PLANS[type];
  const purchased = SAMPLE_PURCHASED[type];
  const [selected, setSelected] = useState<TrafficPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const total = selected ? selected.trafficGb * pricePerGb * selected.discount : 0;
  const title = T.nav[type];

  const checkout = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.alert(`演示环境：将以 ${fmtPrice(total)} 结算 ${selected.trafficGb} GB ${title}（支付流程未接入）。`);
    }, 600);
  };

  return (
    <ContentArea
      orderPanel={
        <OrderPanel
          topSlot={
            <OrderSummary
              selectedTrafficGb={selected?.trafficGb ?? null}
              pricePerGb={selected ? pricePerGb : null}
            />
          }
          bottomSlot={<OrderPanelFooter total={total} disabled={!selected} loading={loading} onCheckout={checkout} />}
        />
      }
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">{T.plan.selectPlan}</h2>
        {plans.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[...plans]
              .sort((a, b) => a.trafficGb - b.trafficGb)
              .map((p) => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  pricePerGb={pricePerGb}
                  selected={selected?.id === p.id}
                  onSelect={setSelected}
                />
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">{T.plan.noPlans}</p>
        )}
      </Card>

      {purchased.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-4">{T.myProxies.purchased}</h2>
          <div className="space-y-5">
            {purchased.map((entry) => (
              <PurchasedCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </ContentArea>
  );
}
