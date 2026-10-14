"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 ${pending ? "opacity-60" : ""}`}
      aria-label="Language switcher"
    >
      {(["ua", "ru"] as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase transition ${
            locale === code
              ? "bg-brand-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {compact ? code : code === "ua" ? "UA" : "RU"}
        </button>
      ))}
    </div>
  );
}
