"use client";

import { DataTable, Badge } from "@/components/dashboard/data-table";
import { SchoolEvent } from "@/types";
import { formatDate } from "@/lib/utils";

export function EventsTable({ events }: { events: SchoolEvent[] }) {
  const rows = events.map((e) => ({ id: e.slug, ...e }));
  return (
    <DataTable
      title={`Agenda (${rows.length})`}
      addLabel="Tambah Agenda"
      rows={rows}
      searchKeys={(r) => r.title}
      columns={[
        { key: "title", label: "Judul", render: (r) => <span className="font-medium text-ink">{r.title}</span> },
        { key: "date", label: "Tanggal", render: (r) => formatDate(r.date) },
        { key: "location", label: "Lokasi", render: (r) => r.location },
        { key: "status", label: "Status", render: (r) => <Badge tone={r.status === "Akan Datang" ? "orange" : "neutral"}>{r.status}</Badge> },
      ]}
    />
  );
}
