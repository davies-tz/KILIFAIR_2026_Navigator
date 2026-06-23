import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned, QrCode } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-safari-forest text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(233,107,44,0.45),transparent_32%),linear-gradient(135deg,rgba(31,91,59,0.96),rgba(35,49,38,0.9))]" />
      <div className="relative mx-auto grid min-h-[78vh] max-w-6xl content-center gap-8 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm backdrop-blur">
            <CalendarDays size={16} />
            Magereza Ground, Arusha
          </div>
          <h1 className="font-serif text-5xl font-bold leading-tight md:text-7xl">KARIBU-KILIFAIR 2026</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/82 md:text-lg">
            A production-ready demo navigator with 480+ official exhibitors from the KARIBU-KILIFAIR 2026 booklet, indoor booth search, favorites, QR entry, analytics, and a demo route from Gate A.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/exhibitors" className="inline-flex items-center justify-center gap-2 rounded-md bg-safari-gold px-5 py-3 font-semibold text-safari-ink">
              Explore exhibitors
              <ArrowRight size={18} />
            </Link>
            <Link href="/map" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 px-5 py-3 font-semibold text-white">
              <MapPinned size={18} />
              Open floor map
            </Link>
          </div>
        </div>
        <div className="grid content-end">
          <div className="rounded-md border border-white/20 bg-white/12 p-4 backdrop-blur">
            <div className="aspect-[4/3] rounded-md bg-[linear-gradient(135deg,#FFF4DF_0_24%,#E96B2C_24%_36%,#1F5B3B_36%_68%,#C99A2E_68%_100%)] p-4">
              <div className="h-full rounded-md border-2 border-white/80 bg-white/20 p-4">
                <div className="grid h-full grid-cols-3 gap-3">
                  {["A", "B", "C", "D", "E", "F"].map((zone) => (
                    <div key={zone} className="grid place-items-center rounded bg-white/75 text-lg font-bold text-safari-forest">
                      {zone}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-white/80">
              <span>Official booth directory + indoor floor demo</span>
              <QrCode size={22} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
