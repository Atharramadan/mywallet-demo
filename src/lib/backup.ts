import { demoStorage } from './storage';

function csvEscape(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportTransactionsToCsv(): Promise<string> {
  const transactions = demoStorage.getTransactions();
  const accounts = demoStorage.getAccounts();
  const categories = demoStorage.getCategories();
  
  const accountName = (id?: number) => accounts.find((a) => a.id === id)?.name ?? '';
  const categoryName = (id?: number) => categories.find((c) => c.id === id)?.name ?? '';

  const header = ['Tanggal', 'Jenis', 'Akun', 'Akun Tujuan', 'Kategori', 'Nominal', 'Catatan'];
  const rows = transactions.map((t) => [
    t.date.toISOString(),
    t.type,
    accountName(t.accountId),
    t.toAccountId ? accountName(t.toAccountId) : '',
    categoryName(t.categoryId),
    t.amount,
    t.note ?? '',
  ]);

  return [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
