import { BottomNav } from "@/components/BottomNav";
import { ExhibitorCard } from "@/components/ExhibitorCard";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const exhibitors = await prisma.exhibitor.findMany({
    take: 3,
    include: { category: true, booth: true, images: true },
    orderBy: { companyName: "asc" }
  });

  return (
    <>
      <Navbar />
      <main className="pb-24 md:pb-0">
        <Hero />
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-safari-orange">Featured exhibitors</p>
              <h2 className="mt-1 text-2xl font-bold text-safari-ink">Start planning your visit</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {exhibitors.map((exhibitor) => (
              <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
