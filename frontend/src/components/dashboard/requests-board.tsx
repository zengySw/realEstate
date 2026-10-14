"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState, RequestStatusPill, Spinner } from "@/components/ui";
import {
  formatCompactPrice,
  formatDateTime,
  t,
  type Locale,
} from "@/lib/i18n";
import { CITIES, REQUEST_STATUSES, requestStatusKey, type RequestStatus } from "@/lib/taxonomy";

export type ManagedRequest = {
  id: number;
  listingId: number | null;
  listingTitle: string | null;
  listingTitleRu: string | null;
  listingPrice: number | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  message: string;
  budget: number;
  preferredCity: string;
  status: string;
  viewingAt: string | null;
  agentNote: string;
  createdAt: string;
};

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export function RequestsBoard({
  items,
  locale,
  listings,
}: {
  items: ManagedRequest[];
  locale: Locale;
  listings: { id: number; title: string; titleRu: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState(items);
  const [filter, setFilter] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newRequest, setNewRequest] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    budget: "",
    preferredCity: "",
    listingId: "",
    message: "",
    viewingAt: "",
  });

  const filtered = useMemo(() => {
    if (!filter) return rows;
    return rows.filter((row) => row.status === filter);
  }, [rows, filter]);

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  }

  async function createRequest(event: React.FormEvent) {
    event.preventDefault();
    setBusyId(-1);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: newRequest.clientName,
          clientPhone: newRequest.clientPhone,
          clientEmail: newRequest.clientEmail,
          budget: newRequest.budget ? Number(newRequest.budget) : 0,
          preferredCity: newRequest.preferredCity,
          listingId: newRequest.listingId ? Number(newRequest.listingId) : null,
          message: newRequest.message,
          viewingAt: newRequest.viewingAt || null,
          status: "new",
        }),
      });
      const json = (await res.json()) as { ok?: boolean; data?: ManagedRequest };
      if (!res.ok || !json.ok || !json.data) throw new Error("failed");
      setRows((current) => [json.data as ManagedRequest, ...current]);
      setNewRequest({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        budget: "",
        preferredCity: "",
        listingId: "",
        message: "",
        viewingAt: "",
      });
      setShowForm(false);
      flash(t(locale, "inquiry.success"));
      startTransition(() => router.refresh());
    } catch {
      flash(t(locale, "misc.error"));
    } finally {
      setBusyId(null);
    }
  }

  async function patchRequest(id: number, body: Record<string, unknown>) {
    const previous = rows;
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...body } as ManagedRequest : row)),
    );
    setBusyId(id);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
      startTransition(() => router.refresh());
    } catch {
      setRows(previous);
      flash(t(locale, "misc.error"));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: number) {
    if (!window.confirm(t(locale, "requests.deleteConfirm"))) return;
    const previous = rows;
    setRows((current) => current.filter((row) => row.id !== id)); // optimistic
    setBusyId(id);
    try {
      const res = await fetch(`/api/requests/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      flash(t(locale, "action.delete") + " ✓");
      startTransition(() => router.refresh());
    } catch {
      setRows(previous);
      flash(t(locale, "misc.error"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === "" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t(locale, "field.anyType")} ({rows.length})
          </button>
          {REQUEST_STATUSES.map((status) => {
            const count = rows.filter((row) => row.status === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  filter === status
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t(locale, requestStatusKey(status))} ({count})
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="btn-primary ml-auto"
        >
          {showForm ? t(locale, "action.cancel") : `+ ${t(locale, "requests.new")}`}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={createRequest} className="card animate-fade-up space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="req-name">
                {t(locale, "field.name")}
              </label>
              <input
                id="req-name"
                required
                className="input"
                value={newRequest.clientName}
                onChange={(event) =>
                  setNewRequest((prev) => ({ ...prev, clientName: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="label" htmlFor="req-phone">
                {t(locale, "field.phone")}
              </label>
              <input
                id="req-phone"
                required
                className="input"
                value={newRequest.clientPhone}
                onChange={(event) =>
                  setNewRequest((prev) => ({ ...prev, clientPhone: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="label" htmlFor="req-email">
                {t(locale, "field.email")}
              </label>
              <input
                id="req-email"
                type="email"
                className="input"
                value={newRequest.clientEmail}
                onChange={(event) =>
                  setNewRequest((prev) => ({ ...prev, clientEmail: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="label" htmlFor="req-budget">
                {t(locale, "field.budget")}
              </label>
              <input
                id="req-budget"
                type="number"
                min={0}
                step={100000}
                className="input"
                value={newRequest.budget}
                onChange={(event) =>
                  setNewRequest((prev) => ({ ...prev, budget: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="label" htmlFor="req-city">
                {t(locale, "field.preferredCity")}
              </label>
              <select
                id="req-city"
                className="input"
                value={newRequest.preferredCity}
                onChange={(event) =>
                  setNewRequest((prev) => ({ ...prev, preferredCity: event.target.value }))
                }
              >
                <option value="">—</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="req-listing">
                {t(locale, "requests.fromListing")}
              </label>
              <select
                id="req-listing"
                className="input"
                value={newRequest.listingId}
                onChange={(event) =>
                  setNewRequest((prev) => ({ ...prev, listingId: event.target.value }))
                }
              >
                <option value="">{t(locale, "requests.general")}</option>
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {locale === "ru" && listing.titleRu ? listing.titleRu : listing.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="req-viewing">
                {t(locale, "field.viewingDate")}
              </label>
              <input
                id="req-viewing"
                type="datetime-local"
                className="input"
                value={newRequest.viewingAt}
                onChange={(event) =>
                  setNewRequest((prev) => ({ ...prev, viewingAt: event.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="req-message">
              {t(locale, "field.message")}
            </label>
            <textarea
              id="req-message"
              rows={3}
              className="input resize-none"
              value={newRequest.message}
              onChange={(event) =>
                setNewRequest((prev) => ({ ...prev, message: event.target.value }))
              }
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={busyId === -1} className="btn-primary">
              {busyId === -1 ? <Spinner /> : null}
              {busyId === -1 ? t(locale, "action.saving") : t(locale, "action.create")}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              {t(locale, "action.cancel")}
            </button>
          </div>
        </form>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          icon="✉"
          title={t(locale, "requests.emptyTitle")}
          text={t(locale, "requests.emptyText")}
          actionLabel={t(locale, "requests.new")}
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((request) => (
            <article
              key={request.id}
              className={`card animate-fade-up p-5 transition ${
                busyId === request.id ? "opacity-60" : "hover:shadow-md"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{request.clientName}</h3>
                    <RequestStatusPill status={request.status} locale={locale} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    <a href={`tel:${request.clientPhone.replace(/\s/g, "")}`} className="hover:text-brand-700">
                      {request.clientPhone}
                    </a>
                    {request.clientEmail ? ` · ${request.clientEmail}` : ""}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatDateTime(request.createdAt, locale)}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-3">
                <div>
                  <dt className="text-slate-400">{t(locale, "field.budget")}</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">
                    {request.budget > 0 ? formatCompactPrice(request.budget, locale) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">{t(locale, "field.preferredCity")}</dt>
                  <dd className="mt-0.5 font-semibold text-slate-700">
                    {request.preferredCity || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">{t(locale, "field.viewingDate")}</dt>
                  <dd className="mt-0.5 font-semibold text-slate-700">
                    {formatDateTime(request.viewingAt, locale)}
                  </dd>
                </div>
              </dl>

              {request.listingId ? (
                <Link
                  href={`/listings/${request.listingId}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-800 hover:bg-brand-100"
                >
                  🏠 {t(locale, "requests.fromListing")}:{" "}
                  {request.listingTitle
                    ? locale === "ru" && request.listingTitleRu
                      ? request.listingTitleRu
                      : request.listingTitle
                    : `#${request.listingId}`}
                </Link>
              ) : (
                <p className="mt-3 inline-flex rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                  {t(locale, "requests.general")}
                </p>
              )}

              {request.message ? (
                <p className="mt-3 border-l-2 border-brand-200 pl-3 text-sm leading-relaxed text-slate-600">
                  {request.message}
                </p>
              ) : null}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    className="label"
                    htmlFor={`status-${request.id}`}
                  >
                    {t(locale, "field.status")}
                  </label>
                  <select
                    id={`status-${request.id}`}
                    value={request.status}
                    onChange={(event) =>
                      patchRequest(request.id, { status: event.target.value })
                    }
                    className="input py-1.5 text-xs"
                  >
                    {REQUEST_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {t(locale, requestStatusKey(status))}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor={`viewing-${request.id}`}>
                    {t(locale, "field.viewingDate")}
                  </label>
                  <input
                    id={`viewing-${request.id}`}
                    type="datetime-local"
                    className="input py-1.5 text-xs"
                    defaultValue={toDateTimeLocal(request.viewingAt)}
                    onChange={(event) =>
                      patchRequest(request.id, {
                        viewingAt: event.target.value || null,
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="label" htmlFor={`note-${request.id}`}>
                  {t(locale, "field.agentNote")}
                </label>
                <textarea
                  id={`note-${request.id}`}
                  rows={2}
                  className="input resize-none text-xs"
                  defaultValue={request.agentNote}
                  onBlur={(event) => patchRequest(request.id, { agentNote: event.target.value })}
                />
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === request.id ? null : request.id)}
                  className="btn-secondary btn-sm"
                >
                  {t(locale, "action.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => remove(request.id)}
                  disabled={busyId === request.id}
                  className="btn-danger btn-sm"
                >
                  {busyId === request.id ? <Spinner /> : t(locale, "action.delete")}
                </button>
                {pending ? <span className="ml-auto text-[11px] text-slate-400">…</span> : null}
              </div>

              {editingId === request.id ? (
                <div className="animate-fade-up mt-3 space-y-3 rounded-xl bg-slate-50 p-3">
                  {(
                    [
                      ["clientName", t(locale, "field.name")],
                      ["clientPhone", t(locale, "field.phone")],
                      ["clientEmail", t(locale, "field.email")],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key}>
                      <span className="label">{label}</span>
                      <input
                        className="input py-1.5 text-xs"
                        defaultValue={request[key]}
                        onBlur={(event) =>
                          patchRequest(request.id, { [key]: event.target.value })
                        }
                      />
                    </div>
                  ))}
                  <div>
                    <span className="label">{t(locale, "field.budget")}</span>
                    <input
                      type="number"
                      min={0}
                      step={100000}
                      className="input py-1.5 text-xs"
                      defaultValue={request.budget}
                      onBlur={(event) =>
                        patchRequest(request.id, { budget: Number(event.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {toast ? (
        <div className="animate-fade-up fixed right-5 bottom-5 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
