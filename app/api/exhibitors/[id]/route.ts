import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { exhibitorSchema } from "@/lib/validations";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const exhibitor = await prisma.exhibitor.findUnique({
    where: { id: params.id },
    include: { category: true, booth: true, images: true }
  });

  if (!exhibitor) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(exhibitor);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();

  if (body.viewed === true) {
    await prisma.boothView.create({ data: { exhibitorId: params.id } });
    return NextResponse.json({ ok: true });
  }

  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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
  const exhibitor = await prisma.exhibitor.update({
    where: { id: params.id },
    data: {
      ...data,
      email: data.email || undefined,
      booth: {
        upsert: {
          create: boothData,
          update: boothData
        }
      }
    },
    include: { category: true, booth: true, images: true }
  });

  return NextResponse.json(exhibitor);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.exhibitor.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
