"use client";

import { DataTable, Badge } from "@/components/dashboard/data-table";
import { NewsArticle } from "@/types";
import { formatDate } from "@/lib/utils";

export function NewsTable({ news }: { news: NewsArticle[] }) {
  const rows = news.map((n) => ({ id: n.slug, ...n }));
  return (
    <DataTable
      title={`Berita (${rows.length})`}
      addLabel="Tulis Berita"
      rows={rows}
      searchKeys={(r) => r.title}
      columns={[
        { key: "title", label: "Judul", render: (r) => <span className="font-medium text-ink">{r.title}</span> },
        { key: "category", label: "Kategori", render: (r) => <Badge tone="neutral">{r.category}</Badge> },
        { key: "publishedAt", label: "Tanggal Terbit", render: (r) => formatDate(r.publishedAt) },
        { key: "author", label: "Penulis", render: (r) => r.author },
      ]}
    />
  );
}
