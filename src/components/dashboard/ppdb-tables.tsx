"use client";

import { DataTable, Badge } from "@/components/dashboard/data-table";

const timeline = [
  { id: "1", label: "Pendaftaran Online Dibuka", date: "2026-06-01", status: "Aktif" },
  { id: "2", label: "Verifikasi Berkas", date: "2026-06-01", status: "Terjadwal" },
  { id: "3", label: "Pengumuman Hasil Seleksi", date: "2026-06-20", status: "Terjadwal" },
  { id: "4", label: "Daftar Ulang", date: "2026-06-21", status: "Terjadwal" },
];

const faqs = [
  { id: "1", question: "Apakah pendaftaran bisa online?", updated: "2026-05-10" },
  { id: "2", question: "Apakah ada jalur prestasi?", updated: "2026-05-10" },
  { id: "3", question: "Bagaimana jika berkas belum lengkap?", updated: "2026-05-12" },
];

export function PpdbTables() {
  return (
    <div className="space-y-6">
      <DataTable
        title="Jadwal & Tahapan"
        addLabel="Tambah Tahapan"
        rows={timeline}
        searchKeys={(r) => r.label}
        columns={[
          { key: "label", label: "Tahapan", render: (r) => <span className="font-medium text-ink">{r.label}</span> },
          { key: "date", label: "Tanggal", render: (r) => r.date },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status === "Aktif" ? "orange" : "neutral"}>{r.status}</Badge> },
        ]}
      />
      <DataTable
        title="Pertanyaan Umum (FAQ)"
        addLabel="Tambah FAQ"
        rows={faqs}
        searchKeys={(r) => r.question}
        columns={[
          { key: "question", label: "Pertanyaan", render: (r) => <span className="font-medium text-ink">{r.question}</span> },
          { key: "updated", label: "Diperbarui", render: (r) => r.updated },
        ]}
      />
    </div>
  );
}
