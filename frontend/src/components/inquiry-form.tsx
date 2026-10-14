"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";

export function InquiryForm({
  locale,
  listingId,
  listingCity,
  defaultName,
  defaultPhone,
  defaultEmail,
  isAuthenticated,
}: {
  locale: Locale;
  listingId?: number;
  listingCity?: string;
  defaultName?: string;
  defaultPhone?: string;
  defaultEmail?: string;
  isAuthenticated: boolean;
}) {
  const [form, setForm] = useState({
    clientName: defaultName ?? "",
    clientPhone: defaultPhone ?? "",
    clientEmail: defaultEmail ?? "",
    message: "",
    budget: "",
    viewingAt: "",
  });
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setErrors([]);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listingId ?? null,
          clientName: form.clientName,
          clientPhone: form.clientPhone,
          clientEmail: form.clientEmail,
          message: form.message,
          budget: form.budget ? Number(form.budget) : 0,
          preferredCity: listingCity ?? "",
          viewingAt: form.viewingAt || null,
          status: "new",
        }),
      });
      const json = (await res.json()) as { ok?: boolean; errors?: string[] };
      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? ["auth.errorGeneric"]);
        setState("error");
        return;
      }
      setState("done");
      setForm((prev) => ({ ...prev, message: "", viewingAt: "" }));
    } catch {
      setErrors(["auth.errorGeneric"]);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="animate-fade-up rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-xl text-white">
          ✓
        </div>
        <p className="text-sm font-bold text-brand-900">{t(locale, "inquiry.success")}</p>
        <p className="mt-1 text-xs text-brand-800/80">
          {isAuthenticated ? t(locale, "inquiry.savedTo") : t(locale, "inquiry.sub")}
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="btn-secondary btn-sm mt-4"
        >
          {locale === "ua" ? "Ще одна заявка" : "Ещё одна заявка"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="inq-name">
            {t(locale, "field.name")}
          </label>
          <input
            id="inq-name"
            required
            className="input"
            value={form.clientName}
            onChange={(event) => update("clientName", event.target.value)}
            placeholder={locale === "ua" ? "Ваше ім'я" : "Ваше имя"}
          />
        </div>
        <div>
          <label className="label" htmlFor="inq-phone">
            {t(locale, "field.phone")}
          </label>
          <input
            id="inq-phone"
            required
            className="input"
            value={form.clientPhone}
            onChange={(event) => update("clientPhone", event.target.value)}
            placeholder="+380 __ ___ __ __"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="inq-email">
          {t(locale, "field.email")} ({t(locale, "field.optional")})
        </label>
        <input
          id="inq-email"
          type="email"
          className="input"
          value={form.clientEmail}
          onChange={(event) => update("clientEmail", event.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="inq-budget">
            {t(locale, "field.budget")} ({t(locale, "field.optional")})
          </label>
          <input
            id="inq-budget"
            type="number"
            min={0}
            step={100000}
            className="input"
            value={form.budget}
            onChange={(event) => update("budget", event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="inq-when">
            {t(locale, "field.viewingDate")}
          </label>
          <input
            id="inq-when"
            type="datetime-local"
            className="input"
            value={form.viewingAt}
            onChange={(event) => update("viewingAt", event.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="inq-message">
          {t(locale, "field.message")}
        </label>
        <textarea
          id="inq-message"
          rows={3}
          className="input resize-none"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder={locale === "ua" ? "Коли зручно подивитись об’єкт?" : "Когда удобно посмотреть объект?"}
        />
      </div>

      {errors.length > 0 ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {t(locale, errors[0] as never)}
        </p>
      ) : null}

      <button type="submit" disabled={state === "saving"} className="btn-primary w-full">
        {state === "saving" ? <Spinner /> : null}
        {state === "saving" ? t(locale, "action.sending") : t(locale, "action.sendRequest")}
      </button>
      <p className="text-center text-[11px] text-slate-400">{t(locale, "inquiry.sub")}</p>
    </form>
  );
}
