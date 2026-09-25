import { ArrowLeft, Sparkles, Bug, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { Mascot } from "../../components/Mascot";

import { latestUpdates } from "../../data/changelog";

// v3.5.9: Knowledge Base AI Terpadu (Sejarah 12 Juli 2026 & Akses Database 4 Model)
export function ChangelogPage() {
  const latestVer = latestUpdates[0];
  
  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6 page-transition">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/pengaturan"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text shadow-sm active:scale-95 dark:bg-surface-dark dark:text-text-dark transition-all hover:scale-105"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Apa Yang Baru</h1>
      </div>

      <Card className="mb-8 flex items-center gap-4 border-none bg-purple/10 p-5">
        <Mascot mood="happy" size={56} />
        <div>
          <p className="font-display text-lg font-bold leading-tight">
            MyWallet {latestVer.version}
          </p>
          <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
            {latestVer.title}.
          </p>
        </div>
      </Card>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-border dark:before:bg-border-dark md:before:mx-auto md:before:translate-x-0">
        
        {/* Dynamic New Versions */}
        {latestUpdates.map((update, idx) => (
          <div key={update.version} className={`group ${idx === 0 ? 'is-active ' : ''}relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse`}>
            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
              <Sparkles size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
              <div className="mb-2 flex flex-col">
                <span className="font-display text-lg font-bold text-purple">
                  {update.version} {update.title}
                </span>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {update.date}
                </span>
              </div>
              <Card className="p-4 shadow-sm">
                <ul className="space-y-3">
                  {update.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex gap-2">
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-purple" />
                      <span className="text-sm"><strong className="font-semibold">{feature.title}:</strong> {feature.description}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        ))}

        {/* Version 2.12.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.12.0 Proactive AI Reviews
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-purple" />
                  <span className="text-sm"><strong className="font-semibold">Master Cron AI:</strong> Semua notifikasi otomatis kini menggunakan AI agar lebih relevan dan tidak kaku (Harian, Mingguan, Bulanan).</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-purple" />
                  <span className="text-sm"><strong className="font-semibold">Daily Anti-Spam Logic:</strong> AI hanya akan menegur jika pengguna lupa mencatat pengeluaran selama 2 hari berturut-turut.</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-purple" />
                  <span className="text-sm"><strong className="font-semibold">Monthly Executive Report:</strong> Setiap tanggal 1, AI akan merangkum analisis keuangan secara mendalam.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.11.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.11.0 God-Tier AI
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-purple" />
                  <span className="text-sm"><strong className="font-semibold">Real-Time Market Analyst:</strong> AI kini terhubung dengan live market CoinGecko untuk memberikan harga BTC dan ETH secara real-time.</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-purple" />
                  <span className="text-sm"><strong className="font-semibold">Detektif Langganan:</strong> AI pintar membaca pola pengeluaran bulanan dan memperingatkan tagihan langganan yang akan jatuh tempo.</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-purple" />
                  <span className="text-sm"><strong className="font-semibold">Auto-Sweep:</strong> Di awal bulan, AI akan secara proaktif menyarankan agar sisa saldo kas dipindahkan ke target tabungan.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.10.2 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.10.2 UI & Lint Fix
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-purple" />
                  <span className="text-sm">Pembersihan tombol non-aktif di Pengaturan dan standarisasi kode UI (Tailwind CSS) agar aplikasi berjalan lebih optimal tanpa *warning*.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.10.1 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Bug size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.10.1 Hotfix
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Bug size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <span className="text-sm">Perbaikan bug zona waktu (Timezone WIB) pada AI Telegram yang menyebabkan transaksi dini hari (cth: jam 00:27) salah dibaca sebagai pengeluaran hari sebelumnya.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
        
        {/* Version 2.10.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.10.0 God-Tier Update
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-sm"><strong>Vision AI Struk:</strong> Telegram Bot sekarang otomatis merinci daftar belanjaan dari foto struk dan menyimpannya di catatan transaksi.</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-blue-500" />
                  <span className="text-sm"><strong>Polisi Langganan:</strong> Deteksi cerdas tagihan berulang yang sering tidak disadari pada laporan mingguan.</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                  <span className="text-sm"><strong>Gamifikasi Pencapaian:</strong> Sistem Lencana (Badges) interaktif untuk melacak kesuksesan finansial seperti "Raja Hemat" dan "Sultan Muda".</span>
                </li>
                <li className="flex gap-2">
                  <Wrench size={16} className="mt-0.5 shrink-0 text-gray-500" />
                  <span className="text-sm">Pembaruan UI secara keseluruhan dengan utilitas <em>Glassmorphism</em> untuk tampilan panel yang tembus pandang dan mewah.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
        
        {/* Version 2.9.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.9.0 Telegram Gemini AI & Wealth Bot
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-sm">Gemini AI terintegrasi di Telegram Bot sebagai asisten keuangan cerdas.</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-blue-500" />
                  <span className="text-sm">Update total saldo investasi (Crypto & Reksadana) instan via chat Telegram.</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                  <span className="text-sm">Bot kini sanggup memproses input transaksi ganda (banyak baris) sekaligus.</span>
                </li>
                <li className="flex gap-2">
                  <Wrench size={16} className="mt-0.5 shrink-0 text-gray-500" />
                  <span className="text-sm">Penyempurnaan command /laporan dan /help Telegram menjadi lebih detail.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.8.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.8.0 Smart Telegram NLP
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <div>
                    <span className="block text-sm font-semibold text-text dark:text-white">Smart NLP Override (Telegram Bot)</span>
                    <span className="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed">Bot sekarang lebih pintar! Bisa mendeteksi kategori custom dan secara otomatis melakukan override tipe transaksi (Pemasukan/Pengeluaran) sesuai dengan tipe dari kategori yang dideteksi.</span>
                  </div>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <div>
                    <span className="block text-sm font-semibold text-text dark:text-white">Ubah Kategori Interaktif via Bot</span>
                    <span className="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed">Jika lupa memasukkan kategori, bot akan otomatis merespon dengan tombol interaktif Inline Keyboard untuk memilih kategori dari dalam chat Telegram.</span>
                  </div>
                </li>
                <li className="flex gap-2">
                  <Wrench size={16} className="mt-0.5 shrink-0 text-blue" />
                  <div>
                    <span className="block text-sm font-semibold text-text dark:text-white">Penyempurnaan Visual Dashboard</span>
                    <span className="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed">Penambahan animasi "sheen" miring yang mulus tanpa cacat sudut pada kartu saldo utama.</span>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.7.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.7.0 Ultimate Premium UX
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <div>
                    <span className="block text-sm font-semibold text-text dark:text-white">Rombakan Laporan Keuangan (Reports)</span>
                    <span className="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed">Hero balance masif, efek glow pada card pemasukan/pengeluaran, progress bar animasi untuk kategori, CustomTooltip kaca transparan, dan AI Insights melayang.</span>
                  </div>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <div>
                    <span className="block text-sm font-semibold text-text dark:text-white">Pembaruan Pengaturan (Settings) & Transaksi</span>
                    <span className="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed">Animasi transisi halaman, efek header kaca, active segmented control sliding, ikon badge bulat di menu pengaturan, animasi interaktif sentuhan.</span>
                  </div>
                </li>
                <li className="flex gap-2">
                  <Wrench size={16} className="mt-0.5 shrink-0 text-blue" />
                  <div>
                    <span className="block text-sm font-semibold text-text dark:text-white">Peningkatan Stabilitas Tailwind v4</span>
                    <span className="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed">Penggunaan shrink-0, penghapusan !important modifiers yang tidak perlu pada Skeleton, layout yang sempurna responsif di tema Terang & Gelap.</span>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.6.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.6.0 Premium UX Upgrade
              </span>
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-sm">
                    <strong>Premium Animations:</strong> Perpindahan halaman yang lebih mulus dengan Framer Motion, memberikan nuansa meluncur yang *smooth*.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-sm">
                    <strong>Glassmorphism Header:</strong> Tampilan Sticky Header di Dashboard dan Wealth Center kini memiliki efek blur kaca yang mewah.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-sm">
                    <strong>Mesh Glow & Shimmer:</strong> Kotak saldo kini dilengkapi efek *glow* halus. Proses *loading* dirombak dari abu-abu mati menjadi *shimmer effect* yang elegan.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-sm">
                    <strong>Haptic Feedback:</strong> Tombol-tombol penting di aplikasi kini akan memicu getaran mikro pada perangkat (jika didukung).
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.5.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.5.0
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="border-purple/20 bg-surface/80 p-4 shadow-sm backdrop-blur-sm dark:bg-surface-dark/80">
              <h3 className="mb-3 border-b border-border pb-2 text-sm font-bold text-text dark:border-border-dark dark:text-text-dark">
                🚀 Dynamic Risk Profiling & Bot Update
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-lavender">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Portofolio Rinci (4 Instrumen):
                    </strong>{" "}
                    Pencatatan Wealth Center kini lebih detail! Pisahkan alokasi untuk RDPU, RD Saham, Bitcoin, dan Ethereum.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-mint">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Smart Risk Profiler:
                    </strong>{" "}
                    Sistem kini otomatis membedah proporsi Uang Aman vs Uang Tempur Anda dan memberi alert status risiko secara *real-time*.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Auto-Sync Dana Darurat:
                    </strong>{" "}
                    Target Dana Darurat sekarang mengunci nilai RDPU Anda secara otomatis! Tidak perlu ubah manual lagi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-purple">
                    <Wrench size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Telegram Bot 2.0 & Aesthetic PDF:
                    </strong>{" "}
                    Opsi 6-Bulan, pemisahan riwayat saldo (Aset vs Investasi), serta laporan PDF yang lebih cantik dan rapi (zebra-striping).
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.3.5 */}
        <div className="group is-active relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Wrench size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.3.5
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="border-purple/20 bg-surface/80 p-4 shadow-sm backdrop-blur-sm dark:bg-surface-dark/80">
              <h3 className="mb-3 border-b border-border pb-2 text-sm font-bold text-text dark:border-border-dark dark:text-text-dark">
                ⚡ Stability & Optimization
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-lavender">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Smart Notifications:
                    </strong>{" "}
                    Sistem pengingat latar belakang otomatis (Cron Job) via Telegram.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-purple">
                    <Wrench size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      O(N) Graph Engine:
                    </strong>{" "}
                    Grafik Wealth Center kini memuat ribuan data secara instan tanpa lag.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue">
                    <Bug size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Optimasi RAM:
                    </strong>{" "}
                    Pembatasan tarikan data *database* agar HP tidak panas dan lebih responsif.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-mint">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Mobile Touch:
                    </strong>{" "}
                    Penghapusan *tap-delay* pada seluruh tombol, aplikasi kini bereaksi layaknya aplikasi native.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.2.0 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-purple text-white shadow-md dark:border-bg-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Sparkles size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-purple">
                v2.2.0
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                Juli 2026
              </span>
            </div>
            <Card className="border-purple/20 bg-surface/80 p-4 shadow-sm backdrop-blur-sm dark:bg-surface-dark/80">
              <h3 className="mb-3 border-b border-border pb-2 text-sm font-bold text-text dark:border-border-dark dark:text-text-dark">
                ✨ UX & Visual Polish
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-lavender">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Pusat Panduan & Story:
                    </strong>{" "}
                    Halaman About baru dengan kisah aplikasi dan onboarding yang memukau.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-purple">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Skeleton Loaders:
                    </strong>{" "}
                    Layar *loading* diganti dengan efek *shimmer* gelombang cahaya premium.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-blue">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Haptic Feedback:
                    </strong>{" "}
                    Sensasi getaran fisik saat menyimpan transaksi atau mengetik PIN.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-purple">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Menu Changelog:
                    </strong>{" "}
                    Halaman pembaruan interaktif (menu yang sedang Anda baca!).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-mint">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text dark:text-text-dark">
                    <strong className="font-semibold text-text dark:text-text-dark">
                      Web Push Notification:
                    </strong>{" "}
                    Notifikasi latar belakang (PWA) tersinkronisasi dengan Telegram Bot.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Version 2.1.8 */}
        <div className="group relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-bg bg-border text-text-muted dark:border-bg-dark dark:bg-border-dark md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2">
            <Wrench size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] pb-4 md:w-[calc(50%-2.5rem)]">
            <div className="mb-2 flex flex-col">
              <span className="font-display text-lg font-bold text-text dark:text-text-dark">
                v2.1.8
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                Juni 2026
              </span>
            </div>
            <Card className="opacity-80 p-4 shadow-sm">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-mint">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text-muted dark:text-text-muted-dark">
                    Penambahan sistem Keamanan Password & Kunci PIN 6-Digit.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-peach">
                    <Bug size={14} />
                  </span>
                  <span className="text-sm leading-snug text-text-muted dark:text-text-muted-dark">
                    Perbaikan sinkronisasi cloud yang terkadang lambat di koneksi tidak stabil.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-text-muted dark:text-text-muted-dark">
        Terima kasih telah menemani perjalanan MyWallet! ❤️
      </p>
    </div>
  );
}
