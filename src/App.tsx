import { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { haptic } from './lib/haptic';

import { DashboardPage } from './features/dashboard/DashboardPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { AddEditTransactionSheet } from './features/transactions/AddEditTransactionSheet';

const AccountsPage = lazy(() => import('./features/accounts/AccountsPage').then((m) => ({ default: m.AccountsPage })));
const CategoriesPage = lazy(() => import('./features/categories/CategoriesPage').then((m) => ({ default: m.CategoriesPage })));
const SavingsGoalsPage = lazy(() => import('./features/savings-goals/SavingsGoalsPage').then((m) => ({ default: m.SavingsGoalsPage })));
const CalendarPage = lazy(() => import('./features/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })));
const ReportsPage = lazy(() => import('./features/reports/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const SearchPage = lazy(() => import('./features/search/SearchPage').then((m) => ({ default: m.SearchPage })));
const BackupRestorePage = lazy(() => import('./features/backup-restore/BackupRestorePage').then((m) => ({ default: m.BackupRestorePage })));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const ProfilePage = lazy(() => import('./features/settings/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AboutPage = lazy(() => import('./features/settings/AboutPage').then((m) => ({ default: m.AboutPage })));
const FaqPage = lazy(() => import('./features/settings/FaqPage').then((m) => ({ default: m.FaqPage })));
const ChangelogPage = lazy(() => import('./features/settings/ChangelogPage').then((m) => ({ default: m.ChangelogPage })));
const WealthCenterPage = lazy(() => import('./features/wealth-center/WealthCenterPage').then((m) => ({ default: m.WealthCenterPage })));
const WealthAchievementsPage = lazy(() => import('./features/wealth-center/WealthAchievementsPage').then((m) => ({ default: m.WealthAchievementsPage })));
const InvestmentPortfolioPage = lazy(() => import('./features/wealth-center/InvestmentPortfolioPage').then((m) => ({ default: m.InvestmentPortfolioPage })));
const BudgetsPage = lazy(() => import('./features/budgets/BudgetsPage').then((m) => ({ default: m.BudgetsPage })));

import { BottomNav } from './components/BottomNav';
import { SidebarNav } from './components/SidebarNav';
import { ToastHost } from './components/ToastHost';
import { Mascot } from './components/Mascot';

function SplashScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg dark:bg-bg-dark">
      <Mascot mood="idle" size={90} />
      <p className="font-display text-sm font-medium text-text-muted dark:text-text-muted-dark">Memuat MyWallet…</p>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  return (
    <div className="relative mx-auto flex w-full max-w-full sm:max-w-md md:max-w-full min-h-dvh flex-col md:flex-row bg-bg shadow-2xl dark:bg-bg-dark overflow-x-hidden">
      <ToastHost />
      <SidebarNav
        onAddTransaction={() => {
          haptic.medium();
          setShowAddTransaction(true);
        }}
      />

      <div className="flex-1 min-w-0 flex flex-col relative z-10 overflow-x-hidden md:pl-64 lg:pl-72">
        <div key={location.pathname} className="animate-page-enter min-h-dvh flex flex-col relative z-10">
          <Suspense fallback={<SplashScreen />}>
            <Routes location={location}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transaksi" element={<TransactionsPage />} />
              <Route path="/laporan" element={<ReportsPage />} />
              <Route path="/kalender" element={<CalendarPage />} />
              <Route path="/tabungan" element={<SavingsGoalsPage />} />
              <Route path="/budget" element={<BudgetsPage />} />
              <Route path="/cari" element={<SearchPage />} />
              <Route path="/pengaturan" element={<SettingsPage />} />
              <Route path="/pengaturan/profil" element={<ProfilePage />} />
              <Route path="/pengaturan/akun" element={<AccountsPage />} />
              <Route path="/pengaturan/kategori" element={<CategoriesPage />} />
              <Route path="/pengaturan/backup" element={<BackupRestorePage />} />
              <Route path="/pengaturan/tentang" element={<AboutPage />} />
              <Route path="/pengaturan/panduan" element={<FaqPage />} />
              <Route path="/pengaturan/changelog" element={<ChangelogPage />} />
              <Route path="/wealth-center" element={<WealthCenterPage />} />
              <Route path="/wealth-center/achievements" element={<WealthAchievementsPage />} />
              <Route path="/wealth-center/investasi" element={<InvestmentPortfolioPage />} />
            </Routes>
          </Suspense>
        </div>

        <BottomNav />
        <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-full sm:max-w-md md:hidden pointer-events-none flex justify-end px-5">
          <button
            onClick={() => {
              haptic.medium();
              setShowAddTransaction(true);
            }}
            aria-label="Tambah transaksi"
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple text-white shadow-purple-glow backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 border border-white/30 dark:border-white/15 cursor-pointer"
          >
            <Plus size={26} className="drop-shadow-sm" />
          </button>
        </div>
      </div>
      <AddEditTransactionSheet open={showAddTransaction} onClose={() => setShowAddTransaction(false)} />
    </div>
  );
}
