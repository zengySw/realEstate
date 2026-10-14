import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";
import { ensureSeeded } from "@/db/seed";

export async function POST(request: Request) {
  await ensureSeeded();
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, errors: ["invalid_body"] }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return Response.json({ ok: false, errors: ["auth.errorRequired"] }, { status: 400 });
  }

  const rows = await db
    .select({ id: users.id, passwordHash: users.passwordHash, locale: users.locale })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = rows[0];
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ ok: false, errors: ["auth.errorCreds"] }, { status: 401 });
  }

  await createSession(user.id);
  return Response.json({ ok: true, userId: user.id });
}
