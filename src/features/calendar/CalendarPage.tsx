import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
  formatMonthYear, addMonths, daysInMonth, firstWeekdayOfMonth, isSameDay, isToday, formatDateLong,
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
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const daysWithTx = useMemo(() => new Set(transactions.map((t) => t.date.toDateString())), [transactions]);

  const totalDays = daysInMonth(cursor);
  const firstWeekday = firstWeekdayOfMonth(cursor);
  const cells: (Date | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];

  const dayTransactions = transactions
    .filter((t) => isSameDay(t.date, selectedDate))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  useEffect(() => {
    setPage(1);
  }, [selectedDate]);

  const totalPages = Math.ceil(dayTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(
    () => dayTransactions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [dayTransactions, page]
  );

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/" className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Kalender Transaksi</h1>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setCursor((c) => addMonths(c, -1))} className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
            <ChevronLeft size={18} />
          </button>
          <p className="font-display text-sm font-semibold">{formatMonthYear(cursor)}</p>
          <button onClick={() => setCursor((c) => addMonths(c, 1))} className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-[11px] font-medium text-text-muted dark:text-text-muted-dark">
              {d}
            </div>
          ))}
          {cells.map((date, i) => (
            <button
              key={i}
              disabled={!date}
              onClick={() => date && setSelectedDate(date)}
              className={clsx(
                'relative aspect-square rounded-xl text-sm transition-colors',
                !date && 'invisible',
                date && isSameDay(date, selectedDate)
                  ? 'bg-purple text-white font-semibold'
                  : date && isToday(date)
                    ? 'bg-purple/10 text-purple font-semibold'
                    : 'hover:bg-surface-muted dark:hover:bg-surface-muted-dark'
              )}
            >
              {date?.getDate()}
              {date && daysWithTx.has(date.toDateString()) && (
                <span
                  className={clsx(
                    'absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                    isSameDay(date, selectedDate) ? 'bg-white' : 'bg-peach'
                  )}
                />
              )}
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-text-muted dark:text-text-muted-dark">
          {formatDateLong(selectedDate)}
        </p>
        {dayTransactions.length === 0 ? (
          <Card>
            <EmptyState title="Tidak ada transaksi" mood="idle" />
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
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold disabled:opacity-50 dark:bg-surface-dark card-shadow"
            >
              Sebelumnya
            </button>
            <span className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold disabled:opacity-50 dark:bg-surface-dark card-shadow"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>

      <TransactionDetailSheet transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}
