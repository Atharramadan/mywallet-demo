import { useMemo, useState } from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { TransactionListItem } from '../transactions/TransactionListItem';
import { TransactionDetailSheet } from '../transactions/TransactionDetailSheet';
import { useTransactionStore } from '../../stores/transactionStore';
import { useAccountStore } from '../../stores/accountStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { searchTransactions } from '../../domain/searchUseCases';
import type { Transaction } from '../../db/schema';

export function SearchPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const accounts = useAccountStore((s) => s.accounts);
  const categories = useCategoryStore((s) => s.categories);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Transaction | null>(null);

  const results = useMemo(
    () => searchTransactions(query, transactions, accounts, categories),
    [query, transactions, accounts, categories]
  );

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/transaksi" className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Cari Transaksi</h1>
      </div>

      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3">
        <SearchIcon size={18} className="text-text-muted dark:text-text-muted-dark" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama, akun, kategori, tanggal, atau nominal"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {query.trim() === '' ? (
        <EmptyState title="Cari transaksi" description="Ketik nama, akun, kategori, atau nominal" mood="idle" />
      ) : results.length === 0 ? (
        <EmptyState title="Tidak ditemukan" description={`Tidak ada transaksi yang cocok dengan "${query}"`} mood="thinking" />
      ) : (
        <div className="flex flex-col gap-2 rounded-card bg-surface dark:bg-surface-dark p-2 card-shadow">
          {results.map((t) => (
            <TransactionListItem
              key={t.id}
              transaction={t}
              accounts={accounts}
              categories={categories}
              onClick={() => setSelected(t)}
            />
          ))}
        </div>
      )}

      <TransactionDetailSheet transaction={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
