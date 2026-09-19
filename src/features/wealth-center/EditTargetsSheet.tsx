import { useState, useEffect } from 'react';
import { Sheet } from '../../components/Sheet';
import { useSettingsStore } from '../../stores/settingsStore';

interface EditTargetsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function EditTargetsSheet({ open, onClose }: EditTargetsSheetProps) {
  const settings = useSettingsStore((s) => s.settings);
  const setWealthTarget = useSettingsStore((s) => s.setWealthTarget);
  const setEmergencyFundTarget = useSettingsStore((s) => s.setEmergencyFundTarget);
  const setEmergencyFundBalance = useSettingsStore((s) => s.setEmergencyFundBalance);
  
  const [wealthTargetStr, setWealthTargetStr] = useState('');
  const [emergencyTargetStr, setEmergencyTargetStr] = useState('');
  const [emergencyBalanceStr, setEmergencyBalanceStr] = useState('');

  useEffect(() => {
    if (open) {
      setWealthTargetStr(settings?.wealthTarget?.toString() || '5000000');
      setEmergencyTargetStr(settings?.emergencyFundTarget?.toString() || '0');
      setEmergencyBalanceStr(settings?.emergencyFundBalance?.toString() || '0');
    }
  }, [open, settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wTarget = Number(wealthTargetStr) || 5000000;
    const eTarget = Number(emergencyTargetStr) || 0;
    const eBalance = Number(emergencyBalanceStr) || 0;
    
    await setWealthTarget(wTarget);
    await setEmergencyFundTarget(eTarget);
    await setEmergencyFundBalance(eBalance);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Atur Target Finansial">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">Target Kekayaan</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
            <input
              type="number"
              value={wealthTargetStr}
              onChange={(e) => setWealthTargetStr(e.target.value)}
              placeholder="5000000"
              className="w-full rounded-xl bg-surface-muted dark:bg-surface-muted-dark py-3 pl-9 pr-4 font-semibold outline-hidden focus:ring-2 focus:ring-purple/50"
            />
          </div>
          <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">Contoh: 5000000, 10000000, 25000000</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Target Dana Darurat</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
            <input
              type="number"
              value={emergencyTargetStr}
              onChange={(e) => setEmergencyTargetStr(e.target.value)}
              placeholder="5000000"
              className="w-full rounded-xl bg-surface-muted dark:bg-surface-muted-dark py-3 pl-9 pr-4 font-semibold outline-hidden focus:ring-2 focus:ring-purple/50"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Terkumpul Dana Darurat Saat Ini</label>
          <div className="relative opacity-70">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
            <input
              type="number"
              value={emergencyBalanceStr}
              disabled
              placeholder="1000000"
              className="w-full rounded-xl bg-surface-muted dark:bg-surface-muted-dark py-3 pl-9 pr-4 font-semibold outline-hidden focus:ring-2 focus:ring-purple/50 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-xs text-blue dark:text-blue-400">Saldo ini sekarang disinkronkan secara otomatis dari saldo RDPU (Wealth Center).</p>
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-purple py-3.5 font-bold text-white shadow-soft transition-transform active:scale-95"
        >
          Simpan Target
        </button>
      </form>
    </Sheet>
  );
}
