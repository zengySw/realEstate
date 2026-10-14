import { FEATURE_KEYS } from "@/lib/taxonomy";

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function num(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function list(value: unknown, allowed?: string[]): string[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  const cleaned = raw
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item) => (allowed ? allowed.includes(item) : true));
  return Array.from(new Set(cleaned));
}

export type ListingInput = {
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  propertyType: string;
  status: string;
  dealType: string;
  price: number;
  city: string;
  district: string;
  address: string;
  area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  landArea: number;
  yearBuilt: number;
  features: string[];
  images: string[];
  contactName: string;
  contactPhone: string;
  featured: number;
  updatedAt: Date;
};

export function parseListingInput(body: unknown): {
  data: ListingInput | null;
  errors: string[];
} {
  if (typeof body !== "object" || body === null) {
    return { data: null, errors: ["invalid_body"] };
  }
  const b = body as Record<string, unknown>;

  const title = str(b.title);
  const city = str(b.city);
  const price = Math.round(num(b.price));
  const errors: string[] = [];
  if (!title) errors.push("title_required");
  if (!city) errors.push("city_required");
  if (price <= 0) errors.push("price_required");

  const titleRu = str(b.titleRu) || title;
  const descriptionRu = str(b.descriptionRu) || str(b.description);

  const data: ListingInput = {
    title,
    titleRu,
    description: str(b.description),
    descriptionRu,
    propertyType: str(b.propertyType, "apartment") || "apartment",
    status: str(b.status, "active") || "active",
    dealType: str(b.dealType, "sale") || "sale",
    price,
    city,
    district: str(b.district),
    address: str(b.address),
    area: num(b.area),
    rooms: Math.round(num(b.rooms)),
    bedrooms: Math.round(num(b.bedrooms)),
    bathrooms: Math.round(num(b.bathrooms)),
    floor: Math.round(num(b.floor)),
    totalFloors: Math.round(num(b.totalFloors)),
    landArea: num(b.landArea),
    yearBuilt: Math.round(num(b.yearBuilt)),
    features: list(b.features, FEATURE_KEYS),
    images: list(b.images),
    contactName: str(b.contactName),
    contactPhone: str(b.contactPhone),
    featured: b.featured ? 1 : 0,
    updatedAt: new Date(),
  };

  return { data: errors.length ? null : data, errors };
}

export type RequestInput = {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  message: string;
  budget: number;
  preferredCity: string;
  status: string;
  viewingAt: Date | null;
  agentNote: string;
  listingId: number | null;
  updatedAt: Date;
};

export function parseRequestInput(body: unknown, partial = false): {
  data: Partial<RequestInput> | null;
  errors: string[];
} {
  if (typeof body !== "object" || body === null) return { data: null, errors: ["invalid_body"] };
  const b = body as Record<string, unknown>;
  const errors: string[] = [];

  const clientName = str(b.clientName);
  const clientPhone = str(b.clientPhone);
  if (!partial) {
    if (!clientName) errors.push("name_required");
    if (!clientPhone) errors.push("phone_required");
  }

  const viewingRaw = str(b.viewingAt);
  const viewingAt = viewingRaw ? new Date(viewingRaw) : null;

  const data: Partial<RequestInput> = { updatedAt: new Date() };
  if (!partial || b.clientName !== undefined) data.clientName = clientName;
  if (!partial || b.clientPhone !== undefined) data.clientPhone = clientPhone;
  if (b.clientEmail !== undefined) data.clientEmail = str(b.clientEmail);
  if (b.message !== undefined) data.message = str(b.message);
  if (b.budget !== undefined) data.budget = Math.round(num(b.budget));
  if (b.preferredCity !== undefined) data.preferredCity = str(b.preferredCity);
  if (b.status !== undefined) data.status = str(b.status, "new") || "new";
  if (b.agentNote !== undefined) data.agentNote = str(b.agentNote);
  if (b.listingId !== undefined) data.listingId = b.listingId ? Math.round(num(b.listingId)) : null;
  data.viewingAt = viewingAt && !Number.isNaN(viewingAt.getTime()) ? viewingAt : null;

  return { data: errors.length ? null : data, errors };
}

export function jsonError(errors: string[], status = 400) {
  return Response.json({ ok: false, errors }, { status });
}
