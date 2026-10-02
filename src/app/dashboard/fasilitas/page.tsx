import { DashboardTopbar } from "@/components/dashboard/topbar";
import { BookingsAdmin } from "@/components/fasilitas/bookings-admin";

export default function DashboardFasilitasPage() {
  return (
    <div>
      <DashboardTopbar title="Pemesanan Fasilitas" />
      <div className="p-4 lg:p-8">
        <BookingsAdmin />
      </div>
    </div>
  );
}
