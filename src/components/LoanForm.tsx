"use client";

import { useState, type FormEvent } from "react";
import { Building2, Users, Loader2, CheckCircle } from "lucide-react";

export default function LoanForm() {
  const [kind, setKind] = useState<"person" | "company">("person");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const amountOptions = ["", "5万以下", "5-10万", "10-20万", "20-50万", "50-100万", "100-300万", "300-500万", "500-1000万", "1000万以上"];

  function validate(v: string): string | null {
    if (!v.trim()) return "请输入手机号";
    if (!/^1[3-9]\d{9}$/.test(v.trim())) return "请输入正确的11位手机号";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate(phone);
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/loan-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, phone: phone.trim(), amount: amount || "未填写" }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        setPhone("");
      } else {
        setError(data.message || "提交失败，请稍后重试");
      }
    } catch {
      setError("提交失败，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
          <p className="text-sm font-medium text-emerald-800">申请已提交</p>
          <p className="text-xs text-emerald-600">客服将在1个工作日内与您联系</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <h3 className="text-base font-semibold text-slate-900">我要贷款</h3>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4 flex items-center gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              checked={kind === "company"}
              onChange={() => setKind("company")}
              className="accent-yellow-500"
            />
            <Building2 className="h-3.5 w-3.5" />
            <span className={kind === "company" ? "font-medium text-slate-900" : "text-slate-500"}>
              企业
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              checked={kind === "person"}
              onChange={() => setKind("person")}
              className="accent-yellow-500"
            />
            <Users className="h-3.5 w-3.5" />
            <span className={kind === "person" ? "font-medium text-slate-900" : "text-slate-500"}>
              个人
            </span>
          </label>
        </div>
        <div className="mb-4">
          <input
            type="tel"
            maxLength={11}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ""));
              if (error) setError("");
            }}
            placeholder="请输入手机号"
            autoComplete="tel"
            className={`h-11 w-full rounded-lg border px-3 text-sm outline-none transition-colors duration-200 ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-slate-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20"
            }`}
          />
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
        <div className="mb-4">
          <select
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20"
          >
            {amountOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt || "申请额度（可选）"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-yellow-600 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "免费申请"}
        </button>
      </form>
    </div>
  );
}
