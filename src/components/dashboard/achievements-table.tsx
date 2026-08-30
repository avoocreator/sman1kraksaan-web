"use client";

import { DataTable, Badge } from "@/components/dashboard/data-table";
import { Achievement } from "@/types";

export function AchievementsTable({ achievements }: { achievements: Achievement[] }) {
  const rows = achievements.map((a) => ({ id: a.slug, ...a }));
  return (
    <DataTable
      title={`Prestasi (${rows.length})`}
      addLabel="Tambah Prestasi"
      rows={rows}
      searchKeys={(r) => r.title}
      columns={[
        { key: "title", label: "Judul", render: (r) => <span className="font-medium text-ink">{r.title}</span> },
        { key: "category", label: "Kategori", render: (r) => <Badge tone="orange">{r.category}</Badge> },
        { key: "level", label: "Tingkat", render: (r) => <Badge tone="blue">{r.level}</Badge> },
        { key: "year", label: "Tahun", render: (r) => r.year },
        { key: "participants", label: "Peserta", render: (r) => r.participants.join(", ") },
      ]}
    />
  );
}
