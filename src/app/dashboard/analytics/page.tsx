import { DashboardTopbar } from "@/components/dashboard/topbar";
import { EngagementPieChart, PopularPagesChart, PageviewsTrendChart } from "@/components/dashboard/analytics-charts";

export default function AnalyticsPage() {
  return (
    <div>
      <DashboardTopbar title="Analitik" />
      <div className="space-y-6 p-4 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-bold text-ink">Tren Tampilan Halaman</p>
            <p className="text-xs text-muted">6 bulan terakhir</p>
            <div className="mt-4"><PageviewsTrendChart /></div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-bold text-ink">Keterlibatan per Jenis Konten</p>
            <p className="text-xs text-muted">Interaksi pengunjung terhadap konten</p>
            <div className="mt-4"><EngagementPieChart /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-bold text-ink">Halaman Terpopuler</p>
          <p className="text-xs text-muted">Berdasarkan jumlah kunjungan</p>
          <div className="mt-4"><PopularPagesChart /></div>
        </div>
      </div>
    </div>
  );
}
