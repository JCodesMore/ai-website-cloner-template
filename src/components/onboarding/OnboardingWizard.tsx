"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onboardingSteps, totalSteps, type OnboardingStep } from "@/data/onboarding";

type StepValues = Record<string, string | boolean>;
type AllProgress = Record<string, { data: StepValues; completed: boolean }>;

const TIER_COLORS = {
  Critical: "bg-coral text-deep",
  High: "bg-copper/90 text-white",
  Medium: "bg-teal text-white",
} as const;

export function OnboardingWizard({ token }: { token: string }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState<AllProgress>({});
  const [saving, setSaving] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = onboardingSteps[stepIdx];

  // Hydrate from server on mount
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/onboarding?token=${encodeURIComponent(token)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.steps) return;
        // shape: { stepId: { data, completed } }
        const next: AllProgress = {};
        Object.entries(data.steps).forEach(([id, raw]) => {
          const v = raw as { data?: StepValues; completed?: boolean };
          next[id] = { data: v.data ?? {}, completed: v.completed ?? false };
        });
        setProgress(next);
        // Jump to first incomplete step
        const firstIncomplete = onboardingSteps.findIndex(
          (s) => !next[s.id]?.completed
        );
        if (firstIncomplete >= 0) {
          setStepIdx(firstIncomplete);
          setShowIntro(false);
        } else {
          setCompleted(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token]);

  const completedCount = useMemo(
    () => Object.values(progress).filter((p) => p.completed).length,
    [progress]
  );
  const percent = Math.round((completedCount / totalSteps) * 100);

  function updateField(stepId: string, fieldId: string, value: string | boolean) {
    setProgress((p) => ({
      ...p,
      [stepId]: {
        data: { ...(p[stepId]?.data ?? {}), [fieldId]: value },
        completed: p[stepId]?.completed ?? false,
      },
    }));
  }

  function vibrate(ms = 12) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  }

  async function saveStep(stepId: string, payload: StepValues, completedFlag: boolean) {
    setSaving(true);
    setError(null);
    // Strip secret-typed fields before sending
    const stepDef = onboardingSteps.find((s) => s.id === stepId);
    const safeData: StepValues = {};
    Object.entries(payload).forEach(([k, v]) => {
      const fieldDef = stepDef?.fields.find((f) => f.id === k);
      if (fieldDef?.type === "secret") {
        // Replace value with sentinel — never store actual secrets
        safeData[k] = v ? "[sent via 1Password]" : "";
      } else {
        safeData[k] = v;
      }
    });

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          stepId,
          data: safeData,
          completed: completedFlag,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Save failed");
      }
      setProgress((p) => ({
        ...p,
        [stepId]: { data: payload, completed: completedFlag },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    if (saving) return;
    vibrate(15);
    const values = progress[step.id]?.data ?? {};
    await saveStep(step.id, values, true);
    if (stepIdx < totalSteps - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      setCompleted(true);
    }
  }

  async function handleSkip() {
    vibrate(8);
    const values = progress[step.id]?.data ?? {};
    await saveStep(step.id, values, false);
    if (stepIdx < totalSteps - 1) setStepIdx(stepIdx + 1);
  }

  function handleBack() {
    vibrate(8);
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  }

  // ─── Completion screen ───
  if (completed) {
    return (
      <div className="min-h-screen bg-deep text-warm-white">
        <div className="max-w-md mx-auto px-5 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-teal-light/20 border border-teal-light flex items-center justify-center"
          >
            <svg
              className="w-10 h-10 text-teal-light"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <p className="text-teal-light text-[10px] font-body tracking-[0.35em] uppercase mb-3">
            All done
          </p>
          <h1 className="text-display text-warm-white text-3xl tracking-wide leading-tight mb-4">
            Onboarding complete
          </h1>
          <p className="text-warm-white/65 text-sm font-body leading-relaxed mb-8">
            Nico has been notified. He&apos;ll wire up your access and run a $1 USD test booking
            within 24 hours. You&apos;ll get a confirmation when everything is live.
          </p>
          <button
            onClick={() => {
              setCompleted(false);
              setStepIdx(0);
              setShowIntro(true);
            }}
            className="text-teal-light text-xs font-body tracking-[0.25em] uppercase border border-teal-light/30 px-5 py-3 rounded-full active:scale-95 transition-transform"
          >
            Review answers
          </button>
        </div>
      </div>
    );
  }

  // ─── Intro screen ───
  if (showIntro) {
    return (
      <div className="min-h-screen bg-deep text-warm-white">
        <div className="max-w-md mx-auto px-5 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-teal-light text-[10px] font-body tracking-[0.35em] uppercase mb-3">
              Bajablue × Athena Studios
            </p>
            <h1 className="text-display text-warm-white text-4xl tracking-wide leading-tight mb-4">
              Welcome,<br />Bajablue team
            </h1>
            <p className="text-warm-white/70 text-base font-body leading-relaxed mb-8">
              This is your phase 2 onboarding. We&apos;ll walk through {totalSteps} accounts you
              need to set up so we can run Bajablue&apos;s booking system, ads, and
              automation. Each step takes 3–10 minutes.
            </p>

            <div className="space-y-3 mb-8">
              <Highlight
                kicker="Time"
                title="About 75 minutes total"
                detail="Spread across one or two sittings. Stripe verification waits 1–2 days."
              />
              <Highlight
                kicker="What we collect"
                title="Account confirmations + URLs"
                detail="No passwords. Sensitive tokens go through 1Password — never this form."
              />
              <Highlight
                kicker="When you're done"
                title="Nico runs a test booking"
                detail="$1 USD on Ocean Safari to confirm the entire pipeline is live."
              />
            </div>

            <button
              onClick={() => {
                vibrate(15);
                setShowIntro(false);
              }}
              className="w-full bg-teal-light text-deep py-4 rounded-sm font-body text-xs font-medium tracking-[0.25em] uppercase active:scale-[0.99] transition-transform"
            >
              Start onboarding →
            </button>

            <p className="text-warm-white/40 text-[11px] font-body text-center mt-4">
              Bookmark this page — you can come back anytime to finish.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Step screen ───
  return (
    <div className="min-h-screen bg-deep text-warm-white flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-20 bg-deep/95 backdrop-blur-md border-b border-warm-white/5">
        <div className="max-w-md mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-warm-white/55 text-[10px] font-body tracking-[0.25em] uppercase">
              Step {stepIdx + 1} of {totalSteps}
            </p>
            <p className="text-teal-light text-[10px] font-body tabular-nums">
              {percent}% complete
            </p>
          </div>
          <div className="h-1 bg-warm-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-teal-light"
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-md mx-auto w-full px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <StepView
              step={step}
              values={progress[step.id]?.data ?? {}}
              onChange={(fieldId, v) => updateField(step.id, fieldId, v)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action bar */}
      <div className="sticky bottom-0 bg-deep/95 backdrop-blur-md border-t border-warm-white/5">
        <div className="max-w-md mx-auto px-5 py-4 space-y-2">
          {error && (
            <p className="text-coral text-xs font-body text-center bg-coral/10 border border-coral/30 rounded-sm py-2 px-3">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            {stepIdx > 0 && (
              <button
                onClick={handleBack}
                className="flex-shrink-0 w-12 h-12 rounded-sm bg-white/[0.06] border border-warm-white/15 flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Previous step"
              >
                <svg
                  className="w-4 h-4 text-warm-white/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={saving}
              className="flex-1 bg-teal-light text-deep py-3.5 rounded-sm font-body text-xs font-medium tracking-[0.25em] uppercase active:scale-[0.99] transition-transform disabled:opacity-50"
            >
              {saving ? "Saving..." : stepIdx === totalSteps - 1 ? "Finish →" : "Save & continue →"}
            </button>
          </div>
          <button
            onClick={handleSkip}
            disabled={saving}
            className="w-full text-warm-white/45 text-[11px] font-body tracking-[0.2em] uppercase py-2 active:text-warm-white/70 transition-colors disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  Step view
// ─────────────────────────────────────────────────────

function StepView({
  step,
  values,
  onChange,
}: {
  step: OnboardingStep;
  values: StepValues;
  onChange: (fieldId: string, v: string | boolean) => void;
}) {
  return (
    <div>
      <span
        className={`inline-block px-3 py-1 rounded-full text-[9px] font-body tracking-[0.25em] uppercase mb-4 ${
          TIER_COLORS[step.tier]
        }`}
      >
        {step.tier}
      </span>

      <h2 className="text-display text-warm-white text-2xl tracking-wide leading-tight mb-3">
        {step.title}
      </h2>

      <div className="bg-white/[0.04] border border-teal/20 rounded-sm p-4 mb-5">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">
          Why this matters
        </p>
        <p className="text-warm-white/75 text-sm font-body leading-relaxed">{step.why}</p>
      </div>

      <div className="mb-5">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-3">
          How to do it
        </p>
        <ol className="space-y-2 text-sm font-body">
          {step.how.map((line, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-light/15 border border-teal-light/40 text-teal-light text-[10px] flex items-center justify-center mt-0.5 tabular-nums">
                {i + 1}
              </span>
              <span className="text-warm-white/70 leading-relaxed">{line}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-warm-white/40 text-[11px] font-body mb-5">
        Estimated time: {step.estTime}
      </p>

      <div className="space-y-4">
        {step.fields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={(v) => onChange(field.id, v)}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  Field input renderer
// ─────────────────────────────────────────────────────

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: OnboardingStep["fields"][number];
  value: string | boolean | undefined;
  onChange: (v: string | boolean) => void;
}) {
  if (field.type === "confirm") {
    const checked = !!value;
    return (
      <button
        onClick={() => onChange(!checked)}
        className={`w-full flex items-start gap-3 p-4 rounded-sm border text-left transition-all ${
          checked
            ? "bg-teal-light/10 border-teal-light"
            : "bg-white/[0.03] border-warm-white/15"
        }`}
      >
        <span
          className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center mt-0.5 transition-all ${
            checked ? "bg-teal-light border-teal-light" : "border-warm-white/30"
          }`}
        >
          {checked && (
            <svg
              className="w-3.5 h-3.5 text-deep"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <div className="flex-1">
          <p
            className={`text-sm font-body leading-snug ${
              checked ? "text-warm-white" : "text-warm-white/80"
            }`}
          >
            {field.label}
          </p>
          {field.helper && (
            <p className="text-warm-white/45 text-xs font-body mt-1">{field.helper}</p>
          )}
        </div>
      </button>
    );
  }

  if (field.type === "secret") {
    const checked = !!value;
    return (
      <button
        onClick={() => onChange(!checked)}
        className={`w-full flex items-start gap-3 p-4 rounded-sm border text-left transition-all ${
          checked
            ? "bg-copper/10 border-copper"
            : "bg-white/[0.03] border-copper/30"
        }`}
      >
        <span
          className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center mt-0.5 transition-all ${
            checked ? "bg-copper border-copper" : "border-copper/50"
          }`}
        >
          {checked && (
            <svg
              className="w-3.5 h-3.5 text-warm-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <div className="flex-1">
          <p
            className={`text-sm font-body leading-snug ${
              checked ? "text-warm-white" : "text-warm-white/80"
            }`}
          >
            <span className="text-copper">[Sensitive] </span>
            {field.label}
          </p>
          <p className="text-copper/80 text-xs font-body mt-1">
            {field.helper ?? "Send via 1Password — never paste into this form."}
          </p>
        </div>
      </button>
    );
  }

  const inputType = field.type === "email" ? "email" : field.type === "url" ? "url" : "text";
  return (
    <div>
      <label className="text-warm-white/45 text-[10px] font-body tracking-[0.25em] uppercase block mb-1.5">
        {field.label}
      </label>
      <input
        type={inputType}
        inputMode={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full bg-white/[0.04] border border-teal/15 focus:border-teal-light focus:bg-white/[0.06] rounded-sm px-4 py-3 text-sm font-body text-warm-white placeholder:text-warm-white/30 outline-none transition-all"
      />
      {field.helper && (
        <p className="text-warm-white/45 text-xs font-body mt-1.5">{field.helper}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  Highlight card (intro screen)
// ─────────────────────────────────────────────────────

function Highlight({
  kicker,
  title,
  detail,
}: {
  kicker: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="bg-white/[0.04] border border-teal/15 rounded-sm p-4">
      <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-1.5">
        {kicker}
      </p>
      <p className="text-warm-white text-sm font-body font-medium mb-1">{title}</p>
      <p className="text-warm-white/55 text-xs font-body leading-relaxed">{detail}</p>
    </div>
  );
}
