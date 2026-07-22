"use client";

/** 短信接码板块 — 会话内演示状态（钱包 + 激活订单）。
 *  逻辑取自 Numo 原型：下单冻结 → 收码结算 / 超时退款，一个 interval 驱动全部
 *  倒计时并按 AUTO_RECEIVE_SECS 自动送达验证码；刷新即重置（同 /proxy 惯例）。
 *  与原型的差异：登录被拿掉（演示态直接持有预置余额，同 /vcc、/proxy），
 *  余额/冻结用 ref 同步镜像做充足性检查，批量下单一个 tick 内连续冻结也不会超支。 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ACTIVATION_SECS,
  AUTO_RECEIVE_SECS,
  LEDGER_SEED,
  SMS_WALLET,
  genCode,
  iconUrl,
  smsBody,
  spaceCode,
  type Activation,
  type ClosedActivation,
  type CountryOption,
  type LedgerEntry,
  type OrderHistoryStatus,
  type OrderStatus,
  type SmsService,
} from "@/lib/sms-data";
import { playBeep, useToast } from "./ui";

/* ── 钱包 ─────────────────────────────────────────────── */

interface WalletApi {
  /** 可用余额（USD） */
  balance: number;
  /** 被进行中订单冻结的金额 */
  frozen: number;
  /** 累计充值总额（驱动折扣档位） */
  cumulative: number;
  ledger: LedgerEntry[];
  /** 充值入账：本金 + 赠送 */
  recharge: (amount: number, bonus: number, methodName: string) => void;
  /** 按订单价冻结；余额不足返回 false */
  freeze: (id: string, amount: number, title: string) => boolean;
  /** 结算冻结（收到码 → 实际扣费） */
  settle: (id: string) => void;
  /** 释放冻结回余额（超时 / 取消退款） */
  release: (id: string) => void;
}

interface WalletState {
  available: number;
  frozen: number;
  cumulative: number;
  ledger: LedgerEntry[];
  /** 激活 id → 冻结金额 */
  holds: Record<string, number>;
}

const WalletContext = createContext<WalletApi | null>(null);

