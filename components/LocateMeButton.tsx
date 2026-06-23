"use client";

import { Loader2, LocateFixed, LocateOff } from "lucide-react";
import type { LocationStatus } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  status: LocationStatus;
  onClick: () => void;
  compact?: boolean;
};

export function LocateMeButton({ status, onClick, compact = false }: Props) {
  const isLoading = status === "loading";
  const isDenied = status === "denied" || status === "unavailable" || status === "error";
  const Icon = isLoading ? Loader2 : isDenied ? LocateOff : LocateFixed;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-safari-forest px-3 py-2 text-sm font-bold text-white shadow-soft transition active:scale-[0.98] disabled:cursor-wait disabled:opacity-80",
        compact ? "h-11 w-11 px-0" : "w-full"
      )}
      aria-label="Locate me"
      title="Locate me"
    >
      <Icon size={18} className={isLoading ? "animate-spin" : ""} />
      {compact ? null : "Locate me"}
    </button>
  );
}
