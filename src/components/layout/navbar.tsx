"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, GraduationCap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";
import { AccreditationBadge } from "@/components/ui/accreditation-badge";

const navLinks = [
  { label: "Tentang", href: "/about" },
  { label: "Program", href: "/programs" },
  { label: "Prestasi", href: "/achievements" },
  { label: "Alumni", href: "/alumni" },
];

const moreLinks = [
  { label: "Mitra Industri", href: "/partners" },
  { label: "Karier & PKL", href: "/career" },
  { label: "Berita", href: "/news" },
  { label: "Agenda", href: "/events" },
  { label: "PPDB", href: "/ppdb" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
          : "border-b border-transparent bg-bg/40 backdrop-blur-sm"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
            <img src="/logo-sman1kraksaan.png" alt="Logo SMAN 1 Kraksaan" className="h-full w-full object-contain" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-ink">SMAN 1 Kraksaan</span>
            <span className="block text-[11px] font-medium tracking-wide text-muted">School Digital Hub</span>
          </span>
        </Link>

        <AccreditationBadge variant="compact" className="hidden md:inline-flex" />

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink",
                pathname === link.href && "text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink">
              Lainnya <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full w-52 rounded-xl border border-border bg-surface p-1.5 shadow-lg shadow-ink/5"
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-surface-alt hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/search"
            aria-label="Cari"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>
          <LinkButton href="/ppdb" size="sm">
            Jelajahi Sekolah
          </LinkButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink lg:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-bg lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {[...navLinks, ...moreLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-alt hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center gap-2">
                <Link href="/search" className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-border text-sm text-ink-soft">
                  <Search className="h-4 w-4" /> Cari
                </Link>
                <LinkButton href="/ppdb" size="md" className="flex-1">
                  Jelajahi Sekolah
                </LinkButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
