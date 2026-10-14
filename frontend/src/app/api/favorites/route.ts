import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { fetchFavoriteIds } from "@/lib/queries";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: true, data: [] });
  const data = await fetchFavoriteIds(user.id);
  return Response.json({ ok: true, data });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });

  let body: { listingId?: number };
  try {
    body = (await request.json()) as { listingId?: number };
  } catch {
    return Response.json({ ok: false, errors: ["invalid_body"] }, { status: 400 });
  }

  const listingId = Number(body.listingId);
  if (!Number.isFinite(listingId)) {
    return Response.json({ ok: false, errors: ["invalid_id"] }, { status: 400 });
  }

  const existing = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.listingId, listingId)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    return Response.json({ ok: true, favorited: false });
  }

  await db.insert(favorites).values({ userId: user.id, listingId });
  return Response.json({ ok: true, favorited: true });
}
