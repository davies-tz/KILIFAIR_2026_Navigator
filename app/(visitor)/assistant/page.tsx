import { AIAssistantClient } from "@/components/AIAssistantClient";
import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AssistantPage() {
  const exhibitors = await prisma.exhibitor.findMany({
    include: { category: true, booth: true, images: true },
    orderBy: { companyName: "asc" }
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-12">
        <AIAssistantClient exhibitors={exhibitors} />
      </main>
      <BottomNav />
    </>
  );
}
