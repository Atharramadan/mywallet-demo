import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  ArrowLeftRight, 
  TrendingUp, 
  PieChart, 
  Settings, 
  Calendar, 
  Target, 
  Wallet, 
  Plus, 
  Sparkles,
  Search,
  HelpCircle
} from 'lucide-react';
import clsx from 'clsx';
import { Mascot } from './Mascot';

const SIDEBAR_ITEMS = [
  { to: '/', label: 'Beranda', icon: LayoutGrid, exact: true },
  { to: '/transaksi', label: 'Transaksi', icon: ArrowLeftRight },
  { to: '/wealth-center', label: 'Wealth Center', icon: TrendingUp, highlight: true },
  { to: '/laporan', label: 'Laporan Keuangan', icon: PieChart },
  { to: '/kalender', label: 'Kalender', icon: Calendar },
  { to: '/tabungan', label: 'Target Tabungan', icon: Target },
  { to: '/budget', label: 'Anggaran Budget', icon: Wallet },
  { to: '/cari', label: 'Pencarian', icon: Search },
  { to: '/pengaturan', label: 'Pengaturan', icon: Settings },
];

interface SidebarNavProps {
  onAddTransaction: () => void;
}

export function SidebarNav({ onAddTransaction }: SidebarNavProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-border/70 dark:border-border-dark/70 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-2xl fixed left-0 top-0 bottom-0 h-dvh z-50 px-4 py-6 justify-between overflow-y-auto no-scrollbar shadow-2xl">
      {/* Top Header & Brand */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-purple/30 via-purple/15 to-blue/20 border border-purple/30 glow-mesh shadow-sm">
            <Mascot mood="happy" size={32} />
          </div>
          <div>
            <h1 className="font-display text-lg font-black tracking-tight bg-linear-to-r from-purple via-purple-dark to-blue bg-clip-text text-transparent">
              MyWallet
            </h1>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple/10 dark:bg-purple/20 border border-purple/25 text-[9px] font-bold tracking-wider uppercase text-purple dark:text-purple-300 mt-0.5">
              <Sparkles size={10} className="animate-pulse" />
              <span>Web Edition v3.0</span>
            </div>
          </div>
        </div>

        {/* Action Button: Tambah Transaksi */}
        <div className="px-1">
          <button
            onClick={onAddTransaction}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-purple via-purple-dark to-blue px-4 py-3.5 text-sm font-extrabold text-white shadow-purple-glow transition-all duration-300 hover:scale-[1.02] active:scale-98 border border-white/25 cursor-pointer group"
          >
            <Plus size={20} className="stroke-3 group-hover:rotate-90 transition-transform duration-300" />
            <span>Tambah Transaksi</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 px-1">
          <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-text-muted/80 dark:text-gray-400">
            Menu Utama
          </p>
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 relative overflow-hidden',
                    isActive
                      ? 'bg-linear-to-r from-purple/20 to-purple/5 dark:from-purple/30 dark:to-purple/10 text-purple font-extrabold dark:text-white shadow-xs border border-purple/30 dark:border-purple/40'
                      : 'font-semibold text-text-muted dark:text-gray-300 hover:bg-surface-muted dark:hover:bg-white/5 hover:text-text dark:hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple rounded-r-full shadow-purple-glow" />
                    )}
                    <div className={clsx(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-purple text-white shadow-md scale-105" 
                        : "bg-surface-muted dark:bg-white/5 text-text-muted dark:text-gray-300 group-hover:text-purple group-hover:bg-purple/15 group-hover:scale-110"
                    )}>
                      <Icon size={18} />
                    </div>
                    <span className="truncate flex-1">{item.label}</span>
                    {item.highlight && (
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="mt-6 px-1 pt-4 border-t border-border/60 dark:border-border-dark/60">
        <div className="rounded-2xl bg-linear-to-br from-purple/15 via-surface-muted to-blue/15 dark:from-purple-900/30 dark:via-surface-muted-dark dark:to-blue-950/20 p-4 border border-purple/25 dark:border-purple/35 relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple text-white shadow-xs">
              <HelpCircle size={15} />
            </div>
            <span className="text-xs font-extrabold text-text dark:text-white">Butuh Bantuan?</span>
          </div>
          <p className="text-[11px] text-text dark:text-gray-200 font-medium leading-relaxed mb-3">
            Cek panduan penggunaan dan informasi fitur aplikasi MyWallet.
          </p>
          <NavLink 
            to="/pengaturan/panduan"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple text-white text-[11px] font-bold shadow-sm hover:bg-purple-dark transition-all duration-200 group"
          >
            <span>Buka FAQ & Panduan</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
