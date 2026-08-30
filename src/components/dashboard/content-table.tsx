"use client";

import { DataTable, Badge } from "@/components/dashboard/data-table";
import { formatDate } from "@/lib/utils";

interface ContentRow {
  id: string;
  title: string;
  type: string;
  status: string;
  updated: string;
  author: string;
}

export function ContentTable({ rows }: { rows: ContentRow[] }) {
  return (
    <DataTable
      title={`Seluruh Konten (${rows.length})`}
      addLabel="Buat Konten"
      rows={rows}
      searchKeys={(r) => r.title}
      columns={[
        { key: "title", label: "Judul", render: (r) => <span className="font-medium text-ink">{r.title}</span> },
        { key: "type", label: "Tipe", render: (r) => <Badge tone="neutral">{r.type}</Badge> },
        { key: "status", label: "Status", render: (r) => <Badge tone={r.status === "Terbit" ? "orange" : "blue"}>{r.status}</Badge> },
        { key: "updated", label: "Diperbarui", render: (r) => formatDate(r.updated) },
        { key: "author", label: "Penulis", render: (r) => r.author },
      ]}
    />
  );
}
