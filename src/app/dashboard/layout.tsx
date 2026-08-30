import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <DashboardSidebar />
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
