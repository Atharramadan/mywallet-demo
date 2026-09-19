import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Target, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../../components/PageTransition';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { AppIcon } from '../../lib/icons';
import { useBudgetStore } from '../../stores/budgetStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatCurrency, formatCurrencyCompact, startOfMonth, endOfMonth } from '../../lib/formatters';
import { AddEditBudgetSheet } from './AddEditBudgetSheet';
import clsx from 'clsx';

export function BudgetsPage() {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingCatId, setEditingCatId] = useState<number | undefined>();
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null);
  
  const { budgets, deleteBudget, refresh } = useBudgetStore();
  
  useEffect(() => {
    refresh();
  }, [refresh]);
  const categories = useCategoryStore((s) => s.categories);
  const transactions = useTransactionStore((s) => s.transactions);

  const budgetItems = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    
    // Get all transactions for current month
    const thisMonthTx = transactions.filter(t => t.type === 'expense' && t.date >= start && t.date <= end);
    
    // Group by category
    const spentByCat = thisMonthTx.reduce((acc, tx) => {
      if (tx.categoryId) {
        acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
      }
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(budgets).map(([catIdStr, limit]) => {
      const catId = parseInt(catIdStr, 10);
      const category = categories.find(c => c.id === catId);
      const spent = spentByCat[catId] || 0;
      const percent = limit > 0 ? (spent / limit) * 100 : 0;
      
      let statusColor = 'bg-[#6ED9C4]'; // Safe
      let lightColor = 'bg-[#6ED9C4]/20';
      let textColor = 'text-[#6ED9C4]';
      if (percent >= 100) {
        statusColor = 'bg-rose';
        lightColor = 'bg-rose/20';
        textColor = 'text-rose';
      } else if (percent >= 80) {
        statusColor = 'bg-[#FFB088]';
        lightColor = 'bg-[#FFB088]/20';
        textColor = 'text-[#FFB088]';
      }

      return {
        catId,
        category,
        limit,
        spent,
        percent,
        statusColor,
        lightColor,
        textColor,
      };
    }).sort((a, b) => b.percent - a.percent);
  }, [budgets, categories, transactions]);

  const handleEdit = (catId: number) => {
    setEditingCatId(catId);
    setShowAddSheet(true);
  };

  const handleAddNew = () => {
    setEditingCatId(undefined);
    setShowAddSheet(true);
  };

  return (
    <PageTransition className="mx-auto flex min-h-dvh w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl flex-col bg-bg px-4 md:px-8 lg:px-10 pb-28 pt-6 dark:bg-bg-dark">
      <div className="glass-header -mx-4 md:-mx-8 lg:-mx-10 mb-6 flex items-center justify-between px-4 md:px-8 lg:px-10 py-4 pt-6 -mt-6 z-50">
        <div className="flex items-center gap-3">
          <Link
            to="/laporan"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface dark:bg-surface-dark card-shadow transition-transform active:scale-95"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display text-xl font-bold">Smart Budget</h1>
        </div>
        <button
          onClick={handleAddNew}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-purple text-white shadow-purple-glow transition-transform active:scale-95 glass-edge"
        >
          <Plus size={20} className="drop-shadow-sm" />
        </button>
      </div>

      <div className="mb-6 flex flex-col items-center justify-center rounded-3xl bg-linear-to-br from-purple to-purple-dark p-6 text-center text-white shadow-purple-glow relative overflow-hidden glass-edge">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner relative z-10">
          <Target size={28} className="drop-shadow-md text-white" />
        </div>
        <h2 className="mb-1 font-display text-xl font-bold relative z-10 drop-shadow-sm">Anggaran Bulanan</h2>
        <p className="text-sm font-medium text-white/80 max-w-62.5 relative z-10 leading-relaxed drop-shadow-sm">
          Kontrol pengeluaran pada kategori yang rawan bocor agar keuangan tetap sehat.
        </p>
      </div>

      {budgetItems.length === 0 ? (
        <EmptyState 
          mood="thinking" 
          title="Belum Ada Budget" 
          description="Tambahkan budget pada kategori tertentu untuk mengontrol batas pengeluaran." 
        />
      ) : (
        <div className="flex flex-col gap-4">
          {budgetItems.map((item) => (
            <Card key={item.catId} className="relative overflow-hidden glass-edge">
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm" style={{ backgroundColor: `${item.category?.color}20` }}>
                    <AppIcon name={item.category?.icon || 'circle'} size={22} style={{ color: item.category?.color }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base">{item.category?.name || 'Kategori Dihapus'}</h3>
                    <p className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
                      Sisa: <span className="font-bold tabular-nums">{formatCurrency(Math.max(item.limit - item.spent, 0))}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item.catId)} className="p-2 text-text-muted hover:text-purple transition-colors">
                    <AppIcon name="pencil" size={16} />
                  </button>
                  <button onClick={() => setDeletingCatId(item.catId)} className="p-2 text-text-muted hover:text-rose transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="relative z-10 mb-1 flex justify-between items-end">
                <span className={clsx('text-xs font-bold', item.textColor)}>
                  {formatCurrencyCompact(item.spent)} terpakai
                </span>
                <span className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-widest">
                  Limit: {formatCurrencyCompact(item.limit)}
                </span>
              </div>
              
              <div className="relative z-10 h-3 w-full rounded-full bg-surface-muted dark:bg-surface-muted-dark overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(item.percent, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={clsx('h-full rounded-full transition-colors duration-500', item.statusColor)}
                  style={{ boxShadow: `0 0 8px ${item.statusColor}80` }}
                />
              </div>
              
              {item.percent >= 100 ? (
                <p className="text-[10px] font-bold text-rose mt-2 flex items-center gap-1.5 bg-rose/10 px-2 py-1 rounded-md w-fit">
                  ⚠️ Limit terlampaui!
                </p>
              ) : item.percent >= 80 ? (
                <p className="text-[10px] font-bold text-peach mt-2 flex items-center gap-1.5 bg-peach/10 px-2 py-1 rounded-md w-fit">
                  ⚠️ Awas, sudah hampir habis!
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <AddEditBudgetSheet 
        open={showAddSheet} 
        onClose={() => setShowAddSheet(false)} 
        categoryId={editingCatId}
      />
      
      <Modal
        open={deletingCatId !== null}
        onClose={() => setDeletingCatId(null)}
        title="Hapus Anggaran?"
      >
        <p className="mb-6 text-text-muted dark:text-text-muted-dark">
          Apakah Anda yakin ingin menghapus anggaran ini?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeletingCatId(null)}>Batal</Button>
          <Button 
            variant="danger" 
            onClick={() => {
              if (deletingCatId) deleteBudget(deletingCatId);
              setDeletingCatId(null);
            }}
          >
            Hapus
          </Button>
        </div>
      </Modal>
    </PageTransition>
  );
}
