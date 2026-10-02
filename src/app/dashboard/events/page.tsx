import { DashboardTopbar } from "@/components/dashboard/topbar";
import { EventsTable } from "@/components/dashboard/events-table";
import { getEvents } from "@/lib/api";

export default async function DashboardEventsPage() {
  const events = await getEvents();
  return (
    <div>
      <DashboardTopbar title="Manajemen Agenda" />
      <div className="p-4 lg:p-8">
        <EventsTable events={events} />
      </div>
    </div>
  );
}
