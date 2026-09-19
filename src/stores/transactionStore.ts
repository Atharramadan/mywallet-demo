import { create } from 'zustand';
import { demoStorage } from '../lib/storage';
import { useAccountStore } from './accountStore';
import type { Transaction } from '../db/schema';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  refresh: () => Promise<void>;
  addExpense: (input: { accountId: number; categoryId: number; amount: number; note?: string; date: Date }) => Promise<void>;
  addIncome: (input: { accountId: number; categoryId: number; amount: number; note?: string; date: Date }) => Promise<void>;
  addTransfer: (input: { fromAccountId: number; toAccountId: number; amount: number; note?: string; date: Date }) => Promise<void>;
  addAdjustment: (accountId: number, actualBalance: number, note?: string) => Promise<void>;
  remove: (transaction: Transaction) => Promise<void>;
  edit: (oldTransaction: Transaction, newData: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => Promise<void>;
  editingTransaction: Transaction | null;
  setEditingTransaction: (transaction: Transaction | null) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: demoStorage.getTransactions(),
  loading: false,
  editingTransaction: null,
  setEditingTransaction: (transaction) => set({ editingTransaction: transaction }),
  refresh: async () => {
    const transactions = demoStorage.getTransactions();
    set({ transactions, loading: false });
  },
  addExpense: async (input) => {
    const transactions = get().transactions;
    const newTx: Transaction = {
      id: Date.now(),
      type: 'expense',
      amount: input.amount,
      accountId: input.accountId,
      categoryId: input.categoryId,
      note: input.note || '',
      date: input.date,
      createdAt: new Date(),
    };
    const updated = [newTx, ...transactions];
    demoStorage.saveTransactions(updated);
    set({ transactions: updated });

    // Update account balance
    const acc = useAccountStore.getState().accounts.find(a => a.id === input.accountId);
    if (acc) {
      await useAccountStore.getState().update(input.accountId, { balance: acc.balance - input.amount });
    }
  },
  addIncome: async (input) => {
    const transactions = get().transactions;
    const newTx: Transaction = {
      id: Date.now(),
      type: 'income',
      amount: input.amount,
      accountId: input.accountId,
      categoryId: input.categoryId,
      note: input.note || '',
      date: input.date,
      createdAt: new Date(),
    };
    const updated = [newTx, ...transactions];
    demoStorage.saveTransactions(updated);
    set({ transactions: updated });

    // Update account balance
    const acc = useAccountStore.getState().accounts.find(a => a.id === input.accountId);
    if (acc) {
      await useAccountStore.getState().update(input.accountId, { balance: acc.balance + input.amount });
    }
  },
  addTransfer: async (input) => {
    const transactions = get().transactions;
    const newTx: Transaction = {
      id: Date.now(),
      type: 'transfer',
      amount: input.amount,
      accountId: input.fromAccountId,
      toAccountId: input.toAccountId,
      note: input.note || 'Transfer saldo',
      date: input.date,
      createdAt: new Date(),
    };
    const updated = [newTx, ...transactions];
    demoStorage.saveTransactions(updated);
    set({ transactions: updated });

    const fromAcc = useAccountStore.getState().accounts.find(a => a.id === input.fromAccountId);
    const toAcc = useAccountStore.getState().accounts.find(a => a.id === input.toAccountId);
    if (fromAcc) {
      await useAccountStore.getState().update(input.fromAccountId, { balance: fromAcc.balance - input.amount });
    }
    if (toAcc) {
      await useAccountStore.getState().update(input.toAccountId, { balance: toAcc.balance + input.amount });
    }
  },
  addAdjustment: async (accountId, actualBalance, note) => {
    const acc = useAccountStore.getState().accounts.find(a => a.id === accountId);
    if (!acc) return;
    const diff = actualBalance - acc.balance;
    const newTx: Transaction = {
      id: Date.now(),
      type: 'adjustment',
      amount: Math.abs(diff),
      accountId: accountId,
      note: note || 'Penyesuaian saldo',
      date: new Date(),
      createdAt: new Date(),
    };
    const updated = [newTx, ...get().transactions];
    demoStorage.saveTransactions(updated);
    set({ transactions: updated });
    await useAccountStore.getState().update(accountId, { balance: actualBalance });
  },
  remove: async (transaction) => {
    const updated = get().transactions.filter(t => t.id !== transaction.id);
    demoStorage.saveTransactions(updated);
    set({ transactions: updated });

    // Revert balance
    const acc = useAccountStore.getState().accounts.find(a => a.id === transaction.accountId);
    if (acc) {
      if (transaction.type === 'expense') {
        await useAccountStore.getState().update(transaction.accountId, { balance: acc.balance + transaction.amount });
      } else if (transaction.type === 'income') {
        await useAccountStore.getState().update(transaction.accountId, { balance: acc.balance - transaction.amount });
      } else if (transaction.type === 'transfer' && transaction.toAccountId) {
        const toAcc = useAccountStore.getState().accounts.find(a => a.id === transaction.toAccountId);
        await useAccountStore.getState().update(transaction.accountId, { balance: acc.balance + transaction.amount });
        if (toAcc) {
          await useAccountStore.getState().update(transaction.toAccountId, { balance: toAcc.balance - transaction.amount });
        }
      }
    }
  },
  edit: async (oldTransaction, newData) => {
    const updated = get().transactions.map(t => t.id === oldTransaction.id ? { ...t, ...newData } as Transaction : t);
    demoStorage.saveTransactions(updated);
    set({ transactions: updated });
  },
}));
