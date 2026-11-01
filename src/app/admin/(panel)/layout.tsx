import type { ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { statusCounts } from "@/lib/server/enquiries";
import { requireAdmin } from "@/lib/server/session";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return (
    <>
      <Sidebar newEnquiries={statusCounts().new ?? 0} />
      <main className="px-4 py-6 sm:px-6 lg:ml-60 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </>
  );
}
