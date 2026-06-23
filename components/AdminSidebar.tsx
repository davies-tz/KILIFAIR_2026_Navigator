import Link from "next/link";
import { BarChart3, Building2, MapPinned } from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="border-b border-safari-gold/20 bg-safari-forest text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="px-4 py-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-safari-gold font-bold text-safari-ink">KF</span>
          <div>
            <p className="font-bold">KILIFAIR Admin</p>
            <p className="text-xs text-white/65">Expo operations</p>
          </div>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 text-sm md:grid md:px-3">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
          <BarChart3 size={17} />
          Dashboard
        </Link>
        <Link href="/admin/exhibitors" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
          <Building2 size={17} />
          Exhibitors
        </Link>
        <Link href="/map" className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10">
          <MapPinned size={17} />
          Live map
        </Link>
      </nav>
    </aside>
  );
}
