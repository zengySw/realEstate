import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const [locale, user] = await Promise.all([getLocale(), getCurrentUser()]);
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="order-2 lg:order-1">
        <div className="card p-7 sm:p-9">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {t(locale, "auth.registerTitle")}
          </h1>
          <p className="mt-1.5 mb-6 text-sm text-slate-500">{t(locale, "auth.registerSub")}</p>
          <AuthForm mode="register" locale={locale} nextPath="/dashboard" />
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative h-56 overflow-hidden rounded-3xl lg:h-full lg:min-h-[560px]">
          <Image
            src="https://images.pexels.com/photos/6032280/pexels-photo-6032280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=900"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
          <div className="absolute bottom-0 space-y-4 p-7">
            {[
              { icon: "♥", text: t(locale, "favorites.sub") },
              { icon: "📅", text: t(locale, "home.how2d") },
              { icon: "📈", text: t(locale, "home.trust2d") },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/20 text-sm text-white backdrop-blur">
                  {item.icon}
                </span>
                <p className="text-sm text-white/90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
