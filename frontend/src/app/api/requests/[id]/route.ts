import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { requests } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, parseRequestInput } from "@/lib/payload";

type Ctx = { params: Promise<{ id: string }> };

async function resolveId(context: Ctx): Promise<number | null> {
  const { id } = await context.params;
  const parsed = Number.parseInt(id, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function PATCH(request: Request, context: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });

  const id = await resolveId(context);
  if (id === null) return jsonError(["invalid_id"], 400);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(["invalid_body"]);
  }

  const { data, errors } = parseRequestInput(body, true);
  if (!data) return jsonError(errors);

  await db
    .update(requests)
    .set(data)
    .where(and(eq(requests.id, id), eq(requests.userId, user.id)));

  const updated = await db.select().from(requests).where(eq(requests.id, id)).limit(1);
  if (updated.length === 0) return jsonError(["not_found"], 404);
  return Response.json({ ok: true, data: updated[0] });
}

export async function DELETE(_request: Request, context: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });

  const id = await resolveId(context);
  if (id === null) return jsonError(["invalid_id"], 400);

  const existing = await db.select({ id: requests.id }).from(requests).where(and(eq(requests.id, id), eq(requests.userId, user.id))).limit(1);
  if (existing.length === 0) return jsonError(["not_found"], 404);

  await db.delete(requests).where(and(eq(requests.id, id), eq(requests.userId, user.id)));
  return Response.json({ ok: true });
}
