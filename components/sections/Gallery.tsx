"use client";

import { useState } from "react";

interface GalleryProps {
  images: { url: string; alt: string }[];
  title?: string;
}

export function Gallery({ images, title = "Galeria" }: GalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
          {title}
        </h2>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 text-2xl text-white"
            aria-label="Cerrar"
          >
            X
          </button>
          <img
            src={images[selected].url}
            alt={images[selected].alt}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        </div>
      )}
    </section>
  );
}
