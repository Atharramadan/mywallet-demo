import { useGamificationStore } from '../stores/gamificationStore';
import { Card } from './Card';

export function Badges() {
  const { badges } = useGamificationStore();
  
  return (
    <Card className="p-4 mb-4 glass">
      <h3 className="font-semibold text-sm mb-3">Pencapaian Boss</h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {badges.map(b => (
          <div key={b.id} className={`flex flex-col items-center shrink-0 w-20 p-2 rounded-xl border ${b.unlockedAt ? 'border-purple bg-purple/10 dark:bg-purple/20' : 'border-border/50 dark:border-border-dark/50 grayscale opacity-50'}`}>
            <span className="text-3xl mb-1">{b.icon}</span>
            <span className="text-[10px] text-center leading-tight font-medium">{b.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
