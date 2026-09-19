import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { AppIcon } from '../../lib/icons';
import { useTransactionStore } from '../../stores/transactionStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { summarize, breakdownByCategory, detectInsights } from '../../domain/reportUseCases';
import { formatCurrency, formatCurrencyCompact, formatDate, formatMonthYear,
  startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear,
  addMonths,
} from '../../lib/formatters';
import { analyzeBudget } from '../../lib/budgetUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, CartesianGrid } from 'recharts';
import { PageTransition } from '../../components/PageTransition';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

const PERIOD_LABEL: Record<Period, string> = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

function getRange(period: Period, cursor: Date) {
  switch (period) {
    case 'daily':
      return { start: startOfDay(cursor), end: endOfDay(cursor) };
    case 'weekly':
      return { start: startOfWeek(cursor), end: endOfWeek(cursor) };
    case 'monthly':
      return { start: startOfMonth(cursor), end: endOfMonth(cursor) };
    case 'yearly':
      return { start: startOfYear(cursor), end: endOfYear(cursor) };
  }
}

function shiftCursor(period: Period, cursor: Date, dir: 1 | -1) {
  switch (period) {
    case 'daily': {
      const d = new Date(cursor);
      d.setDate(d.getDate() + dir);
      return d;
    }
    case 'weekly': {
      const d = new Date(cursor);
      d.setDate(d.getDate() + dir * 7);
      return d;
    }
    case 'monthly':
      return addMonths(cursor, dir);
    case 'yearly':
      return new Date(cursor.getFullYear() + dir, cursor.getMonth(), cursor.getDate());
  }
}

