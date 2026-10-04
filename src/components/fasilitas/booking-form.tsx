"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarCheck2, CheckCircle2, ClipboardCheck, Clock3, PartyPopper, RotateCcw,
  Building2, AlertTriangle, Loader2, Timer,
} from "lucide-react";
import { Facility, FacilityBooking, RequesterType } from "@/types";
import { facilities as allFacilities } from "@/data/facilities";
import { Button, LinkButton } from "@/components/ui/button";
import { formatDuration, formatTime, formatTimeRange, timeOverlaps, cn } from "@/lib/utils";

const requesterTypes: RequesterType[] = ["Siswa", "Guru", "Ekstrakurikuler", "Organisasi", "Umum"];

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40";

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-ink-soft">
      {children}
    </label>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-bold text-ink">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-soft text-orange">
        <Icon className="h-3.5 w-3.5" />
      </span>
      {children}
    </p>
  );
}

export function BookingForm() {
  const params = useSearchParams();
  const preselected = params.get("fasilitas");

  const [facilitySlug, setFacilitySlug] = useState(
    allFacilities.some((f) => f.slug === preselected) ? (preselected as string) : allFacilities[0].slug
  );
  const [name, setName] = useState("");
  const [type, setType] = useState<RequesterType>("Siswa");
  const [organization, setOrganization] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participants, setParticipants] = useState("");
  const [purpose, setPurpose] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<FacilityBooking | null>(null);
  const [bookings, setBookings] = useState<FacilityBooking[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/bookings", { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (Array.isArray(json?.bookings)) setBookings(json.bookings);
      })
      .catch(() => {
        // daftar bentrokan opsional — gagal ambil tidak memblokir form
      });
    return () => ctrl.abort();
  }, []);

  const facility: Facility = useMemo(
    () => allFacilities.find((f) => f.slug === facilitySlug) ?? allFacilities[0],
    [facilitySlug]
  );

  const conflicts = useMemo(() => {
    if (!date || !startTime || !endTime || startTime >= endTime) {
      return { approved: [] as FacilityBooking[], pending: [] as FacilityBooking[] };
    }
    const same = bookings.filter(
      (b) =>
        b.facilitySlug === facility.slug &&
        b.date === date &&
        b.status !== "Ditolak" &&
        b.status !== "Selesai",
    );
    return {
      approved: same.filter(
        (b) => b.status === "Disetujui" && timeOverlaps(startTime, endTime, b.startTime, b.endTime),
      ),
      pending: same.filter(
        (b) => b.status === "Menunggu" && timeOverlaps(startTime, endTime, b.startTime, b.endTime),
      ),
    };
  }, [bookings, facility.slug, date, startTime, endTime]);

  const durationLabel = startTime && endTime ? formatDuration(startTime, endTime) : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Nama pemesan wajib diisi.");
    if (!organization.trim()) return setError("Kelas / ekstrakurikuler / instansi wajib diisi.");
    if (!contact.trim()) return setError("Nomor HP atau email wajib diisi.");
    if (!date) return setError("Tanggal pemesanan wajib dipilih.");
    if (!startTime || !endTime) return setError("Isi jam mulai dan jam selesai pemesanan.");
    if (startTime >= endTime) return setError("Jam selesai harus lebih besar dari jam mulai.");
    if (startTime < facility.openTime || endTime > facility.closeTime)
      return setError(
        `${facility.name} hanya bisa dipesan antara ${formatTime(facility.openTime)}–${formatTime(facility.closeTime)} WIB.`
      );
    if (conflicts.approved.length > 0)
      return setError(
        `Jadwal bertabrakan dengan pemesanan yang sudah disetujui (${formatTimeRange(
          conflicts.approved[0].startTime, conflicts.approved[0].endTime
        )} WIB). Silakan pilih jam lain.`
      );
    if (!participants || Number(participants) < 1) return setError("Jumlah peserta minimal 1 orang.");
    if (Number(participants) > facility.capacity)
      return setError(`Kapasitas maksimal ${facility.name} adalah ${facility.capacity} orang.`);
    if (!purpose.trim()) return setError("Tuliskan keperluan pemesanan.");
    if (!agree) return setError("Centang persetujuan ketentuan pemesanan.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilitySlug: facility.slug,
          requesterName: name.trim(),
          requesterType: type,
          organization: organization.trim(),
          contact: contact.trim(),
          date,
          startTime,
          endTime,
          participants: Number(participants),
          purpose: purpose.trim(),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.booking) {
        throw new Error(json?.error || "Pengajuan gagal terkirim. Coba lagi atau hubungi Tata Usaha.");
      }
      setSubmitted(json.booking as FacilityBooking);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pengajuan gagal terkirim. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-xl rounded-3xl border border-border bg-surface p-8 text-center shadow-lg shadow-ink/5"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <PartyPopper className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold text-ink">Pemesanan Terkirim!</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Pengajuan untuk <span className="font-semibold text-ink">{submitted.facilityName}</span> pada{" "}
          {new Date(submitted.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })},{" "}
          {formatTimeRange(submitted.startTime, submitted.endTime)} WIB sedang menunggu verifikasi admin.
        </p>

        <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface-alt/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Kode Pemesanan</p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-wide text-orange">{submitted.id}</p>
          <p className="mt-2 text-xs text-ink-soft">Simpan kode ini untuk memantau status pemesanan Anda.</p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <LinkButton href={`/fasilitas/status?kode=${submitted.id}`}>Lacak Status</LinkButton>
          <LinkButton href="/fasilitas" variant="outline">Kembali ke Katalog</LinkButton>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-surface p-6 sm:p-8" noValidate>
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <ClipboardCheck className="h-5 w-5 text-orange" /> Formulir Pemesanan
        </h2>

        <div className="mt-7">
          {/* fasilitas & waktu */}
          <SectionTitle icon={Building2}>Fasilitas &amp; Waktu Pemesanan</SectionTitle>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="facility">Fasilitas yang Dipesan</FieldLabel>
              <select
                id="facility"
                value={facilitySlug}
                onChange={(e) => setFacilitySlug(e.target.value)}
                className={cn(inputClass, "appearance-none")}
              >
                {allFacilities.map((f) => (
                  <option key={f.slug} value={f.slug}>{f.name} — {f.category}</option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="date">Tanggal Pemesanan</FieldLabel>
              <input
                id="date" type="date" min={todayIso()} value={date}
                onChange={(e) => setDate(e.target.value)} className={inputClass}
              />
            </div>

            <div>
              <FieldLabel>Jam Mulai – Selesai <span className="text-muted">(bebas)</span></FieldLabel>
              <div className="flex items-center gap-2">
                <input
                  type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  min={facility.openTime} max={facility.closeTime} step={300}
                  className={cn(inputClass, "px-3")} aria-label="Jam mulai"
                />
                <span className="text-sm font-semibold text-muted">–</span>
                <input
                  type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  min={facility.openTime} max={facility.closeTime} step={300}
                  className={cn(inputClass, "px-3")} aria-label="Jam selesai"
                />
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                Jam operasional {facility.name}: {formatTime(facility.openTime)}–{formatTime(facility.closeTime)} WIB.
                Atur sesuai kebutuhan kegiatan Anda.
              </p>
              {durationLabel && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-orange-soft px-2.5 py-1 text-[11px] font-semibold text-orange-dark">
                  <Timer className="h-3 w-3" /> Durasi: {durationLabel}
                </p>
              )}
            </div>
          </div>

          {conflicts.approved.length > 0 && (
            <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-600">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <b>Bentrok:</b> {facility.name} sudah disetujui untuk pihak lain pada rentang{" "}
                {conflicts.approved
                  .map((b) => `${formatTimeRange(b.startTime, b.endTime)} (${b.organization})`)
                  .join(", ")}{" "}
                WIB. Silakan geser jam atau pilih tanggal lain — lihat{" "}
                <Link href="/fasilitas/jadwal" className="underline">jadwal pemesanan</Link>.
              </span>
            </p>
          )}
          {conflicts.approved.length === 0 && conflicts.pending.length > 0 && (
            <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-orange-soft/70 px-4 py-3 text-xs leading-relaxed text-orange-dark">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <b>Perhatian:</b> ada pengajuan lain ({conflicts.pending
                  .map((b) => `${formatTimeRange(b.startTime, b.endTime)} (${b.organization})`)
                  .join(", ")}{" "}
                WIB) yang masih menunggu verifikasi. Pengajuan Anda tetap bisa dikirim — admin akan
                memprioritaskan yang lebih dulu masuk.
              </span>
            </p>
          )}
        </div>

        <hr className="my-7 border-border/70" />

        <div>
          {/* data pemesan */}
          <SectionTitle icon={ClipboardCheck}>Data Pemesan</SectionTitle>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="name">Nama Pemesan</FieldLabel>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" className={inputClass} />
            </div>
            <div>
              <FieldLabel htmlFor="contact">Nomor HP / Email</FieldLabel>
              <input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="08xx / email" className={inputClass} />
            </div>

            <div className="sm:col-span-2">
              <FieldLabel>Kategori Pemesan</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {requesterTypes.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      type === t ? "border-orange bg-orange text-white" : "border-border text-ink-soft hover:border-ink"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="organization">Kelas / Ekskul / Instansi</FieldLabel>
              <input id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="cth. XI-4 / OSIS / Puskesmas" className={inputClass} />
            </div>

            <div>
              <FieldLabel htmlFor="participants">Jumlah Peserta</FieldLabel>
              <input
                id="participants" type="number" min={1} max={facility.capacity}
                value={participants} onChange={(e) => setParticipants(e.target.value)}
                placeholder={`Maks. ${facility.capacity}`} className={inputClass}
              />
            </div>
          </div>
        </div>

        <hr className="my-7 border-border/70" />

        <div>
          {/* keperluan */}
          <SectionTitle icon={Clock3}>Keperluan Pemesanan</SectionTitle>
          <div className="mt-4">
            <textarea
              id="purpose" rows={4} value={purpose} onChange={(e) => setPurpose(e.target.value)}
              placeholder="Jelaskan singkat kegiatan yang akan dilaksanakan — akan tampil pada jadwal pemesanan publik..."
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40"
            />
          </div>
        </div>

        <label className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
          <input
            type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-border accent-orange"
          />
          Saya menyetujui ketentuan pemesanan fasilitas sekolah dan bersedia menjaga kebersihan serta keamanan fasilitas yang digunakan.
        </label>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600">{error}</p>
        )}

        <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" /> Mengirim pengajuan…
            </>
          ) : (
            <>
              <CalendarCheck2 className="h-4.5 w-4.5" /> Kirim Pengajuan Pemesanan
            </>
          )}
        </Button>
      </form>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface">
          <img src={facility.image} alt={facility.name} className="aspect-[16/9] w-full object-cover" />
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange">{facility.category}</p>
            <h3 className="mt-1 text-base font-bold text-ink">{facility.name}</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{facility.shortDescription}</p>
            <ul className="mt-4 space-y-1.5 text-xs text-ink-soft">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-orange" /> Kapasitas maks. {facility.capacity} orang</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-orange" /> Jam operasional {formatTime(facility.openTime)}–{formatTime(facility.closeTime)} WIB</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-orange" /> PIC: {facility.pic}</li>
              {facility.note && (
                <li className="flex items-start gap-2 text-orange-dark"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange" /> {facility.note}</li>
              )}
            </ul>
            <Link
              href={`/fasilitas/${facility.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-orange hover:underline"
            >
              Lihat detail fasilitas →
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-surface-alt/50 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <RotateCcw className="h-4 w-4 text-orange" /> Sudah punya kode pemesanan?
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
            Pantau proses verifikasi pengajuan Anda melalui halaman cek status.
          </p>
          <Link href="/fasilitas/status" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange hover:underline">
            Buka Cek Status →
          </Link>
        </div>
      </aside>
    </div>
  );
}
