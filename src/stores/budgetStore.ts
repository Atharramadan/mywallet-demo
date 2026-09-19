import { create } from 'zustand';
import { demoStorage } from '../lib/storage';
import type { Budget } from '../db/schema';

interface BudgetState {
  budgets: Record<number, number>; // categoryId -> limit amount
  loading: boolean;
  refresh: () => Promise<void>;
  setBudget: (categoryId: number, amount: number) => Promise<void>;
  deleteBudget: (categoryId: number) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => {
  const initialBudgetsList = demoStorage.getBudgets();
  const initialMap: Record<number, number> = {};
  initialBudgetsList.forEach(b => {
    initialMap[b.categoryId] = b.amount;
  });

  return {
    budgets: initialMap,
    loading: false,
    refresh: async () => {
      const list = demoStorage.getBudgets();
      const map: Record<number, number> = {};
      list.forEach(b => {
        map[b.categoryId] = b.amount;
      });
      set({ budgets: map, loading: false });
    },
    setBudget: async (categoryId, amount) => {
      const updatedMap = { ...get().budgets, [categoryId]: amount };
      set({ budgets: updatedMap });

      const list = demoStorage.getBudgets();
      const existingIndex = list.findIndex(b => b.categoryId === categoryId);
      let updatedList: Budget[];
      if (existingIndex >= 0) {
        updatedList = [...list];
        updatedList[existingIndex] = { ...updatedList[existingIndex], amount, updatedAt: new Date() };
      } else {
        updatedList = [...list, { id: Date.now(), categoryId, amount, period: 'monthly', createdAt: new Date(), updatedAt: new Date() }];
      }
      demoStorage.saveBudgets(updatedList);
    },
    deleteBudget: async (categoryId) => {
      const updatedMap = { ...get().budgets };
      delete updatedMap[categoryId];
      set({ budgets: updatedMap });

      const list = demoStorage.getBudgets().filter(b => b.categoryId !== categoryId);
      demoStorage.saveBudgets(list);
    },
  };
});
