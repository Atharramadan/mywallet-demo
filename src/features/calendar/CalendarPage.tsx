import { useMemo, useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Flame,
  Target,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { TransactionListItem } from '../transactions/TransactionListItem';
import { TransactionDetailSheet } from '../transactions/TransactionDetailSheet';
import { useTransactionStore } from '../../stores/transactionStore';
import { useAccountStore } from '../../stores/accountStore';
import { useCategoryStore } from '../../stores/categoryStore';
import {
  formatMonthYear,
  addMonths,
  daysInMonth,
  firstWeekdayOfMonth,
  isSameDay,
  isToday,
  formatDateLong,
  formatCurrency,
} from '../../lib/formatters';
import type { Transaction } from '../../db/schema';

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function CalendarPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const accounts = useAccountStore((s) => s.accounts);
  const categories = useCategoryStore((s) => s.categories);
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [calendarMode, setCalendarMode] = useState<'calendar' | 'heatmap'>('heatmap');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const daysWithTx = useMemo(() => new Set(transactions.map((t) => t.date.toDateString())), [transactions]);

  const totalDays = daysInMonth(cursor);
  const firstWeekday = firstWeekdayOfMonth(cursor);
  const cells: (Date | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];

  // Transactions for selected date
  const dayTransactions = useMemo(
    () =>
      transactions
        .filter((t) => isSameDay(t.date, selectedDate))
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    [transactions, selectedDate]
  );

  const dayIncome = useMemo(
    () => dayTransactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
    [dayTransactions]
  );

  const dayExpense = useMemo(
    () => dayTransactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
    [dayTransactions]
  );

  // Month-wide aggregations for Heatmap & Habit Tracker
  const monthTransactions = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    return transactions.filter(
      (t) => t.date.getFullYear() === year && t.date.getMonth() === month
    );
  }, [transactions, cursor]);

  const {
    dayExpenses,
    dayIncomes,
    noSpendCount,
    peakDay,
    avgDailyExpense,
    currentStreak,
  } = useMemo(() => {
    const expenses = new Map<number, number>();
    const incomes = new Map<number, number>();

    monthTransactions.forEach((t) => {
      const d = t.date.getDate();
      if (t.type === 'expense') {
        expenses.set(d, (expenses.get(d) || 0) + t.amount);
      } else if (t.type === 'income') {
        incomes.set(d, (incomes.get(d) || 0) + t.amount);
      }
    });

    const activeExpenseValues: number[] = [];
    let maxExpense = 0;
    let peakDayNum: number | null = null;

    const daysCount = daysInMonth(cursor);
    const now = new Date();
    const isCurrentMonth =
      cursor.getFullYear() === now.getFullYear() && cursor.getMonth() === now.getMonth();
    const evaluatedDays = isCurrentMonth ? now.getDate() : daysCount;

    let noSpends = 0;
    for (let day = 1; day <= evaluatedDays; day++) {
      const exp = expenses.get(day) || 0;
      if (exp === 0) {
        noSpends++;
      } else {
        activeExpenseValues.push(exp);
        if (exp > maxExpense) {
          maxExpense = exp;
          peakDayNum = day;
        }
      }
    }

    const avgDaily =
      activeExpenseValues.length > 0
        ? activeExpenseValues.reduce((a, b) => a + b, 0) / activeExpenseValues.length
        : 0;

    // Calculate streak of no-spend days up to today
    let streak = 0;
    if (isCurrentMonth) {
      for (let day = now.getDate(); day >= 1; day--) {
        const exp = expenses.get(day) || 0;
        if (exp === 0) {
          streak++;
        } else {
          break;
        }
      }
    }

    return {
      dayExpenses: expenses,
      dayIncomes: incomes,
      noSpendCount: noSpends,
      peakDay: peakDayNum ? { day: peakDayNum, amount: maxExpense } : null,
      avgDailyExpense: avgDaily,
      currentStreak: streak,
    };
  }, [monthTransactions, cursor]);

  useEffect(() => {
    setPage(1);
  }, [selectedDate]);

  const totalPages = Math.ceil(dayTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(
    () => dayTransactions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [dayTransactions, page]
  );

  // Helper to determine Heatmap cell style
  const getHeatmapStyle = (date: Date) => {
    const day = date.getDate();
    const exp = dayExpenses.get(day) || 0;
    const inc = dayIncomes.get(day) || 0;

    const isSelected = isSameDay(date, selectedDate);

    if (exp === 0) {
      // No Spend / Surplus Day: Fresh Mint/Emerald
      return {
        bg: isSelected
          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25',
        badge: 'Free',
        dotColor: 'bg-emerald-500',
        label: 'Bebas Belanja (Rp 0)',
      };
    }

    if (inc > exp) {
      // Surplus Day: Net Positive
      return {
        bg: isSelected
          ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-400'
          : 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 hover:bg-teal-500/25',
        badge: 'Surplus',
        dotColor: 'bg-teal-500',
        label: `Surplus (+${formatCurrency(inc - exp)})`,
      };
    }

    if (avgDailyExpense > 0 && exp <= 0.5 * avgDailyExpense) {
      // Low Spend (< 50% avg): Neutral / Hemat
      return {
        bg: isSelected
          ? 'bg-purple text-white shadow-md ring-2 ring-purple/50'
          : 'bg-surface-muted text-text dark:text-text-dark border border-border/60 hover:border-purple/30',
        badge: 'Hemat',
        dotColor: 'bg-slate-400',
        label: `Hemat (${formatCurrency(exp)})`,
      };
    }

    if (avgDailyExpense > 0 && exp <= 1.2 * avgDailyExpense) {
      // Moderate Spend (50% - 120% avg): Warm Amber
      return {
        bg: isSelected
          ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25',
        badge: 'Wajar',
        dotColor: 'bg-amber-500',
        label: `Wajar (${formatCurrency(exp)})`,
      };
    }

    // High Spend (> 120% avg): Coral / Rose High Outflow
    return {
      bg: isSelected
        ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400'
        : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 shadow-xs',
      badge: 'Boros',
      dotColor: 'bg-rose-500',
      label: `Tinggi (${formatCurrency(exp)})`,
    };
  };

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      {/* Top Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold">Kalender Transaksi</h1>
            <p className="text-[11px] text-text-muted dark:text-text-muted-dark">
              Peta Pengeluaran & Analisis Kebiasaan Finansial
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const today = new Date();
            setCursor(today);
            setSelectedDate(today);
          }}
          className="rounded-xl border border-border dark:border-border-dark px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-purple dark:text-text-muted-dark dark:hover:text-white hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <CalendarIcon size={14} />
          Hari Ini
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* KOLOM KIRI (Desktop): Kalender & Financial Heatmap */}
        <div className="w-full lg:w-[380px] xl:w-[410px] shrink-0 lg:sticky lg:top-6">
          <Card>
            {/* Month Selector */}
            <div className="mb-3.5 flex items-center justify-between">
              <button
                onClick={() => setCursor((c) => addMonths(c, -1))}
                className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors cursor-pointer"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft size={18} />
              </button>
              <p className="font-display text-sm font-bold">{formatMonthYear(cursor)}</p>
              <button
                onClick={() => setCursor((c) => addMonths(c, 1))}
                className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors cursor-pointer"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-muted dark:bg-surface-muted-dark border border-border/60 mb-4">
              <button
                onClick={() => setCalendarMode('heatmap')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  calendarMode === 'heatmap'
                    ? 'bg-purple text-white shadow-xs'
                    : 'text-text-muted dark:text-text-muted-dark hover:text-purple dark:hover:text-white'
                }`}
              >
                <Sparkles size={13} />
                Peta Panas (Heatmap)
              </button>
              <button
                onClick={() => setCalendarMode('calendar')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  calendarMode === 'calendar'
                    ? 'bg-purple text-white shadow-xs'
                    : 'text-text-muted dark:text-text-muted-dark hover:text-purple dark:hover:text-white'
                }`}
              >
                <CalendarIcon size={13} />
                Kalender Standar
              </button>
            </div>

            {/* Habit Tracker Quick Metric Chips */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <Target size={15} className="text-emerald-500 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-text-muted dark:text-text-muted-dark block">
                    Bebas Belanja
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {noSpendCount} Hari
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <Flame size={15} className="text-amber-500 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-text-muted dark:text-text-muted-dark block">
                    Streak Bebas
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {currentStreak} Hari
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-muted dark:bg-surface-muted-dark border border-border/50 text-xs">
                <TrendingDown size={15} className="text-blue shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-text-muted dark:text-text-muted-dark block">
                    Rata-rata/Hari
                  </span>
                  <span className="font-bold text-text dark:text-white tabular-nums">
                    {formatCurrency(avgDailyExpense)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <span className="text-xs">⚡</span>
                <div className="truncate">
                  <span className="text-[10px] text-text-muted dark:text-text-muted-dark block">
                    Puncak Boros
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {peakDay ? `Tgl ${peakDay.day}` : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Calendar / Heatmap Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="py-1 text-[11px] font-semibold text-text-muted dark:text-text-muted-dark"
                >
                  {d}
                </div>
              ))}

              {cells.map((date, i) => {
                if (!date) {
                  return <div key={i} className="aspect-square invisible" />;
                }

                const isSelected = isSameDay(date, selectedDate);
                const isCurrentToday = isToday(date);
                const hasTx = daysWithTx.has(date.toDateString());

                if (calendarMode === 'heatmap') {
                  const heat = getHeatmapStyle(date);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      title={`Tgl ${date.getDate()}: ${heat.label}`}
                      className={clsx(
                        'relative aspect-square rounded-xl text-xs transition-all flex flex-col items-center justify-center font-bold cursor-pointer',
                        heat.bg,
                        isCurrentToday && !isSelected && 'ring-2 ring-purple/60'
                      )}
                    >
                      <span className="leading-none">{date.getDate()}</span>
                      {hasTx && (
                        <span
                          className={clsx(
                            'mt-1 h-1 w-1 rounded-full',
                            isSelected ? 'bg-white' : heat.dotColor
                          )}
                        />
                      )}
                    </button>
                  );
                }

                // Standard Calendar Mode
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={clsx(
                      'relative aspect-square rounded-xl text-sm transition-all flex items-center justify-center font-medium cursor-pointer',
                      isSelected
                        ? 'bg-purple text-white font-semibold shadow-xs'
                        : isCurrentToday
                        ? 'bg-purple/10 text-purple font-semibold'
                        : 'hover:bg-surface-muted dark:hover:bg-surface-muted-dark text-text dark:text-white'
                    )}
                  >
                    {date.getDate()}
                    {hasTx && (
                      <span
                        className={clsx(
                          'absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                          isSelected ? 'bg-white' : 'bg-peach'
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Heatmap Legend */}
            {calendarMode === 'heatmap' && (
              <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500/40 border border-emerald-500" />
                  <span className="text-text-muted dark:text-text-muted-dark">Bebas Belanja</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-surface-muted border border-border" />
                  <span className="text-text-muted dark:text-text-muted-dark">Hemat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-amber-500/40 border border-amber-500" />
                  <span className="text-text-muted dark:text-text-muted-dark">Wajar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-rose-500/40 border border-rose-500" />
                  <span className="text-text-muted dark:text-text-muted-dark">Boros</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* KOLOM KANAN (Desktop): Riwayat Transaksi */}
        <div className="flex-1 min-w-0 w-full">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h2 className="font-display text-sm font-bold text-text dark:text-text-dark">
                {formatDateLong(selectedDate)}
              </h2>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                {dayTransactions.length} transaksi tercatat
              </p>
            </div>
            {dayTransactions.length > 0 && (
              <div className="flex items-center gap-3 text-xs">
                {dayIncome > 0 && (
                  <span className="font-semibold text-mint">
                    +{formatCurrency(dayIncome)}
                  </span>
                )}
                {dayExpense > 0 && (
                  <span className="font-semibold text-coral">
                    -{formatCurrency(dayExpense)}
                  </span>
                )}
              </div>
            )}
          </div>

          {dayTransactions.length === 0 ? (
            <Card>
              <EmptyState title="Tidak ada transaksi pada tanggal ini" mood="idle" />
            </Card>
          ) : (
            <div className="flex flex-col gap-2 rounded-card bg-surface dark:bg-surface-dark p-2 card-shadow">
              {paginatedTransactions.map((t) => (
                <TransactionListItem
                  key={t.id}
                  transaction={t}
                  accounts={accounts}
                  categories={categories}
                  onClick={() => setSelectedTx(t)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold disabled:opacity-50 dark:bg-surface-dark card-shadow cursor-pointer"
              >
                Sebelumnya
              </button>
              <span className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold disabled:opacity-50 dark:bg-surface-dark card-shadow cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>

      <TransactionDetailSheet transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}
