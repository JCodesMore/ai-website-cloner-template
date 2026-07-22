"use client";

/** 我的订单视图 — 进行中列表 + 历史订单表（种子行 + 本次会话关闭的订单）、
 *  筛选 / 搜索 / CSV 导出、时效内的「再收一条」。 */

import { useMemo, useState } from "react";
import {
  ACTIVATION_SECS,
  ORDER_HISTORY,
  fmtCountdown,
  fmtPrice,
  toCsv,
  type OrderHistoryStatus,
  type OrderRow,
} from "@/lib/sms-data";
import { Download, Search } from "../icons";
import { useActivations } from "../state";
import { BrandIcon, ServiceIcon, downloadFile, useToast } from "../ui";
import type { SmsView } from "./nav";

type Filter = "all" | OrderHistoryStatus;

/** 种子行 + 会话内关闭的订单——后者带可拉回的激活 id */
type Row = OrderRow & { actId?: string; actIconUrl?: string; reopenable?: boolean };

const two = (n: number) => String(n).padStart(2, "0");
const fmtClock = (ms: number) => {
  const d = new Date(ms);
  return two(d.getHours()) + ":" + two(d.getMinutes());
};

const FILTERS: { k: Filter; label: string }[] = [
  { k: "all", label: "全部" },
  { k: "received", label: "已收码" },
  { k: "waiting", label: "冻结中" },
  { k: "refunded", label: "已退款" },
];

const STATUS_META: Record<OrderHistoryStatus, { label: string; color: string; bg: string }> = {
  received: { label: "已收码", color: "var(--rate-good)", bg: "rgba(11,143,104,.12)" },
  waiting: { label: "冻结中", color: "var(--rate-mid)", bg: "rgba(246,130,31,.14)" },
  refunded: { label: "已退款", color: "var(--ink-3)", bg: "var(--surface-2)" },
};

