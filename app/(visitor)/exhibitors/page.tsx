import { BottomNav } from "@/components/BottomNav";
import { ExhibitorCard } from "@/components/ExhibitorCard";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { q?: string; category?: string; service?: string };
};

export default async function ExhibitorsPage({ searchParams }: Props) {
  const q = searchParams.q?.trim();

  if (q) {
    await prisma.searchLog.create({ data: { query: q, filters: searchParams } });
  }

  const exhibitors = await prisma.exhibitor.findMany({
    where: q
      ? {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { services: { has: q } },
            { category: { name: { contains: q, mode: "insensitive" } } },
            { booth: { boothNumber: { contains: q, mode: "insensitive" } } }
          ]
        }
      : undefined,
    include: { category: true, booth: true, images: true },
    orderBy: { companyName: "asc" }
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-12">
        <div className="mb-5">
          <p className="text-sm font-bold uppercase tracking-wide text-safari-orange">Exhibitor directory</p>
          <h1 className="mt-1 text-3xl font-bold text-safari-ink">Find tourism partners fast</h1>
        </div>
        <SearchBar />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exhibitors.map((exhibitor) => (
            <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
          ))}
        </div>
        {exhibitors.length === 0 ? (
          <div className="mt-8 rounded-md bg-white p-6 text-center text-safari-ink/70">No exhibitors matched your search.</div>
        ) : null}
      </main>
      <BottomNav />
    </>
  );
}
