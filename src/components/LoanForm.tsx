"use client";

import { useState, useEffect, useMemo, type FormEvent } from "react";
import { Building2, Users, Loader2, CheckCircle, MapPin, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

const AMOUNT_OPTIONS = ["", "5万以下", "5-10万", "10-20万", "20-50万", "50-100万", "100-300万", "300-500万", "500-1000万", "1000万以上"];
const PURPOSE_OPTIONS = ["", "经营周转", "购房装修", "购车", "教育", "医疗", "旅游", "日常消费", "其他"];

interface MatchProduct { id: number; name: string; institution: string; maxAmount: string; rate: string; href: string; }

export default function LoanForm() {
  const [kind, setKind] = useState<"person" | "company">("person");
  const [topProducts, setTopProducts] = useState<MatchProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [city, setCity] = useState("");
  const [cityDetecting, setCityDetecting] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // CAPTCHA
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const genCaptcha = () => {
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput("");
    setCaptchaError(false);
  };

  useEffect(() => { genCaptcha(); }, []);

  // Fetch top products for matching
  useEffect(() => {
    fetch("/api/products/top")
      .then(r => r.json())
      .then(d => { if (d.products) setTopProducts(d.products); })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => {
        if (d.city) {
          const label = d.region ? `${d.city}（${d.region}）` : d.city;
          setCity(label);
        }
      })
      .catch(() => {})
      .finally(() => setCityDetecting(false));
  }, []);

  // Match products based on loan type and amount
  const matchedProducts = useMemo(() => {
    const cat = kind === "company" ? "company" : "person";
    let matches = topProducts.filter(p => {
      const instLower = p.institution.toLowerCase();
      // Filter by plausible category match
      if (cat === "company" && (instLower.includes("银行") || instLower.includes("农商"))) return true;
      if (cat === "person" && instLower.length > 0) return true;
      return false;
    });
    // Sort by relevance: prefer products with amounts in the selected range
    if (amount) {
      const idx = AMOUNT_OPTIONS.indexOf(amount);
      matches.sort((a, b) => {
        const aIdx = AMOUNT_OPTIONS.findIndex(o => a.maxAmount.includes(o.replace("以下","").replace("以上","").split("-")[0]));
        const bIdx = AMOUNT_OPTIONS.findIndex(o => b.maxAmount.includes(o.replace("以下","").replace("以上","").split("-")[0]));
        return Math.abs(aIdx - idx) - Math.abs(bIdx - idx);
      });
    }
    return matches.slice(0, 3);
  }, [kind, amount, topProducts]);

  function validate(v: string): string | null {
    if (!v.trim()) return "请输入手机号";
    if (!/^1[3-9]\d{9}$/.test(v.trim())) return "请输入正确的11位手机号";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate(phone);
    if (err) { setError(err); return; }
    if (!agreed) { setError("请阅读并同意隐私政策"); return; }
    // Verify CAPTCHA
    const answer = captchaA + captchaB;
    if (parseInt(captchaInput) !== answer) {
      setCaptchaError(true);
      setError("验证码错误，请重新计算");
      genCaptcha();
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/loan-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: kind, phone: phone.trim(), amount: amount || "未填写",
          name: name.trim() || undefined, purpose: purpose || undefined, city: city || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
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
      <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 ring-4 ring-emerald-50">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">提交成功</p>
            <p className="text-sm text-slate-500">客户经理稍后与您联系</p>
          </div>
        </div>

        <div className="space-y-3 rounded-lg bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">1</span>
            <div>
              <p className="text-sm font-medium text-slate-800">等待联系</p>
              <p className="text-xs text-slate-500">客户经理将在1个工作日内拨打您的手机，请注意接听</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500">2</span>
            <div>
              <p className="text-sm font-medium text-slate-800">沟通需求</p>
              <p className="text-xs text-slate-500">说明您的贷款需求，客户经理为您匹配最合适的产品</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500">3</span>
            <div>
              <p className="text-sm font-medium text-slate-800">完成申请</p>
              <p className="text-xs text-slate-500">在客户经理指导下完成正式贷款申请</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          如有疑问，可拨打 <a href="tel:18584835676" className="font-medium text-emerald-600 hover:underline">18584835676</a>
        </p>
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
            <input type="radio" checked={kind === "company"} onChange={() => setKind("company")} className="accent-emerald-500" />
            <Building2 className="h-3.5 w-3.5" />
            <span className={kind === "company" ? "font-medium text-slate-900" : "text-slate-500"}>企业</span>
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input type="radio" checked={kind === "person"} onChange={() => setKind("person")} className="accent-emerald-500" />
            <Users className="h-3.5 w-3.5" />
            <span className={kind === "person" ? "font-medium text-slate-900" : "text-slate-500"}>个人</span>
          </label>
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-slate-500">称呼</label>
          <input type="text" maxLength={20} value={name} onChange={(e) => setName(e.target.value)}
            placeholder="选填" autoComplete="name"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-slate-700">手机号码 <span className="text-red-400">*</span></label>
          <input type="tel" maxLength={11} value={phone}
            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); if (error) setError(""); }}
            placeholder="请输入11位手机号" autoComplete="tel"
            className={`h-11 w-full rounded-lg border px-3 text-sm outline-none transition-colors duration-200 ${error ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"}`}
          />
        </div>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">期望金额</label>
            <select value={amount} onChange={(e) => setAmount(e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            >
              {AMOUNT_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt || "选填"}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">贷款用途</label>
            <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            >
              {PURPOSE_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt || "选填"}</option>))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-slate-500">所在城市</label>
          <div className="relative">
            <input type="text" maxLength={20} value={city} onChange={(e) => setCity(e.target.value)}
              placeholder={cityDetecting ? "正在定位..." : "自动获取，可修改"}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
            <MapPin className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        <label className="mb-3 flex cursor-pointer items-start gap-2 text-xs text-slate-500">
          <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); if (error) setError(""); }} className="mt-0.5 accent-emerald-500" />
          <span>我已阅读并同意<a href="/pages/privacy" target="_blank" className="text-emerald-600 hover:underline">《隐私政策》</a></span>
        </label>

        {/* CAPTCHA */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="shrink-0 text-sm text-slate-600">{captchaA} + {captchaB} =</span>
            <input type="number" value={captchaInput}
              onChange={(e) => { setCaptchaInput(e.target.value); setCaptchaError(false); }}
              placeholder="?"
              className={`h-9 w-16 rounded-lg border px-2 text-center text-sm outline-none transition-colors duration-200 ${captchaError ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-emerald-600"}`}
            />
            <button type="button" onClick={genCaptcha} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              换一题
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="mb-4 flex h-11 w-full items-center justify-center rounded-lg bg-emerald-600 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "免费申请"}
        </button>
      </form>

      {/* Matching products */}
      {productsLoading ? (
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            正在匹配产品...
          </div>
        </div>
      ) : matchedProducts.length > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-medium text-slate-500">推荐产品</p>
          <div className="space-y-2">
            {matchedProducts.map((p) => (
              <Link key={p.id} href={p.href}
                className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800 group-hover:text-emerald-700">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.institution} · {p.maxAmount} · {p.rate}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-emerald-500" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
