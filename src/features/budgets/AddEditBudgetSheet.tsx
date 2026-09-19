import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useCategoryStore } from '../../stores/categoryStore';
import { useBudgetStore } from '../../stores/budgetStore';
import { AppIcon } from '../../lib/icons';
import clsx from 'clsx';
import { Sheet } from '../../components/Sheet';
import { Button } from '../../components/Button';

interface AddEditBudgetSheetProps {
  open: boolean;
  onClose: () => void;
  categoryId?: number;
}

export function AddEditBudgetSheet({ open, onClose, categoryId }: AddEditBudgetSheetProps) {
  const categories = useCategoryStore((s) => s.categories).filter(c => c.type === 'expense');
  const { budgets, setBudget } = useBudgetStore();
  
  const [selectedCatId, setSelectedCatId] = useState<number | null>(categoryId || null);
  const [amountStr, setAmountStr] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (open) {
      if (categoryId) {
        setSelectedCatId(categoryId);
        setAmountStr(budgets[categoryId]?.toString() || '');
      } else {
        setSelectedCatId(null);
        setAmountStr('');
      }
      setSearch('');
    }
  }, [open, categoryId, budgets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId) return;
    const val = parseInt(amountStr.replace(/\D/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      setBudget(selectedCatId, val);
      onClose();
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sheet 
      open={open} 
      onClose={onClose} 
      title={categoryId ? 'Edit Budget' : 'Tambah Budget'}
    >
      <div className="flex flex-col gap-6">
        {!categoryId && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold">Pilih Kategori</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari kategori pengeluaran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-surface-muted dark:bg-surface-muted-dark py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-purple/50 transition-shadow"
              />
            </div>
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1 pb-4 no-scrollbar">
              {filteredCategories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCatId(c.id!)}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-all active:scale-95',
                    selectedCatId === c.id 
                      ? 'bg-purple/10 border-2 border-purple shadow-sm' 
                      : 'bg-surface dark:bg-surface-dark border-2 border-transparent hover:border-border dark:hover:border-border-dark'
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${c.color}20` }}>
                    <AppIcon name={c.icon} size={18} style={{ color: c.color }} />
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {categoryId && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-muted dark:bg-surface-muted-dark">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${categories.find(c => c.id === categoryId)?.color}20` }}>
              <AppIcon name={categories.find(c => c.id === categoryId)?.icon || 'circle'} size={24} style={{ color: categories.find(c => c.id === categoryId)?.color }} />
            </div>
            <div>
              <p className="text-sm text-text-muted dark:text-text-muted-dark font-medium">Kategori</p>
              <p className="font-display font-bold text-lg">{categories.find(c => c.id === categoryId)?.name}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold">Batas Pengeluaran Bulanan</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-xl font-bold text-text-muted dark:text-text-muted-dark">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amountStr ? parseInt(amountStr.replace(/\D/g, '') || '0', 10).toLocaleString('id-ID') : ''}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full rounded-2xl bg-surface-muted dark:bg-surface-muted-dark py-4 pl-12 pr-4 font-display text-2xl font-bold outline-none focus:ring-2 focus:ring-purple/50 transition-shadow"
            />
          </div>
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!selectedCatId || !amountStr || parseInt(amountStr.replace(/\D/g, ''), 10) <= 0}
          className="mt-4"
        >
          Simpan Budget
        </Button>
      </div>
    </Sheet>
  );
}
