"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Route } from "lucide-react";
import type { ExhibitorWithBooth } from "@/types";

const FAVORITES_STORAGE_KEY = "kilifair.favoriteBooths";

export function FavoritesClient({ exhibitors }: { exhibitors: ExhibitorWithBooth[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      try { setFavoriteIds(JSON.parse(saved)); } catch { setFavoriteIds([]); }
    }
  }, []);

  const favorites = useMemo(() => exhibitors.filter((item) => favoriteIds.includes(item.id)), [exhibitors, favoriteIds]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:pb-14">
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,#1F5B3B,#143D2A)] p-6 text-white shadow-soft">
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-white/70"><Heart size={17} /> Saved route plan</p>
        <h1 className="mt-3 text-3xl font-black">Your favorite booths</h1>
        <p className="mt-3 max-w-2xl leading-7 text-white/75">Build a personal expo walk list. Favorites are saved locally on this device so visitors can quickly return to key exhibitors during the fair.</p>
      </section>
      {favorites.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((exhibitor) => (
            <article key={exhibitor.id} className="rounded-[1.5rem] border border-safari-gold/20 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-safari-orange">{exhibitor.category.name}</p>
                  <h2 className="mt-1 text-lg font-black text-safari-ink">{exhibitor.companyName}</h2>
                </div>
                <span className="rounded-full bg-safari-cream px-3 py-1 text-xs font-black text-safari-forest">{exhibitor.booth?.boothNumber}</span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-safari-ink/70">{exhibitor.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href={`/map?booth=${exhibitor.booth?.boothNumber ?? ""}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-safari-orange px-3 py-2 text-sm font-black text-white"><Route size={16} /> Navigate</Link>
                <Link href={`/exhibitors/${exhibitor.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-safari-cream px-3 py-2 text-sm font-black text-safari-forest"><MapPin size={16} /> Details</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[1.5rem] bg-white p-8 text-center shadow-sm">
          <Heart className="mx-auto text-safari-orange" size={38} />
          <h2 className="mt-3 text-xl font-black text-safari-ink">No favorites yet</h2>
          <p className="mt-2 text-safari-ink/65">Open the map, select booths, then tap the heart icon.</p>
          <Link href="/map" className="mt-5 inline-flex rounded-xl bg-safari-forest px-4 py-3 font-black text-white">Open Map</Link>
        </div>
      )}
    </main>
  );
}
