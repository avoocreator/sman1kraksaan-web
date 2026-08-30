"use client";

import { DataTable, Badge } from "@/components/dashboard/data-table";
import { CareerOpportunity } from "@/types";
import { formatDate } from "@/lib/utils";

export function CareerTable({ opportunities }: { opportunities: CareerOpportunity[] }) {
  const rows = opportunities.map((o) => ({ id: o.slug, ...o }));
  return (
    <DataTable
      title={`Peluang Karier (${rows.length})`}
      addLabel="Tambah Lowongan"
      rows={rows}
      searchKeys={(r) => r.position}
      columns={[
        { key: "position", label: "Posisi", render: (r) => <span className="font-medium text-ink">{r.position}</span> },
        { key: "company", label: "Perusahaan", render: (r) => r.company },
        { key: "type", label: "Tipe", render: (r) => <Badge tone="blue">{r.type}</Badge> },
        { key: "deadline", label: "Batas Waktu", render: (r) => formatDate(r.deadline) },
      ]}
    />
  );
}
