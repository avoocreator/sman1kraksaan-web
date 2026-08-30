import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TrafficChart, AlumniGrowthChart, AchievementsByYearChart } from "@/components/dashboard/overview-charts";
import { getStatistics } from "@/lib/api";
import { Users, Trophy, Handshake, Briefcase, Eye } from "lucide-react";

export default async function DashboardOverviewPage() {
  const statistics = await getStatistics();

  const cards = [
    { label: "Pengunjung Bulan Ini", value: "5.200", icon: Eye, tone: "orange" as const },
    { label: "Prestasi", value: statistics.achievements, icon: Trophy, tone: "orange" as const },
    { label: "Alumni", value: statistics.alumni.toLocaleString("id-ID"), icon: Users, tone: "blue" as const },
    { label: "Mitra Industri", value: statistics.partners, icon: Handshake, tone: "blue" as const },
    { label: "Peluang Karier", value: 4, icon: Briefcase, tone: "orange" as const },
  ];

  return (
    <div>
      <DashboardTopbar title="Ringkasan Dashboard" />
      <div className="space-y-6 p-4 lg:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="rounded-2xl border border-border bg-surface p-5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.tone === "orange" ? "bg-orange-soft text-orange" : "bg-blue-soft text-blue"}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <p className="mt-3 text-2xl font-extrabold text-ink">{c.value}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{c.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
            <p className="text-sm font-bold text-ink">Traffic Website</p>
            <p className="text-xs text-muted">Pengunjung & tampilan halaman 6 bulan terakhir</p>
            <div className="mt-4"><TrafficChart /></div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-bold text-ink">Pertumbuhan Alumni</p>
            <p className="text-xs text-muted">Total alumni per tahun</p>
            <div className="mt-4"><AlumniGrowthChart /></div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-bold text-ink">Prestasi per Tahun</p>
          <p className="text-xs text-muted">Jumlah prestasi yang diraih setiap tahun</p>
          <div className="mt-4"><AchievementsByYearChart /></div>
        </div>
      </div>
    </div>
  );
}
