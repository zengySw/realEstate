import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureSeeded } from "@/db/seed";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import {
  formatDate,
  formatNumber,
  formatPrice,
  pluralArea,
  t,
} from "@/lib/i18n";
import {
  fetchAgent,
  fetchFavoriteIds,
  fetchListingById,
  fetchListings,
} from "@/lib/queries";
import {
  dealTypeKey,
  featureIcon,
  featureLabel,
  listingStatusKey,
  propertyTypeKey,
} from "@/lib/taxonomy";
import { Gallery } from "@/components/gallery";
import { InquiryForm } from "@/components/inquiry-form";
import { FavoriteButton } from "@/components/favorite-button";
import { ListingCard } from "@/components/listing-card";
import { StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  await ensureSeeded();
  const [{ id }, locale, user] = await Promise.all([params, getLocale(), getCurrentUser()]);
  const listingId = Number.parseInt(id, 10);
  if (!Number.isFinite(listingId)) notFound();

  const listing = await fetchListingById(listingId);
  if (!listing) notFound();

  const [agent, favoriteIds, similar] = await Promise.all([
    fetchAgent(listing.userId),
    fetchFavoriteIds(user?.id),
    fetchListings({
      city: listing.city,
      excludeId: listing.id,
      limit: 3,
    }),
  ]);

  const isAuthed = Boolean(user);
  const title = locale === "ru" && listing.titleRu ? listing.titleRu : listing.title;
  const description =
    locale === "ru" && listing.descriptionRu ? listing.descriptionRu : listing.description;

  const specs = [
    listing.area > 0 ? { label: t(locale, "field.area"), value: pluralArea(listing.area, locale) } : null,
    listing.rooms > 0 ? { label: t(locale, "field.rooms"), value: String(listing.rooms) } : null,
    listing.bedrooms > 0 ? { label: t(locale, "field.bedrooms"), value: String(listing.bedrooms) } : null,
    listing.bathrooms > 0 ? { label: t(locale, "field.bathrooms"), value: String(listing.bathrooms) } : null,
    listing.totalFloors > 0
      ? { label: t(locale, "field.floor"), value: `${listing.floor} / ${listing.totalFloors}` }
      : null,
    listing.landArea > 0
      ? {
          label: t(locale, "field.landArea"),
          value: `${formatNumber(listing.landArea, locale)} ${t(locale, "misc.sotka")}`,
        }
      : null,
    listing.yearBuilt > 0 ? { label: t(locale, "field.yearBuilt"), value: String(listing.yearBuilt) } : null,
    {
      label: t(locale, "field.price"),
      value: `${formatPrice(listing.area > 0 ? Math.round(listing.price / listing.area) : listing.price, locale)} ${t(locale, "listing.squareMeter")}`,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-700">
          {t(locale, "nav.home")}
        </Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-brand-700">
          {t(locale, "nav.catalog")}
        </Link>
        <span>/</span>
        <span className="truncate font-medium text-slate-700">{title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <Gallery images={listing.images} alt={title} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">{t(locale, propertyTypeKey(listing.propertyType))}</span>
                <StatusBadge status={listing.status} locale={locale} />
                <span className="chip">
                  {t(locale, dealTypeKey(listing.dealType))}
                </span>
              </div>
              <h1 className="mt-3 text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                📍 {listing.city}
                {listing.district ? `, ${listing.district}` : ""}
                {listing.address ? `, ${listing.address}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-brand-700 sm:text-3xl">
                {formatPrice(listing.price, locale)}
              </p>
              {listing.dealType === "rent" ? (
                <p className="text-xs text-slate-500">{t(locale, "listing.perMonth")}</p>
              ) : null}
            </div>
          </div>

          <section className="card mt-6 p-6">
            <h2 className="text-base font-bold text-slate-900">{t(locale, "listing.details")}</h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-slate-600">
              {description}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-slate-900">{spec.value}</dd>
                </div>
              ))}
            </dl>

            {listing.features.length > 0 ? (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  {t(locale, "field.features")}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {listing.features.map((feature) => (
                    <li
                      key={feature}
                      className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      <span aria-hidden>{featureIcon(feature)}</span>
                      {featureLabel(feature, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              {t(locale, "listing.agent")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-lg font-bold text-brand-800">
                {(agent?.name ?? "?").slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{agent?.name ?? "—"}</p>
                <p className="text-xs text-slate-500">{agent?.city || listing.city}</p>
              </div>
            </div>
            {agent?.bio ? (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">{agent.bio}</p>
            ) : null}
            <div className="mt-4 grid gap-2">
              <a href={`tel:${(agent?.phone ?? "").replace(/\s/g, "")}`} className="btn-primary w-full">
                📞 {t(locale, "action.call")}
              </a>
              <FavoriteButton
                listingId={listing.id}
                initialFavorite={favoriteIds.includes(listing.id)}
                isAuthed={isAuthed}
                locale={locale}
                variant="inline"
              />
            </div>
            <p className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              <span>
                {t(locale, "listing.published")} {formatDate(listing.createdAt, locale)}
              </span>
              <span>
                👁 {formatNumber(listing.views, locale)} {t(locale, "listing.views")}
              </span>
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-base font-bold text-slate-900">{t(locale, "inquiry.title")}</h2>
            <p className="mt-1 mb-4 text-xs text-slate-500">{t(locale, "inquiry.sub")}</p>
            <InquiryForm
              locale={locale}
              listingId={listing.id}
              listingCity={listing.city}
              defaultName={user?.name}
              defaultPhone={user?.phone}
              defaultEmail={user?.email}
              isAuthenticated={isAuthed}
            />
          </div>

          <div className="card bg-brand-50 p-6">
            <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
              {t(locale, "listing.details")}
            </p>
            <p className="mt-2 text-sm text-brand-900/80">
              {t(locale, listingStatusKey(listing.status))} · {t(locale, "brand.tagline")}
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="mt-14">
          <h2 className="section-title">{t(locale, "listing.similar")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                locale={locale}
                favorite={favoriteIds.includes(item.id)}
                isAuthed={isAuthed}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
