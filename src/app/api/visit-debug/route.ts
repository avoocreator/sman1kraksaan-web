/**
 * Alat diagnosis penghitung kunjungan — buka di browser:
 *
 *   /api/visit-debug        → diagnosis aman (tanpa menulis apa pun)
 *   /api/visit-debug?do=1   → diagnosis + SATU percobaan tulis nyata
 *                             (kalau berhasil, total +1 dan entri "diag-…"
 *                             bisa dihapus manual di Strapi)
 *
 * Menjawab pertanyaan-pertanyaan ini secara langsung:
 *   1. Token baca/tulis sudah terbaca server? (ditampilkan ter-mask)
 *   2. Find visit-logs jalan? (tes query persis seperti kode produksi)
 *   3. POST create diterima Strapi? (status + pesan error mentahnya)
 *
 * Tidak ada rahasia yang bocor: token hanya tampil 6 karakter pertama.
 * Route ini aman dibiarkan di produksi — GET biasa tidak menulis apa pun.
 */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = () => process.env.STRAPI_URL?.replace(/\/$/, "") || "";
const readToken = () => process.env.STRAPI_TOKEN?.trim() || "";
const writeToken = () => process.env.STRAPI_WRITE_TOKEN?.trim() || "";

const mask = (t: string) => (t ? `${t.slice(0, 6)}…(${t.length} karakter)` : "(KOSONG)");

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function totalVisitLogs(token: string): Promise<number | null> {
  try {
    const res = await fetch(`${BASE()}/api/visit-logs?pagination[pageSize]=1`, {
      headers: auth(token),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = (await res.json().catch(() => ({}))) as {
      meta?: { pagination?: { total?: number } };
    };
    return json.meta?.pagination?.total ?? null;
  } catch {
    return null;
  }
}

/** Tes find persis seperti findActiveSession() di src/lib/visits.ts. */
async function tesFind(field: string, token: string) {
  const q = new URLSearchParams({
    [`filters[${field}][$eq]`]: "diag-probe",
    "sort[0]": "lastActiveAt:desc",
    "pagination[pageSize]": "1",
  });
  try {
    const res = await fetch(`${BASE()}/api/visit-logs?${q.toString()}`, {
      headers: auth(token),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return "OK ✅";
    const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    return `HTTP ${res.status} — ${body?.error?.message ?? "tanpa pesan"}`;
  } catch (e) {
    return `gagal jaringan — ${String(e)}`;
  }
}

/** SATU percobaan POST create nyata, dengan payload seperti kode produksi. */
async function tesPost(token: string) {
  const now = new Date().toISOString();
  const visitor = `diag-${Date.now()}`;
  try {
    const res = await fetch(`${BASE()}/api/visit-logs`, {
      method: "POST",
      headers: { ...auth(token), "Content-Type": "application/json" },
      body: JSON.stringify({
        data: { visitor, startedAt: now, lastActiveAt: now, publishedAt: now },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const body = (await res.json().catch(() => ({}))) as unknown;
    return {
      status: res.status,
      hasil:
        res.ok
          ? `✅ BERHASIL — entri dibuat (visitor=${visitor}). Hapus entri diag- ini di Strapi kalau mau.`
          : res.status === 403
            ? "❌ 403 — token TIDAK punya izin create pada Visit log. Centang create (dan update) di Settings → API Tokens → Save, pastikan string token yang SAMA dipakai di .env / Vercel."
            : res.status === 401
              ? "❌ 401 — token salah/kadaluarsa. Salin ulang accessKey token dari Strapi."
              : "❌ gagal validasi — lihat detail di bawah, kirim ke developer bila bingung.",
      detail: res.ok ? undefined : JSON.stringify(body).slice(0, 600),
    };
  } catch (e) {
    return { status: 0, hasil: `❌ gagal jaringan — ${String(e)}` };
  }
}

export async function GET(req: NextRequest) {
  const B = BASE();
  const rt = readToken();
  const wt = writeToken();

  if (!B) {
    return NextResponse.json(
      { masalah: "STRAPI_URL belum terbaca — pastikan .env berisi STRAPI_URL lalu RESTART server dev." },
      { status: 200 },
    );
  }

  const token = wt || rt; // kode produksi memakai token tulis dulu untuk create
  const catatan: string[] = [];

  if (!wt) {
    catatan.push(
      "STRAPI_WRITE_TOKEN KOSONG di server ini — di LOCAL inilah penyebab paling umum counter tetap 0 " +
        "(POST jatuh ke token baca yang tak punya izin create). " +
        "Isi STRAPI_WRITE_TOKEN=<token tulis> di .env lalu WAJIB restart npm run dev.",
    );
  }
  if (!rt) catatan.push("STRAPI_TOKEN (baca) kosong — footer mungkin tak bisa membaca total.");

  const total = await totalVisitLogs(rt || wt);

  const diag: Record<string, unknown> = {
    strapiUrl: B,
    tokenBaca: mask(rt),
    tokenTulis: mask(wt),
    totalKunjunganSekarang: total,
    catatan,
    tesFindPakaiToken: mask(token),
    tesFind: {
      visitor: await tesFind("visitor", token),
      visitorId: await tesFind("visitorId", token),
      visitorHash: await tesFind("visitorHash", token),
    },
  };

  if (req.nextUrl.searchParams.get("do") === "1") {
    const sebelum = await totalVisitLogs(rt || wt);
    const post = await tesPost(token);
    const sesudah = await totalVisitLogs(rt || wt);
    diag.tesTulisNyata = { ...post, totalSebelum: sebelum, totalSesudah: sesudah };
    if (sesudah !== null && sebelum !== null && sesudah > sebelum) {
      diag.kesimpulan =
        "Tulis BERFUNGSI. Kalau footer masih 0: tunggu ≤5 menit (cache footer), pastikan VisitTracker " +
        "mengirim ping (buka halaman apa pun), dan di Vercel pastikan env STRAPI_WRITE_TOKEN terisi token yang sama.";
    }
  } else {
    diag.langkahSelanjutnya =
      "Buka /api/visit-debug?do=1 untuk menguji TULIS nyata sekali (total akan +1 bila berhasil).";
  }

  return NextResponse.json(diag);
}
