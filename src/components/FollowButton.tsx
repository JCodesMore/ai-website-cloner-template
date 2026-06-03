"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";

interface Props {
  productId?: string;
  institutionId?: string;
}

export default function FollowButton({ productId, institutionId }: Props) {
  const type = institutionId ? "institution" : "product";
  const id = institutionId || productId || "";
  const apiPath = institutionId
    ? `/api/institutions/${institutionId}/follow`
    : `/api/products/${productId}/follow`;

  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(apiPath)
      .then((r) => r.json())
      .then((d) => setFollowing(d.following))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiPath, id]);

  async function toggle() {
    setActing(true);
    try {
      const method = following ? "DELETE" : "POST";
      const res = await fetch(apiPath, { method });
      const d = await res.json();
      if (d.error && d.error.includes("登录")) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      setFollowing(d.following);
    } catch {
      // ignore
    } finally {
      setActing(false);
    }
  }

  if (loading) return <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100" />;

  const label = type === "institution"
    ? (following ? "已关注" : "关注机构")
    : (following ? "已关注" : "关注产品");

  return (
    <button
      onClick={toggle}
      disabled={acting}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-60 ${
        following
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
      }`}
    >
      {acting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${following ? "fill-emerald-500 text-emerald-500" : ""}`} />
      )}
      {label}
    </button>
  );
}
