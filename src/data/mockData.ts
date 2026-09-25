import type { Account, Category, Transaction, SavingsGoal, Budget, WealthSnapshot, AppSettings } from '../db/schema';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 1, name: 'BCA Utama', icon: 'landmark', color: '#7C6FE0', balance: 12450000, initialBalance: 5000000, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Bank Jago (Kantong)', icon: 'landmark', color: '#FFB088', balance: 5800000, initialBalance: 2000000, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'GoPay', icon: 'wallet', color: '#6ED9C4', balance: 450000, initialBalance: 200000, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: 'ShopeePay', icon: 'wallet', color: '#FF8DA1', balance: 280000, initialBalance: 100000, isArchived: false, createdAt: new Date(), updatedAt: new Date() },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Makanan & Minuman', icon: 'utensils', color: '#FF8DA1', type: 'expense', isDefault: true, isArchived: false },
  { id: 2, name: 'Transportasi', icon: 'car', color: '#7FB8E8', type: 'expense', isDefault: true, isArchived: false },
  { id: 3, name: 'Belanja', icon: 'shopping-bag', color: '#B4A7F5', type: 'expense', isDefault: true, isArchived: false },
  { id: 4, name: 'Tagihan & Utilitas', icon: 'receipt', color: '#FFB088', type: 'expense', isDefault: true, isArchived: false },
  { id: 5, name: 'Kesehatan', icon: 'heart-pulse', color: '#FF8080', type: 'expense', isDefault: true, isArchived: false },
  { id: 6, name: 'Hiburan', icon: 'clapperboard', color: '#7C6FE0', type: 'expense', isDefault: true, isArchived: false },
  { id: 7, name: 'Investasi', icon: 'trending-up', color: '#6ED9C4', type: 'expense', isDefault: true, isArchived: false },
  { id: 8, name: 'Lainnya', icon: 'ellipsis', color: '#A8A8B3', type: 'expense', isDefault: true, isArchived: false },
  
  { id: 9, name: 'Gaji Bulanan', icon: 'briefcase', color: '#6ED9C4', type: 'income', isDefault: true, isArchived: false },
  { id: 10, name: 'Freelance & Proyek', icon: 'laptop', color: '#7FB8E8', type: 'income', isDefault: true, isArchived: false },
  { id: 11, name: 'Dividen & Profit', icon: 'piggy-bank', color: '#B4A7F5', type: 'income', isDefault: true, isArchived: false },
  { id: 12, name: 'Hadiah', icon: 'gift', color: '#FFB088', type: 'income', isDefault: true, isArchived: false },
];

