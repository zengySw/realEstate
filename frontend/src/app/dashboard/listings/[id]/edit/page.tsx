import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { fetchListingById } from "@/lib/queries";
import { ListingForm, type ListingFormValues } from "@/components/dashboard/listing-form";

export const dynamic = "force-dynamic";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user, locale] = await Promise.all([params, requireUser(), getLocale()]);
  const listingId = Number.parseInt(id, 10);
  if (!Number.isFinite(listingId)) notFound();

  const listing = await fetchListingById(listingId);
  if (!listing || listing.userId !== user.id) notFound();

  const initial: ListingFormValues = {
    id: listing.id,
    title: listing.title,
    titleRu: listing.titleRu,
    description: listing.description,
    descriptionRu: listing.descriptionRu,
    propertyType: listing.propertyType,
    status: listing.status,
    dealType: listing.dealType,
    price: String(listing.price),
    city: listing.city,
    district: listing.district,
    address: listing.address,
    area: listing.area ? String(listing.area) : "",
    rooms: listing.rooms ? String(listing.rooms) : "",
    bedrooms: listing.bedrooms ? String(listing.bedrooms) : "",
    bathrooms: listing.bathrooms ? String(listing.bathrooms) : "",
    floor: listing.floor ? String(listing.floor) : "",
    totalFloors: listing.totalFloors ? String(listing.totalFloors) : "",
    landArea: listing.landArea ? String(listing.landArea) : "",
    yearBuilt: listing.yearBuilt ? String(listing.yearBuilt) : "",
    features: listing.features,
    images: listing.images.join(",\n"),
    contactName: listing.contactName,
    contactPhone: listing.contactPhone,
    featured: listing.featured === 1,
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
            {t(locale, "listings.title")}
          </p>
          <h1 className="mt-1 line-clamp-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {t(locale, "listings.edit")}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            ID #{listing.id} · {listing.city}
          </p>
        </div>
        <Link href={`/listings/${listing.id}`} className="btn-secondary">
          👁 {t(locale, "action.details")}
        </Link>
      </header>

      <ListingForm locale={locale} mode="edit" initial={initial} />
    </div>
  );
}
