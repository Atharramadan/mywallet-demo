import { useState } from 'react';
import { ArrowLeft, ChevronDown, HelpCircle, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_CATEGORIES = [
  {
    category: "Keamanan & Privasi Data",
    icon: <ShieldCheck size={20} className="text-emerald-500 shrink-0" />,
    items: [
      { 
        q: "Bagaimana MyWallet melindungi keamanan dan privasi data finansial saya?", 
        a: "Seluruh data Anda dienkripsi secara aman dan disimpan pada basis data cloud terisolasi. Untuk keamanan akses pada aplikasi, MyWallet dilindungi oleh kombinasi Password akun serta kunci PIN 6-digit setiap kali Anda membuka kembali aplikasi guna mencegah akses fisik oleh pihak lain." 
      },
      { 
        q: "Apakah data saya tetap aman jika berganti perangkat atau menghapus browser?", 
        a: "Ya. Seluruh riwayat transaksi, rekening, target tabungan, dan alokasi portofolio Anda tersinkronisasi secara realtime ke basis data cloud. Saat Anda berganti ponsel atau membuka browser baru, cukup masuk kembali dengan akun Anda dan semua data akan langsung pulih seketika." 
      }
    ]
  },
  {
    category: "Pelacak Portofolio & Kekayaan Bersih",
    icon: <TrendingUp size={20} className="text-purple shrink-0" />,
    items: [
      { 
        q: "Bagaimana cara kerja perhitungan total nilai portofolio dan Kekayaan Bersih (Net Worth)?", 
        a: "Nilai Kekayaan Bersih (Net Worth) dikalkulasi secara otomatis dengan mengonsolidasi seluruh saldo kas/bank, e-wallet, dan nilai pasar seluruh aset investasi (Kripto, Saham, Obligasi, Reksa Dana, serta Emas fisik). Setiap snapshot bulanan dibandingkan untuk menyajikan tren pertumbuhan (MoM) yang akurat dan terukur." 
      },
      { 
        q: "Bagaimana penentuan Profil Risiko dan Alokasi Portofolio bekerja?", 
        a: "Sistem secara otomatis menganalisis rasio komposisi antara instrumen pertumbuhan modal (Kripto, Saham, Reksa Dana Saham) dan instrumen defensif (Pasar Uang, Obligasi/SBN, Emas). Berdasarkan persentase tersebut, portofolio Anda dikelompokkan ke dalam profil Agresif, Moderat, atau Konservatif lengkap dengan saran alokasi berimbang yang objektif." 
      },
      { 
        q: "Dari mana acuan harga realtime 1 gram emas fisik diperoleh?", 
        a: "Harga acuan emas dikonversi secara realtime dari harga pasar internasional emas murni 24 karat terakreditasi LBMA (PAX Gold / IDR) dengan rumus resmi standar 1 troy ounce = 31.1034768 gram. Sistem dilengkapi cache lokal 2 jam agar hemat kuota serta menjamin estimasi nilai pasar kepingan fisik Anda selalu presisi." 
      }
    ]
  },
  {
    category: "Integrasi Asisten AI Telegram",
    icon: <Sparkles size={20} className="text-blue shrink-0" />,
    items: [
      { 
        q: "Mengapa Asisten AI Telegram hanya dapat diakses oleh Owner?", 
        a: "MyWallet memanfaatkan model Google Gemini AI versi free tier yang memiliki batasan kuota permintaan harian. Demi menjaga kestabilan performa respons, menghindari lonjakan antrean, serta menjamin privasi data finansial sensitif, integrasi bot Telegram dirancang eksklusif dengan arsitektur single-user khusus untuk akun Owner terverifikasi." 
      }
    ]
  }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 md:px-8 lg:px-10 pb-28 pt-6 page-transition">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/pengaturan"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow hover:bg-surface-muted transition-colors"
          aria-label="Kembali ke Pengaturan"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold leading-tight">Pusat Bantuan & FAQ</h1>
          <p className="text-[11px] text-text-muted dark:text-text-muted-dark">
            Panduan Informasi Penting & Pertanyaan Umum
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/10 text-purple mb-3">
          <HelpCircle size={28} />
        </div>
        <h2 className="font-display text-base font-bold text-text dark:text-white">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="text-xs text-text-muted dark:text-text-muted-dark max-w-xs mt-1">
          Informasi esensial seputar keamanan data, pelacakan portofolio multi-aset, dan asisten cerdas MyWallet.
        </p>
      </div>

      <div className="flex flex-col gap-6 mt-3">
        {FAQ_CATEGORIES.map((cat, catIdx) => (
          <div
            key={catIdx}
            className="rounded-3xl bg-surface dark:bg-surface-dark card-shadow border border-border dark:border-border-dark overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50 dark:border-border-dark/50 bg-surface-muted/40 dark:bg-surface-muted-dark/40">
              {cat.icon}
              <h3 className="font-display text-sm sm:text-base font-bold text-text dark:text-white">
                {cat.category}
              </h3>
            </div>
            <div className="divide-y divide-border/40 dark:divide-border-dark/40">
              {cat.items.map((faq, idx) => {
                const uniqueId = `${catIdx}-${idx}`;
                const isOpen = openIndex === uniqueId;
                return (
                  <div key={uniqueId} className="transition-colors">
                    <button 
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-medium hover:bg-surface-muted/40 dark:hover:bg-surface-muted-dark/40 transition-colors cursor-pointer"
                      onClick={() => setOpenIndex(isOpen ? null : uniqueId)}
                      aria-expanded={isOpen}
                    >
                      <span className="text-xs sm:text-sm pr-4 font-semibold text-text dark:text-white leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform duration-200 text-text-muted dark:text-text-muted-dark ${
                          isOpen ? 'rotate-180 text-purple' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-0 animate-page-enter">
                        <p className="text-xs sm:text-sm text-text-muted dark:text-text-muted-dark leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
