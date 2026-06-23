"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, Clock } from "lucide-react";

const STORAGE_KEY = "kilifair.meetingRequests";
const SLOTS = ["09:30", "10:30", "11:30", "13:00", "14:00", "15:30", "16:30"];

type SavedMeeting = { exhibitorId: string; companyName: string; boothNumber?: string | null; time: string; createdAt: string };

export function MeetingPlanner({ exhibitorId, companyName, boothNumber }: { exhibitorId: string; companyName: string; boothNumber?: string | null }) {
  const [selected, setSelected] = useState(SLOTS[1]);
  const [saved, setSaved] = useState(false);

  const key = useMemo(() => `${exhibitorId}:${selected}`, [exhibitorId, selected]);

  function saveMeeting() {
    const existingRaw = window.localStorage.getItem(STORAGE_KEY);
    const existing: SavedMeeting[] = existingRaw ? JSON.parse(existingRaw) : [];
    const next = existing.filter((meeting) => `${meeting.exhibitorId}:${meeting.time}` !== key);
    next.push({ exhibitorId, companyName, boothNumber, time: selected, createdAt: new Date().toISOString() });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <section className="mt-6 rounded-[1.5rem] border border-safari-gold/25 bg-safari-cream p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-safari-orange">
          <CalendarCheck size={20} />
        </div>
        <div>
          <h2 className="font-black text-safari-ink">Request a meeting</h2>
          <p className="mt-1 text-sm leading-6 text-safari-ink/65">Demo buyer workflow: pick a time slot and save it locally. In production this can email the exhibitor or sync with a CRM.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-7">
        {SLOTS.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelected(slot)}
            className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-black ${selected === slot ? "bg-safari-forest text-white" : "bg-white text-safari-ink"}`}
          >
            <Clock size={13} /> {slot}
          </button>
        ))}
      </div>
      <button onClick={saveMeeting} className="mt-4 w-full rounded-xl bg-safari-orange px-4 py-3 text-sm font-black text-white">
        {saved ? "Meeting saved" : `Save meeting at ${selected}`}
      </button>
    </section>
  );
}
