import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocale } from "@/lib/locale";
import { localeHtmlLang } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "SALO",
  description:
    "Будинки, котеджі та квартири у продажу в Одесі. Обирайте, зберігайте в обране та записуйтесь на перегляд.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={localeHtmlLang[locale]}>
      <body className="min-h-screen bg-sand-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