let seq = 0;
const nextId = () => "lx" + Date.now().toString(36) + (seq++).toString(36);
// 金额保留 3 位小数（目录价格低至 $0.001）
const round = (n: number) => Math.round(n * 1000) / 1000;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    available: SMS_WALLET.balance,
    frozen: SMS_WALLET.frozen,
    cumulative: SMS_WALLET.cumulative,
    ledger: LEDGER_SEED,
    holds: {},
  });
  // 同步镜像：批量下单在同一个 tick 里连续 freeze，setState 尚未提交，
  // 充足性检查必须立刻看到扣减后的余额
  const availRef = useRef(SMS_WALLET.balance);
  const holdsRef = useRef<Record<string, number>>({});

  const recharge = useCallback((amount: number, bonus: number, methodName: string) => {
    availRef.current = round(availRef.current + amount + bonus);
    setState((s) => {
      const afterPrincipal = round(s.available + amount);
      const afterBonus = round(afterPrincipal + bonus);
      const entries: LedgerEntry[] = [
        { id: nextId(), type: "recharge", title: `${methodName} 充值`, amount, balanceAfter: afterPrincipal, time: "刚刚" },
      ];
      if (bonus > 0) {
        entries.unshift({ id: nextId(), type: "bonus", title: "充值赠送", amount: bonus, balanceAfter: afterBonus, time: "刚刚" });
      }
      return {
        ...s,
        available: afterBonus,
        cumulative: round(s.cumulative + amount),
        ledger: [...entries, ...s.ledger],
      };
    });
  }, []);

  const freeze = useCallback((id: string, amount: number, title: string): boolean => {
    if (availRef.current < amount) return false;
    availRef.current = round(availRef.current - amount);
    holdsRef.current[id] = amount;
    setState((s) => {
      const available = round(s.available - amount);
      const entry: LedgerEntry = {
        id: "hold_" + id,
        type: "freeze",
        title,
        amount: -amount,
        balanceAfter: available,
        time: "刚刚",
      };
      return {
        ...s,
        available,
        frozen: round(s.frozen + amount),
        holds: { ...s.holds, [id]: amount },
        ledger: [entry, ...s.ledger],
      };
    });
    return true;
  }, []);

  const settle = useCallback((id: string) => {
    if (!holdsRef.current[id]) return;
    delete holdsRef.current[id];
    setState((s) => {
      const amt = s.holds[id];
      if (!amt) return s;
      const holds = { ...s.holds };
      delete holds[id];
      return {
        ...s,
        frozen: round(s.frozen - amt),
        holds,
        // 冻结流水转为消费（可用余额在冻结时已扣）
        ledger: s.ledger.map((e) => (e.id === "hold_" + id ? { ...e, type: "spend" } : e)),
      };
    });
  }, []);

  const release = useCallback((id: string) => {
    const amt = holdsRef.current[id];
    if (!amt) return;
    delete holdsRef.current[id];
    availRef.current = round(availRef.current + amt);
    setState((s) => {
      const held = s.holds[id];
      if (!held) return s;
      const available = round(s.available + held);
      const holds = { ...s.holds };
      delete holds[id];
      return {
        ...s,
        available,
        frozen: round(s.frozen - held),
        holds,
        ledger: s.ledger.map((e) =>
          e.id === "hold_" + id
            ? { ...e, type: "refund", amount: held, balanceAfter: available, time: "刚刚" }
            : e,
        ),
      };
    });
  }, []);

  return (
    <WalletContext.Provider
      value={{
        balance: state.available,
        frozen: state.frozen,
        cumulative: state.cumulative,
        ledger: state.ledger,
        recharge,
        freeze,
        settle,
        release,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletApi {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider");
  return ctx;
}

/* ── 激活订单 ─────────────────────────────────────────── */

interface ActivationsApi {
  activations: Activation[];
  /** 仍在倒计时或已收码待处理的 */
  active: Activation[];
  /** 本次会话已关闭（完成/退款）的订单，最新在前 */
  history: ClosedActivation[];
  get: (id: string) => Activation | undefined;
  /** 下单并冻结价格；余额不足返回 null */
  create: (service: SmsService, country: CountryOption, smart: boolean) => string | null;
  resend: (id: string) => void;
  /** 完成或退款——结算/释放冻结后移入历史 */
  close: (id: string) => void;
  /** 从历史拉回已完成订单再收一条；号码时效已过返回 false */
  reopen: (id: string) => boolean;
}

const ActivationsContext = createContext<ActivationsApi | null>(null);

let counter = 0;
function newActId(): string {
  counter += 1;
  return "act_" + Date.now().toString(36) + counter.toString(36);
}

export function ActivationsProvider({ children }: { children: ReactNode }) {
  const [activations, setActivations] = useState<Activation[]>([]);
  const [history, setHistory] = useState<ClosedActivation[]>([]);
  const { freeze, settle, release } = useWallet();

  // 事件回调里同步读最新列表用的镜像（提交后由 effect 刷新）
  const listRef = useRef(activations);
  const historyRef = useRef(history);
  useEffect(() => {
    listRef.current = activations;
    historyRef.current = history;
  }, [activations, history]);

  const close = useCallback(
    (id: string) => {
      // 冻结还开着就释放（收码前取消/退款）；已结算或已释放则是 no-op
      release(id);
      const a = listRef.current.find((x) => x.id === id);
      if (a) {
        const histStatus: OrderHistoryStatus =
          (a.status === "received" && a.code) || a.settled ? "received" : "refunded";
        setHistory((h) => [{ ...a, histStatus, closedAt: Date.now() }, ...h]);
      }
      setActivations((list) => list.filter((x) => x.id !== id));
    },
    [release],
  );

  // 收到码即结算冻结并退场到历史——完成的订单不留在「进行中」。
  // 超时同样走 close，释放的钱以退款订单形式留在历史里。
  const prevStatus = useRef<Record<string, OrderStatus>>({});
  useEffect(() => {
    for (const a of activations) {
      const prev = prevStatus.current[a.id];
      if (a.status === "received" && prev !== "received") {
        settle(a.id);
        close(a.id);
      } else if (a.status === "expired" && prev !== "expired") close(a.id);
    }
    const map: Record<string, OrderStatus> = {};
    for (const a of activations) map[a.id] = a.status;
    prevStatus.current = map;
  }, [activations, settle, close]);

  // 一个 interval 驱动所有激活：倒计时 + 自动送码。
  // 没有变化时原样返回同一数组引用，空转不触发渲染。
  useEffect(() => {
    const id = setInterval(() => {
      setActivations((list) => {
        const anyTicking = list.some((a) => a.secs > 0 && a.status !== "expired");
        if (!anyTicking) return list;
        const now = Date.now();
        return list.map((a) => {
          if (a.status === "expired" || a.secs === 0) return a;
          const next: Activation = { ...a, secs: a.secs - 1 };
          if (next.secs === 0 && next.status !== "received") {
            next.status = "expired";
          }
          if (next.status === "waiting" && now - next.waitStartedAt >= AUTO_RECEIVE_SECS * 1000) {
            const code = genCode();
            next.code = code;
            next.source = smsBody(next.serviceName, code);
            next.status = "received";
          }
          return next;
        });
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const create = useCallback(
    (service: SmsService, country: CountryOption, smart: boolean) => {
      const id = newActId();
      const title = `${service.name} · ${country.country} ${country.operator}`;
      if (!freeze(id, country.price, title)) return null;
      const now = Date.now();
      setActivations((list) => [
        {
          id,
          serviceName: service.name,
          iconUrl: iconUrl(service),
          flag: country.flag,
          place: `${country.country} · ${country.operator}`,
          number: country.number,
          price: country.price,
          secs: ACTIVATION_SECS,
          code: null,
          source: null,
          status: "waiting",
          smart,
          createdAt: now,
          waitStartedAt: now,
        },
        ...list,
      ]);
      return id;
    },
    [freeze],
  );

  const resend = useCallback((id: string) => {
    setActivations((list) =>
      list.map((a) =>
        a.id === id
          ? { ...a, code: null, source: null, status: "waiting", waitStartedAt: Date.now() }
          : a,
      ),
    );
  }, []);

  // 拉回时保留 id，已结算的冻结让加收的码免费——语义同页内「再收一条」
  const reopen = useCallback((id: string): boolean => {
    const a = historyRef.current.find((x) => x.id === id);
    if (!a) return false;
    const secs = Math.floor((a.createdAt + ACTIVATION_SECS * 1000 - Date.now()) / 1000);
    if (secs <= 0) return false;
    setHistory((h) => h.filter((x) => x.id !== id));
    setActivations((list) => [
      {
        ...a,
        secs,
        code: null,
        source: null,
        status: "waiting",
        waitStartedAt: Date.now(),
        settled: a.histStatus === "received",
      },
      ...list,
    ]);
    return true;
  }, []);

  const get = useCallback((id: string) => activations.find((a) => a.id === id), [activations]);
  const active = activations.filter((a) => a.status !== "expired" || a.secs > 0);

  return (
    <ActivationsContext.Provider
      value={{ activations, active, history, get, create, resend, close, reopen }}
    >
      {children}
    </ActivationsContext.Provider>
  );
}

export function useActivations(): ActivationsApi {
  const ctx = useContext(ActivationsContext);
  if (!ctx) throw new Error("useActivations must be used within an ActivationsProvider");
  return ctx;
}

/** 盯住激活状态，验证码一到就弹 toast + 提示音。不渲染任何东西。 */
export function ActivationNotifier() {
  const { activations } = useActivations();
  const toast = useToast();
  const prev = useRef<Record<string, OrderStatus>>({});

  useEffect(() => {
    for (const a of activations) {
      const before = prev.current[a.id];
      if (a.status === "received" && before && before !== "received" && a.code) {
        toast.show(`${a.serviceName} ${spaceCode(a.code)} · 验证码已到`);
        playBeep();
      }
    }
    const map: Record<string, OrderStatus> = {};
    for (const a of activations) map[a.id] = a.status;
    prev.current = map;
  }, [activations, toast]);

  return null;
}
