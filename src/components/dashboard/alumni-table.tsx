"use client";

import { DataTable, Badge } from "@/components/dashboard/data-table";
import { Alumnus } from "@/types";

export function AlumniTable({ alumni }: { alumni: Alumnus[] }) {
  const rows = alumni.map((a) => ({ id: a.slug, ...a }));
  return (
    <DataTable
      title={`Alumni (${rows.length})`}
      addLabel="Tambah Alumni"
      rows={rows}
      searchKeys={(r) => r.name}
      columns={[
        { key: "name", label: "Nama", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
        { key: "graduationYear", label: "Angkatan", render: (r) => r.graduationYear },
        { key: "destination", label: "Kampus/Perusahaan", render: (r) => r.destination },
        { key: "role", label: "Peran Saat Ini", render: (r) => r.role },
        { key: "category", label: "Kategori", render: (r) => <Badge tone="blue">{r.category}</Badge> },
      ]}
    />
  );
}
