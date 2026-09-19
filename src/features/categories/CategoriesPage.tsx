import { useState } from 'react';
import { ArrowLeft, Plus, Archive, ArchiveRestore, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppIcon } from '../../lib/icons';
import { useCategoryStore } from '../../stores/categoryStore';
import { AddEditCategorySheet } from './AddEditCategorySheet';
import type { Category, CategoryType } from '../../db/schema';

export function CategoriesPage() {
  const categories = useCategoryStore((s) => s.categories);
  const archiveCategory = useCategoryStore((s) => s.archive);
  const unarchiveCategory = useCategoryStore((s) => s.unarchive);
  const [type, setType] = useState<CategoryType>('expense');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const active = categories.filter((c) => c.type === type && !c.isArchived);
  const archived = categories.filter((c) => c.type === type && c.isArchived);

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/pengaturan" className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Kelola Kategori</h1>
      </div>

      <div className="mb-5 flex gap-1.5 rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-1.5">
        {(['expense', 'income'] as CategoryType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={clsx(
              'flex-1 rounded-xl py-2 text-sm font-semibold transition-colors',
              type === t ? 'bg-purple text-white' : 'text-text-muted dark:text-text-muted-dark'
            )}
          >
            {t === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {active.map((cat) => (
          <Card key={cat.id} className="p-3.5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${cat.color}22` }}>
                <AppIcon name={cat.icon} size={18} style={{ color: cat.color }} />
              </div>
              <div className="flex gap-0.5">
                <button onClick={() => setEditing(cat)} className="rounded-full p-1.5 text-text-muted dark:text-text-muted-dark">
                  <Pencil size={13} />
                </button>
                {!cat.isDefault && (
                  <button onClick={() => archiveCategory(cat.id!)} className="rounded-full p-1.5 text-text-muted dark:text-text-muted-dark">
                    <Archive size={13} />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 truncate text-sm font-medium">{cat.name}</p>
          </Card>
        ))}
      </div>

      <Button variant="secondary" fullWidth className="mt-4" onClick={() => setShowAdd(true)}>
        <Plus size={18} /> Tambah Kategori
      </Button>

      {archived.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="text-xs font-medium text-text-muted dark:text-text-muted-dark"
          >
            {showArchived ? 'Sembunyikan' : 'Tampilkan'} kategori diarsipkan ({archived.length})
          </button>
          {showArchived && (
            <div className="mt-3 flex flex-col gap-2">
              {archived.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3 rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-3 opacity-70">
                  <AppIcon name={cat.icon} size={16} style={{ color: cat.color }} />
                  <span className="flex-1 text-sm">{cat.name}</span>
                  <button onClick={() => unarchiveCategory(cat.id!)} className="rounded-full p-1.5 text-text-muted dark:text-text-muted-dark">
                    <ArchiveRestore size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AddEditCategorySheet open={showAdd} onClose={() => setShowAdd(false)} defaultType={type} />
      <AddEditCategorySheet open={!!editing} onClose={() => setEditing(null)} category={editing} defaultType={type} />
    </div>
  );
}
