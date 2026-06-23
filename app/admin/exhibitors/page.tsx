import { AdminExhibitorManager } from "@/components/AdminExhibitorManager";
import { AdminSidebar } from "@/components/AdminSidebar";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminExhibitorsPage() {
  await requireAdmin();

  const [exhibitors, categories] = await Promise.all([
    prisma.exhibitor.findMany({
      include: { category: true, booth: true, images: true },
      orderBy: { companyName: "asc" }
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="min-h-screen bg-safari-cream md:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-safari-orange">Manage exhibitors</p>
        <h1 className="mt-1 text-3xl font-bold text-safari-ink">Directory and booth locations</h1>
        <div className="mt-6">
          <AdminExhibitorManager initialExhibitors={exhibitors} categories={categories} />
        </div>
      </main>
    </div>
  );
}
