# Panduan Lengkap: Menyetujui Pesanan Fasilitas lewat Strapi

> Dokumen ini menjelaskan **satu per satu** bagaimana cara admin menyetujui
> (atau menolak) pesanan fasilitas yang masuk dari situs, sepenuhnya dari
> dashboard Strapi — tanpa halaman admin tambahan di situs.
>
> URL CMS: `https://cms.sman1kraksaan-web.my.id/admin`

---

## Bagian 0 — Cara kerjanya secara garis besar (baca dulu, 1 menit)

Alur lengkapnya begini:

```
Pengunjung isi form di situs (/fasilitas/pesan)
        │  klik "Kirim Pengajuan"
        ▼
Server situs memvalidasi (jam operasional, kapasitas, bentrokan)
        │  tersimpan sebagai entri BARU di Strapi
        ▼
Content type "Fasility-booking" ← entri muncul di sini, status "Menunggu"
        │  ADMIN Bekerja DI SINI (langkah di Bagian 2)
        ▼
Admin ubah field "Status" → Disetujui / Ditolak → Save
        │
        ▼
Situs membaca ulang status (≤ 1 menit kemudian):
  • Halaman cek status pemesan (pakai kode FSV-…)
  • Slot jadwal yang disetujui langsung TERKUNCI
    (orang lain tidak bisa memesan jam yang sama)
```

Jadi **kamu tidak perlu mengisi apa pun di situs** — semua keputusan lewat
Strapi Content Manager, persis seperti mengedit berita.

---

## Bagian 1 — Cek sekali saja sebelum mulai (setup)

Lewati bagian ini kalau semua poin di bawah sudah pernah kamu lakukan.

### 1.1 Pastikan field `Status` ada di content type

1. Login ke Strapi admin.
2. Menu kiri: **Content-Type Builder**.
3. Klik **Fasility-booking** (ada di bawah "Collection Types").
4. Pastikan daftar field-nya memuat field-field ini (nama bebas huruf
   besar/kecil, yang penting ada):

   | Field         | Tipe                          | Keterangan                          |
   | ------------- | ----------------------------- | ----------------------------------- |
   | `bookingCode` | Text                          | kode unik FSV-2026-0001 (otomatis)  |
   | `facility`    | Text                          | nama fasilitas                      |
   | `facilitySlug`| Text                          | slug fasilitas (otomatis)           |
   | `requesterName`| Text                         | nama pemesan                        |
   | `requesterType`| Text                         | Siswa / Guru / Umum / dst.          |
   | `organization`| Text                          | kelas / ekskul / instansi           |
   | `contact`     | Text                          | HP / email pemesan                  |
   | `date`        | Date                          | tanggal pemesanan                   |
   | `startTime`   | Text                          | jam mulai, contoh `08:00`           |
   | `endTime`     | Text                          | jam selesai, contoh `10:00`         |
   | `participants`| Number (integer)              | jumlah peserta                      |
   | `purpose`     | Text (long/paragraf)          | keperluan                           |
   | **`status`**  | **Enumeration** — pilihan: `Menunggu`, `Disetujui`, `Ditolak`, `Selesai`; **default value: `Menunggu`** | **ini kunci persetujuan** |
   | `adminNote`   | Text                          | catatan admin (alasan, pesan)       |

5. Kalau field `status` belum ada → klik **"Add another field"** → pilih
   **Enumeration** → beri nama `status` → isi pilihan satu per baris:
   ```
   Menunggu
   Disetujui
   Ditolak
   Selesai
   ```
   Lalu di tab **Advanced settings**, isi **Default value** = `Menunggu`
   (atau biarkan kosong — situs tetap menganggap kosong sebagai "Menunggu").
6. Klik **Save** di kanan atas → Strapi restart beberapa detik.

> **Catatan:** kalau kamu tidak sempat membuat field `status`, situs tetap
> aman — status kosong dianggap "Menunggu". Tapi kamu tidak akan bisa
> menyetujui apa pun tanpa field ini, jadi wajib ada.

### 1.2 (Sangat disarankan) Matikan Draft & Publish di CT ini

Supaya setiap pengajuan yang masuk **langsung terlihat** tanpa perlu
klik "Publish" satu per satu:

