import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Coins,
  TrendingUp,
  FileText,
  PieChart as PieChartIcon,
  ShieldCheck,
  Zap,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useWealthStore, parseWealthNote } from '../../stores/wealthStore';
import { formatCurrency } from '../../lib/formatters';
import { AnimatedCurrency } from '../../components/AnimatedCurrency';
import { PageTransition } from '../../components/PageTransition';
import { AddSnapshotSheet, type CategoryFilter } from './AddSnapshotSheet';
import { InvestmentOnboardingModal } from './InvestmentOnboardingModal';

export function InvestmentPortfolioPage() {
  const snapshots = useWealthStore((s) => s.snapshots);
  const [activeCategoryModal, setActiveCategoryModal] = useState<CategoryFilter | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    try {
      return localStorage.getItem('mywallet_has_seen_investment_onboarding_v2') === 'true';
    } catch {
      return false;
    }
  });
  const [showOnboardingModal, setShowOnboardingModal] = useState(() => {
    try {
      return localStorage.getItem('mywallet_has_seen_investment_onboarding_v2') !== 'true';
    } catch {
      return true;
    }
  });

  const handleCompleteOnboarding = () => {
    setHasSeenOnboarding(true);
    setShowOnboardingModal(false);
    try {
      localStorage.setItem('mywallet_has_seen_investment_onboarding_v2', 'true');
    } catch (e) {
      console.error('Failed to save investment onboarding state', e);
    }
  };

  const latestSnapshot = snapshots.length > 0 ? snapshots[0] : null;
  const wealthDetails = parseWealthNote(latestSnapshot?.note);

  // Subtotals
  const totalCrypto = wealthDetails.cryptoHoldings.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalSaham = wealthDetails.sahamHoldings.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalObligasi = wealthDetails.obligasiHoldings.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalReksa = wealthDetails.reksadanaHoldings.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalEmas = wealthDetails.emas || 0;

  // Total Investment
  const totalInvestasi =
    totalCrypto + totalSaham + totalObligasi + totalReksa + totalEmas;

  // Fallback for legacy snapshot if dynamic holdings are empty but snapshot amounts exist
  const displayTotal =
    totalInvestasi > 0
      ? totalInvestasi
      : (latestSnapshot?.cryptoAmount || 0) + (latestSnapshot?.mutualFundAmount || 0);

  // Smart Risk Profiler: Growth vs Defensive
  // Growth Assets: Kripto + Saham + Growth Mutual Funds
  let growthReksa = 0;
  let defensiveReksa = 0;
  wealthDetails.reksadanaHoldings.forEach((r) => {
    const lower = r.name.toLowerCase();
    if (lower.includes('pasar uang') || lower.includes('rdpu') || lower.includes('pendapatan tetap') || lower.includes('rdpt')) {
      defensiveReksa += r.amount;
    } else {
      growthReksa += r.amount;
    }
  });

  const growthAssets = totalCrypto + totalSaham + (wealthDetails.reksadanaHoldings.length > 0 ? growthReksa : wealthDetails.rdSaham);
  const defensiveAssets = (wealthDetails.reksadanaHoldings.length > 0 ? defensiveReksa : wealthDetails.rdpu) + totalObligasi + totalEmas;
  const totalCategorized = growthAssets + defensiveAssets;

  const growthPercentage = totalCategorized > 0 ? (growthAssets / totalCategorized) * 100 : 50;
  const defensivePercentage = totalCategorized > 0 ? (defensiveAssets / totalCategorized) * 100 : 50;

  // MoM Comparison (Bulan Ini vs Bulan Lalu)
  const prevSnapshot = snapshots.length > 1 ? snapshots[1] : null;
  const prevWealthDetails = parseWealthNote(prevSnapshot?.note);
  const prevInvestasi = prevSnapshot
    ? (prevWealthDetails.cryptoHoldings.reduce((sum, c) => sum + (c.amount || 0), 0) +
        prevWealthDetails.sahamHoldings.reduce((sum, s) => sum + (s.amount || 0), 0) +
        prevWealthDetails.obligasiHoldings.reduce((sum, o) => sum + (o.amount || 0), 0) +
        prevWealthDetails.reksadanaHoldings.reduce((sum, r) => sum + (r.amount || 0), 0) +
        (prevWealthDetails.emas || 0)) ||
      ((prevSnapshot.cryptoAmount || 0) + (prevSnapshot.mutualFundAmount || 0))
    : 0;

  const diffAmount = prevSnapshot ? displayTotal - prevInvestasi : 0;
  const diffPct = prevInvestasi > 0 ? (diffAmount / prevInvestasi) * 100 : 0;

  const [allocationView, setAllocationView] = useState<'items' | 'category'>('items');

  // Helper color picker for dynamic assets
  const getAssetColor = (name: string, category: string, index: number): string => {
    const lower = name.toLowerCase();
    if (lower.includes('btc') || lower.includes('bitcoin')) return '#f59e0b';
    if (lower.includes('eth') || lower.includes('ethereum')) return '#6366f1';
    if (lower.includes('sol') || lower.includes('solana')) return '#8b5cf6';
    if (lower.includes('usdt') || lower.includes('tether')) return '#14b8a6';
    if (lower.includes('rdpu') || lower.includes('pasar uang')) return '#10b981';
    if (lower.includes('rd saham') || lower.includes('reksa dana saham')) return '#06b6d4';
    if (lower.includes('rdpt') || lower.includes('pendapatan tetap')) return '#0ea5e9';
    if (lower.includes('campuran')) return '#a855f7';
    if (lower.includes('emas') || lower.includes('gold')) return '#eab308';
    if (category === 'Saham') {
      const sahamColors = ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd'];
      return sahamColors[index % sahamColors.length];
    }
    if (category === 'Obligasi') {
      const obligasiColors = ['#14b8a6', '#0d9488', '#2dd4bf', '#047857'];
      return obligasiColors[index % obligasiColors.length];
    }
    const fallbackPalette = [
      '#f59e0b', '#10b981', '#6366f1', '#06b6d4', '#ec4899', 
      '#eab308', '#3b82f6', '#14b8a6', '#8b5cf6', '#f97316'
    ];
    return fallbackPalette[index % fallbackPalette.length];
  };

  // 1. Chart per rincian instrumen individual (BTC, ETH, RDPU, RD Saham, dll)
  const itemsChartData: { name: string; value: number; color: string; category: string }[] = [];

  // A. Kripto
  if (wealthDetails.cryptoHoldings.length > 0) {
    wealthDetails.cryptoHoldings.forEach((c, idx) => {
      if ((c.amount || 0) > 0) {
        itemsChartData.push({
          name: c.name || 'Kripto',
          value: c.amount,
          color: getAssetColor(c.name || 'Kripto', 'Kripto', idx),
          category: 'Kripto',
        });
      }
    });
  } else {
    if ((wealthDetails.btc || 0) > 0) {
      itemsChartData.push({ name: 'Bitcoin (BTC)', value: wealthDetails.btc, color: '#f59e0b', category: 'Kripto' });
    }
    if ((wealthDetails.eth || 0) > 0) {
      itemsChartData.push({ name: 'Ethereum (ETH)', value: wealthDetails.eth, color: '#6366f1', category: 'Kripto' });
    }
    if (itemsChartData.filter(b => b.category === 'Kripto').length === 0 && (latestSnapshot?.cryptoAmount || 0) > 0) {
      itemsChartData.push({ name: 'Kripto', value: latestSnapshot!.cryptoAmount, color: '#f59e0b', category: 'Kripto' });
    }
  }

  // B. Reksa Dana
  if (wealthDetails.reksadanaHoldings.length > 0) {
    wealthDetails.reksadanaHoldings.forEach((r, idx) => {
      if ((r.amount || 0) > 0) {
        itemsChartData.push({
          name: r.name || 'Reksa Dana',
          value: r.amount,
          color: getAssetColor(r.name || 'Reksa Dana', 'Reksa Dana', idx),
          category: 'Reksa Dana',
        });
      }
    });
  } else {
    if ((wealthDetails.rdpu || 0) > 0) {
      itemsChartData.push({ name: 'RDPU (Pasar Uang)', value: wealthDetails.rdpu, color: '#10b981', category: 'Reksa Dana' });
    }
    if ((wealthDetails.rdSaham || 0) > 0) {
      itemsChartData.push({ name: 'RD Saham', value: wealthDetails.rdSaham, color: '#06b6d4', category: 'Reksa Dana' });
    }
    if (itemsChartData.filter(b => b.category === 'Reksa Dana').length === 0 && (latestSnapshot?.mutualFundAmount || 0) > 0) {
      itemsChartData.push({ name: 'Reksa Dana', value: latestSnapshot!.mutualFundAmount, color: '#10b981', category: 'Reksa Dana' });
    }
  }

  // C. Saham
  wealthDetails.sahamHoldings.forEach((s, idx) => {
    if ((s.amount || 0) > 0) {
      itemsChartData.push({
        name: s.name ? `Saham ${s.name.toUpperCase()}` : 'Saham',
        value: s.amount,
        color: getAssetColor(s.name, 'Saham', idx),
        category: 'Saham',
      });
    }
  });

  // D. Obligasi
  wealthDetails.obligasiHoldings.forEach((o, idx) => {
    if ((o.amount || 0) > 0) {
      itemsChartData.push({
        name: o.name || 'Obligasi / SBN',
        value: o.amount,
        color: getAssetColor(o.name, 'Obligasi', idx),
        category: 'Obligasi',
      });
    }
  });

  // E. Emas
  if ((wealthDetails.emas || 0) > 0) {
    itemsChartData.push({
      name: 'Logam Mulia (Emas)',
      value: wealthDetails.emas,
      color: '#eab308',
      category: 'Emas',
    });
  }

  // 2. Chart per Kategori Utama
  const categoryChartData = [
    { name: 'Kripto', value: totalCrypto, color: '#f59e0b', category: 'Kripto' },
    { name: 'Saham', value: totalSaham, color: '#3b82f6', category: 'Saham' },
    { name: 'Obligasi / SBN', value: totalObligasi, color: '#14b8a6', category: 'Obligasi' },
    { name: 'Reksa Dana', value: totalReksa, color: '#10b981', category: 'Reksa Dana' },
    { name: 'Logam Mulia (Emas)', value: totalEmas, color: '#eab308', category: 'Emas' },
  ].filter((d) => d.value > 0);

  // Chart data aktif (default: rincian aset individual agar terlihat RDPU, BTC, ETH, RD Saham, dll)
  const activeChartData = allocationView === 'items' && itemsChartData.length > 0 
    ? itemsChartData 
    : categoryChartData;

  return (
    <PageTransition className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6 min-h-dvh bg-bg dark:bg-bg-dark">
      {/* Header */}
      <div className="glass-header -mx-4 md:-mx-8 lg:-mx-10 px-4 md:px-8 lg:px-10 py-4 -mt-6 mb-6 pt-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <Link
            to="/wealth-center"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow transition-transform active:scale-90"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">Portofolio Investasi</h1>
            <p className="text-[11px] text-text-muted dark:text-text-muted-dark">Rincian Multi-Aset Mandiri</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-surface dark:bg-surface-dark border border-purple/30 px-3 py-1.5 text-xs font-semibold text-purple shadow-xs transition-all active:scale-95 hover:bg-purple/10 cursor-pointer"
            title="Buka Panduan Portofolio"
          >
            <Info size={14} className="text-purple" />
            <span className="hidden sm:inline">Panduan</span>
          </button>

          <button
            onClick={() => setActiveCategoryModal('all')}
            className="flex items-center gap-1.5 rounded-full bg-purple px-3.5 py-1.5 text-xs font-bold text-white shadow-soft transition-transform active:scale-95 cursor-pointer"
          >
            <Plus size={14} /> Update Aset
          </button>
        </div>
      </div>

      {/* Info Callout: Tracker Mandiri (Bukan Tempat Jual-Beli) */}
      <div className="mb-5 flex items-start gap-3 rounded-2xl bg-surface-muted/70 dark:bg-surface-muted-dark/70 p-3.5 border border-border/60 text-xs text-text-muted dark:text-text-muted-dark">
        <Info size={16} className="text-purple shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-text dark:text-white">Pelacak Portofolio Mandiri:</strong> MyWallet adalah tracker untuk memantau perkembangan aset & Net Worth bulanan, <em>bukan platform jual-beli/exchange</em>. Cukup cek saldo di exchange atau sekuritas Anda (Bibit, Ajaib, Indodax, dll), lalu salin nama aset dan nominalnya ke sini.
        </p>
      </div>

      {/* Hero Summary Card dengan Komparasi MoM Terintegrasi */}
      <div className="mb-6 rounded-3xl bg-surface dark:bg-surface-dark p-6 card-shadow border border-border dark:border-border-dark relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-wider">
              Total Portofolio Investasi
            </span>
            <AnimatedCurrency
              value={displayTotal}
              className="block mt-1 font-display text-3xl sm:text-4xl font-black tabular-nums tracking-tight text-purple"
            />
            {/* MoM Performance Badge */}
            {prevSnapshot ? (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    diffAmount >= 0
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {diffAmount >= 0 ? '↑ +' : '↓ '}{formatCurrency(Math.abs(diffAmount))} ({diffAmount >= 0 ? '+' : ''}{diffPct.toFixed(1)}%)
                </div>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">dibanding bulan lalu</span>
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-text-muted dark:text-text-muted-dark">
                Bulan pertama tercatat. Perbandingan tren MoM otomatis aktif bulan berikutnya.
              </p>
            )}
          </div>

          {/* Growth vs Defensive Ratio Bar */}
          <div className="min-w-64 max-w-sm rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-3.5 border border-border dark:border-border-dark">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Zap size={13} /> {growthPercentage.toFixed(0)}% Pertumbuhan
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} /> {defensivePercentage.toFixed(0)}% Defensif
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-border dark:bg-border-dark">
              <div
                style={{ width: `${growthPercentage}%` }}
                className="h-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-1000"
              />
              <div
                style={{ width: `${defensivePercentage}%` }}
                className="h-full bg-linear-to-r from-teal-500 to-emerald-500 transition-all duration-1000"
              />
            </div>
            <div className="flex justify-between text-[10px] text-text-muted dark:text-text-muted-dark mt-1.5 font-medium">
              <span>{formatCurrency(growthAssets)}</span>
              <span>{formatCurrency(defensiveAssets)}</span>
            </div>
          </div>
        </div>

        {/* Donut Chart Distribution */}
        {activeChartData.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border dark:border-border-dark">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <span className="text-xs font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-wider">
                Alokasi Portofolio ({activeChartData.length} {allocationView === 'items' ? 'Aset Rincian' : 'Kategori'})
              </span>
              <div className="inline-flex self-start sm:self-auto items-center bg-surface-muted dark:bg-surface-muted-dark rounded-xl p-1 border border-border/60">
                <button
                  onClick={() => setAllocationView('items')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    allocationView === 'items'
                      ? 'bg-surface dark:bg-surface-dark text-purple shadow-xs'
                      : 'text-text-muted dark:text-text-muted-dark hover:text-purple dark:hover:text-white'
                  }`}
                >
                  Rincian Aset (Pecah)
                </button>
                <button
                  onClick={() => setAllocationView('category')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    allocationView === 'category'
                      ? 'bg-surface dark:bg-surface-dark text-purple shadow-xs'
                      : 'text-text-muted dark:text-text-muted-dark hover:text-purple dark:hover:text-white'
                  }`}
                >
                  Kategori Utama
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-52 w-full relative flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
                  <span className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">
                    Alokasi
                  </span>
                  <span className={`font-display font-bold tabular-nums leading-tight mt-0.5 max-w-[130px] truncate ${
                    formatCurrency(displayTotal).length > 14
                      ? 'text-xs'
                      : formatCurrency(displayTotal).length > 11
                      ? 'text-sm'
                      : formatCurrency(displayTotal).length > 9
                      ? 'text-base'
                      : 'text-lg'
                  }`}>
                    {formatCurrency(displayTotal)}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={88}
                      cornerRadius={6}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {activeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          style={{ filter: `drop-shadow(0px 3px 5px ${entry.color}40)` }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      formatter={(val: any) => formatCurrency(val)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Cardless Sleek Legend List (Minimalis & Bebas Card Tebal) */}
              <div className="flex flex-col divide-y divide-border/30 dark:divide-border-dark/40 max-h-56 overflow-y-auto pr-1">
                {activeChartData.map((item, idx) => {
                  const pct = displayTotal > 0 ? (item.value / displayTotal) * 100 : 0;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-1.5 hover:bg-surface-muted/50 dark:hover:bg-surface-muted-dark/50 rounded-lg transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-offset-1 ring-offset-surface dark:ring-offset-surface-dark"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="truncate">
                          <p className="font-semibold text-text dark:text-white truncate" title={item.name}>
                            {item.name}
                          </p>
                          <span className="text-[10px] text-text-muted dark:text-text-muted-dark tabular-nums">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className="font-bold tabular-nums text-text dark:text-white text-xs">
                          {pct.toFixed(pct < 10 && pct > 0 ? 1 : 0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Single Smart Risk Profile Card (Ala Bibit) */}
      {displayTotal > 0 && (() => {
        const isAgresif = growthPercentage >= 65;
        const isModerat = growthPercentage >= 35 && growthPercentage < 65;
        const profileBadge = isAgresif
          ? { label: '⚡ Investor Agresif', color: 'bg-purple/10 text-purple border-purple/30', score: 'Skor 8/10' }
          : isModerat
          ? { label: '🛡️ Investor Moderat', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30', score: 'Skor 5/10' }
          : { label: '🌿 Investor Konservatif', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30', score: 'Skor 3/10' };

        const adviceText = isAgresif
          ? 'Portofolio Anda didominasi instrumen pertumbuhan tinggi. Sangat prima untuk akumulasi imbal hasil jangka panjang, dengan tetap menyiapkan dana darurat likuid.'
          : isModerat
          ? 'Komposisi aset Anda berimbang ideal antara pertumbuhan modal dan perlindungan nilai. Fluktuasi terkontrol untuk tujuan jangka menengah.'
          : 'Portofolio Anda mengutamakan keamanan dan stabilitas modal terhadap gejolak pasar. Sangat tenang dengan risiko fluktuasi minimal.';

        const cryptoPct = (totalCrypto / displayTotal) * 100;
        const sahamPct = (totalSaham / displayTotal) * 100;
        const obligasiPct = (totalObligasi / displayTotal) * 100;
        const reksaPct = (totalReksa / displayTotal) * 100;
        const emasPct = (totalEmas / displayTotal) * 100;

        return (
          <div className="mb-6 rounded-3xl bg-surface dark:bg-surface-dark p-5 sm:p-6 card-shadow border border-border dark:border-border-dark flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple/10 text-purple shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-text dark:text-white">
                    Profil Risiko & Alokasi Portofolio
                  </h3>
                  <p className="text-[11px] text-text-muted dark:text-text-muted-dark">
                    Analisis Komposisi Aset ala Bibit
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${profileBadge.color}`}>
                  {profileBadge.label}
                </span>
                <span className="text-[11px] font-semibold text-text-muted dark:text-text-muted-dark">
                  ({profileBadge.score})
                </span>
              </div>
            </div>

            {/* Single Multi-Color Allocation Bar */}
            <div className="flex flex-col gap-2">
              <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-border/40 dark:bg-border-dark/60 shadow-inner">
                {cryptoPct > 0 && (
                  <div style={{ width: `${cryptoPct}%` }} className="h-full bg-amber-500 transition-all duration-700" title={`Kripto: ${cryptoPct.toFixed(1)}%`} />
                )}
                {sahamPct > 0 && (
                  <div style={{ width: `${sahamPct}%` }} className="h-full bg-blue transition-all duration-700" title={`Saham: ${sahamPct.toFixed(1)}%`} />
                )}
                {obligasiPct > 0 && (
                  <div style={{ width: `${obligasiPct}%` }} className="h-full bg-teal-500 transition-all duration-700" title={`Obligasi: ${obligasiPct.toFixed(1)}%`} />
                )}
                {reksaPct > 0 && (
                  <div style={{ width: `${reksaPct}%` }} className="h-full bg-cyan-500 transition-all duration-700" title={`Reksa Dana: ${reksaPct.toFixed(1)}%`} />
                )}
                {emasPct > 0 && (
                  <div style={{ width: `${emasPct}%` }} className="h-full bg-yellow-400 transition-all duration-700" title={`Emas: ${emasPct.toFixed(1)}%`} />
                )}
              </div>

              {/* Cardless Summary Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs">
                {totalCrypto > 0 && (
                  <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
                    <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Kripto</span>
                    <strong className="text-text dark:text-white tabular-nums">{cryptoPct.toFixed(0)}%</strong>
                  </div>
                )}
                {totalSaham > 0 && (
                  <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
                    <span className="h-2 w-2 rounded-full bg-blue shrink-0" />
                    <span>Saham</span>
                    <strong className="text-text dark:text-white tabular-nums">{sahamPct.toFixed(0)}%</strong>
                  </div>
                )}
                {totalObligasi > 0 && (
                  <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
                    <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0" />
                    <span>Obligasi</span>
                    <strong className="text-text dark:text-white tabular-nums">{obligasiPct.toFixed(0)}%</strong>
                  </div>
                )}
                {totalReksa > 0 && (
                  <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                    <span>Reksa Dana</span>
                    <strong className="text-text dark:text-white tabular-nums">{reksaPct.toFixed(0)}%</strong>
                  </div>
                )}
                {totalEmas > 0 && (
                  <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
                    <span className="h-2 w-2 rounded-full bg-yellow-400 shrink-0" />
                    <span>Emas</span>
                    <strong className="text-text dark:text-white tabular-nums">{emasPct.toFixed(0)}%</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Non-Judgmental Financial Advice */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-surface-muted/60 dark:bg-surface-muted-dark/60 p-3 border border-border/50 text-xs">
              <Sparkles size={16} className="text-purple shrink-0 mt-0.5" />
              <p className="text-[11px] text-text-muted dark:text-text-muted-dark leading-relaxed">
                <strong className="text-text dark:text-white">Saran Portofolio:</strong> {adviceText}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Grid of Asset Instrument Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* 1. Kripto Card */}
        <div className="rounded-3xl bg-surface dark:bg-surface-dark p-5 card-shadow border border-border dark:border-border-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Coins size={20} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold">Kripto (Crypto)</h3>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    Aset Pertumbuhan
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {formatCurrency(totalCrypto)}
              </span>
            </div>

            {wealthDetails.cryptoHoldings.length > 0 ? (
              <div className="flex flex-col divide-y divide-border/30 dark:divide-border-dark/40 mt-3 max-h-56 overflow-y-auto pr-1">
                {wealthDetails.cryptoHoldings.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between py-2.5 px-1 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="font-bold uppercase tracking-wider text-text dark:text-white">
                        {coin.name}
                      </span>
                      {totalCrypto > 0 && (
                        <span className="text-[10px] text-text-muted dark:text-text-muted-dark">
                          ({((coin.amount / totalCrypto) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                    <span className="font-bold tabular-nums text-text dark:text-white">
                      {formatCurrency(coin.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted dark:text-text-muted-dark py-6 text-center italic">
                Belum ada koin kripto yang dicatat.
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveCategoryModal('crypto')}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Tambah / Edit Koin
          </button>
        </div>

        {/* 2. Saham Card */}
        <div className="rounded-3xl bg-surface dark:bg-surface-dark p-5 card-shadow border border-border dark:border-border-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold">Saham Individual</h3>
                  <span className="text-[10px] font-semibold text-blue">
                    Aset Pertumbuhan
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue/10 text-blue border border-blue/20">
                {formatCurrency(totalSaham)}
              </span>
            </div>

            {wealthDetails.sahamHoldings.length > 0 ? (
              <div className="flex flex-col divide-y divide-border/30 dark:divide-border-dark/40 mt-3 max-h-56 overflow-y-auto pr-1">
                {wealthDetails.sahamHoldings.map((saham) => (
                  <div
                    key={saham.id}
                    className="flex items-center justify-between py-2.5 px-1 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue shrink-0" />
                      <span className="font-bold uppercase tracking-wider text-text dark:text-white">
                        {saham.name}
                      </span>
                      {totalSaham > 0 && (
                        <span className="text-[10px] text-text-muted dark:text-text-muted-dark">
                          ({((saham.amount / totalSaham) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                    <span className="font-bold tabular-nums text-text dark:text-white">
                      {formatCurrency(saham.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted dark:text-text-muted-dark py-6 text-center italic">
                Belum ada saham individual yang dicatat.
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveCategoryModal('saham')}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl border border-dashed border-blue/30 bg-blue/5 py-2 text-xs font-bold text-blue hover:bg-blue/10 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Tambah / Edit Saham
          </button>
        </div>

        {/* 3. Obligasi / SBN Card */}
        <div className="rounded-3xl bg-surface dark:bg-surface-dark p-5 card-shadow border border-border dark:border-border-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold">Obligasi / SBN (Bonds)</h3>
                  <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                    Aset Defensif & Kupon
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                {formatCurrency(totalObligasi)}
              </span>
            </div>

            {wealthDetails.obligasiHoldings.length > 0 ? (
              <div className="flex flex-col divide-y divide-border/30 dark:divide-border-dark/40 mt-3 max-h-56 overflow-y-auto pr-1">
                {wealthDetails.obligasiHoldings.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2.5 px-1 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span className="font-bold uppercase tracking-wider text-text dark:text-white">
                        {item.name}
                      </span>
                      {totalObligasi > 0 && (
                        <span className="text-[10px] text-text-muted dark:text-text-muted-dark">
                          ({((item.amount / totalObligasi) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                    <span className="font-bold tabular-nums text-text dark:text-white">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted dark:text-text-muted-dark py-6 text-center italic">
                Belum ada obligasi / SBN yang dicatat.
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveCategoryModal('obligasi')}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl border border-dashed border-teal-500/30 bg-teal-500/5 py-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Tambah / Edit Obligasi
          </button>
        </div>

        {/* 4. Reksa Dana Card (Dinamis Multi-Produk) */}
        <div className="rounded-3xl bg-surface dark:bg-surface-dark p-5 card-shadow border border-border dark:border-border-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <PieChartIcon size={20} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold">Reksa Dana</h3>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Multi-Produk Pasar Uang & Saham
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {formatCurrency(totalReksa)}
              </span>
            </div>

            {wealthDetails.reksadanaHoldings.length > 0 ? (
              <div className="flex flex-col divide-y divide-border/30 dark:divide-border-dark/40 mt-3 max-h-56 overflow-y-auto pr-1">
                {wealthDetails.reksadanaHoldings.map((reksa) => {
                  const lower = reksa.name.toLowerCase();
                  const isDef = lower.includes('pasar uang') || lower.includes('rdpu') || lower.includes('pendapatan tetap') || lower.includes('rdpt');
                  return (
                    <div
                      key={reksa.id}
                      className="flex items-center justify-between py-2.5 px-1 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <div>
                          <span className="font-bold text-text dark:text-white">
                            {reksa.name}
                          </span>
                          <span className={`ml-2 text-[10px] ${isDef ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue'}`}>
                            {isDef ? '🛡️ Defensif' : '📈 Pertumbuhan'}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold tabular-nums text-text dark:text-white">
                        {formatCurrency(reksa.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-text-muted dark:text-text-muted-dark py-6 text-center italic">
                Belum ada produk reksadana yang dicatat.
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveCategoryModal('reksadana')}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Tambah / Edit Reksa Dana
          </button>
        </div>

        {/* 5. Emas / Logam Mulia Card */}
        <div className="rounded-3xl bg-surface dark:bg-surface-dark p-5 card-shadow border border-border dark:border-border-dark flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-500 text-lg">
                  🪙
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold">Logam Mulia (Emas)</h3>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-300">
                    Safe Haven & Perlindungan Inflasi
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-600 dark:text-amber-300 border border-amber-400/20">
                {formatCurrency(totalEmas)}
              </span>
            </div>

            <div className="py-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-y border-border/30 dark:border-border-dark/40">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text dark:text-white">Saldo Kepemilikan Emas</p>
                  {wealthDetails.emasDetails?.type === 'fisik' && wealthDetails.emasDetails.weightGram ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[10px] border border-amber-500/25">
                      🪙 {wealthDetails.emasDetails.weightGram} gram Fisik
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-purple/10 text-purple font-bold text-[10px]">
                      Digital
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted dark:text-text-muted-dark mt-0.5">
                  {wealthDetails.emasDetails?.type === 'fisik' && wealthDetails.emasDetails.weightGram
                    ? `Estimasi nilai pasar @ ${formatCurrency(wealthDetails.emasDetails.pricePerGram || 2450000)}/gr Antam/UBS.`
                    : 'Komoditas penyimpan nilai jangka panjang dan perlindungan terhadap volatilitas pasar.'}
                </p>
              </div>
              <span className="font-display text-lg font-bold tabular-nums text-text dark:text-white">
                {formatCurrency(totalEmas)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveCategoryModal('emas')}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl border border-dashed border-amber-400/30 bg-amber-400/5 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Update Saldo Emas
          </button>
        </div>
      </div>

      {/* Modal Dialog Onboarding Interaktif (Next-by-Next Slides) */}
      <InvestmentOnboardingModal
        isOpen={showOnboardingModal}
        onClose={handleCompleteOnboarding}
        canCloseDirectly={hasSeenOnboarding}
      />

      {/* Modular Snapshot Sheet Modal */}
      <AddSnapshotSheet
        open={activeCategoryModal !== null}
        onClose={() => setActiveCategoryModal(null)}
        initialCategory={activeCategoryModal || 'all'}
      />
    </PageTransition>
  );
}
