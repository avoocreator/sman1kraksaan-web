import { DashboardTopbar } from "@/components/dashboard/topbar";
import { PartnersTable } from "@/components/dashboard/partners-table";
import { getPartners } from "@/lib/api";

export default async function DashboardPartnersPage() {
  const partners = await getPartners();
  return (
    <div>
      <DashboardTopbar title="Manajemen Mitra" />
      <div className="p-4 lg:p-8">
        <PartnersTable partners={partners} />
      </div>
    </div>
  );
}
