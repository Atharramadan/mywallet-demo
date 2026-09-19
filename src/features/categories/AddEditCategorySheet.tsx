import { useEffect, useState } from 'react';
import { Sheet } from '../../components/Sheet';
import { Button } from '../../components/Button';
import { IconPicker } from '../../components/IconPicker';
import { ColorPicker } from '../../components/ColorPicker';
import { useCategoryStore } from '../../stores/categoryStore';
import { useToastStore } from '../../stores/toastStore';
import type { Category, CategoryType } from '../../db/schema';

export function AddEditCategorySheet({
  open,
  onClose,
  category,
  defaultType,
}: {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
  defaultType: CategoryType;
}) {
  const createCategory = useCategoryStore((s) => s.create);
  const updateCategory = useCategoryStore((s) => s.update);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('ellipsis');
  const [color, setColor] = useState('#7C6FE0');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
    } else {
      setName('');
      setIcon('ellipsis');
      setColor('#7C6FE0');
    }
  }, [category, open]);

  async function handleSubmit() {
    if (!name.trim()) return showToast('Nama kategori tidak boleh kosong', 'error');
    if (category) {
      await updateCategory(category.id!, { name: name.trim(), icon, color });
    } else {
      await createCategory({ name: name.trim(), icon, color, type: defaultType });
    }
    showToast(category ? 'Kategori diperbarui' : 'Kategori ditambahkan', 'success');
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={category ? 'Edit Kategori' : 'Tambah Kategori'}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Nama Kategori</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Olahraga"
            className="w-full rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Warna</label>
          <ColorPicker value={color} onChange={setColor} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Ikon</label>
          <IconPicker value={icon} onChange={setIcon} color={color} />
        </div>
        <Button onClick={handleSubmit} fullWidth size="lg">
          Simpan Kategori
        </Button>
      </div>
    </Sheet>
  );
}
