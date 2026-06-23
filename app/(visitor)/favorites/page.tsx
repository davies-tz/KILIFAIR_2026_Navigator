import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";
import { FavoritesClient } from "@/components/FavoritesClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const exhibitors = await prisma.exhibitor.findMany({
    include: { category: true, booth: true, images: true },
    orderBy: { companyName: "asc" }
  });

  return (
    <>
      <Navbar />
      <FavoritesClient exhibitors={exhibitors} />
      <BottomNav />
    </>
  );
}
