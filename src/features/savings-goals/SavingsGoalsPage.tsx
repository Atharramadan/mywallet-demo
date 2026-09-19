import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { EmptyState } from '../../components/EmptyState';
import { AppIcon } from '../../lib/icons';
import { useSavingsStore } from '../../stores/savingsStore';
import { formatCurrency } from '../../lib/formatters';
import { calcSavingsProgress } from '../../domain/reportUseCases';
import { AddGoalSheet } from './AddGoalSheet';
import { GoalDetailSheet } from './GoalDetailSheet';
import type { SavingsGoal } from '../../db/schema';

export function SavingsGoalsPage() {
  const goals = useSavingsStore((s) => s.goals);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<SavingsGoal | null>(null);

  const ongoing = goals.filter((g) => !g.isCompleted);
  const completed = goals.filter((g) => g.isCompleted);

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/" className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Target Tabungan</h1>
      </div>

      {goals.length === 0 ? (
        <Card>
          <EmptyState
            title="Belum ada target"
            description="Buat target tabungan pertamamu, misalnya Dana Darurat atau Liburan"
            mood="happy"
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {[...ongoing, ...completed].map((goal) => {
            const percentage = calcSavingsProgress(goal.currentAmount, goal.targetAmount);
            return (
              <Card key={goal.id} className="cursor-pointer" onClick={() => setSelected(goal)}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${goal.color}22` }}>
                    <AppIcon name={goal.icon} size={20} style={{ color: goal.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{goal.name}</p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      Target {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  {goal.isCompleted && <span className="shrink-0 rounded-pill bg-mint/20 px-2.5 py-1 text-xs font-semibold text-mint">Tercapai</span>}
                </div>
                <div className="mt-3">
                  <ProgressBar percentage={percentage} color={goal.color} />
                  <div className="mt-1.5 flex justify-between text-xs text-text-muted dark:text-text-muted-dark">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{percentage}%</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Button variant="secondary" fullWidth className="mt-4" onClick={() => setShowAdd(true)}>
        <Plus size={18} /> Tambah Target
      </Button>

      <AddGoalSheet open={showAdd} onClose={() => setShowAdd(false)} />
      <GoalDetailSheet goal={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
