import { RotateCcw, Sparkles } from 'lucide-react';
import { demoStorage } from '../lib/storage';
import { useAccountStore } from '../stores/accountStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useSavingsStore } from '../stores/savingsStore';
import { useWealthStore } from '../stores/wealthStore';
import { useBudgetStore } from '../stores/budgetStore';
import { useToastStore } from '../stores/toastStore';

export function DemoBanner() {
  const showToast = useToastStore((s) => s.show);

  const handleReset = async () => {
    demoStorage.resetAll();
    await Promise.all([
      useAccountStore.getState().refresh(),
      useTransactionStore.getState().refresh(),
      useSavingsStore.getState().refresh(),
      useWealthStore.getState().refresh(),
      useBudgetStore.getState().refresh(),
    ]);
    showToast('Data demo berhasil di-reset ke kondisi awal!', 'info');
  };

  return (
    <div className="w-full bg-linear-to-r from-purple/15 via-lavender/20 to-mint/15 dark:from-purple/25 dark:via-lavender/20 dark:to-mint/20 border-b border-purple/20 px-3 py-2 text-xs flex items-center justify-between gap-2 shadow-xs">
      <div className="flex items-center gap-2 truncate">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple text-white shadow-xs">
          <Sparkles size={11} />
        </span>
        <span className="font-semibold text-text dark:text-text-dark truncate">
          <strong className="text-purple dark:text-lavender">Mode Demo Portofolio</strong> — Dibuat oleh Athar Ramadhan
        </span>
      </div>
      <button
        onClick={handleReset}
        title="Reset kembali ke data simulasi awal"
        className="flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-[11px] font-bold text-text dark:text-text-dark hover:border-purple/50 active:scale-95 transition-all shadow-xs"
      >
        <RotateCcw size={11} className="text-purple" />
        <span>Reset Data</span>
      </button>
    </div>
  );
}
