"use client";

/** 购买号码视图 — Numo 购买台原样移植：左侧服务列表 + 智能购买，
 *  右侧国家/运营商行情 + 数量条 + 结算。登录环节已拿掉（演示态直接下单）；
 *  钱包页已下线，余额不足只提示不跳转。 */

import { useEffect, useMemo, useState } from "react";
import {
  SMS_SERVICES,
  countriesFor,
  fmtPrice,
  fmtStock,
  varyNumber,
  type CountryOption,
  type SmsService,
} from "@/lib/sms-data";
import { Bolt, ChevronDown, ChevronRight, Clock, Search, Star } from "../icons";
import { useActivations, useWallet } from "../state";
import { QuantityBar, ServiceIcon, useToast } from "../ui";
import type { SmsView } from "./nav";

type BuyTab = "sms" | "fav";

const FAVS_KEY = "sms_favs";

/** 收藏键，如 "sms:telegram"（沿用原型的产品线命名空间） */
const favKey = (s: SmsService) => `sms:${s.id}`;

/** 待结算的选择 */
interface PendingSelection {
  /** 行情列表里要高亮的行键（国家+运营商） */
  matchKey: string;
  flag: string;
  label: string;
  price: number;
  smart: boolean;
  /** 每单生成一个新号码 */
  build: () => CountryOption;
}

type SortKey = "rate" | "price" | "stock";
const SORTS: { k: SortKey; label: string }[] = [
  { k: "rate", label: "成功率" },
  { k: "price", label: "价格" },
  { k: "stock", label: "库存" },
];

const band = (rate: number) => (rate >= 70 ? "good" : rate >= 40 ? "mid" : "bad");

const CAPS = [
  { value: 0.1, label: "< $0.10" },
  { value: 0.3, label: "< $0.30" },
  { value: 0.6, label: "< $0.60" },
];

