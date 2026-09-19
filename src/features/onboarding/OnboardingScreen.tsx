import { useState } from 'react';
import { Mascot } from '../../components/Mascot';
import { haptic } from '../../lib/haptic';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    title: 'Selamat Datang di MyWallet',
    description: 'Aplikasi pencatat keuangan pintar dengan antarmuka modern dan interaksi yang memukau.',
    mood: 'happy' as const,
  },
  {
    title: 'Lacak Pemasukan & Pengeluaran',
    description: 'Catat setiap transaksi dengan mudah. Pantau arus kas harian Anda secara real-time.',
    mood: 'idle' as const,
  },
  {
    title: 'Pantau Kekayaan Anda',
    description: 'Fitur Wealth Center membantu Anda memantau target Dana Darurat dan portofolio investasi.',
    mood: 'thinking' as const,
  },
  {
    title: 'Aman & Pribadi',
    description: 'Data Anda tersimpan dengan aman, serta didukung kunci PIN untuk perlindungan ekstra.',
    mood: 'happy' as const,
  }
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  function handleNext() {
    haptic.light();
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      haptic.success();
      onComplete();
    }
  }

  const slide = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg dark:bg-bg-dark text-center animate-page-enter">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Mascot mood={slide.mood} size={140} className="mb-8" />
        <h1 className="font-display text-2xl font-bold mb-3">{slide.title}</h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark max-w-[280px]">
          {slide.description}
        </p>
      </div>

      <div className="p-8 pb-12 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-6 bg-purple' : 'w-2 bg-border dark:bg-border-dark'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full rounded-2xl bg-purple py-4 font-semibold text-white shadow-soft transition-transform active:scale-95"
        >
          {currentSlide === SLIDES.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
}
