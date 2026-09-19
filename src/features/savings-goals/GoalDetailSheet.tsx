import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Sheet } from '../../components/Sheet';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { CurrencyInput } from '../../components/CurrencyInput';
import { ProgressBar } from '../../components/ProgressBar';
import { AppIcon } from '../../lib/icons';
import { Mascot } from '../../components/Mascot';
import { useSavingsStore } from '../../stores/savingsStore';
import { useToastStore } from '../../stores/toastStore';
import { calcSavingsProgress } from '../../domain/reportUseCases';
import { formatCurrency, formatDate } from '../../lib/formatters';
import type { SavingsGoal, SavingsContribution } from '../../db/schema';

const savingsGoalRepo = {
  getContributions: async (goalId: number): Promise<SavingsContribution[]> => [
    { id: 1, goalId, amount: 3500000, date: new Date(Date.now() - 86400000 * 14), note: 'Alokasi Gaji' },
    { id: 2, goalId, amount: 1500000, date: new Date(Date.now() - 86400000 * 5), note: 'Bonus Freelance' },
  ],
};

export function GoalDetailSheet({ goal, onClose }: { goal: SavingsGoal | null; onClose: () => void }) {
  const addFunds = useSavingsStore((s) => s.addFunds);
  const removeGoal = useSavingsStore((s) => s.remove);
  const showToast = useToastStore((s) => s.show);

  const [amount, setAmount] = useState(0);
  const [contributions, setContributions] = useState<SavingsContribution[]>([]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (goal?.id) {
      savingsGoalRepo.getContributions(goal.id).then(setContributions);
    } else {
      setContributions([]);
    }
    setAmount(0);
  }, [goal]);

  if (!goal) return null;
  const percentage = calcSavingsProgress(goal.currentAmount, goal.targetAmount);

  async function handleAddFunds() {
    if (!goal || amount <= 0) return showToast('Nominal harus lebih dari 0', 'error');
    const justCompleted = await addFunds(goal.id!, amount);
    setAmount(0);
    if (goal.id) savingsGoalRepo.getContributions(goal.id).then(setContributions);
    showToast('Dana berhasil ditambahkan', 'success');
    if (justCompleted) setCelebrating(true);
  }

  async function handleDelete() {
    if (!goal) return;
    await removeGoal(goal.id!);
    showToast('Target dihapus', 'info');
    setConfirmingDelete(false);
    onClose();
  }

  return (
    <>
      <Sheet open={!!goal} onClose={onClose} title={goal.name}>
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${goal.color}22` }}>
            <AppIcon name={goal.icon} size={26} style={{ color: goal.color }} />
          </div>
          {goal.description && (
            <p className="max-w-xs text-center text-sm text-text-muted dark:text-text-muted-dark">{goal.description}</p>
          )}
        </div>

        <div className="mt-3">
          <ProgressBar percentage={percentage} color={goal.color} height={12} />
          <div className="mt-2 flex justify-between text-sm">
            <span className="font-semibold tabular-nums">{formatCurrency(goal.currentAmount)}</span>
            <span className="text-text-muted dark:text-text-muted-dark">dari {formatCurrency(goal.targetAmount)}</span>
          </div>
          {goal.targetDate && (
            <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
              Target tanggal {formatDate(goal.targetDate)}
            </p>
          )}
        </div>

        {!goal.isCompleted && (
          <div className="mt-5 flex flex-col gap-3">
            <label className="text-xs font-medium text-text-muted dark:text-text-muted-dark">Tambah Dana</label>
            <CurrencyInput value={amount} onChange={setAmount} />
            <Button onClick={handleAddFunds} fullWidth>
              <Plus size={16} /> Tambah Dana
            </Button>
          </div>
        )}

        {contributions.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-text-muted dark:text-text-muted-dark">Riwayat Kontribusi</p>
            <div className="flex flex-col divide-y divide-border dark:divide-border-dark rounded-2xl bg-surface-muted dark:bg-surface-muted-dark px-4">
              {contributions.map((c) => (
                <div key={c.id} className="flex justify-between py-2.5 text-sm">
                  <span className="text-text-muted dark:text-text-muted-dark">{formatDate(c.date)}</span>
                  <span className="font-medium tabular-nums">+{formatCurrency(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="danger" fullWidth className="mt-5" onClick={() => setConfirmingDelete(true)}>
          <Trash2 size={16} /> Hapus Target
        </Button>
      </Sheet>

      <Modal open={confirmingDelete} onClose={() => setConfirmingDelete(false)}>
        <h3 className="font-display text-lg font-semibold">Hapus target ini?</h3>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
          Riwayat kontribusi target ini juga akan terhapus. Saldo akun tidak terpengaruh.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setConfirmingDelete(false)}>Batal</Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>Hapus</Button>
        </div>
      </Modal>

      {celebrating && (
        <div
          className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-3 bg-black/40"
          onClick={() => setCelebrating(false)}
        >
          <div className="relative flex flex-col items-center gap-3 rounded-card bg-surface dark:bg-surface-dark p-8 text-center" style={{ animation: 'pop-in 0.3s ease-out' }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="absolute top-0 h-2 w-2 rounded-full"
                style={{
                  left: `${10 + i * 8}%`,
                  backgroundColor: ['#7C6FE0', '#FFB088', '#6ED9C4', '#FF8DA1', '#7FB8E8'][i % 5],
                  animation: `confetti-fall ${0.8 + (i % 3) * 0.2}s ease-in ${i * 0.05}s infinite`,
                }}
              />
            ))}
            <Mascot mood="excited" size={100} />
            <h3 className="font-display text-xl font-bold">Target Tercapai! 🎉</h3>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              Selamat, kamu berhasil mencapai target "{goal.name}"
            </p>
            <Button onClick={() => setCelebrating(false)}>Asyik!</Button>
          </div>
        </div>
      )}
    </>
  );
}
