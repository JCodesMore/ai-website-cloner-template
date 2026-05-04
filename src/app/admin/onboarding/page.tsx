"use client";

import { useEffect, useState } from "react";
import { onboardingSteps, totalSteps } from "@/data/onboarding";

type StepData = { data: Record<string, unknown>; completed: boolean; updatedAt?: string };

export default function AdminOnboardingPage() {
  const [steps, setSteps] = useState<Record<string, StepData>>({});
  const [token, setToken] = useState("bajablue-team-2026");
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  async function loadSteps() {
    setLoading(true);
    try {
      const res = await fetch(`/api/onboarding?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (data.ok) setSteps(data.steps ?? {});
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSteps();
    const i = setInterval(loadSteps, 8000); // poll every 8s
    return () => clearInterval(i);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const completedCount = Object.values(steps).filter((s) => s.completed).length;
  const percent = Math.round((completedCount / totalSteps) * 100);

  async function reset() {
    if (!confirm("Delete ALL onboarding data? This cannot be undone.")) return;
    setResetting(true);
    try {
      await fetch("/api/onboarding/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      await loadSteps();
    } finally {
      setResetting(false);
    }
  }

  const wizardUrl = typeof window !== "undefined"
    ? `${window.location.origin}/onboarding/${token}`
    : `/onboarding/${token}`;

  return (
    <div className="min-h-screen bg-deep text-warm-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline justify-between mb-1">
          <p className="text-teal-light text-[10px] font-body tracking-[0.4em] uppercase">
            Admin · Onboarding tracker
          </p>
          <p className="text-warm-white/45 text-xs font-body tabular-nums">
            {completedCount} / {totalSteps} done · {percent}%
          </p>
        </div>
        <h1 className="text-display text-warm-white text-3xl md:text-4xl tracking-wide mb-6">
          Bajablue Access Setup
        </h1>

        {/* Progress bar */}
        <div className="h-2 bg-warm-white/10 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-teal-light transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Wizard URL + actions */}
        <div className="bg-white/[0.04] border border-teal/15 rounded-sm p-4 mb-8">
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">
            Onboarding link to share with the Bajablue team
          </p>
          <div className="flex flex-col md:flex-row gap-2 mb-3">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1 bg-deep border border-teal/30 focus:border-teal-light rounded-sm px-3 py-2 text-sm font-body text-warm-white outline-none"
              placeholder="onboarding token"
            />
            <button
              onClick={loadSteps}
              className="bg-white/[0.06] border border-warm-white/15 text-warm-white px-4 py-2 rounded-sm text-xs font-body tracking-[0.2em] uppercase hover:bg-white/[0.10]"
            >
              Refresh
            </button>
          </div>
          <code className="block text-xs font-mono text-teal-light bg-deep border border-teal/30 rounded-sm px-3 py-2 break-all mb-3">
            {wizardUrl}
          </code>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(wizardUrl)}
              className="bg-teal-light text-deep px-4 py-2 rounded-sm text-xs font-body font-medium tracking-[0.2em] uppercase hover:opacity-90"
            >
              Copy link
            </button>
            <button
              onClick={() => window.open(wizardUrl, "_blank")}
              className="bg-white/[0.06] border border-warm-white/15 text-warm-white px-4 py-2 rounded-sm text-xs font-body tracking-[0.2em] uppercase hover:bg-white/[0.10]"
            >
              Open as client
            </button>
            <button
              onClick={reset}
              disabled={resetting}
              className="bg-coral/20 border border-coral text-coral px-4 py-2 rounded-sm text-xs font-body tracking-[0.2em] uppercase hover:bg-coral/30 disabled:opacity-50 ml-auto"
            >
              {resetting ? "Resetting..." : "Reset all data"}
            </button>
          </div>
        </div>

        {/* Steps */}
        {loading && Object.keys(steps).length === 0 ? (
          <p className="text-warm-white/40 text-sm font-body">Loading...</p>
        ) : (
          <div className="space-y-3">
            {onboardingSteps.map((step) => {
              const status = steps[step.id];
              const done = status?.completed ?? false;
              const hasData = status && Object.keys(status.data ?? {}).length > 0;

              return (
                <div
                  key={step.id}
                  className={`bg-white/[0.04] border rounded-sm p-4 transition-colors ${
                    done ? "border-teal-light/40" : "border-warm-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-body tabular-nums ${
                          done
                            ? "bg-teal-light text-deep"
                            : hasData
                            ? "bg-copper/30 text-copper border border-copper/40"
                            : "bg-warm-white/10 text-warm-white/40 border border-warm-white/20"
                        }`}
                      >
                        {done ? "✓" : step.num}
                      </span>
                      <div>
                        <p className="text-warm-white text-sm font-body font-medium">
                          {step.title}
                        </p>
                        <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase">
                          {step.tier}
                          {status?.updatedAt && ` · updated ${new Date(status.updatedAt).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-body tracking-[0.2em] uppercase px-3 py-1 rounded-full ${
                        done
                          ? "bg-teal-light/15 text-teal-light"
                          : hasData
                          ? "bg-copper/15 text-copper"
                          : "bg-warm-white/5 text-warm-white/30"
                      }`}
                    >
                      {done ? "Done" : hasData ? "In progress" : "Pending"}
                    </span>
                  </div>

                  {hasData && (
                    <div className="mt-3 pt-3 border-t border-warm-white/5 grid gap-2">
                      {Object.entries(status.data).map(([k, v]) => (
                        <div key={k} className="flex gap-3 text-xs">
                          <span className="text-warm-white/45 font-body min-w-[140px]">{k}</span>
                          <span className="text-warm-white/85 font-body break-all">
                            {typeof v === "boolean" ? (v ? "✓ yes" : "✗ no") : String(v) || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
