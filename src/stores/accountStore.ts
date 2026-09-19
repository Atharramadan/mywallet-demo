import { create } from 'zustand';
import { demoStorage } from '../lib/storage';
import type { Account } from '../db/schema';

interface AccountState {
  accounts: Account[];
  loading: boolean;
  refresh: () => Promise<void>;
  create: (data: Pick<Account, 'name' | 'icon' | 'color' | 'balance'>) => Promise<void>;
  update: (id: number, data: Partial<Account>) => Promise<void>;
  archive: (id: number) => Promise<void>;
  unarchive: (id: number) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: demoStorage.getAccounts(),
  loading: false,
  refresh: async () => {
    const accounts = demoStorage.getAccounts();
    set({ accounts, loading: false });
  },
  create: async (data) => {
    const accounts = get().accounts;
    const newAcc: Account = {
      id: Date.now(),
      name: data.name,
      icon: data.icon,
      color: data.color,
      balance: data.balance,
      initialBalance: data.balance,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [...accounts, newAcc];
    demoStorage.saveAccounts(updated);
    set({ accounts: updated });
  },
  update: async (id, data) => {
    const updated = get().accounts.map(a => a.id === id ? { ...a, ...data, updatedAt: new Date() } : a);
    demoStorage.saveAccounts(updated);
    set({ accounts: updated });
  },
  archive: async (id) => {
    const updated = get().accounts.map(a => a.id === id ? { ...a, isArchived: true, updatedAt: new Date() } : a);
    demoStorage.saveAccounts(updated);
    set({ accounts: updated });
  },
  unarchive: async (id) => {
    const updated = get().accounts.map(a => a.id === id ? { ...a, isArchived: false, updatedAt: new Date() } : a);
    demoStorage.saveAccounts(updated);
    set({ accounts: updated });
  },
  remove: async (id) => {
    const updated = get().accounts.filter(a => a.id !== id);
    demoStorage.saveAccounts(updated);
    set({ accounts: updated });
  },
}));

export function activeAccounts(accounts: Account[]) {
  return accounts.filter((a) => !a.isArchived);
}