1. Masih di **Content-Type Builder** → **Fasility-booking**.
2. Klik nama CT-nya → tab **Advanced settings** (ikon roda gigi).
3. Matikan (off) opsi **DRAFT & PUBLISH**.
4. **Save** → Strapi restart.

Kalau opsi ini dibiarkan aktif juga tidak apa-apa — situs mengirim
`publishedAt` saat pengajuan, jadi entri tetap ter-publish otomatis.

### 1.3 Buat API Token tulis (supaya form bisa MENYIMPAN ke Strapi)

Ini langkah yang paling sering terlewat. Token baca (`STRAPI_TOKEN`) hanya
boleh MEMBACA — form pemesanan butuh token kedua yang boleh MENULIS:

1. Strapi admin → **Settings** (menu kiri bawah) → **API Tokens**.
2. **Create new API Token**.
3. Isi:
   - **Name**: `Website writes` (bebas)
   - **Token type**: `Custom`
4. Di daftar izin, centang HANYA:
   - **Fasility-booking** → `create` ✓
   - (kalau sudah membuat CT penghitung kunjungan `Visit Log` →
     `create` ✓ dan `update` ✓ dan `find` ✓)
5. **Save** → **kopi token yang muncul** (hanya tampil sekali!).
6. Tempel token itu ke environment variable **`STRAPI_WRITE_TOKEN`**:
   - **Lokal**: file `.env` → `STRAPI_WRITE_TOKEN=tokenmu`.
   - **Vercel**: Project → Settings → Environment Variables → tambahkan
     `STRAPI_WRITE_TOKEN` → **Redeploy**.
7. Setelah redeploy, tes: buka `/fasilitas/pesan` di situs, kirim satu
   pengajuan uji. Kalau berhasil, entri baru muncul di Strapi
   (lihat Bagian 2 langkah 1). Pengajuan uji bisa langsung kamu hapus.

**Ciri kalau token tulis belum dipasang:** pengunjung yang submit form
mendapat pesan "Strapi menolak pengajuan — pastikan STRAPI_WRITE_TOKEN
diisi…" dan tidak ada entri baru di Strapi.

---

## Bagian 2 — Rutinitas harian: menyetujui pesanan (inti tutorial)

Ini bagian yang kamu lakukan setiap ada pesanan masuk. Butuh ± 30 detik
per pesanan.

### Langkah 1 — Buka daftar pesanan

1. Login ke `https://cms.sman1kraksaan-web.my.id/admin`.
2. Menu kiri → **Content Manager**.
3. Di kolom kiri (daftar collection type) pilih **Fasility-booking**.
4. Semua pesanan tampil sebagai tabel. Pesanan terbaru ada di atas.

### Langkah 2 — Kenali pesanan yang mana perlu diproses

Perhatikan kolom **Status** di tabel:

| Nilai Status  | Arti                                  | Perlu aksi? |
| ------------- | ------------------------------------- | ----------- |
| `Menunggu`    | Baru masuk, belum diproses            | ✅ Ya        |
| `Disetujui`   | Kamu sudah setujui — slot terkunci    | Tidak       |
| `Ditolak`     | Kamu sudah tolak                      | Tidak       |
| `Selesai`     | Acara sudah lewat (opsional diubah)   | Opsional    |

Kalau kolom `Status` tidak tampil di tabel, klik **ikon roda gigi
(Configure the view)** di kanan atas daftar, lalu aktifkan field `status`
supaya terlihat — memudahkan kamu memindai mana yang belum diproses.

### Langkah 3 — Buka pesanannya

Klik salah satu baris yang berstatus **Menunggu**. Form edit terbuka dan
kamu bisa membaca detail lengkap: siapa pemesannya, fasilitas apa, tanggal
& jam berapa, jumlah peserta, dan keperluannya.

### Langkah 4 — Periksa cepat sebelum memutuskan

Checklist 30 detik:

- [ ] **Bentrok?** — Apakah ada pesanan lain berstatus `Disetujui` untuk
      **fasilitas & tanggal yang sama** dengan jam yang tumpang tindih?
      Situs sudah otomatis menolak pengajuan bentrok, tapi kalau kamu ragu,
      urutkan daftar pesanan berdasarkan `date` untuk memastikan.
