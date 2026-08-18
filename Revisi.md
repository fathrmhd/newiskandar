# Catatan Revisi Fitur Pembuatan Laman Penjual

## 1. Role & Hak Akses (Dashboard Penjual)
Pemisahan hak akses dashboard penjual menjadi 2 role utama:

* **Owner (Pemilik Toko):**
  * Akses monitoring performa pekerja secara keseluruhan.
  * Tampilan feed/status kamera cerdas untuk mendeteksi kinerja dan kepatuhan kerja staf.
* **Pekerja (Staff/Karyawan):**
  * Akses antarmuka kerja harian.
  * Tampilan sistem peringatan (*warning system*) jika terdeteksi tidak aktif bekerja.

---

## 2. Integrasi Computer Vision & Object Recognition
Implementasi model deteksi berbasis kamera pada area kerja staf:

* **Object Recognition & Activity Detection:**
  * Mendeteksi aktivitas kerja staf secara real-time.
* **Inactivity / Absence Alert:**
  * Mendeteksi ketiadaan pekerja di pos/tempat kerja (*left workstation*) melebihi batas waktu toleransi (durasi beberapa menit).
  * Menampilkan notifikasi/warning langsung ke dashboard pekerja jika melanggar.
  * Mencatat log performa/kehadiran untuk laporan evaluasi di dashboard Owner.

---

## 3. Checklist Implementasi
- [ ] Penyesuaian skema autentikasi & middleware RBAC (`owner` dan `pekerja`).
- [ ] Desain UI dashboard khusus tampilan Owner vs Pekerja.
- [ ] Pipeline integrasi stream kamera / backend inference model *object recognition*.
- [ ] Logika timer ketiadaan pekerja (*idle/absence threshold timer*).
- [ ] Integrasi trigger sistem notifikasi peringatan (*warning banner/modal/sound*).