import { ensureSeeded, resetAndSeed } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();
  return Response.json({ ok: true, seeded: true });
}

export async function POST() {
  await resetAndSeed();
  return Response.json({ ok: true, reset: true });
}
