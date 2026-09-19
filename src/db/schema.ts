export type TransactionType = 'income' | 'expense' | 'transfer' | 'adjustment';
export type CategoryType = 'income' | 'expense';
export type ThemeMode = 'light' | 'dark';

export interface Account {
  id?: number;
  name: string;
  icon: string;
  color: string;
  balance: number;
  initialBalance: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id?: number;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  isDefault: boolean;
  isArchived: boolean;
}

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  accountId: number;
  toAccountId?: number;
  categoryId?: number;
  note?: string;
  date: Date;
  createdAt: Date;
}

export interface SavingsGoal {
  id?: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  icon: string;
  color: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
}

export interface SavingsContribution {
  id?: number;
  goalId: number;
  amount: number;
  date: Date;
  note?: string;
}

export interface Budget {
  id?: number;
  categoryId: number;
  amount: number;
  period: 'monthly';
  createdAt: Date;
  updatedAt: Date;
}

export interface WealthSnapshot {
  id?: number;
  month: string;
  cryptoAmount: number;
  mutualFundAmount: number;
  note?: string;
  createdAt: Date;
}

export interface AppSettings {
  id?: number;
  pinHash: string;
  pinSalt: string;
  theme: ThemeMode;
  lastBackupAt?: Date;
  notificationsEnabled: boolean;
  hasSeenInstallBanner: boolean;
  isInstalled: boolean;
  userName?: string;
  wealthTarget?: number;
  emergencyFundTarget?: number;
  emergencyFundBalance?: number;
}
