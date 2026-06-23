import Link from "next/link";
import { CalendarDays, Clock, MapPin, Mic2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";

const program = [
  { day: "Thursday, June 4", theme: "Tanzania Day", items: [
    ["10:00", "Opening time for KARIBU-KILIFAIR 2026", "Stage area"],
    ["11:00", "Official opening speeches", "Main stage"],
    ["12:00 - 15:00", "Traditional dances, afro-dance, acrobats and clowns", "Stage audience"],
    ["13:00 & 16:00", "Maasai cultural tourism performance", "Stage area"],
    ["16:00 - 17:30", "MTI Live Music", "Stage area"]
  ]},
  { day: "Friday, June 5", theme: "Rwanda Day", items: [
    ["09:00 - 10:30", "Speed networking for buyers and exhibitors", "B2B Networking area"],
    ["11:00", "AI-Ready Tourism: How to be found and chosen", "Seminar / Workshop"],
    ["14:00", "AI-Ready Tourism: Visibility into direct bookings", "Seminar / Workshop"],
    ["16:00", "Tourist safety and emergency support", "Panel area"]
  ]},
  { day: "Saturday, June 6", theme: "Uganda Day", items: [
    ["09:00 - 10:30", "Speed networking for buyers and exhibitors", "B2B Networking area"],
    ["10:00 - 15:00", "Traditional dances and cultural showcases", "Stage area"],
    ["19:00 - Late", "Sounds of Kili music night", "Stage area"]
  ]},
  { day: "Sunday, June 7", theme: "Zanzibar Day", items: [
    ["09:00 - 10:30", "Speed networking for buyers and exhibitors", "B2B Networking area"],
    ["11:00 & 13:00", "Maasai cultural tourism groups", "Stage area"],
    ["15:00", "Zanzibar showcase", "Stage area"],
    ["19:00 - Late", "Closing music and networking", "Stage area"]
  ]}
];

export default function ProgramPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:pb-14">
        <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,#E96B2C,transparent_30%),linear-gradient(135deg,#1F5B3B,#143D2A)] p-6 text-white shadow-soft md:p-8">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-white/70"><CalendarDays size={18} /> Event companion</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black md:text-5xl">Plan your booth walk around stage programs and B2B sessions.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/75">A production navigator should guide visitors beyond booths: sessions, networking, food, lounges, and program zones become part of the same movement experience.</p>
          <Link href="/map" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-black text-safari-forest">Open live map</Link>
        </section>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {program.map((day) => (
            <section key={day.day} className="rounded-[1.5rem] border border-safari-gold/20 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-safari-ink">{day.day}</h2>
                  <p className="mt-1 text-sm font-bold text-safari-orange">{day.theme}</p>
                </div>
                <Mic2 className="text-safari-forest" />
              </div>
              <div className="mt-4 grid gap-3">
                {day.items.map(([time, title, place]) => (
                  <article key={`${day.day}-${time}-${title}`} className="rounded-2xl bg-safari-cream p-4">
                    <p className="inline-flex items-center gap-2 text-xs font-black text-safari-orange"><Clock size={14} /> {time}</p>
                    <h3 className="mt-2 font-black text-safari-ink">{title}</h3>
                    <Link href={`/map?zone=${encodeURIComponent(place)}`} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-safari-forest"><MapPin size={15} /> {place}</Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
