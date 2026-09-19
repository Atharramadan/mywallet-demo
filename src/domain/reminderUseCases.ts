import type { Transaction, SavingsGoal, AppSettings, WealthSnapshot } from '../db/schema';
import { daysBetween } from '../lib/formatters';

export interface Reminder {
  id: string;
  title: string;
  message: string;
  icon: 'backup' | 'transaction' | 'goal' | 'wealth';
}

const TRANSACTION_IDLE_THRESHOLD_DAYS = 2;
const GOAL_DEADLINE_WARNING_DAYS = 7;

/**
 * Mengevaluasi kondisi data saat ini dan menghasilkan pengingat yang relevan.
 * Hanya dipanggil saat aplikasi dibuka (bukan scheduler background) — lihat
 * catatan keterbatasan notifikasi lokal PWA di README.
 */
export function detectReminders(input: {
  now: Date;
  settings: AppSettings | null;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  wealthSnapshots: WealthSnapshot[];
}): Reminder[] {
  const { now, transactions, savingsGoals, wealthSnapshots } = input;
  const reminders: Reminder[] = [];

  // 1. Pengingat backup (Dihapus sesuai permintaan)

  // 2. Pengingat pencatatan transaksi
  if (transactions.length === 0) {
    reminders.push({
      id: 'transaction-none',
      title: 'Belum ada transaksi',
      message: 'Catat transaksi pertamamu supaya laporan mulai terisi.',
      icon: 'transaction',
    });
  } else {
    const latest = transactions.reduce((max, t) => (t.date > max ? t.date : max), transactions[0].date);
    const daysSinceLast = daysBetween(latest, now);
    if (daysSinceLast >= TRANSACTION_IDLE_THRESHOLD_DAYS) {
      reminders.push({
        id: 'transaction-idle',
        title: 'Belum ada catatan baru',
        message: `Sudah ${daysSinceLast} hari belum ada transaksi dicatat.`,
        icon: 'transaction',
      });
    }
  }

  // 3. Pengingat target tabungan yang mendekati tenggat
  const upcomingGoal = savingsGoals
    .filter((g) => !g.isCompleted && g.targetDate)
    .map((g) => ({ goal: g, daysLeft: daysBetween(now, g.targetDate!) }))
    .filter((g) => g.daysLeft >= 0 && g.daysLeft <= GOAL_DEADLINE_WARNING_DAYS)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  if (upcomingGoal) {
    const percentage = upcomingGoal.goal.targetAmount > 0
      ? Math.round((upcomingGoal.goal.currentAmount / upcomingGoal.goal.targetAmount) * 100)
      : 0;
    reminders.push({
      id: `goal-${upcomingGoal.goal.id}`,
      title: `Target "${upcomingGoal.goal.name}" mendekati tenggat`,
      message:
        upcomingGoal.daysLeft === 0
          ? `Tenggat hari ini, baru terkumpul ${percentage}%.`
          : `${upcomingGoal.daysLeft} hari lagi, baru terkumpul ${percentage}%.`,
      icon: 'goal',
    });
  }

  // 4. Pengingat Wealth Snapshot Bulanan (jika sudah lewat 30 hari dari update terakhir)
  if (wealthSnapshots.length > 0) {
    const latestSnapshot = wealthSnapshots[0]; // Assuming they are sorted descending in the store
    const daysSinceLastSnapshot = daysBetween(latestSnapshot.createdAt, now);
    
    if (daysSinceLastSnapshot >= 30) {
      reminders.push({
        id: `wealth-snapshot-reminder`,
        title: 'Saatnya Update Aset 📈',
        message: 'Sudah sebulan sejak update terakhir. Yuk update total Crypto dan Reksa Dana kamu!',
        icon: 'wealth',
      });
    }
  }

  return reminders.slice(0, 4);
}
