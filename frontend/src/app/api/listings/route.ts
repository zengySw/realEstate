import { db } from "@/db";
import { listings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { fetchListingById, fetchListings } from "@/lib/queries";
import { jsonError, parseListingInput } from "@/lib/payload";
import type { SortOption } from "@/lib/taxonomy";

function numberParam(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const p = url.searchParams;
  const data = await fetchListings({
    q: p.get("q") ?? undefined,
    city: p.get("city") ?? undefined,
    type: p.get("type") ?? undefined,
    deal: p.get("deal") ?? undefined,
    status: p.get("status") ?? undefined,
    minPrice: numberParam(p.get("minPrice")),
    maxPrice: numberParam(p.get("maxPrice")),
    rooms: numberParam(p.get("rooms")),
    sort: (p.get("sort") as SortOption | null) ?? undefined,
    limit: numberParam(p.get("limit")),
  });
  return Response.json({ ok: true, data });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(["invalid_body"]);
  }

  const { data, errors } = parseListingInput(body);
  if (!data) return jsonError(errors);

  const inserted = await db
    .insert(listings)
    .values({
      ...data,
      userId: user.id,
      contactName: data.contactName || user.name,
      contactPhone: data.contactPhone || user.phone,
    })
    .$returningId();

  const newListing = await fetchListingById(inserted[0].id);
  return Response.json({ ok: true, data: newListing }, { status: 201 });
}
