"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Instagram, Youtube, Facebook, Mail, MapPin, Phone } from "lucide-react";

const columns = [
  {
    title: "Sekolah",
    links: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Program Pendidikan", href: "/programs" },
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
    ],
  },
  {
    title: "Peluang",
    links: [
      { label: "Karier & PKL", href: "/career" },
      { label: "Pencarian", href: "/search" },
      { label: "Masuk Admin", href: "/login" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid grid-cols-2 gap-10 py-14 md:grid-cols-6">
        <div className="col-span-2 md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange text-white">
              <GraduationCap className="h-5 w-5" strokeWidth={2.2} />
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
        </div>

        {columns.map((col) => (
          <div key={col.title}>
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

        <div className="col-span-2 md:col-span-2">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Kontak</p>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Jl. Panglima Sudirman, Kraksaan, Probolinggo</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> (0335) 841 234</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> info@sman1kraksaan.sch.id</li>
          </ul>
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
