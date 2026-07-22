"use client";

/** 短信接码 — 客户端交互壳（配方同 /proxy）。
 *  六视图原地切换（?view= 深链 + replaceState 保持，buy 为默认不带参）；
 *  纯前端演示：钱包 / 订单为会话内状态，刷新即重置。
 *  业务组件与数据取自 Numo 接码平台原型（src/components/sms/*）。
 *
 *  移动端（≤768px，样式在 sms-mobile.css，配方同 /vcc、/proxy）：
 *  桌面头部/侧栏隐藏，换 MobileHeader 黑顶条 + 底部五格 tab 栏；
 *  「我的」登录页未做，点击弹 toast 不跳转。 */

import { useState, type ReactNode } from "react";
import { BuyNavIcon, MeNavIcon, OrdersNavIcon } from "@/components/sms/icons";
import { ActivationNotifier, ActivationsProvider, WalletProvider } from "@/components/sms/state";
import { ToastProvider, useToast } from "@/components/sms/ui";
import { ActivationView } from "@/components/sms/views/activation";
import { BuyView } from "@/components/sms/views/buy";
import type { SmsView } from "@/components/sms/views/nav";
import { OrdersView } from "@/components/sms/views/orders";

const NAV: { key: SmsView; label: string; icon: ReactNode }[] = [
  { key: "buy", label: "购买号码", icon: <BuyNavIcon /> },
  { key: "orders", label: "我的订单", icon: <OrdersNavIcon /> },
];

/** 侧栏高亮映射：接码详情不在侧栏里，归到「我的订单」 */
const navKeyOf = (v: SmsView): SmsView => (v === "activation" ? "orders" : v);

function Shell({ initialView }: { initialView: SmsView }) {
  const [view, setView] = useState<SmsView>(initialView);
  const [actId, setActId] = useState<string | null>(null);
  const toast = useToast();

  const go = (v: SmsView, id?: string) => {
    setActId(id ?? null);
    setView(v);
    window.history.replaceState(null, "", v === "buy" ? "/sms" : `/sms?view=${v}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="sms-page">
      <div className="sms-inner">
        <aside className="sms-side">
          <nav>
            {NAV.map((item) => (
              <a
                key={item.key}
                className={navKeyOf(view) === item.key ? "on" : undefined}
                onClick={() => go(item.key)}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <section className="sms-content">
          {view === "buy" && <BuyView go={go} />}
          {view === "activation" && <ActivationView id={actId ?? ""} go={go} />}
          {view === "orders" && <OrdersView go={go} />}
        </section>
      </div>

      {/* 移动端底部 tab 栏（≤768px 显示）：两视图直切；
          「我的」登录页未做，点击弹 toast 不跳转 */}
      <nav className="sms-mtab" aria-label="移动端导航">
        <a className={navKeyOf(view) === "buy" ? "on" : undefined} onClick={() => go("buy")}>
          <BuyNavIcon />
          购买号码
        </a>
        <a className={navKeyOf(view) === "orders" ? "on" : undefined} onClick={() => go("orders")}>
          <OrdersNavIcon />
          我的订单
        </a>
        <a onClick={() => toast.show("个人中心即将上线，敬请期待", "error")}>
          <MeNavIcon />
          我的
        </a>
      </nav>
    </div>
  );
}

export default function SmsClient({ initialView }: { initialView: SmsView }) {
  return (
    /* sms-scope 挂设计令牌：toast 渲染在 ToastProvider 尾部（.sms-page 外），
       也要吃到同一套变量 */
    <div className="sms-scope">
      <ToastProvider>
        <WalletProvider>
          <ActivationsProvider>
            <ActivationNotifier />
            <Shell initialView={initialView} />
          </ActivationsProvider>
        </WalletProvider>
      </ToastProvider>
    </div>
  );
}
