import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { fetchListings, fetchRequests } from "@/lib/queries";
import { RequestsBoard, type ManagedRequest } from "@/components/dashboard/requests-board";

export const dynamic = "force-dynamic";

export default async function DashboardRequestsPage() {
  const user = await requireUser();
  const locale = await getLocale();

  const [requests, myListings] = await Promise.all([
    fetchRequests(user.id),
    fetchListings({ userId: user.id, limit: 100 }),
  ]);

  function toIsoString(date: Date | string | null | undefined): string {
    if (!date) return new Date().toISOString();
    const d = typeof date === "string" ? new Date(date) : date;
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  const items: ManagedRequest[] = requests.map((request) => ({
    id: request.id,
    listingId: request.listingId,
    listingTitle: request.listingTitle,
    listingTitleRu: request.listingTitleRu,
    listingPrice: request.listingPrice,
    clientName: request.clientName,
    clientPhone: request.clientPhone,
    clientEmail: request.clientEmail,
    message: request.message,
    budget: request.budget,
    preferredCity: request.preferredCity,
    status: request.status,
    viewingAt: request.viewingAt ? toIsoString(request.viewingAt) : null,
    agentNote: request.agentNote,
    createdAt: toIsoString(request.createdAt),
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
          {t(locale, "dash.title")}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {t(locale, "requests.title")}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">{t(locale, "requests.sub")}</p>
      </header>

      <RequestsBoard
        items={items}
        locale={locale}
        listings={myListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          titleRu: listing.titleRu,
        }))}
      />
    </div>
  );
}
