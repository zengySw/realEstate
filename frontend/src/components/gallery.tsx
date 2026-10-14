"use client";

import { useState } from "react";
import Image from "next/image";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);
  const current = safeImages[index];

  if (safeImages.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-100 text-5xl text-slate-300">
        ⌂
      </div>
    );
  }

  function move(step: number) {
    setIndex((prev) => (prev + step + safeImages.length) % safeImages.length);
  }

  return (
    <div>
      <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-100 sm:h-96">
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="animate-fade-in object-cover"
        />
        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="prev"
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-lg text-slate-700 shadow transition hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="next"
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-lg text-slate-700 shadow transition hover:bg-white"
            >
              ›
            </button>
            <span className="absolute right-3 bottom-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white">
              {index + 1} / {safeImages.length}
            </span>
          </>
        ) : null}
      </div>

      {safeImages.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {safeImages.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 cursor-pointer overflow-hidden rounded-xl ring-2 transition sm:h-20 ${
                i === index ? "ring-brand-500" : "ring-transparent hover:ring-brand-200"
              }`}
            >
              <Image src={image} alt="" fill sizes="160px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
