import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { LOCALE_COOKIE } from "@/lib/constants";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, errors: ["unauthorized"] }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, errors: ["invalid_body"] }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ ok: false, errors: ["auth.errorRequired"] }, { status: 400 });

  const locale = body.locale === "ru" ? "ru" : "ua";

  await db
    .update(users)
    .set({
      name,
      phone: typeof body.phone === "string" ? body.phone.trim() : "",
      city: typeof body.city === "string" ? body.city.trim() : "",
      bio: typeof body.bio === "string" ? body.bio.trim() : "",
      role: body.role === "agent" ? "agent" : "buyer",
      locale,
    })
    .where(eq(users.id, user.id));

  const updated = await db
    .select({
      id: users.id,
      name: users.name,
      phone: users.phone,
      city: users.city,
      bio: users.bio,
      role: users.role,
      locale: users.locale,
    })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const response = Response.json({ ok: true, data: updated[0] });
  response.headers.append(
    "Set-Cookie",
    `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`,
  );
  return response;
}
