"use client";

import { FormEvent, useMemo, useState } from "react";
import { Edit3, Plus, Save, Trash2 } from "lucide-react";
import type { ExhibitorWithBooth } from "@/types";

type Category = { id: string; name: string; slug: string };

const emptyForm = {
  companyName: "",
  description: "",
  services: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  categoryId: "",
  boothNumber: "",
  hall: "Safari Hall",
  latitude: "130",
  longitude: "170"
};

export function AdminExhibitorManager({ initialExhibitors, categories }: { initialExhibitors: ExhibitorWithBooth[]; categories: Category[] }) {
  const [exhibitors, setExhibitors] = useState(initialExhibitors);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
  const [message, setMessage] = useState<string | null>(null);

  const editing = useMemo(() => exhibitors.find((item) => item.id === editingId), [editingId, exhibitors]);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function edit(exhibitor: ExhibitorWithBooth) {
    setEditingId(exhibitor.id);
    setForm({
      companyName: exhibitor.companyName,
      description: exhibitor.description,
      services: exhibitor.services.join(", "),
      contactName: exhibitor.contactName ?? "",
      email: exhibitor.email ?? "",
      phone: exhibitor.phone ?? "",
      website: exhibitor.website ?? "",
      instagram: exhibitor.instagram ?? "",
      facebook: exhibitor.facebook ?? "",
      linkedin: exhibitor.linkedin ?? "",
      categoryId: exhibitor.category.id,
      boothNumber: exhibitor.booth?.boothNumber ?? "",
      hall: exhibitor.booth?.hall ?? "Safari Hall",
      latitude: String(exhibitor.booth?.latitude ?? 130),
      longitude: String(exhibitor.booth?.longitude ?? 170)
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const payload = {
      companyName: form.companyName,
      description: form.description,
      services: form.services.split(",").map((service) => service.trim()).filter(Boolean),
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      website: form.website,
      instagram: form.instagram,
      facebook: form.facebook,
      linkedin: form.linkedin,
      categoryId: form.categoryId,
      booth: {
        boothNumber: form.boothNumber,
        hall: form.hall,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        polygon: null
      }
    };

    const response = await fetch(editingId ? `/api/exhibitors/${editingId}` : "/api/exhibitors", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setMessage("Could not save exhibitor. Check required fields and URL formats.");
      return;
    }

    const saved = await response.json();
    setExhibitors((current) => (editingId ? current.map((item) => (item.id === editingId ? saved : item)) : [saved, ...current]));
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setMessage("Exhibitor saved.");
  }

  async function remove(id: string) {
    const response = await fetch(`/api/exhibitors/${id}`, { method: "DELETE" });
    if (response.ok) {
      setExhibitors((current) => current.filter((item) => item.id !== id));
      if (editingId === id) setEditingId(null);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="rounded-md bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          {editing ? <Edit3 size={18} className="text-safari-orange" /> : <Plus size={18} className="text-safari-orange" />}
          <h2 className="font-bold text-safari-ink">{editing ? "Edit exhibitor" : "Add exhibitor"}</h2>
        </div>
        <div className="grid gap-3">
          <input className="rounded-md border px-3 py-2" placeholder="Company name" value={form.companyName} onChange={(event) => update("companyName", event.target.value)} />
          <textarea className="min-h-28 rounded-md border px-3 py-2" placeholder="Description" value={form.description} onChange={(event) => update("description", event.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="Services, comma separated" value={form.services} onChange={(event) => update("services", event.target.value)} />
          <select className="rounded-md border px-3 py-2" value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)}>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input className="rounded-md border px-3 py-2" placeholder="Booth number" value={form.boothNumber} onChange={(event) => update("boothNumber", event.target.value)} />
            <input className="rounded-md border px-3 py-2" placeholder="Hall" value={form.hall} onChange={(event) => update("hall", event.target.value)} />
            <input className="rounded-md border px-3 py-2" placeholder="Indoor Y coordinate" value={form.latitude} onChange={(event) => update("latitude", event.target.value)} />
            <input className="rounded-md border px-3 py-2" placeholder="Indoor X coordinate" value={form.longitude} onChange={(event) => update("longitude", event.target.value)} />
          </div>
          <input className="rounded-md border px-3 py-2" placeholder="Contact name" value={form.contactName} onChange={(event) => update("contactName", event.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="Email" value={form.email} onChange={(event) => update("email", event.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="Phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="Website URL" value={form.website} onChange={(event) => update("website", event.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="Instagram URL" value={form.instagram} onChange={(event) => update("instagram", event.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="Facebook URL" value={form.facebook} onChange={(event) => update("facebook", event.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="LinkedIn URL" value={form.linkedin} onChange={(event) => update("linkedin", event.target.value)} />
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-safari-forest px-4 py-3 font-bold text-white">
            <Save size={18} />
            Save exhibitor
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-safari-orange">{message}</p> : null}
      </form>

      <div className="grid gap-3">
        {exhibitors.map((exhibitor) => (
          <article key={exhibitor.id} className="rounded-md bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-safari-orange">{exhibitor.category.name}</p>
                <h3 className="font-bold text-safari-ink">{exhibitor.companyName}</h3>
                <p className="mt-1 text-sm text-safari-ink/60">{exhibitor.booth?.boothNumber} · {exhibitor.booth?.latitude.toFixed(5)}, {exhibitor.booth?.longitude.toFixed(5)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(exhibitor)} className="grid h-9 w-9 place-items-center rounded-md bg-safari-cream text-safari-forest" aria-label="Edit exhibitor"><Edit3 size={17} /></button>
                <button onClick={() => remove(exhibitor.id)} className="grid h-9 w-9 place-items-center rounded-md bg-red-50 text-red-600" aria-label="Delete exhibitor"><Trash2 size={17} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
