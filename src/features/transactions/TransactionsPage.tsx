import { useMemo, useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import clsx from 'clsx';
import { useTransactionStore } from '../../stores/transactionStore';
import { useAccountStore } from '../../stores/accountStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { EmptyState } from '../../components/EmptyState';
import { TransactionListItem } from './TransactionListItem';
import { TransactionDetailSheet } from './TransactionDetailSheet';
import { ExportDataSheet } from './ExportDataSheet';
import type { Transaction, TransactionType } from '../../db/schema';
import { formatDateLong, isSameDay } from '../../lib/formatters';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/Skeleton';
import { haptic } from '../../lib/haptic';
import { PageTransition } from '../../components/PageTransition';
import { motion } from 'framer-motion';

type FilterTab = 'all' | TransactionType;

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'income', label: 'Pemasukan' },
  { key: 'expense', label: 'Pengeluaran' },
  { key: 'transfer', label: 'Transfer' },
];

export function TransactionsPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const loading = useTransactionStore((s) => s.loading);
  const accounts = useAccountStore((s) => s.accounts);
  const categories = useCategoryStore((s) => s.categories);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [showExport, setShowExport] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Sembunyikan transaksi tipe "adjustment" (penyesuaian saldo) dari daftar
  const visibleTransactions = useMemo(
    () => transactions.filter((t) => t.type !== 'adjustment'),
    [transactions]
  );

  const filtered = useMemo(
    () => (filter === 'all' ? visibleTransactions : visibleTransactions.filter((t) => t.type === filter)),
    [visibleTransactions, filter]
  );

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page]
  );

  const groups = useMemo(() => {
    const map: { date: Date; items: Transaction[] }[] = [];
    for (const t of paginated) {
      const existing = map.find((g) => isSameDay(g.date, t.date));
      if (existing) existing.items.push(t);
      else map.push({ date: t.date, items: [t] });
    }
    return map;
  }, [paginated]);

  return (
    <PageTransition className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6 min-h-dvh bg-bg dark:bg-bg-dark">
      <div className="glass-header -mx-4 md:-mx-8 lg:-mx-10 px-4 md:px-8 lg:px-10 py-4 -mt-6 mb-5 pt-6 z-50 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Transaksi</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExport(true)}
            aria-label="Export Data"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow text-emerald-500"
          >
            <Download size={18} />
          </button>
          <Link
            to="/cari"
            aria-label="Cari transaksi"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow"
          >
            <Search size={18} />
          </Link>
        </div>
      </div>

      <div className="mb-6 flex gap-1.5 overflow-x-auto no-scrollbar rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-1.5 border border-border/50 dark:border-border-dark/50">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); haptic.light(); }}
            className={clsx(
              'relative flex-1 shrink-0 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors',
              filter === f.key
                ? 'text-white'
                : 'text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-white'
            )}
          >
            {filter === f.key && (
              <motion.div
                layoutId="activeTransactionFilter"
                className="absolute inset-0 rounded-xl bg-purple shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{f.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-5">
          {[1, 2].map((group) => (
            <div key={group}>
              <Skeleton variant="text" className="h-4 w-24 mb-2" />
              <div className="flex flex-col gap-2 rounded-3xl bg-surface dark:bg-surface-dark p-2 card-shadow border border-border dark:border-border-dark glass-edge">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-2">
                    <Skeleton variant="icon" className="h-10 w-10 shrink-0" />
                    <div className="flex-1">
                      <Skeleton variant="text" className="h-4 w-32 mb-1" />
                      <Skeleton variant="text" className="h-3 w-16" />
                    </div>
                    <Skeleton variant="text" className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Tap tombol (+) untuk mencatat transaksi pertamamu"
          mood="idle"
        />
      ) : (
        <>
          <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.date.toISOString()}>
              <p className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-widest text-purple/80 dark:text-purple-light/80 drop-shadow-sm">
                {formatDateLong(group.date)}
              </p>
              <div className="flex flex-col gap-1 rounded-3xl bg-surface dark:bg-surface-dark p-2 card-shadow border border-border dark:border-border-dark glass-edge relative">
                {group.items.map((t) => (
                  <TransactionListItem
                    key={t.id}
                    transaction={t}
                    accounts={accounts}
                    categories={categories}
                    onClick={() => setSelected(t)}
                  />
                ))}
              </div>
            </div>
          ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
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
        </>
      )}

      <TransactionDetailSheet transaction={selected} onClose={() => setSelected(null)} />
      <ExportDataSheet open={showExport} onClose={() => setShowExport(false)} />
    </PageTransition>
  );
}
