"use client";

import { DataTable, Badge } from "@/components/dashboard/data-table";
import { Partner } from "@/types";

export function PartnersTable({ partners }: { partners: Partner[] }) {
  const rows = partners.map((p) => ({ id: p.slug, ...p }));
  return (
    <DataTable
      title={`Mitra Industri (${rows.length})`}
      addLabel="Tambah Mitra"
      rows={rows}
      searchKeys={(r) => r.name}
      columns={[
        { key: "name", label: "Perusahaan", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
        { key: "type", label: "Jenis", render: (r) => <Badge tone="blue">{r.type}</Badge> },
        { key: "since", label: "Mitra Sejak", render: (r) => r.since },
        { key: "programs", label: "Program", render: (r) => r.programs.length },
      ]}
    />
  );
}
