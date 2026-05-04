"use client";

import { useI18n } from "@/context/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full px-1 py-1">
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          locale === "en"
            ? "bg-white text-blue-700"
            : "text-white/80 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("sv")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          locale === "sv"
            ? "bg-white text-blue-700"
            : "text-white/80 hover:text-white"
        }`}
      >
        SV
      </button>
    </div>
  );
}
