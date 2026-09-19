import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Lock } from 'lucide-react';
import { useWealthStore } from '../../stores/wealthStore';
import { useAccountStore, activeAccounts } from '../../stores/accountStore';
import { formatCurrency } from '../../lib/formatters';

const ACHIEVEMENTS = [
  { id: 'asset-1', title: 'Aset Pertama Rp1 Juta', threshold: 1000000, type: 'asset' },
  { id: 'ef-1', title: 'Dana Darurat Rp1 Juta', threshold: 1000000, type: 'ef' },
  { id: 'ef-5', title: 'Dana Darurat Rp5 Juta', threshold: 5000000, type: 'ef' },
  { id: 'asset-5', title: 'Aset Rp5 Juta', threshold: 5000000, type: 'asset' },
  { id: 'asset-10', title: 'Aset Rp10 Juta', threshold: 10000000, type: 'asset' },
  { id: 'asset-25', title: 'Aset Rp25 Juta', threshold: 25000000, type: 'asset' },
  { id: 'asset-50', title: 'Aset Rp50 Juta', threshold: 50000000, type: 'asset' },
  { id: 'asset-100', title: 'Aset Rp100 Juta', threshold: 100000000, type: 'asset' },
];

export function WealthAchievementsPage() {
  const snapshots = useWealthStore((s) => s.snapshots);
  const accounts = useAccountStore((s) => s.accounts);
  
  const active = activeAccounts(accounts);
  const currentCash = active.reduce((sum, a) => sum + a.balance, 0);
  
  const latestSnapshot = snapshots.length > 0 ? snapshots[0] : null;
  const currentNetWorth = currentCash + (latestSnapshot?.cryptoAmount || 0) + (latestSnapshot?.mutualFundAmount || 0);

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6 min-h-dvh bg-bg dark:bg-bg-dark">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/wealth-center" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-lg font-bold">Pencapaian</h1>
        <div className="w-10" />
      </div>

      <div className="flex flex-col gap-4">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = ach.type === 'asset' 
            ? currentNetWorth >= ach.threshold 
            : currentCash >= ach.threshold;
          
          return (
            <div 
              key={ach.id} 
              className={`flex items-center gap-4 rounded-2xl p-4 card-shadow border transition-all ${
                isUnlocked 
                  ? 'bg-linear-to-br from-[#EBB847]/20 to-[#D49E2D]/10 border-[#EBB847]/30' 
                  : 'bg-surface dark:bg-surface-dark border-transparent opacity-60'
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                isUnlocked ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-surface-muted dark:bg-surface-muted-dark'
              }`}>
                {isUnlocked ? (
                  <Trophy size={22} className="text-white" />
                ) : (
                  <Lock size={20} className="text-text-muted dark:text-text-muted-dark" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isUnlocked ? 'text-amber-600 dark:text-amber-400' : 'text-text-muted dark:text-text-muted-dark'}`}>
                  {ach.title}
                </p>
                {!isUnlocked && (
                  <p className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
                    Butuh {formatCurrency(ach.threshold - (ach.type === 'asset' ? currentNetWorth : currentCash))} lagi
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
