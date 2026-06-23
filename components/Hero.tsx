import Link from "next/link";
import { ArrowRight, Bot, CalendarDays, MapPinned, QrCode, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-safari-forest text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(233,107,44,0.42),transparent_32%),linear-gradient(135deg,rgba(31,91,59,0.97),rgba(35,49,38,0.92))]" />

      <div className="relative mx-auto grid min-h-[78vh] max-w-6xl content-center gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm backdrop-blur">
            <CalendarDays size={16} />
            Magereza Ground, Arusha • June 4–7, 2026
          </div>

          <h1 className="font-serif text-5xl font-bold leading-tight md:text-7xl">
            KARIBU-KILIFAIR 2026 Navigator
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 md:text-lg">
            Find exhibitors, locate booths, scan QR checkpoints, and move from one point to another inside the expo with a smart indoor navigation experience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-safari-gold px-5 py-3 font-semibold text-safari-ink"
            >
              Open floor map
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/exhibitors"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 px-5 py-3 font-semibold text-white"
            >
              <Users size={18} />
              Explore exhibitors
            </Link>
          </div>
        </div>

        <div className="grid content-center">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/12 p-5">
                <p className="text-3xl font-bold text-safari-gold">480+</p>
                <p className="mt-1 text-sm text-white/80">Official exhibitors</p>
              </div>

              <div className="rounded-xl bg-white/12 p-5">
                <p className="text-3xl font-bold text-safari-gold">400+</p>
                <p className="mt-1 text-sm text-white/80">Booth locations</p>
              </div>

              <div className="rounded-xl bg-white/12 p-5">
                <MapPinned className="mb-3 text-safari-gold" size={28} />
                <p className="font-semibold">Indoor routing</p>
                <p className="mt-1 text-sm text-white/75">Move from Gate A, B2B, Food Court, VIP, or QR checkpoints.</p>
              </div>

              <div className="rounded-xl bg-white/12 p-5">
                <Bot className="mb-3 text-safari-gold" size={28} />
                <p className="font-semibold">AI Guide</p>
                <p className="mt-1 text-sm text-white/75">Search by interest: lodges, airlines, safari, Zanzibar, food, or safety.</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/15 bg-black/15 px-4 py-3 text-sm text-white/80">
              <span>QR checkpoints + booth-to-booth navigation ready</span>
              <QrCode size={22} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
