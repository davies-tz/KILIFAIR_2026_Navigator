import QRCode from "qrcode";
import { Navbar } from "@/components/Navbar";

export default async function QrEntryPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const qr = await QRCode.toDataURL(appUrl, { margin: 2, width: 320, color: { dark: "#1F5B3B", light: "#FFF4DF" } });

  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100vh-65px)] place-items-center px-4 py-10">
        <section className="w-full max-w-md rounded-md bg-white p-6 text-center shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wide text-safari-orange">Expo entry QR</p>
          <h1 className="mt-2 text-2xl font-bold text-safari-ink">Open the KILIFAIR 2026 app</h1>
          <img src={qr} alt="QR code opening the KILIFAIR 2026 web app" width={320} height={320} className="mx-auto mt-5 rounded-md" />
          <p className="mt-4 break-all text-sm text-safari-ink/60">{appUrl}</p>
        </section>
      </main>
    </>
  );
}
