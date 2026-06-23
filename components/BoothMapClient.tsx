"use client";

import dynamic from "next/dynamic";
import type { ExhibitorWithBooth } from "@/types";

const BoothMap = dynamic(() => import("@/components/BoothMap").then((mod) => mod.BoothMap), {
  ssr: false,
  loading: () => <div className="grid h-[70vh] place-items-center bg-safari-cream font-semibold text-safari-forest">Loading expo map...</div>
});

export function BoothMapClient({ exhibitors, initialBooth }: { exhibitors: ExhibitorWithBooth[]; initialBooth?: string }) {
  return <BoothMap exhibitors={exhibitors} initialBooth={initialBooth} />;
}
