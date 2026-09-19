# 🌟 MyWallet V2 — Interactive Live Demo (Portfolio Edition)

[![React 19](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?logo=github&logoColor=white)](https://pages.github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Live Demo:** [https://Atharramadan.github.io/mywallet-demo/](https://Atharramadan.github.io/mywallet-demo/)  
> **Repositori Utama (Full Production App):** [Atharramadan/MyWalletv2](https://github.com/Atharramadan/MyWalletv2)

---

## 📖 Tentang MyWallet V2

**MyWallet V2** adalah aplikasi manajemen keuangan pribadi modern yang dirancang untuk memberikan kendali finansial penuh secara visual, cepat, dan intuitif. Aplikasi ini menggabungkan pencatatan arus kas harian, alokasi anggaran, target tabungan, hingga pemantauan total kekayaan bersih (*Net Worth*) dalam satu ekosistem antarmuka yang elegan.

### 💡 Mengapa Dibuat Versi Demo Ini?
Repositori ini adalah **versi pameran interaktif (*portfolio showcase*)** mandiri dari MyWallet V2. Tujuannya adalah agar siapa pun—baik *recruiter*, *tech lead*, maupun pengunjung umum—dapat langsung mencoba seluruh antarmuka, grafik, dan fitur aplikasi secara instan langsung di peramban (browser) **tanpa perlu login, tanpa konfigurasi database, dan gratis dihosting melalui GitHub Pages**.

---

## ⚙️ Bagaimana Cara Kerja MyWallet Demo?

Meskipun aplikasi aslinya terintegrasi dengan backend **Supabase Cloud**, **Telegram Bot Webhook**, dan **PWA Service Worker**, versi demo ini dirancang dengan pendekatan **100% Client-Side Decoupled Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser Klien                         │
├─────────────────────────────────────────────────────────────┤
│  [ React 19 + Tailwind v4 UI ] ──> [ Framer Motion / Recharts]
│                 │                                           │
│                 ▼                                           │
│        [ Zustand Store State ]                              │
│                 │                                           │
│                 ▼                                           │
│      [ LocalStorage Demo Engine ]                           │
│      ├── Mock Initial Data (35+ Transaksi Realistis)        │
│      ├── Akun Multi-Bank, E-Wallet & Crypto                 │
│      └── Tombol "Reset Data" (Mengembalikan Snapshot Awal)  │
└─────────────────────────────────────────────────────────────┘
```

### 1. Inisialisasi Data Otomatis (*Seed Data*)
Saat pertama kali halaman dibuka, mesin demo membaca memori lokal peramban. Jika belum ada data tersimpan, sistem secara otomatis memasukkan simulasi dataset realistis:
* **Akun Kas & Bank:** BCA Prioritas, Bank Mandiri, Bank Jago, GoPay, OVO, serta Dompet Tunai.
* **Instrumen Investasi:** Reksadana Pasar Uang (Bibit), Saham, dan Aset Kripto (Bitcoin & Ethereum).
* **35+ Transaksi Riil:** Riwayat pengeluaran (makan, tagihan, transportasi) dan pemasukan (gaji, dividen) lengkap dengan kategori berwarna.
* **Target Tabungan & Anggaran:** Target dana darurat, liburan, dan alokasi batas belanja bulanan.

### 2. Manipulasi Data Real-Time di `LocalStorage`
Pengunjung tidak hanya melihat mockup statis! Pengunjung dapat:
* Menambah, mengedit, atau menghapus transaksi baru.
* Membuat dompet/rekening baru atau mengubah target tabungan.
* Seluruh perubahan langsung terhitung secara otomatis ke grafik dan kartu saldo melalui `Zustand State Store` yang tersimpan di `LocalStorage` masing-masing peramban.

### 3. Tombol Reset Data Aman
Terdapat banner khusus di bagian atas aplikasi dengan tombol **"Reset Data"**. Pengunjung dapat bereksperimen mengubah saldo atau menghapus catatan, lalu mengembalikan data simulasi ke kondisi awal hanya dengan satu klik.

---

## ⚖️ Perbandingan: Versi Asli vs Versi Demo

| Fitur | Versi Asli (Production) | Versi Demo Ini (GitHub Pages) |
| :--- | :--- | :--- |
| **Penyimpanan Data** | Supabase Cloud Database (PostgreSQL) | Browser LocalStorage (Zero Server) |
| **Koneksi Jaringan** | Memerlukan Kredensial & Internet | Berjalan 100% Offline / Client-side |
| **Integrasi Telegram** | Bot Webhook (Input transaksi via chat) | Simulasi In-App Form |
| **Antarmuka & Gaya** | Tailwind CSS v4 + Framer Motion | **Identik 100% (Pixel-Perfect)** |
| **Visualisasi Data** | Recharts (Arus kas, Donut per kategori) | Recharts (Interaktif & Responsif) |
| **Privasi Pengunjung** | Menggunakan Autentikasi Pengguna | Data tersimpan lokal di browser masing-masing |

---

## ✨ Fitur Utama yang Dapat Dieksplorasi

* 📊 **Dashboard Finansial:** Ringkasan saldo total kas, net worth, grafik arus kas 7 hari terakhir, alokasi pengeluaran terbesar, dan kartu rekening 3D.
* 💳 **Virtual Card 3D:** Kartu bank interaktif dengan efek rotasi perspektif saat kursor disentuh/digeser (*gyroscope & mouse tilt*).
* 📈 **Laporan Interaktif & Insights:** Analisis proporsi pengeluaran berbasis kategori (*donut chart*), tren pemasukan vs pengeluaran, serta saran pintar (*Smart Financial Insights*).
* 💎 **Wealth Center:** Pelacakan kekayaan bersih (*Net Worth Tracker*) yang memisahkan antara aset likuid (kas/tabungan) dan aset investasi (Reksadana & Crypto).
* 🎯 **Target Tabungan (Savings Goals):** Visualisasi progres tabungan lengkap dengan efek selebrasi konfeti saat target tercapai.
* 🎯 **Smart Budgeting:** Sistem batas anggaran bulanan per kategori dengan indikator warna peringatan (*warning threshold*).
* 📅 **Kalender Transaksi:** Tampilan kalender intuitif untuk melihat riwayat arus kas per tanggal spesifik.
* 🌙 **Dukungan Dark & Light Mode:** Palet tema warna modern (*Sora Font*, *Glassmorphism*, palet pastel Purple, Mint, Peach, dan Rose).

---

## 🛠️ Tech Stack & Library

* **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite 8](https://vitejs.dev/)
* **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Routing:** [React Router 7](https://reactrouter.com/) (Mode `HashRouter` untuk kompatibilitas subpath GitHub Pages tanpa error 404)
* **State Management:** [Zustand 5](https://github.com/pmndrs/zustand)
* **Grafik & Data Visualization:** [Recharts](https://recharts.org/)
* **Animasi & Interaksi:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Deployment:** [GitHub Actions](https://github.com/features/actions) & [GitHub Pages](https://pages.github.com/)

---

## 🚀 Menjalankan Project Secara Lokal

Jika kamu ingin mengunduh dan menjalankan project ini di komputermu sendiri:

```bash
# 1. Clone repositori ini
git clone https://github.com/Atharramadan/mywallet-demo.git

# 2. Masuk ke folder project
cd mywallet-demo

# 3. Install dependencies
npm install

# 4. Jalankan local development server
npm run dev

# 5. Buka di browser
# http://localhost:5173
```

Untuk melakukan kompilasi berkas statis produksi (*production build*):
```bash
npm run build
```
Hasil build siap saji akan dibuat di dalam folder `dist/`.

---

## 🌐 Cara Deploy ke GitHub Pages

Repositori ini sudah dilengkapi alur kerja otomatis di `.github/workflows/deploy.yml`. Untuk mengaktifkannya:

1. Pastikan kode sudah ter-push ke branch `main`.
2. Buka repositori di GitHub, lalu klik tab **Settings**.
3. Di menu sidebar kiri, pilih menu **Pages**.
4. Di bagian **Build and deployment > Source**, pilih opsi: **GitHub Actions**.
5. Tunggu GitHub Actions selesai memproses build (~1 menit). Website demo siap diakses secara publik!

---

## 👨‍💻 Author & Attribution

Dikonsep, dirancang, dan dikembangkan oleh **[Athar Ramadhan](https://github.com/Atharramadan)**.

*Bila kamu menemukan inspirasi atau menyukai karya ini, jangan ragu untuk memberikan bintang (⭐) pada repositori ini!*
