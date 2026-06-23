"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Compass, MapPinned, Sparkles } from "lucide-react";
import type { ExhibitorWithBooth } from "@/types";

const INTENT_KEYWORDS: Record<string, string[]> = {
  luxury: ["luxury", "premium", "resort", "lodge", "collection", "retreat", "sanctuary"],
  safari: ["safari", "camp", "tour", "wildlife", "serengeti", "ngorongoro", "tarangire"],
  airlines: ["air", "airline", "flight", "aviation", "flying"],
  zanzibar: ["zanzibar", "beach", "island", "spice", "ocean"],
  food: ["food", "deli", "juice", "restaurant", "court", "drinks"],
  medical: ["medivac", "doctor", "flying doctors", "rescue", "ambulance", "health"],
  suppliers: ["supplier", "bank", "finance", "vehicle", "4x4", "media", "technology"]
};

const SUGGESTIONS = [
  "Find luxury safari lodges",
  "Show airlines and aviation exhibitors",
  "I need Zanzibar beach resorts",
  "Find food court and drinks",
  "Medical or emergency support exhibitors",
  "Build a route to premium safari camps"
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreExhibitor(exhibitor: ExhibitorWithBooth, query: string) {
  const normalizedQuery = normalize(query);
  const terms = normalizedQuery.split(" ").filter(Boolean);
  const haystack = normalize([
    exhibitor.companyName,
    exhibitor.description,
    exhibitor.category.name,
    exhibitor.website,
    exhibitor.booth?.boothNumber,
    exhibitor.booth?.hall,
    ...exhibitor.services
  ].filter(Boolean).join(" "));

  let score = 0;
  for (const term of terms) {
    if (haystack.includes(term)) score += 4;
  }

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (normalizedQuery.includes(intent)) {
      for (const keyword of keywords) {
        if (haystack.includes(keyword)) score += 7;
      }
    }
  }

  if (exhibitor.booth?.boothNumber && normalizedQuery.includes(exhibitor.booth.boothNumber.toLowerCase())) score += 20;
  if (haystack.includes("tanzania")) score += 1;
  return score;
}

function humanAnswer(query: string, count: number) {
  const q = normalize(query);
  if (!query.trim()) return "Ask me what kind of exhibitor you want to visit, then I will shortlist booths and give you navigation links.";
  if (count === 0) return "I could not find a strong match. Try a category like safari, lodge, airline, Zanzibar, food, medical, or type a booth number.";
  if (q.includes("route") || q.includes("navigate") || q.includes("direction")) return "I found good route targets. Open one booth and the map will guide you from the selected QR checkpoint.";
  if (q.includes("luxury")) return "These are strong luxury or premium tourism matches. Start with the closest priority booth, then save the rest to Favorites.";
  if (q.includes("air")) return "These exhibitors are relevant for flights, aviation, and air mobility inside the expo directory.";
  return "Here are the best-matching exhibitors from the KILIFAIR directory. Open a result to view the booth brief and navigate there.";
}

export function AIAssistantClient({ exhibitors }: { exhibitors: ExhibitorWithBooth[] }) {
  const [query, setQuery] = useState("Find luxury safari lodges");

  const results = useMemo(() => {
    return exhibitors
      .map((exhibitor) => ({ exhibitor, score: scoreExhibitor(exhibitor, query) }))
      .filter((item) => item.score > 0 && item.exhibitor.booth)
      .sort((a, b) => b.score - a.score || a.exhibitor.companyName.localeCompare(b.exhibitor.companyName))
      .slice(0, 8);
  }, [exhibitors, query]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2rem] bg-safari-forest p-6 text-white shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
            <Bot size={25} />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-safari-gold">AI Guide</p>
            <h1 className="text-2xl font-bold">Ask where to go next</h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/78">
          This is a local AI-style assistant for the demo. It understands booth numbers, tourism categories, services, and visitor intent, then sends visitors straight to navigation.
        </p>
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-5 min-h-32 w-full rounded-2xl border border-white/10 bg-white/95 p-4 text-base font-medium text-safari-ink outline-none ring-safari-gold focus:ring-4"
          placeholder="Example: I want luxury safari lodges near the premium area"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button key={suggestion} onClick={() => setQuery(suggestion)} className="rounded-full bg-white/12 px-3 py-2 text-xs font-bold text-white hover:bg-white/20">
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-start gap-3 rounded-2xl bg-safari-cream p-4">
          <Sparkles className="mt-0.5 text-safari-orange" size={20} />
          <div>
            <p className="font-bold text-safari-ink">Assistant response</p>
            <p className="mt-1 text-sm leading-6 text-safari-ink/70">{humanAnswer(query, results.length)}</p>
          </div>
        </div>

        <div className="space-y-3">
          {results.map(({ exhibitor }, index) => (
            <article key={exhibitor.id} className="rounded-2xl border border-safari-gold/20 p-4 transition hover:border-safari-orange/60 hover:shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-safari-orange">Match #{index + 1} · Booth {exhibitor.booth?.boothNumber}</p>
                  <h2 className="mt-1 text-lg font-bold text-safari-ink">{exhibitor.companyName}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-safari-ink/68">{exhibitor.description}</p>
                </div>
                <div className="rounded-full bg-safari-forest px-3 py-1 text-xs font-bold text-white">{exhibitor.category.name}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/map?booth=${encodeURIComponent(exhibitor.booth?.boothNumber ?? "")}`} className="inline-flex items-center gap-2 rounded-full bg-safari-orange px-4 py-2 text-sm font-bold text-white">
                  <MapPinned size={16} /> Navigate
                </Link>
                <Link href={`/exhibitors/${exhibitor.id}`} className="inline-flex items-center gap-2 rounded-full bg-safari-cream px-4 py-2 text-sm font-bold text-safari-forest">
                  <Compass size={16} /> View brief
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
