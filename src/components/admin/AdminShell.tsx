"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Login page: no sidebar, no auth gate
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <div className="flex h-screen bg-deep overflow-hidden relative">
        {/* Ambient glass orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-teal/15 blur-[150px] animate-float-slow" />
          <div className="absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full bg-teal/10 blur-[120px] animate-float-reverse" />
          <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-teal-light/[0.08] blur-[100px] animate-float-slow" />
        </div>
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