function rangeLabel(period: Period, cursor: Date, start: Date, end: Date) {
  switch (period) {
    case 'daily':
      return formatDate(cursor);
    case 'weekly':
      return `${formatDate(start)} – ${formatDate(end)}`;
    case 'monthly':
      return formatMonthYear(cursor);
    case 'yearly':
      return `${cursor.getFullYear()}`;
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-[#151515]/90 backdrop-blur-md border border-border/50 dark:border-white/10 p-3 rounded-2xl shadow-xl">
        {label && <p className="text-xs font-semibold text-text-muted dark:text-text-muted-dark mb-2">{label}</p>}
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color || entry.payload?.fill }} />
              <p className="text-sm font-bold text-text dark:text-white">
                {formatCurrency(Number(entry.value) || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function ReportsPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const categories = useCategoryStore((s) => s.categories);
  const [period, setPeriod] = useState<Period>('monthly');
  const [cursor, setCursor] = useState(new Date());

  const { start, end } = getRange(period, cursor);
  const prevCursor = shiftCursor(period, cursor, -1);
  const { start: prevStart, end: prevEnd } = getRange(period, prevCursor);

  const currentTx = useMemo(() => transactions.filter((t) => t.date >= start && t.date <= end), [transactions, start, end]);
  const prevTx = useMemo(() => transactions.filter((t) => t.date >= prevStart && t.date <= prevEnd), [transactions, prevStart, prevEnd]);

  const summary = summarize(currentTx);
  const prevSummary = summarize(prevTx);
  const expenseChange = prevSummary.totalExpense > 0
    ? ((summary.totalExpense - prevSummary.totalExpense) / prevSummary.totalExpense) * 100
    : null;

  const categoryData = breakdownByCategory(currentTx, categories, 'expense');

  const trendData = useMemo(() => {
    if (period === 'yearly') {
      const months = Array.from({ length: 12 }, (_, i) => i);
      return months.map((m) => {
        const monthTx = currentTx.filter((t) => t.date.getMonth() === m);
        const s = summarize(monthTx);
        return { label: `${m + 1}`, pengeluaran: s.totalExpense, pemasukan: s.totalIncome };
      });
    }
    const dayCount = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    return Array.from({ length: Math.min(dayCount, 31) }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dayTx = currentTx.filter((t) => t.date.toDateString() === d.toDateString());
      const s = summarize(dayTx);
      return { label: `${d.getDate()}`, pengeluaran: s.totalExpense, pemasukan: s.totalIncome };
    });
  }, [currentTx, period, start, end]);
  const insights = useMemo(() => {
    return detectInsights(currentTx, prevTx, categories);
  }, [currentTx, prevTx, categories]);

  const budgetInfo = useMemo(() => analyzeBudget(currentTx, categories), [currentTx, categories]);

  return (
    <PageTransition className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6 min-h-dvh bg-bg dark:bg-bg-dark">
      <div className="glass-header -mx-4 md:-mx-8 lg:-mx-10 px-4 md:px-8 lg:px-10 py-4 -mt-6 mb-6 pt-6 z-50">
        <h1 className="font-display text-xl font-bold">Laporan Keuangan</h1>
      </div>
      <div className="mb-6 flex gap-1.5 overflow-x-auto no-scrollbar rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-1.5 border border-border/50 dark:border-border-dark/50">
        {(['daily', 'weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={clsx(
              'relative flex-1 shrink-0 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors',
              period === p ? 'text-white' : 'text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-white'
            )}
          >
            {period === p && (
              <motion.div
                layoutId="activePeriod"
                className="absolute inset-0 rounded-xl bg-purple shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{PERIOD_LABEL[p]}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => setCursor((c) => shiftCursor(period, c, -1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow hover:scale-105 active:scale-95 transition-transform">
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm font-bold bg-surface-muted dark:bg-surface-muted-dark px-4 py-2 rounded-full border border-border/50 dark:border-border-dark/50">
          {rangeLabel(period, cursor, start, end)}
        </p>
        <button onClick={() => setCursor((c) => shiftCursor(period, c, 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow hover:scale-105 active:scale-95 transition-transform">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mb-6 rounded-3xl bg-surface dark:bg-surface-dark p-6 card-shadow border border-border dark:border-border-dark glass-edge relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple/10 dark:bg-purple/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col items-center text-center mb-5 relative z-10">
          <p className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest mb-1.5 drop-shadow-sm">Total Saldo Bersih</p>
          <h2 className="font-display text-3xl font-black tracking-tight drop-shadow-sm">
            {formatCurrency(summary.netBalance)}
          </h2>
          
          {expenseChange !== null && (
            <div className={clsx(
              'mt-3 flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm border backdrop-blur-md',
              expenseChange > 0 ? 'bg-rose/10 text-rose border-rose/20' : 'bg-mint/10 text-mint border-mint/20'
            )}>
              {expenseChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              Pengeluaran {expenseChange > 0 ? 'naik' : 'turun'} {Math.abs(expenseChange).toFixed(0)}%
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60 dark:border-border-dark/60 relative z-10">
          <div className="flex flex-col items-center justify-center relative">
            <p className="text-[10px] font-bold text-mint uppercase tracking-wider mb-0.5 drop-shadow-sm">Pemasukan</p>
            <p className="font-display text-lg font-bold text-mint drop-shadow-sm">{formatCurrency(summary.totalIncome)}</p>
            <div className="absolute -right-2 inset-y-1 w-px bg-border/80 dark:bg-border-dark/80"></div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold text-rose uppercase tracking-wider mb-0.5 drop-shadow-sm">Pengeluaran</p>
            <p className="font-display text-lg font-bold text-rose drop-shadow-sm">{formatCurrency(summary.totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* AI Insights Block */}
      {insights.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-linear-to-br from-amber-500/10 to-amber-500/5 p-4 border border-amber-500/20 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Sparkles size={14} />
              </div>
              <h2 className="font-display text-sm font-bold text-amber-700 dark:text-amber-400 tracking-wide">Insight Cerdas</h2>
            </div>
            <ul className="space-y-2.5">
              {insights.map((insight, idx) => (
                <li key={idx} className="text-sm font-medium text-text-muted dark:text-text-muted-dark flex items-start gap-2.5 leading-relaxed">
                  <span className="text-amber-500 mt-1 shrink-0">•</span> {insight}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* 50/30/20 Budget Analysis Card */}
      {period === 'monthly' && budgetInfo.income > 0 && (
        <Card className="mb-6 relative overflow-hidden glass-edge">
          <div className="absolute inset-0 bg-linear-to-br from-blue/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="mb-1 font-display text-sm font-semibold">Analisis Budget 50/30/20</h2>
            <p className="mb-4 text-xs text-text-muted dark:text-text-muted-dark">Evaluasi kesehatan finansial berdasarkan pemasukanmu bulan ini.</p>
            
            <div className="flex w-full h-3 rounded-full overflow-hidden mb-4 shadow-inner">
              <div style={{ width: `${Math.min(budgetInfo.needsPercent, 100)}%` }} className="bg-[#FF8DA1] h-full" />
              <div style={{ width: `${Math.min(budgetInfo.wantsPercent, 100)}%` }} className="bg-[#FFB088] h-full" />
              <div style={{ width: `${Math.max(100 - budgetInfo.needsPercent - budgetInfo.wantsPercent, 0)}%` }} className="bg-[#6ED9C4] h-full" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#FF8DA1]" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">Kebutuhan</span>
                </div>
                <p className="text-xs font-semibold mb-0.5">{budgetInfo.needsPercent.toFixed(0)}%</p>
                <p className="text-[10px] text-text-muted dark:text-text-muted-dark tabular-nums">{formatCurrencyCompact(budgetInfo.needs)}</p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#FFB088]" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">Keinginan</span>
                </div>
                <p className="text-xs font-semibold mb-0.5">{budgetInfo.wantsPercent.toFixed(0)}%</p>
                <p className="text-[10px] text-text-muted dark:text-text-muted-dark tabular-nums">{formatCurrencyCompact(budgetInfo.wants)}</p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#6ED9C4]" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">Tabungan</span>
                </div>
                <p className="text-xs font-semibold mb-0.5">{budgetInfo.savingsPercent.toFixed(0)}%</p>
                <p className="text-[10px] text-text-muted dark:text-text-muted-dark tabular-nums">{formatCurrencyCompact(budgetInfo.savings)}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 dark:border-border-dark/50">
              <p className="text-[11px] font-medium leading-relaxed">
                {budgetInfo.needsPercent > 55 ? (
                  <span className="text-rose">⚠️ Pengeluaran kebutuhanmu cukup tinggi (&gt;50%). Coba evaluasi tagihan bulanan.</span>
                ) : budgetInfo.wantsPercent > 35 ? (
                  <span className="text-peach">⚠️ Pengeluaran hiburan/keinginanmu agak membengkak (&gt;30%). Yuk, rem sedikit!</span>
                ) : budgetInfo.savingsPercent >= 20 ? (
                  <span className="text-mint">✨ Luar biasa! Kamu berhasil menabung/menyisakan lebih dari 20% pemasukanmu.</span>
                ) : (
                  <span className="text-text-muted dark:text-text-muted-dark">👍 Kondisi keuanganmu cukup stabil. Terus tingkatkan tabunganmu!</span>
                )}
              </p>
              <Link 
                to="/budget" 
                className="mt-3 block w-full text-center rounded-xl bg-purple/10 dark:bg-purple/20 py-2.5 text-xs font-bold text-purple dark:text-purple-light transition-colors active:scale-[0.98]"
              >
                Atur Limit Pengeluaran (Budget)
              </Link>
            </div>
          </div>
        </Card>
      )}


      <Card className="mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple/5 to-transparent pointer-events-none" />
        <h2 className="mb-4 font-display text-sm font-semibold relative z-10">Tren {PERIOD_LABEL[period]}</h2>
        <div className="h-40 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6ED9C4" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6ED9C4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8DA1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#FF8DA1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" strokeOpacity={0.7} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} tickMargin={10} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-muted)', opacity: 0.4 }} />
              <Area type="monotone" dataKey="pemasukan" stroke="#6ED9C4" strokeWidth={3} fillOpacity={1} fill="url(#colorPemasukan)" activeDot={{ r: 6, fill: '#6ED9C4', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="pengeluaran" stroke="#FF8DA1" strokeWidth={3} fillOpacity={1} fill="url(#colorPengeluaran)" activeDot={{ r: 6, fill: '#FF8DA1', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-bl from-purple/5 to-transparent pointer-events-none" />
        <h2 className="mb-4 font-display text-sm font-semibold relative z-10">Kategori Pengeluaran</h2>
        {categoryData.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted dark:text-text-muted-dark relative z-10">Tidak ada pengeluaran periode ini</p>
        ) : (
          <div className="relative z-10">
            <div className="h-44 w-full overflow-hidden mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="total" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                    {categoryData.map((c) => (
                      <Cell key={c.categoryId} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-col gap-5">
              {categoryData.map((c) => (
                <div key={c.categoryId} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${c.color}22` }}>
                        <AppIcon name={c.icon} size={16} style={{ color: c.color }} />
                      </div>
                      <span className="font-semibold text-sm">{c.name}</span>
                      <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark">{c.percentage.toFixed(0)}%</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{formatCurrencyCompact(c.total)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-muted dark:bg-surface-muted-dark overflow-hidden glass-edge shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${c.percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full relative" 
                      style={{ backgroundColor: c.color, boxShadow: `0 0 12px ${c.color}99` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </PageTransition>
  );
}
