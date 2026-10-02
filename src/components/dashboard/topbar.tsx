"use client";

import { Bell, Search } from "lucide-react";

export function DashboardTopbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur lg:px-8">
      <h1 className="text-lg font-bold text-ink">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input placeholder="Cari..." className="h-9 w-56 rounded-full border border-border bg-surface pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40" />
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-surface-alt">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue text-xs font-bold text-white">AD</div>
      </div>
    </header>
  );
}
