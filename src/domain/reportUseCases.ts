import type { Transaction, Category } from '../db/schema';

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export function summarize(transactions: Transaction[]): MonthlySummary {
  let totalIncome = 0;
  let totalExpense = 0;
  for (const t of transactions) {
    if (t.type === 'income') totalIncome += t.amount;
    if (t.type === 'expense') totalExpense += t.amount;
  }
  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
}

export interface CategoryBreakdownItem {
  categoryId: number;
  name: string;
  color: string;
  icon: string;
  total: number;
  percentage: number;
}

export function breakdownByCategory(
  transactions: Transaction[],
  categories: Category[],
  type: 'income' | 'expense' = 'expense'
): CategoryBreakdownItem[] {
  const relevant = transactions.filter((t) => t.type === type && t.categoryId);
  const total = relevant.reduce((sum, t) => sum + t.amount, 0);
  
  // Group by normalized name to prevent duplicate rows when categories share the same name
  const nameMap = new Map<string, { categoryId: number; name: string; color: string; icon: string; total: number }>();
  
  for (const t of relevant) {
    const cat = categories.find((c) => c.id === t.categoryId);
    if (!cat) continue;
    const key = cat.name.trim().toLowerCase();
    const existing = nameMap.get(key);
    if (existing) {
      existing.total += t.amount;
    } else {
      nameMap.set(key, {
        categoryId: cat.id!,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        total: t.amount,
      });
    }
  }

  const items: CategoryBreakdownItem[] = Array.from(nameMap.values()).map((item) => ({
    categoryId: item.categoryId,
    name: item.name,
    color: item.color,
    icon: item.icon,
    total: item.total,
    percentage: total > 0 ? (item.total / total) * 100 : 0,
  }));

  return items.sort((a, b) => b.total - a.total);
}

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Bandingkan pengeluaran per kategori bulan ini vs bulan lalu, hasilkan insight sederhana. */
export function detectInsights(
  currentMonthTx: Transaction[],
  previousMonthTx: Transaction[],
  categories: Category[]
): string[] {
  const insights: string[] = [];
  const current = breakdownByCategory(currentMonthTx, categories, 'expense');
  const previous = breakdownByCategory(previousMonthTx, categories, 'expense');

  for (const cur of current.slice(0, 5)) {
    const prev = previous.find((p) => p.categoryId === cur.categoryId);
    if (!prev || prev.total === 0) continue;
    const change = ((cur.total - prev.total) / prev.total) * 100;
    if (Math.abs(change) >= 15) {
      const direction = change > 0 ? 'naik' : 'turun';
      insights.push(
        `Pengeluaran ${cur.name.toLowerCase()} ${direction} ${Math.abs(change).toFixed(0)}% dibanding bulan lalu`
      );
    }
  }

  const currentSummary = summarize(currentMonthTx);
  if (currentSummary.totalIncome > 0) {
    const savingsRate = (currentSummary.netBalance / currentSummary.totalIncome) * 100;
    if (savingsRate >= 20) {
      insights.push(`Kerja bagus! Kamu menyisihkan ${savingsRate.toFixed(0)}% dari pemasukan bulan ini`);
    } else if (savingsRate < 0) {
      insights.push('Pengeluaran bulan ini melebihi pemasukan');
    }
  }

  return insights.slice(0, 3);
}

export function calcSavingsProgress(current: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}
