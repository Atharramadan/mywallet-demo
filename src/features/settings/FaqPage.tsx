import { useState } from 'react';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, Cloud } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    category: "Pencatatan Harian",
    icon: <Wallet size={20} className="text-emerald-500" />,
    items: [
      { 
        q: "Bagaimana cara mencatat transaksi baru?", 
        a: "Tekan tombol (+) berwarna ungu di tengah bawah. Isi nominal uangnya, pilih tipe & kategori (misal: Makanan, Gaji), dan tekan Simpan." 
      },
      { 
        q: "Apa bedanya Transaksi dan Transfer?", 
        a: "Gunakan fitur 'Transfer' saat memindahkan uang antar rekening Anda (contoh: dari rekening BCA ke e-wallet GoPay). Transfer tidak memengaruhi total uang keseluruhan Anda." 
      }
    ]
  },
  {
    category: "Wealth Center & Aset",
    icon: <TrendingUp size={20} className="text-purple" />,
    items: [
      { 
        q: "Apa fungsi fitur Wealth Center?", 
        a: "Wealth Center dirancang khusus untuk memantau investasi jangka panjang dan memotret Kekayaan Bersih (Net Worth) Anda dari bulan ke bulan." 
      },
      { 
        q: "Bagaimana cara kerja Smart Risk Profiler?", 
        a: "Risk Profiler otomatis membedah rasio uang Anda menjadi Uang Aman (Kas, Bank, RDPU) vs Uang Tempur (Saham & Kripto), lalu memberi label tingkat risiko apakah portofolio Anda Terlalu Agresif atau Aman." 
      },
      { 
        q: "Kenapa saldo Dana Darurat tidak bisa diedit manual?", 
        a: "Sistem secara otomatis mengunci dan menyinkronkan nilai Dana Darurat Anda dengan besaran instrumen teraman di portofolio Anda, yaitu RDPU (Reksa Dana Pasar Uang)." 
      }
    ]
  },
  {
    category: "Cloud & Integrasi Telegram",
    icon: <Cloud size={20} className="text-blue" />,
    items: [
      { 
        q: "Apakah data saya akan hilang jika ganti HP?", 
        a: "Tidak! Aplikasi ini menggunakan basis data Cloud (Supabase). Semua riwayat keuangan Anda selalu disinkronisasi. Cukup login ulang dengan akun Anda dan semua akan kembali." 
      },
      { 
        q: "Apa fungsi Bot Telegram MyWallet?", 
        a: "Bot ini bertindak sebagai asisten pribadi Anda. Ia akan mengingatkan Anda setiap hari untuk mencatat. Anda juga bisa menarik ringkasan saldo, ataupun mencetak Laporan PDF Estetik per periode." 
      }
    ]
  }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/pengaturan"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Panduan Penggunaan</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple/10 text-purple mb-4">
          <HelpCircle size={32} />
        </div>
        <p className="text-center text-sm text-text-muted dark:text-text-muted-dark max-w-70">
          Temukan jawaban untuk pertanyaan umum tentang cara memaksimalkan penggunaan MyWallet.
        </p>
      </div>

      <div className="flex flex-col gap-8 mt-4">
        {FAQ_CATEGORIES.map((cat, catIdx) => (
          <div key={catIdx}>
            <div className="flex items-center gap-2 mb-3 px-1">
              {cat.icon}
              <h2 className="font-display text-base font-bold">{cat.category}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {cat.items.map((faq, idx) => {
                const uniqueId = `${catIdx}-${idx}`;
                const isOpen = openIndex === uniqueId;
                return (
                  <div 
                    key={uniqueId}
                    className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark card-shadow overflow-hidden transition-all"
                  >
                    <button 
                      className="flex w-full items-center justify-between p-4 text-left font-medium active:bg-surface-muted dark:active:bg-surface-muted-dark"
                      onClick={() => setOpenIndex(isOpen ? null : uniqueId)}
                    >
                      <span className="text-sm pr-4 font-semibold">{faq.q}</span>
                      <ChevronDown size={18} className={`shrink-0 transition-transform text-text-muted dark:text-text-muted-dark ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 animate-page-enter">
                        <p className="text-sm text-text-muted dark:text-text-muted-dark leading-relaxed">
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
