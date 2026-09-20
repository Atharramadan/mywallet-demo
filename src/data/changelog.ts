export const latestUpdates = [
  {
    version: "v3.2.2",
    title: "Optimasi Tata Letak 2-Kolom Kalender Desktop 📅🖥️",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Layout 2-Kolom Kalender & Riwayat Transaksi",
        description: "Menata ulang tampilan Kalender di desktop menjadi 2 kolom berdampingan secara ergonomis: kalender berukuran sedang & proporsional di sisi kiri (sticky), serta riwayat mutasi transaksi di sisi kanan."
      },
      {
        title: "Ringkasan Finansial Harian & Tombol Pintas 'Hari Ini'",
        description: "Menambahkan tombol cepat 'Hari Ini' di header serta kalkulasi ringkasan total pemasukan dan pengeluaran langsung pada tanggal yang sedang dipilih."
      }
    ]
  },
  {
    version: "v3.2.1",
    title: "Penyelarasan FAQ & Proteksi Privasi Identitas 🛡️🔒",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penyelarasan Teks FAQ & Halaman About",
        description: "Menyelaraskan teks Panduan Penggunaan (FAQ) dan kartu Pencapaian Teknologi pada halaman About sesuai standar portofolio."
      },
      {
        title: "Proteksi Penuh Privasi Identitas Pemilik",
        description: "Menghapus seluruh penyebutan nama personal pada teks publik, FAQ, dan pesan bot, serta menjaga privasi dengan sebutan 'Owner'."
      },
      {
        title: "Klarifikasi Dana Darurat & AI Telegram",
        description: "Memperjelas arsitektur penguncian dana darurat berbasis RDPU dan batasan akses AI Telegram berbasis zero-budget free tier."
      }
    ]
  },
  {
    version: "v3.1.4",
    title: "Penyederhanaan Profil & Konsolidasi Kategori Laporan 🧹📊",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penyederhanaan Halaman Profil",
        description: "Menghapus widget 'Pencapaian Boss' dari halaman Profil & Keamanan agar antarmuka lebih bersih, fokus, dan relevan dengan pengaturan keamanan akun."
      },
      {
        title: "Konsolidasi Otomatis Kategori Laporan",
        description: "Memperbaiki kalkulasi laporan agar transaksi dengan nama kategori identik (seperti Investasi) otomatis digabung ke satu baris utuh, serta menyematkan proteksi tipe transaksi pada AI Telegram."
      }
    ]
  },
  {
    version: "v3.1.3",
    title: "Etalase Pencapaian Teknologi & Keunggulan Ekosistem ✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Pencapaian Teknologi Aktif",
        description: "Memperbarui halaman Tentang Aplikasi dengan mengganti roadmap usang menjadi etalase pencapaian teknologi unggulan yang sudah aktif dan beroperasi penuh."
      },
      {
        title: "Status Eksklusif Telegram AI Assistant",
        description: "Menegaskan status Telegram AI Assistant dengan badge 'Eksklusif Pemilik' sebagai asisten finansial cerdas privat khusus bagi pemilik akun utama."
      }
    ]
  },
  {
    version: "v3.1.2",
    title: "AI God-Mode Memory & Cleanup 🧠🧹",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Kepatuhan Total AI (Hukum Tertinggi)",
        description: "AI Telegram kini memiliki instruksi 'Hukum Tertinggi'. Jika Anda mengoreksi langganan palsu atau memberi aturan kustom (misal 'catat jajan ke BCA'), AI akan mematuhinya secara mutlak."
      },
      {
        title: "Kapasitas Memori Ditingkatkan",
        description: "AI kini dapat mengingat histori percakapan 3x lebih panjang dan memiliki sistem anti-lupa untuk memastikan fakta-fakta personal dan preferensi keuangan Anda tidak terhapus."
      },
      {
        title: "Penghapusan Fitur Mesin Waktu Finansial",
        description: "Fitur Mesin Waktu Finansial (Simulator) dihapus dari aplikasi untuk menyederhanakan antarmuka, karena analisis keputusan kini bisa langsung ditanyakan lewat Chat AI Telegram."
      }
    ]
  },
  {
    version: "v3.1.1",
    title: "Bug Fixes & AI Telegram Fallback Validation 🛠️",
    date: "September 2026",
    icon: "wrench",
    features: [
      {
        title: "Perbaikan Timeout & Silent Error Telegram",
        description: "Memperpanjang batas waktu eksekusi Vercel menjadi 60 detik dan memperbaiki bug 'silent error' pada respon JSON AI, sehingga transaksi di Telegram tidak akan pernah hilang atau gagal tercatat lagi saat server sibuk."
      },
      {
        title: "Validasi Tombol Interaktif (Anti Asal Catat)",
        description: "Jika AI Google sedang error/limit dan bot menggunakan sistem manual (kata kunci), bot kini tidak akan 'asal tebak' akun. Bot akan memunculkan tombol pilihan dompet/akun secara interaktif layaknya AI jika bahasa yang diketik kurang spesifik."
      },
      {
        title: "Perbaikan Bug UI Format Angka",
        description: "Memperbaiki bug di mana angka negatif yang sangat kecil dibulatkan aneh menjadi '-Rp0', serta memperbaiki tumpang tindih pembulatan singkatan uang (contoh: '1000rb' kini rapi menjadi '1jt')."
      }
    ]
  },
  {
    version: "v3.1.0",
    title: "AI Voice, Docs, & Advanced Intelligence 🎤🧠",
    date: "Agustus 2026",
    icon: "sparkles",
    features: [
      {
        title: "Dukungan Voice Message & Scan Dokumen",
        description: "AI kini bisa mendengarkan Voice Note! Cukup kirim pesan suara dan AI akan otomatis mentranskripsinya lalu memproses perintahmu. AI juga bisa membaca Mutasi Rekening Bank (.pdf/gambar) dan dokumen umum langsung dari Telegram."
      },
      {
        title: "Peringatan Anggaran Real-Time & Proyeksi Pengeluaran",
        description: "Setiap transaksi yang kamu input kini akan langsung dipantau oleh AI. AI akan memberimu peringatan dini (AMAN/HAMPIR/OVER) pada anggaranmu serta menghitung proyeksi total pengeluaran di akhir bulan (Forecast)!"
      },
      {
        title: "Analisis Target (Goals) & MoM (Month-over-Month)",
        description: "AI memprediksi kapan Target Tabunganmu akan tercapai berdasarkan Saving Rate bulan ini. AI juga menganalisis kenaikan/penurunan 3 kategori pengeluaran terbesarmu bulan ini dibandingkan bulan lalu secara cerdas."
      },
      {
        title: "Detektif Langganan Jangka Panjang",
        description: "Rentang deteksi pola langganan diperluas hingga 180 hari (6 bulan), sehingga tagihan tahunan atau triwulanan bisa ikut terpantau lebih tajam oleh AI."
      }
    ]
  },
  {
    version: "v3.0.8",
    title: "AI Brain Intelligence Upgrade: Full App Awareness 🧠🔥",
    date: "Juli 2026",
    icon: "brain",
    features: [
      {
        title: "Skor Kesehatan Finansial 4 Pilar (Health Score)",
        description: "AI Bot kini menghitung dan menyadari Skor Kesehatan 4 Pilar secara real-time: Dana Darurat (P1), Arus Kas (P2), Tingkat Tabungan (P3), dan Disiplin Mencatat (P4). Tanya \"skor kesehatan keuangan aku berapa\" dan bot akan menjelaskan detail tiap pilar."
      },
      {
        title: "Kesadaran Penuh Mesin Finansial (Simulator)",
        description: "Saat kamu bertanya \"berapa nominal yang aku input di mesin finansial?\", AI Bot kini bisa menjawab dengan detail lengkap: nama skenario, nominal input, jenis (sekali bayar/cicilan), durasi, dampak arus kas per bulan, skor sebelum vs sesudah, dan status keamanan dana darurat."
      },
      {
        title: "Total Kekayaan Bersih (Net Worth) + Progres",
        description: "AI Bot kini tahu total Net Worth kamu (Kas + Crypto + Reksadana) beserta persentase progres menuju Target Kekayaan. Tanya \"total kekayaan aku berapa\" untuk melihatnya."
      },
      {
        title: "Pola Pengeluaran per Kategori & Budget Status",
        description: "Bot kini menerima breakdown pengeluaran per kategori dengan persentase, status budget (AMAN/HAMPIR/OVER), dan progres target tabungan. Semua data internal aplikasi kini 100% transparan bagi AI."
      }
    ]
  },
  {
    version: "v3.0.7",
    title: "Executive Sidebar Redesign & Fixed Viewport Layout 👑🖥️",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Sidebar Fixed Full-Height (Anti-Scroll)",
        description: "Mengunci posisi Sidebar secara absolut pada layar (fixed layout). Kini saat Anda menggulir (scroll) area konten utama yang panjang (daftar transaksi, laporan, dll), navigasi samping tetap diam memanjang penuh dari ujung atas hingga bawah monitor tanpa ikut tergeser!"
      },
      {
        title: "Desain Visual & Kontras Premium",
        description: "Peningkatan estetika kartu bantuan di bagian bawah Sidebar dengan teks kontras tinggi yang sangat jelas dibaca pada mode gelap maupun terang, serta sentuhan animasi hover interaktif pada tombol dan menu navigasi."
      }
    ]
  },
  {
    version: "v3.0.6",
    title: "Full-Width Desktop Sidebar Navigation (Web Edition) 🖥️🚀",
    date: "Juli 2026",
    icon: "zap",
    features: [
      {
        title: "Navbar Samping Eksekutif (Sidebar Navigation)",
        description: "Menggantikan navigasi bawah (BottomNav) dengan Sidebar vertikal bergaya glassmorphic di sisi kiri layar saat dibuka melalui browser komputer/laptop. Tampilan web tidak lagi berasa seperti aplikasi HP yang ditaruh di tengah, melainkan benar-benar full-width seperti web app profesional (Discord/Stripe style)!"
      },
      {
        title: "Akses Cepat '+ Tambah Transaksi' terintegrasi",
        description: "Menambahkan tombol utama '+ Tambah Transaksi' berdesain gradient glow langsung di dalam panel navigasi samping untuk kenyamanan maksimal pengguna PC/Desktop."
      }
    ]
  },
  {
    version: "v3.0.5",
    title: "Responsive Web Layout & Desktop Optimization 💻✨",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penyempurnaan Margin & Padding Responsif",
        description: "Mengubah batasan lebar layar standar (max-w-md) agar dapat memperluas secara proporsional saat dibuka pada layar Tablet dan Desktop/PC (hingga max-w-5xl). Tampilan web kini jauh lebih rapi, lega, dan pas tanpa ruang kosong berlebih di sisi kiri dan kanan."
      },
      {
        title: "Konsistensi Antarmuka Universal",
        description: "Menyeragamkan struktur container pada seluruh halaman fitur (Wealth Center, Transaksi, Laporan, Pengaturan, Simulator, hingga Banner Install) untuk memastikan pengalaman navigasi web yang mulus di semua ukuran resolusi layar."
      }
    ]
  },
  {
    version: "v3.0.4",
    title: "Optimasi Performa & Akselerasi UI Premium 🚀",
    date: "Juli 2026",
    icon: "zap",
    features: [
      {
        title: "Peningkatan Kecepatan & Anti-Lag (0% Stutter)",
        description: "Mengoptimalkan animasi latar belakang (AtmosphereBackground) dan kartu 3D dengan akselerasi perangkat keras (GPU transform), serta menonaktifkan auto-scroll berulang yang menguras CPU."
      },
      {
        title: "React Lazy Loading & Code Splitting",
        description: "Membagi bundle aplikasi utama yang sebelumnya besar (1.7 MB) menjadi modul-modul ringan terpisah (lazy chunks), sehingga aplikasi terbuka sekejap tanpa beban memori tinggi pada HP spesifikasi menengah ke bawah."
      }
    ]
  },
  {
    version: "v3.0.3",
    title: "Sinkronisasi Waktu & Sapaan Otomatis AI (WIB) ⏰",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Perbaikan Sapaan Waktu pada Laporan Otomatis (Cron Job)",
        description: "Memperbaiki masalah sapaan waktu AI pada evaluasi keuangan mingguan maupun harian di Telegram. AI kini dibekali konteks jam WIB secara real-time dan aturan mutlak agar tidak salah mengucapkan 'Selamat pagi' di malam hari atau sebaliknya."
      }
    ]
  },
  {
    version: "v3.0.2",
    title: "Penyesuaian UI Dashboard & Wealth Center 🧹",
    date: "Juli 2026",
    icon: "wrench",
    features: [
      {
        title: "Penghapusan Fitur Radar Daya Tahan Hidup (Aviation Gauge)",
        description: "Mengembalikan tampilan Dashboard dan Wealth Center ke layout semula yang lebih ringkas dan bersih sesuai permintaan pengguna dengan menghapus modul bereksperimen Radar Daya Tahan Hidup (Runway Gauge)."
      }
    ]
  },
  {
    version: "v3.0.1",
    title: "Perombakan Wording & Kotak Penjelasan Awam di Radar Survival 💡",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Bahasa 100% Manusiawi & Kotak Kesimpulan Ekstra Jelas",
        description: "Mengganti istilah teknis (seperti Burn Rate Harian dan Altitude Runway) menjadi bahasa sehari-hari ('Uang Habis Per Hari', 'Sisa Nafas Hidup', dan 'Pengeluaran Sebulan'). Serta menambahkan Kotak Penjelasan Bahasa Awam (Super Ekspres) tepat di tengah layar radar agar orang awam bisa langsung memahami 100% makna status amannya hanya dalam 5 detik!"
      }
    ]
  },
  {
    version: "v3.0.0",
    title: "V3 Launch: The Financial Runway & Survival Radar (Aviation Gauge) 🎛️🚀",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Speedometer Futuristik Bergaya Kokpit Pesawat (Sci-Fi Aviation Gauge)",
        description: "Menghadirkan fitur revolusioner yang tidak dimiliki aplikasi keuangan lain! Mengukur dan menjawab pertanyaan paling esensial: 'Kalau gue resign atau ga ada penghasilan mulai hari ini, berapa lama gue bisa bertahan hidup?' Dilengkapi dengan speedometer melengkung bersinar (neon pulsing effect), perhitungan Burn Rate dinamis, serta Interactive AI Tips yang memiliki tombol simulasi instan untuk menguji dampak penghematan terhadap perpanjangan nafas hidupmu."
      }
    ]
  },
  {
    version: "v2.16.7",
    title: "Penjelasan Ekstra Edukatif di dalam Kartu Diagnosis AI 💡",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Keterangan Subteks Bahasa Awam pada Indikator Runway & Dana Darurat",
        description: "Menambahkan penjelasan subteks edukatif secara langsung di bawah angka 'Daya Tahan Hidup' dan 'Kondisi Tabungan Darurat' agar pengguna awam dapat langsung mengerti 100% alasan mengapa angka tersebut muncul (misal: mengapa daya tahan hidup menjadi 0 bulan dan apa risikotanya jika terjadi kehilangan pekerjaan)."
      }
    ]
  },
  {
    version: "v2.16.6",
    title: "Perombakan Total UI Mesin Waktu: Ramah Orang Awam & Super Intuitif 🔮",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Dashboard Prediksi Masa Depan yang Bahasa Manusiawi & Visual Cerah",
        description: "Mengubah total tampilan hasil Mesin Waktu Finansial agar sangat mudah dipahami oleh orang awam tanpa istilah teknis yang membingungkan. Menghadirkan Banner Kesimpulan AI instan ('KEPUTUSAN AMAN!' atau 'BAHAYA FINANSIAL!'), penjelasan daya tahan hidup (runway) dalam kalimat sederhana, 2 kartu komparasi nasib masa depan berdampingan, serta penyederhanaan grafik pergerakan tabungan dengan legenda yang sangat jelas dan kontras."
      }
    ]
  },
  {
    version: "v2.16.5",
    title: "Penyempurnaan Logika Komparasi & Penyederhanaan Visual 🎯",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Komparasi Apple-to-Apple Proyeksi Masa Depan (Normal vs Beli)",
        description: "Mengatasi kebingungan pengguna pada kartu komparasi dengan menyelaraskan waktu perbandingan ke 3 tahun depan secara apple-to-apple. Kartu kini secara intuitif membandingkan '🟢 JIKA TIDAK BELI (NORMAL)' dengan '🔴 JIKA JADI BELI (EKSEKUSI)', serta langsung memperlihatkan nominal selisih penurunan kekayaan di masa depan. Legenda grafik juga diperjelas agar 100% mudah dipahami dalam 1 detik melihat."
      }
    ]
  },
  {
    version: "v2.16.4",
    title: "Pemecahan Waktu & Komparasi Visual Masa Lalu vs Masa Depan ⏱️",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Kartu Komparasi Nyata & Titik Referensi 'Hari Ini' pada Grafik",
        description: "Memperjelas pemisahan antara masa lalu/kondisi saat ini dengan proyeksi masa depan di Mesin Waktu Finansial. Ditambahkan garis referensi vertikal '📍 HARI INI' yang membelah grafik menjadi dua zona waktu nyata (historis 6 bulan lalu vs proyeksi masa depan), serta dua kartu komparasi berdampingan yang memperlihatkan kontras saldo maupun skor kesehatan keuangan saat ini vs setelah eksekusi keputusan."
      }
    ]
  },
  {
    version: "v2.16.3",
    title: "Sistem Penyimpanan Hibrida & Notifikasi Simulator 💾",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penyimpanan Skenario Hibrida (Local Storage + Cloud Supabase)",
        description: "Mengatasi kendala gagal simpan pada skenario simulasi What-If dengan menerapkan arsitektur penyimpanan hibrida. Skenario kini disimpan secara instan ke Local Storage (jaminan 100% sukses di mode offline, mode tamu, atau saat pengujian lokal) dan otomatis disinkronkan ke tabel 'simulations' di cloud Supabase apabila pengguna telah login. Dilengkapi dengan notifikasi Toast interaktif saat menyimpan dan menghapus skenario."
      }
    ]
  },
  {
    version: "v2.16.2",
    title: "Penyempurnaan Format Durasi & Rentang Proyeksi Simulator 📈",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Format Angka Desimal Durasi Cicilan & Rentang Waktu Dinamis",
        description: "Memperbaiki tampilan angka desimal yang terlalu panjang pada perhitungan konversi bulan ke tahun di slider durasi cicilan (misal 43 Bulan menjadi bersih 3.6 Tahun). Selain itu, memperpanjang jangkauan simulasi garis waktu secara dinamis mengikuti durasi cicilan yang dipilih pengguna (hingga 5+ tahun ke depan) serta mengoptimalkan interval penanda tahun pada sumbu grafik Recharts agar tidak terpotong atau berhenti di tahun 2027."
      }
    ]
  },
  {
    version: "v2.16.1",
    title: "Optimalisasi Standar Kelas Canonical Tailwind CSS 🛠️",
    date: "Juli 2026",
    icon: "wrench",
    features: [
      {
        title: "Pembersihan Arbitrary Values pada UI Simulator & Wealth Center",
        description: "Mengganti kelas nilai arbitrer (seperti min-w-[170px], h-[110px], max-w-[280px], w-[85px]) dengan kelas kanonikal standar Tailwind CSS (min-w-42.5, h-27.5, max-w-70, w-21.25, dll) di komponen SimulatorPage dan WealthCenterPage. Perbaikan ini memastikan kode antarmuka bersih 100% dari peringatan linter dan meningkatkan performa serta konsistensi desain sistem."
      }
    ]
  },
  {
    version: "v2.16.0",
    title: "Mesin Waktu Finansial & What-If AI Decision Simulator 🧪",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Laboratorium Simulasi What-If & Sinkronisasi AI Telegram",
        description: "Menghadirkan fitur Mesin Waktu Finansial yang memungkinkan pengguna menyimulasikan keputusan finansial besar (beli iPhone, cicilan motor, sewa kost, atau skenario custom) dengan proyeksi garis waktu 36 bulan ke depan via grafik Recharts. Skenario disimpan secara permanen di cloud Supabase dan terintegrasi langsung dengan Telegram Bot AI, sehingga AI dapat membaca diagnosis skor kesehatan keuangan, mendeteksi bahaya jebolnya dana darurat, dan memberi nasihat finansial yang akurat dan jujur sebelum uang dibelanjakan."
      }
    ]
  },
  {
    version: "v2.15.16",
    title: "Penyempurnaan Posisi Tombol Cepat & Penyederhanaan Tema",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penataan Tombol Input & Tema Light/Dark Klasik",
        description: "Memperbaiki posisi dan efek tombol cepat input transaksi agar tetap di posisinya (fixed) secara rapi di dalam batas layar aplikasi tanpa melompat atau meluber keluar. Selain itu, mengembalikan pilihan tema ke standar klasik Light dan Dark Mode demi kesederhanaan, kerapian, dan performa yang lebih ringan."
      }
    ]
  },
  {
    version: "v2.15.15",
    title: "Peringatan Keamanan Tautan & Optimalisasi Mode Tamu",
    date: "Juli 2026",
    icon: "shield",
    features: [
      {
        title: "Peringatan Keamanan Link & Pemantapan Persona AI",
        description: "Menambahkan instruksi dan notifikasi keamanan resmi agar tamu tidak sembarangan mengklik link yang tidak dikenal tanpa konfirmasi pemilik aplikasi (Athar). Selain itu, memperhalus persona sistem AI dengan menghapus kata-kata pengujian/tester agar interaksi di Mode Tamu terasa lebih natural dan otonom."
      }
    ]
  },
  {
    version: "v2.15.14",
    title: "Kunci Akses Tamu Tidak Aktif 1 Hari & Notifikasi Langsung",
    date: "Juli 2026",
    icon: "lock",
    features: [
      {
        title: "Gembok Inaktivitas 24 Jam & Izin Buka Kunci Owner",
        description: "Jika tamu tidak mengakses atau menganggurin bot selama 1 hari (24 jam), sistem akan mengunci total aksesnya otomatis dan mengirimkan notifikasi langsung lewat pesan Telegram ke tamu tersebut. Untuk membuka kunci akses, tamu wajib meminta izin kepada Athar, dan Athar dapat membuka kunci lewat perintah /bukakunci atau /unlock_guest."
      }
    ]
  },
  {
    version: "v2.15.13",
    title: "Kebijakan Akses Bertanya & Blokir Input/Cron Tamu",
    date: "Juli 2026",
    icon: "shield",
    features: [
      {
        title: "Pembatasan Ketat Bertanya Saja & Wajib Izin",
        description: "Menegaskan di sistem dan AI bahwa Mode Tamu hanya diizinkan untuk akses bertanya/konsultasi saja. Semua coba-coba fitur input (transaksi, foto struk, dokumen) dan akses Cron Job diblokir total, dengan instruksi untuk meminta izin kepada Athar terlebih dahulu."
      }
    ]
  },
  {
    version: "v2.15.12",
    title: "Roasting ML & Gacha Ampas Tanpa Filter",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Ekstra Roasting Hobi Gacha Ampas",
        description: "Menambahkan serangan kata-kata kasar ala Grok khusus untuk kebiasaan push rank Mobile Legends dan hobi gacha boros bakar duit tapi selalu ampas ga pernah dapet apa-apa."
      }
    ]
  },
  {
    version: "v2.15.11",
    title: "Roasting Tanpa Filter & Tanpa Anggap Teman",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Roasting ML Kasar & Pengakuan Pembuat",
        description: "Menghapus anggapan 'teman' untuk tamu di Mode Tamu sehingga AI memperlakukannya purely sebagai tester gamer ML dengan kata-kata roasting kasar tanpa filter, sekaligus dengan bangga mengakui Athar sebagai satu-satunya perancang aplikasi."
      }
    ]
  },
  {
    version: "v2.15.10",
    title: "Penyempurnaan Persona AI Mode Tamu",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penyembunyian Info Update & Pengakuan Pembuat",
        description: "Menghapus pengumuman versi/update aplikasi secara otomatis di awal percakapan Mode Tamu jika tidak ditanya, serta menyempurnakan gaya bahasa agar AI mengakui dengan bangga dan santai bahwa Athar adalah perancang aplikasinya tanpa meta-komentar."
      }
    ]
  },
  {
    version: "v2.15.9",
    title: "Ekstra Roasting Mobile Legends (Sampe Mampus)",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penekanan Roasting Gamer ML di Mode Tamu",
        description: "Mempertegas kalimat sambutan untuk teman khusus di Mode Tamu dengan kalimat roasting kocak ala tongkrongan seputar Mobile Legends."
      }
    ]
  },
  {
    version: "v2.15.8",
    title: "Sistem Kuota Token Tamu & Roasting Mobile Legends",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Token Bucket (Max 15, Regen +1/3 Jam, Reset 00:00) & ML Roasting",
        description: "Menerapkan pembatasan kuota chat maksimal 15 token untuk Mode Tamu dengan sistem regenerasi +1 token setiap 3 jam dan reset harian jam 00:00 WIB, sekaligus menambahkan instruksi khusus roasting seputar Mobile Legends (ML) bergaya Grok."
      }
    ]
  },
  {
    version: "v2.15.7",
    title: "Grok/Rudy Roasting Style for MyWallet AI",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Nama Tetap MyWallet AI dengan Gaya Roasting Tanpa Filter Ala Grok/Rudy",
        description: "Bot Mode Tamu tetap beridentitas MyWallet AI namun berbicara dengan gaya sarkas cerdas tanpa filter ala Grok/Rudy, serta menjelaskan faktual bahwa Athar adalah pembuatnya tanpa kalimat pujian berlebihan."
      }
    ]
  },
  {
    version: "v2.15.6",
    title: "Rudi AI Roasting Persona (Mode Tamu Tanpa Puji Owner)",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Personalitas Rudi AI Tanpa Sebut Nama & Tanpa Pujian Berlebihan",
        description: "Mengubah karakter Mode Tamu menjadi 'Rudi AI' yang blak-blakan dan hobi roasting tanpa filter, sekaligus menghapus seluruh penyebutan nama Athar Ramadhan dan instruksi pujian berlebihan."
      }
    ]
  },
  {
    version: "v2.15.5",
    title: "All-Rounder Tsundere AI for Special Guest",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Buka Akses Pertanyaan Umum Mode Tamu Khusus ID 5305584463",
        description: "AI sekarang wajib menjawab semua pertanyaan/request umum di luar keuangan (koding, curhat, matematika, pengetahuan umum) dari teman Athar dengan sangat pintar, sambil tetap mempertahankan karakter galak dan sarkas."
      }
    ]
  },
  {
    version: "v2.15.4",
    title: "Hotfix: Restore Webhook Security Top Variables",
    date: "Juli 2026",
    icon: "shield",
    features: [
      {
        title: "Perbaikan Syntax & Keamanan Webhook",
        description: "Mengembalikan deklarasi variabel keamanan 3-Tier Whitelist dan inisialisasi Supabase Client pada webhook Telegram agar sistem berjalan normal tanpa error."
      }
    ]
  },
  {
    version: "v2.15.3",
    title: "Fierce Tsundere AI Mode (Mode Galak Khusus Tamu)",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Personalitas AI Galak & Sarkas untuk Chat ID 5305584463",
        description: "Secara eksklusif menyuntikkan gaya bahasa galak, jutek, dan sarkas lucu khusus untuk teman Athar yang mengetes Mode Tamu, sembari tetap menjawab simulasi investasi dan 9 fitur dengan sangat jenius."
      }
    ]
  },
  {
    version: "v2.15.2",
    title: "3-Tier Security & Guest Whitelist",
    date: "Juli 2026",
    icon: "shield",
    features: [
      {
        title: "Arsitektur Keamanan 3-Tier Whitelist",
        description: "Membagi akses bot menjadi 3 level: Owner (Akses Penuh), Whitelisted Guest (Mode Tamu Sandbox untuk Chat ID terdaftar seperti 5305584463), dan Publik Umum (Blokir Total 100%)."
      }
    ]
  },
  {
    version: "v2.15.1",
    title: "Natural & Casual Tone Polish",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penyempurnaan Gaya Bahasa & Pengenalan Pencipta",
        description: "Menyesuaikan deskripsi pencipta aplikasi (Athar Ramadhan) dengan gaya bahasa yang lebih natural, elegan, dan santai tanpa kesan kaku atau akademia formal."
      }
    ]
  },
  {
    version: "v2.15.0",
    title: "Guest Sandbox Mode (Mode Tamu AI)",
    date: "Juli 2026",
    icon: "shield",
    features: [
      {
        title: "Isolasi Fitur AI & Proteksi Akses Tamu",
        description: "Akses asisten AI dan bot diproteksi dengan sistem whitelist ketat sehingga seluruh kemampuan AI terkunci secara eksklusif hanya untuk pemilik (Owner) tanpa bisa diakses akun luar."
      },
      {
        title: "Isolasi Keamanan 100% (Zero Database Mutation)",
        description: "Perintah input transaksi, cek saldo, dan perintah slash dinonaktifkan secara otomatis untuk status akses Tamu."
      }
    ]
  },
  {
    version: "v2.14.1",
    title: "AI Brain & Capabilities Upgrade",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Peningkatan Pengetahuan Fitur AI (Omni-Capability Awareness)",
        description: "AI kini memahami secara penuh 9 fitur utama aplikasi MyWallet dan dapat menjelaskannya secara detail, elegan, dan santai saat ditanya kemampuan atau fitur aplikasi."
      },
      {
        title: "Perbaikan Reliabilitas Webhook",
        description: "Penyempurnaan arsitektur modul ES6 pada serverless Vercel untuk stabilitas respons chat real-time."
      }
    ]
  },
  {
    version: "v2.14.0",
    title: "Investment Simulator",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Simulasi Investasi Masa Depan",
        description: "Cukup tanya 'Kalau saya nabung Rp 1 Juta tiap bulan di reksadana selama 10 tahun dapat berapa?', AI akan membuat hitungan akurat menggunakan Compound Interest."
      },
      {
        title: "Grafik Garis Perbandingan (Line Chart)",
        description: "AI kini bisa merender grafik garis ganda yang membandingkan Total Uang Modal vs Total Hasil Pertumbuhan (Interest)."
      }
    ]
  },
  {
    version: "v2.13.0",
    title: "Secure & Smart AI",
    date: "Juli 2026",
    icon: "sparkles",
    features: [
      {
        title: "Webhook Secret Token",
        description: "Peningkatan keamanan tingkat tinggi (Anti-Spoofing) untuk melindungi database dari bot hacker/spam."
      },
      {
        title: "AI Pemisah Biaya Admin",
        description: "AI sekarang otomatis menawarkan untuk mencatat biaya admin saat Anda melakukan transfer beda bank atau top-up E-Wallet."
      },
      {
        title: "AI Context Awareness",
        description: "Otak AI sekarang otomatis mengetahui pembaruan versi terbaru sehingga Anda bisa menanyakan langsung kepadanya."
      }
    ]
  }
];

export const getLatestUpdateText = () => {
  const latest = latestUpdates[0];
  const featureList = latest.features.map(f => `- ${f.title}: ${f.description}`).join('\n');
  return `INFO SISTEM PENTING: Versi aplikasi saat ini adalah ${latest.version} (${latest.title}).\nFitur terbaru yang baru saja dirilis:\n${featureList}\n(Gunakan informasi ini jika pengguna bertanya tentang versi aplikasi atau update terbaru)`;
};
