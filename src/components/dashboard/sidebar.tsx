"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Trophy, Users, Handshake, Briefcase,
  Newspaper, CalendarDays, ClipboardList, BarChart3, Settings, GraduationCap, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Konten", href: "/dashboard/content", icon: FileText },
  { label: "Prestasi", href: "/dashboard/achievements", icon: Trophy },
  { label: "Alumni", href: "/dashboard/alumni", icon: Users },
  { label: "Mitra", href: "/dashboard/partners", icon: Handshake },
  { label: "Karier", href: "/dashboard/career", icon: Briefcase },
  { label: "Berita", href: "/dashboard/news", icon: Newspaper },
  { label: "Agenda", href: "/dashboard/events", icon: CalendarDays },
  { label: "PPDB", href: "/dashboard/ppdb", icon: ClipboardList },
  { label: "Analitik", href: "/dashboard/analytics", icon: BarChart3 },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange text-white">
          <GraduationCap className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-bold text-ink">SMAN 1 Kraksaan</span>
          <span className="block text-[11px] text-muted">Admin Panel</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-orange-soft text-orange-dark" : "text-ink-soft hover:bg-surface-alt hover:text-ink"
              )}
            >
              <Icon className="h-4.5 w-4.5" /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-alt hover:text-ink">
          <Settings className="h-4.5 w-4.5" /> Pengaturan
        </Link>
        <Link href="/login" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-alt hover:text-ink">
          <LogOut className="h-4.5 w-4.5" /> Keluar
        </Link>
      </div>
    </aside>
  );
}
