import { BottomNav } from "@/components/BottomNav";
import { BoothMapClient } from "@/components/BoothMapClient";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MapPage({ searchParams }: { searchParams: { booth?: string } }) {
  const exhibitors = await prisma.exhibitor.findMany({
    include: { category: true, booth: true, images: true },
    orderBy: { companyName: "asc" }
  });

  return (
    <>
      <Navbar />
      <BoothMapClient exhibitors={exhibitors} initialBooth={searchParams.booth} />
      <BottomNav />
    </>
  );
}
