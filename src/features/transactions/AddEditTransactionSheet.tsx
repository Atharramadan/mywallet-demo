import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Sheet } from '../../components/Sheet';
import { Button } from '../../components/Button';
import { CurrencyInput } from '../../components/CurrencyInput';
import { AppIcon } from '../../lib/icons';
import { useAccountStore, activeAccounts } from '../../stores/accountStore';
import { formatDatetimeLocal } from '../../lib/formatters';
import { useCategoryStore } from '../../stores/categoryStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { useToastStore } from '../../stores/toastStore';
import { haptic } from '../../lib/haptic';

type Tab = 'expense' | 'income' | 'transfer';


const TAB_LABEL: Record<Tab, string> = {
  expense: 'Pengeluaran',
  income: 'Pemasukan',
  transfer: 'Transfer',
};

export function AddEditTransactionSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('expense');
  const accounts = activeAccounts(useAccountStore((s) => s.accounts));
  const categories = useCategoryStore((s) => s.categories);
  const { addExpense, addIncome, addTransfer, edit, editingTransaction, setEditingTransaction } = useTransactionStore();
  const showToast = useToastStore((s) => s.show);

  const [accountId, setAccountId] = useState<number | ''>('');
  const [toAccountId, setToAccountId] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => formatDatetimeLocal());
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!editingTransaction;

  useEffect(() => {
    if (editingTransaction) {
      setTab(editingTransaction.type === 'adjustment' ? 'expense' : editingTransaction.type);
      setAccountId(editingTransaction.accountId);
      setToAccountId(editingTransaction.toAccountId || '');
      setCategoryId(editingTransaction.categoryId || '');
      setAmount(Math.abs(editingTransaction.amount));
      setNote(editingTransaction.note || '');
      setDate(formatDatetimeLocal(new Date(editingTransaction.date)));
    }
  }, [editingTransaction]);

  const relevantCategories = categories.filter(
    (c) => !c.isArchived && c.type === (tab === 'income' ? 'income' : 'expense')
  );

  function resetForm() {
    setAccountId('');
    setToAccountId('');
    setCategoryId('');
    setAmount(0);
    setNote('');
    setDate(formatDatetimeLocal());
  }

  function handleClose() {
    resetForm();
    setTab('expense');
    setEditingTransaction(null);
    onClose();
  }

  async function handleSubmit() {
    if (amount <= 0) return showToast('Nominal harus lebih dari 0', 'error');
    if (!accountId) return showToast('Pilih akun terlebih dahulu', 'error');
    if (tab !== 'transfer' && !categoryId) return showToast('Pilih kategori terlebih dahulu', 'error');
    if (tab === 'transfer' && !toAccountId) return showToast('Pilih akun tujuan', 'error');
    if (tab === 'transfer' && toAccountId === accountId) return showToast('Akun asal dan tujuan tidak boleh sama', 'error');

    setSubmitting(true);
    try {
      const parsedDate = new Date(date);
      
      if (isEditing && editingTransaction) {
        edit(editingTransaction, {
          type: tab,
          accountId: Number(accountId),
          categoryId: tab !== 'transfer' ? Number(categoryId) : undefined,
          toAccountId: tab === 'transfer' ? Number(toAccountId) : undefined,
          amount,
          note,
          date: parsedDate
        }).catch(err => showToast(err.message || 'Gagal memperbarui', 'error'));
        showToast('Transaksi berhasil diperbarui', 'success');
      } else {
        if (tab === 'expense') {
          addExpense({ accountId: Number(accountId), categoryId: Number(categoryId), amount, note, date: parsedDate })
            .catch(err => showToast(err.message || 'Gagal menyimpan', 'error'));
        } else if (tab === 'income') {
          addIncome({ accountId: Number(accountId), categoryId: Number(categoryId), amount, note, date: parsedDate })
            .catch(err => showToast(err.message || 'Gagal menyimpan', 'error'));
        } else {
          addTransfer({ fromAccountId: Number(accountId), toAccountId: Number(toAccountId), amount, note, date: parsedDate })
            .catch(err => showToast(err.message || 'Gagal menyimpan', 'error'));
        }
        haptic.success();
        showToast('Transaksi berhasil disimpan', 'success');
      }
      handleClose();
    } catch (err) {
      haptic.error();
      showToast(err instanceof Error ? err.message : 'Gagal menyimpan transaksi', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open || isEditing} onClose={handleClose} title={isEditing ? "Edit Transaksi" : "Tambah Transaksi"}>
      <div className="mb-5 flex gap-1.5 rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-1.5">
        {(['expense', 'income', 'transfer'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); haptic.light(); }}
            className={clsx(
              'flex-1 rounded-xl py-2 text-sm font-semibold transition-colors',
              tab === t
                ? t === 'expense'
                  ? 'bg-rose text-white'
                  : t === 'income'
                    ? 'bg-mint text-white'
                    : 'bg-blue text-white'
                : 'text-text-muted dark:text-text-muted-dark'
            )}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
            {tab === 'transfer' ? 'Dari Akun' : tab === 'income' ? 'Ke Akun' : 'Dari Akun'}
          </label>
          <SelectField
            value={accountId}
            onChange={(v) => setAccountId(v)}
            placeholder="Pilih akun"
            options={accounts.map((a) => ({ value: a.id!, label: a.name, icon: a.icon, color: a.color }))}
          />
        </div>

        {tab === 'transfer' && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Ke Akun</label>
            <SelectField
              value={toAccountId}
              onChange={(v) => setToAccountId(v)}
              placeholder="Pilih akun tujuan"
              options={accounts.filter((a) => a.id !== accountId).map((a) => ({ value: a.id!, label: a.name, icon: a.icon, color: a.color }))}
            />
          </div>
        )}

        {tab !== 'transfer' && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Kategori</label>
            <SelectField
              value={categoryId}
              onChange={(v) => setCategoryId(v)}
              placeholder="Pilih kategori"
              options={relevantCategories.map((c) => ({ value: c.id!, label: c.name, icon: c.icon, color: c.color }))}
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Waktu</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 text-base outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Nominal</label>
          <CurrencyInput value={amount} onChange={setAmount} autoFocus />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Catatan (opsional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Contoh: Makan siang di warung"
            className="w-full resize-none rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 text-base outline-none placeholder:text-text-muted/50"
          />
        </div>

        <Button onClick={handleSubmit} disabled={submitting} fullWidth size="lg">
          {isEditing ? 'Simpan Perubahan' : 'Simpan Transaksi'}
        </Button>
      </div>
    </Sheet>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: number | '';
  onChange: (v: number | '') => void;
  options: { value: number; label: string; icon: string; color: string }[];
  placeholder: string;
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer text-base opacity-0"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-3 rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3.5 peer-focus:ring-2 peer-focus:ring-purple">
        {selected ? (
          <>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${selected.color}22` }}>
              <AppIcon name={selected.icon} size={14} style={{ color: selected.color }} />
            </div>
            <span className="text-sm font-medium">{selected.label}</span>
          </>
        ) : (
          <span className="text-sm text-text-muted dark:text-text-muted-dark">{placeholder}</span>
        )}
      </div>
    </div>
  );
}
