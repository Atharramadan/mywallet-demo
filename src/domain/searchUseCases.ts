import type { Transaction, Account, Category } from '../db/schema';

export function searchTransactions(
  query: string,
  transactions: Transaction[],
  accounts: Account[],
  categories: Category[]
): Transaction[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const numericQuery = q.replace(/\D/g, '');

  return transactions.filter((t) => {
    const account = accounts.find((a) => a.id === t.accountId);
    const toAccount = accounts.find((a) => a.id === t.toAccountId);
    const category = categories.find((c) => c.id === t.categoryId);

    if (t.note?.toLowerCase().includes(q)) return true;
    if (account?.name.toLowerCase().includes(q)) return true;
    if (toAccount?.name.toLowerCase().includes(q)) return true;
    if (category?.name.toLowerCase().includes(q)) return true;
    if (numericQuery && String(Math.round(t.amount)).includes(numericQuery)) return true;
    return false;
  });
}
