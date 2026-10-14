"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { t, type Locale } from "@/lib/i18n";
import {
  CITIES,
  DEAL_TYPES,
  PROPERTY_TYPES,
  SORT_OPTIONS,
  dealTypeKey,
  propertyTypeKey,
  type SortOption,
} from "@/lib/taxonomy";

export function ListingFilters({ locale }: { locale: Locale }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    q: params.get("q") ?? "",
    city: params.get("city") ?? "",
    type: params.get("type") ?? "",
    deal: params.get("deal") ?? "",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    rooms: params.get("rooms") ?? "",
    sort: (params.get("sort") ?? "newest") as SortOption,
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function apply(event?: React.FormEvent) {
    event?.preventDefault();
    const next = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value && !(key === "sort" && value === "newest")) next.set(key, value);
    });
    startTransition(() => router.push(`/listings?${next.toString()}`));
  }

  function reset() {
    setForm({
      q: "",
      city: "",
      type: "",
      deal: "",
      minPrice: "",
      maxPrice: "",
      rooms: "",
      sort: "newest",
    });
    startTransition(() => router.push("/listings"));
  }

  return (
    <form
      onSubmit={apply}
      className={`card space-y-4 p-5 ${pending ? "opacity-70" : ""}`}
      data-pending={pending}
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <span aria-hidden>⚙️</span> {t(locale, "action.filters")}
        </h2>
        <button type="button" onClick={reset} className="text-xs font-semibold text-brand-700 hover:underline">
          {t(locale, "action.reset")}
        </button>
      </div>

      <div>
        <label className="label" htmlFor="filter-q">
          {t(locale, "action.search")}
        </label>
        <input
          id="filter-q"
          className="input"
          value={form.q}
          onChange={(event) => update("q", event.target.value)}
          placeholder={locale === "ua" ? "Печерський, ЖК «Гранд»…" : "Печерский, ЖК «Гранд»…"}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="filter-city">
            {t(locale, "field.city")}
          </label>
          <select
            id="filter-city"
            className="input"
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
          >
            <option value="">{t(locale, "field.anyCity")}</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="filter-type">
            {t(locale, "field.propertyType")}
          </label>
          <select
            id="filter-type"
            className="input"
            value={form.type}
            onChange={(event) => update("type", event.target.value)}
          >
            <option value="">{t(locale, "field.anyType")}</option>
            {PROPERTY_TYPES.map((item) => (
              <option key={item} value={item}>
                {t(locale, propertyTypeKey(item))}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="filter-min">
            {t(locale, "field.priceFrom")}
          </label>
          <input
            id="filter-min"
            type="number"
            min={0}
            step={100000}
            className="input"
            value={form.minPrice}
            onChange={(event) => update("minPrice", event.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="label" htmlFor="filter-max">
            {t(locale, "field.priceTo")}
          </label>
          <input
            id="filter-max"
            type="number"
            min={0}
            step={100000}
            className="input"
            value={form.maxPrice}
            onChange={(event) => update("maxPrice", event.target.value)}
            placeholder="20 000 000"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="filter-rooms">
            {t(locale, "field.rooms")}
          </label>
          <select
            id="filter-rooms"
            className="input"
            value={form.rooms}
            onChange={(event) => update("rooms", event.target.value)}
          >
            <option value="">{t(locale, "field.anyRooms")}</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="filter-deal">
            {t(locale, "field.dealType")}
          </label>
          <select
            id="filter-deal"
            className="input"
            value={form.deal}
            onChange={(event) => update("deal", event.target.value)}
          >
            <option value="">{t(locale, "field.anyType")}</option>
            {DEAL_TYPES.map((item) => (
              <option key={item} value={item}>
                {t(locale, dealTypeKey(item))}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="filter-sort">
          {t(locale, "field.sort")}
        </label>
        <select
          id="filter-sort"
          className="input"
          value={form.sort}
          onChange={(event) => {
            update("sort", event.target.value);
            const next = new URLSearchParams(params.toString());
            if (event.target.value === "newest") next.delete("sort");
            else next.set("sort", event.target.value);
            startTransition(() => router.push(`/listings?${next.toString()}`));
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(locale, `sort.${option}` as never)}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary w-full">
        {t(locale, "action.apply")}
      </button>
    </form>
  );
}
