"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ListingCard, type ListingCardData } from "@/components/listing-card";
import { t, type Locale } from "@/lib/i18n";

export function FavoritesGrid({
  items,
  locale,
  favoriteIds,
}: {
  items: ListingCardData[];
  locale: Locale;
  favoriteIds: number[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState(items);
  const [toast, setToast] = useState<string | null>(null);

  function handleFavoriteChange(listingId: number, favorite: boolean) {
    if (!favorite) {
      // Removed from favorites - remove from local state
      setRows((current) => current.filter((row) => row.id !== listingId));
      setToast(t(locale, "favorites.removed"));
      setTimeout(() => setToast(null), 2200);
      startTransition(() => router.refresh());
    }
  }

  return (
    <div>
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
            ♥
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {t(locale, "favorites.emptyTitle")}
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-slate-500">
            {t(locale, "favorites.emptyText")}
          </p>
          <a href="/listings" className="btn-primary mt-5">
            {t(locale, "hero.cta")}
          </a>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              locale={locale}
              favorite
              isAuthed
              onFavoriteChange={handleFavoriteChange}
            />
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
