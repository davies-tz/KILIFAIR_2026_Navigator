import Link from "next/link";
import { Bot, MapPinned, ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-safari-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-safari-forest">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-safari-forest text-sm text-white">KF</span>
          <span>
            <span className="block text-sm leading-4">KARIBU-KILIFAIR</span>
            <span className="block text-xs font-medium text-safari-ink/60">2026 Navigator</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-safari-ink md:flex">
          <Link href="/exhibitors">Exhibitors</Link>
          <Link href="/map">Floor Map</Link>
          <Link href="/program">Program</Link>
          <Link href="/assistant" className="inline-flex items-center gap-1 text-safari-forest"><Bot size={15} /> AI Guide</Link>
          <Link href="/favorites">Favorites</Link>
          <Link href="/admin/login" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <ShieldCheck size={16} />
            Admin
          </Link>
        </nav>
        <Link href="/map" className="grid h-10 w-10 place-items-center rounded-full bg-safari-orange text-white md:hidden" aria-label="Open map">
          <MapPinned size={19} />
        </Link>
      </div>
    </header>
  );
}
