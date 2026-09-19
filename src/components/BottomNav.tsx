import { NavLink } from 'react-router-dom';
import { LayoutGrid, ArrowLeftRight, TrendingUp, PieChart, Settings } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/', label: 'Beranda', icon: LayoutGrid },
  { to: '/transaksi', label: 'Transaksi', icon: ArrowLeftRight },
  { to: '/wealth-center', label: '', icon: TrendingUp },
  { to: '/laporan', label: 'Laporan', icon: PieChart },
  { to: '/pengaturan', label: 'Pengaturan', icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/20 dark:border-white/5 bg-surface/75 dark:bg-surface-dark/75 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl items-center justify-between px-4 md:px-12 lg:px-16 py-2.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          if (item.to === '/wealth-center') {
            return (
              <NavLink
                key="wealth"
                to="/wealth-center"
                aria-label="Wealth Center"
                className={({ isActive }) =>
                  clsx(
                    '-mt-7 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-purple-glow transition-transform active:scale-90 glass-edge',
                    isActive ? 'bg-purple-dark' : 'bg-purple'
                  )
                }
              >
                <Icon size={26} className="drop-shadow-md" />
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors',
                  isActive
                    ? 'text-purple'
                    : 'text-text-muted dark:text-text-muted-dark'
                )
              }
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
