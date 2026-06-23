import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const parsed = searchSchema.parse({
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    service: url.searchParams.get("service") ?? undefined
  });

  if (parsed.q) {
    await prisma.searchLog.create({ data: { query: parsed.q, filters: parsed } });
  }

  const exhibitors = await prisma.exhibitor.findMany({
    where: parsed.q
      ? {
          OR: [
            { companyName: { contains: parsed.q, mode: "insensitive" } },
            { description: { contains: parsed.q, mode: "insensitive" } },
            { category: { name: { contains: parsed.q, mode: "insensitive" } } },
            { booth: { is: { boothNumber: { contains: parsed.q, mode: "insensitive" } } } }
          ]
        }
      : undefined,
    include: { category: true, booth: true, images: true },
    orderBy: { companyName: "asc" }
  });

  return NextResponse.json(exhibitors);
}
