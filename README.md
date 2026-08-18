# New Iskandar — AI Handicraft Commerce & Artisanal Batik Digital Twin

> **AI Innovation Challenge COMPFEST 18**  
> Purwarupa Platform AI Terpadu untuk Pengrajin Batik Tulis Aceh

---

## 🌟 Tentang Solusi

**New Iskandar** adalah platform *Smart Handicraft Commerce* dan *Digital Twin* yang menautkan tangan pengrajin batik tulis Aceh dengan pasar dunia melalui kecerdasan buatan. Platform ini mengintegrasikan:

1. **Smart Commerce & Dynamic HPP Optimizer**:
   - Skema penetapan harga bertingkat transparan berdasarkan Bills of Material (BOM).
   - Estimasi tanggal selesai adaptif (*Adaptive SLA Predictor*) berbasis kapasitas nyata sanggar.
2. **Sistem 1 Kamera Sentral & Kronologi Aktivitas AI**:
   - Pemantauan optik sanggar terpadu (*Single Central Optical Sensor*).
   - Laporan naratif dan kronologis otomatis aktivitas pengrajin (jam istirahat, pergerakan antar-ruang, dan milestone produksi).
3. **Sistem Peringatan Ketiadaan Meja Kerja (*Inactivity Warning System*)**:
   - Deteksi ketidakhadiran melebihi ambang batas toleransi (3 menit).
   - Notifikasi modal, banner visual, dan nada peringatan (*Web Audio API*).
4. **Animasi Digital Twin 5 Tahapan Proses Batik**:
   - Visualisasi interaktif tahapan pembuatan batik (Pemotongan Mori, Nyanting Malam Panas, Pencelupan Indigofera, Pelorodan Lilin, dan Kain Jadi Lolos QC).

---

## 👥 Tiga Peran Pengguna (RBAC)

Platform memisahkan hak akses ke dalam 3 peran utama dengan portal autentikasi terintegrasi:

| Peran | Halaman / Rute | Deskripsi Fungsionalitas |
|---|---|---|
| **Pembeli (Customer)** | `/customer` | Memilih motif, mengatur kuantitas, melihat kalkulasi SLA transparan, serta memantau status pengerjaan batik dengan animasi Digital Twin. |
| **Staf Pembatik (Worker)** | `/pembatik` | Antarmuka meja kerja harian pengrajin, sensor kamera stasiun siaga, checklist SOP mutu, dan sistem peringatan ketiadaan. |
| **Pemilik Sanggar (Owner)** | `/owner` | Pusat kendali sanggar, feed kamera sentral, kronologi aktivitas pengrajin, tabel audit log evaluasi kehadiran (export CSV), dan kalkulator kapasitas HPP. |

---

## 🚀 Panduan Menjalankan Aplikasi Secara Lokal (Setup Guide)

### 1. Prasyarat Sistem
- **Node.js**: Versi 18.0.0 atau lebih baru
- **npm** (atau **pnpm** / **yarn**)

### 2. Langkah Instalasi

1. **Kloning Repository:**
   ```bash
   git clone https://github.com/fathrmhd/newiskandar.git
   cd newiskandar
   ```

2. **Masuk ke Direktori Frontend & Pasang Dependensi:**
   ```bash
   cd frontend
   npm install
   ```

3. **Jalankan Server Pengembangan (Vite Dev Server):**
   ```bash
   npm run dev
   ```

4. **Buka di Browser:**
   Akses aplikasi pada alamat:
   ```
   http://localhost:5173/
   ```

### 3. Skrip yang Tersedia

Di dalam direktori `frontend/`:
- `npm run dev` : Menjalankan development server lokal dengan *hot reload*.
- `npm run build` : Membangun bundle produksi teroptimasi di folder `dist/`.
- `npm run preview` : Menjalankan preview lokal dari bundle produksi.

---

## 📁 Struktur Direktori Proyek

```
newiskandar/
├── frontend/
│   ├── src/
│   │   ├── assets/            # Aset logo, background, dan ilustrasi Digital Twin
│   │   ├── components/        # Komponen UI (batik icons, VisionStream, InactivityAlertModal, BatikDigitalTwinAnimation)
│   │   ├── lib/               # Mesin kalkulasi AI (ai.ts) & audioAlert synthesizer (audioAlert.ts)
│   │   ├── pages/             # Laman aplikasi (Landing, Customer, DashboardPembatik, DashboardOwner, Auth)
│   │   ├── App.tsx            # Root component & router 3 peran
│   │   ├── index.css          # Design system, token warna celup alami, & tipografi Fraunces
│   │   └── main.tsx           # Entry point React
│   ├── package.json
│   └── vite.config.ts
├── reference/                 # Berkas referensi ilustrasi konsep Digital Twin
├── README.md                  # Dokumentasi & setup guide proyek
└── docker-compose.yml
```

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 + Custom Artisanal Design Tokens
- **Typography**: Fraunces (Variable Serif), Karla (Sans-Serif), IBM Plex Mono (Monospace)
- **Audio Engine**: Web Audio API Synthesizer (Zero external dependency)
