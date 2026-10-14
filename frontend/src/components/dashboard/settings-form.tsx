"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import { CITIES, roleKey, ROLES } from "@/lib/taxonomy";

export function SettingsForm({
  locale,
  user,
}: {
  locale: Locale;
  user: {
    name: string;
    email: string;
    phone: string;
    city: string;
    bio: string;
    role: string;
    locale: string;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    city: user.city,
    bio: user.bio,
    role: user.role,
    locale: (user.locale === "ru" ? "ru" : "ua") as Locale,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (!res.ok || !json.ok) throw new Error("failed");
      setMessage(t(locale, "settings.saved"));
      startTransition(() => router.refresh());
    } catch {
      setMessage(t(locale, "misc.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="set-name">
            {t(locale, "field.name")}
          </label>
          <input
            id="set-name"
            className="input"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="set-email">
            {t(locale, "field.email")}
          </label>
          <input id="set-email" className="input bg-slate-50" value={user.email} disabled />
        </div>
        <div>
          <label className="label" htmlFor="set-phone">
            {t(locale, "field.phone")}
          </label>
          <input
            id="set-phone"
            className="input"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+380 __ ___ __ __"
          />
        </div>
        <div>
          <label className="label" htmlFor="set-city">
            {t(locale, "field.city")}
          </label>
          <select
            id="set-city"
            className="input"
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
          >
            <option value="">—</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="label">{t(locale, "field.role")}</span>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => update("role", role)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                form.role === role
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {t(locale, roleKey(role))}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="set-bio">
          {locale === "ua" ? "Про себе" : "О себе"}
        </label>
        <textarea
          id="set-bio"
          rows={3}
          className="input resize-none"
          value={form.bio}
          onChange={(event) => update("bio", event.target.value)}
        />
      </div>

      <div>
        <span className="label">{t(locale, "field.language")}</span>
        <div className="grid grid-cols-2 gap-2">
          {(["ua", "ru"] as Locale[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => update("locale", code)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                form.locale === code
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {code === "ua" ? "Українська" : "Русский"}
            </button>
          ))}
        </div>
      </div>

      {message ? (
        <p className="rounded-xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-800">
          {message}
        </p>
      ) : null}

      <button type="submit" disabled={busy || pending} className="btn-primary">
        {busy || pending ? <Spinner /> : null}
        {busy || pending ? t(locale, "action.saving") : t(locale, "action.save")}
      </button>
    </form>
  );
}
