"use client";

/** 激活订单卡 — 接码详情视图使用：号码、等待动画、收到的验证码与短信正文。 */

import { fmtCountdown, fmtPrice, spaceCode, type SmsOrder } from "@/lib/sms-data";
import { AlertTriangle, ArrowLeft, Bolt, Check, Clock, Copy } from "./icons";
import { BrandIcon } from "./ui";

interface Props {
  order: SmsOrder;
  onBack: () => void;
  onResend: () => void;
  onCopyNumber: () => void;
  onCopyCode: () => void;
  /** 取消等待中的订单并退款（省略则不显示按钮） */
  onCancel?: () => void;
  /** 返回按钮文案（默认 重新选择） */
  backLabel?: string;
}

export function OrderCard({
  order,
  onBack,
  onResend,
  onCopyNumber,
  onCopyCode,
  onCancel,
  backLabel = "重新选择",
}: Props) {
  const received = order.status === "received";

  return (
    <div className="order-wrap">
      <button className="btn-back" onClick={onBack}>
        <ArrowLeft />
        {backLabel}
      </button>

      <div className="panel">
        <div className="order-head">
          <BrandIcon url={order.iconUrl} name={order.serviceName} size={21} tile={40} radius={11} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span className="order-head__name">{order.serviceName}</span>
            <span className="order-head__sub">
              {order.flag} {order.place}
            </span>
          </span>
          {order.smart && (
            <span className="smart-badge">
              <Bolt size={12} strokeWidth={2.2} />
              智能路由
            </span>
          )}
          <span className="order-timer">
            <span style={{ color: "var(--ink-3)", display: "inline-flex" }}>
              <Clock />
            </span>
            {fmtCountdown(order.secs)}
          </span>
        </div>

        <div className="order-body">
          <div className="order-label">号码</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="order-number">{order.number}</span>
            <button className="icon-btn" onClick={onCopyNumber} aria-label="复制号码">
              <Copy />
            </button>
          </div>

          <div className="order-divider">
            {order.status === "waiting" && (
              <div className="waiting-row">
                <span className="spinner" />
                <span style={{ fontFamily: "var(--ff-disp)", fontWeight: 600, fontSize: 15 }}>
                  等待短信中
                </span>
                <span className="blink-dots">
                  <span />
                  <span style={{ animationDelay: ".2s" }} />
                  <span style={{ animationDelay: ".4s" }} />
                </span>
              </div>
            )}

            {received && order.code && (
              <>
                <div className="order-label" style={{ marginBottom: 10 }}>
                  验证码
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span className="code-display">{spaceCode(order.code)}</span>
                  <button className="btn-copy" onClick={onCopyCode}>
                    <Copy size={14} />
                    复制
                  </button>
                  <span className="received-tag">
                    <Check />
                    已接收
                  </span>
                </div>
                {order.source && <div className="sms-box">{order.source}</div>}
              </>
            )}

            {order.status === "expired" && (
              <div className="expired-row">
                <AlertTriangle />
                超时未收到，费用已自动退回余额
              </div>
            )}
          </div>
        </div>

        <div className="order-foot">
          {received && (
            <button className="btn-outline" onClick={onResend}>
              再收一条
            </button>
          )}
          {order.status === "waiting" && onCancel && (
            <button className="btn-outline" onClick={onCancel}>
              取消并退款
            </button>
          )}
          <span className="order-note">
            {received || order.settled ? (
              <>已扣费 {fmtPrice(order.price)} · 时效内可免费再收</>
            ) : (
              <>已冻结 {fmtPrice(order.price)} · 收到码才扣费 · 20 分钟未收到自动退款</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
