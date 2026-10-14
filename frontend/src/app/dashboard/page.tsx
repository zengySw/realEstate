import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import {
  formatCompactPrice,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPrice,
  t,
} from "@/lib/i18n";
import { fetchDashboardStats, fetchListings, fetchRequests } from "@/lib/queries";
import { propertyTypeKey, requestStatusKey } from "@/lib/taxonomy";
import { EmptyState, RequestStatusPill, SectionCard, StatCard, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const locale = await getLocale();

  const [stats, myListings, myRequests] = await Promise.all([
    fetchDashboardStats(user.id),
    fetchListings({ userId: user.id, limit: 5 }),
    fetchRequests(user.id),
  ]);

  const recentRequests = myRequests.slice(0, 5);
  const pipeline = (["new", "contacted", "viewing", "offer", "closed"] as const).map((key) => ({
    key,
    value: stats.pipeline[key] ?? 0,
  }));
  const maxPipeline = Math.max(1, ...pipeline.map((item) => item.value));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
            {t(locale, "dash.title")}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {t(locale, "dash.welcome")}, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">{t(locale, "listings.sub")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/listings/new" className="btn-primary">
            + {t(locale, "dash.quickNew")}
          </Link>
          <Link href="/listings" className="btn-secondary">
            {t(locale, "nav.catalog")}
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t(locale, "dash.statListings")}
          value={formatNumber(stats.total, locale)}
          hint={`${formatNumber(stats.reserved, locale)} · ${t(locale, "status.reserved")}`}
          icon="⌂"
        />
        <StatCard
          label={t(locale, "dash.statActive")}
          value={formatNumber(stats.active, locale)}
          hint={`${formatNumber(stats.sold, locale)} · ${t(locale, "status.sold")}`}
          icon="📌"
          tone="sky"
        />
        <StatCard
          label={t(locale, "dash.statViews")}
          value={formatNumber(stats.views, locale)}
          hint={t(locale, "listing.views")}
          icon="👁"
          tone="amber"
        />
        <StatCard
          label={t(locale, "dash.statRequests")}
          value={formatNumber(stats.newRequests, locale)}
          hint={`${formatNumber(stats.totalRequests, locale)} · ${t(locale, "side.requests")}`}
          icon="✉"
          tone="rose"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard
          title={t(locale, "dash.recentListings")}
          action={
            <Link
              href="/dashboard/listings"
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              {t(locale, "action.viewAll")} →
            </Link>
          }
        >
          {myListings.length === 0 ? (
            <EmptyState
              icon="🏠"
              title={t(locale, "listings.emptyTitle")}
              text={t(locale, "listings.emptyText")}
              actionLabel={t(locale, "listings.new")}
              actionHref="/dashboard/listings/new"
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {myListings.map((listing) => (
                <li key={listing.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {listing.images[0] ? (
                      <Image
                        src={listing.images[0]}
                        alt=""
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="line-clamp-1 text-sm font-bold text-slate-900 hover:text-brand-700"
                    >
                      {locale === "ru" && listing.titleRu ? listing.titleRu : listing.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {listing.city} · {t(locale, propertyTypeKey(listing.propertyType))} ·{" "}
                      {formatDate(listing.createdAt, locale)}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <StatusBadge status={listing.status} locale={locale} />
                  </div>
                  <span className="hidden text-sm font-bold text-slate-900 md:block">
                    {formatCompactPrice(listing.price, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title={t(locale, "dash.pipeline")}>
            <ul className="space-y-3">
              {pipeline.map((item) => (
                <li key={item.key}>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{t(locale, requestStatusKey(item.key))}</span>
                    <span className="text-slate-900">{item.value}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all duration-500"
                      style={{ width: `${(item.value / maxPipeline) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl bg-brand-50 p-4">
              <p className="text-xs font-semibold text-brand-700 uppercase">
                {t(locale, "dash.statAvg")}
              </p>
              <p className="mt-1 text-lg font-extrabold text-brand-900">
                {formatPrice(stats.avgPrice, locale)}
              </p>
            </div>
          </SectionCard>

          <SectionCard title={t(locale, "dash.quick")}>
            <div className="grid gap-2">
              <Link href="/dashboard/listings/new" className="btn-secondary justify-start text-sm">
                ➕ {t(locale, "dash.quickNew")}
              </Link>
              <Link href="/dashboard/listings" className="btn-secondary justify-start text-sm">
                🏷 {t(locale, "dash.quickCatalog")}
              </Link>
              <Link href="/dashboard/requests" className="btn-secondary justify-start text-sm">
                ✉ {t(locale, "dash.quickRequests")}
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title={t(locale, "dash.recentRequests")}
        action={
          <Link
            href="/dashboard/requests"
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            {t(locale, "action.viewAll")} →
          </Link>
        }
      >
        {recentRequests.length === 0 ? (
          <EmptyState
            icon="✉"
            title={t(locale, "requests.emptyTitle")}
            text={t(locale, "requests.emptyText")}
            actionLabel={t(locale, "nav.catalog")}
            actionHref="/listings"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[11px] tracking-wide text-slate-400 uppercase">
                  <th className="pb-3 font-semibold">{t(locale, "field.name")}</th>
                  <th className="pb-3 font-semibold">{t(locale, "field.phone")}</th>
                  <th className="pb-3 font-semibold">{t(locale, "field.budget")}</th>
                  <th className="pb-3 font-semibold">{t(locale, "field.status")}</th>
                  <th className="pb-3 font-semibold">{t(locale, "field.viewingDate")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="py-3">
                      <p className="font-semibold text-slate-900">{request.clientName}</p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(request.createdAt, locale)}
                      </p>
                    </td>
                    <td className="py-3 text-slate-600">{request.clientPhone}</td>
                    <td className="py-3 text-slate-600">
                      {request.budget > 0 ? formatCompactPrice(request.budget, locale) : "—"}
                    </td>
                    <td className="py-3">
                      <RequestStatusPill status={request.status} locale={locale} />
                    </td>
                    <td className="py-3 text-slate-600">
                      {formatDateTime(request.viewingAt, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
