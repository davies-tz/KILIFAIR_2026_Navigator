"use client";

import Link from "next/link";
import { Bot, Building2, Heart, Home, MapPinned } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/exhibitors", label: "Directory", icon: Building2 },
  { href: "/map", label: "Map", icon: MapPinned },
  { href: "/assistant", label: "AI", icon: Bot },
  { href: "/favorites", label: "Saved", icon: Heart }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-safari-gold/20 bg-white/95 px-2 py-2 shadow-[0_-10px_30px_rgba(31,91,59,0.12)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href.split("?")[0];
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-bold", active ? "text-safari-forest" : "text-safari-ink/55")}>
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
