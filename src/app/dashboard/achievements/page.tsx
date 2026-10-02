import { DashboardTopbar } from "@/components/dashboard/topbar";
import { AchievementsTable } from "@/components/dashboard/achievements-table";
import { getAchievements } from "@/lib/api";

export default async function DashboardAchievementsPage() {
  const achievements = await getAchievements();
  return (
    <div>
      <DashboardTopbar title="Manajemen Prestasi" />
      <div className="p-4 lg:p-8">
        <AchievementsTable achievements={achievements} />
      </div>
    </div>
  );
}
