"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="flex items-center font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
    >
      <button
        type="button"
        onClick={() => setLocale("es")}
        aria-pressed={locale === "es"}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === "es"
            ? "text-foreground"
            : "text-foreground/40 hover:text-foreground/70"
        }`}
      >
        ES
      </button>
      <span className="text-foreground/20">/</span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === "en"
            ? "text-foreground"
            : "text-foreground/40 hover:text-foreground/70"
        }`}
      >
        EN
      </button>
    </div>
  );
}
