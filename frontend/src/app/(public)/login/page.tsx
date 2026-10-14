import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [locale, user, params] = await Promise.all([
    getLocale(),
    getCurrentUser(),
    searchParams,
  ]);
  if (user) redirect("/dashboard");

  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="order-2 lg:order-1">
        <div className="card p-7 sm:p-9">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {t(locale, "auth.loginTitle")}
          </h1>
          <p className="mt-1.5 mb-6 text-sm text-slate-500">{t(locale, "auth.loginSub")}</p>
          <AuthForm mode="login" locale={locale} nextPath={nextPath} />
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative h-56 overflow-hidden rounded-3xl lg:h-full lg:min-h-[520px]">
          <Image
            src="https://images.pexels.com/photos/8469931/pexels-photo-8469931.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=900"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
          <div className="absolute bottom-0 p-7">
            <p className="text-xl font-extrabold text-white">{t(locale, "hero.title")}</p>
            <p className="mt-2 text-sm text-brand-50/90">{t(locale, "home.ctaText")}</p>
            <Link href="/listings" className="btn mt-5 bg-white/95 text-brand-800 hover:bg-white">
              {t(locale, "hero.cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
