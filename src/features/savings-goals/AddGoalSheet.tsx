import { useState } from 'react';
import { Sheet } from '../../components/Sheet';
import { Button } from '../../components/Button';
import { CurrencyInput } from '../../components/CurrencyInput';
import { IconPicker } from '../../components/IconPicker';
import { ColorPicker } from '../../components/ColorPicker';
import { useSavingsStore } from '../../stores/savingsStore';
import { useToastStore } from '../../stores/toastStore';
import { haptic } from '../../lib/haptic';

export function AddGoalSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createGoal = useSavingsStore((s) => s.create);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('piggy-bank');
  const [color, setColor] = useState('#FFB088');

  function reset() {
    setName('');
    setTargetAmount(0);
    setTargetDate('');
    setDescription('');
    setIcon('piggy-bank');
    setColor('#FFB088');
  }

  async function handleSubmit() {
    if (!name.trim()) {
      haptic.error();
      return showToast('Nama target tidak boleh kosong', 'error');
    }
    if (targetAmount <= 0) {
      haptic.error();
      return showToast('Nominal target harus lebih dari 0', 'error');
    }
    
    try {
      await createGoal({
        name: name.trim(),
        targetAmount,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        description: description.trim() || undefined,
        icon,
        color,
      });
      haptic.success();
      showToast('Target tabungan dibuat', 'success');
      reset();
      onClose();
    } catch (err: any) {
      haptic.error();
      showToast('Gagal membuat target: ' + err.message, 'error');
    }
  }

  return (
    <Sheet open={open} onClose={() => { reset(); onClose(); }} title="Target Tabungan Baru">
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Nama Target</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Dana Darurat"
            className="w-full rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Nominal Target</label>
          <CurrencyInput value={targetAmount} onChange={setTargetAmount} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Tanggal Target (opsional)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">Deskripsi (opsional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-2xl border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-muted-dark px-4 py-3 text-sm outline-none"
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
          Buat Target
        </Button>
      </div>
    </Sheet>
  );
}
