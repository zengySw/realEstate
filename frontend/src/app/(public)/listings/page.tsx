import { Suspense } from "react";
import { ensureSeeded } from "@/db/seed";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { countListings, fetchFavoriteIds, fetchListings } from "@/lib/queries";
import type { SortOption } from "@/lib/taxonomy";
import { ListingCard } from "@/components/listing-card";
import { ListingFilters } from "@/components/listing-filters";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function numParam(value: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await ensureSeeded();
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const user = await getCurrentUser();

  const q = single(params.q);
  const city = single(params.city);
  const type = single(params.type);
  const deal = single(params.deal);
  const minPrice = numParam(single(params.minPrice));
  const maxPrice = numParam(single(params.maxPrice));
  const rooms = numParam(single(params.rooms));
  const sort = (single(params.sort) || "newest") as SortOption;

  const filters = {
    q: q || undefined,
    city: city || undefined,
    type: type || undefined,
    deal: deal || undefined,
    minPrice,
    maxPrice,
    rooms,
    sort,
    limit: 60,
  };

  const [items, total, favoriteIds] = await Promise.all([
    fetchListings(filters),
    countListings(filters),
    fetchFavoriteIds(user?.id),
  ]);
  const favorites = new Set(favoriteIds);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="section-title">{t(locale, "catalog.title")}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {total} {t(locale, "catalog.found")}
          {city ? ` · ${city}` : ""}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<div className="skeleton h-96 w-full" />}>
            <ListingFilters locale={locale} />
          </Suspense>
        </aside>

        <section>
          {items.length === 0 ? (
            <EmptyState
              icon="🔍"
              title={t(locale, "catalog.emptyTitle")}
              text={t(locale, "catalog.emptyText")}
              actionLabel={t(locale, "action.reset")}
              actionHref="/listings"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  locale={locale}
                  favorite={favorites.has(listing.id)}
                  isAuthed={Boolean(user)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
