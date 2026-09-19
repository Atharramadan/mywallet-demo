import { useMemo } from 'react';
import { useTransactionStore } from '../../stores/transactionStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useWealthStore, parseWealthNote } from '../../stores/wealthStore';

export function useHealthScore() {
  const transactions = useTransactionStore((state) => state.transactions);
  const settings = useSettingsStore((state) => state.settings);
  const emergencyFundTarget = settings?.emergencyFundTarget || 1; // fallback to 1 to prevent division by zero
  const snapshots = useWealthStore((state) => state.snapshots);

  return useMemo(() => {
    // Pilar 1: Dana Darurat (Survival Base)
    const latestSnapshot = snapshots.length > 0 ? snapshots[0] : null;
    const rdpu = latestSnapshot ? parseWealthNote(latestSnapshot.note).rdpu : 0;
    
    let p1Score = (rdpu / emergencyFundTarget) * 100;
    if (p1Score > 100) p1Score = 100;
    if (isNaN(p1Score)) p1Score = 0;
    
    // Pilar 2, 3, 4: Membutuhkan data transaksi 30 hari terakhir
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    let totalIncome = 0;
    let totalExpense = 0;
    const activeDates = new Set<string>();

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      if (tDate >= thirtyDaysAgo) {
        if (t.type === 'income') totalIncome += t.amount;
        if (t.type === 'expense') totalExpense += t.amount;
        
        // Simpan tanggal unik untuk pilar 4 (YYYY-MM-DD)
        const dateStr = tDate.toISOString().split('T')[0];
        activeDates.add(dateStr);
      }
    });

    // Pilar 2: Cash Flow (Pemasukan vs Pengeluaran)
    let p2Score = 0;
    if (totalExpense === 0 && totalIncome > 0) {
      p2Score = 100;
    } else if (totalIncome <= totalExpense) {
      p2Score = 0;
    } else {
      const ratio = totalIncome / totalExpense;
      // Jika ratio >= 1.2, maka skor 100. Jika kurang proporsional.
      p2Score = (ratio / 1.2) * 100;
      if (p2Score > 100) p2Score = 100;
    }
    
    // Fallback netral jika sama sekali tidak ada aktivitas sebulan terakhir
    if (totalIncome === 0 && totalExpense === 0) p2Score = 50;

    // Pilar 3: Savings Rate (Tabungan)
    let p3Score = 0;
    if (totalIncome > 0) {
      const savings = totalIncome - totalExpense;
      if (savings > 0) {
        const savingsRate = savings / totalIncome; // maksimal emas adalah 20% (0.2)
        p3Score = (savingsRate / 0.2) * 100;
        if (p3Score > 100) p3Score = 100;
      }
    }

    // Pilar 4: Tracking Habit (Disiplin Mencatat)
    const activeDaysCount = activeDates.size;
    let p4Score = (activeDaysCount / 15) * 100; // 15 hari adalah target untuk dapat skor 100
    if (p4Score > 100) p4Score = 100;

    // Kalkulasi Rata-Rata 4 Pilar
    const finalScore = Math.round((p1Score + p2Score + p3Score + p4Score) / 4);

    let status: 'Sangat Sehat' | 'Waspada' | 'Kritis' = 'Sangat Sehat';
    let statusColor = 'text-emerald-500';
    let ringColor = '#10b981'; // emerald-500
    let bgPulse = 'bg-emerald-500/20';

    if (finalScore < 50) {
      status = 'Kritis';
      statusColor = 'text-red';
      ringColor = '#f43f5e'; // rose-500
      bgPulse = 'bg-red/20';
    } else if (finalScore < 80) {
      status = 'Waspada';
      statusColor = 'text-yellow';
      ringColor = '#eab308'; // yellow-500
      bgPulse = 'bg-yellow/20';
    }

    return {
      p1Score: Math.round(p1Score),
      p2Score: Math.round(p2Score),
      p3Score: Math.round(p3Score),
      p4Score: Math.round(p4Score),
      finalScore,
      status,
      statusColor,
      ringColor,
      bgPulse,
      activeDaysCount,
      totalIncome,
      totalExpense,
      rdpu,
      emergencyFundTarget
    };
  }, [transactions, emergencyFundTarget, snapshots]);
}