// Generate 35+ realistic transactions across current and past weeks
const now = new Date();
const daysAgo = (d: number, h = 12) => {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  date.setHours(h, 30, 0, 0);
  return date;
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, type: 'income', amount: 15000000, accountId: 1, categoryId: 9, note: 'Gaji Pokok Perusahaan Tech', date: daysAgo(18), createdAt: daysAgo(18) },
  { id: 2, type: 'income', amount: 4500000, accountId: 2, categoryId: 10, note: 'Proyek Web App Frontend', date: daysAgo(10), createdAt: daysAgo(10) },
  { id: 3, type: 'income', amount: 350000, accountId: 1, categoryId: 11, note: 'Dividen RDPU Sukuk', date: daysAgo(5), createdAt: daysAgo(5) },

  { id: 4, type: 'expense', amount: 750000, accountId: 1, categoryId: 4, note: 'Tagihan Listrik PLN & Indihome', date: daysAgo(16), createdAt: daysAgo(16) },
  { id: 5, type: 'expense', amount: 1200000, accountId: 1, categoryId: 3, note: 'Belanja Bulanan Supermarket', date: daysAgo(15), createdAt: daysAgo(15) },
  { id: 6, type: 'expense', amount: 45000, accountId: 3, categoryId: 1, note: 'Kopi Susu Senja', date: daysAgo(14), createdAt: daysAgo(14) },
  { id: 7, type: 'expense', amount: 25000, accountId: 3, categoryId: 2, note: 'Gojek ke Kantor', date: daysAgo(14), createdAt: daysAgo(14) },
  { id: 8, type: 'expense', amount: 120000, accountId: 1, categoryId: 1, note: 'Makan Siang Bareng Tim', date: daysAgo(13), createdAt: daysAgo(13) },
  { id: 9, type: 'expense', amount: 54000, accountId: 1, categoryId: 6, note: 'Langganan Netflix Premium', date: daysAgo(12), createdAt: daysAgo(12) },
  { id: 10, type: 'expense', amount: 2500000, accountId: 1, categoryId: 7, note: 'Beli Reksadana Pasar Uang Bibit', date: daysAgo(11), createdAt: daysAgo(11) },
  { id: 11, type: 'expense', amount: 65000, accountId: 4, categoryId: 1, note: 'Makan Malam Nasi Goreng', date: daysAgo(10), createdAt: daysAgo(10) },
  { id: 12, type: 'expense', amount: 350000, accountId: 1, categoryId: 3, note: 'Beli Baju Kemeja Kerja', date: daysAgo(9), createdAt: daysAgo(9) },
  { id: 13, type: 'expense', amount: 40000, accountId: 3, categoryId: 2, note: 'GrabCar Stasiun', date: daysAgo(8), createdAt: daysAgo(8) },
  { id: 14, type: 'expense', amount: 150000, accountId: 2, categoryId: 5, note: 'Beli Vitamin & Obat Apotek', date: daysAgo(7), createdAt: daysAgo(7) },
  { id: 15, type: 'expense', amount: 50000, accountId: 3, categoryId: 1, note: 'Kopi Kenangan & Roti', date: daysAgo(6), createdAt: daysAgo(6) },
  { id: 16, type: 'expense', amount: 85000, accountId: 1, categoryId: 6, note: 'Tiket Bioskop XXI', date: daysAgo(5), createdAt: daysAgo(5) },
  { id: 17, type: 'expense', amount: 1500000, accountId: 1, categoryId: 7, note: 'Top-up Investasi Bitcoin DCA', date: daysAgo(4), createdAt: daysAgo(4) },
  { id: 18, type: 'expense', amount: 75000, accountId: 3, categoryId: 1, note: 'Makan Siang Ramen', date: daysAgo(3), createdAt: daysAgo(3) },
  { id: 19, type: 'expense', amount: 20000, accountId: 4, categoryId: 2, note: 'Parkir & Tiket KRL', date: daysAgo(2), createdAt: daysAgo(2) },
  { id: 20, type: 'expense', amount: 95000, accountId: 1, categoryId: 1, note: 'Makan Malam Sushi Roll', date: daysAgo(1), createdAt: daysAgo(1) },
  { id: 21, type: 'expense', amount: 35000, accountId: 3, categoryId: 1, note: 'Ice Americano Pagi', date: daysAgo(0, 9), createdAt: daysAgo(0, 9) },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 1,
    name: 'Upgrade MacBook M3 Pro',
    targetAmount: 28000000,
    currentAmount: 21000000,
    icon: 'laptop',
    color: '#7C6FE0',
    description: 'Untuk produktivitas koding dan mobile dev.',
    isCompleted: false,
    targetDate: new Date(now.getFullYear(), now.getMonth() + 3, 1),
    createdAt: daysAgo(60),
  },
  {
    id: 2,
    name: 'Dana Darurat 6 Bulan',
    targetAmount: 30000000,
    currentAmount: 26500000,
    icon: 'shield-check',
    color: '#6ED9C4',
    description: 'Jaring pengaman finansial di instrumen RDPU cair cepat.',
    isCompleted: false,
    targetDate: new Date(now.getFullYear(), now.getMonth() + 2, 15),
    createdAt: daysAgo(120),
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: 1, categoryId: 1, amount: 2000000, period: 'monthly', createdAt: new Date(), updatedAt: new Date() }, // Makanan (Budget 2jt)
  { id: 2, categoryId: 3, amount: 1500000, period: 'monthly', createdAt: new Date(), updatedAt: new Date() }, // Belanja (Budget 1.5jt)
  { id: 3, categoryId: 6, amount: 500000, period: 'monthly', createdAt: new Date(), updatedAt: new Date() },  // Hiburan (Budget 500rb)
  { id: 4, categoryId: 2, amount: 600000, period: 'monthly', createdAt: new Date(), updatedAt: new Date() },  // Transportasi (Budget 600rb)
];

