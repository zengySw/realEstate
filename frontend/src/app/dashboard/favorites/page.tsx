import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { fetchFavoriteListings } from "@/lib/queries";
import { FavoritesGrid } from "@/components/dashboard/favorites-grid";

export const dynamic = "force-dynamic";

export default async function DashboardFavoritesPage() {
  const user = await requireUser();
  const locale = await getLocale();
  const items = await fetchFavoriteListings(user.id);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
          {t(locale, "dash.title")}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {t(locale, "favorites.title")}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">{t(locale, "favorites.sub")}</p>
      </header>

      <FavoritesGrid
        items={items.map((listing) => ({
          id: listing.id,
          title: listing.title,
          titleRu: listing.titleRu,
          city: listing.city,
          district: listing.district,
          price: listing.price,
          dealType: listing.dealType,
          status: listing.status,
          propertyType: listing.propertyType,
          area: listing.area,
          rooms: listing.rooms,
          landArea: listing.landArea,
          images: listing.images,
          featured: listing.featured,
          views: listing.views,
        }))}
        locale={locale}
        favoriteIds={items.map((listing) => listing.id)}
      />
    </div>
  );
}
