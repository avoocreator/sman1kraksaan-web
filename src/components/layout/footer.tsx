"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { Eye, Instagram, Youtube, Facebook, Mail, MapPin, Phone } from "lucide-react";
import { SupportLogos } from "@/components/home/support-logos";

const columns = [
  {
    title: "Sekolah",
    links: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Program Pendidikan", href: "/programs" },
      { label: "Pesan Fasilitas", href: "/fasilitas" },
      { label: "PPDB", href: "/ppdb" },
    ],
  },
  {
    title: "Jelajahi",
    links: [
      { label: "Prestasi", href: "/achievements" },
      { label: "Alumni", href: "/alumni" },
      { label: "Mitra Industri", href: "/partners" },
      { label: "Berita", href: "/news" },
      { label: "Agenda", href: "/events" },
      { label: "Jelajahi Sekolah", href: "/jelajahi" },
      { label: "Pencarian", href: "/search" },
    ],
  },
];

export default function Footer({ totalVisits }: { totalVisits?: number | null }) {
  const [visits, setVisits] = useState(
    typeof totalVisits === "number" && totalVisits >= 0 ? totalVisits : 0,
  );

  useEffect(() => {
    let alive = true;
    const refresh = () => {
      fetch("/api/visit-total", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j: { total?: number } | null) => {
          if (alive && j && typeof j.total === "number" && j.total >= 0) setVisits(j.total);
        })
        .catch(() => {});
    };
    refresh();
    const timer = setInterval(refresh, 60_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid grid-cols-2 gap-x-8 gap-y-10 py-12 md:grid-cols-4 lg:grid-cols-12">
        {/* brand */}
        <div className="col-span-2 md:col-span-4 lg:col-span-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
              <img src="/logo-sman1kraksaan.png" alt="Logo SMAN 1 Kraksaan" className="h-full w-full object-contain" />
            </span>
            <span className="text-sm font-bold text-ink">SMAN 1 Kraksaan</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            One School. One Digital Ecosystem. Menghubungkan sekolah, prestasi, alumni, dan industri dalam satu platform.
          </p>
          <div className="mt-5 flex items-center gap-3 text-ink-soft">
            <a href="#" aria-label="Instagram" className="hover:text-orange"><Instagram className="h-4.5 w-4.5" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-orange"><Youtube className="h-4.5 w-4.5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-orange"><Facebook className="h-4.5 w-4.5" /></a>
          </div>

          <div className="mt-5">
            <div
              className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface-alt py-1.5 pl-1.5 pr-4"
              title="Satu pengunjung dihitung sekali dalam rentang 1 jam aktivitas — buka halaman mana pun tetap dihitung satu kunjungan"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange">
                <Eye className="h-3.5 w-3.5 text-white" aria-hidden />
              </span>
              <p className="text-xs text-muted">
                <span className="text-sm font-bold tabular-nums text-ink">{visits.toLocaleString("id-ID")}</span>{" "}
                kunjungan
              </p>
            </div>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="lg:col-span-2">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-soft hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-2 lg:col-span-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Kontak</p>
          {/* kontak */}
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Jl. Panglima Sudirman, Kraksaan, Probolinggo</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> (0335) 841 234</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> info@sman1kraksaan.sch.id</li>
          </ul>
          <iframe
            title="Peta lokasi SMAN 1 Kraksaan"
            src="https://maps.google.com/maps?q=SMAN%201%20Kraksaan%2C%20Jl.%20Panglima%20Sudirman%2C%20Kraksaan%2C%20Probolinggo&z=15&output=embed"
            className="mt-4 h-40 w-full rounded-xl border border-border bg-surface-alt sm:h-44"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center gap-3 py-5 sm:flex-row sm:justify-between sm:gap-8">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted">Didukung oleh</p>
          {/* logo pendukung */}
          <SupportLogos className="justify-center sm:justify-end" />
        </div>
      </div>

      <div className="border-t border-border py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} SMAN 1 Kraksaan. Seluruh hak cipta dilindungi.</p>
          <p>Dibuat untuk JHIC 2.0 2026 — Web Development</p>
        </div>
      </div>
    </footer>
  );
}
