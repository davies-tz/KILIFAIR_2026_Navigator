import QRCode from "qrcode";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, MapPin, QrCode } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BoothQrPage({ params }: { params: { booth: string } }) {
  const boothCode = decodeURIComponent(params.booth).toUpperCase();
  const exhibitor = await prisma.exhibitor.findFirst({
    where: { booth: { is: { boothNumber: { equals: boothCode, mode: "insensitive" } } } },
    include: { booth: true, category: true, images: true }
  });

  if (!exhibitor?.booth) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const targetUrl = `${appUrl}/map?booth=${encodeURIComponent(exhibitor.booth.boothNumber)}`;
  const qrDataUrl = await QRCode.toDataURL(targetUrl, { margin: 2, width: 360, color: { dark: "#1F5B3B", light: "#FFF4DF" } });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-8 md:pb-14">
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
          <div className="bg-[radial-gradient(circle_at_top_left,#E96B2C,transparent_32%),linear-gradient(135deg,#1F5B3B,#143D2A)] p-6 text-white">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-white/75"><QrCode size={18} /> Booth QR</p>
            <h1 className="mt-3 text-3xl font-black">{exhibitor.companyName}</h1>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-black text-safari-forest"><MapPin size={16} /> {exhibitor.booth.boothNumber} · {exhibitor.booth.hall}</p>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-[360px_1fr]">
            <div className="rounded-[1.5rem] bg-safari-cream p-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={`QR code for booth ${exhibitor.booth.boothNumber}`} className="mx-auto rounded-xl" />
              <a href={qrDataUrl} download={`KILIFAIR-${exhibitor.booth.boothNumber}-QR.png`} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-safari-forest px-4 py-3 text-sm font-black text-white">
                <Download size={16} /> Download QR
              </a>
            </div>
            <div>
              <h2 className="text-xl font-black text-safari-ink">Scan-to-navigate workflow</h2>
              <p className="mt-3 leading-7 text-safari-ink/70">Place this QR at the booth, poster, booklet, or reception desk. A visitor scans it and lands directly on the map with this booth highlighted, ready for route guidance from Gate A.</p>
              <div className="mt-5 grid gap-3">
                <Link href={`/map?booth=${exhibitor.booth.boothNumber}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-safari-orange px-4 py-3 font-black text-white">
                  Open navigation <ArrowRight size={18} />
                </Link>
                <Link href={`/exhibitors/${exhibitor.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-safari-gold/30 px-4 py-3 font-black text-safari-forest">
                  View exhibitor profile
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
