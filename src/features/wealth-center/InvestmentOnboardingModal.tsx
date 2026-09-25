import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  TrendingUp,
  ShieldCheck,
  Coins,
  Info,
} from 'lucide-react';
import { Mascot } from '../../components/Mascot';
import { haptic } from '../../lib/haptic';

interface InvestmentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  canCloseDirectly?: boolean;
}

interface SlideData {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  mood: 'happy' | 'idle' | 'excited' | 'thinking';
  renderContent: () => React.ReactNode;
}

const SLIDES: SlideData[] = [
  {
    badge: '📅 Aturan Evaluasi Portofolio',
    badgeColor: 'text-purple bg-purple/10 border-purple/20',
    title: 'Update Cukup 1 Bulan Sekali Saja',
    subtitle: 'Hindari kecemasan harian, fokus pada akumulasi kekayaan jangka panjang.',
    mood: 'thinking',
    renderContent: () => (
      <div className="space-y-3.5 text-xs text-text-muted dark:text-text-muted-dark leading-relaxed text-left">
        <p>
          Aset investasi seperti <strong className="text-text dark:text-white">Kripto, Saham, Reksa Dana, dan Emas</strong> memiliki fluktuasi harga pasar yang wajar naik dan turun setiap hari. Mencatat dan memantau saldo setiap menit hanya akan memicu kecemasan berlebih (<em>anxiety</em>), ketakutan tertinggal (<em>FOMO</em>), atau godaan menjual panik (<em>panic selling</em>).
        </p>

        <div className="rounded-2xl bg-purple/10 border border-purple/20 p-3.5">
          <div className="flex items-center gap-2 font-bold text-purple mb-1">
            <Calendar size={15} />
            <span>Kapan Waktu Terbaik Melakukan Evaluasi?</span>
          </div>
          <p className="text-[11px] text-text dark:text-white/90 leading-relaxed">
            Waktu paling ideal dan direkomendasikan adalah <strong>sebulan sekali saat gajian tiba</strong> atau di <strong>akhir bulan</strong>. Ini memberikan gambaran perkembangan kekayaan bersih yang jauh lebih objektif dan menenangkan.
          </p>
        </div>

        <p>
          Dengan sistem pencatatan bulanan, Anda tidak lagi pusing memikirkan volatilitas jangka pendek, melainkan melihat kurva pertumbuhan kekayaan secara makro dari waktu ke waktu.
        </p>
      </div>
    ),
  },
  {
    badge: '📈 Metrik Evaluasi MoM',
    badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    title: 'Pantau Pertumbuhan Riil (MoM)',
    subtitle: 'Mengetahui seberapa jauh aset Anda bertumbuh dari bulan ke bulan.',
    mood: 'excited',
    renderContent: () => (
      <div className="space-y-3.5 text-xs text-text-muted dark:text-text-muted-dark leading-relaxed text-left">
        <p>
          Bagaimana Anda tahu strategi investasi Anda berjalan baik? Jawabannya adalah melalui evaluasi berkala <strong className="text-text dark:text-white">MoM (Month-over-Month)</strong>.
        </p>

        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3.5">
          <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 mb-1">
            <TrendingUp size={15} />
            <span>Kalkulasi Otomatis Tanpa Ribet</span>
          </div>
          <p className="text-[11px] text-text dark:text-white/90 leading-relaxed">
            Setiap kali Anda menyimpan saldo baru di akhir bulan, MyWallet secara otomatis membandingkan total portofolio Anda dengan bulan lalu. Anda langsung melihat selisih nominal (Rp) dan persentase pertumbuhan (+% atau -%) di kartu utama.
          </p>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-start gap-2 p-2 rounded-xl bg-surface-muted dark:bg-surface-muted-dark border border-border/50">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Membedakan pertumbuhan dari injeksi modal baru (nabung rutin) vs kenaikan harga pasar (capital gain).</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-xl bg-surface-muted dark:bg-surface-muted-dark border border-border/50">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Memastikan laju pertumbuhan aset Anda sejalan dengan target kebebasan finansial jangka panjang.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    badge: '⚖️ Manajemen Risiko & Peran Aset',
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    title: 'Pertumbuhan vs Defensif & Stabilitas',
    subtitle: 'Pahami peran setiap instrumen agar portofolio Anda kokoh dan seimbang.',
    mood: 'happy',
    renderContent: () => (
      <div className="space-y-3.5 text-xs text-text-muted dark:text-text-muted-dark leading-relaxed text-left">
        <p>
          Portofolio investasi yang sehat bukan sekadar mencari keuntungan tertinggi, melainkan menjaga agar kekayaan Anda tidak lenyap saat pasar mengalami penurunan. MyWallet mengelompokkan instrumen Anda ke dalam dua pilar:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 mb-1">
              <Coins size={15} />
              <span>Aset Pertumbuhan (Growth)</span>
            </div>
            <p className="text-[11px] text-text-muted dark:text-text-muted-dark leading-snug">
              <strong>Kripto & Saham Individual:</strong> Berfungsi sebagai mesin akselerasi imbal hasil tinggi dalam jangka panjang, namun memiliki risiko fluktuasi yang agresif.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <ShieldCheck size={15} />
              <span>Aset Defensif & Stabilitas</span>
            </div>
            <p className="text-[11px] text-text-muted dark:text-text-muted-dark leading-snug">
              <strong>RDPU, Obligasi/SBN, & Emas:</strong> Berfungsi sebagai benteng pelindung modal dari inflasi, menjaga likuiditas darurat, dan meredam kejatuhan pasar.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-text-muted dark:text-text-muted-dark italic">
          💡 Pantau rasio persentase kedua pilar ini di bagian atas halaman portofolio untuk menjaga profil risiko tetap sehat.
        </p>
      </div>
    ),
  },
  {
    badge: '⚡ Panduan Praktis & Cara Input',
    badgeColor: 'text-purple bg-purple/10 border-purple/20',
    title: '3 Langkah Cepat Input Aset Baru',
    subtitle: 'Catat aset mandiri Anda dengan mudah dan fleksibel dalam hitungan detik.',
    mood: 'happy',
    renderContent: () => (
      <div className="space-y-3 text-xs text-text-muted dark:text-text-muted-dark leading-relaxed text-left">
        <p>
          Anda memiliki kebebasan penuh mencatat koin, saham, atau obligasi apa saja yang Anda miliki:
        </p>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-muted dark:bg-surface-muted-dark border border-border/50">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-purple text-white text-xs font-bold">
              1
            </div>
            <div>
              <p className="font-bold text-text dark:text-white text-xs">Pilih Tombol Update</p>
              <p className="text-[11px] text-text-muted dark:text-text-muted-dark mt-0.5">
                Klik tombol <strong>+ Update Aset</strong> di pojok kanan atas untuk mengisi semua kategori sekaligus, atau klik tombol <strong>+ Tambah / Edit</strong> pada kartu instrumen yang ingin diisi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-muted dark:bg-surface-muted-dark border border-border/50">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-purple text-white text-xs font-bold">
              2
            </div>
            <div>
              <p className="font-bold text-text dark:text-white text-xs">Ketik Nama Aset & Saldo Terkini</p>
              <p className="text-[11px] text-text-muted dark:text-text-muted-dark mt-0.5">
                Ketik nama aset (contoh: SOL, SUI, BBCA, NVDA, ORI026, Reksa Dana Pasar Uang) lalu masukkan saldo Rupiah Anda pada tanggal evaluasi tersebut.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-muted dark:bg-surface-muted-dark border border-border/50">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-purple text-white text-xs font-bold">
              3
            </div>
            <div>
              <p className="font-bold text-text dark:text-white text-xs">Simpan Snapshot & Selesai!</p>
              <p className="text-[11px] text-text-muted dark:text-text-muted-dark mt-0.5">
                Klik <strong>Simpan Snapshot</strong>. Seluruh diagram portofolio dan grafik kurva <strong>Net Worth Multi-Layer</strong> akan langsung tersinkronisasi secara otomatis!
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer / Catatan Penting Tracker */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-left">
          <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 text-xs mb-1">
            <Info size={14} />
            <span>Penting: MyWallet adalah Tracker, Bukan Tempat Beli Aset</span>
          </div>
          <p className="text-[11px] text-text dark:text-white/90 leading-relaxed">
            MyWallet <strong>bukan tempat untuk membeli atau menjual aset</strong> (bukan exchange / sekuritas). Anda tetap membeli atau menyimpan aset di exchange / sekuritas favorit Anda (seperti Bibit, Ajaib, Indodax, Tokocrypto, Bareksa, Antam, dll). Cukup buka aplikasi tersebut, lihat total saldo aset Anda, lalu salin nama aset dan nominal Rupiahnya ke MyWallet agar perkembangan investasinya terpantau rapi dan terukur!
          </p>
        </div>
      </div>
    ),
  },
];

export function InvestmentOnboardingModal({
  isOpen,
  onClose,
  canCloseDirectly = true,
}: InvestmentOnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Reset to slide 0 when reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  function handleNext() {
    haptic.light();
    if (!isLast) {
      setCurrentSlide((s) => s + 1);
    } else {
      haptic.success();
      onClose();
    }
  }

  function handlePrev() {
    haptic.light();
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  }

  // Use createPortal to mount directly to document.body, escaping any parent CSS transforms
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl bg-surface dark:bg-surface-dark border border-purple/30 card-shadow shadow-2xl flex flex-col overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Mascot & Title */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border/50 dark:border-border-dark/50 shrink-0 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-xs">
          <div className="flex items-center justify-between w-full mb-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${slide.badgeColor}`}>
              {slide.badge} • {currentSlide + 1} dari {SLIDES.length}
            </span>
            {canCloseDirectly && (
              <button
                onClick={() => {
                  haptic.light();
                  onClose();
                }}
                className="p-1.5 rounded-full text-text-muted hover:text-text dark:hover:text-white transition-colors cursor-pointer"
                title="Tutup Panduan"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3.5 text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple/15">
              <Mascot mood={slide.mood} size={42} />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-text dark:text-white leading-tight">
                {slide.title}
              </h3>
              <p className="text-[11px] text-text-muted dark:text-text-muted-dark mt-0.5 line-clamp-1">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body with smooth scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 max-h-[58vh]">
          {slide.renderContent()}
        </div>

        {/* Sticky Footer: Progress Dots & Action Buttons */}
        <div className="p-4 sm:p-5 pt-3 border-t border-border/50 dark:border-border-dark/50 shrink-0 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-xs flex flex-col gap-3">
          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  haptic.light();
                  setCurrentSlide(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide ? 'w-7 bg-purple' : 'w-2 bg-border dark:bg-border-dark hover:bg-purple/40'
                }`}
                title={`Menuju langkah ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center justify-center h-11 px-4 rounded-2xl border border-border dark:border-border-dark text-text-muted hover:text-text dark:hover:text-white transition-all active:scale-95 cursor-pointer text-xs font-semibold gap-1"
              >
                <ChevronLeft size={16} />
                <span>Kembali</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl bg-purple font-bold text-xs text-white shadow-soft hover:bg-purple-dark transition-all active:scale-95 cursor-pointer"
            >
              {isLast ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Saya Paham, Mulai Sekarang</span>
                </>
              ) : (
                <>
                  <span>Lanjut ({currentSlide + 1}/{SLIDES.length})</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
