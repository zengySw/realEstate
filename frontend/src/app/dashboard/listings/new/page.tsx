import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { emptyListingValues } from "@/lib/listing-defaults";
import { ListingForm } from "@/components/dashboard/listing-form";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const user = await requireUser();
  const locale = await getLocale();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
          {t(locale, "listings.title")}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {t(locale, "listings.new")}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">{t(locale, "listings.sub")}</p>
      </header>

      <ListingForm
        locale={locale}
        mode="create"
        initial={emptyListingValues(user.name, user.phone)}
      />
    </div>
  );
}
