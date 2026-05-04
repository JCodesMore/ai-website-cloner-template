"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/firebase/auth";
import { sanitizeEmail, sanitizeText, isRateLimited } from "@/lib/sanitize";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isRateLimited("admin-login", 60000, 5)) {
      setError("Too many attempts. Wait a minute.");
      return;
    }

    const cleanEmail = sanitizeEmail(email);
    if (!cleanEmail) {
      setError("Invalid email");
      return;
    }

    setLoading(true);
    try {
      await signIn(cleanEmail, password);
      router.push("/admin");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-display text-warm-white text-4xl tracking-wider">BAJABLUE</h1>
          <p className="text-warm-white/30 text-xs font-body tracking-[0.3em] uppercase mt-2">Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-deep-light border border-teal/20 focus:border-teal text-warm-white py-3 px-4 text-sm font-body outline-none transition-colors rounded-sm"
            />
          </div>

          <div>
            <label className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-deep-light border border-teal/20 focus:border-teal text-warm-white py-3 px-4 text-sm font-body outline-none transition-colors rounded-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-body">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral hover:bg-coral-light text-deep py-3.5 font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300 disabled:opacity-50 rounded-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
