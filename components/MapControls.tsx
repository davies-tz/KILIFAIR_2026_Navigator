"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { LocateMeButton } from "@/components/LocateMeButton";
import type { LocationStatus, MapCategory } from "@/types";

type Props = {
  categories: MapCategory[];
  category: string;
  locationStatus: LocationStatus;
  query: string;
  resultCount: number;
  selectedBooth?: string;
  onCategoryChange: (category: string) => void;
  onLocate: () => void;
  onQueryChange: (query: string) => void;
  onReset: () => void;
};

export function MapControls({
  categories,
  category,
  locationStatus,
  query,
  resultCount,
  selectedBooth,
  onCategoryChange,
  onLocate,
  onQueryChange,
  onReset
}: Props) {
  return (
    <section className="absolute left-3 right-3 top-3 z-[900] rounded-md border border-safari-gold/20 bg-white/95 p-3 shadow-soft backdrop-blur md:left-6 md:right-auto md:w-[26rem]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-safari-orange">KILIFAIR booth map</p>
          <h1 className="truncate text-lg font-bold text-safari-ink">Find and navigate booths</h1>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-safari-cream text-safari-forest transition active:scale-[0.97]"
          aria-label="Reset map"
          title="Reset map"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        <label className="flex min-h-12 items-center gap-2 rounded-md border border-safari-gold/30 bg-white px-3">
          <Search size={18} className="shrink-0 text-safari-forest" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search company, booth, service"
            className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-safari-ink/45 md:text-sm"
          />
        </label>

        <label className="flex min-h-12 items-center gap-2 rounded-md border border-safari-gold/30 bg-white px-3">
          <SlidersHorizontal size={18} className="shrink-0 text-safari-forest" />
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-base font-medium text-safari-ink outline-none md:text-sm"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <LocateMeButton status={locationStatus} onClick={onLocate} />
        {selectedBooth ? (
          <span className="grid min-h-11 shrink-0 place-items-center rounded-md bg-safari-cream px-3 text-sm font-bold text-safari-forest">
            {selectedBooth}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-xs font-medium text-safari-ink/60">
        {resultCount} booth{resultCount === 1 ? "" : "s"} visible
      </p>
    </section>
  );
}
