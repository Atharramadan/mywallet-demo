import {
  INITIAL_ACCOUNTS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_BUDGETS,
  INITIAL_WEALTH_SNAPSHOTS,
  INITIAL_SETTINGS,
} from '../data/mockData';
import type { Account, Category, Transaction, SavingsGoal, Budget, WealthSnapshot, AppSettings } from '../db/schema';

const KEYS = {
  ACCOUNTS: 'mywallet_demo_accounts',
  CATEGORIES: 'mywallet_demo_categories',
  TRANSACTIONS: 'mywallet_demo_transactions',
  SAVINGS: 'mywallet_demo_savings',
  BUDGETS: 'mywallet_demo_budgets',
  WEALTH: 'mywallet_demo_wealth',
  SETTINGS: 'mywallet_demo_settings',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // Parse ISO date strings back to Date objects
    return reviveDates(parsed);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

function reviveDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // Check if ISO date string
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
      return new Date(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(reviveDates);
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const k in obj) {
      res[k] = reviveDates(obj[k]);
    }
    return res;
  }
  return obj;
}

export const demoStorage = {
  getAccounts: (): Account[] => getFromStorage(KEYS.ACCOUNTS, INITIAL_ACCOUNTS),
  saveAccounts: (data: Account[]) => saveToStorage(KEYS.ACCOUNTS, data),

  getCategories: (): Category[] => getFromStorage(KEYS.CATEGORIES, INITIAL_CATEGORIES),
  saveCategories: (data: Category[]) => saveToStorage(KEYS.CATEGORIES, data),

  getTransactions: (): Transaction[] => getFromStorage(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  saveTransactions: (data: Transaction[]) => saveToStorage(KEYS.TRANSACTIONS, data),

  getSavings: (): SavingsGoal[] => getFromStorage(KEYS.SAVINGS, INITIAL_SAVINGS_GOALS),
  saveSavings: (data: SavingsGoal[]) => saveToStorage(KEYS.SAVINGS, data),

  getBudgets: (): Budget[] => getFromStorage(KEYS.BUDGETS, INITIAL_BUDGETS),
  saveBudgets: (data: Budget[]) => saveToStorage(KEYS.BUDGETS, data),

  getWealth: (): WealthSnapshot[] => getFromStorage(KEYS.WEALTH, INITIAL_WEALTH_SNAPSHOTS),
  saveWealth: (data: WealthSnapshot[]) => saveToStorage(KEYS.WEALTH, data),

  getSettings: (): AppSettings => getFromStorage(KEYS.SETTINGS, INITIAL_SETTINGS),
  saveSettings: (data: AppSettings) => saveToStorage(KEYS.SETTINGS, data),

  resetAll: () => {
    saveToStorage(KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
    saveToStorage(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    saveToStorage(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    saveToStorage(KEYS.SAVINGS, INITIAL_SAVINGS_GOALS);
    saveToStorage(KEYS.BUDGETS, INITIAL_BUDGETS);
    saveToStorage(KEYS.WEALTH, INITIAL_WEALTH_SNAPSHOTS);
    saveToStorage(KEYS.SETTINGS, INITIAL_SETTINGS);
  },
};
