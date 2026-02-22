"use client";

import { useI18n, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const flags: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
};

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const next: Locale = locale === "fr" ? "en" : "fr";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(next)}
      className="gap-1.5 text-sm font-medium"
    >
      <span className="text-base">{flags[next]}</span>
      {next.toUpperCase()}
    </Button>
  );
}
