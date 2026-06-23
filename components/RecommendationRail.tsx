import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import type { ExhibitorWithBooth } from "@/types";

export function RecommendationRail({ exhibitors }: { exhibitors: ExhibitorWithBooth[] }) {
  if (!exhibitors.length) return null;

  return (
    <section className="mt-8 rounded-[2rem] border border-safari-gold/20 bg-white/90 p-4 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-safari-orange">
            <Sparkles size={15} /> Smart picks nearby
          </p>
          <h2 className="mt-1 text-xl font-black text-safari-ink">You may also visit</h2>
        </div>
        <Link href="/map" className="hidden items-center gap-2 text-sm font-bold text-safari-forest md:inline-flex">
          Open map <ArrowRight size={16} />
        </Link>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {exhibitors.map((exhibitor) => (
          <article key={exhibitor.id} className="rounded-2xl bg-safari-cream p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-black leading-tight text-safari-ink">{exhibitor.companyName}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-safari-forest">{exhibitor.booth?.boothNumber}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-safari-ink/65">{exhibitor.description}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/map?booth=${exhibitor.booth?.boothNumber ?? ""}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-safari-orange px-3 py-2 text-xs font-black text-white">
                <MapPin size={14} /> Navigate
              </Link>
              <Link href={`/exhibitors/${exhibitor.id}`} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-safari-forest">
                View
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
