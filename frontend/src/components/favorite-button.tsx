"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function FavoriteButton({
  listingId,
  initialFavorite,
  isAuthed,
  locale,
  variant = "floating",
  onChange,
}: {
  listingId: number;
  initialFavorite: boolean;
  isAuthed: boolean;
  locale: "ua" | "ru";
  variant?: "floating" | "inline" | "icon";
  onChange?: (favorite: boolean) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!isAuthed) {
      startTransition(() => router.push("/login?next=/listings"));
      return;
    }
    const next = !favorite;
    setFavorite(next); // optimistic
    setBusy(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const json = (await res.json()) as { ok?: boolean; favorited?: boolean };
      if (json.ok && typeof json.favorited === "boolean") {
        setFavorite(json.favorited);
        onChange?.(json.favorited);
      } else {
        setFavorite(!next);
        onChange?.(!next);
      }
    } catch {
      setFavorite(!next);
      onChange?.(!next);
    } finally {
      setBusy(false);
      startTransition(() => router.refresh());
    }
  }

  const heart = favorite ? "♥" : "♡";
  const label = favorite
    ? locale === "ua"
      ? "В обраному"
      : "В избранном"
    : locale === "ua"
      ? "В обране"
      : "В избранное";

  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy || isPending}
        aria-label={label}
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-lg backdrop-blur transition active:scale-90 ${
          favorite
            ? "border-rose-200 bg-rose-500 text-white"
            : "border-white/70 bg-white/85 text-slate-600 hover:text-rose-500"
        }`}
      >
        {heart}
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy || isPending}
        aria-label={label}
        className={`btn-secondary btn-sm ${favorite ? "border-rose-200 bg-rose-50 text-rose-600" : ""}`}
      >
        {heart}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || isPending}
      className={`btn ${favorite ? "border border-rose-200 bg-rose-50 text-rose-600" : "btn-secondary"}`}
    >
      <span aria-hidden className="text-base">
        {heart}
      </span>
      {label}
    </button>
  );
}
