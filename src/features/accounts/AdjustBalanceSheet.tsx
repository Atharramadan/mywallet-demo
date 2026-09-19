import { useEffect, useState } from 'react';
import { Sheet } from '../../components/Sheet';
import { Button } from '../../components/Button';
import { CurrencyInput } from '../../components/CurrencyInput';
import { useTransactionStore } from '../../stores/transactionStore';
import { useToastStore } from '../../stores/toastStore';
import { formatCurrency } from '../../lib/formatters';
import type { Account } from '../../db/schema';

export function AdjustBalanceSheet({ account, onClose }: { account: Account | null; onClose: () => void }) {
  const addAdjustment = useTransactionStore((s) => s.addAdjustment);
  const showToast = useToastStore((s) => s.show);
  const [actual, setActual] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (account) setActual(account.balance);
  }, [account]);

  if (!account) return null;
  const diff = actual - account.balance;

  async function handleSubmit() {
    if (!account) return;
    setSubmitting(true);
    try {
      if (diff !== 0) {
        await addAdjustment(account.id!, actual);
        showToast('Saldo berhasil disesuaikan', 'success');
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={!!account} onClose={onClose} title={`Sesuaikan Saldo — ${account.name}`}>
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-3 text-sm">
          <span className="text-text-muted dark:text-text-muted-dark">Saldo di aplikasi: </span>
          <span className="font-semibold tabular-nums">{formatCurrency(account.balance)}</span>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
            Saldo Aktual
          </label>
          <CurrencyInput value={actual} onChange={setActual} autoFocus />
        </div>

        {diff !== 0 && (
          <div
            className={`rounded-2xl p-3 text-sm ${diff > 0 ? 'bg-mint/15' : 'bg-rose/15'}`}
          >
            Selisih:{' '}
            <span className="font-semibold tabular-nums">
              {diff > 0 ? '+' : ''}
              {formatCurrency(diff)}
            </span>{' '}
            — akan dibuat transaksi koreksi otomatis.
          </div>
        )}

        <Button onClick={handleSubmit} disabled={submitting} fullWidth size="lg">
          Simpan Penyesuaian
        </Button>
      </div>
    </Sheet>
  );
}
