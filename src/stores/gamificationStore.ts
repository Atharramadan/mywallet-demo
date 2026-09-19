import { create } from 'zustand';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

const BADGES_DB: Badge[] = [
  { id: 'first_tx', name: 'Langkah Pertama', description: 'Mencatat transaksi pertama kali', icon: '🎯', unlockedAt: new Date().toISOString() },
  { id: 'budget_master', name: 'Raja Hemat', description: 'Pengeluaran di bawah budget selama sebulan', icon: '👑', unlockedAt: new Date().toISOString() },
  { id: 'wealth_builder', name: 'Sultan Muda', description: 'Net worth menyentuh angka 10 juta', icon: '💰', unlockedAt: new Date().toISOString() },
  { id: 'streak_7', name: 'Konsisten', description: 'Mencatat transaksi 7 hari berturut-turut', icon: '🔥' }
];

interface GamificationState {
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;
  checkAndUnlockBadges: (metrics: { txCount: number; isUnderBudget: boolean; netWorth: number }) => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  badges: BADGES_DB,
  unlockBadge: (badgeId) => set((state) => {
    const badgeIndex = state.badges.findIndex(b => b.id === badgeId);
    if (badgeIndex === -1 || state.badges[badgeIndex].unlockedAt) return state;
    const newBadges = [...state.badges];
    newBadges[badgeIndex] = { ...newBadges[badgeIndex], unlockedAt: new Date().toISOString() };
    return { badges: newBadges };
  }),
  checkAndUnlockBadges: (metrics) => {
    const state = get();
    if (metrics.txCount > 0) state.unlockBadge('first_tx');
    if (metrics.isUnderBudget) state.unlockBadge('budget_master');
    if (metrics.netWorth >= 10000000) state.unlockBadge('wealth_builder');
  }
}));
