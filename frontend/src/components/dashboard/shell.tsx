"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoutButton } from "@/components/logout-button";
import { t, type Locale } from "@/lib/i18n";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: number;
};

export function DashboardShell({
  locale,
  user,
  counts,
  children,
}: {
  locale: Locale;
  user: { name: string; email: string; role: string };
  counts: { listings: number; requests: number; favorites: number };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = [
    { href: "/dashboard", label: t(locale, "side.overview"), icon: "◎" },
    {
      href: "/dashboard/listings",
      label: t(locale, "side.myListings"),
      icon: "⌂",
      badge: counts.listings,
    },
    {
      href: "/dashboard/requests",
      label: t(locale, "side.requests"),
      icon: "✉",
      badge: counts.requests,
    },
    {
      href: "/dashboard/favorites",
      label: t(locale, "side.favorites"),
      icon: "♥",
      badge: counts.favorites,
    },
    { href: "/dashboard/settings", label: t(locale, "side.settings"), icon: "⚙" },
  ];

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg text-white">
            ⌂
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-900">
            {t(locale, "brand.name")}
          </span>
        </Link>
      </div>

      <p className="px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        {t(locale, "nav.menu")}
      </p>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className={`text-base ${active ? "text-white" : "text-slate-400"}`}>
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-slate-100 p-4">
        <Link
          href="/dashboard/listings/new"
          onClick={() => setOpen(false)}
          className="btn-primary w-full text-xs"
        >
          + {t(locale, "listings.new")}
        </Link>
        <div className="flex items-center gap-2 rounded-xl bg-sand-50 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-sm font-bold text-brand-800">
            {user.name.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900">{user.name}</p>
            <p className="truncate text-[11px] text-slate-400">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <LanguageSwitcher locale={locale} />
          <LogoutButton locale={locale} />
        </div>
        <Link
          href="/listings"
          className="block text-center text-[11px] font-semibold text-slate-400 hover:text-brand-700"
        >
          ← {t(locale, "side.publicSite")}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
          {sidebar}
        </aside>

        {/* mobile top bar */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="btn-secondary btn-sm"
              aria-label="menu"
            >
              ☰
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                ⌂
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {t(locale, "brand.name")}
              </span>
            </Link>
            <div className="ml-auto">
              <LanguageSwitcher locale={locale} />
            </div>
          </header>

          {open ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="close"
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <div className="animate-fade-in absolute top-0 left-0 h-full w-72 bg-white shadow-xl">
                {sidebar}
              </div>
            </div>
          ) : null}

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
