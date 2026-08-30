import { DashboardTopbar } from "@/components/dashboard/topbar";
import { CareerTable } from "@/components/dashboard/career-table";
import { getCareerOpportunities } from "@/lib/api";

export default async function DashboardCareerPage() {
  const opportunities = await getCareerOpportunities();
  return (
    <div>
      <DashboardTopbar title="Manajemen Karier" />
      <div className="p-4 lg:p-8">
        <CareerTable opportunities={opportunities} />
      </div>
    </div>
  );
}
