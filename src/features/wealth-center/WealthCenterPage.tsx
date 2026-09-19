import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, ShieldCheck, Trophy, Sparkles, Plus, Settings2, Wallet, TrendingUp, Quote } from 'lucide-react';
import { useWealthStore, parseWealthNote } from '../../stores/wealthStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAccountStore, activeAccounts } from '../../stores/accountStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatCurrency, formatCurrencyCompact } from '../../lib/formatters';
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
    return (
      <div className="rounded-xl bg-surface dark:bg-surface-dark p-3 shadow-xl ring-1 ring-border dark:ring-border-dark min-w-37.5">
        <p className="mb-2 text-xs font-bold text-text-muted dark:text-text-muted-dark">{label}</p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
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
  const [pieChartMode, setPieChartMode] = useState<'all' | 'invest'>('all');

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

  const currentNetWorth = currentCash + currentCrypto + currentMutualFund;

  const wealthDetails = parseWealthNote(latestSnapshot?.note);
  const rdpuAmount = wealthDetails.rdpu || 0;
  
  // Risk Profiling Logic
  // Fallback: If JSON doesn't exist, we assume all current mutual fund is RDPU for safe calculation
  // Or we just use what we have. Let's strictly use JSON if available, else assume safe is just Cash + Mutual Fund.
  // Actually, if details.rdpu === 0 && details.rdSaham === 0, we can fallback to mutualFundAmount being safe.
  const isLegacy = wealthDetails.rdpu === 0 && wealthDetails.rdSaham === 0 && wealthDetails.btc === 0 && wealthDetails.eth === 0;

  const currentInvestments = currentCrypto + currentMutualFund;
  const chartTotal = pieChartMode === 'all' ? currentNetWorth : currentInvestments;

  const chartDataAll = [
    { name: 'Kas & Bank', value: currentCash, color: '#10b981' },
    { name: 'RDPU', value: isLegacy ? currentMutualFund : rdpuAmount, color: '#14b8a6' },
    { name: 'RD Saham', value: isLegacy ? 0 : wealthDetails.rdSaham, color: '#3b82f6' },
    { name: 'Bitcoin', value: isLegacy ? currentCrypto : wealthDetails.btc, color: '#f97316' },
    { name: 'Ethereum', value: isLegacy ? 0 : wealthDetails.eth, color: '#8b5cf6' },
  ];
  const pieChartData = (pieChartMode === 'all' ? chartDataAll : chartDataAll.slice(1)).filter(d => d.value > 0);

  const legendAll = [
    { name: 'Kas & Bank', value: currentCash, color: 'bg-emerald-500' },
    { name: 'RDPU (Aman)', value: isLegacy ? currentMutualFund : rdpuAmount, color: 'bg-teal-500' },
    { name: 'RD Saham / Campuran', value: isLegacy ? 0 : wealthDetails.rdSaham, color: 'bg-blue-500' },
    { name: 'Bitcoin (BTC)', value: isLegacy ? currentCrypto : wealthDetails.btc, color: 'bg-orange-500' },
    { name: 'Ethereum (ETH)', value: isLegacy ? 0 : wealthDetails.eth, color: 'bg-violet-500' },
  ];
  const legendData = (pieChartMode === 'all' ? legendAll : legendAll.slice(1)).filter(d => d.value > 0);
  
  const uangAman = isLegacy ? (currentCash + currentMutualFund) : (currentCash + rdpuAmount);
  const uangTempur = isLegacy ? currentCrypto : (wealthDetails.rdSaham + wealthDetails.btc + wealthDetails.eth);
  const totalRiskAssets = uangAman + uangTempur;
  
  const riskRatio = totalRiskAssets > 0 ? (uangTempur / totalRiskAssets) * 100 : 0;
  const isAggressive = riskRatio > 60;
  const isSafe = riskRatio < 50;

  const allocationInsight = useMemo(() => {
    if (chartTotal === 0) return null;
    
    let riskPercentage = 0;
    if (pieChartMode === 'all') {
      riskPercentage = (uangTempur / chartTotal) * 100;
    } else {
      // In invest mode, risk is crypto + saham vs total investments
      const investRisk = (isLegacy ? currentCrypto : wealthDetails.btc) + wealthDetails.eth + wealthDetails.rdSaham;
      riskPercentage = (investRisk / chartTotal) * 100;
    }
    
    if (riskPercentage > 60) {
      return {
        text: "Porsi aset berisiko (saham & kripto) cukup tinggi. Cocok untuk pertumbuhan cepat, tapi waspadai fluktuasi tajam! 🎢",
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/20"
      };
    } else if (riskPercentage < 20) {
      return {
        text: "Portofolio sangat aman & defensif. Risiko sangat kecil, tapi pertumbuhan kekayaan mungkin lebih lambat. 🐢",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20"
      };
    } else {
      return {
        text: "Keseimbangan portofolio Anda sangat ideal (Moderat). Stabil saat krisis, tapi tetap tumbuh saat pasar naik! ⚖️",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20"
      };
    }
  }, [pieChartMode, chartTotal, uangTempur, wealthDetails, isLegacy, currentCrypto]);

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
      const crypto = applicableSnap?.cryptoAmount || 0;
      const mutualFund = applicableSnap?.mutualFundAmount || 0;

      const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      data.unshift({
        label,
        netWorth: runningCash + crypto + mutualFund,
        crypto: crypto,
        mutualFund: mutualFund,
      });

      // Prepare for the previous day by subtracting today's net change
      const todaysChange = dailyNetChange.get(dStr) || 0;
      runningCash -= todaysChange;
    }

    return data;
  }, [snapshots, active, transactions, timeRange]);

  // Insights compare Current (Today) vs 30 Days Ago (chartData[0])
  const baselineNetWorth = chartData.length > 0 ? (chartData[0].netWorth || 0) : 0;
  const netWorthChange = (currentNetWorth || 0) - baselineNetWorth;
  const baselineCrypto = chartData.length > 0 ? (chartData[0].crypto || 0) : 0;
  const cryptoChange = (currentCrypto || 0) - baselineCrypto;
  const baselineMutualFund = chartData.length > 0 ? (chartData[0].mutualFund || 0) : 0;
  const mutualFundChange = (currentMutualFund || 0) - baselineMutualFund;

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
          <div className="grid grid-cols-2 gap-4 mb-6">
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
            <div className="rounded-2xl bg-surface dark:bg-surface-dark p-4 card-shadow border border-border dark:border-border-dark relative overflow-hidden flex flex-col justify-between h-27.5">
              <div className="absolute -top-2 -right-2 p-3 opacity-10 pointer-events-none">
                <TrendingUp size={64} />
              </div>
              <p className="text-xs font-bold text-text-muted dark:text-text-muted-dark z-10">Total Investasi</p>
              <div className="z-10 mt-auto">
                <AnimatedCurrency value={currentCrypto + currentMutualFund} className="font-display text-lg font-bold tabular-nums tracking-tight text-purple" />
                <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-0.5">Crypto & Reksa Dana</p>
              </div>
            </div>
          </div>

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
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMutualFund" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" strokeOpacity={0.7} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} tickMargin={12} minTickGap={20} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                    
                    {/* Areas rendered from largest to smallest */}
                    <Area type="monotone" dataKey="netWorth" name="Net Worth" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorNetWorth)" activeDot={{ r: 6, fill: "#8b5cf6", stroke: "var(--color-surface)", strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="mutualFund" name="Reksa Dana" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMutualFund)" activeDot={{ r: 6, fill: "#10b981", stroke: "var(--color-surface)", strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="crypto" name="Crypto" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorCrypto)" activeDot={{ r: 6, fill: "#f59e0b", stroke: "var(--color-surface)", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
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
                  <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                    <span className="shrink-0">💡</span>
                    <p>Crypto {cryptoChange >= 0 ? 'bertambah' : 'berkurang'} <span className="font-bold">{formatCurrency(Math.abs(cryptoChange))}</span></p>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                    <span className="shrink-0">💡</span>
                    <p>Reksa Dana {mutualFundChange >= 0 ? 'bertambah' : 'berkurang'} <span className="font-bold">{formatCurrency(Math.abs(mutualFundChange))}</span></p>
                  </div>
                </>
              )}
              <div className="flex items-start gap-2 text-sm text-text dark:text-white">
                <span className="shrink-0">💡</span>
                <p>Progress menuju target {formatCurrencyCompact(wealthTarget)} mencapai <span className="font-bold">{wealthProgress.toFixed(1)}%</span></p>
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
                  Agresif (High Risk)
                </div>
              )}
              {isSafe && (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck size={12} />
                  Aman & Stabil
                </div>
              )}
              {!isAggressive && !isSafe && (
                <div className="flex items-center gap-1.5 rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold text-blue border border-blue/20">
                  Seimbang (Moderate)
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark">
                <p className="text-xs font-bold text-text-muted dark:text-text-muted-dark">Uang Aman (Safe)</p>
                <div className="mt-2">
                  <AnimatedCurrency value={uangAman} className="font-display text-lg font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400" />
                  <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-1">Kas, Bank, RDPU</p>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark">
                <p className="text-xs font-bold text-text-muted dark:text-text-muted-dark">Uang Tempur (Risk)</p>
                <div className="mt-2">
                  <AnimatedCurrency value={uangTempur} className="font-display text-lg font-bold tabular-nums tracking-tight text-rose-600 dark:text-rose-400" />
                  <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-1">RD Saham, BTC, ETH</p>
                </div>
              </div>
            </div>

            <div className="w-full h-2 rounded-full overflow-hidden flex bg-surface-muted dark:bg-surface-muted-dark">
              <div 
                style={{ width: `${totalRiskAssets > 0 ? (uangAman / totalRiskAssets) * 100 : 50}%` }} 
                className="h-full bg-emerald-500 transition-all duration-1000"
              />
              <div 
                style={{ width: `${totalRiskAssets > 0 ? (uangTempur / totalRiskAssets) * 100 : 50}%` }} 
                className="h-full bg-rose-500 transition-all duration-1000"
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-text-muted dark:text-text-muted-dark">
              <span>{Math.round(totalRiskAssets > 0 ? (uangAman / totalRiskAssets) * 100 : 50)}% Aman</span>
              <span>{Math.round(riskRatio)}% Tempur</span>
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
              <h3 className="font-display text-lg font-bold">
                Alokasi Aset
              </h3>
              
              <div className="flex bg-surface-muted dark:bg-surface-muted-dark p-1 rounded-full border border-border dark:border-border-dark">
                <button
                  onClick={() => setPieChartMode('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    pieChartMode === 'all'
                      ? 'bg-surface dark:bg-surface-dark text-text dark:text-text-dark shadow-sm'
                      : 'text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setPieChartMode('invest')}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    pieChartMode === 'invest'
                      ? 'bg-surface dark:bg-surface-dark text-text dark:text-text-dark shadow-sm'
                      : 'text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark'
                  }`}
                >
                  Investasi
                </button>
              </div>
            </div>
            
            {chartTotal > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex justify-center items-center relative h-45 w-full">
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">Total</span>
                    <span className="text-xl font-display font-bold tabular-nums leading-none mt-1">{formatCurrencyCompact(chartTotal)}</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
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
                        <span className="font-bold tabular-nums w-21.25 text-right">{formatCurrencyCompact(item.value)}</span>
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
                <p className="text-xs font-semibold text-white/80 pb-1.5 uppercase tracking-wide">Sisa {formatCurrencyCompact(wealthRemaining)}</p>
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
                  <p className="text-xs font-semibold text-white/80 pb-1.5 uppercase tracking-wide">Sisa {formatCurrencyCompact(emergencyRemaining)}</p>
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
