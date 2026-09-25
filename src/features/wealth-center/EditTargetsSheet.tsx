import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, ShieldCheck, Target, Sparkles, AlertTriangle } from 'lucide-react';
import { Sheet } from '../../components/Sheet';
import { useSettingsStore } from '../../stores/settingsStore';
import { useWealthStore, parseWealthNote, type EmergencyFundSource } from '../../stores/wealthStore';
import { formatCurrency } from '../../lib/formatters';

interface EditTargetsSheetProps {
  open: boolean;
  onClose: () => void;
}

interface SourceRow {
  id: string;
  name: string;
  amount: string;
}

const PRESET_SOURCES = [
  'RDPU (Pasar Uang)',
  'Rekening Bank Khusus',
  'Deposito',
  'Logam Mulia (Emas)',
  'Kas Tunai Fisik',
];

export function EditTargetsSheet({ open, onClose }: EditTargetsSheetProps) {
  const settings = useSettingsStore((s) => s.settings);
  const setWealthTarget = useSettingsStore((s) => s.setWealthTarget);
  const setEmergencyFundTarget = useSettingsStore((s) => s.setEmergencyFundTarget);
  const setEmergencyFundBalance = useSettingsStore((s) => s.setEmergencyFundBalance);

  const snapshots = useWealthStore((s) => s.snapshots);
  const addSnapshot = useWealthStore((s) => s.addSnapshot);

  const [wealthTargetStr, setWealthTargetStr] = useState('');
  const [emergencyTargetStr, setEmergencyTargetStr] = useState('');
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<SourceRow | null>(null);

  useEffect(() => {
    if (open) {
      setDeleteConfirm(null);
      setWealthTargetStr(settings?.wealthTarget?.toString() || '5000000');
      setEmergencyTargetStr(settings?.emergencyFundTarget?.toString() || '0');

      // Populate emergency sources
      if (snapshots.length > 0) {
        const latest = snapshots[0];
        const details = parseWealthNote(latest.note);
        if (details.emergencyFundSources && details.emergencyFundSources.length > 0) {
          setSources(
            details.emergencyFundSources.map((s) => ({
              id: s.id,
              name: s.name,
              amount: s.amount ? s.amount.toString() : '',
            }))
          );
        } else if (details.rdpu > 0) {
          setSources([
            { id: 'default-rdpu', name: 'RDPU (Pasar Uang)', amount: details.rdpu.toString() },
          ]);
        } else if (settings?.emergencyFundBalance && settings.emergencyFundBalance > 0) {
          setSources([
            { id: 'default-balance', name: 'Dana Darurat Utama', amount: settings.emergencyFundBalance.toString() },
          ]);
        } else {
          setSources([]);
        }
      } else if (settings?.emergencyFundBalance && settings.emergencyFundBalance > 0) {
        setSources([
          { id: 'default-balance', name: 'Dana Darurat Utama', amount: settings.emergencyFundBalance.toString() },
        ]);
      } else {
        setSources([]);
      }
    }
  }, [open, settings, snapshots]);

  const totalEmergencyAccumulated = sources.reduce(
    (sum, r) => sum + (Number(r.amount) || 0),
    0
  );

  const addSourceRow = (presetName = '') => {
    setSources((prev) => [
      ...prev,
      {
        id: `ef-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: presetName,
        amount: '',
      },
    ]);
  };

  const updateSourceRow = (id: string, field: 'name' | 'amount', val: string) => {
    setSources((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const removeSourceRow = (id: string) => {
    setSources((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDeleteClick = (row: SourceRow) => {
    // Jika baris kosong (belum ada nama dan nominal), langsung hapus tanpa modal
    if (!row.name.trim() && (!row.amount || Number(row.amount) === 0)) {
      removeSourceRow(row.id);
      return;
    }
    // Jika sudah memiliki nama atau nominal terisi, munculkan validasi konfirmasi
    setDeleteConfirm(row);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeSourceRow(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wTarget = Number(wealthTargetStr) || 5000000;
    const eTarget = Number(emergencyTargetStr) || 0;
    const eBalance = totalEmergencyAccumulated;

    await setWealthTarget(wTarget);
    await setEmergencyFundTarget(eTarget);
    await setEmergencyFundBalance(eBalance);

    // Persist sources to snapshot note
    const cleanSources: EmergencyFundSource[] = sources
      .filter((s) => s.name.trim() || Number(s.amount) > 0)
      .map((s) => ({
        id: s.id,
        name: s.name.trim(),
        amount: Number(s.amount) || 0,
      }));

    if (snapshots.length > 0) {
      const latest = snapshots[0];
      const details = parseWealthNote(latest.note);
      details.emergencyFundSources = cleanSources;
      await addSnapshot(latest.cryptoAmount, latest.mutualFundAmount, JSON.stringify(details));
    } else {
      await addSnapshot(
        0,
        0,
        JSON.stringify({
          cryptoHoldings: [],
          sahamHoldings: [],
          obligasiHoldings: [],
          rdpu: 0,
          rdSaham: 0,
          emas: 0,
          emergencyFundSources: cleanSources,
        })
      );
    }

    onClose();
  };

  return (
    <>
      <Sheet 
        open={open} 
        onClose={onClose} 
        title="Atur Target & Dana Darurat" 
        size="2xl"
        footer={
          <button
            type="submit"
            form="edit-targets-form"
            className="w-full rounded-xl bg-purple py-3.5 font-bold text-white shadow-soft transition-transform active:scale-95 cursor-pointer"
          >
            Simpan Target & Alokasi
          </button>
        }
      >
        <form id="edit-targets-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Target Kekayaan */}
        <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-amber-500" />
            <label className="text-sm font-bold">Target Kekayaan (Net Worth Goal)</label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
            <input
              type="number"
              value={wealthTargetStr}
              onChange={(e) => setWealthTargetStr(e.target.value)}
              placeholder="5000000"
              className="w-full rounded-xl bg-surface dark:bg-surface-dark py-3 pl-9 pr-4 text-sm font-semibold outline-hidden border border-border dark:border-border-dark focus:ring-2 focus:ring-purple/50"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-text-muted dark:text-text-muted-dark">
            Sasaran akumulasi total kekayaan bersih (kas + seluruh investasi) yang ingin kamu capai.
          </p>
        </div>

        {/* Target Dana Darurat */}
        <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <label className="text-sm font-bold">Target Nominal Dana Darurat</label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
            <input
              type="number"
              value={emergencyTargetStr}
              onChange={(e) => setEmergencyTargetStr(e.target.value)}
              placeholder="10000000"
              className="w-full rounded-xl bg-surface dark:bg-surface-dark py-3 pl-9 pr-4 text-sm font-semibold outline-hidden border border-border dark:border-border-dark focus:ring-2 focus:ring-purple/50"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-text-muted dark:text-text-muted-dark">
            Idealnya setara 3 s/d 6 bulan pengeluaran rutin bulananmu.
          </p>
        </div>

        {/* Alokasi Sumber Dana Darurat (Multi-Asset) */}
        <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-500" />
              <h3 className="text-sm font-bold">Sumber Simpanan Aset Aman</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Terkumpul: {formatCurrency(totalEmergencyAccumulated)}
            </span>
          </div>

          <p className="text-[11px] text-text-muted dark:text-text-muted-dark leading-relaxed">
            Dana darurat tidak harus disimpan di satu tempat. Kamu bebas menentukan dan mengetik pos penyimpanan aset yang aman & likuid.
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-text-muted dark:text-text-muted-dark self-center mr-1">Rekomendasi:</span>
            {PRESET_SOURCES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => addSourceRow(preset)}
                className="rounded-lg bg-surface dark:bg-surface-dark px-2.5 py-1 text-[11px] font-semibold text-text-muted dark:text-text-muted-dark hover:text-emerald-600 hover:border-emerald-500/40 border border-border dark:border-border-dark transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>

          {/* List of Sources */}
          <div className="flex flex-col gap-2.5 mt-2">
            {sources.map((row) => (
              <div key={row.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nama Pos (mis: RDPU, Bank)"
                  value={row.name}
                  onChange={(e) => updateSourceRow(row.id, 'name', e.target.value)}
                  className="w-1/2 rounded-xl bg-surface dark:bg-surface-dark px-3 py-2.5 text-xs font-semibold outline-hidden border border-border dark:border-border-dark focus:ring-2 focus:ring-emerald-500/50"
                />
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={row.amount}
                    onChange={(e) => updateSourceRow(row.id, 'amount', e.target.value)}
                    className="w-full rounded-xl bg-surface dark:bg-surface-dark py-2.5 pl-8 pr-3 text-xs font-semibold outline-hidden border border-border dark:border-border-dark focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(row)}
                  aria-label="Hapus sumber"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors shrink-0 cursor-pointer active:scale-95"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSourceRow('')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <Plus size={14} /> Tambah Sumber Dana Darurat
            </button>
          </div>
        </div>

        </form>
      </Sheet>

    {/* Confirmation Dialog for Delete Emergency Source with Portal & Safe Stacking */}
    {deleteConfirm && typeof document !== 'undefined' && createPortal(
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in overflow-hidden"
        style={{ width: '100vw', height: '100dvh' }}
        onClick={() => setDeleteConfirm(null)}
      >
        <div 
          className="w-full max-w-[340px] sm:max-w-sm rounded-3xl bg-surface dark:bg-surface-dark p-5 card-shadow border border-border dark:border-border-dark flex flex-col gap-3 my-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2.5 text-rose-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15">
              <AlertTriangle size={20} />
            </div>
            <h4 className="font-display text-base font-bold">Hapus Sumber Dana?</h4>
          </div>

          <p className="text-xs text-text dark:text-white leading-relaxed">
            Apakah Anda yakin ingin menghapus pos simpanan{' '}
            <strong className="font-bold text-rose-500">
              {deleteConfirm.name || 'pos ini'}
            </strong>
            {Number(deleteConfirm.amount) > 0 && (
              <> senilai <strong className="font-semibold text-text dark:text-text-dark">{formatCurrency(Number(deleteConfirm.amount))}</strong></>
            )}
            {' '}dari daftar alokasi aset aman?
          </p>

          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2.5 rounded-xl border border-border dark:border-border-dark text-xs font-semibold text-text-muted hover:bg-surface-muted dark:hover:bg-surface-muted-dark transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white shadow-soft transition-colors cursor-pointer"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
  </>
);
}