export function OrdersView({ go }: { go: (view: SmsView, actId?: string) => void }) {
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const { active, history, reopen } = useActivations();

  const rows = useMemo<Row[]>(() => {
    const q = query.trim().toLowerCase();
    const live: Row[] = history.map((a) => ({
      service: a.serviceName,
      slug: "",
      hex: "",
      flag: a.flag,
      place: a.place,
      number: a.number,
      code: a.code,
      amount: a.histStatus === "received" ? fmtPrice(a.price) : "已退回",
      status: a.histStatus,
      time: fmtClock(a.closedAt),
      actId: a.id,
      actIconUrl: a.iconUrl,
      // 号码是否仍在 20 分钟时效内（决定是否显示「再收一条」）。渲染期读一次当前
      // 时间足够：history 变更即重算，无需随秒推进——一次性判断，故按需读时钟。
      // eslint-disable-next-line react-hooks/purity
      reopenable: a.histStatus === "received" && a.createdAt + ACTIVATION_SECS * 1000 > Date.now(),
    }));
    return [...live, ...ORDER_HISTORY].filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.service.toLowerCase().includes(q) ||
        r.number.toLowerCase().includes(q) ||
        r.place.toLowerCase().includes(q)
      );
    });
  }, [filter, query, history]);

  function reopenOrder(id: string) {
    if (reopen(id)) go("activation", id);
    else toast.show("号码已释放，无法再收", "error");
  }

  function exportCsv() {
    const header = ["服务", "号码", "国家 / 运营商", "验证码", "金额", "状态", "时间"];
    const body = rows.map((r: OrderRow) => [
      r.service,
      r.number,
      r.place,
      r.code ?? "",
      r.amount,
      STATUS_META[r.status].label,
      r.time,
    ]);
    downloadFile(`sms-orders-${Date.now()}.csv`, toCsv(header, body));
  }

  return (
    <div>
      {active.length > 0 && (
        <div className="card" style={{ overflow: "hidden", marginBottom: 18 }}>
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--line)",
              fontFamily: "var(--ff-disp)",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            进行中 · {active.length}
          </div>
          {active.map((a) => (
            <a
              key={a.id}
              onClick={() => go("activation", a.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                borderTop: "1px solid var(--line)",
                color: "var(--ink)",
                cursor: "pointer",
              }}
            >
              <BrandIcon url={a.iconUrl} name={a.serviceName} size={16} tile={28} radius={8} />
              <span
                style={{ fontFamily: "var(--ff-disp)", fontWeight: 600, fontSize: 13.5, minWidth: 96 }}
              >
                {a.serviceName}
              </span>
              <span
                style={{
                  fontFamily: "var(--ff-mono)",
                  fontSize: 13,
                  color: "var(--ink-2)",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {a.number}
              </span>
              <span className="orders-live__place" style={{ fontSize: 13, color: "var(--ink-3)" }}>
                {a.flag} {a.place}
              </span>
              <span
                style={{
                  fontFamily: "var(--ff-mono)",
                  fontSize: 13,
                  color:
                    a.status === "received"
                      ? "var(--rate-good)"
                      : a.status === "expired"
                        ? "var(--rate-bad)"
                        : "var(--rate-mid)",
                  minWidth: 64,
                  textAlign: "right",
                }}
              >
                {a.status === "received" ? "已收码" : a.status === "expired" ? "已超时" : fmtCountdown(a.secs)}
              </span>
            </a>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div>
          <div className="page-title">我的订单</div>
          <div className="page-sub">收到码才扣费，超时自动退款</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div className="orders-search">
            <Search size={15} />
            <input
              placeholder="搜索服务 / 号码 / 国家"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="orders-head__filters">
            <div className="chips">
              {FILTERS.map((f) => (
                <button
                  key={f.k}
                  className={"chip" + (filter === f.k ? " on" : "")}
                  onClick={() => setFilter(f.k)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              className="btn-ghost btn-export"
              onClick={exportCsv}
              disabled={rows.length === 0}
              aria-label="导出 CSV"
            >
              <Download size={14} />
              <span className="btn-export__label">导出 CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="dtable dtable-orders" style={{ minWidth: 880 }}>
            <thead>
              <tr>
                <th>服务</th>
                <th>号码</th>
                <th>国家 / 运营商</th>
                <th>验证码</th>
                <th>金额</th>
                <th>状态</th>
                <th style={{ textAlign: "right" }}>时间</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const m = STATUS_META[r.status];
                return (
                  <tr key={r.actId ?? i}>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {r.actIconUrl ? (
                          <BrandIcon url={r.actIconUrl} name={r.service} size={16} tile={28} radius={8} />
                        ) : (
                          <ServiceIcon
                            service={{ slug: r.slug, hex: r.hex, name: r.service }}
                            size={16}
                            tile={28}
                            radius={8}
                          />
                        )}
                        <span style={{ fontFamily: "var(--ff-disp)", fontWeight: 600, fontSize: 13.5 }}>
                          {r.service}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--ff-mono)", fontSize: 13, color: "var(--ink-2)" }}>
                        {r.number}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
                        {r.flag} {r.place}
                      </span>
                    </td>
                    <td>
                      {r.code ? (
                        <span
                          style={{
                            fontFamily: "var(--ff-mono)",
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: ".06em",
                            color: "var(--accent-deep)",
                          }}
                        >
                          {r.code}
                        </span>
                      ) : (
                        <span style={{ color: "var(--ink-3)" }}>—</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--ff-mono)", fontSize: 13.5, color: "var(--ink)" }}>
                        {r.amount}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ color: m.color, background: m.bg }}>
                        <span className="status-badge__dot" />
                        {m.label}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{r.time}</span>
                    </td>
                    <td style={{ textAlign: "right", width: 1, whiteSpace: "nowrap" }}>
                      {r.reopenable && r.actId && (
                        <button
                          className="btn-ghost"
                          style={{ padding: "5px 12px", fontSize: 12.5, borderRadius: 9 }}
                          onClick={() => reopenOrder(r.actId!)}
                        >
                          再收一条
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)", fontSize: 14 }}>
            没有匹配的订单
          </div>
        )}
      </div>
    </div>
  );
}
