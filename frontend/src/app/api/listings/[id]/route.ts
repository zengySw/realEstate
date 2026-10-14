import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { listings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { fetchListingById } from "@/lib/queries";
import { jsonError, parseListingInput } from "@/lib/payload";

type Ctx = { params: Promise<{ id: string }> };

async function resolveId(context: Ctx): Promise<number | null> {
  const { id } = await context.params;
  const parsed = Number.parseInt(id, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET(_request: Request, context: Ctx) {
  const id = await resolveId(context);
  if (id === null) return jsonError(["invalid_id"], 400);

  const listing = await fetchListingById(id);
  if (!listing) return jsonError(["not_found"], 404);

  await db
    .update(listings)
    .set({ views: sql`${listings.views} + 1` })
    .where(eq(listings.id, id));

  return Response.json({ ok: true, data: listing });
}

export async function PATCH(request: Request, context: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });

  const id = await resolveId(context);
  if (id === null) return jsonError(["invalid_id"], 400);

  const existing = await fetchListingById(id);
  if (!existing) return jsonError(["not_found"], 404);
  if (existing.userId !== user.id) {
    return Response.json({ ok: false, errors: ["forbidden"] }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(["invalid_body"]);
  }

  const { data, errors } = parseListingInput(body);
  if (!data) return jsonError(errors);

  await db
    .update(listings)
    .set({ ...data, contactName: data.contactName || user.name, contactPhone: data.contactPhone || user.phone })
    .where(eq(listings.id, id));

  const updated = await fetchListingById(id);
  return Response.json({ ok: true, data: updated });
}

export async function DELETE(_request: Request, context: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });

  const id = await resolveId(context);
  if (id === null) return jsonError(["invalid_id"], 400);

  const existing = await fetchListingById(id);
  if (!existing) return jsonError(["not_found"], 404);
  if (existing.userId !== user.id) {
    return Response.json({ ok: false, errors: ["forbidden"] }, { status: 403 });
  }

  await db.delete(listings).where(eq(listings.id, id));
  return Response.json({ ok: true });
}
