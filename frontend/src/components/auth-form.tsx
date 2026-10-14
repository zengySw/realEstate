"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import { CITIES, roleKey } from "@/lib/taxonomy";

const DEMO_ACCOUNTS = [
  { email: "agent@domivka.ua", label: { ua: "Агент · Київ", ru: "Агент · Киев" }, role: "agent" },
  { email: "buyer@domivka.ua", label: { ua: "Покупець · Львів", ru: "Покупатель · Львов" }, role: "buyer" },
  { email: "marina@domivka.ua", label: { ua: "Агент · Одеса", ru: "Агент · Одесса" }, role: "agent" },
];

export function AuthForm({
  mode,
  locale,
  nextPath,
}: {
  mode: "login" | "register";
  locale: Locale;
  nextPath: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    role: "buyer",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login"
            ? { email: form.email, password: form.password, locale }
            : { ...form, locale },
        ),
      });
      const json = (await res.json()) as { ok?: boolean; errors?: string[] };
      if (!res.ok || !json.ok) {
        setError(json.errors?.[0] ?? "auth.errorGeneric");
        setBusy(false);
        return;
      }
      startTransition(() => {
        router.push(nextPath);
        router.refresh();
      });
    } catch {
      setError("auth.errorGeneric");
      setBusy(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="w-full">
      <form onSubmit={submit} className="space-y-4">
        {!isLogin ? (
          <div>
            <label className="label" htmlFor="auth-name">
              {t(locale, "field.name")}
            </label>
            <input
              id="auth-name"
              required
              className="input"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder={locale === "ua" ? "Олена Коваленко" : "Елена Коваленко"}
            />
          </div>
        ) : null}

        <div>
          <label className="label" htmlFor="auth-email">
            {t(locale, "field.email")}
          </label>
          <input
            id="auth-email"
            type="email"
            required
            className="input"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="label" htmlFor="auth-password">
            {t(locale, "field.password")}
          </label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={6}
            className="input"
            value={form.password}
            onChange={(event) => update("password", event.target.value)}
            placeholder="••••••••"
          />
        </div>

        {!isLogin ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="auth-phone">
                  {t(locale, "field.phone")}
                </label>
                <input
                  id="auth-phone"
                  className="input"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="+380 __ ___ __ __"
                />
              </div>
              <div>
                <label className="label" htmlFor="auth-city">
                  {t(locale, "field.city")}
                </label>
                <select
                  id="auth-city"
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
                {(["buyer", "agent"] as const).map((role) => (
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
          </>
        ) : null}

        {error ? (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {t(locale, error as never)}
          </p>
        ) : null}

        <button type="submit" disabled={busy || pending} className="btn-primary w-full">
          {busy || pending ? <Spinner /> : null}
          {isLogin ? t(locale, "nav.login") : t(locale, "nav.register")}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        {isLogin ? t(locale, "auth.noAccount") : t(locale, "auth.hasAccount")}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-semibold text-brand-700 hover:underline"
        >
          {isLogin ? t(locale, "nav.register") : t(locale, "nav.login")}
        </Link>
      </p>

      {isLogin ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-sand-50 p-4">
          <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
            {t(locale, "auth.demoTitle")}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {t(locale, "auth.demoHint")} · demo1234
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, email: account.email, password: "demo1234" }))
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                {account.label[locale]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
