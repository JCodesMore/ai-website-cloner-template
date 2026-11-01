/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/sites/showlanka/images/logo.png" alt="Show Lanka Tours" className="h-14 w-auto" />
          <h1 className="mt-5 text-xl font-semibold tracking-tight">Admin panel</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage tours, news and enquiries.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm next={typeof next === "string" ? next : ""} />
        </div>
      </div>
    </main>
  );
}
