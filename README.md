# 🚀 MyWallet v2 — Interactive Live Demo (Portfolio Edition)

[![Version](https://img.shields.io/badge/version-3.5.9-blue.svg)](https://github.com/Atharramadan/mywallet-demo)
[![Started](https://img.shields.io/badge/started-12_Juli_2026-blueviolet.svg)](https://github.com/Atharramadan/mywallet-demo)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?logo=github&logoColor=white)](https://pages.github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🌐 **Live Demo:** [https://Atharramadan.github.io/mywallet-demo/](https://Atharramadan.github.io/mywallet-demo/)  
> 📦 **Repositori Utama (Full Production App):** [Atharramadan/MyWalletv2](https://github.com/Atharramadan/MyWalletv2)

---

## 💎 Tentang MyWallet v2

Mulai dikembangkan pada tanggal **12 Juli 2026** oleh **Athar Ramadhan**, **MyWallet v2** adalah platform manajemen keuangan pribadi modern yang dirancang untuk memberikan kendali finansial penuh secara visual, cepat, presisi, dan intuitif. Aplikasi ini menggabungkan pencatatan arus kas harian, alokasi anggaran, target tabungan, hingga pemantauan total kekayaan bersih (*Net Worth*) dan pelacakan portofolio multi-aset dalam satu ekosistem antarmuka yang elegan.

### 🌟 Mengapa Dibuat Versi Demo Ini?
Repositori ini adalah **versi pameran interaktif (*portfolio showcase*)** mandiri dari MyWallet v2. Tujuannya adalah agar siapa pun — baik *recruiter*, *tech lead*, investor, maupun pengunjung umum — dapat langsung mencoba seluruh antarmuka, grafik, dan fitur aplikasi secara instan langsung di peramban (browser) **tanpa perlu login, tanpa konfigurasi database atau API key, dan gratis dihosting melalui GitHub Pages**.

---

## 🛠️ Bagaimana Cara Kerja MyWallet Demo?

Meskipun aplikasi aslinya terintegrasi dengan backend **Supabase Cloud**, **Google Gemini AI 4-Model Cascade**, dan **Telegram Bot Webhook**, versi demo ini dirancang dengan pendekatan **100% Client-Side Decoupled Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser Klien                         │
├─────────────────────────────────────────────────────────────┤
│  [ React 19 + Tailwind v4 UI ] ───► [ Framer Motion / Recharts]
│                 │                                           │
│                 ▼                                           │
│        [ Zustand Store State ]                              │
│                 │                                           │
│                 ▼                                           │
│      [ LocalStorage Demo Engine ]                           │
│      ├── Mock Initial Data (Portofolio Multi-Aset Lengkap)   │
│      ├── Akun Multi-Bank, E-Wallet & Kas Fisik              │
│      └── Tombol "Reset Data" (Mengembalikan Snapshot Awal)  │
└─────────────────────────────────────────────────────────────┘
```

### 1. Inisialisasi Data Otomatis (*Seed Data*)
Saat pertama kali halaman dibuka, mesin demo membaca memori lokal peramban. Jika belum ada data tersimpan, sistem secara otomatis memasukkan simulasi dataset realistis:
* **Akun Kas & Bank:** BCA Prioritas, Bank Mandiri, Bank Jago, GoPay, ShopeePay, serta Dompet Tunai.
* **Portofolio Investasi Multi-Aset:** 
  * 🪙 **Kripto:** Bitcoin (BTC), Ethereum (ETH), Solana (SOL).
  * 📈 **Saham Individual:** BBCA, BBRI, TLKM.
  * 📄 **Obligasi Negara / SBN:** ORI026, SR021.
  * 📊 **Reksa Dana:** RDPU Sucorinvest Sharia, RDPT Danamas Pasifik Stabil.
  * 🪙 **Emas Fisik:** Logam Mulia 24K Antam dengan konversi berat gram live.
* **35+ Transaksi Riil:** Riwayat pengeluaran (makan, tagihan, transportasi) dan pemasukan (gaji, freelance, dividen) lengkap dengan kategori berwarna.
* **Target Tabungan & Anggaran:** Target dana darurat, laptop kerja, dan alokasi batas belanja bulanan.

### 2. Manipulasi Data Real-Time di `LocalStorage`
Pengunjung tidak hanya melihat mockup statis! Pengunjung dapat:
* Menambah, mengedit, atau menghapus transaksi baru.
* Menambah aset investasi, mengubah alokasi portofolio, dan menyesuaikan saldo akun.
* Seluruh perubahan langsung terhitung secara otomatis ke grafik dan kartu saldo melalui `Zustand State Store` yang tersimpan di `LocalStorage` masing-masing peramban.

### 3. Tombol Reset Data Aman
Terdapat tombol **"Reset Data"** yang memungkinkan pengunjung bebas bereksperimen mengubah saldo atau menghapus catatan, lalu mengembalikan data simulasi ke kondisi awal hanya dengan satu klik.

---

## ⚖️ Perbandingan: Versi Asli vs Versi Demo

| Fitur | Versi Asli (Production) | Versi Demo Ini (GitHub Pages) |
| :--- | :--- | :--- |
| **Penyimpanan Data** | Supabase Cloud Database (PostgreSQL) | Browser LocalStorage (Zero Server) |
| **Koneksi Jaringan** | Memerlukan Kredensial & Internet | Berjalan 100% Offline / Client-side |
| **Integrasi AI** | Gemini 3.5 Flash 4-Model Cascade | Showcase UI & Mock Data |
| **Bot Telegram** | Realtime Webhook NLP & Vision | In-App Interactive Form |
| **Antarmuka & Gaya** | Tailwind CSS v4 + Framer Motion | **Identik 100% (Pixel-Perfect)** |
| **Visualisasi Data** | Recharts (Arus kas, Heatmap, Donut) | Recharts (Interaktif & Responsif) |
| **Privasi Pengunjung** | Autentikasi Supabase & PIN Lock | Data tersimpan lokal di browser masing-masing |

---

## ✨ Fitur-Fitur Unggulan yang Dapat Dieksplorasi

* 💼 **Wealth Center & Portofolio Investasi Multi-Aset (/wealth-center/investasi):**
  Pelacakan kekayaan bersih (*Net Worth Tracker*) mandiri dengan 5 kelas aset (Kripto, Saham, SBN, Reksa Dana, Emas). Dilengkapi rasio Pertumbuhan vs Defensif dan evaluasi MoM (*Month-over-Month*).
* 🪙 **Live Realtime Gold Price:**
  Pemantauan harga pasar live emas murni 24K per gram dan live kalkulator otomatis konversi berat gram fisik ke Rupiah.
* 🛡️ **Smart Risk Profile ala Bibit:**
  Visualisasi bar alokasi aset tunggal dengan penentuan profil risiko otomatis (Konservatif, Moderat, Agresif) dan edukasi finansial objektif.
* 📅 **Financial Heatmap Calendar & Habit Tracker Disiplin:**
  Visualisasi kalender pengeluaran bergaya kontribusi GitHub dengan 4 level warna, penghitung rekor hari bebas belanja (*no-spend days*), dan streak hemat.
* 📊 **4 Pilar Kesehatan Finansial:**
  Skor komprehensif untuk P1 Dana Darurat, P2 Arus Kas, P3 Rasio Tabungan (*Savings Rate*), dan P4 Disiplin Pencatatan.
* 📈 **Grafik Kurva Net Worth Dinamis:**
  Grafik multi-layer yang otomatis menampilkan kurva pergerakan aset riil yang Anda miliki tanpa tombol toggle manual.
* 🎯 **Target Tabungan (Savings Goals):**
  Visualisasi progres tabungan lengkap dengan efek selebrasi konfeti saat impian finansial tercapai.
* 💰 **Smart Budgeting:**
  Sistem batas anggaran bulanan per kategori dengan indikator warna peringatan (*warning threshold*).
* 🧮 **Simulator Finansial Majemuk:**
  Simulasi cicilan KPR, proyeksi Pensiun Dini (FIRE), dan perhitungan bunga majemuk (*Compound Interest*).
* 📱 **Desain Cardless Ramping & Responsif:**
  Tampilan lapang dan proporsional di seluruh perangkat (mobile 320px–desktop), bebas dari card bersarang yang sesak.
* 🌓 **Dukungan Dark & Light Mode:**
  Palet warna modern terkurasi (*Sora Font*, *Glassmorphism*, palet pastel Purple, Mint, Peach, dan Rose).

---

## 💻 Tech Stack & Library

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

Jika ingin mengunduh dan menjalankan project ini di komputer sendiri:

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

Untuk kompilasi produksi (*production build*):
```bash
npm run build
```
Hasil build siap saji akan dibuat di dalam folder `dist/`.

---

© 2026 **MyWallet v2** — Dikembangkan dengan ❤️ oleh **Athar Ramadhan**.
