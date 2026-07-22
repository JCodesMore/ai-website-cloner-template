import { SiteHeader } from "@/components/site-header";
import { MobileHeader } from "@/components/mobile-header";
import { SMS_VIEWS, type SmsView } from "@/components/sms/views/nav";
import SmsClient from "./sms-client";

/** 短信接码页 — HUOAD 站点骨架内嵌 Numo 接码平台：
 *  头部沿用 SiteHeader；左侧 HUOAD 白卡侧栏五项（购买 / 订单 / 钱包 / API / 规则）；
 *  右侧原地切视图。产品结构与 mock 数据取自接码平台原型（~/Desktop/接码平台）。
 *  ?view= 深链在服务端解析，保证首屏即正确视图。
 *
 *  移动端（≤768px，样式在 sms-mobile.css，配方同 /vcc、/proxy）：桌面头部/侧栏隐藏，
 *  换 MobileHeader 黑顶条 + 底部五格 tab 栏（tab 栏在 SmsClient 里，要调视图状态）。 */

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = typeof sp.view === "string" ? sp.view : "";
  const initialView = (SMS_VIEWS as string[]).includes(raw) ? (raw as SmsView) : "buy";

  return (
    <>
      <div className="huoad-desktop-only">
        <SiteHeader />
      </div>
      <MobileHeader />
      <SmsClient initialView={initialView} />
    </>
  );
}
