import { DashboardTopbar } from "@/components/dashboard/topbar";
import { AlumniTable } from "@/components/dashboard/alumni-table";
import { getAlumni } from "@/lib/api";

export default async function DashboardAlumniPage() {
  const alumni = await getAlumni();
  return (
    <div>
      <DashboardTopbar title="Manajemen Alumni" />
      <div className="p-4 lg:p-8">
        <AlumniTable alumni={alumni} />
      </div>
    </div>
  );
}
