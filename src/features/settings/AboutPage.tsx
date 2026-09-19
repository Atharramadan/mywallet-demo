import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Star, ShieldCheck, FileText, 
  Lock, Zap, TrendingUp, Cloud, Ban, CreditCard, LineChart,
  PieChart, MessageCircle, Sparkles, BarChart, Info, Smartphone,
  Shield, Megaphone, ChevronRight, Activity, Target
} from "lucide-react";
import { Mascot } from "../../components/Mascot";
import { Card } from "../../components/Card";
import { Modal } from "../../components/Modal";
import pkg from "../../../package.json";
import { useToastStore } from "../../stores/toastStore";

export function AboutPage() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const showToast = useToastStore((s) => s.show);
  const navigate = useNavigate();

  const handleComingSoon = () => {
    showToast("Fitur ini akan segera hadir!", "info");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg dark:bg-bg-dark text-text dark:text-text-dark font-body">
      {/* Inline styles for custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animation-delay-100 { animation-delay: 100ms; opacity: 0; }
        .animation-delay-200 { animation-delay: 200ms; opacity: 0; }
        .animation-delay-300 { animation-delay: 300ms; opacity: 0; }
        .animation-delay-400 { animation-delay: 400ms; opacity: 0; }
        .animation-delay-500 { animation-delay: 500ms; opacity: 0; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 flex h-14 items-center px-4 bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-xl border-b border-border/50 dark:border-border-dark/50">
        <Link
          to="/pengaturan"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface dark:hover:bg-surface-dark transition-colors"
        >
          <ChevronLeft size={24} />
        </Link>
        <span className="ml-2 font-display font-bold text-lg">About</span>
      </header>

      <div className="flex-1 px-4 pb-20 pt-6">
        
        {/* SECTION 1 - HERO */}
        <section className="flex flex-col items-center justify-center py-8 animate-fade-in-up">
          <div className="relative animate-float">
            <div className="absolute inset-0 blur-3xl bg-purple/30 dark:bg-purple/20 rounded-full scale-150" />
            <div className="absolute -inset-4 blur-2xl bg-blue/20 dark:bg-blue/15 rounded-full scale-125 mix-blend-multiply dark:mix-blend-screen" />
            <Mascot mood="happy" size={110} className="relative z-10" />
          </div>
          <h1 
            className="mt-8 font-display text-4xl font-extrabold tracking-tight bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to bottom right, var(--color-purple), var(--color-blue))' }}
          >
            MyWallet
          </h1>
          <div className="mt-3 rounded-full bg-purple/10 dark:bg-purple/15 border border-purple/20 dark:border-purple/20 px-4 py-1 text-xs font-bold tracking-widest text-purple shadow-[0_0_15px_rgba(124,111,224,0.15)] uppercase">
            v{pkg.version}
          </div>
          <h2 className="mt-6 text-center text-sm font-display font-semibold text-text dark:text-text-dark leading-relaxed">
            "Kontrol Keuangan. Bangun Kekayaan.<br/>Raih Kebebasan Finansial."
          </h2>
          <p className="mt-3 text-center text-sm text-text-muted dark:text-text-muted-dark max-w-[320px] leading-relaxed mx-auto">
            MyWallet membantu Anda mencatat transaksi, memantau aset, dan memahami perjalanan keuangan dalam satu tempat yang aman, sederhana, dan nyaman digunakan setiap hari.
          </p>
        </section>

        {/* SECTION 2 - OUR MISSION */}
        <section className="mt-10 animate-fade-in-up animation-delay-100">
          <div className="relative overflow-hidden rounded-3xl bg-surface/80 dark:bg-surface-dark border border-border dark:border-border-dark p-6 shadow-sm">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-purple/10 dark:bg-purple/10 blur-3xl rounded-full" />
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-purple mb-3 flex items-center gap-2">
              <Target size={14} /> Misi Kami
            </h3>
            <p className="text-sm text-justify text-text-muted dark:text-text-muted-dark leading-relaxed relative z-10">
              Kami percaya bahwa pengelolaan keuangan pribadi seharusnya sederhana, transparan, dan dapat diakses oleh semua orang. MyWallet hadir untuk membantu pengguna membangun kebiasaan finansial yang lebih baik, memahami kondisi keuangan mereka, dan bergerak menuju kebebasan finansial secara bertahap.
            </p>
          </div>
        </section>

        {/* SECTION 3 - CORE VALUES */}
        <section className="mt-12 animate-fade-in-up animation-delay-200">
          <h3 className="px-1 mb-4 font-display text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">
            Nilai Utama MyWallet
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Lock, title: "Privasi Prioritas", desc: "Data terenkripsi & milik Anda.", color: "text-blue", bg: "bg-blue/10 dark:bg-blue/15" },
              { icon: Zap, title: "Cepat & Ringan", desc: "Desain untuk harian.", color: "text-peach", bg: "bg-peach/10 dark:bg-peach/15" },
              { icon: TrendingUp, title: "Fokus Pertumbuhan", desc: "Pantau kekayaan Anda.", color: "text-mint", bg: "bg-mint/10 dark:bg-mint/15" },
              { icon: Cloud, title: "Cloud Sync", desc: "Tersedia kapan saja.", color: "text-purple", bg: "bg-purple/10 dark:bg-purple/15" }
            ].map((v, i) => (
              <div key={i} className="flex flex-col p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-all group shadow-sm">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${v.bg} ${v.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <v.icon size={20} />
                </div>
                <h4 className="font-display text-[13px] font-bold text-text dark:text-text-dark">{v.title}</h4>
                <p className="mt-1 text-[11px] text-text-muted dark:text-text-muted-dark leading-tight">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 - WHY MYWALLET */}
        <section className="mt-12 animate-fade-in-up animation-delay-300">
          <h3 className="px-1 mb-4 font-display text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">
            Mengapa MyWallet?
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: Ban, title: "Tanpa Iklan", desc: "Fokus penuh pada pengalaman pengguna tanpa gangguan visual." },
              { icon: CreditCard, title: "Tanpa Langganan", desc: "Semua fitur inti dapat digunakan selamanya tanpa biaya berulang." },
              { icon: LineChart, title: "Pengembangan Finansial", desc: "Dirancang khusus untuk membangun kebiasaan keuangan yang sehat." }
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted dark:bg-surface-muted-dark text-text dark:text-text-dark">
                  <b.icon size={18} />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-text dark:text-text-dark">{b.title}</h4>
                  <p className="mt-1 text-xs text-justify text-text-muted dark:text-text-muted-dark leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 - PENCAPAIAN TEKNOLOGI */}
        <section className="mt-12 animate-fade-in-up animation-delay-400">
          <div className="flex items-center justify-between px-1 mb-1">
            <h3 className="font-display text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">
              Pencapaian Teknologi
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 border border-mint/20 px-2.5 py-0.5 text-[10px] font-bold text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
              Aktif & Beroperasi
            </span>
          </div>
          <p className="px-1 mb-4 text-xs text-text-muted dark:text-text-muted-dark">
            Kemampuan unggulan ekosistem MyWallet yang telah terintegrasi penuh.
          </p>
          
          <div className="grid gap-3">
            {[
              { 
                icon: PieChart, 
                title: "Wealth & Net Worth Center", 
                desc: "Visualisasi aset kas, reksadana, crypto, dan gamifikasi milestone kekayaan secara real-time.",
                badge: "Fitur Unggulan",
                badgeColor: "bg-purple/10 text-purple border-purple/20"
              },
              { 
                icon: MessageCircle, 
                title: "Telegram AI Assistant", 
                desc: "Asisten AI finansial multimodal privat untuk pencatatan natural, voice note, dan OCR scan struk.",
                badge: "Eksklusif Pemilik",
                badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
              },
              { 
                icon: Sparkles, 
                title: "Smart Financial Health (4 Pilar)", 
                desc: "Diagnosis arus kas tajam, deteksi pengeluaran bocor, simulasi masa depan, dan detektif langganan.",
                badge: "AI-Powered",
                badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20"
              },
              { 
                icon: BarChart, 
                title: "Laporan Akuntansi Profesional", 
                desc: "Ekspor mutasi, arus kas, dan rekapitulasi keuangan rapi ke format PDF resmi & spreadsheet Excel.",
                badge: "Multi-Format",
                badgeColor: "bg-mint/10 text-mint border-mint/20"
              }
            ].map((r, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-sm hover:border-purple/30 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple dark:bg-purple/20">
                  <r.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-sm font-bold text-text dark:text-text-dark truncate">
                      {r.title}
                    </h4>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.badgeColor}`}>
                      {r.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6 - APP INFORMATION */}
        <section className="mt-12 animate-fade-in-up animation-delay-500">
          <h3 className="px-1 mb-4 font-display text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">
            Informasi Aplikasi
          </h3>
          <Card padded={false} className="divide-y divide-border dark:divide-border-dark overflow-hidden bg-surface dark:bg-surface-dark border-border dark:border-border-dark shadow-sm">
            {[
              { label: "Versi Aplikasi", value: `v${pkg.version}`, icon: Info },
              { label: "Status", value: "Aktif Dikembangkan", icon: Activity },
              { label: "Cloud Sync", value: "Aktif", icon: Cloud, valueColor: "text-mint" },
              { label: "Keamanan Data", value: "Terenkripsi", icon: ShieldCheck, valueColor: "text-mint" },
              { label: "Platform", value: "Web & Mobile", icon: Smartphone },
            ].map((info, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <info.icon size={16} className="text-text-muted dark:text-text-muted-dark" />
                  <span className="font-display text-sm font-semibold text-text dark:text-text-dark">{info.label}</span>
                </div>
                <span className={`font-display text-sm font-bold ${info.valueColor || "text-text-muted dark:text-text-muted-dark"}`}>
                  {info.value}
                </span>
              </div>
            ))}
          </Card>
        </section>

        {/* SECTION 7 - COMMUNITY & SUPPORT */}
        <section className="mt-12 animate-fade-in-up animation-delay-500">
          <h3 className="px-1 mb-4 font-display text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">
            Komunitas & Dukungan
          </h3>
          <Card padded={false} className="divide-y divide-border dark:divide-border-dark overflow-hidden bg-surface dark:bg-surface-dark border-border dark:border-border-dark shadow-sm">
            {[
              { icon: Star, label: "Beri Rating", onClick: handleComingSoon },
              { icon: FileText, label: "Syarat & Ketentuan", onClick: () => setShowTerms(true) },
              { icon: Shield, label: "Kebijakan Privasi", onClick: () => setShowPrivacy(true) },
              { icon: Megaphone, label: "Apa Yang Baru", onClick: () => navigate("/pengaturan/changelog") },
            ].map((item, i) => (
              <button 
                key={i}
                onClick={item.onClick}
                className="group relative flex w-full items-center gap-4 px-4 py-4 text-left overflow-hidden hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
              >
                {/* Ripple Effect bg */}
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-active:opacity-100 transition-opacity duration-200" />
                <item.icon size={18} className="text-text-muted dark:text-text-muted-dark group-hover:text-purple transition-colors z-10" />
                <span className="flex-1 font-display text-sm font-semibold text-text dark:text-text-dark z-10">{item.label}</span>
                <ChevronRight size={16} className="text-border dark:text-border-dark group-hover:translate-x-1 transition-transform z-10" />
              </button>
            ))}
          </Card>
        </section>

        {/* SECTION 8 - FOOTER */}
        <footer className="mt-16 mb-8 text-center animate-fade-in-up animation-delay-500 flex flex-col items-center">
          <div className="h-px w-16 bg-border dark:bg-border-dark mb-8" />
          <p className="text-xs text-center text-text-muted dark:text-text-muted-dark leading-relaxed max-w-70">
            MyWallet dibuat untuk membantu lebih banyak orang memahami, mengelola, dan mengembangkan keuangan mereka.
          </p>
          <div className="mt-6 flex flex-col items-center gap-1">
            <span className="font-display text-[11px] font-bold text-text-muted dark:text-text-muted-dark tracking-widest uppercase">
              v{pkg.version}
            </span>
            <span className="text-[10px] text-text-muted/60 dark:text-text-muted-dark/60">
              © {new Date().getFullYear()} MyWallet. All Rights Reserved.
            </span>
          </div>
        </footer>

      </div>

      {/* Modals for Terms and Privacy remain simple and clean */}
      <Modal open={showTerms} onClose={() => setShowTerms(false)} title="Syarat & Ketentuan">
        <div className="space-y-4 text-sm text-justify text-text-muted dark:text-text-muted-dark pb-4 leading-relaxed">
          <p>
            Dengan menggunakan aplikasi MyWallet versi terbaru ini, Anda menyetujui bahwa semua data keuangan Anda disimpan secara aman di server Cloud (Supabase).
          </p>
          <p>
            Hal ini memungkinkan Anda untuk mengakses data keuangan Anda dari perangkat manapun kapan saja, tanpa takut kehilangan data jika aplikasi terhapus.
          </p>
          <p>
            Aplikasi ini disediakan "apa adanya". Kami berkomitmen menjaga keamanan data Anda, namun Anda tetap disarankan untuk menjaga kerahasiaan perangkat Anda.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setShowTerms(false)}
            className="w-full rounded-xl bg-purple dark:bg-purple-dark py-3 font-display text-sm font-bold text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </Modal>

      <Modal open={showPrivacy} onClose={() => setShowPrivacy(false)} title="Kebijakan Privasi">
        <div className="space-y-4 text-sm text-justify text-text-muted dark:text-text-muted-dark pb-4 leading-relaxed">
          <p>
            Privasi Anda adalah prioritas utama kami. MyWallet <strong className="text-text dark:text-text-dark">tidak pernah</strong> menjual, menyewakan, atau membagikan data keuangan Anda kepada pihak ketiga manapun untuk tujuan pemasaran.
          </p>
          <p>
            Semua transaksi, akun, dan tujuan tabungan Anda dikaitkan dengan akun pribadi Anda dan hanya dapat diakses oleh Anda sendiri.
          </p>
          <p>
            Kami menggunakan praktik keamanan standar industri (Row Level Security dari Supabase) untuk memastikan bahwa data Anda hanya dapat dibaca oleh Anda.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setShowPrivacy(false)}
            className="w-full rounded-xl bg-purple dark:bg-purple-dark py-3 font-display text-sm font-bold text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </Modal>
    </div>
  );
}
