"use client";

/** 接码详情视图 — 左侧进行中列表，右侧订单卡（等待 / 收码 / 超时），
 *  支持取消退款与时效内「再收一条」。原型的 /activation/:id 路由改为壳内视图。 */

import { ACTIVATION_SECS, fmtCountdown, type Activation, type OrderStatus } from "@/lib/sms-data";
import { OrderCard } from "../order-card";
import { useActivations } from "../state";
import { BrandIcon, useToast } from "../ui";
import type { SmsView } from "./nav";

const STATUS_STYLE: Record<OrderStatus, { label: string; color: string }> = {
  waiting: { label: "接码中", color: "var(--rate-mid)" },
  received: { label: "已收码", color: "var(--rate-good)" },
  expired: { label: "已超时", color: "var(--rate-bad)" },
};

export function ActivationView({
  id,
  go,
}: {
  id: string;
  go: (view: SmsView, actId?: string) => void;
}) {
  const toast = useToast();
  const { active, history, get, resend, reopen, close } = useActivations();

  const live = get(id);
  // 收码即退场到历史；号码仍在时效内时继续在这里展示，保住「再收一条」
  const closed = history.find((a) => a.id === id);
  // 号码是否仍在 20 分钟时效内（决定还能否再收一条）。一次性判断，渲染期读一次时钟即可。
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const reopenable =
    !!closed && closed.histStatus === "received" && closed.createdAt + ACTIVATION_SECS * 1000 > now;
  const refunded = closed?.histStatus === "refunded";
  const current = live ?? (reopenable ? closed : undefined);

  function copy(text: string, label: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    toast.show(label);
  }

  // 再收一条：还活着就原地重置，否则从历史拉回
  function receiveAnother() {
    if (live) resend(id);
    else if (!reopen(id)) toast.show("号码已释放，无法再收", "error");
  }

  return (
    <div className="activation-grid">
      <aside>
        <div className="act-rail">
          <div className="act-rail__head">
            进行中
            <span className="act-rail__count">{active.length}</span>
          </div>
          {active.length === 0 && (
            <div style={{ padding: "18px 16px", fontSize: 13, color: "var(--ink-3)" }}>
              暂无进行中的号码
            </div>
          )}
          {active.map((a: Activation) => {
            const st = STATUS_STYLE[a.status];
            return (
              <button
                key={a.id}
                className={"act-item" + (a.id === id ? " on" : "")}
                onClick={() => go("activation", a.id)}
              >
                <BrandIcon url={a.iconUrl} name={a.serviceName} size={20} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="act-item__name">{a.serviceName}</span>
                  <span className="act-item__place">
                    {a.flag} {a.place}
                  </span>
                </span>
                <span className="act-item__status" style={{ color: st.color }}>
                  <span className="act-item__dot" />
                  {a.status === "received" ? st.label : fmtCountdown(a.secs)}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <main style={{ minWidth: 0 }}>
        {current ? (
          <OrderCard
            order={current}
            backLabel="返回购买台"
            onBack={() => go("buy")}
            onResend={receiveAnother}
            onCancel={
              live && live.status === "waiting" && !live.settled
                ? () => {
                    close(id);
                    toast.show("已取消，冻结金额已退回余额");
                  }
                : undefined
            }
            onCopyNumber={() => copy(current.number, "号码已复制")}
            onCopyCode={() => current.code && copy(current.code, "验证码已复制")}
          />
        ) : (
          <div className="act-empty">
            <div className="act-empty__title">
              {reopenable ? "该订单已完成" : refunded ? "订单已退款" : "激活不存在或已结束"}
            </div>
            <div className="act-empty__sub">
              {reopenable
                ? "号码仍在时效内，可以在原号码上再收一条验证码。"
                : refunded
                  ? closed?.status === "expired"
                    ? "超时未收到验证码，冻结金额已自动退回余额。"
                    : "订单已取消，冻结金额已退回余额。"
                  : "该号码可能已完成、退款或超时释放。"}
            </div>
            <div style={{ display: "inline-flex", gap: 10 }}>
              {reopenable && (
                <button
                  className="btn-primary"
                  style={{ display: "inline-flex", padding: "12px 20px", cursor: "pointer" }}
                  onClick={() => {
                    if (!reopen(id)) toast.show("号码已释放，无法再收", "error");
                  }}
                >
                  再收一条
                </button>
              )}
              <a
                onClick={() => go("buy")}
                className={reopenable ? "btn-outline" : "btn-primary"}
                style={{ display: "inline-flex", padding: "12px 20px", cursor: "pointer" }}
              >
                返回购买台
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
