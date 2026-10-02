import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, MapPin, UserCheck, Clock, CheckCircle2, Info, ArrowRight, CalendarDays } from "lucide-react";
import { getAllFacilities, getFacilityBySlug } from "@/data/facilities";
import { getFacilities, getFacility } from "@/lib/api/fasilitas";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FacilityCard } from "@/components/fasilitas/facility-card";
import { FacilityUpcoming } from "@/components/fasilitas/facility-upcoming";
import { formatTime } from "@/lib/utils";
import type { Facility } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllFacilities().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const facility = getFacilityBySlug(slug);
  if (!facility) return { title: "Fasilitas tidak ditemukan" };
  return {
    title: facility.name,
    description: facility.shortDescription,
  };
}
const rules = [
  "Pengajuan pemesanan minimal 3 hari sebelum tanggal pelaksanaan (acara malam minimal 7 hari).",
  "Pemesanan diverifikasi oleh Waka Sarana Prasarana pada hari kerja.",
  "Pengguna wajib menjaga kebersihan dan keamanan fasilitas selama digunakan.",
  "Kerusakan atau kehilangan peralatan menjadi tanggung jawab pemesan.",
  "Fasilitas harus dikembalikan dalam kondisi awal setelah kegiatan selesai.",
];

/**
 * Kartu "Pesan Fasilitas Ini".
 * Dirender dua kali: sebagai panel melayang (fixed) di desktop — selalu terlihat
 * di layar kapan pun halaman discroll — dan sebagai kartu biasa di tablet/mobile
 * yang mengalir mengikuti konten halaman.
 */
function BookingPanel({ facility }: { facility: Facility }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg shadow-ink/5">
      <h2 className="text-lg font-bold text-ink">Pesan Fasilitas Ini</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        Ajukan pemesanan dengan tanggal dan jam mulai–selesai yang Anda tentukan sendiri.
      </p>

      <div className="mt-4 space-y-2.5">
        <LinkButton href={`/fasilitas/pesan?fasilitas=${facility.slug}`} className="w-full">
          Ajukan Pemesanan <ArrowRight className="h-4 w-4" />
        </LinkButton>
        <Link
          href="/fasilitas/jadwal"
          className="flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-center text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          <CalendarDays className="h-4 w-4 text-orange" /> Lihat Jadwal Pemesanan
        </Link>
        <Link
          href="/fasilitas/status"
          className="block rounded-full border border-border px-5 py-2.5 text-center text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Cek Status Pemesanan
        </Link>
      </div>

      <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
        <div className="flex items-start gap-2.5">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <dt className="text-xs text-muted">Kapasitas</dt>
            <dd className="font-medium text-ink">Maks. {facility.capacity} orang</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <dt className="text-xs text-muted">Lokasi</dt>
            <dd className="font-medium text-ink">{facility.location}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <dt className="text-xs text-muted">Penanggung Jawab</dt>
            <dd className="font-medium text-ink">{facility.pic}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <dt className="text-xs text-muted">Jam Operasional</dt>
            <dd className="font-medium text-ink">
              {formatTime(facility.openTime)}–{formatTime(facility.closeTime)} WIB
              <span className="block text-xs font-normal leading-relaxed text-ink-soft">
                Jam mulai–selesai bebas, selama tidak berbenturan dengan pemesanan lain.
              </span>
            </dd>
          </div>
        </div>
      </dl>

      <FacilityUpcoming slug={facility.slug} />

      {facility.note && (
        <div className="mt-5 flex gap-2.5 rounded-xl bg-orange-soft/70 p-3.5 text-xs leading-relaxed text-orange-dark">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {facility.note}
        </div>
      )}
    </div>
  );
}

export default async function FacilityDetailPage({ params }: Props) {
  const { slug } = await params;
  // Strapi dulu, fallback data statis — entri statis selalu bisa diakses.
  const facility = (await getFacility(slug)) ?? getFacilityBySlug(slug);
  if (!facility) notFound();

  const all = await getFacilities();
  const others = all
    .filter((f) => f.slug !== facility.slug && f.category === facility.category)
    .concat(all.filter((f) => f.slug !== facility.slug && f.category !== facility.category))
    .slice(0, 4);

  return (
    <div className="container-page py-14 md:py-20">
      <Link
        href="/fasilitas"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke katalog
      </Link>

      {/* Desktop: kartu pemesanan MELAYANG (position: fixed) — posisinya tetap di layar
          selama halaman discroll ke bagian mana pun, sampai footer sekalipun.
          Wrapper full-width + container-page + grid yang sama membuat kartu persis
          segaris dengan kolom kanan grid konten di bawahnya.
          pointer-events-none pada wrapper agar area kosongnya tidak menghalangi klik
          konten di belakangnya; pointer-events-auto dikembalikan pada kartunya. */}
      <div className="pointer-events-none fixed inset-x-0 top-24 z-40 hidden lg:block">
        <div className="container-page">
          <div className="grid grid-cols-[1.6fr_1fr] gap-10">
            <div />
            <div className="pointer-events-auto max-h-[calc(100vh-7rem)] overflow-y-auto">
              <BookingPanel facility={facility} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Kolom kiri: foto + deskripsi */}
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="overflow-hidden rounded-3xl border border-border">
            <img src={facility.image} alt={facility.name} className="aspect-[16/10] w-full object-cover" />
          </div>

          <div className="mt-6">
            <Badge tone="orange">{facility.category}</Badge>
            <h1 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{facility.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">{facility.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Fasilitas Pendukung</p>
              <ul className="mt-3 space-y-2">
                {facility.amenities.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Ketentuan Pemesanan</p>
              <ol className="mt-3 space-y-2.5">
                {rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-surface-alt text-[10px] font-bold text-ink-soft">
                      {i + 1}
                    </span>
                    {r}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Tablet/mobile: kartu pemesanan mengalir biasa mengikuti konten
            (di desktop kartu ini disembunyikan dan digantikan panel fixed di atas) */}
        <div className="lg:hidden">
          <BookingPanel facility={facility} />
        </div>

        {/* Fasilitas lainnya — ditempatkan di kolom kiri baris ke-2 (desktop)
            agar kartu-kartunya tidak tertutup panel pemesanan yang melayang di kanan */}
        <div className="lg:col-start-1 lg:row-start-2">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">Fasilitas Lainnya</h2>
            <Link href="/fasilitas" className="hidden text-sm font-medium text-orange hover:underline sm:block">
              Lihat semua fasilitas
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {others.map((f, i) => (
              <FacilityCard key={f.slug} facility={f} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
