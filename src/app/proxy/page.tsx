import { SiteHeader } from "@/components/site-header";
import { MobileHeader } from "@/components/mobile-header";
import ProxyClient, { type ViewKey } from "./proxy-client";

/** 全球 IP 代理页 — HUOAD 站点骨架内嵌自建购买板块：
 *  头部沿用 SiteHeader；左侧 HUOAD 白卡侧栏六项（概览 + 四类代理 + 已购代理，对齐原站顺序）；
 *  右侧原地切视图。产品结构与 mock 数据取自 LamaProxy PRD。
 *  ?view= 深链在服务端解析，保证首屏即正确视图。
 *
 *  移动端（≤768px，样式在 proxy-mobile.css，配方同 /vcc）：桌面头部/侧栏隐藏，
 *  换 MobileHeader 黑顶条 + 底部五格 tab 栏（tab 栏在 ProxyClient 里，要调视图状态）。 */

const VALID_VIEWS: ViewKey[] = ["overview", "isp", "datacenter", "residential", "mobile", "purchased"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = typeof sp.view === "string" ? sp.view : "";
  const initialView = (VALID_VIEWS as string[]).includes(raw) ? (raw as ViewKey) : "overview";

  return (
    <>
      <div className="huoad-desktop-only">
        <SiteHeader />
      </div>
      <MobileHeader />
      <ProxyClient initialView={initialView} />
    </>
  );
}