- [ ] **Masuk akal?** — Nama, kelas/instansi, dan keperluan jelas?
      Kontak bisa dihubungi kalau perlu (field `contact`).
- [ ] **Kapasitas?** — `participants` sudah diperingatkan server bila
      melebihi kapasitas, jadi biasanya aman.

### Langkah 5 — Putuskan: setujui atau tolak

**Menyetujui:**

1. Ubah field **Status** dari `Menunggu` → **`Disetujui`**.
2. (Opsional tapi bagus) isi **`adminNote`**, misal:
   `Disetujui. Koordinasi kunci ruangan dengan pak Dedi sebelum acara.`
3. Klik **Save** (kalau Draft & Publish aktif, tombolnya **Publish**).

**Menolak:**

1. Ubah **Status** → **`Ditolak`**.
2. **Isi `adminNote`** — sangat disarankan saat menolak, karena teks ini
   yang dilihat pemesan sebagai alasan. Contoh:
   `Ditolak: tanggal bersamaan dengan ujian sekolah, silakan pilih tanggal lain.`
3. **Save / Publish**.

> ⚠️ **Jangan hapus entri pesanan.** Menghapus membuat kode `FSV-…`-nya
> hilang dan pemesan tidak bisa mengecek status. Cukup ubah status.

### Langkah 6 — Selesai. Apa yang terjadi di situs?

Setelah Save, dalam **± 1 menit** (cache situs):

1. **Pemesan** yang membuka `/fasilitas/status` dan memasukkan kode
   `FSV-2026-XXXX` akan melihat status baru ("Disetujui" hijau / "Ditolak"
   merah) beserta catatan admin kamu.
2. **Slot jadwal terkunci** — siapa pun yang mencoba memesan fasilitas yang
   sama, tanggal sama, jam yang tumpang tindih akan ditolak otomatis oleh
   server dengan pesan "Jadwal bertabrakan dengan pemesanan yang sudah
   disetujui".
3. Daftar "pemesanan terdekat" di halaman fasilitas ikut memperbarui.

Tidak perlu restart apa pun, tidak perlu deploy ulang.

---

## Bagian 3 — Pertanyaan yang sering muncul

**Q: Bagaimana saya tahu ada pesanan baru tanpa membuka Strapi terus?**
Strapi tidak mengirim notifikasi bawaan. Cara praktis: buka daftar
Fasility-booking dan perhatikan jumlah entri, atau buka Content Manager —
tipe dengan entri baru menampilkan lencana jumlah. Kebiasaan yang enak:
cek sekali sebelum jam pulang sekolah.

**Q: Pesanan masuk tapi tidak muncul di daftar?**
Kemungkinan entri tersimpan sebagai **Draft** (kalau Draft & Publish aktif
dan pengiriman tidak menyertakan publish). Klik tab **Draft** di daftar
atau centang filter "draft" lalu Publish manual. Solusi permanen: matikan
Draft & Publish (Bagian 1.2).

**Q: Saya salah setujui / salah tolak — bisa dibetulkan?**
Bisa. Buka entri, ubah Status ke nilai yang benar, Save. Perubahan berlaku
di situs ± 1 menit.

**Q: Bisa mengubah detail pesanan (jam, tanggal)?**
Bisa — semua field editable. Tapi lebih baik tolak + minta pemesan mengajukan
ulang, supaya pemesan melihat status yang benar lewat kodenya.

**Q: Status "Selesai" dipakai kapan?**
Opsional. Setelah acara lewat, ubah `Disetujui` → `Selesai` supaya daftar
"pesanan terdekat" hanya berisi yang benar-benar akan datang. Tidak wajib.

---

## Bagian 4 — Ringkasan satu layar (tempel di meja)

```
1.  cms.sman1kraksaan-web.my.id/admin  → login
2.  Content Manager → Fasility-booking
3.  Cari entri Status = "Menunggu"
4.  Klik entri → baca detail
5.  Status → Disetujui (atau Ditolak + isi adminNote)
6.  Save / Publish
7.  Selesai — situs ikut sendiri ≤ 1 menit
```
