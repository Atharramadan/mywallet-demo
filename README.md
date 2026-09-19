# 🌟 MyWallet V2 — Interactive Live Demo (Portfolio Edition)

Repositori ini adalah **versi demo publik interaktif** dari [MyWallet V2](https://github.com/Atharramadan/MyWalletv2) yang dirancang khusus untuk portofolio pribadi.

Website ini berjalan 100% di sisi klien (*client-side*) menggunakan **React 19, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion, dan Recharts**, tanpa membutuhkan koneksi database server sehingga aman untuk dicoba secara publik dan gratis selamanya di **GitHub Pages**.

---

## 🚀 Cara Menjalankan Secara Lokal
```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Build untuk produksi
npm run build
```

---

## 🌐 Cara Deploy ke GitHub Pages (Hanya 3 Menit)

Jika kamu baru saja memindahkan folder ini ke komputer atau repositori baru:

1. **Buat Repositori Baru di GitHub:**
   * Buka [github.com/new](https://github.com/new).
   * Beri nama repositori, misalnya: `mywallet-demo`.
   * Pilih **Public**.

2. **Inisialisasi Git & Push Kode:**
   Buka terminal di dalam folder ini, lalu jalankan perintah berikut:
   ```bash
   git init
   git add .
   git commit -m "feat: initial demo release"
   git branch -M main
   git remote add origin https://github.com/Atharramadan/mywallet-demo.git
   git push -u origin main
   ```

3. **Aktifkan GitHub Pages:**
   * Masuk ke repositori `mywallet-demo` di GitHub browser.
   * Klik menu **Settings** (di tab atas).
   * Di menu sebelah kiri, klik **Pages**.
   * Pada bagian **Build and deployment > Source**, pilih opsi: **GitHub Actions**.
   * Tunggu sekitar 1 menit, GitHub Actions akan otomatis menyelesaikan proses build.
   * Website demo kamu sudah resmi live di internet pada link:
     👉 `https://Atharramadan.github.io/mywallet-demo/`

---

## ✨ Fitur-Fitur Demo yang Disematkan
* 📊 **Dashboard Keuangan Komprehensif:** Menampilkan total saldo kas, kekayaan bersih, grafik arus kas 7 hari, dan 4 kategori pengeluaran terbesar.
* 💎 **Wealth Center:** Visualisasi aset kas, instrumen reksadana (RDPU/RDS), dan cryptocurrency (BTC/ETH) secara visual.
* 📈 **Laporan Interaktif:** Grafik donat proporsi pengeluaran per kategori, tren pemasukan vs pengeluaran, serta smart financial insights.
* 💳 **Simulasi Transaksi Real-Time:** Pengunjung dapat mencoba menambah transaksi baru yang langsung tersimpan di `LocalStorage` browser mereka.
* 🔄 **Tombol Reset Data:** Pengunjung dapat mengembalikan data ke simulasi awal kapan saja melalui tombol *Reset Data* di bagian atas.
* 🌙 **Dukungan Dark & Light Mode:** Menggunakan palet warna pastel modern (*Purple, Mint, Peach, Rose*).

---

Dibuat dengan dedikasi oleh **Athar Ramadhan**.
