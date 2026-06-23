"use client";

import Link from "next/link";
import { Compass, ExternalLink, Heart, Mail, MapPin, Phone, QrCode, X } from "lucide-react";
import type { ExhibitorWithBooth } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  isFavorite: boolean;
  exhibitor: ExhibitorWithBooth | null;
  onClose: () => void;
  onNavigate: () => void;
  onToggleFavorite: () => void;
};

export function BoothBottomSheet({ exhibitor, isFavorite, onClose, onNavigate, onToggleFavorite }: Props) {
  if (!exhibitor) return null;

  return (
    <aside className="fixed inset-x-0 bottom-0 z-[1000] max-h-[78vh] overflow-y-auto rounded-t-md border-t border-safari-gold/25 bg-white p-4 pb-24 shadow-[0_-18px_45px_rgba(31,91,59,0.2)] md:left-auto md:right-6 md:top-24 md:h-fit md:max-h-[calc(100vh-7rem)] md:w-96 md:rounded-md md:border md:pb-4">
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-safari-gold/50 md:hidden" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-safari-orange">{exhibitor.category.name}</p>
          <h2 className="mt-1 text-xl font-bold text-safari-ink">{exhibitor.companyName}</h2>
          <p className="mt-1 text-sm font-semibold text-safari-forest">
            {exhibitor.booth?.boothNumber} - {exhibitor.booth?.hall}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={onToggleFavorite}
            className={cn("grid h-10 w-10 place-items-center rounded-md bg-safari-cream text-safari-ink", isFavorite && "bg-safari-orange text-white")}
            aria-label={isFavorite ? "Remove favorite booth" : "Favorite booth"}
            title={isFavorite ? "Remove favorite" : "Favorite booth"}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-md bg-safari-cream text-safari-ink" aria-label="Close booth details" title="Close">
            <X size={18} />
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-safari-ink/70">{exhibitor.description}</p>
      {exhibitor.booth ? (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-safari-cream px-3 py-2 text-sm font-semibold text-safari-forest">
          <MapPin size={17} />
          Indoor expo position generated from official stand number
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {exhibitor.services.map((service) => (
          <span key={service} className="rounded-full bg-safari-forest/8 px-3 py-1 text-xs font-medium text-safari-forest">
            {service}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button onClick={onNavigate} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-safari-orange px-3 py-3 text-sm font-bold text-white active:scale-[0.98]">
          <Compass size={17} />
          Navigate
        </button>
        <Link href={`/qr/${encodeURIComponent(exhibitor.booth?.boothNumber ?? "")}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-safari-forest px-3 py-3 text-sm font-bold text-white active:scale-[0.98]">
          <QrCode size={17} />
          QR
        </Link>
        <Link href={`/exhibitors/${exhibitor.id}`} className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-safari-gold/35 px-3 py-3 text-sm font-bold text-safari-forest active:scale-[0.98]">
          <ExternalLink size={17} />
          Full exhibitor brief
        </Link>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-safari-ink/70">
        {exhibitor.phone ? (
          <a href={`tel:${exhibitor.phone}`} className="inline-flex items-center gap-2">
            <Phone size={16} />
            {exhibitor.phone}
          </a>
        ) : null}
        {exhibitor.email ? (
          <a href={`mailto:${exhibitor.email}`} className="inline-flex items-center gap-2">
            <Mail size={16} />
            {exhibitor.email}
          </a>
        ) : null}
      </div>
    </aside>
  );
}
