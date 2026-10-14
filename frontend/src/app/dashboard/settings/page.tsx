import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { formatDate, t } from "@/lib/i18n";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  const user = await requireUser();
  const locale = await getLocale();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
          {t(locale, "dash.title")}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {t(locale, "settings.title")}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">{t(locale, "settings.sub")}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SettingsForm
          locale={locale}
          user={{
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            bio: user.bio,
            role: user.role,
            locale: user.locale,
          }}
        />

        <div className="card h-fit p-6">
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            {locale === "ua" ? "Акаунт" : "Аккаунт"}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-xl font-bold text-brand-800">
              {user.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">{t(locale, "field.role")}</dt>
              <dd className="font-semibold text-slate-800">
                {t(locale, user.role === "agent" ? "role.agent" : "role.buyer")}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">
                {locale === "ua" ? "З нами з" : "С нами с"}
              </dt>
              <dd className="font-semibold text-slate-800">
                {formatDate(user.createdAt, locale)}
              </dd>
            </div>
          </dl>
          <div className="mt-6 rounded-xl bg-sand-100 p-4">
            <p className="text-xs leading-relaxed text-slate-600">
              {locale === "ua"
                ? "Зміна мови тут оновлює й мову інтерфейсу сайту."
                : "Смена языка здесь также меняет язык интерфейса сайта."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
