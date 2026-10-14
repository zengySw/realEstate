"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";

export function LogoutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy || pending}
      className="btn-ghost w-full justify-start px-3 text-sm sm:w-auto sm:justify-center"
    >
      {busy || pending ? <Spinner /> : <span aria-hidden>⎋</span>}
      {t(locale, "nav.logout")}
    </button>
  );
}
