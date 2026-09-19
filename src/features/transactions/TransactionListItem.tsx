import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Scale } from 'lucide-react';
import { AppIcon } from '../../lib/icons';
import { formatCurrency, formatTime } from '../../lib/formatters';
import type { Transaction, Account, Category } from '../../db/schema';

export function TransactionListItem({
  transaction,
  accounts,
  categories,
  onClick,
}: {
  transaction: Transaction;
  accounts: Account[];
  categories: Category[];
  onClick: () => void;
}) {
  const account = accounts.find((a) => a.id === transaction.accountId);
  const toAccount = accounts.find((a) => a.id === transaction.toAccountId);
  const category = categories.find((c) => c.id === transaction.categoryId);

  const isNegative = transaction.type === 'expense';
  const isPositive = transaction.type === 'income';
  const sign = isNegative ? '-' : isPositive ? '+' : '';

  let icon = category?.icon ?? 'ellipsis';
  let iconColor = category?.color ?? '#A8A8B3';
  let title = category?.name ?? 'Transaksi';
  
  const timeString = formatTime(transaction.date);
  let subtitle = `${account?.name ?? ''} • ${timeString}`;

  if (transaction.type === 'transfer') {
    icon = 'card';
    iconColor = '#7FB8E8';
    title = 'Transfer';
    subtitle = `${account?.name ?? ''} → ${toAccount?.name ?? ''} • ${timeString}`;
  } else if (transaction.type === 'adjustment') {
    icon = 'trending';
    iconColor = '#A8A8B3';
    title = 'Penyesuaian Saldo';
    subtitle = `${account?.name ?? ''} • ${timeString}`;
  }

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-surface-muted dark:hover:bg-surface-muted-dark"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${iconColor}22` }}
      >
        <AppIcon name={icon} size={18} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-text-muted dark:text-text-muted-dark">{subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {transaction.type === 'transfer' && <ArrowLeftRight size={13} className="text-blue" />}
        {isPositive && <ArrowUpRight size={13} className="text-mint" />}
        {isNegative && <ArrowDownLeft size={13} className="text-rose" />}
        {transaction.type === 'adjustment' && <Scale size={13} className="text-text-muted" />}
        <p
          className={`text-sm font-semibold tabular-nums ${
            isNegative ? 'text-rose' : isPositive ? 'text-mint' : ''
          }`}
        >
          {sign}
          {formatCurrency(Math.abs(transaction.amount))}
        </p>
      </div>
    </button>
  );
}
 