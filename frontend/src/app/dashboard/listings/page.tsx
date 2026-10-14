import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { fetchListings, fetchRequests } from "@/lib/queries";
import { ListingsManager, type ManagedListing } from "@/components/dashboard/listings-manager";

export const dynamic = "force-dynamic";

export default async function DashboardListingsPage() {
  const user = await requireUser();
  const locale = await getLocale();

  const [items, requests] = await Promise.all([
    fetchListings({ userId: user.id, limit: 100 }),
    fetchRequests(user.id),
  ]);

  const requestCounts = new Map<number, number>();
  for (const request of requests) {
    if (request.listingId) {
      requestCounts.set(request.listingId, (requestCounts.get(request.listingId) ?? 0) + 1);
    }
  }

  const managed: ManagedListing[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    titleRu: item.titleRu,
    city: item.city,
    district: item.district,
    propertyType: item.propertyType,
    status: item.status,
    dealType: item.dealType,
    price: item.price,
    area: item.area,
    rooms: item.rooms,
    views: item.views,
    images: item.images,
    createdAt: item.createdAt.toISOString(),
    requests: requestCounts.get(item.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
            {t(locale, "dash.title")}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {t(locale, "listings.title")}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">{t(locale, "listings.sub")}</p>
        </div>
      </header>

      <ListingsManager items={managed} locale={locale} />

      <p className="text-xs text-slate-400">
        {t(locale, "nav.catalog")}:{" "}
        <Link href="/listings" className="font-semibold text-brand-700 hover:underline">
          /listings
        </Link>
      </p>
    </div>
  );
}
