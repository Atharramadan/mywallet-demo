import type { Transaction, Category } from '../db/schema';

export function analyzeBudget(transactions: Transaction[], categories: Category[]) {
  let income = 0;
  let needs = 0;
  let wants = 0;
  let expense = 0;

  const WANTS_KEYWORDS = [
    'belanja', 'hiburan', 'hobi', 'langganan', 'game', 'jajan', 
    'nongkrong', 'main', 'rekreasi', 'liburan', 'keinginan', 'lainnya'
  ];

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      income += tx.amount;
    } else if (tx.type === 'expense') {
      expense += tx.amount;
      const cat = categories.find((c) => c.id === tx.categoryId);
      const catName = cat?.name.toLowerCase() || '';

      const isWant = WANTS_KEYWORDS.some(kw => catName.includes(kw));
      if (isWant) {
        wants += tx.amount;
      } else {
        needs += tx.amount; 
      }
    }
  });

  const savings = income - expense;

  const needsPercent = income > 0 ? (needs / income) * 100 : 0;
  const wantsPercent = income > 0 ? (wants / income) * 100 : 0;
  const savingsPercent = income > 0 ? (savings / income) * 100 : 0;

  return {
    income,
    needs,
    wants,
    savings,
    expense,
    needsPercent,
    wantsPercent,
    savingsPercent,
  };
}
