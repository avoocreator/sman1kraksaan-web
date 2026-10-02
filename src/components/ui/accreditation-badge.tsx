"use client";

import { motion } from "framer-motion";
import { Download, ShieldCheck } from "lucide-react";
import { accreditation } from "@/data/school-profile";
import { cn } from "@/lib/utils";

/**
 * Lencana akreditasi ringkas — dipakai di Navbar & Hero.
 * Variant "compact" untuk ruang sempit (navbar), "full" untuk hero/card.
 */
export function AccreditationBadge({
  variant = "full",
  className,
}: {
  variant?: "compact" | "full";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-ink-soft",
          className
        )}
        title={`Terakreditasi ${accreditation.rank} oleh ${accreditation.issuedBy}`}
      >
        <ShieldCheck className="h-3.5 w-3.5 text-orange" />
        Akreditasi {accreditation.rank}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm",
        className
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange text-lg font-extrabold text-white">
        {accreditation.rank}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-none text-ink">Terakreditasi {accreditation.rank}</p>
        <p className="mt-1 text-[11px] leading-snug text-muted">{accreditation.issuedBy}</p>
      </div>
    </motion.div>
  );
}

export function AccreditationCertificateDownload({
  className,
  href,
}: {
  className?: string;
  /** URL PDF dari Strapi (single type `acreditation`). Kosong → fallback file statis. */
  href?: string;
}) {
  return (
    <a
      href={href || accreditation.certificatePdf}
      download
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1c3d59]",
        className
      )}
    >
      <Download className="h-4 w-4" />
      Unduh Sertifikat Akreditasi (PDF)
    </a>
  );
}

/**
 * Kartu akreditasi yang sekaligus jadi tombol unduh (dipakai di Hero).
 * Satu klik di mana pun pada kartu → langsung mengunduh PDF sertifikat.
 * Ikon unduh di kanan sebagai penanda, tanpa tombol terpisah.
 */
export function AccreditationDownloadCard({
  className,
  href,
}: {
  className?: string;
  /** URL PDF dari Strapi (single type `acreditation`). Kosong → fallback file statis. */
  href?: string;
}) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      href={href || accreditation.certificatePdf}
      download
      title="Klik untuk mengunduh sertifikat akreditasi (PDF)"
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm transition-all hover:border-orange/40 hover:shadow-md hover:shadow-orange/10",
        className
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange text-lg font-extrabold text-white">
        {accreditation.rank}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-none text-ink">Terakreditasi {accreditation.rank}</p>
        <p className="mt-1 text-[11px] leading-snug text-muted">{accreditation.issuedBy}</p>
      </div>
      <span
        className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/10 text-blue transition-colors group-hover:bg-blue group-hover:text-white"
        aria-hidden
      >
        <Download className="h-4 w-4" />
      </span>
    </motion.a>
  );
}
