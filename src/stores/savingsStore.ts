import { create } from 'zustand';
import { demoStorage } from '../lib/storage';
import type { SavingsGoal } from '../db/schema';

interface SavingsState {
  goals: SavingsGoal[];
  loading: boolean;
  refresh: () => Promise<void>;
  create: (data: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount' | 'isCompleted'>) => Promise<void>;
  update: (id: number, data: Partial<SavingsGoal>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  addFunds: (goalId: number, amount: number, note?: string) => Promise<boolean>;
}

export const useSavingsStore = create<SavingsState>((set, get) => ({
  goals: demoStorage.getSavings(),
  loading: false,
  refresh: async () => {
    set({ goals: demoStorage.getSavings(), loading: false });
  },
  create: async (data) => {
    const goals = get().goals;
    const newGoal: SavingsGoal = {
      ...data,
      id: Date.now(),
      currentAmount: 0,
      isCompleted: false,
      createdAt: new Date(),
    };
    const updated = [...goals, newGoal];
    demoStorage.saveSavings(updated);
    set({ goals: updated });
  },
  update: async (id, data) => {
    const updated = get().goals.map(g => g.id === id ? { ...g, ...data } : g);
    demoStorage.saveSavings(updated);
    set({ goals: updated });
  },
  remove: async (id) => {
    const updated = get().goals.filter(g => g.id !== id);
    demoStorage.saveSavings(updated);
    set({ goals: updated });
  },
  addFunds: async (goalId, amount) => {
    const goals = get().goals;
    let completedNow = false;
    const updated = goals.map(g => {
      if (g.id === goalId) {
        const newAmt = g.currentAmount + amount;
        const isCompleted = newAmt >= g.targetAmount;
        if (!g.isCompleted && isCompleted) completedNow = true;
        return { ...g, currentAmount: newAmt, isCompleted };
      }
      return g;
    });
    demoStorage.saveSavings(updated);
    set({ goals: updated });
    return completedNow;
  },
}));
