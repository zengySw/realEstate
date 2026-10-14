import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { getLocale } from "@/lib/locale";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
