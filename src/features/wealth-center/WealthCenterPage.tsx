import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, ShieldCheck, Trophy, Sparkles, Plus, Settings2, Wallet, TrendingUp, Quote, ChevronRight } from 'lucide-react';
import { useWealthStore, parseWealthNote } from '../../stores/wealthStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAccountStore, activeAccounts } from '../../stores/accountStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatCurrency } from '../../lib/formatters';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { AddSnapshotSheet } from './AddSnapshotSheet';
import { EditTargetsSheet } from './EditTargetsSheet';
import { Mascot } from '../../components/Mascot';
import { Skeleton } from '../../components/Skeleton';
import { AnimatedCurrency } from '../../components/AnimatedCurrency';
import { useHealthScore } from './useHealthScore';
import { HealthScoreSheet } from './HealthScoreSheet';
import { PageTransition } from '../../components/PageTransition';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Tampilkan entri yang memiliki nilai > 0 atau Net Worth utama
    const activeEntries = payload.filter((entry: any) => entry.value > 0 || entry.dataKey === 'netWorth');
    return (
      <div className="rounded-xl bg-surface dark:bg-surface-dark p-3 shadow-xl ring-1 ring-border dark:ring-border-dark min-w-37.5">
        <p className="mb-2 text-xs font-bold text-text-muted dark:text-text-muted-dark">{label}</p>
        <div className="flex flex-col gap-1.5">
          {activeEntries.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-text-muted dark:text-text-muted-dark">{entry.name}</span>
              </div>
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function WealthCenterPage() {
  const snapshots = useWealthStore((s) => s.snapshots);
  const loadingWealth = useWealthStore((s) => s.loading);
  const accountsLoading = useAccountStore((s) => s.loading);
  const transactionsLoading = useTransactionStore((s) => s.loading);
  const loading = loadingWealth || accountsLoading || transactionsLoading;

  const settings = useSettingsStore((s) => s.settings);
  const accounts = useAccountStore((s) => s.accounts);
  const transactions = useTransactionStore((s) => s.transactions);
  
  const [showAddSnapshot, setShowAddSnapshot] = useState(false);
  const [showEditTargets, setShowEditTargets] = useState(false);
  const [showHealthScore, setShowHealthScore] = useState(false);
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');

  const healthScore = useHealthScore();

  const financialQuote = useMemo(() => {
    const quotes: Record<string, string[]> = {
      'Sangat Sehat': [
        "Konsistensi hari ini adalah kebebasan finansial di masa depan. Pertahankan, Boss!",
        "Luar biasa! Fondasi keuanganmu sekuat beton. Waktunya fokus memupuk kekayaan.",
        "Kerja bagus! Uangmu sekarang bekerja lebih keras untukmu."
      ],
      'Waspada': [
        "Perjalanan masih panjang. Sedikit penyesuaian arus kas akan membuat perbedaan besar.",
        "Kesehatan finansial sedang goyah. Mari evaluasi kembali pengeluaran bulan ini.",
        "Tetap semangat! Langkah kecil menuju penghematan adalah investasi terbaik saat ini."
      ],
      'Kritis': [
        "Badai pasti berlalu. Fokus pada Dana Darurat dan kurangi pengeluaran yang tidak perlu.",
        "Jangan panik. Mari perbaiki pelan-pelan mulai dari melacak setiap sen pengeluaranmu.",
        "Kondisi kritis adalah sinyal untuk bangkit. Yuk, perketat sabuk pengaman keuanganmu!"
      ]
    };
    
    const list = quotes[healthScore.status] || quotes['Sangat Sehat'];
    // Gunakan tanggal hari ini (hari dalam setahun) agar tidak berkedip setiap render
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    
    return list[dayOfYear % list.length];
  }, [healthScore.status]);

  // Active accounts total (Cash + Bank + E-Wallet)
  const active = activeAccounts(accounts);
  const currentCash = active.reduce((sum, a) => sum + (a.balance || 0), 0);

  // Latest Snapshot
  const latestSnapshot = snapshots.length > 0 ? snapshots[0] : null;
  const currentCrypto = latestSnapshot?.cryptoAmount || 0;
  const currentMutualFund = latestSnapshot?.mutualFundAmount || 0;

  const wealthDetails = parseWealthNote(latestSnapshot?.note);
  
  // Calculate subtotals from dynamic holdings
  const totalCrypto = wealthDetails.cryptoHoldings.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalSaham = wealthDetails.sahamHoldings.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalObligasi = wealthDetails.obligasiHoldings.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalReksaHoldings = wealthDetails.reksadanaHoldings?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;
  const totalRdpu = wealthDetails.rdpu || 0;
  const totalRdSaham = wealthDetails.rdSaham || 0;
  const totalReksa = totalReksaHoldings > 0 ? totalReksaHoldings : (totalRdpu + totalRdSaham);
  const totalEmas = wealthDetails.emas || 0;

  // Active amounts (combining dynamic or fallback legacy snapshot)
  const activeCrypto = totalCrypto > 0 ? totalCrypto : currentCrypto;
  const activeReksa = totalReksa > 0 ? totalReksa : currentMutualFund;

  // Total Investasi
  const dynamicInvestments = totalCrypto + totalSaham + totalObligasi + totalReksa + totalEmas;
  const isLegacy = dynamicInvestments === 0 && (currentCrypto > 0 || currentMutualFund > 0);
  const currentInvestments = isLegacy ? (currentCrypto + currentMutualFund) : dynamicInvestments;
  const currentNetWorth = currentCash + currentInvestments;

  // Aset Pertumbuhan (Growth Assets): Kripto + Saham + RD Saham
  const asetPertumbuhan = isLegacy 
    ? (currentCrypto + (wealthDetails.rdSaham || 0)) 
    : (totalCrypto + totalSaham + totalRdSaham);

  // Aset Defensif & Stabilitas (Defensive Assets): Kas & Bank + RDPU + Obligasi + Emas
  const asetDefensif = isLegacy
    ? (currentCash + (wealthDetails.rdpu || currentMutualFund))
    : (currentCash + totalRdpu + totalObligasi + totalEmas);

  const totalRiskAssets = asetDefensif + asetPertumbuhan;
  const riskRatio = totalRiskAssets > 0 ? (asetPertumbuhan / totalRiskAssets) * 100 : 0;
  const isAggressive = riskRatio > 60;
  const isSafe = riskRatio < 50;

  const chartTotal = currentNetWorth;

  const chartDataAll = isLegacy ? [
    { name: 'Kas & Bank', value: currentCash, color: '#10b981' },
    { name: 'RDPU', value: currentMutualFund, color: '#14b8a6' },
    { name: 'Kripto', value: currentCrypto, color: '#f59e0b' },
  ] : [
    { name: 'Kas & Bank', value: currentCash, color: '#10b981' },
    { name: 'Kripto', value: totalCrypto, color: '#f59e0b' },
    { name: 'Saham', value: totalSaham, color: '#3b82f6' },
    { name: 'Obligasi / SBN', value: totalObligasi, color: '#14b8a6' },
    { name: 'Reksa Dana', value: totalReksa, color: '#10b981' },
    { name: 'Emas', value: totalEmas, color: '#eab308' },
  ];
  const pieChartData = chartDataAll.filter(d => d.value > 0);

  const legendAll = isLegacy ? [
    { name: 'Kas & Bank', value: currentCash, color: 'bg-emerald-500' },
    { name: 'RDPU (Defensif)', value: currentMutualFund, color: 'bg-teal-500' },
    { name: 'Kripto (Pertumbuhan)', value: currentCrypto, color: 'bg-amber-500' },
  ] : [
    { name: 'Kas & Bank', value: currentCash, color: 'bg-emerald-500' },
    { name: 'Kripto', value: totalCrypto, color: 'bg-amber-500' },
    { name: 'Saham', value: totalSaham, color: 'bg-blue-500' },
    { name: 'Obligasi / SBN', value: totalObligasi, color: 'bg-teal-500' },
    { name: 'Reksa Dana', value: totalReksa, color: 'bg-emerald-500' },
    { name: 'Emas', value: totalEmas, color: 'bg-yellow-500' },
  ];
  const legendData = legendAll.filter(d => d.value > 0);

  const allocationInsight = useMemo(() => {
    if (chartTotal === 0) return null;
    
    const riskPercentage = (asetPertumbuhan / chartTotal) * 100;
    
    if (riskPercentage > 60) {
      return {
        text: "Porsi Aset Pertumbuhan (saham & kripto) cukup dominan. Potensi hasil tinggi jangka panjang, namun waspadai fluktuasi pasar! 🎢",
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/20"
      };
    } else if (riskPercentage < 20) {
      return {
        text: "Portofolio sangat aman & defensif. Fondasi sangat stabil saat gejolak pasar, dengan pertumbuhan kekayaan bertahap. 🛡️",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20"
      };
    } else {
      return {
        text: "Keseimbangan portofolio sangat ideal (Moderat). Kokoh bertahan saat krisis, namun tetap bertumbuh optimal saat pasar naik! ⚖️",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20"
      };
    }
  }, [chartTotal, asetPertumbuhan]);

  // Calculate daily historical net worth for chart
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // Determine diffDays based on timeRange
    let diffDays = 30;
    if (timeRange === '1W') diffDays = 7;
    else if (timeRange === '1M') diffDays = 30;
    else if (timeRange === '3M') diffDays = 90;
    else if (timeRange === '1Y') diffDays = 365;
    else if (timeRange === 'ALL') {
      const earliestTx = transactions.length > 0 ? new Date(transactions[transactions.length - 1].date) : today;
      const sortedSnapsAsc = [...snapshots].sort((a, b) => a.month.localeCompare(b.month));
      const earliestSnap = sortedSnapsAsc.length > 0 ? new Date(sortedSnapsAsc[0].month + '-01') : today;
      const minTime = Math.min(earliestTx.getTime(), earliestSnap.getTime());
      diffDays = Math.max(7, Math.ceil((today.getTime() - minTime) / (1000 * 60 * 60 * 24)));
    }
    
    const activeIds = new Set(active.map(a => a.id));

    // Sort snapshots descending so we can easily find the latest snapshot for a given date
    const sortedSnaps = [...snapshots].sort((a, b) => b.month.localeCompare(a.month));

    // Calculate daily net change map once O(M)
    const dailyNetChange = new Map<string, number>();
    for (const t of transactions) {
      const localDate = new Date(t.date);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const dStr = `${year}-${month}-${day}`;

      let change = 0;
      if (t.type === 'income' && activeIds.has(t.accountId)) change += (t.amount || 0);
      else if (t.type === 'expense' && activeIds.has(t.accountId)) change -= (t.amount || 0);
      else if (t.type === 'transfer') {
        if (activeIds.has(t.accountId)) change -= (t.amount || 0);
        if (t.toAccountId && activeIds.has(t.toAccountId)) change += (t.amount || 0);
      }
      if (change !== 0) {
        dailyNetChange.set(dStr, (dailyNetChange.get(dStr) || 0) + change);
      }
    }

    let runningCash = currentCash;

    for (let i = 0; i < diffDays; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const targetMonthStr = `${year}-${month}`;
      const dStr = `${year}-${month}-${day}`;

      const applicableSnap = sortedSnaps.find(s => s.month <= targetMonthStr);
      let crypto = 0;
      let saham = 0;
      let obligasi = 0;
      let reksadana = 0;
      let emas = 0;

      if (applicableSnap) {
        const details = parseWealthNote(applicableSnap.note);
        crypto = details.cryptoHoldings.reduce((sum, c) => sum + (c.amount || 0), 0) || (applicableSnap.cryptoAmount || 0);
        saham = details.sahamHoldings.reduce((sum, s) => sum + (s.amount || 0), 0);
        obligasi = details.obligasiHoldings.reduce((sum, o) => sum + (o.amount || 0), 0);
        
        const rdFromHoldings = details.reksadanaHoldings?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;
        const rdFromLegacyDetail = (details.rdpu || 0) + (details.rdSaham || 0);
        reksadana = rdFromHoldings || rdFromLegacyDetail || (applicableSnap.mutualFundAmount || 0);

        emas = details.emas || 0;
      }

      const totalInvestasi = crypto + saham + obligasi + reksadana + emas;
      const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      data.unshift({
        label,
        netWorth: runningCash + totalInvestasi,
        crypto,
        saham,
        obligasi,
        reksadana,
        emas,
        totalInvestasi,
      });

      // Prepare for the previous day by subtracting today's net change
      const todaysChange = dailyNetChange.get(dStr) || 0;
      runningCash -= todaysChange;
    }

    return data;
  }, [snapshots, active, transactions, timeRange, currentCash]);

  // Deteksi apakah pengguna berinvestasi di aset terkait (HANYA tampil di grafik jika ada investasi)
  const hasCrypto = activeCrypto > 0 || chartData.some(d => (d.crypto || 0) > 0);
  const hasSaham = totalSaham > 0 || chartData.some(d => (d.saham || 0) > 0);
  const hasObligasi = totalObligasi > 0 || chartData.some(d => (d.obligasi || 0) > 0);
  const hasReksa = activeReksa > 0 || chartData.some(d => (d.reksadana || 0) > 0);
  const hasEmas = totalEmas > 0 || chartData.some(d => (d.emas || 0) > 0);

  // Insights compare Current (Today) vs 30 Days Ago (chartData[0])
  const baselineNetWorth = chartData.length > 0 ? (chartData[0].netWorth || 0) : 0;
  const netWorthChange = (currentNetWorth || 0) - baselineNetWorth;
  const baselineCrypto = chartData.length > 0 ? (chartData[0].crypto || 0) : 0;
  const cryptoChange = (activeCrypto || 0) - baselineCrypto;
  const baselineReksa = chartData.length > 0 ? (chartData[0].reksadana || 0) : 0;
  const reksaChange = (activeReksa || 0) - baselineReksa;
  const baselineSaham = chartData.length > 0 ? (chartData[0].saham || 0) : 0;
  const sahamChange = (totalSaham || 0) - baselineSaham;
  const baselineObligasi = chartData.length > 0 ? (chartData[0].obligasi || 0) : 0;
  const obligasiChange = (totalObligasi || 0) - baselineObligasi;
  const baselineEmas = chartData.length > 0 ? (chartData[0].emas || 0) : 0;
  const emasChange = (totalEmas || 0) - baselineEmas;

  // Wealth Target
  const wealthTarget = settings?.wealthTarget || 5000000;
  const wealthProgress = Math.min((currentNetWorth / wealthTarget) * 100, 100);
  const wealthRemaining = Math.max(wealthTarget - currentNetWorth, 0);

  // Emergency Fund
  const emergencyTarget = settings?.emergencyFundTarget || 0;
  const emergencyBalance = settings?.emergencyFundBalance || 0;
  const emergencyProgress = emergencyTarget > 0 ? Math.min((emergencyBalance / emergencyTarget) * 100, 100) : 0;
  const emergencyRemaining = emergencyTarget > 0 ? Math.max(emergencyTarget - emergencyBalance, 0) : 0;

  // Generate dynamic label for insights
  const insightLabel = timeRange === '1W' ? '1 Minggu Terakhir' 
                     : timeRange === '1M' ? '1 Bulan Terakhir'
                     : timeRange === '3M' ? '3 Bulan Terakhir'
                     : timeRange === '1Y' ? '1 Tahun Terakhir'
                     : 'Sepanjang Waktu';

  return (
    <PageTransition className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6 min-h-dvh bg-bg dark:bg-bg-dark">
      {/* Header */}
      <div className="glass-header -mx-4 md:-mx-8 lg:-mx-10 px-4 md:px-8 lg:px-10 py-4 -mt-6 mb-6 pt-6 flex items-center justify-between z-50">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow transition-transform active:scale-90">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-lg font-bold">Wealth Center</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEditTargets(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow text-text-muted dark:text-text-muted-dark transition-transform active:scale-90">
            <Settings2 size={20} />
          </button>
          <Link to="/wealth-center/achievements" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow text-amber-500 transition-transform active:scale-90">
            <Trophy size={20} />
          </Link>
        </div>
      </div>

      {snapshots.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <Mascot mood="idle" size={120} />
          <h2 className="mt-6 font-display text-xl font-bold">Belum ada data investasi.</h2>
          <p className="mt-2 text-sm text-text-muted dark:text-text-muted-dark max-w-70">
            Simpan Snapshot Bulanan pertama untuk mulai melihat perkembangan kekayaan Anda.
          </p>
          <button
            onClick={() => setShowAddSnapshot(true)}
            className="mt-8 flex items-center justify-center rounded-xl bg-purple px-6 py-3.5 font-semibold text-white shadow-soft transition-transform active:scale-95"
          >
            Buat Snapshot Pertama
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-2xl bg-surface dark:bg-surface-dark p-4 card-shadow border border-border dark:border-border-dark relative overflow-hidden flex flex-col justify-between h-27.5">
              <div className="absolute -top-2 -right-2 p-3 opacity-10 pointer-events-none">
                <Wallet size={64} />
              </div>
              <p className="text-xs font-bold text-text-muted dark:text-text-muted-dark z-10">Uang Kas & Bank</p>
              <div className="z-10 mt-auto">
                <AnimatedCurrency value={currentCash} className="font-display text-lg font-bold tabular-nums tracking-tight" />
                <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-0.5">Saldo aktif dipakai</p>
              </div>
            </div>
            <Link
              to="/wealth-center/investasi"
              className="rounded-2xl bg-surface dark:bg-surface-dark p-4 card-shadow border border-purple/30 hover:border-purple/60 relative overflow-hidden flex flex-col justify-between h-27.5 transition-all group active:scale-95"
            >
              <div className="absolute -top-2 -right-2 p-3 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                <TrendingUp size={64} />
              </div>
              <div className="flex items-center justify-between z-10">
                <p className="text-xs font-bold text-text-muted dark:text-text-muted-dark">Total Investasi</p>
                <ChevronRight size={14} className="text-purple group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="z-10 mt-auto">
                <AnimatedCurrency value={currentInvestments} className="font-display text-lg font-bold tabular-nums tracking-tight text-purple" />
                <p className="text-[10px] text-purple font-medium mt-0.5">Buka Portofolio →</p>
              </div>
            </Link>
          </div>

          {/* Banner Menuju Dashboard Khusus Investasi */}
          <Link
            to="/wealth-center/investasi"
            className="mb-6 block rounded-3xl bg-linear-to-r from-purple/15 via-blue/15 to-purple/5 p-4.5 card-shadow border border-purple/20 transition-all duration-300 hover:border-purple/40 active:scale-[0.99] group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple text-white shadow-soft group-hover:scale-105 transition-transform">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold text-text dark:text-white">
                      Portofolio Investasi & Rincian Aset
                    </h3>
                    <span className="rounded-full bg-purple/15 px-2 py-0.5 text-[10px] font-bold text-purple">
                      Dashboard
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark line-clamp-1">
                    Kelola koin kripto, emiten saham, obligasi, dan emasmu.
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-text-muted dark:text-text-muted-dark group-hover:text-purple group-hover:translate-x-0.5 transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
          </Link>

          {/* Main Net Worth Card & Graph */}
          <div className="mb-6 rounded-3xl bg-surface dark:bg-surface-dark p-6 card-shadow border border-border dark:border-border-dark">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                📈 Kinerja Portofolio
              </h2>
              <button 
                onClick={() => setShowAddSnapshot(true)}
                className="flex items-center gap-1.5 rounded-full bg-purple/10 px-3 py-1.5 text-xs font-semibold text-purple transition-colors active:bg-purple/20"
              >
                <Plus size={14} /> Update
              </button>
            </div>

            {loading ? (
              <div className="mb-6">
                <Skeleton variant="text" className="h-4 w-40 mb-2" />
                <Skeleton variant="text" className="h-9 w-48 mb-2" />
                <Skeleton variant="text" className="h-5 w-32" />
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm font-medium text-text-muted dark:text-text-muted-dark">Total Net Worth Saat Ini</p>
                <AnimatedCurrency value={currentNetWorth} className="block mt-1 font-display text-3xl font-bold tabular-nums tracking-tight" />
                {chartData.length > 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${netWorthChange >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                      {netWorthChange >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(netWorthChange))}
                    </div>
                    <span className="text-xs text-text-muted dark:text-text-muted-dark">dalam {insightLabel.toLowerCase()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Time Range Tabs */}
            <div className="mb-4 flex items-center justify-between rounded-full bg-surface-muted dark:bg-surface-muted-dark p-1">
              {['1W', '1M', '3M', '1Y', 'ALL'].map((tr) => (
                <button
                  key={tr}
                  onClick={() => setTimeRange(tr as any)}
                  className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${
                    timeRange === tr
                      ? 'bg-purple text-white shadow-sm'
                      : 'text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-white'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>

            {/* Wealth Insight Graph */}
            <div className="h-64 w-full overflow-hidden">
              {loading ? (
                <Skeleton variant="rectangular" className="h-full w-full opacity-50" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorReksa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSaham" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorObligasi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorEmas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" strokeOpacity={0.7} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} tickMargin={12} minTickGap={20} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                    
                    {/* Kurva Net Worth Utama */}
                    <Area type="monotone" dataKey="netWorth" name="Net Worth" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorNetWorth)" activeDot={{ r: 6, fill: "#8b5cf6", stroke: "var(--color-surface)", strokeWidth: 2 }} />

                    {/* Kurva Aset yang HANYA tampil jika pengguna menginputkan aset tersebut (bertambah dinamis di grafik Net Worth tanpa toggle) */}
                    {hasReksa && (
                      <Area type="monotone" dataKey="reksadana" name="Reksa Dana" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReksa)" activeDot={{ r: 5, fill: "#10b981", stroke: "var(--color-surface)", strokeWidth: 2 }} />
                    )}
                    {hasSaham && (
                      <Area type="monotone" dataKey="saham" name="Saham" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSaham)" activeDot={{ r: 5, fill: "#3b82f6", stroke: "var(--color-surface)", strokeWidth: 2 }} />
                    )}
                    {hasObligasi && (
                      <Area type="monotone" dataKey="obligasi" name="Obligasi" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorObligasi)" activeDot={{ r: 5, fill: "#14b8a6", stroke: "var(--color-surface)", strokeWidth: 2 }} />
                    )}
                    {hasEmas && (
                      <Area type="monotone" dataKey="emas" name="Emas" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorEmas)" activeDot={{ r: 5, fill: "#eab308", stroke: "var(--color-surface)", strokeWidth: 2 }} />
                    )}
                    {hasCrypto && (
                      <Area type="monotone" dataKey="crypto" name="Kripto" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorCrypto)" activeDot={{ r: 5, fill: "#f59e0b", stroke: "var(--color-surface)", strokeWidth: 2 }} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Indikator Garis Aset yang Aktif di Grafik Net Worth */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border/40 dark:border-border-dark/40 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-text dark:text-white">
                <div className="h-2.5 w-2.5 rounded-full bg-purple shadow-xs" />
                <span>Net Worth</span>
              </div>
              {hasReksa && (
                <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark font-medium">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs" />
                  <span>Reksa Dana</span>
                </div>
              )}
              {hasSaham && (
                <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark font-medium">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-xs" />
                  <span>Saham</span>
                </div>
              )}
              {hasObligasi && (
                <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark font-medium">
                  <div className="h-2.5 w-2.5 rounded-full bg-teal-500 shadow-xs" />
                  <span>Obligasi</span>
                </div>
              )}
              {hasEmas && (
                <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark font-medium">
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-xs" />
                  <span>Emas</span>
                </div>
              )}
              {hasCrypto && (
                <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark font-medium">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-xs" />
                  <span>Kripto</span>
                </div>
              )}
            </div>
          </div>

          {/* INSIGHT OTOMATIS */}
          <div className="mb-6 rounded-3xl bg-surface dark:bg-surface-dark p-6 card-shadow border border-border dark:border-border-dark">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-purple" />
              <h2 className="font-display text-base font-semibold">Insight ({insightLabel})</h2>
            </div>
            <div className="flex flex-col gap-3">
              {chartData.length > 1 && (
                <>
                  <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                    <span className="shrink-0">💡</span>
                    <p>Total kekayaan {netWorthChange >= 0 ? 'bertambah' : 'berkurang'} <span className="font-bold">{formatCurrency(Math.abs(netWorthChange))}</span></p>
                  </div>
                  {hasCrypto && (
                    <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                      <span className="shrink-0">💡</span>
                      <p>Kripto {cryptoChange >= 0 ? 'bertambah' : 'berkurang'} <span className="font-bold">{formatCurrency(Math.abs(cryptoChange))}</span></p>
                    </div>
                  )}
                  {hasReksa && (
                    <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                      <span className="shrink-0">💡</span>
                      <p>Reksa Dana {reksaChange >= 0 ? 'bertambah' : 'berkurang'} <span className="font-bold">{formatCurrency(Math.abs(reksaChange))}</span></p>
                    </div>
                  )}
                  {hasSaham && (
                    <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                      <span className="shrink-0">💡</span>
                      <p>Saham {sahamChange >= 0 ? 'bertambah' : 'berkurang'} <span className="font-bold">{formatCurrency(Math.abs(sahamChange))}</span></p>
                    </div>
                  )}
                  {hasObligasi && (
                    <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                      <span className="shrink-0">💡</span>
                      <p>Obligasi {obligasiChange >= 0 ? 'bertambah' : 'berkurang'} <span className="font-bold">{formatCurrency(Math.abs(obligasiChange))}</span></p>
                    </div>
                  )}
                  {hasEmas && (
                    <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                      <span className="shrink-0">💡</span>
                      <p>Emas {emasChange >= 0 ? 'bertambah' : 'berkurang'} <span className="font-bold">{formatCurrency(Math.abs(emasChange))}</span></p>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                <span className="shrink-0">💡</span>
                <p>Progress menuju target {formatCurrency(wealthTarget)} mencapai <span className="font-bold">{wealthProgress.toFixed(1)}%</span></p>
              </div>
              {emergencyTarget > 0 && (
                <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                  <span className="shrink-0">💡</span>
                  <p>Dana darurat telah mencapai <span className="font-bold">{emergencyProgress.toFixed(1)}%</span> dari target</p>
                </div>
              )}
            </div>
          </div>

          {/* Health Score Card */}
          <button 
            onClick={() => setShowHealthScore(true)}
            className="w-full mb-6 text-left active:scale-[0.98] transition-transform"
          >
            <div className={`rounded-3xl p-5 ${healthScore.bgPulse} card-shadow border border-border dark:border-border-dark flex items-center justify-between`}>
              <div>
                <p className="text-sm font-semibold opacity-80 mb-1">Skor Kesehatan Keuangan</p>
                <div className="flex items-center gap-2">
                  <h2 className={`font-display text-2xl font-bold ${healthScore.statusColor}`}>{healthScore.status}</h2>
                </div>
                <p className="text-xs opacity-70 mt-1 max-w-50">
                  Berdasarkan 4 pilar finansial dari riwayat 30 hari terakhir.
                </p>
              </div>
              
              <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    className="stroke-border dark:stroke-border-dark"
                    strokeWidth="8"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    style={{ stroke: healthScore.ringColor }}
                    className="transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${(healthScore.finalScore / 100) * 264} 264`}
                  />
                </svg>
                <div className="flex flex-col items-center justify-center">
                  <span className="font-display font-bold text-2xl leading-none">{healthScore.finalScore}</span>
                </div>
              </div>
            </div>
          </button>

          {/* RISK PROFILER & KESEHATAN PORTOFOLIO */}
          <div className="mb-6 rounded-3xl bg-surface dark:bg-surface-dark p-6 card-shadow border border-border dark:border-border-dark">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShieldCheck size={20} className="text-blue" />
                Risk Profiler
              </h2>
              {isAggressive && (
                <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  Agresif (Growth Heavy)
                </div>
              )}
              {isSafe && (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck size={12} />
                  Defensif & Stabil
                </div>
              )}
              {!isAggressive && !isSafe && (
                <div className="flex items-center gap-1.5 rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold text-blue border border-blue/20">
                  Seimbang (Moderat)
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark">
                <p className="text-xs font-bold text-text-muted dark:text-text-muted-dark">Aset Defensif & Stabilitas</p>
                <div className="mt-2">
                  <AnimatedCurrency value={asetDefensif} className="font-display text-lg font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400" />
                  <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-1">Kas, RDPU, Emas, Obligasi</p>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark">
                <p className="text-xs font-bold text-text-muted dark:text-text-muted-dark">Aset Pertumbuhan (Growth)</p>
                <div className="mt-2">
                  <AnimatedCurrency value={asetPertumbuhan} className="font-display text-lg font-bold tabular-nums tracking-tight text-amber-600 dark:text-amber-400" />
                  <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-1">Kripto, Saham, RD Saham</p>
                </div>
              </div>
            </div>

            <div className="w-full h-2 rounded-full overflow-hidden flex bg-surface-muted dark:bg-surface-muted-dark">
              <div 
                style={{ width: `${totalRiskAssets > 0 ? (asetDefensif / totalRiskAssets) * 100 : 50}%` }} 
                className="h-full bg-emerald-500 transition-all duration-1000"
              />
              <div 
                style={{ width: `${totalRiskAssets > 0 ? (asetPertumbuhan / totalRiskAssets) * 100 : 50}%` }} 
                className="h-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-1000"
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-text-muted dark:text-text-muted-dark">
              <span>{Math.round(totalRiskAssets > 0 ? (asetDefensif / totalRiskAssets) * 100 : 50)}% Defensif</span>
              <span>{Math.round(riskRatio)}% Pertumbuhan</span>
            </div>
          </div>

          {/* DYNAMIC FINANCIAL QUOTE */}
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-purple/10 p-4 border border-purple/20">
            <Quote size={24} className="text-purple shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed text-purple-600 dark:text-purple-300 italic">
              "{financialQuote}"
            </p>
          </div>

          {/* Alokasi Aset (Pie Chart) */}
          <div className="mb-6 rounded-3xl bg-surface dark:bg-surface-dark p-6 card-shadow border border-border dark:border-border-dark flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-bold">
                  Alokasi Seluruh Aset
                </h3>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  Kas, bank, dan seluruh portofolio
                </p>
              </div>
              
              <Link
                to="/wealth-center/investasi"
                className="flex items-center gap-1 text-xs font-bold text-purple hover:underline"
              >
                Detail Portofolio →
              </Link>
            </div>
            
            {chartTotal > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex justify-center items-center relative h-52 w-full">
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
                    <span className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">Total</span>
                    <span className={`font-display font-bold tabular-nums leading-tight mt-0.5 max-w-[140px] truncate ${
                      formatCurrency(chartTotal).length > 14 
                        ? 'text-xs' 
                        : formatCurrency(chartTotal).length > 11 
                        ? 'text-sm' 
                        : formatCurrency(chartTotal).length > 9 
                        ? 'text-base' 
                        : 'text-lg'
                    }`}>
                      {formatCurrency(chartTotal)}
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={76}
                        outerRadius={96}
                        cornerRadius={8}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {
                          pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 6px ${entry.color}40)` }} />
                          ))
                        }
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        formatter={(value: any) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 gap-2.5 w-full">
                  {legendData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-3 rounded-xl bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} /> 
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted dark:text-text-muted-dark text-xs">{((item.value / chartTotal) * 100).toFixed(1)}%</span>
                        <span className="font-bold tabular-nums w-21.25 text-right">{formatCurrency(item.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {allocationInsight && (
                  <div className={`mt-2 p-4 rounded-2xl border ${allocationInsight.bg}`}>
                    <p className={`text-xs font-semibold leading-relaxed ${allocationInsight.color}`}>
                      {allocationInsight.text}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-text-muted py-4">Belum ada kekayaan yang tercatat.</p>
            )}
          </div>

          {/* Target Kekayaan & Dana Darurat */}
          <div className="grid grid-cols-1 gap-5 mb-6">
            <div className="rounded-3xl bg-linear-to-br from-amber-500 to-amber-700 text-white p-6 shadow-purple-glow relative overflow-hidden glass-edge sheen-effect">
              {/* Mascot Watermark */}
              <div className="absolute -top-4 -right-4 opacity-20 pointer-events-none grayscale contrast-200 mix-blend-overlay">
                <Mascot mood="happy" size={120} />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner">
                  <Target size={24} className="text-white drop-shadow-md" />
                </div>
                <div className="relative z-10">
                  <h2 className="font-display text-sm font-bold tracking-widest uppercase text-white/90">Target Kekayaan</h2>
                  <p className="text-xs font-medium text-white/70 mt-0.5">GOAL: {formatCurrency(wealthTarget)}</p>
                </div>
              </div>
              
              <div className="flex items-end justify-between mb-3 relative z-10">
                <p className="font-display text-4xl font-black tracking-tighter drop-shadow-md">{wealthProgress.toFixed(1)}%</p>
                <p className="text-xs font-semibold text-white/80 pb-1.5 uppercase tracking-wide">Sisa {formatCurrency(wealthRemaining)}</p>
              </div>
              <div className="h-2 w-full rounded-pill bg-black/20 overflow-hidden relative z-10 glass-edge shadow-inner">
                <div 
                  className="h-full rounded-pill bg-white transition-all duration-1000 relative"
                  style={{ width: `${wealthProgress}%`, boxShadow: '0 0 12px rgba(255,255,255,0.9)' }}
                />
              </div>
            </div>

            {emergencyTarget > 0 && (
              <div className="rounded-3xl bg-linear-to-br from-emerald-500 to-teal-700 text-white p-6 shadow-mint-glow relative overflow-hidden glass-edge sheen-effect">
                {/* Mascot Watermark */}
                <div className="absolute -top-4 -right-4 opacity-20 pointer-events-none grayscale contrast-200 mix-blend-overlay">
                  <Mascot mood="idle" size={120} />
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner">
                    <ShieldCheck size={24} className="text-white drop-shadow-md" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="font-display text-sm font-bold tracking-widest uppercase text-white/90">Dana Darurat</h2>
                    <p className="text-xs font-medium text-white/70 mt-0.5">GOAL: {formatCurrency(emergencyTarget)}</p>
                  </div>
                </div>
                
                <div className="flex items-end justify-between mb-3 relative z-10">
                  <p className="font-display text-4xl font-black tracking-tighter drop-shadow-md">{emergencyProgress.toFixed(1)}%</p>
                  <p className="text-xs font-semibold text-white/80 pb-1.5 uppercase tracking-wide">Sisa {formatCurrency(emergencyRemaining)}</p>
                </div>
                <div className="h-2 w-full rounded-pill bg-black/20 overflow-hidden relative z-10 glass-edge shadow-inner">
                  <div 
                    className="h-full rounded-pill bg-white transition-all duration-1000 relative"
                    style={{ width: `${emergencyProgress}%`, boxShadow: '0 0 12px rgba(255,255,255,0.9)' }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      <AddSnapshotSheet open={showAddSnapshot} onClose={() => setShowAddSnapshot(false)} />
      <EditTargetsSheet open={showEditTargets} onClose={() => setShowEditTargets(false)} />
      <HealthScoreSheet open={showHealthScore} onClose={() => setShowHealthScore(false)} scoreData={healthScore} />
    </PageTransition>
  );
}
