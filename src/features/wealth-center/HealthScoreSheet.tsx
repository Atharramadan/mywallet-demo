import { Sheet } from '../../components/Sheet';
import { ShieldAlert, TrendingUp, PiggyBank, CalendarCheck, Info } from 'lucide-react';
import type { useHealthScore } from './useHealthScore';

interface HealthScoreSheetProps {
  open: boolean;
  onClose: () => void;
  scoreData: ReturnType<typeof useHealthScore>;
}

export function HealthScoreSheet({ open, onClose, scoreData }: HealthScoreSheetProps) {
  const {
    p1Score, p2Score, p3Score, p4Score,
    status, statusColor, ringColor, bgPulse,
    finalScore, activeDaysCount, totalIncome, totalExpense,
    rdpu, emergencyFundTarget
  } = scoreData;

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-yellow';
    return 'bg-red';
  };

  return (
    <Sheet open={open} onClose={onClose} title="Rincian Skor Kesehatan">
      <div className="flex flex-col gap-5 pb-6">
        {/* Header Summary */}
        <div className={`p-4 rounded-2xl ${bgPulse} flex items-center justify-between border border-border dark:border-border-dark`}>
          <div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark font-medium mb-1">Status Keuangan</p>
            <h3 className={`font-display text-xl font-bold ${statusColor}`}>{status}</h3>
          </div>
          <div className="relative h-14 w-14 flex items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                className="stroke-border dark:stroke-border-dark"
                strokeWidth="8"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                style={{ stroke: ringColor }}
                className="transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                strokeDasharray={`${(finalScore / 100) * 264} 264`}
              />
            </svg>
            <span className="font-display font-bold text-lg">{finalScore}</span>
          </div>
        </div>

        <p className="text-sm text-text-muted dark:text-text-muted-dark leading-relaxed flex items-start gap-2">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>Skor dihitung otomatis dari 4 pilar berdasarkan riwayat 30 hari terakhir.</span>
        </p>

        {/* Pillar 1: Dana Darurat */}
        <div className="border border-border dark:border-border-dark rounded-xl p-4 bg-surface dark:bg-surface-dark card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple/10 rounded-lg text-purple">
              <ShieldAlert size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Dana Darurat (Survival)</h4>
                <span className="font-bold text-sm">{p1Score}/100</span>
              </div>
            </div>
          </div>
          <div className="h-2 w-full bg-border dark:bg-border-dark rounded-full overflow-hidden mb-2">
            <div className={`h-full ${getBarColor(p1Score)} transition-all`} style={{ width: `${p1Score}%` }} />
          </div>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            RDPU vs Target: Rp{rdpu.toLocaleString('id-ID')} / Rp{emergencyFundTarget.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Pillar 2: Arus Kas */}
        <div className="border border-border dark:border-border-dark rounded-xl p-4 bg-surface dark:bg-surface-dark card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue/10 rounded-lg text-blue">
              <TrendingUp size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Arus Kas (Cash Flow)</h4>
                <span className="font-bold text-sm">{p2Score}/100</span>
              </div>
            </div>
          </div>
          <div className="h-2 w-full bg-border dark:bg-border-dark rounded-full overflow-hidden mb-2">
            <div className={`h-full ${getBarColor(p2Score)} transition-all`} style={{ width: `${p2Score}%` }} />
          </div>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Rasio In vs Out: In Rp{totalIncome.toLocaleString('id-ID')} | Out Rp{totalExpense.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Pillar 3: Savings Rate */}
        <div className="border border-border dark:border-border-dark rounded-xl p-4 bg-surface dark:bg-surface-dark card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <PiggyBank size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Rasio Tabungan</h4>
                <span className="font-bold text-sm">{p3Score}/100</span>
              </div>
            </div>
          </div>
          <div className="h-2 w-full bg-border dark:bg-border-dark rounded-full overflow-hidden mb-2">
            <div className={`h-full ${getBarColor(p3Score)} transition-all`} style={{ width: `${p3Score}%` }} />
          </div>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            {(totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0).toFixed(1)}% dari pendapatan berhasil ditabung (Target &gt;= 20%).
          </p>
        </div>

        {/* Pillar 4: Habit */}
        <div className="border border-border dark:border-border-dark rounded-xl p-4 bg-surface dark:bg-surface-dark card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow/10 rounded-lg text-yellow">
              <CalendarCheck size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Disiplin (Habit)</h4>
                <span className="font-bold text-sm">{p4Score}/100</span>
              </div>
            </div>
          </div>
          <div className="h-2 w-full bg-border dark:bg-border-dark rounded-full overflow-hidden mb-2">
            <div className={`h-full ${getBarColor(p4Score)} transition-all`} style={{ width: `${p4Score}%` }} />
          </div>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Mencatat di {activeDaysCount} hari berbeda bulan ini (Target &gt;= 15 hari).
          </p>
        </div>

      </div>
    </Sheet>
  );
}
