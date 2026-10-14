"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState, Spinner, StatusBadge } from "@/components/ui";
import {
  formatCompactPrice,
  formatDate,
  formatNumber,
  t,
  type Locale,
} from "@/lib/i18n";
import { LISTING_STATUSES, listingStatusKey, propertyTypeKey } from "@/lib/taxonomy";
import type { ListingStatus } from "@/lib/taxonomy";

export type ManagedListing = {
  id: number;
  title: string;
  titleRu: string;
  city: string;
  district: string;
  propertyType: string;
  status: string;
  dealType: string;
  price: number;
  area: number;
  rooms: number;
  views: number;
  images: string[];
  createdAt: string;
  requests: number;
};

export function ListingsManager({
  items,
  locale,
}: {
  items: ManagedListing[];
  locale: Locale;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.titleRu.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || row.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, statusFilter]);

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  }

  async function changeStatus(listing: ManagedListing, next: ListingStatus) {
    const previous = rows;
    setRows((current) =>
      current.map((row) => (row.id === listing.id ? { ...row, status: next } : row)),
    );
    setBusyId(listing.id);
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...listing, status: next }),
      });
      if (!res.ok) throw new Error("failed");
      flash(`${t(locale, listingStatusKey(next))} ✓`);
      router.refresh();
    } catch {
      setRows(previous);
      flash(t(locale, "misc.error"));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(listing: ManagedListing) {
    if (!window.confirm(t(locale, "listings.deleteConfirm"))) return;
    const previous = rows;
    setRows((current) => current.filter((row) => row.id !== listing.id)); // optimistic
    setBusyId(listing.id);
    try {
      const res = await fetch(`/api/listings/${listing.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      flash(t(locale, "listings.deleted"));
      router.refresh();
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
        <div className="relative min-w-[200px] flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400">
            🔍
          </span>
          <input
            className="input pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={locale === "ua" ? "Пошук за назвою або містом" : "Поиск по названию или городу"}
          />
        </div>
        <select
          className="input w-auto"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">{t(locale, "field.status")}: {t(locale, "field.anyType")}</option>
          {LISTING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {t(locale, listingStatusKey(status))}
            </option>
          ))}
        </select>
        <Link href="/dashboard/listings/new" className="btn-primary">
          + {t(locale, "listings.new")}
        </Link>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🏠"
          title={t(locale, "listings.emptyTitle")}
          text={t(locale, "listings.emptyText")}
          actionLabel={t(locale, "listings.new")}
          actionHref="/dashboard/listings/new"
        />
      ) : (
        <div className="card divide-y divide-slate-100 overflow-hidden">
          {filtered.map((listing) => (
            <div
              key={listing.id}
              className={`animate-fade-up flex flex-wrap items-center gap-4 p-4 transition ${
                busyId === listing.id ? "opacity-60" : "hover:bg-slate-50/70"
              }`}
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {listing.images[0] ? (
                  <Image src={listing.images[0]} alt="" fill sizes="120px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xl text-slate-300">
                    ⌂
                  </span>
                )}
              </div>

              <div className="min-w-[180px] flex-1">
                <Link
                  href={`/dashboard/listings/${listing.id}/edit`}
                  className="line-clamp-1 text-sm font-bold text-slate-900 hover:text-brand-700"
                >
                  {locale === "ru" && listing.titleRu ? listing.titleRu : listing.title}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                  <span>
                    {listing.city}
                    {listing.district ? `, ${listing.district}` : ""}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{t(locale, propertyTypeKey(listing.propertyType))}</span>
                  <span className="text-slate-300">•</span>
                  <span>{formatDate(listing.createdAt, locale)}</span>
                </p>
              </div>

              <div className="hidden w-24 text-right sm:block">
                <p className="text-sm font-bold text-slate-900">
                  {formatCompactPrice(listing.price, locale)}
                </p>
                <p className="text-[11px] text-slate-400">
                  👁 {formatNumber(listing.views, locale)}
                  {listing.requests > 0 ? ` · ✉ ${listing.requests}` : ""}
                </p>
              </div>

              <div className="w-36">
                <select
                  value={listing.status}
                  onChange={(event) =>
                    changeStatus(listing, event.target.value as ListingStatus)
                  }
                  className="input py-1.5 text-xs"
                  aria-label={t(locale, "field.status")}
                >
                  {LISTING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {t(locale, listingStatusKey(status))}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:hidden">
                <StatusBadge status={listing.status} locale={locale} />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/listings/${listing.id}`}
                  className="btn-ghost btn-sm"
                  title={t(locale, "action.details")}
                >
                  👁
                </Link>
                <Link href={`/dashboard/listings/${listing.id}/edit`} className="btn-secondary btn-sm">
                  {t(locale, "action.edit")}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(listing)}
                  className="btn-danger btn-sm"
                  disabled={busyId === listing.id}
                >
                  {busyId === listing.id ? <Spinner /> : t(locale, "action.delete")}
                </button>
              </div>
            </div>
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
