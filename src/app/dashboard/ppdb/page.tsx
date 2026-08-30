import { DashboardTopbar } from "@/components/dashboard/topbar";
import { PpdbTables } from "@/components/dashboard/ppdb-tables";

export default function DashboardPpdbPage() {
  return (
    <div>
      <DashboardTopbar title="Manajemen PPDB" />
      <div className="p-4 lg:p-8">
        <PpdbTables />
      </div>
    </div>
  );
}
