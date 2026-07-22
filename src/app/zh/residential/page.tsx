import type { Metadata } from "next";
import { DashboardApp } from "@/components/lama/dashboard-app";

export const metadata: Metadata = {
  title: "住宅代理 — LamaProxy",
  description: "购买住宅代理流量套餐，覆盖全球 180+ 国家，支持 HTTP / SOCKS5，加密货币支付即买即用。",
};

export default function Page() {
  return <DashboardApp initial="residential" />;
}
