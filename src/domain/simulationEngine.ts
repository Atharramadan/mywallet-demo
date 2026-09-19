export interface TimelinePoint {
  monthIndex: number; // 0 to 36 (0 = bulan sekarang)
  label: string;      // "Jul 2026", "Agt 2026", dll
  baselineWealth: number;
  projectedWealth: number;
  emergencyTarget: number;
  isDanger: boolean;
}

export interface SimulationResult {
  timeline: TimelinePoint[];
  scoreBefore: number;
  scoreAfter: number;
  status: 'safe' | 'warning' | 'danger';
  emergencyFundImpactDate?: string;
  runwayMonths: number;
  advice: string;
  todayLabel: string;
}

export interface SimulationParams {
  currentWealth: number;
  avgMonthlyIncome: number;
  avgMonthlyExpense: number;
  emergencyFundTarget: number;
  currentHealthScore: number;
  decisionName: string;
  amount: number;
  type: 'one_time' | 'installment';
  durationMonths?: number;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Menjalankan simulasi proyektif terhadap arus kas dan kekayaan pengguna.
 */
export function runSimulation(params: SimulationParams): SimulationResult {
  const {
    currentWealth,
    avgMonthlyIncome,
    avgMonthlyExpense,
    emergencyFundTarget,
    currentHealthScore,
    amount,
    type,
    durationMonths = 12
  } = params;

  const monthlyNetCashFlow = avgMonthlyIncome - avgMonthlyExpense;
  const timeline: TimelinePoint[] = [];
  
  const now = new Date();
  let currentMonth = now.getMonth();
  let currentYear = now.getFullYear();
  const todayLabel = `${MONTH_NAMES[currentMonth]} ${currentYear}`;

  let baseline = currentWealth;
  let projected = currentWealth;
  let emergencyFundImpactDate: string | undefined = undefined;

  // 6 Bulan Masa Lalu (Historis Nyata sebelum titik keputusan hari ini)
  for (let i = -6; i < 0; i++) {
    const d = new Date(currentYear, currentMonth + i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const histWealth = Math.max(0, currentWealth + (i * monthlyNetCashFlow));
    timeline.push({
      monthIndex: i,
      label: `${MONTH_NAMES[m]} ${y}`,
      baselineWealth: histWealth,
      projectedWealth: histWealth,
      emergencyTarget: emergencyFundTarget,
      isDanger: histWealth < emergencyFundTarget
    });
  }

  // Bulan 0 (Sekarang - Titik Keputusan)
  timeline.push({
    monthIndex: 0,
    label: todayLabel,
    baselineWealth: baseline,
    projectedWealth: projected,
    emergencyTarget: emergencyFundTarget,
    isDanger: projected < emergencyFundTarget
  });

  const maxMonths = 36;
  for (let i = 1; i <= maxMonths; i++) {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    const label = `${MONTH_NAMES[currentMonth]} ${currentYear}`;

    // Update baseline
    baseline += monthlyNetCashFlow;

    // Update projected
    if (type === 'one_time') {
      if (i === 1) {
        projected += (monthlyNetCashFlow - amount);
      } else {
        projected += monthlyNetCashFlow;
      }
    } else if (type === 'installment') {
      if (i <= durationMonths) {
        projected += (monthlyNetCashFlow - amount);
      } else {
        projected += monthlyNetCashFlow;
      }
    }

    if (projected < emergencyFundTarget && !emergencyFundImpactDate && i <= 36) {
      emergencyFundImpactDate = label;
    }

    timeline.push({
      monthIndex: i,
      label,
      baselineWealth: Math.max(0, Math.round(baseline)),
      projectedWealth: Math.max(0, Math.round(projected)),
      emergencyTarget: emergencyFundTarget,
      isDanger: projected < emergencyFundTarget
    });
  }

  // Kalkulasi Skor Setelah Keputusan
  let totalCost = amount;
  if (type === 'installment') {
    totalCost = amount * durationMonths;
  }

  let scoreAfter = currentHealthScore;
  const wealthImpactRatio = currentWealth > 0 ? (totalCost / currentWealth) : 1;

  if (wealthImpactRatio > 0.5) scoreAfter -= 35;
  else if (wealthImpactRatio > 0.3) scoreAfter -= 25;
  else if (wealthImpactRatio > 0.15) scoreAfter -= 15;
  else if (wealthImpactRatio > 0.05) scoreAfter -= 5;

  if (type === 'installment') {
    const installmentRatio = avgMonthlyIncome > 0 ? (amount / avgMonthlyIncome) : 1;
    if (installmentRatio > 0.35) scoreAfter -= 30;
    else if (installmentRatio > 0.20) scoreAfter -= 15;
    else if (installmentRatio > 0.10) scoreAfter -= 5;
  }

  if (emergencyFundImpactDate) {
    scoreAfter -= 15;
  }

  scoreAfter = Math.max(10, Math.min(100, Math.round(scoreAfter)));

  // Tentukan Status dan Nasihat
  let status: 'safe' | 'warning' | 'danger' = 'safe';
  let advice = 'Keputusan ini aman dan tidak mengganggu stabilitas atau dana daruratmu. Gas terus!';

  const minProjectedWealth = Math.min(...timeline.filter(t => t.monthIndex >= 0).map(t => t.projectedWealth));
  const runwayMonths = avgMonthlyExpense > 0 ? Math.max(0, Math.round(minProjectedWealth / avgMonthlyExpense)) : 99;

  if (scoreAfter < 50 || minProjectedWealth < 0 || (type === 'installment' && monthlyNetCashFlow - amount < 0)) {
    status = 'danger';
    if (minProjectedWealth < 0) {
      advice = `BAHAYA! Keputusan ini membuat kekayaanmu minus dalam beberapa bulan ke depan. Sangat disarankan tunda atau cari alternatif yang lebih murah!`;
    } else if (type === 'installment' && monthlyNetCashFlow - amount < 0) {
      advice = `DEFISIT ARUS KAS! Cicilan sebesar Rp ${amount.toLocaleString('id-ID')} melebihi surplus bulananmu. Kamu akan tekor tiap bulan!`;
    } else {
      advice = `BERISIKO TINGGI! Skor finansialmu anjlok drastis dan membahayakan pertahanan dana daruratmu pada ${emergencyFundImpactDate || 'waktu dekat'}.`;
    }
  } else if (scoreAfter < 70 || emergencyFundImpactDate || costRatioWarning(totalCost, currentWealth)) {
    status = 'warning';
    if (emergencyFundImpactDate) {
      advice = `WASPADA! Tabunganmu masih cukup, tapi Dana Daruratmu akan mulai tergerus pada ${emergencyFundImpactDate}. Pastikan ada pemasukan tambahan!`;
    } else {
      advice = `PERHATIAN! Ini adalah pengeluaran yang lumayan besar. Pastikan kamu tidak ada rencana pengeluaran besar lainnya dalam 6 bulan ke depan.`;
    }
  }

  return {
    timeline,
    scoreBefore: currentHealthScore,
    scoreAfter,
    status,
    emergencyFundImpactDate,
    runwayMonths,
    advice,
    todayLabel
  };
}

function costRatioWarning(totalCost: number, wealth: number): boolean {
  if (wealth <= 0) return true;
  return (totalCost / wealth) > 0.25;
}
