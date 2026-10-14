"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import {
  formatCompactPrice,
  formatNumber,
  pluralArea,
  t,
  type Locale,
} from "@/lib/i18n";
import { listingStatusKey, propertyTypeKey } from "@/lib/taxonomy";

export type ListingCardData = {
  id: number;
  title: string;
  titleRu: string;
  city: string;
  district: string;
  price: number;
  dealType: string;
  status: string;
  propertyType: string;
  area: number;
  rooms: number;
  landArea: number;
  images: string[];
  featured: number;
  views: number;
};

export type ListingCardProps = {
  listing: ListingCardData;
  locale: Locale;
  favorite: boolean;
  isAuthed: boolean;
  compact?: boolean;
  onFavoriteChange?: (listingId: number, favorite: boolean) => void;
};

export function ListingCard({
  listing,
  locale,
  favorite,
  isAuthed,
  compact = false,
  onFavoriteChange,
}: ListingCardProps) {
  const title = locale === "ru" && listing.titleRu ? listing.titleRu : listing.title;
  const cover = listing.images[0];
  const isLand = listing.propertyType === "land";

  return (
    <article className="card group animate-fade-up relative flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className={`relative overflow-hidden ${compact ? "h-40" : "h-52"} bg-slate-100`}>
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-slate-300">⌂</div>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {listing.status !== "active" ? (
            <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
              {t(locale, listingStatusKey(listing.status))}
            </span>
          ) : null}
          {listing.featured ? (
            <span className="rounded-full bg-brand-600/95 px-2.5 py-1 text-[11px] font-bold text-white">
              ★ {locale === "ua" ? "Топ" : "Топ"}
            </span>
          ) : null}
        </div>

        <div className="absolute top-3 right-3">
          <FavoriteButton
            listingId={listing.id}
            initialFavorite={favorite}
            isAuthed={isAuthed}
            locale={locale}
            onChange={(fav) => onFavoriteChange?.(listing.id, fav)}
          />
        </div>

        <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur">
          <span className="text-sm font-extrabold text-slate-900">
            {formatCompactPrice(listing.price, locale)}
          </span>
          {listing.dealType === "rent" ? (
            <span className="text-xs text-slate-500">{t(locale, "listing.perMonth")}</span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-brand-700 uppercase">
          <span>{t(locale, propertyTypeKey(listing.propertyType))}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-400 normal-case">
            {listing.city}
            {listing.district ? `, ${listing.district}` : ""}
          </span>
        </div>

        <Link
          href={`/listings/${listing.id}`}
          className="mt-2 line-clamp-2 text-[15px] leading-snug font-bold text-slate-900 transition group-hover:text-brand-700"
        >
          {title}
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          {!isLand && listing.rooms > 0 ? (
            <span>
              {listing.rooms} {locale === "ua" ? "кімн." : "комн."}
            </span>
          ) : null}
          {listing.area > 0 ? <span>{pluralArea(listing.area, locale)}</span> : null}
          {listing.landArea > 0 ? (
            <span>
              {formatNumber(listing.landArea, locale)} {t(locale, "misc.sotka")}
            </span>
          ) : null}
          <span className="ml-auto flex items-center gap-1 text-slate-400">
            👁 {formatNumber(listing.views, locale)}
          </span>
        </div>

        <Link
          href={`/listings/${listing.id}`}
          className="btn-secondary btn-sm mt-4 w-full group-hover:border-brand-300 group-hover:bg-brand-50 group-hover:text-brand-700"
        >
          {t(locale, "action.details")}
        </Link>
      </div>
    </article>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-8 w-full" />
      </div>
    </div>
  );
}
