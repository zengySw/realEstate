import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoutButton } from "@/components/logout-button";
import "@public/icons/Salo_purple.svg";
import Image from 'next/image'

export async function SiteHeader() {
  const [locale, user] = await Promise.all([getLocale(), getCurrentUser()]);

  const nav = [
    { href: "/", label: t(locale, "nav.home") },
    { href: "/listings?type=house", label: t(locale, "nav.houses") },
    { href: "/listings?type=apartment", label: t(locale, "nav.apartments") },
    { href: "/listings", label: t(locale, "nav.catalog") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/icons/Salo_purple.svg" alt={t(locale, "brand.name")} className=" " width={70} height={50}   />
          <span className="flex flex-col leading-none">


          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/dashboard" className="btn-primary btn-sm">
                {t(locale, "nav.dashboard")}
              </Link>
              <LogoutButton locale={locale} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-secondary btn-sm">
                {t(locale, "nav.login")}
              </Link>
              <Link href="/register" className="btn-primary btn-sm">
                {t(locale, "nav.register")}
              </Link>
            </div>
          )}

          <details className="relative lg:hidden">
            <summary className="btn-secondary btn-sm cursor-pointer list-none">☰</summary>
            <div className="animate-fade-in absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-1 h-px bg-slate-100" />
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {t(locale, "nav.dashboard")}
                  </Link>
                  <LogoutButton locale={locale} />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {t(locale, "nav.login")}
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    {t(locale, "nav.register")}
                  </Link>
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Awaited<ReturnType<typeof getLocale>> }) {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg text-white">
              ⌂
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {t(locale, "brand.name")}
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500">{t(locale, "brand.tagline")}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{t(locale, "nav.catalog")}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href="/listings?type=house" className="hover:text-brand-700">
                {t(locale, "nav.houses")}
              </Link>
            </li>
            <li>
              <Link href="/listings?type=apartment" className="hover:text-brand-700">
                {t(locale, "nav.apartments")}
              </Link>
            </li>
            <li>
              <Link href="/listings?type=cottage" className="hover:text-brand-700">
                {t(locale, "type.cottage")}
              </Link>
            </li>
            <li>
              <Link href="/listings?type=land" className="hover:text-brand-700">
                {t(locale, "type.land")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl bg-brand-50 p-5">
          <p className="text-sm font-bold text-brand-900">{t(locale, "footer.help")}</p>
          <p className="mt-2 text-sm text-brand-800/80">{t(locale, "footer.helpText")}</p>
          <p className="mt-4 text-sm font-semibold text-brand-900">+380 (67) 214-88-90</p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {t(locale, "brand.name")}. {t(locale, "footer.rights")}.
      </div>
    </footer>
  );
}
