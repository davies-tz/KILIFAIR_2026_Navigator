import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Facebook, Globe, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { MeetingPlanner } from "@/components/MeetingPlanner";
import { RecommendationRail } from "@/components/RecommendationRail";
import { getRecommendedExhibitors } from "@/lib/recommendations";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BoothDetailPage({ params }: { params: { id: string } }) {
  const exhibitor = await prisma.exhibitor.findUnique({
    where: { id: params.id },
    include: { category: true, booth: true, images: true }
  });

  if (!exhibitor) notFound();

  await prisma.boothView.create({ data: { exhibitorId: exhibitor.id } });

  const allExhibitors = await prisma.exhibitor.findMany({
    include: { category: true, booth: true, images: true },
    orderBy: { companyName: "asc" }
  });
  const recommendations = getRecommendedExhibitors(exhibitor, allExhibitors, 6);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-6 md:pb-12">
        <section className="overflow-hidden rounded-md bg-white shadow-soft">
          <div className="min-h-48 bg-[linear-gradient(135deg,#1F5B3B,#E96B2C_55%,#C99A2E)] p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-wide text-white/75">{exhibitor.category.name}</p>
            <h1 className="mt-2 text-3xl font-bold">{exhibitor.companyName}</h1>
            {exhibitor.booth ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-bold text-safari-forest">
                <MapPin size={17} />
                Booth {exhibitor.booth.boothNumber} · {exhibitor.booth.hall}
              </div>
            ) : null}
          </div>
          <div className="p-5">
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              {(exhibitor.images.length ? exhibitor.images : [{ id: "placeholder", url: "", alt: `${exhibitor.companyName} booth image` }]).map((image) => (
                <div key={image.id} className="grid aspect-[16/10] place-items-center rounded-md bg-[linear-gradient(135deg,#FFF4DF,#C99A2E_45%,#1F5B3B)] p-4 text-center text-sm font-bold text-white">
                  {image.alt}
                </div>
              ))}
            </div>
            <p className="leading-7 text-safari-ink/75">{exhibitor.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {exhibitor.services.map((service) => (
                <span key={service} className="rounded-full bg-safari-forest/8 px-3 py-1 text-sm font-medium text-safari-forest">
                  {service}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
              {exhibitor.contactName ? <p className="font-semibold text-safari-ink">{exhibitor.contactName}</p> : null}
              {exhibitor.phone ? <a className="inline-flex items-center gap-2" href={`tel:${exhibitor.phone}`}><Phone size={16} />{exhibitor.phone}</a> : null}
              {exhibitor.email ? <a className="inline-flex items-center gap-2" href={`mailto:${exhibitor.email}`}><Mail size={16} />{exhibitor.email}</a> : null}
              {exhibitor.website ? <a className="inline-flex items-center gap-2" href={exhibitor.website}><Globe size={16} />Website</a> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {exhibitor.instagram ? <a className="grid h-10 w-10 place-items-center rounded-md bg-safari-cream text-safari-forest" href={exhibitor.instagram} aria-label="Instagram"><Instagram size={18} /></a> : null}
              {exhibitor.facebook ? <a className="grid h-10 w-10 place-items-center rounded-md bg-safari-cream text-safari-forest" href={exhibitor.facebook} aria-label="Facebook"><Facebook size={18} /></a> : null}
              {exhibitor.linkedin ? <a className="grid h-10 w-10 place-items-center rounded-md bg-safari-cream text-safari-forest" href={exhibitor.linkedin} aria-label="LinkedIn"><Linkedin size={18} /></a> : null}
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Link href={`/map?booth=${exhibitor.booth?.boothNumber ?? ""}`} className="inline-flex items-center justify-center gap-2 rounded-md bg-safari-orange px-4 py-3 font-bold text-white">
                Navigate
                <ExternalLink size={18} />
              </Link>
              <Link href={`/qr/${encodeURIComponent(exhibitor.booth?.boothNumber ?? "")}`} className="inline-flex items-center justify-center gap-2 rounded-md bg-safari-forest px-4 py-3 font-bold text-white">
                Booth QR
              </Link>
              {exhibitor.website ? <a href={exhibitor.website} className="inline-flex items-center justify-center gap-2 rounded-md border border-safari-gold/40 px-4 py-3 font-bold text-safari-forest">Open Website</a> : null}
            </div>
            <MeetingPlanner exhibitorId={exhibitor.id} companyName={exhibitor.companyName} boothNumber={exhibitor.booth?.boothNumber} />
          </div>
        </section>
        <RecommendationRail exhibitors={recommendations} />
      </main>
      <BottomNav />
    </>
  );
}
