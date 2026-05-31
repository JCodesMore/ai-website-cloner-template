"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";

export default function FollowButton({ productId }: { productId: string }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${productId}/follow`)
      .then((r) => r.json())
      .then((d) => setFollowing(d.following))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  async function toggle() {
    setActing(true);
    try {
      const method = following ? "DELETE" : "POST";
      const res = await fetch(`/api/products/${productId}/follow`, { method });
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

  return (
    <button
      onClick={toggle}
      disabled={acting}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-60 ${
        following
          ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700"
      }`}
    >
      {acting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${following ? "fill-amber-500 text-amber-500" : ""}`} />
      )}
      {following ? "已关注" : "关注产品"}
    </button>
  );
}
