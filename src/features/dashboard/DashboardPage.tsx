import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ChevronRight, TrendingUp, TrendingDown, Bell, Sparkles } from "lucide-react";
import { Card } from "../../components/Card";
import { AppIcon } from "../../lib/icons";
import { Mascot } from "../../components/Mascot";
import { EmptyState } from "../../components/EmptyState";
import { NotificationSheet } from "../../components/NotificationSheet";
import { Skeleton } from "../../components/Skeleton";
import { PageTransition } from "../../components/PageTransition"; 
import { VirtualCard3D } from "../../components/VirtualCard3D"; 
import { HorizontalScroll } from "../../components/HorizontalScroll";
import { useNotificationStore } from "../../stores/notificationStore";
import { useAccountStore, activeAccounts } from "../../stores/accountStore";
import { useTransactionStore } from "../../stores/transactionStore";
import { useCategoryStore } from "../../stores/categoryStore";
import { useGamificationStore } from "../../stores/gamificationStore";
import {
  formatCurrency,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "../../lib/formatters";

import {
  summarize,
  breakdownByCategory,
  detectInsights,
  isSameMonth,
} from "../../domain/reportUseCases";
import { analyzeBudget } from "../../lib/budgetUtils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useSettingsStore } from "../../stores/settingsStore";
import { AnimatedCurrency } from "../../components/AnimatedCurrency";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DashboardPage() {
  const { checkAndUnlockBadges } = useGamificationStore();
  const settings = useSettingsStore((s) => s.settings);
  const accounts = useAccountStore((s) => s.accounts);
  const transactions = useTransactionStore((s) => s.transactions);
  const categories = useCategoryStore((s) => s.categories);
  const accountsLoading = useAccountStore((s) => s.loading);
  const transactionsLoading = useTransactionStore((s) => s.loading);
  const loading = accountsLoading || transactionsLoading;
  
  const [showBalance, setShowBalance] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = useNotificationStore((s) => s.notifications);
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;



  const active = activeAccounts(accounts);
  const totalBalance = active.reduce((sum, a) => sum + a.balance, 0);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const thisMonthTx = useMemo(
    () =>
      transactions.filter((t) => t.date >= monthStart && t.date <= monthEnd),
    [transactions, monthStart, monthEnd],
  );
  const prevMonthDate = addMonths(now, -1);
  const prevMonthTx = useMemo(
    () => transactions.filter((t) => isSameMonth(t.date, prevMonthDate)),
    [transactions, prevMonthDate],
  );

  const budgetInfo = useMemo(() => analyzeBudget(thisMonthTx, categories), [thisMonthTx, categories]);

  useEffect(() => {
    checkAndUnlockBadges({
      txCount: transactions.length,
      isUnderBudget: budgetInfo.expense < budgetInfo.income && budgetInfo.expense > 0,
      netWorth: totalBalance
    });
  }, [transactions.length, budgetInfo, totalBalance]);

  const summary = summarize(thisMonthTx);
  const topCategories = breakdownByCategory(
    thisMonthTx,
    categories,
    "expense",
  ).slice(0, 4);
  const insights = detectInsights(thisMonthTx, prevMonthTx, categories);

  const trendData = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      const dayTx = transactions.filter((t) => t.date >= d && t.date <= dayEnd);
      const net = dayTx.reduce((sum, t) => {
        if (t.type === "income") return sum + t.amount;
        if (t.type === "expense") return sum - t.amount;
        return sum;
      }, 0);
      days.push({ label: `${d.getDate()}`, value: net });
    }
    return days;
  }, [transactions]);

  return (
    <PageTransition className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="glass-header -mx-4 md:-mx-8 lg:-mx-10 px-4 md:px-8 lg:px-10 py-4 -mt-6 mb-5 pt-6 flex items-center justify-between z-50">
        <div>
          <p className="text-sm text-text-muted dark:text-text-muted-dark font-medium">
            {settings?.userName ? `Halo, ${settings.userName}! 👋` : "Halo! 👋"}
          </p>
          <h1 className="font-display text-xl font-bold">Kelola keuanganmu</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow text-text dark:text-white transition-transform active:scale-90"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose ring-2 ring-surface dark:ring-surface-dark" />
            )}
          </button>
          <Mascot mood="happy" size={44} />
        </div>
      </div>

      {/* Total Saldo */}
      <Card
        className="bg-linear-to-br from-[#8A2BE2] via-[#6a0dad] to-[#4B0082] text-white overflow-hidden relative transform-gpu transition-transform active:scale-[0.98]"
        style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 20px 40px -10px rgba(109,40,217,0.6)' }}
        padded
      >
        {/* Crisp Slanted Moving Glare */}
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden mix-blend-overlay">
          {/* Top & Left edge static highlights */}
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-white/30 to-transparent"></div>
          
          {/* The moving slanted sheen - made taller (-top-10 -bottom-10) so it doesn't show sharp clipped corners when skewed */}
          <div 
            className="absolute w-[40%] animate-[sheen_7s_ease-in-out_infinite]"
            style={{ 
              top: '-20px', 
              bottom: '-20px', 
              left: '0',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' 
            }}
          ></div>
        </div>
        
        {/* Watermark Mascot */}
        <div className="absolute -bottom-6 -right-4 opacity-15 pointer-events-none grayscale brightness-200">
          <Mascot mood="happy" size={160} />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <span className="text-sm text-white/80">Total Saldo Aktif</span>
          <button
            onClick={() => setShowBalance((v) => !v)}
            aria-label="Sembunyikan saldo"
          >
            {showBalance ? (
              <Eye size={18} className="text-white/80" />
            ) : (
              <EyeOff size={18} className="text-white/80" />
            )}
          </button>
        </div>
        {loading ? (
          <Skeleton variant="text" className="h-9 w-40 mt-1 bg-white/20 relative z-10" />
        ) : (
          <span className="text-4xl font-black text-white relative z-10 block mt-1 tracking-tighter drop-shadow-md">
            {showBalance ? <AnimatedCurrency value={totalBalance} /> : "Rp••••••••"}
          </span>
        )}
        <div className="mt-4 flex gap-4 relative z-10">
          <div className="flex-1 rounded-2xl bg-black/20 p-3 backdrop-blur-md border border-white/5" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <TrendingUp size={14} /> Pemasukan
            </div>
            {loading ? (
              <Skeleton variant="text" className="h-5 w-24 mt-1 bg-white/20" />
            ) : (
              <span className="text-sm font-bold text-success tracking-tight drop-shadow-sm">
                {showBalance ? <AnimatedCurrency value={summary.totalIncome} /> : "••••••"}
              </span>
            )}
          </div>
          <div className="flex-1 rounded-2xl bg-black/20 p-3 backdrop-blur-md border border-white/5" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <TrendingDown size={14} /> Pengeluaran
            </div>
            {loading ? (
              <Skeleton variant="text" className="h-5 w-24 mt-1 bg-white/20" />
            ) : (
              <span className="text-sm font-bold text-danger tracking-tight drop-shadow-sm">
                {showBalance ? <AnimatedCurrency value={summary.totalExpense} /> : "••••••"}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Akun Saya */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Akun Saya</h2>
          <Link
            to="/pengaturan/akun"
            className="flex items-center text-xs font-medium text-purple"
          >
            Lihat Semua <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <HorizontalScroll className="pb-2" autoScroll={false}>
            <div className="flex gap-3 w-max">
              {[1, 2].map((i) => (
                <div key={i} className="min-w-52 max-w-56 h-32 rounded-2xl p-3.5 card-shadow bg-surface-muted dark:bg-surface-muted-dark border border-border dark:border-border-dark">
                  <Skeleton variant="circular" className="h-5 w-5" />
                  <Skeleton variant="text" className="h-3 w-16 mt-3" />
                  <Skeleton variant="text" className="h-4 w-24 mt-1" />
                </div>
              ))}
            </div>
          </HorizontalScroll>
        ) : active.length === 0 ? (
          <Card>
            <EmptyState
              title="Belum ada akun"
              description="Tambahkan akun bank atau e-wallet pertamamu"
              mood="idle"
            />
          </Card>
        ) : (
          <HorizontalScroll className="pb-2" autoScroll={false}>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex gap-3 w-max"
            >
              {active.map((acc) => (
                <motion.div
                  variants={itemVariants}
                  key={acc.id}
                  className="shrink-0"
                >
                  <VirtualCard3D
                    name={acc.name}
                    balance={acc.balance}
                    color={acc.color}
                    icon={acc.icon}
                    showBalance={showBalance}
                    cardNumber={`•••• •••• •••• ${(acc.name.length * 1337 + 4521) % 9000 + 1000}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          </HorizontalScroll>
        )}
      </div>

      {/* Tren 7 hari */}
      <Card className="mt-6 glass-edge">
        <h2 className="mb-1 font-display text-base font-semibold tracking-tight">
          Tren 7 Hari Terakhir
        </h2>
        <p className="mb-2 text-xs text-text-muted dark:text-text-muted-dark">
          Arus kas harian (pemasukan − pengeluaran)
        </p>
        <div className="h-32 w-full mt-2 overflow-hidden">
          {loading ? (
            <Skeleton variant="rectangular" className="h-full w-full opacity-50" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C6FE0" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C6FE0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-chart-grid)"
                  strokeOpacity={0.7}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value) || 0)}
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7C6FE0"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Kategori terbesar */}
      <Card className="mt-6 glass-edge">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold tracking-tight">
            Pengeluaran Terbesar
          </h2>
          <Link
            to="/laporan"
            className="flex items-center text-xs font-medium text-purple"
          >
            Laporan <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton variant="icon" className="h-9 w-9 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Skeleton variant="text" className="h-3 w-20 mb-1" />
                  <Skeleton variant="rectangular" className="h-1.5 w-full rounded-pill" />
                </div>
                <Skeleton variant="text" className="h-4 w-12 shrink-0" />
              </div>
            ))}
          </div>
        ) : topCategories.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted dark:text-text-muted-dark">
            Belum ada pengeluaran bulan ini
          </p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col gap-3"
          >
            {topCategories.map((c) => (
              <motion.div variants={itemVariants} key={c.categoryId} className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${c.color}22` }}
                >
                  <AppIcon name={c.icon} size={16} style={{ color: c.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <div className="mt-2 h-2 w-full rounded-pill bg-surface-muted dark:bg-surface-muted-dark overflow-hidden glass-edge shadow-inner">
                    <motion.div
                      className="h-full rounded-pill relative"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      style={{
                        backgroundColor: c.color,
                        boxShadow: `0 0 8px ${c.color}80`
                      }}
                    />
                  </div>
                </div>
                <p className="shrink-0 text-sm font-bold tabular-nums tracking-tight">
                  {formatCurrency(c.total)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Card>

      {/* Insight */}
      {insights.length > 0 && (
        <Card className="mt-6 bg-mint/10 dark:bg-mint/5 glass-edge border border-mint/20">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="mt-0.5 shrink-0 text-mint" />
            <div className="flex flex-col gap-1.5">
              {insights.map((insight, i) => (
                <p key={i} className="text-sm">
                  {insight}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Mini Budget Widget 50/30/20 */}
      {budgetInfo.income > 0 && (
        <Link to="/laporan" className="block mt-6">
          <Card className="glass-edge relative overflow-hidden group cursor-pointer transition-transform active:scale-[0.98]">
            <div className="absolute inset-0 bg-linear-to-r from-[#FF8DA1]/10 via-[#FFB088]/10 to-[#6ED9C4]/10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-between mb-3">
              <h2 className="font-display text-sm font-semibold tracking-tight">Kesehatan Keuangan</h2>
              <div className="flex items-center text-[10px] font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest gap-1">
                50/30/20 <ChevronRight size={12} className="opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex w-full h-2.5 rounded-full overflow-hidden shadow-inner bg-surface-muted dark:bg-surface-muted-dark">
                <div style={{ width: `${Math.min(budgetInfo.needsPercent, 100)}%` }} className="bg-[#FF8DA1] h-full transition-all duration-1000 ease-out" />
                <div style={{ width: `${Math.min(budgetInfo.wantsPercent, 100)}%` }} className="bg-[#FFB088] h-full transition-all duration-1000 ease-out" />
                <div style={{ width: `${Math.max(100 - budgetInfo.needsPercent - budgetInfo.wantsPercent, 0)}%` }} className="bg-[#6ED9C4] h-full transition-all duration-1000 ease-out" />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-medium text-text-muted dark:text-text-muted-dark">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#FF8DA1]"/> {budgetInfo.needsPercent.toFixed(0)}%</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#FFB088]"/> {budgetInfo.wantsPercent.toFixed(0)}%</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#6ED9C4]"/> {budgetInfo.savingsPercent.toFixed(0)}%</span>
              </div>
            </div>
          </Card>
        </Link>
      )}

      {/* Shortcut */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          to="/tabungan"
          className="flex items-center gap-3 rounded-2xl bg-surface dark:bg-surface-dark p-4 card-shadow"
        >
          <AppIcon name="piggy-bank" size={22} className="text-peach" />
          <span className="text-sm font-medium">Target Tabungan</span>
        </Link>
        <Link
          to="/kalender"
          className="flex items-center gap-3 rounded-2xl bg-surface dark:bg-surface-dark p-4 card-shadow"
        >
          <AppIcon name="receipt" size={22} className="text-blue" />
          <span className="text-sm font-medium">Kalender</span>
        </Link>
        <Link
          to="/budget"
          className="flex items-center gap-3 rounded-2xl bg-surface dark:bg-surface-dark p-4 card-shadow"
        >
          <AppIcon name="target" size={22} className="text-rose" />
          <span className="text-sm font-medium">Budget</span>
        </Link>
        <Link
          to="/pengaturan/kategori"
          className="flex items-center gap-3 rounded-2xl bg-surface dark:bg-surface-dark p-4 card-shadow"
        >
          <AppIcon name="grid" size={22} className="text-purple" />
          <span className="text-sm font-medium">Kategori Kustom</span>
        </Link>
      </div>
      <NotificationSheet 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </PageTransition>
  );
}