export function BuyView({ go }: { go: (view: SmsView, actId?: string) => void }) {
  const toast = useToast();
  const { create } = useActivations();
  const { balance } = useWallet();
  const [favs, setFavs] = useState<string[]>([]);
  const [tab, setTab] = useState<BuyTab>("sms");
  const [selected, setSelected] = useState<SmsService>(SMS_SERVICES[0]);
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [sort, setSort] = useState<SortKey>("rate");
  const [pending, setPending] = useState<PendingSelection | null>(null);
  // 行情头部的说明/图例折叠框（默认收起，省移动端竖屏空间）
  const [infoOpen, setInfoOpen] = useState(false);

  // 收藏挂载后再从 localStorage 读（SSR 无存储，且避免水合不一致）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVS_KEY);
      const list = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(list)) {
        const clean = list.filter((k): k is string => typeof k === "string");
        const id = setTimeout(() => setFavs(clean), 0);
        return () => clearTimeout(id);
      }
    } catch {
      /* 忽略隐私模式/配额错误 */
    }
  }, []);

  const toggleFav = (key: string) => {
    setFavs((cur) => {
      const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
      try {
        localStorage.setItem(FAVS_KEY, JSON.stringify(next));
      } catch {
        /* 忽略 */
      }
      return next;
    });
  };

  // 换服务即作废当前结算选择
  function pickService(s: SmsService) {
    setSelected(s);
    setPending(null);
  }

  const items = useMemo(() => {
    let list: SmsService[];
    if (tab === "fav") {
      list = favs
        .map((key) => SMS_SERVICES.find((s) => favKey(s) === key))
        .filter((s): s is SmsService => s !== undefined);
    } else {
      list = SMS_SERVICES;
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) => s.name.toLowerCase().includes(q) || s.slug.includes(q));
  }, [tab, favs, search]);

  const countries = useMemo(() => countriesFor(selected), [selected]);

  const sorted = useMemo(() => {
    const list = [...countries];
    if (sort === "rate") list.sort((a, b) => b.rate - a.rate || a.price - b.price);
    else if (sort === "price") list.sort((a, b) => a.price - b.price || b.rate - a.rate);
    else list.sort((a, b) => b.stock - a.stock);
    return list;
  }, [countries, sort]);

  // 一次下 qty 单：每单调用 build 拿新号码，各自冻结、各自收码结算/退款
  function placeMany(build: () => CountryOption, smart: boolean) {
    const ids: string[] = [];
    for (let i = 0; i < qty; i++) {
      const id = create(selected, build(), smart);
      if (!id) break; // 余额撑不起下一笔冻结时 create 返回 null
      ids.push(id);
    }
    if (ids.length === 0) {
      toast.show("余额不足", "error");
      return;
    }
    if (ids.length < qty) toast.show(`余额不足，已下单 ${ids.length}/${qty} 个`, "error");
    else if (ids.length > 1) toast.show(`已批量下单 ${ids.length} 个`);
    if (ids.length === 1) go("activation", ids[0]);
    else go("orders");
  }

  // 点行情行只是选中待结算（不再直接下单）
  function selectCountry(c: CountryOption, smart = false) {
    setPending({
      matchKey: c.country + c.operator,
      flag: c.flag,
      label: `${c.country} · ${c.operator}`,
      price: c.price,
      smart,
      build: () => ({ ...c, number: varyNumber(c.number) }),
    });
  }

  // 智能购买：只设价格上限，选成功率最高的号进结算
  function smartBuy(cap: number) {
    const list = countries.filter((c) => c.price <= cap);
    if (!list.length) return;
    list.sort((a, b) => b.rate - a.rate || a.price - b.price);
    selectCountry(list[0], true);
  }

  function confirmOrder() {
    if (pending) placeMany(pending.build, pending.smart);
  }

  const total = pending ? +(pending.price * qty).toFixed(3) : 0;
  const after = +(balance - total).toFixed(3);
  const enough = after >= 0;

  return (
    <div className="buy-grid">
      <aside className="buy-aside">
        {/* 服务列表 */}
        <div className="panel">
          <div className="tabs">
            {(
              [
                { id: "sms", label: "号码" },
                { id: "fav", label: "收藏" },
              ] as { id: BuyTab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                className={"tab" + (t.id === tab ? " on" : "")}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="search-wrap">
            <div className="search-box">
              <Search />
              <input
                placeholder="搜索服务 / App"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="svc-scroll">
            {items.map((s) => {
              const key = favKey(s);
              const fav = favs.includes(key);
              return (
                <div
                  key={key}
                  className={"svc-item" + (s.id === selected.id ? " active" : "")}
                  role="button"
                  tabIndex={0}
                  aria-pressed={s.id === selected.id}
                  aria-label={s.name}
                  onClick={() => pickService(s)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pickService(s);
                    }
                  }}
                >
                  <ServiceIcon service={s} size={34} tile={38} />
                  <span style={{ flex: 1, minWidth: 0, position: "relative" }}>
                    <span className="svc-item__name">{s.name}</span>
                    <span className="svc-item__meta">库存 {fmtStock(s.stock)}</span>
                  </span>
                  <span className="svc-item__price">{fmtPrice(s.price)} 起</span>
                  <button
                    type="button"
                    className={"fav-btn" + (fav ? " on" : "")}
                    aria-label={fav ? "取消收藏" : "收藏"}
                    aria-pressed={fav}
                    title={fav ? "取消收藏" : "收藏"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(key);
                    }}
                  >
                    <Star size={14} filled={fav} />
                  </button>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="svc-empty">
                {tab === "fav" && !search.trim()
                  ? "还没有收藏 — 点击服务行的星标即可收藏常用服务"
                  : "未找到匹配的服务"}
              </div>
            )}
          </div>
        </div>

        {/* 智能购买 */}
        <div className="smart">
          <div className="smart__head">
            <span className="smart__icon">
              <Bolt />
            </span>
            <span className="smart__title">智能购买</span>
          </div>
          <div className="smart__sub">只设价格上限，自动路由成功率最高的号</div>
          <div className="caps">
            {CAPS.map((c) => (
              <button key={c.value} className="cap" onClick={() => smartBuy(c.value)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main style={{ minWidth: 0 }}>
        {/* 国家/运营商行情 */}
        <div className="panel">
          <div className="svc-header">
            <ServiceIcon service={selected} size={37} tile={42} radius={12} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="svc-header__name">{selected.name}</span>
              <span className="svc-header__sub">选择国家与运营商，在下方结算确认</span>
            </span>
            <span className="svc-header__price">{fmtPrice(selected.price)} 起</span>
          </div>

          <div className="svc-info">
            <button
              type="button"
              className="svc-info__toggle"
              aria-expanded={infoOpen}
              onClick={() => setInfoOpen((o) => !o)}
            >
              <span className="svc-notice__icon">
                <Clock />
              </span>
              <span className="svc-info__summary">
                <b>一次性临时号码</b>
                <span className="svc-info__hint">保留 20 分钟 · 免费多次收码 · 未收码自动退款</span>
              </span>
              <span className={"svc-info__chev" + (infoOpen ? " open" : "")}>
                <ChevronDown />
              </span>
            </button>

            {infoOpen && (
              <div className="svc-info__body">
                <p className="svc-info__text">
                  保留 20 分钟，时效内可免费多次接收验证码；未收到码自动退款，到期自动释放。
                </p>
                <div className="rate-legend">
                  <span>近 7 日接码成功率 · 更新于 8 分钟前</span>
                  <span className="rate-legend__item">
                    <span className="rate-legend__dot" style={{ background: "var(--rate-good)" }} />
                    ≥70%
                  </span>
                  <span className="rate-legend__item">
                    <span className="rate-legend__dot" style={{ background: "var(--rate-mid)" }} />
                    40–70%
                  </span>
                  <span className="rate-legend__item">
                    <span className="rate-legend__dot" style={{ background: "var(--rate-bad)" }} />
                    &lt;40%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="svc-sort">
            <span className="sort-bar__label">排序</span>
            {SORTS.map((s) => (
              <button
                key={s.k}
                className={"sort-chip" + (sort === s.k ? " on" : "")}
                onClick={() => setSort(s.k)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div>
            {sorted.map((c) => {
              const key = c.country + c.operator;
              return (
                <button
                  key={key}
                  className={"country-row" + (key === pending?.matchKey ? " active" : "")}
                  onClick={() => selectCountry(c)}
                >
                  <span style={{ fontSize: 23, lineHeight: 1, flex: "none" }}>{c.flag}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="country-row__place">
                      {c.country} · {c.operator}
                    </span>
                    <span className="country-row__meta">库存 {fmtStock(c.stock)} 个</span>
                  </span>
                  <span
                    className={`row-trend__rate rate--${band(c.rate)}`}
                    title={`近 7 日 ${c.samples.toLocaleString("en-US")} 次接码样本`}
                  >
                    {c.rate}%
                  </span>
                  <span className="country-row__price">{fmtPrice(c.price)}</span>
                  <span className="country-row__chev">
                    <ChevronRight />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <QuantityBar value={qty} onChange={setQty} unit="号" />

        {/* 结算 */}
        <div className="checkout">
          <div className="checkout__title">结算</div>

          {!pending ? (
            <div className="checkout__empty">先在上方选择一个号</div>
          ) : (
            <>
              <div className="checkout__row">
                <span>
                  {pending.flag} {pending.label}
                  {pending.smart && <span className="checkout__tag">智能路由</span>}
                </span>
                <span className="checkout__mono">{fmtPrice(pending.price)}</span>
              </div>
              <div className="checkout__row checkout__muted">
                <span>数量</span>
                <span className="checkout__mono">×{qty}</span>
              </div>
              <div className="checkout__row checkout__total">
                <span>合计</span>
                <b>{fmtPrice(total)}</b>
              </div>
              <div className="checkout__row checkout__muted">
                <span>下单后余额</span>
                <span
                  className="checkout__mono"
                  style={{ color: enough ? undefined : "var(--rate-bad)" }}
                >
                  {fmtPrice(after)}
                </span>
              </div>
            </>
          )}

          <button
            className="btn-primary btn-block"
            disabled={!pending || !enough}
            onClick={confirmOrder}
          >
            {!pending ? "请选择" : enough ? `确认下单 · ${fmtPrice(total)}` : "余额不足"}
          </button>
        </div>
      </main>
    </div>
  );
}
