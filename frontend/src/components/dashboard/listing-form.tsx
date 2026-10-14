"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui";
import { formatPrice, t, type Locale } from "@/lib/i18n";
import {
  CITIES,
  DEAL_TYPES,
  FEATURES,
  LISTING_STATUSES,
  PROPERTY_TYPES,
  dealTypeKey,
  featureLabel,
  listingStatusKey,
  propertyTypeKey,
} from "@/lib/taxonomy";

export type ListingFormValues = {
  id?: number;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  propertyType: string;
  status: string;
  dealType: string;
  price: string;
  city: string;
  district: string;
  address: string;
  area: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  totalFloors: string;
  landArea: string;
  yearBuilt: string;
  features: string[];
  images: string;
  contactName: string;
  contactPhone: string;
  featured: boolean;
};

export function ListingForm({
  locale,
  initial,
  mode,
}: {
  locale: Locale;
  initial: ListingFormValues;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [form, setForm] = useState(initial);

  const imageList = form.images
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  function update<K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFeature(key: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(key)
        ? prev.features.filter((item) => item !== key)
        : [...prev.features, key],
    }));
  }

  function payload() {
    return {
      title: form.title,
      titleRu: form.titleRu,
      description: form.description,
      descriptionRu: form.descriptionRu,
      propertyType: form.propertyType,
      status: form.status,
      dealType: form.dealType,
      price: form.price ? Number(form.price) : 0,
      city: form.city,
      district: form.district,
      address: form.address,
      area: form.area ? Number(form.area) : 0,
      rooms: form.rooms ? Number(form.rooms) : 0,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : 0,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : 0,
      floor: form.floor ? Number(form.floor) : 0,
      totalFloors: form.totalFloors ? Number(form.totalFloors) : 0,
      landArea: form.landArea ? Number(form.landArea) : 0,
      yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : 0,
      features: form.features,
      images: imageList,
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      featured: form.featured,
    };
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors([]);
    try {
      const res = await fetch(
        mode === "create" ? "/api/listings" : `/api/listings/${initial.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload()),
        },
      );
      const json = (await res.json()) as { ok?: boolean; errors?: string[] };
      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? ["auth.errorGeneric"]);
        setBusy(false);
        return;
      }
      startTransition(() => {
        router.push("/dashboard/listings");
        router.refresh();
      });
    } catch {
      setErrors(["auth.errorGeneric"]);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Section title={t(locale, "form.basic")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t(locale, "field.title")} required>
            <input
              className="input"
              required
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder={locale === "ua" ? "Трикімнатна з терасою…" : "Трёхкомнатная с террасой…"}
            />
          </Field>
          <Field
            label={t(locale, "field.titleRu")}
            hint={
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    titleRu: prev.title,
                    descriptionRu: prev.descriptionRu || prev.description,
                  }))
                }
                className="text-[11px] font-semibold text-brand-700 hover:underline"
              >
                {t(locale, "form.sameForRu")}
              </button>
            }
          >
            <input
              className="input"
              value={form.titleRu}
              onChange={(event) => update("titleRu", event.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t(locale, "field.description")}>
            <textarea
              rows={4}
              className="input resize-none"
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.descriptionRu")}>
            <textarea
              rows={4}
              className="input resize-none"
              value={form.descriptionRu}
              onChange={(event) => update("descriptionRu", event.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t(locale, "field.propertyType")}>
            <select
              className="input"
              value={form.propertyType}
              onChange={(event) => update("propertyType", event.target.value)}
            >
              {PROPERTY_TYPES.map((item) => (
                <option key={item} value={item}>
                  {t(locale, propertyTypeKey(item))}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(locale, "field.dealType")}>
            <select
              className="input"
              value={form.dealType}
              onChange={(event) => update("dealType", event.target.value)}
            >
              {DEAL_TYPES.map((item) => (
                <option key={item} value={item}>
                  {t(locale, dealTypeKey(item))}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(locale, "field.status")}>
            <select
              className="input"
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
            >
              {LISTING_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {t(locale, listingStatusKey(item))}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`${t(locale, "field.price")}, ₴`} required>
            <input
              className="input"
              type="number"
              min={0}
              step={10000}
              required
              value={form.price}
              onChange={(event) => update("price", event.target.value)}
            />
          </Field>
        </div>

        {Number(form.price) > 0 ? (
          <p className="text-xs text-slate-400">
            {formatPrice(Number(form.price), locale)}
            {Number(form.area) > 0
              ? ` · ${formatPrice(Math.round(Number(form.price) / Number(form.area)), locale)} ${t(locale, "listing.squareMeter")}`
              : ""}
          </p>
        ) : null}

        <label className="mt-1 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          {t(locale, "field.featured")}
        </label>
      </Section>

      <Section title={t(locale, "form.location")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t(locale, "field.city")} required>
            <select
              className="input"
              required
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
          </Field>
          <Field label={t(locale, "field.district")}>
            <input
              className="input"
              value={form.district}
              onChange={(event) => update("district", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.address")}>
            <input
              className="input"
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title={t(locale, "form.params")}>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Field label={`${t(locale, "field.area")}, ${t(locale, "misc.m2")}`}>
            <input
              className="input"
              type="number"
              min={0}
              value={form.area}
              onChange={(event) => update("area", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.rooms")}>
            <input
              className="input"
              type="number"
              min={0}
              value={form.rooms}
              onChange={(event) => update("rooms", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.bedrooms")}>
            <input
              className="input"
              type="number"
              min={0}
              value={form.bedrooms}
              onChange={(event) => update("bedrooms", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.bathrooms")}>
            <input
              className="input"
              type="number"
              min={0}
              value={form.bathrooms}
              onChange={(event) => update("bathrooms", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.floor")}>
            <input
              className="input"
              type="number"
              min={0}
              value={form.floor}
              onChange={(event) => update("floor", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.totalFloors")}>
            <input
              className="input"
              type="number"
              min={0}
              value={form.totalFloors}
              onChange={(event) => update("totalFloors", event.target.value)}
            />
          </Field>
          <Field label={`${t(locale, "field.landArea")}, ${t(locale, "misc.sotka")}`}>
            <input
              className="input"
              type="number"
              min={0}
              step={0.5}
              value={form.landArea}
              onChange={(event) => update("landArea", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.yearBuilt")}>
            <input
              className="input"
              type="number"
              min={1800}
              max={2100}
              value={form.yearBuilt}
              onChange={(event) => update("yearBuilt", event.target.value)}
            />
          </Field>
        </div>

        <div className="mt-4">
          <span className="label">{t(locale, "field.features")}</span>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((feature) => {
              const active = form.features.includes(feature.key);
              return (
                <button
                  key={feature.key}
                  type="button"
                  onClick={() => toggleFeature(feature.key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span aria-hidden className="mr-1">
                    {feature.icon}
                  </span>
                  {featureLabel(feature.key, locale)}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section title={t(locale, "field.images")}>
        <textarea
          rows={3}
          className="input resize-none font-mono text-xs"
          value={form.images}
          onChange={(event) => update("images", event.target.value)}
          placeholder="https://images.pexels.com/photos/7061662/..., https://..."
        />
        {imageList.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {imageList.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative h-16 w-24 overflow-hidden rounded-lg bg-slate-100"
              >
                <Image src={image} alt="" fill sizes="120px" className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        ) : null}
      </Section>

      <Section title={t(locale, "form.contacts")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t(locale, "field.contactName")}>
            <input
              className="input"
              value={form.contactName}
              onChange={(event) => update("contactName", event.target.value)}
            />
          </Field>
          <Field label={t(locale, "field.contactPhone")}>
            <input
              className="input"
              value={form.contactPhone}
              onChange={(event) => update("contactPhone", event.target.value)}
              placeholder="+380 __ ___ __ __"
            />
          </Field>
        </div>
      </Section>

      {errors.length > 0 ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {t(locale, errors[0] as never)}
        </p>
      ) : null}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-sand-50/95 py-4 backdrop-blur">
        <button type="submit" disabled={busy || pending} className="btn-primary">
          {busy || pending ? <Spinner /> : null}
          {busy || pending
            ? t(locale, "action.saving")
            : mode === "create"
              ? t(locale, "action.create")
              : t(locale, "action.save")}
        </button>
        <Link href="/dashboard/listings" className="btn-secondary">
          {t(locale, "action.cancel")}
        </Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="mb-4 text-sm font-bold tracking-wide text-slate-900 uppercase">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <span className="label flex items-center justify-between">
        <span>
          {label}
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </span>
        {hint}
      </span>
      {children}
    </div>
  );
}
