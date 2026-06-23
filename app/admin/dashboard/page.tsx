import { AdminSidebar } from "@/components/AdminSidebar";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [totalExhibitors, totalBooths, recentSearches, mostViewed] = await Promise.all([
    prisma.exhibitor.count(),
    prisma.booth.count(),
    prisma.searchLog.groupBy({
      by: ["query"],
      _count: { query: true },
      orderBy: { _count: { query: "desc" } },
      take: 5
    }),
    prisma.boothView.groupBy({
      by: ["exhibitorId"],
      _count: { exhibitorId: true },
      orderBy: { _count: { exhibitorId: "desc" } },
      take: 5
    })
  ]);

  const viewedExhibitors = await prisma.exhibitor.findMany({
    where: { id: { in: mostViewed.map((item) => item.exhibitorId) } },
    include: { booth: true }
  });

  return (
    <div className="min-h-screen bg-safari-cream md:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-safari-orange">Dashboard statistics</p>
        <h1 className="mt-1 text-3xl font-bold text-safari-ink">Expo performance overview</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total exhibitors" value={totalExhibitors} />
          <Stat label="Total booths" value={totalBooths} />
          <Stat label="Tracked searches" value={recentSearches.reduce((sum, item) => sum + item._count.query, 0)} />
          <Stat label="Booth views" value={mostViewed.reduce((sum, item) => sum + item._count.exhibitorId, 0)} />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="rounded-md bg-white p-5 shadow-sm">
            <h2 className="font-bold text-safari-ink">Most viewed booths</h2>
            <div className="mt-4 grid gap-3">
              {mostViewed.map((view) => {
                const exhibitor = viewedExhibitors.find((item) => item.id === view.exhibitorId);
                return (
                  <div key={view.exhibitorId} className="flex items-center justify-between rounded-md bg-safari-cream px-3 py-2 text-sm">
                    <span>{exhibitor?.companyName ?? "Unknown"} · {exhibitor?.booth?.boothNumber ?? "No booth"}</span>
                    <strong>{view._count.exhibitorId}</strong>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="rounded-md bg-white p-5 shadow-sm">
            <h2 className="font-bold text-safari-ink">Most searched booths</h2>
            <div className="mt-4 grid gap-3">
              {recentSearches.map((search) => (
                <div key={search.query} className="flex items-center justify-between rounded-md bg-safari-cream px-3 py-2 text-sm">
                  <span>{search.query}</span>
                  <strong>{search._count.query}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <section className="rounded-md bg-white p-5 shadow-sm">
      <p className="text-sm text-safari-ink/60">{label}</p>
      <p className="mt-2 text-4xl font-bold text-safari-forest">{value}</p>
    </section>
  );
}
