import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import { EventsCalendar } from "@/components/events/events-calendar";
import { EmptyState } from "@/components/ui/empty-state";
import { todayJakarta } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = { title: "Agenda", description: "Kegiatan dan agenda sekolah SMAN 1 Kraksaan." };

export default async function EventsPage() {
  const events = await getEvents();
  const today = todayJakarta();
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Agenda</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Kegiatan Sekolah</h1>
      </div>
      <div className="mt-10">
        {events.length === 0 ? (
          <EmptyState
            title="Belum ada agenda di CMS."
            description="Tambahkan entri di Strapi (Collection Types → Event): isi title dan date — halaman ini terisi otomatis."
          />
        ) : (
          <EventsCalendar events={events} today={today} />
        )}
      </div>
    </div>
  );
}
