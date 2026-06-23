import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { exhibitorSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const exhibitors = await prisma.exhibitor.findMany({
    include: { category: true, booth: true, images: true },
    orderBy: { companyName: "asc" }
  });

  return NextResponse.json(exhibitors);
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = exhibitorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  const { booth, ...data } = parsed.data;
  const boothData = {
    boothNumber: booth.boothNumber,
    hall: booth.hall,
    latitude: booth.latitude,
    longitude: booth.longitude,
    ...(booth.polygon ? { polygon: booth.polygon as object } : {})
  };
  const exhibitor = await prisma.exhibitor.create({
    data: {
      ...data,
      email: data.email || undefined,
      slug: `${slugify(data.companyName)}-${Date.now()}`,
      booth: { create: boothData }
    },
    include: { category: true, booth: true, images: true }
  });

  return NextResponse.json(exhibitor, { status: 201 });
}
