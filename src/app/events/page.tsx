import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import { EventsCalendar } from "@/components/events/events-calendar";

export const metadata: Metadata = { title: "Agenda", description: "Kegiatan dan agenda sekolah SMAN 1 Kraksaan." };

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Agenda</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Kegiatan Sekolah</h1>
      </div>
      <div className="mt-10">
        <EventsCalendar events={events} />
      </div>
    </div>
  );
}
