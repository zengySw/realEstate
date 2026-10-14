import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { listings, requests, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { fetchRequests } from "@/lib/queries";
import { jsonError, parseRequestInput } from "@/lib/payload";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });
  const data = await fetchRequests(user.id);
  return Response.json({ ok: true, data });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(["invalid_body"]);
  }

  const { data, errors } = parseRequestInput(body);
  if (!data) return jsonError(errors);

  const user = await getCurrentUser();

  let ownerId = user?.id;
  if (!ownerId) {
    // Anonymous visitor: the lead is routed to the listing owner (or the first broker).
    if (data.listingId) {
      const rows = await db
        .select({ userId: listings.userId })
        .from(listings)
        .where(eq(listings.id, data.listingId))
        .limit(1);
      ownerId = rows[0]?.userId;
    }
    if (!ownerId) {
      const rows = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "agent"))
        .orderBy(asc(users.id))
        .limit(1);
      ownerId = rows[0]?.id;
    }
  }
  if (!ownerId) return jsonError(["unauthorized"], 401);

  const inserted = await db
    .insert(requests)
    .values({
      userId: ownerId,
      listingId: data.listingId ?? null,
      clientName: data.clientName ?? user?.name ?? "",
      clientPhone: data.clientPhone ?? user?.phone ?? "",
      clientEmail: data.clientEmail ?? user?.email ?? "",
      message: data.message ?? "",
      budget: data.budget ?? 0,
      preferredCity: data.preferredCity ?? "",
      status: data.status ?? "new",
      viewingAt: data.viewingAt ?? null,
      agentNote: user ? data.agentNote ?? "" : "guest",
    })
    .$returningId();

  const newRequest = await db.select().from(requests).where(eq(requests.id, inserted[0].id)).limit(1);
  return Response.json({ ok: true, data: newRequest[0] }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });
  const url = new URL(request.url);
  const id = Number.parseInt(url.searchParams.get("id") ?? "", 10);
  if (!Number.isFinite(id)) return jsonError(["invalid_id"], 400);
  await db.delete(requests).where(and(eq(requests.id, id), eq(requests.userId, user.id)));
  return Response.json({ ok: true });
}
