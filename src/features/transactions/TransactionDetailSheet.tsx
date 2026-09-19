import { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { Sheet } from '../../components/Sheet';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { AppIcon } from '../../lib/icons';
import { useAccountStore } from '../../stores/accountStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { useToastStore } from '../../stores/toastStore';
import { formatCurrency, formatDateLong } from '../../lib/formatters';
import type { Transaction } from '../../db/schema';

const TYPE_LABEL: Record<Transaction['type'], string> = {
  expense: 'Pengeluaran',
  income: 'Pemasukan',
  transfer: 'Transfer',
  adjustment: 'Penyesuaian Saldo',
};

export function TransactionDetailSheet({
  transaction,
  onClose,
}: {
  transaction: Transaction | null;
  onClose: () => void;
}) {
  const accounts = useAccountStore((s) => s.accounts);
  const categories = useCategoryStore((s) => s.categories);
  const removeTransaction = useTransactionStore((s) => s.remove);
  const setEditingTransaction = useTransactionStore((s) => s.setEditingTransaction);
  const showToast = useToastStore((s) => s.show);
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!transaction) return null;

  const account = accounts.find((a) => a.id === transaction.accountId);
  const toAccount = accounts.find((a) => a.id === transaction.toAccountId);
  const category = categories.find((c) => c.id === transaction.categoryId);

  async function handleDelete() {
    if (!transaction || isDeleting) return;
    setIsDeleting(true);
    try {
      await removeTransaction(transaction);
      showToast('Transaksi dihapus', 'info');
      setConfirming(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Sheet open={!!transaction} onClose={onClose} title="Detail Transaksi">
        <div className="flex flex-col items-center gap-2 py-2">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${category?.color ?? '#7C6FE0'}22` }}
          >
            <AppIcon name={category?.icon ?? 'card'} size={26} style={{ color: category?.color ?? '#7C6FE0' }} />
          </div>
          <p
            className={`font-display text-2xl font-bold tabular-nums ${
              transaction.type === 'expense' ? 'text-rose' : transaction.type === 'income' ? 'text-mint' : ''
            }`}
          >
            {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
            {formatCurrency(Math.abs(transaction.amount))}
          </p>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">{TYPE_LABEL[transaction.type]}</p>
        </div>

        <div className="mt-4 flex flex-col divide-y divide-border dark:divide-border-dark rounded-2xl bg-surface-muted dark:bg-surface-muted-dark px-4">
          <Row label="Tanggal" value={formatDateLong(transaction.date)} />
          {category && <Row label="Kategori" value={category.name} />}
          <Row label={transaction.type === 'transfer' ? 'Dari Akun' : 'Akun'} value={account?.name ?? '-'} />
          {toAccount && <Row label="Ke Akun" value={toAccount.name} />}
          {transaction.note && <Row label="Catatan" value={transaction.note} />}
        </div>

        <div className="mt-5 flex gap-3">
          {transaction.type !== 'adjustment' && (
            <Button variant="secondary" fullWidth onClick={() => { setEditingTransaction(transaction); onClose(); }}>
              <Edit2 size={16} /> Edit Transaksi
            </Button>
          )}
          <Button variant="danger" fullWidth onClick={() => setConfirming(true)}>
            <Trash2 size={16} /> Hapus Transaksi
          </Button>
        </div>
      </Sheet>

      <Modal open={confirming} onClose={() => setConfirming(false)}>
        <h3 className="font-display text-lg font-semibold">Hapus transaksi ini?</h3>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
          Saldo akun terkait akan dikembalikan seperti sebelum transaksi ini dibuat.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setConfirming(false)}>
            Batal
          </Button>
          <Button variant="danger" fullWidth onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </Modal>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <span className="text-text-muted dark:text-text-muted-dark">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
