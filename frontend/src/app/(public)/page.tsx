import Image from "next/image";
import Link from "next/link";
import { ensureSeeded } from "@/db/seed";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { formatNumber, t } from "@/lib/i18n";
import { countListings, fetchFavoriteIds, fetchListings } from "@/lib/queries";
import { ListingCard } from "@/components/listing-card";
import { SearchBar } from "@/components/search-bar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();
  const locale = await getLocale();
  const user = await getCurrentUser();

  const [featured, latest, total, favoriteIds] = await Promise.all([
    fetchListings({ featuredOnly: true, status: "active", limit: 6 }),
    fetchListings({ status: "active", limit: 3 }),
    countListings({ status: "active" }),
    fetchFavoriteIds(user?.id),
  ]);

  const favorites = new Set(favoriteIds);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-900">
        <Image
          src="https://images.pexels.com/photos/7061662/pexels-photo-7061662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1900"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900/90 via-brand-800/80 to-slate-900/85" />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
              ● {t(locale, "hero.badge")}
            </span>
            <h1 className="animate-fade-up mt-5 text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t(locale, "hero.title")}
            </h1>
            <p className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-brand-50/90 sm:text-lg">
              {t(locale, "hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/listings" className="btn bg-white px-5 text-brand-800 hover:bg-brand-50">
                {t(locale, "hero.cta")}
              </Link>
              <Link
                href={user ? "/dashboard/listings/new" : "/register"}
                className="btn border border-white/40 bg-white/10 px-5 text-white backdrop-blur hover:bg-white/20"
              >
                {t(locale, "hero.cta2")}
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <SearchBar locale={locale} />
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-6 text-white">
            <div>
              <dt className="text-xs text-brand-100/80 uppercase">{t(locale, "hero.stat1")}</dt>
              <dd className="mt-1 text-2xl font-extrabold sm:text-3xl">{total}+</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-100/80 uppercase">{t(locale, "hero.stat2")}</dt>
              <dd className="mt-1 text-2xl font-extrabold sm:text-3xl">
                {locale === "ua" ? "38 дн." : "38 дн."}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brand-100/80 uppercase">{t(locale, "hero.stat3")}</dt>
              <dd className="mt-1 text-2xl font-extrabold sm:text-3xl">87%</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t(locale, "home.featured")}</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500">{t(locale, "home.featuredSub")}</p>
          </div>
          <Link href="/listings" className="btn-secondary btn-sm">
            {t(locale, "action.viewAll")} →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              locale={locale}
              favorite={favorites.has(listing.id)}
              isAuthed={Boolean(user)}
            />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">{t(locale, "home.howTitle")}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", title: t(locale, "home.how1t"), text: t(locale, "home.how1d") },
              { n: "02", title: t(locale, "home.how2t"), text: t(locale, "home.how2d") },
              { n: "03", title: t(locale, "home.how3t"), text: t(locale, "home.how3d") },
            ].map((step) => (
              <div key={step.n} className="animate-fade-up rounded-2xl bg-sand-50 p-6">
                <span className="text-sm font-black tracking-widest text-brand-500">{step.n}</span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest + trust */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="section-title">{t(locale, "home.new")}</h2>
            <p className="mt-2 text-sm text-slate-500">{t(locale, "home.newSub")}</p>
            <div className="mt-6 space-y-4">
              {latest.map((listing) => {
                const title =
                  locale === "ru" && listing.titleRu ? listing.titleRu : listing.title;
                return (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="card animate-fade-up group flex gap-4 p-3 transition hover:shadow-md"
                  >
                    <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {listing.images[0] ? (
                        <Image
                          src={listing.images[0]}
                          alt={title}
                          fill
                          sizes="140px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900 group-hover:text-brand-700">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {listing.city}
                        {listing.district ? `, ${listing.district}` : ""}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span>
                          {listing.area > 0
                            ? `${formatNumber(listing.area, locale)} ${t(locale, "misc.m2")}`
                            : "—"}
                        </span>
                        {listing.rooms > 0 ? (
                          <span>
                            {listing.rooms} {locale === "ua" ? "кімн." : "комн."}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center pr-1">
                      <span className="text-sm font-extrabold text-brand-700">
                        {formatNumber(listing.price, locale)} ₴
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="section-title">{t(locale, "home.trust")}</h2>
            <div className="mt-6 space-y-4">
              {[
                { icon: "🛡️", title: t(locale, "home.trust1t"), text: t(locale, "home.trust1d") },
                { icon: "💬", title: t(locale, "home.trust2t"), text: t(locale, "home.trust2d") },
                { icon: "🌍", title: t(locale, "home.trust3t"), text: t(locale, "home.trust3d") },
              ].map((item) => (
                <div key={item.title} className="card animate-fade-up flex gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-brand-800 px-6 py-12 text-center sm:px-12">
          <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-300/20 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight text-white">
            {t(locale, "home.ctaTitle")}
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-brand-50/90">
            {t(locale, "home.ctaText")}
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Link href={user ? "/dashboard" : "/register"} className="btn bg-white px-5 text-brand-800 hover:bg-brand-50">
              {user ? t(locale, "nav.dashboard") : t(locale, "nav.register")}
            </Link>
            <Link
              href="/listings"
              className="btn border border-white/40 bg-white/10 px-5 text-white hover:bg-white/20"
            >
              {t(locale, "hero.cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
