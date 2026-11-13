import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { template: "%s · Show Lanka Admin", default: "Show Lanka Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="admin-root min-h-screen flex-1 bg-slate-50 text-slate-900">{children}</div>;
}
