"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { t, type Locale } from "@/lib/i18n";
import { CITIES, PROPERTY_TYPES, propertyTypeKey } from "@/lib/taxonomy";

export function SearchBar({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (maxPrice) params.set("maxPrice", maxPrice);
    startTransition(() => router.push(`/listings?${params.toString()}`));
  }

  return (
    <form
      onSubmit={submit}
      className="animate-fade-up grid gap-3 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-xl shadow-brand-900/10 backdrop-blur sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr_auto]"
    >
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder={
          locale === "ua" ? "Район, вулиця або ЖК…" : "Район, улица или ЖК…"
        }
        className="input"
        aria-label={t(locale, "action.search")}
      />
      <select
        value={city}
        onChange={(event) => setCity(event.target.value)}
        className="input"
        aria-label={t(locale, "field.city")}
      >
        <option value="">{t(locale, "field.anyCity")}</option>
        {CITIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="input"
        aria-label={t(locale, "field.propertyType")}
      >
        <option value="">{t(locale, "field.anyType")}</option>
        {PROPERTY_TYPES.map((item) => (
          <option key={item} value={item}>
            {t(locale, propertyTypeKey(item))}
          </option>
        ))}
      </select>
      <select
        value={maxPrice}
        onChange={(event) => setMaxPrice(event.target.value)}
        className="input"
        aria-label={t(locale, "field.priceTo")}
      >
        <option value="">{locale === "ua" ? "Бюджет" : "Бюджет"}</option>
        <option value="3000000">до 3 млн ₴</option>
        <option value="5000000">до 5 млн ₴</option>
        <option value="10000000">до 10 млн ₴</option>
        <option value="20000000">до 20 млн ₴</option>
      </select>
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? t(locale, "action.loading") : `🔍 ${t(locale, "action.search")}`}
      </button>
    </form>
  );
}
