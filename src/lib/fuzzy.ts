/**
 * Pencarian longgar (fuzzy) untuk halaman pencarian & rekomendasi search bar.
 *
 * Kata kunci pengguna sering tidak persis seperti judul konten:
 *   - "batik"        → harus cocok dengan "Hari Batik Nasional"
 *   - "lomba agustus"→ "Liputan Lomba 17 Agustus Day 2" (kata terpisah)
 *   - "osiss"        → typo dari "osis", ditoleransi lewat Levenshtein
 *
 * Skor 0 berarti tidak ada kemiripan sama sekali. Semakin tinggi skor,
 * semakin relevan. Kalau SEMUA token tidak cocok, pakai
 * `nearestItems()` untuk menyarankan konten yang paling mirip.
 */

/** Normalisasi teks: lowercase, buang tanda baca & aksen, spasi rapi. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Jarak Levenshtein klasik (DP, O(len(a)*len(b))) — judul pendek, aman. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1, // hapus
        curr[j - 1] + 1, // sisip
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), // ganti
      );
    }
    prev = curr;
  }
  return prev[b.length];
}

/** Apakah semua karakter `q` muncul berurutan di `t` (subsequence). */
function isSubsequence(q: string, t: string): boolean {
  let i = 0;
  for (let j = 0; j < t.length && i < q.length; j++) {
    if (q[i] === t[j]) i++;
  }
  return i === q.length;
}

/** Toleransi typo per kata: kata pendek boleh salah 1 huruf, panjang 2. */
function typoTolerance(word: string): number {
  if (word.length >= 6) return 2;
  if (word.length >= 4) return 1;
  return 0;
}

/**
 * Skor kemiripan kueri terhadap satu konten.
 * Tiap token kueri dinilai sendiri (kata yang tidak cocok tetap dilewati,
 * tidak menggugurkan) sehingga pencarian multi-kata lebih pemaaf.
 */
export function fuzzyScore(query: string, title: string, description = ""): number {
  const q = normalizeText(query);
  if (!q) return 0;

  const t = normalizeText(title);
  const d = normalizeText(description);
  const tTokens = t.split(" ").filter(Boolean);
  const dTokens = d.split(" ").filter(Boolean);

  // Substring penuh di judul = paling relevan.
  if (t.includes(q)) return 1000 - Math.min(t.indexOf(q), 200);
  // Substring penuh di deskripsi juga sangat kuat.
  if (d && d.includes(q)) return 700;

  let total = 0;
  for (const qt of q.split(" ").filter(Boolean)) {
    let s = 0;
    if (tTokens.includes(qt)) s = Math.max(s, 220); // kata utuh di judul
    if (tTokens.some((tt) => tt.startsWith(qt))) s = Math.max(s, 170); // awalan kata judul
    if (t.includes(qt)) s = Math.max(s, 130); // potongan kata di judul
    if (dTokens.includes(qt)) s = Math.max(s, 80); // kata utuh di deskripsi
    if (d.includes(qt)) s = Math.max(s, 60); // potongan di deskripsi

    if (s === 0) {
      // Toleransi typo: bandingkan dengan kata terdekat di judul/deskripsi.
      const tol = typoTolerance(qt);
      const nearTitle = Math.min(...tTokens.map((tt) => levenshtein(tt, qt)), Infinity);
      const nearDesc = Math.min(...dTokens.map((dt) => levenshtein(dt, qt)), Infinity);
      if (nearTitle <= tol) s = 100;
      else if (nearDesc <= tol) s = 40;
      else if (isSubsequence(qt, t)) s = 45; // "osss" ~ "osis" (huruf berurutan)
    }
    total += s;
  }
  return total;
}

/**
 * Skor "kemiripan kasar" 0..1 antara dua teks — dipakai untuk saran
 * "Mungkin yang Anda cari…" saat tidak ada hasil sama sekali.
 */
export function similarity(a: string, b: string): number {
  const x = normalizeText(a);
  const y = normalizeText(b);
  if (!x || !y) return 0;
  const dist = levenshtein(x, y);
  return 1 - dist / Math.max(x.length, y.length);
}
