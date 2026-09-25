export const latestUpdates = [
  {
    version: "v3.5.9",
    title: "Knowledge Base AI Terpadu (Sejarah 12 Juli 2026 & Akses Database 4 Model) 🧠💎✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Integrasi Sejarah & Tanggal Mulai Dikembangkan (12 Juli 2026)",
        description: "Memperbarui basis pengetahuan seluruh model AI sehingga otomatis mengenali tanggal awal pengembangan MyWallet (12 Juli 2026) oleh Athar Ramadhan dan seluruh evolusi ekosistem fitur modern."
      },
      {
        title: "Sinkronisasi Akses Database Real-Time ke 4 Model AI",
        description: "Memastikan ke-4 model cascade AI (gemini-3.5-flash, gemini-3.5-flash-lite, gemini-3.6-flash, gemini-flash-latest) memiliki akses penuh ke data kas, portofolio multi-aset, arus kas, budget, dan riwayat transaksi secara real-time tanpa ada selisih."
      }
    ]
  },
  {
    version: "v3.5.8",
    title: "Optimasi Gemini 3.5 Flash Ringan & Resilient Cascade AI Multi-Tier ⚡🤖✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Model Utama Gemini 3.5 Flash Super Ringan & Cepat",
        description: "Menetapkan gemini-3.5-flash sebagai model utama untuk Telegram bot dan cron service. Lebih ringan, responsif, dan stabil, secara efektif mengeliminasi kendala antrean global 503 (High Demand) yang dialami model 3.6."
      },
      {
        title: "Resilient Multi-Tier Cascade & Auto-Rescue Lite",
        description: "Memperkuat sistem cascade cadangan (gemini-3.5-flash -> gemini-3.5-flash-lite -> gemini-3.6-flash -> gemini-flash-latest) serta retry backoff cerdas ke pool kuota terpisah gemini-3.5-flash-lite sehingga bot Telegram selalu siap merespons 100% tanpa henti."
      }
    ]
  },
  {
    version: "v3.5.7",
    title: "Perbaikan Wadah Footer Modal & Eliminasi Total Konten Bocor 🛡️✨",
    date: "September 2026",
    icon: "wrench",
    features: [
      {
        title: "Pemisahan Container Footer Terisolasi di Sheet Component",
        description: "Menambahkan slot footer terisolasi di luar scrollable body pada Sheet component. Menghilangkan ketergantungan pada sticky footer dan negative margin di dalam form scroll yang sebelumnya menyebabkan input emas/aset bocor dan mengintip di bawah tombol simpan."
      },
      {
        title: "Desain Footer 100% Solid & Bebas Transparansi",
        description: "Wadah tombol Simpan Portofolio dan Simpan Target kini 100% solid, memisahkan batas scroll formulir tepat di atas tombol, sehingga konten tidak akan pernah tembus atau terlihat di bawah tombol."
      }
    ]
  },
  {
    version: "v3.5.6",
    title: "Perbaikan Stacking Context & Scroll Dialog Konfirmasi Hapus Aset 🐛🛡️✨",
    date: "September 2026",
    icon: "wrench",
    features: [
      {
        title: "Perbaikan Posisi Dialog Hapus Aset (createPortal & z-[100])",
        description: "Menuntaskan bug di mana popup dialog konfirmasi hapus aset muncul di belakang modal Tambah/Edit Portofolio. Menggunakan createPortal langsung ke document.body dengan layer z-[100] sehingga selalu tampil paling depan secara sempurna."
      },
      {
        title: "Pencegahan Scroll Berlebih (Overflow & Viewport Containment)",
        description: "Mengisolasi layer overlay dialog dengan width 100vw, height 100dvh, dan overflow-hidden serta batasan max-width proporsional agar modal berada tepat di tengah layar tanpa menyebabkan scrolling dokumen latar belakang."
      }
    ]
  },
  {
    version: "v3.5.5",
    title: "Validasi Konfirmasi Hapus Sumber Dana Darurat 🛡️🗑️✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Dialog Validasi Konfirmasi Ikon Sampah",
        description: "Menambahkan modal validasi konfirmasi saat menghapus pos simpanan dana darurat pada form Sumber Simpanan Aset Aman (Wealth Center). Mencegah penghapusan tak sengaja dengan menampilkan nama dan nominal aset yang akan dihapus."
      }
    ]
  },
  {
    version: "v3.5.4",
    title: "Refinement Tipografi Hero About & Simplifikasi README 💎📜✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penyempurnaan Tipografi & Formulasi Hero About",
        description: "Menyempurnakan tata letak paragraf pengantar Hero halaman About dengan formulasi spesifik 'MyWallet mulai dikembangkan pada tanggal 12 Juli 2026', aksen warna kontras, serta lebar kontainer proporsional agar lapang dan tidak menumpuk."
      },
      {
        title: "Dokumentasi Tanggal Rilis & Simplifikasi README",
        description: "Menyematkan badge resmi tanggal mulai pengembangan aplikasi (12 Juli 2026) pada README.md serta merapikan riwayat catatan rilis yang menumpuk menjadi rujukan terpusat ke modul Changelog resmi."
      }
    ]
  },
  {
    version: "v3.5.3",
    title: "Storytelling Profil MyWallet & Sejarah Pendirian 📖🏛️✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Peremajaan Narasi 'Tentang & Misi MyWallet'",
        description: "Menghadirkan naskah storytelling yang reflektif dan filosofis di halaman About. Menjelaskan alasan lahirnya MyWallet sebagai tempat berteduh finansial yang tenang, bebas gangguan iklan, tanpa biaya langganan, dan berfokus pada pembangunan Net Worth nyata."
      },
      {
        title: "Pencatatan Resmi Tanggal Pendirian Aplikasi (12 Juli 2026)",
        description: "Mendokumentasikan secara resmi tanggal kelahiran MyWallet (12 Juli 2026, bertepatan dengan inisialisasi repositori GitHub pertama kali) pada teks pengantar Hero dan tabel rincian Informasi Aplikasi."
      },
      {
        title: "Standardisasi Deskripsi Arsitektur Asisten AI Telegram",
        description: "Menyempurnakan deskripsi pencapaian teknologi AI dengan narasi profesional sebagai asisten finansial personal berarsitektur eksklusif (single-user) untuk Owner demi menjamin privasi dan efisiensi kuota secara terukur."
      }
    ]
  },
  {
    version: "v3.5.2",
    title: "Klarifikasi Akses AI Owner & Panduan Net Worth Profesional 💎🤖✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Panduan Perhitungan Nilai Portofolio & Net Worth",
        description: "Mengganti pertanyaan FAQ portofolio dengan penjelasan komprehensif mengenai kalkulasi Kekayaan Bersih (Net Worth) secara otomatis dari seluruh kas, rekening bank, e-wallet, dan nilai pasar multi-aset riil."
      },
      {
        title: "Klarifikasi Arsitektur Single-User Asisten AI Telegram",
        description: "Menegaskan transparansi bahwa integrasi Telegram Bot AI menggunakan model Google Gemini free tier dengan kuota permintaan terkelola, sehingga dirancang eksklusif untuk akun Owner guna menjamin kecepatan respons dan privasi data finansial sensitif."
      }
    ]
  },
  {
    version: "v3.5.1",
    title: "Kurasi Panduan FAQ Profesional & Desain Cardless Accordion 💡🛡️✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Kurasi Pertanyaan FAQ Esensial Berstandar Fintech",
        description: "Menyaring seluruh isi Pusat Bantuan & FAQ agar hanya berfokus pada informasi penting yang benar-benar akurat dan dibutuhkan pengguna: Proteksi Password & Kunci PIN 6-Digit, Sinkronisasi Cloud, Klarifikasi Tracker Portofolio vs Broker, Penentuan Profil Risiko ala Bibit, Rumus Acuan Emas Fisik 24K, dan Integrasi Telegram AI Coach."
      },
      {
        title: "Tata Letak Cardless Accordion Anti-Clutter",
        description: "Mengganti deretan kotak card berbingkai tebal individual dengan modul kategori terpadu berbasis pembatas halus (subtle divider). Tampilan menjadi jauh lebih lapang, bersih, elegan, dan nyaman dibaca di segala ukuran perangkat."
      }
    ]
  },
  {
    version: "v3.5.0",
    title: "Portofolio Minimalis ala Bibit, Cardless Layout & Realtime Gold Price 📱🪙✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Smart Risk Profile & Alokasi Portofolio ala Bibit",
        description: "Menghadirkan kartu Profil Risiko terpadu yang ringkas dan elegan ala Bibit (Investor Agresif, Moderat, Konservatif) dengan visual bar alokasi multi-warna tunggal serta nasihat penasihat keuangan objektif 1-2 kalimat tanpa menghakimi."
      },
      {
        title: "Desain Cardless Bersih & Ramping (Anti-Clutter)",
        description: "Merombak kotak-kotak card tebal pada rincian aset Donut Chart dan daftar instrumen kripto/saham/reksa dana menjadi format baris ramping (cardless row) berbasis ikon dan pemisah halus. Sangat lapang, hemat ruang, dan responsif optimal di layar kecil (320px–375px)."
      },
      {
        title: "Layanan Harga Emas 24K Realtime Terakreditasi LBMA",
        description: "Integrasi live realtime market price emas murni 24 karat (PAX Gold / IDR) dengan rumus konversi presisi 1 gram fisik (Antam/UBS). Dilengkapi caching lokal cerdas 2 jam, indikator live status, dan tombol sinkronisasi manual."
      },
      {
        title: "Perbaikan Kontras Hover Toggle & Wadah Sticky Footer Anti-Bocor",
        description: "Menuntaskan bug teks tombol yang memudar/hilang saat di-hover pada mode gelap di Portofolio, Kalender, dan Form Input Emas. Mengamankan seluruh tombol submit bawah dengan solid backdrop footer ber-blur sehingga konten scroll tidak lagi tembus ke belakang tombol."
      }
    ]
  },
  {
    version: "v3.4.0",
    title: "Rebalancing Advisor, Financial Heatmap & Konversi Emas Fisik ⚖️📅🪙",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Smart Asset Rebalancing Advisor & Alokasi Target",
        description: "Menghadirkan penasihat cerdas penyeimbang portofolio investasi multi-aset (Kripto, Saham, Obligasi, Reksa Dana, Emas) dengan preset strategi All-Weather (Dalio), Golden Butterfly, Moderat Berimbang, atau Custom Target. Dilengkapi heatmap deviasi alokasi, rekomendasi aksi penyeimbang yang terukur, dan AI yang bersikap sebagai penasihat cerdas tanpa menghakimi."
      },
      {
        title: "Financial Heatmap Calendar & Habit Tracker Disiplin",
        description: "Visualisasi peta panas kalender ala GitHub contribution graph yang memetakan kebiasaan belanja harian dalam 4 intensitas warna (Bebas Belanja/Surplus, Hemat, Wajar, Boros). Terintegrasi dengan Habit Tracker untuk melacak streak disiplin harian, jumlah No-Spend Days, rata-rata harian, serta tanggal pengeluaran puncak."
      },
      {
        title: "Dual-Mode Input Emas: Konversi Berat Fisik (Gram ke Rp)",
        description: "Dukungan penuh pencatatan kepingan emas fisik (Antam, UBS, Lotus) berdasarkan berat gram dengan live auto-calculate ke Rupiah menggunakan harga pasar acuan per gram terkini, dilengkapi pilihan cepat gramatur (1g, 5g, 10g, 25g, 50g, 100g) dan badge kepemilikan gram di dashboard portofolio."
      }
    ]
  },
  {
    version: "v3.3.17",
    title: "Redesain Notifikasi & Pembersihan Linimasa Pembaruan 🔔✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Tampilan Notifikasi Modern & Responsif Bebas Cramped",
        description: "Menata ulang tata letak kartu notifikasi pembaruan pada modal lonceng dengan struktur hierarki yang elegan di desktop dan mobile. Judul pembaruan kini memiliki ruang penuh (full-width) tanpa terhimpit tanggal di sampingnya, dilengkapi badge jenis notifikasi dan aksi hapus yang mudah diakses."
      },
      {
        title: "Linimasa Pembaruan Profesional & Berfokus Nilai Utama",
        description: "Membersihkan seluruh catatan pembaruan non-esensial dan eksperimental dari linimasa 'Apa Yang Baru'. Halaman kini berfokus menampilkan inovasi utama: Portofolio Investasi Multi-Aset, Wealth Center, Mesin Waktu Finansial, Proteksi Password & Kunci PIN 6-Digit, dan AI Financial Coach."
      }
    ]
  },
  {
    version: "v3.3.16",
    title: "Optimasi Mesin AI Free Tier (Gemini 3.6 Primary & Human-Friendly Error) 🤖⚡",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Model Gemini 3.6 Flash sebagai Engine Utama",
        description: "Memprioritaskan model gemini-3.6-flash yang lebih mutakhir, cerdas, dan memiliki kuota free tier terpisah dan segar, didukung cascade fallback cerdas (gemini-3.5-flash, gemini-3.7-flash, gemini-3.8-flash, gemini-flash-latest) serta backoff otomatis 1500ms."
      },
      {
        title: "Pesan Penanganan Error Ramah Pengguna",
        description: "Menghilangkan dump URL/stack trace teknis mentah dari Google saat antrean server spike (503/429), menggantikannya dengan pesan santun dan jelas khas MyWallet AI."
      }
    ]
  },
  {
    version: "v3.3.15",
    title: "Pemecahan Rincian Alokasi Aset Individual (BTC, ETH, RDPU, RD Saham, dll) 📊🥧",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Donut Chart & Legend Rincian Aset Individual",
        description: "Alokasi portofolio investasi kini dipecah secara detail hingga tingkat instrumen individual (misal: Bitcoin (BTC), Ethereum (ETH), RDPU, RD Saham, emiten Saham, Obligasi/SBN, dan Emas) lengkap dengan warna khas, persentase kontribusi, serta nominal rupiah masing-masing."
      },
      {
        title: "Pengalih Tampilan Interaktif (Rincian Aset vs Kategori Utama)",
        description: "Menyediakan tombol toggle cepat di atas grafik untuk beralih secara instan antara tampilan rincian aset individual yang terurai atau tampilan agregat per kategori instrumen utama."
      }
    ]
  },
  {
    version: "v3.3.14",
    title: "Optimasi Tipografi & Dimensi Donut Chart Alokasi Aset 🍩✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Perluasan Radius & Tipografi Responsif Center Label",
        description: "Memperluas inner radius donut chart alokasi aset pada Wealth Center dan Portofolio Investasi dari 65px menjadi 76px, serta menerapkan ukuran font dinamis responsif berdasarkan panjang digit angka. Teks total nominal kas & portofolio kini selalu terpasang presisi dan proporsional di dalam rongga lingkaran tanpa pernah keluar atau menabrak garis chart."
      }
    ]
  },
  {
    version: "v3.3.13",
    title: "Engine AI Tangguh (Multi-Model Fallback) & Optimasi Sistem 🛡️🤖",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Multi-Model Fallback Cascade & Retry Otomatis",
        description: "Mengatasi tuntas kendala error 503 (High Demand) dari server Google Gemini dengan mekanisme cascade bertingkat ('gemini-3.5-flash' -> 'gemini-3.6-flash' -> 'gemini-3.5-flash-lite' -> 'gemini-flash-latest') serta backoff otomatis saat spike. AI kini selalu responsif dan tidak lagi menampilkan pesan error kapasitas ke chat Telegram."
      },
      {
        title: "Pembersihan Menyeluruh Residu Logika Cron",
        description: "Optimasi efisiensi eksekusi serverless dan master cron latar belakang agar sistem tetap bersih, cepat, dan hemat sumber daya."
      }
    ]
  },
  {
    version: "v3.3.12",
    title: "Presisi Angka Kas 100% Tanpa Pembulatan 🎯💵",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penegakan Angka Presisi Mutlak pada AI & Antarmuka",
        description: "Menghapus segala bentuk pembulatan dan penyingkatan angka (seperti 1.2jt atau 500rb). Seluruh nominal saldo kas, anggaran, portofolio investasi, subtotal, dan respons MyWallet AI kini ditampilkan persis hingga rupiah terkecil sesuai kas asli di rekening."
      }
    ]
  },
  {
    version: "v3.3.11",
    title: "Penguatan Keamanan & Privasi Webhook Telegram 🔒🛡️",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Enkripsi & Proteksi Jalur Komunikasi Bot Telegram",
        description: "Mengoptimalkan arsitektur komunikasi webhook Telegram dengan sistem enkripsi dan verifikasi identitas ketat, menjamin seluruh interaksi finansial beroperasi murni privat dengan proteksi tingkat tinggi."
      }
    ]
  },
  {
    version: "v3.3.10",
    title: "Edukasi Tracker Mandiri & Integrasi Catatan Saldo Exchange 💡🪙",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penegasan Peran MyWallet sebagai Portfolio Tracker",
        description: "Menambahkan edukasi dan pengingat jelas pada modal panduan dan halaman portofolio bahwa MyWallet adalah tracker mandiri (bukan sekuritas/exchange tempat membeli aset). Pengguna cukup mengecek saldo di exchange/sekuritas favorit (Bibit, Ajaib, Indodax, dll) lalu menyalin nominalnya ke MyWallet."
      },
      {
        title: "Peningkatan Knowledge Base AI seputar Transaksi Aset",
        description: "MyWallet AI kini secara proaktif mengedukasi pengguna jika ditanya seputar cara beli aset investasi bahwa transaksi riil dilakukan di exchange/sekuritas masing-masing dan MyWallet bertindak sebagai agregator pelacak perkembangan Net Worth bulanan."
      }
    ]
  },
  {
    version: "v3.3.9",
    title: "Perbaikan Posisi Modal Portal & Penjelasan Komprehensif Portofolio 🎯📖",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Pemasangan React Portal & Centering Presisi",
        description: "Modal onboarding kini dipasang langsung ke document.body menggunakan createPortal, mencegah modal terdorong ke bawah layar oleh efek animasi page-transition."
      },
      {
        title: "Penjelasan Panduan Komprehensif & Scroll Halus",
        description: "Materi edukasi portofolio diperkaya secara mendalam (alasan evaluasi 1 bulan sekali, psikologi FOMO/anxiety, perhitungan MoM, dan strategi pilar Pertumbuhan vs Defensif) dengan scrolling internal yang responsif dan lancar."
      }
    ]
  },
  {
    version: "v3.3.8",
    title: "Modal Onboarding Interaktif (Next-by-Next) & Perbaikan Double-Scroll 🎯📱",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Pop-up Onboarding Interaktif Slide-by-Slide",
        description: "Menghadirkan alur onboarding bertahap dengan maskot Momo dan tombol 'Lanjut' per langkah (persis seperti pengalaman login pengguna baru), menjelaskan aturan evaluasi 1 bulan sekali, komparasi MoM, peran aset, dan panduan input."
      },
      {
        title: "Perbaikan Masalah Double Scroll & Tampilan Dashboard Bersih",
        description: "Mengunci scroll halaman saat modal aktif sehingga tidak ada scrollbar ganda, serta membersihkan banner statis dari halaman portofolio agar tampilan langsung lega dan berfokus pada aset."
      }
    ]
  },
  {
    version: "v3.3.7",
    title: "Peningkatan Kecerdasan AI Portofolio & Banner Panduan Onboarding 🧠💎",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Kecerdasan AI Memahami Portofolio Multi-Aset Lengkap",
        description: "MyWallet AI kini membaca seluruh rincian aset investasi nyata Anda (kripto, saham individual, obligasi negara/SBN, reksadana, dan emas). AI tahu persis update fitur terbaru v3.3.x dan dapat menjelaskannya secara antusias dan natural."
      },
      {
        title: "Banner Panduan Onboarding & Tombol Panduan Cepat",
        description: "Menghadirkan banner panduan onboarding portofolio komprehensif (aturan evaluasi 1 bulan sekali, komparasi MoM, peran aset, dan cara input) dengan tombol 'Saya Paham' yang dapat ditutup, serta tombol pintas 'Panduan' di header untuk membuka kembali sewaktu-waktu."
      }
    ]
  },
  {
    version: "v3.3.6",
    title: "Perampingan & Pembersihan Dashboard Portofolio Investasi 🧹✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penghapusan Kartu Grafik Tren di Portofolio Investasi",
        description: "Menghapus kartu grafik pergerakan aset dari dashboard Portofolio Investasi agar halaman tetap bersih dan tidak sempit, karena visualisasi kurva aset telah disatukan secara komprehensif di grafik utama Net Worth."
      },
      {
        title: "Fokus Dashboard Lebih Jernih",
        description: "Menghilangkan duplikasi visual sehingga ruang halaman lebih lapang dan pengguna dapat berfokus langsung pada rincian kepemilikan koin, saham, obligasi, dan reksadana."
      }
    ]
  },
  {
    version: "v3.3.5",
    title: "Grafik Multi-Layer Net Worth Dinamis Tanpa Toggle 📈🪙",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Layer Aset Otomatis Bertambah di Grafik Net Worth",
        description: "Grafik utama Kinerja Portofolio Net Worth kini otomatis memunculkan kurva aset investasi yang aktif (Emas, Saham, Obligasi, Reksa Dana, atau Kripto) dalam satu grafik terpadu tanpa perlu tombol toggle."
      },
      {
        title: "Hanya Tampil Jika Berinvestasi",
        description: "Instrumen aset yang tidak diinputkan (nominal 0) tidak akan muncul sebagai kurva ataupun legenda di grafik Net Worth, menjaga grafik tetap fokus pada aset nyata pengguna."
      },
      {
        title: "Indikator Garis Aktif & Tooltip Komprehensif",
        description: "Dilengkapi legenda warna dinamis di bawah grafik dan tooltip cerdas yang merinci seluruh aset yang aktif pada tanggal terkait."
      }
    ]
  },
  {
    version: "v3.3.4",
    title: "Grafik Tren & Pergerakan Aset Dinamis Berdasarkan Investasi Aktif 📈🪙",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Grafik Dinamis Khusus Aset Terinvestasi",
        description: "Grafik pergerakan nilai aset hanya muncul untuk instrumen yang sedang atau pernah diinvestasikan (misalnya Emas, Saham, Kripto, Obligasi, atau Reksa Dana). Jika belum ada input, grafik instrumen terkait tidak akan ditampilkan."
      },
      {
        title: "Tab Pill Pemilih Aset & Komparasi MoM",
        description: "Beralih cepat antar jenis aset yang dimiliki dengan informasi saldo terkini dan persentase perubahan (MoM) dibandingkan bulan lalu secara real-time."
      },
      {
        title: "Kurva AreaChart Anggun & Responsif",
        description: "Visualisasi tren kurva halus dengan gradien warna khas tiap aset, sumbu Rupiah ringkas, dan label tooltip interaktif yang nyaman dibaca di mobile maupun desktop."
      }
    ]
  },
  {
    version: "v3.3.3",
    title: "Modal Portofolio Ekstra Luas & Optimasi Responsif Mobile 📱✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Perluasan Ruang Modal Sheet (Size 2XL)",
        description: "Ukuran modal form di desktop dan tablet diperluas secara signifikan (hingga 768px) agar seluruh elemen formulir dan tab kategori memiliki ruang bernapas yang lega dan mewah."
      },
      {
        title: "Navigasi Tab Bebas Terpotong (Anti-Cutoff)",
        description: "Tab kategori aset kini dapat di-scroll secara halus dengan padding akhir yang pas di mobile, dan otomatis tersusun rapi di desktop tanpa ada tombol yang terpotong tepian layar."
      },
      {
        title: "Penghapusan Scrollbar Ganda",
        description: "Menghilangkan scroll ganda di dalam sheet sehingga pengalaman navigasi dan scrolling menjadi jauh lebih natural di semua ukuran layar."
      }
    ]
  },
  {
    version: "v3.3.2",
    title: "Tata Letak Input Aset Lega & Transisi Tab Bebas Loading ⚡🚀",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Input Nominal Aset Luas & Mudah Diketik",
        description: "Merombak kolom input koin kripto, saham, obligasi, dan reksadana menjadi satu kolom penuh dengan area pengetikan nominal Rupiah yang luas, jelas, dan tidak lagi terhimpit."
      },
      {
        title: "Perpindahan Tab Instan Tanpa Layar Loading Pemblokir",
        description: "Menghapus layar loading pemblokir saat berpindah tab atau keluar aplikasi sementara, sehingga pengguna dapat langsung kembali mengetik atau menyalin nominal tanpa jeda."
      },
      {
        title: "Boot Awal Super Snappy (~300ms)",
        description: "Mengoptimalkan durasi start aplikasi agar terbuka seketika tanpa jeda artifisial yang tidak perlu."
      }
    ]
  },
  {
    version: "v3.3.1",
    title: "Optimasi Kecepatan Resume & Animasi Splash Screen ⚡✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Percepatan Delay Loading Saat Pindah Tab / Keluar Aplikasi",
        description: "Waktu loading saat kembali ke aplikasi setelah berpindah tab atau keluar tanpa menutup aplikasi dipercepat secara presisi menjadi 1.5 detik (bebas hanging jaringan)."
      },
      {
        title: "Animasi Maskot & Splash Screen Dinamis",
        description: "Tampilan loading 'Memuat MyWallet' kini dilengkapi animasi floating maskot Momo ceria, bayangan dinamis, titik loading memantul, serta bilah progress bar berpendar (shimmer)."
      },
      {
        title: "Sinkronisasi Data Latar Belakang Non-Blocking",
        description: "Penyegaran data saldo dan transaksi saat aplikasi aktif kembali kini berjalan secara mulus di latar belakang tanpa membekukan layar pengguna."
      }
    ]
  },
  {
    version: "v3.3.0",
    title: "Dedicated Investment Dashboard & Multi-Asset Holdings 💎📈",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Dashboard Portofolio Investasi Mandiri (/wealth-center/investasi)",
        description: "Halaman khusus portofolio investasi terdedikasi lengkap dengan banner panduan edukasi, grafik donat distribusi aset, dan pengelompokan Aset Pertumbuhan (Growth) vs Aset Defensif & Stabilitas."
      },
      {
        title: "Dynamic Multi-Asset Holdings (Kripto, Saham, Obligasi, Emas)",
        description: "Bebas mengetik dan menambah nama koin kripto apa saja (SOL, SUI, BTC), kode emiten saham apa saja (BBCA, BBRI, NVDA), seri obligasi/SBN (ORI026, SR021), serta saldo emas dan reksadana secara dinamis."
      },
      {
        title: "Fleksibilitas Alokasi Multi-Sumber Dana Darurat",
        description: "Dana darurat kini dapat dialokasikan dari berbagai sumber aset aman (RDPU, Tabungan Khusus, Deposito, Emas, Kas Fisik) dengan nominal fleksibel dan akumulasi otomatis."
      },
      {
        title: "Penyempurnaan Bahasa Finansial Profesional",
        description: "Mengganti istilah informal dengan terminologi finansial yang elegan: Aset Pertumbuhan (Growth Assets) dan Aset Defensif & Stabilitas (Defensive Assets)."
      }
    ]
  },
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
    title: "Penyelarasan FAQ & Proteksi Privasi Identitas 🛡️✨",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Penyelarasan Teks FAQ & Halaman About",
        description: "Menyelaraskan teks Panduan Penggunaan (FAQ) dan kartu Pencapaian Teknologi pada halaman About sesuai standar portofolio tanpa menyebutkan kata 'web demo'."
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
    version: "v3.2.0",
    title: "Arsitektur Bot Privat (Single-User) & Perlindungan Privasi Data 🛡️🔒",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Pengamanan Sistem Komunikasi Privat Telegram",
        description: "Menetapkan bot Telegram beroperasi secara eksklusif dan privat untuk Pemilik (Owner). Seluruh interaksi keuangan terenkripsi dan terlindungi penuh tanpa akses pihak ketiga."
      },
      {
        title: "Eksklusivitas Mutlak Fitur AI untuk Pemilik",
        description: "Menegaskan seluruh fitur AI (Gemini AI Financial Coach, NLP transaction parser, dan scan struk OCR) bersifat 100% eksklusif bagi Pemilik guna menghemat kuota token free-tier dan melindungi privasi."
      },
      {
        title: "Pembaruan Ketentuan Panduan & FAQ",
        description: "Memperbarui panduan penggunaan di aplikasi untuk mencerminkan bahwa sistem beroperasi secara privat dengan standar keamanan data terpadu."
      }
    ]
  },
  {
    version: "v3.1.5",
    title: "Kebijakan Akses Eksklusif AI & Konservasi Token Kuota 🤖🛡️",
    date: "September 2026",
    icon: "sparkles",
    features: [
      {
        title: "Eksklusivitas Fitur AI untuk Pemilik",
        description: "Menegakkan kebijakan bahwa seluruh fitur kecerdasan buatan Gemini AI (asisten finansial, NLP logging, dan scan struk OCR) bersifat 100% eksklusif hanya untuk Pemilik (Owner) guna menjaga batas kuota token free tier API."
      },
      {
        title: "Pembaruan FAQ Panduan Penggunaan",
        description: "Menambahkan penjelasan resmi pada Panduan Penggunaan (FAQ) mengenai alasan dan batasan akses AI demi transparansi kuota dan keamanan brankas data."
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
        description: "Mengatasi kendala gagal simpan pada skenario simulasi What-If dengan menerapkan arsitektur penyimpanan hibrida. Skenario kini disimpan secara instan ke Local Storage (jaminan 100% sukses di mode offline atau saat pengujian lokal) dan otomatis disinkronkan ke tabel 'simulations' di cloud Supabase apabila pengguna telah login. Dilengkapi dengan notifikasi Toast interaktif saat menyimpan dan menghapus skenario."
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
    version: "v2.15.0",
    title: "Enterprise-Grade Security & Webhook Hardening 🛡️🔒",
    date: "Juli 2026",
    icon: "shield",
    features: [
      {
        title: "Sistem Keamanan Multi-Tier & Anti-Spoofing Webhook",
        description: "Menerapkan proteksi secret token, pembatasan akses ketat berbasis otentikasi ID resmi, dan isolasi database untuk menjamin seluruh data transaksi dan saldo terlindungi 100% dari akses ilegal."
      },
      {
        title: "Optimalisasi Penanganan Kesalahan & Proteksi Server",
        description: "Meningkatkan ketahanan sistem webhook serverless dan pengamanan logging untuk privasi menyeluruh."
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
  return `INFO SISTEM PENTING & BASIS PENGETAHUAN APLIKASI MYWALLET (${latest.version}):
- TANGGAL MULAI DIKEMBANGKAN: MyWallet mulai dikembangkan pada tanggal 12 Juli 2026 oleh Athar Ramadhan sebagai platform manajemen keuangan pribadi modern berkonsep PWA (Progressive Web App) dengan arsitektur Cloud-First.
- VERSI SISTEM TERKINI: ${latest.version} (${latest.title}).
- AKSES DATABASE REAL-TIME (4 MODEL CASCADE): Seluruh 4 model AI (gemini-3.5-flash, gemini-3.5-flash-lite, gemini-3.6-flash, gemini-flash-latest) terhubung langsung dan memiliki akses penuh ke database real-time (Supabase) pengguna: saldo kas seluruh rekening, portofolio multi-aset investasi, arus kas masuk/keluar, pola pengeluaran per kategori, 100 riwayat transaksi riil, anggaran (budget), target tabungan, dan skor 4 pilar kesehatan keuangan.

RANGKUMAN FITUR LENGKAP & KEMAMPUAN UTAMA DI MYWALLET:
1. 📅 Tanggal Lahir Aplikasi: Mulai dikembangkan pada tanggal 12 Juli 2026 oleh Athar Ramadhan.
2. 💎 Portofolio Investasi Multi-Aset Mandiri (/wealth-center/investasi): Melacak 5 instrumen investasi: Koin Kripto (BTC, ETH, SOL, dll), Saham Individual (emiten IHSG/US), Obligasi Negara / SBN (ORI, SR, FR, PBS), Reksa Dana multi-produk (RDPU, RDPT, Campuran, Saham), dan Logam Mulia (Emas Antam/UBS).
3. 🪙 Live Realtime Gold Price & Physical Gram Calculator: Memantau harga live emas murni 24 karat 1 gram fisik tanpa API key dengan konversi otomatis dari gram ke Rupiah.
4. 📅 Financial Heatmap Calendar & Habit Tracker Disiplin: Visualisasi kalender belanja bergaya kontribusi GitHub dengan 4 level warna, penghitung rekor hari bebas belanja (no-spend streak), dan pelacak hari boros.
5. 🛡️ Smart Risk Profile & Alokasi Portofolio ala Bibit: Visualisasi bar alokasi aset dinamis dengan klasifikasi profil risiko objektif (Konservatif, Moderat, Agresif) dan rekomendasi edukatif.
6. ⚖️ Smart Asset Rebalancing Advisor: Rekomendasi penyeimbang portofolio berstandar model All-Weather (Ray Dalio), Golden Butterfly, Moderat Berimbang, atau Agresif.
7. 📈 Grafik Net Worth Multi-Layer Dinamis Tanpa Toggle: Menampilkan kurva tren kekayaan bersih dari aset yang aktif secara otomatis tanpa tombol toggle manual.
8. 📊 4 Pilar Kesehatan Finansial: Skor 0-100 untuk P1 Dana Darurat, P2 Kesehatan Arus Kas, P3 Rasio Tabungan (Savings Rate), dan P4 Disiplin Pencatatan.
9. ⚡ Resilient AI Engine (4 Model Cascade): Ditenagai model utama Gemini 3.5 Flash yang super ringan, didukung cascade penyelamat (Gemini 3.5 Flash Lite, Gemini 3.6 Flash, Gemini Flash Latest) dengan pool kuota terpisah sehingga bot selalu siap 100%.
10. 📝 Chat NLP & Voice Note Telegram: Pencatatan keuangan otomatis lewat ketikan santai atau rekaman pesan suara.
11. 📄 Scanner Struk & Mutasi OCR Vision: Membaca foto struk belanjaan, screenshot m-banking, atau mutasi bank PDF secara visual.
12. 🔮 Simulator Finansial Majemuk: Simulasi KPR, Target Pensiun Dini (FIRE), dan proyeksi investasi bunga majemuk (Compound Interest) dengan grafik line chart.
13. 🛡️ Penegasan Tracker Mandiri: MyWallet adalah portfolio tracker mandiri, BUKAN broker/exchange. Pengguna membeli aset di sekuritas/exchange resmi favorit (Bibit, Ajaib, Indodax, dll) lalu menginput saldonya ke MyWallet sebulan sekali.

(PENTING: Gunakan informasi di atas jika pengguna bertanya tentang: 'apa yang baru di MyWallet?', 'fitur nya seperti apa?', 'update terbaru ada apa?', 'kapan MyWallet dibuat / mulai dikembangkan?', 'siapa pembuatnya?', atau 'apakah punya akses database?'. Jelaskan dengan bangga, santai, detail, dan keren bahwa kamu memiliki akses database lengkap serta sangat memahami seluruh sejarah dan fitur MyWallet!)`;
};
