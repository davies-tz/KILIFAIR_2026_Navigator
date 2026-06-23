"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (query) next.set("q", query);
    else next.delete("q");
    router.push(`/exhibitors?${next.toString()}`);
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 rounded-md border border-safari-gold/30 bg-white p-2 shadow-sm">
      <Search className="ml-2 text-safari-forest" size={19} />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search booth, company, category, or service"
        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-safari-ink/45"
      />
      <button className="rounded-md bg-safari-forest px-4 py-2 text-sm font-semibold text-white">Search</button>
    </form>
  );
}
