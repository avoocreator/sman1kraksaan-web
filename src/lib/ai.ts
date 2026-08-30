/**
 * Mock AI response resolver.
 *
 * Replace this with a real call to the AI backend, e.g.:
 *
 *   export async function getAiResponse(message: string) {
 *     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/ask`, {
 *       method: "POST",
 *       body: JSON.stringify({ message }),
 *     });
 *     return (await res.json()).reply as string;
 *   }
 */

const mockAnswers: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["ekstrakurikuler", "ekskul"],
    reply:
      "SMAN 1 Kraksaan memiliki lebih dari 20 ekstrakurikuler, mulai dari Robotik, Teknologi Informasi, Debat Bahasa Inggris, hingga Atletik dan Seni Lukis. Kamu bisa lihat selengkapnya di halaman Program.",
  },
  {
    keywords: ["ppdb", "daftar", "pendaftaran"],
    reply:
      "Pendaftaran siswa baru (PPDB) dibuka setiap pertengahan tahun ajaran. Jadwal, syarat, dan berkas lengkap bisa dilihat di halaman PPDB.",
  },
  {
    keywords: ["prestasi", "juara"],
    reply:
      "Sekolah telah meraih lebih dari 147 prestasi di tingkat kabupaten hingga nasional, mulai dari OSN, robotik, hingga olahraga. Cek halaman Prestasi untuk daftar lengkapnya.",
  },
  {
    keywords: ["alumni"],
    reply:
      "Alumni SMAN 1 Kraksaan tersebar di berbagai bidang — pendidikan tinggi, karier profesional, hingga wirausaha. Jelajahi kisah mereka di halaman Alumni.",
  },
  {
    keywords: ["magang", "pkl", "karier", "kerja"],
    reply:
      "Ada beberapa peluang magang dan PKL bersama mitra industri seperti Telkom, Bank Jatim, dan Astra Honda Motor. Lihat semua lowongan di halaman Karier.",
  },
];

const fallback =
  "Terima kasih atas pertanyaannya! Untuk saat ini asisten masih menggunakan data contoh — nanti akan terhubung dengan sistem informasi sekolah secara langsung.";

export function getMockAiResponse(message: string) {
  const lower = message.toLowerCase();
  const match = mockAnswers.find((entry) =>
    entry.keywords.some((k) => lower.includes(k))
  );
  return match?.reply ?? fallback;
}
