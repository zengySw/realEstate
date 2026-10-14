import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";
import { ensureSeeded } from "@/db/seed";

export async function POST(request: Request) {
  await ensureSeeded();
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, errors: ["invalid_body"] }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const role = body.role === "agent" ? "agent" : "buyer";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const locale = body.locale === "ru" ? "ru" : "ua";

  if (!name || !email || password.length < 6) {
    return Response.json({ ok: false, errors: ["auth.errorRequired"] }, { status: 400 });
  }

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return Response.json({ ok: false, errors: ["auth.errorTaken"] }, { status: 409 });
  }

  const inserted = await db
    .insert(users)
    .values({ name, email, passwordHash: hashPassword(password), phone, role, city, locale })
    .$returningId();

  const userId = inserted[0].id;
  await createSession(userId);
  return Response.json({ ok: true, userId });
}
