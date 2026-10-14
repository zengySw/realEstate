import type { ReactNode } from "react";
import { ensureSeeded } from "@/db/seed";
import { requireUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { normalizeLocale } from "@/lib/i18n";
import { fetchDashboardStats } from "@/lib/queries";
import { DashboardShell } from "@/components/dashboard/shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const [user, rawLocale] = await Promise.all([requireUser(), getLocale()]);
  const locale = normalizeLocale(rawLocale);

  let stats = {
    total: 0,
    newRequests: 0,
    favorites: 0,
  };
  try {
    const full = await fetchDashboardStats(user.id);
    stats = {
      total: full.total,
      newRequests: full.newRequests,
      favorites: full.favorites,
    };
  } catch {
    // dashboard still renders if stats are unavailable
  }

  return (
    <DashboardShell
      locale={locale}
      user={{ name: user.name, email: user.email, role: user.role }}
      counts={{ listings: stats.total, requests: stats.newRequests, favorites: stats.favorites }}
    >
      {children}
    </DashboardShell>
  );
}
