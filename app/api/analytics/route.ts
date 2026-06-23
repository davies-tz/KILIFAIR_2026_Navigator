import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const [totalExhibitors, totalBooths, mostViewed, mostSearched] = await Promise.all([
    prisma.exhibitor.count(),
    prisma.booth.count(),
    prisma.boothView.groupBy({
      by: ["exhibitorId"],
      _count: { exhibitorId: true },
      orderBy: { _count: { exhibitorId: "desc" } },
      take: 5
    }),
    prisma.searchLog.groupBy({
      by: ["query"],
      _count: { query: true },
      orderBy: { _count: { query: "desc" } },
      take: 5
    })
  ]);

  const viewedExhibitors = await prisma.exhibitor.findMany({
    where: { id: { in: mostViewed.map((view) => view.exhibitorId) } },
    select: { id: true, companyName: true, booth: true }
  });

  return NextResponse.json({
    totalExhibitors,
    totalBooths,
    mostViewedBooths: mostViewed.map((view) => ({
      count: view._count.exhibitorId,
      exhibitor: viewedExhibitors.find((item) => item.id === view.exhibitorId)
    })),
    mostSearchedBooths: mostSearched.map((search) => ({
      query: search.query,
      count: search._count.query
    }))
  });
}
