import type { Metadata } from "next";
import { DashboardApp } from "@/components/lama/dashboard-app";

export const metadata: Metadata = {
  title: "移动代理 — LamaProxy",
  description: "购买移动代理流量套餐，运营商级 4G/5G 出口，信誉度高，适合高风控场景。",
};

export default function Page() {
  return <DashboardApp initial="mobile" />;
}
