import type { ListingFormValues } from "@/components/dashboard/listing-form";

export function emptyListingValues(
  contactName: string,
  contactPhone: string,
): ListingFormValues {
  return {
    title: "",
    titleRu: "",
    description: "",
    descriptionRu: "",
    propertyType: "house",
    status: "active",
    dealType: "sale",
    price: "",
    city: "",
    district: "",
    address: "",
    area: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    totalFloors: "",
    landArea: "",
    yearBuilt: "",
    features: [],
    images: "",
    contactName,
    contactPhone,
    featured: false,
  };
}
