import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import type { ExhibitorWithBooth } from "@/types";

export function ExhibitorCard({ exhibitor }: { exhibitor: ExhibitorWithBooth }) {
  return (
    <article className="rounded-md border border-safari-gold/20 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-safari-orange">{exhibitor.category.name}</p>
          <h2 className="mt-1 text-lg font-bold text-safari-ink">{exhibitor.companyName}</h2>
        </div>
        {exhibitor.booth ? (
          <span className="rounded-md bg-safari-cream px-3 py-1 text-sm font-bold text-safari-forest">{exhibitor.booth.boothNumber}</span>
        ) : null}
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-safari-ink/70">{exhibitor.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {exhibitor.services.slice(0, 4).map((service) => (
          <span key={service} className="rounded-full bg-safari-forest/8 px-3 py-1 text-xs font-medium text-safari-forest">
            {service}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2">
        <Link href={`/exhibitors/${exhibitor.id}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-safari-forest px-3 py-2 text-sm font-semibold text-white">
          Details
          <ExternalLink size={16} />
        </Link>
        <Link href={`/map?booth=${exhibitor.booth?.boothNumber ?? ""}`} className="grid h-10 w-10 place-items-center rounded-md border border-safari-gold/30 text-safari-forest" aria-label="Show booth on map">
          <MapPin size={18} />
        </Link>
      </div>
    </article>
  );
}