const getMonthStr = (offset: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${m}`;
};

export const INITIAL_WEALTH_SNAPSHOTS: WealthSnapshot[] = [
  {
    id: 1,
    month: getMonthStr(0),
    cryptoAmount: 16700000,
    mutualFundAmount: 25500000,
    note: JSON.stringify({
      rdpu: 18500000,
      rdSaham: 7000000,
      btc: 10200000,
      eth: 4000000,
      emas: 14850000,
      emasDetails: { type: 'fisik', weightGram: 10, pricePerGram: 1485000, lastUpdated: new Date().toISOString() },
      cryptoHoldings: [
        { id: 'c1', name: 'Bitcoin (BTC)', amount: 10200000 },
        { id: 'c2', name: 'Ethereum (ETH)', amount: 4000000 },
        { id: 'c3', name: 'Solana (SOL)', amount: 2500000 },
      ],
      sahamHoldings: [
        { id: 's1', name: 'BBCA (Bank Central Asia)', amount: 12500000 },
        { id: 's2', name: 'BBRI (Bank Rakyat Indonesia)', amount: 8000000 },
        { id: 's3', name: 'TLKM (Telkom Indonesia)', amount: 4500000 },
      ],
      obligasiHoldings: [
        { id: 'o1', name: 'ORI026 (Obligasi Negara Ritel)', amount: 10000000 },
        { id: 'o2', name: 'SR021 (Sukuk Ritel)', amount: 5000000 },
      ],
      reksadanaHoldings: [
        { id: 'r1', name: 'RDPU Sucorinvest Sharia Money Market', amount: 18500000 },
        { id: 'r2', name: 'RDPT Danamas Pasifik Stabil', amount: 7000000 },
      ],
      emergencyFundSources: [
        { id: 'ef1', name: 'RDPU Sucorinvest Sharia', amount: 18500000 },
        { id: 'ef2', name: 'Tabungan Khusus BCA', amount: 8000000 },
      ],
    }),
    createdAt: daysAgo(2),
  },
  {
    id: 2,
    month: getMonthStr(1),
    cryptoAmount: 14500000,
    mutualFundAmount: 23000000,
    note: JSON.stringify({
      rdpu: 16500000,
      rdSaham: 6500000,
      btc: 9000000,
      eth: 3500000,
      emas: 13500000,
      emasDetails: { type: 'fisik', weightGram: 10, pricePerGram: 1350000, lastUpdated: daysAgo(32).toISOString() },
      cryptoHoldings: [
        { id: 'c1', name: 'Bitcoin (BTC)', amount: 9000000 },
        { id: 'c2', name: 'Ethereum (ETH)', amount: 3500000 },
        { id: 'c3', name: 'Solana (SOL)', amount: 2000000 },
      ],
      sahamHoldings: [
        { id: 's1', name: 'BBCA (Bank Central Asia)', amount: 11000000 },
        { id: 's2', name: 'BBRI (Bank Rakyat Indonesia)', amount: 7500000 },
        { id: 's3', name: 'TLKM (Telkom Indonesia)', amount: 4000000 },
      ],
      obligasiHoldings: [
        { id: 'o1', name: 'ORI026 (Obligasi Negara Ritel)', amount: 10000000 },
        { id: 'o2', name: 'SR021 (Sukuk Ritel)', amount: 5000000 },
      ],
      reksadanaHoldings: [
        { id: 'r1', name: 'RDPU Sucorinvest Sharia Money Market', amount: 16500000 },
        { id: 'r2', name: 'RDPT Danamas Pasifik Stabil', amount: 6500000 },
      ],
      emergencyFundSources: [
        { id: 'ef1', name: 'RDPU Sucorinvest Sharia', amount: 16500000 },
        { id: 'ef2', name: 'Tabungan Khusus BCA', amount: 7000000 },
      ],
    }),
    createdAt: daysAgo(32),
  },
  {
    id: 3,
    month: getMonthStr(2),
    cryptoAmount: 12000000,
    mutualFundAmount: 20500000,
    note: JSON.stringify({
      rdpu: 15000000,
      rdSaham: 5500000,
      btc: 7800000,
      eth: 3000000,
      emas: 12000000,
      emasDetails: { type: 'fisik', weightGram: 10, pricePerGram: 1200000, lastUpdated: daysAgo(62).toISOString() },
      cryptoHoldings: [
        { id: 'c1', name: 'Bitcoin (BTC)', amount: 7800000 },
        { id: 'c2', name: 'Ethereum (ETH)', amount: 3000000 },
        { id: 'c3', name: 'Solana (SOL)', amount: 1200000 },
      ],
      sahamHoldings: [
        { id: 's1', name: 'BBCA (Bank Central Asia)', amount: 10000000 },
        { id: 's2', name: 'BBRI (Bank Rakyat Indonesia)', amount: 7000000 },
        { id: 's3', name: 'TLKM (Telkom Indonesia)', amount: 3500000 },
      ],
      obligasiHoldings: [
        { id: 'o1', name: 'ORI026 (Obligasi Negara Ritel)', amount: 10000000 },
      ],
      reksadanaHoldings: [
        { id: 'r1', name: 'RDPU Sucorinvest Sharia Money Market', amount: 15000000 },
        { id: 'r2', name: 'RDPT Danamas Pasifik Stabil', amount: 5500000 },
      ],
      emergencyFundSources: [
        { id: 'ef1', name: 'RDPU Sucorinvest Sharia', amount: 15000000 },
      ],
    }),
    createdAt: daysAgo(62),
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  id: 1,
  pinHash: '',
  pinSalt: '',
  theme: 'dark',
  notificationsEnabled: true,
  hasSeenInstallBanner: true,
  isInstalled: false,
  userName: 'Demo User',
  wealthTarget: 100000000,
  emergencyFundTarget: 30000000,
  emergencyFundBalance: 18500000,
};
