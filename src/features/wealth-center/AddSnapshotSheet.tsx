import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, Coins, TrendingUp, FileText, PieChart, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import { Sheet } from '../../components/Sheet';
import { useWealthStore, parseWealthNote, type AssetHoldingItem } from '../../stores/wealthStore';
import { formatCurrency } from '../../lib/formatters';
import { fetchRealtimeGoldPrice, getCachedGoldPrice } from '../../services/goldPrice';

export type CategoryFilter = 'all' | 'crypto' | 'saham' | 'obligasi' | 'reksadana' | 'emas';

interface AddSnapshotSheetProps {
  open: boolean;
  onClose: () => void;
  initialCategory?: CategoryFilter;
}

interface DynamicRow {
  id: string;
  name: string;
  amount: string;
}

interface DeleteTarget {
  id: string;
  name: string;
  amount: number;
  category: 'crypto' | 'saham' | 'obligasi' | 'reksadana';
}

const REKSA_PRESETS = [
  'RDPU (Pasar Uang)',
  'RD Pendapatan Tetap (RDPT)',
  'RD Campuran',
  'RD Saham',
  'RD Indeks',
];

export function AddSnapshotSheet({ open, onClose, initialCategory = 'all' }: AddSnapshotSheetProps) {
  const addSnapshot = useWealthStore((s) => s.addSnapshot);
  const snapshots = useWealthStore((s) => s.snapshots);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(initialCategory);

  // Dynamic holding lists
  const [cryptoRows, setCryptoRows] = useState<DynamicRow[]>([]);
  const [sahamRows, setSahamRows] = useState<DynamicRow[]>([]);
  const [obligasiRows, setObligasiRows] = useState<DynamicRow[]>([]);
  const [reksadanaRows, setReksadanaRows] = useState<DynamicRow[]>([]);

  // Fixed single instrument
  const [emasStr, setEmasStr] = useState('');
  const [emasMode, setEmasMode] = useState<'digital' | 'fisik'>('digital');
  const [emasWeightGram, setEmasWeightGram] = useState('');
  const [emasPricePerGram, setEmasPricePerGram] = useState<string>(() => {
    const cached = getCachedGoldPrice();
    return cached ? cached.pricePerGram.toString() : '2450000';
  });

  // Realtime Gold Live Price State
  const [liveGoldPrice, setLiveGoldPrice] = useState<number>(() => {
    const cached = getCachedGoldPrice();
    return cached ? cached.pricePerGram : 2450000;
  });
  const [goldPriceSource, setGoldPriceSource] = useState<string>('Live Pasar 24K');
  const [isFetchingGold, setIsFetchingGold] = useState(false);

  // Preserve emergencyFundSources from existing snapshot note
  const [preservedEmergencySources, setPreservedEmergencySources] = useState<any[]>([]);

  // Confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteTarget | null>(null);

  // Function to load realtime gold price
  const loadGoldPrice = useCallback(async (force = false) => {
    setIsFetchingGold(true);
    try {
      const res = await fetchRealtimeGoldPrice(force);
      setLiveGoldPrice(res.pricePerGram);
      setGoldPriceSource(res.source);
      // Auto-update price per gram if user hasn't set custom or if forced
      setEmasPricePerGram((prev) => {
        if (!prev || prev === '1485000' || prev === '2450000' || force) {
          return res.pricePerGram.toString();
        }
        return prev;
      });
    } catch (e) {
      console.warn('Gagal memuat harga emas realtime', e);
    } finally {
      setIsFetchingGold(false);
    }
  }, []);

  // Auto-fill from latest snapshot & sync initial category
  useEffect(() => {
    if (open) {
      setActiveCategory(initialCategory);

      if (snapshots.length > 0) {
        const latest = snapshots[0];
        const details = parseWealthNote(latest.note);

        // Crypto
        setCryptoRows(
          (details.cryptoHoldings || []).map((c) => ({
            id: c.id,
            name: c.name,
            amount: c.amount ? c.amount.toString() : '',
          }))
        );

        // Saham
        setSahamRows(
          (details.sahamHoldings || []).map((s) => ({
            id: s.id,
            name: s.name,
            amount: s.amount ? s.amount.toString() : '',
          }))
        );

        // Obligasi
        setObligasiRows(
          (details.obligasiHoldings || []).map((o) => ({
            id: o.id,
            name: o.name,
            amount: o.amount ? o.amount.toString() : '',
          }))
        );

        // Reksa Dana
        setReksadanaRows(
          (details.reksadanaHoldings || []).map((r) => ({
            id: r.id,
            name: r.name,
            amount: r.amount ? r.amount.toString() : '',
          }))
        );

        // Emas Dual Mode
        if (details.emasDetails?.type === 'fisik') {
          setEmasMode('fisik');
          setEmasWeightGram(details.emasDetails.weightGram ? details.emasDetails.weightGram.toString() : '');
          setEmasPricePerGram(
            details.emasDetails.pricePerGram && details.emasDetails.pricePerGram !== 1485000
              ? details.emasDetails.pricePerGram.toString()
              : liveGoldPrice.toString()
          );
        } else {
          setEmasMode('digital');
          setEmasWeightGram('');
          setEmasPricePerGram(liveGoldPrice.toString());
        }
        setEmasStr(details.emas ? details.emas.toString() : '');

        // Preserve emergencyFundSources
        setPreservedEmergencySources(details.emergencyFundSources || []);
      } else {
        setCryptoRows([]);
        setSahamRows([]);
        setObligasiRows([]);
        setReksadanaRows([]);
        setEmasStr('');
        setEmasMode('digital');
        setEmasWeightGram('');
        setEmasPricePerGram(liveGoldPrice.toString());
        setPreservedEmergencySources([]);
      }

      // Fetch latest realtime gold price
      loadGoldPrice();
    }
  }, [open, snapshots, initialCategory, liveGoldPrice, loadGoldPrice]);

  // Subtotal calculations
  const subtotalCrypto = cryptoRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const subtotalSaham = sahamRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const subtotalObligasi = obligasiRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const subtotalReksa = reksadanaRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalEmas = Number(emasStr) || 0;
  const grandTotalInvestasi = subtotalCrypto + subtotalSaham + subtotalObligasi + subtotalReksa + totalEmas;

  // Handlers for Crypto rows
  const addCryptoRow = () => {
    setCryptoRows((prev) => [...prev, { id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', amount: '' }]);
  };
  const updateCryptoRow = (id: string, field: 'name' | 'amount', val: string) => {
    setCryptoRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const requestRemoveCryptoRow = (row: DynamicRow) => {
    if (row.name.trim() || Number(row.amount) > 0) {
      setDeleteConfirm({ id: row.id, name: row.name || 'Koin Kripto', amount: Number(row.amount) || 0, category: 'crypto' });
    } else {
      setCryptoRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  // Handlers for Saham rows
  const addSahamRow = () => {
    setSahamRows((prev) => [...prev, { id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', amount: '' }]);
  };
  const updateSahamRow = (id: string, field: 'name' | 'amount', val: string) => {
    setSahamRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const requestRemoveSahamRow = (row: DynamicRow) => {
    if (row.name.trim() || Number(row.amount) > 0) {
      setDeleteConfirm({ id: row.id, name: row.name || 'Saham', amount: Number(row.amount) || 0, category: 'saham' });
    } else {
      setSahamRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  // Handlers for Obligasi rows
  const addObligasiRow = () => {
    setObligasiRows((prev) => [...prev, { id: `o-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', amount: '' }]);
  };
  const updateObligasiRow = (id: string, field: 'name' | 'amount', val: string) => {
    setObligasiRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const requestRemoveObligasiRow = (row: DynamicRow) => {
    if (row.name.trim() || Number(row.amount) > 0) {
      setDeleteConfirm({ id: row.id, name: row.name || 'Obligasi', amount: Number(row.amount) || 0, category: 'obligasi' });
    } else {
      setObligasiRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  // Handlers for Reksa Dana rows
  const addReksaRow = (presetName = '') => {
    setReksadanaRows((prev) => [...prev, { id: `rd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: presetName, amount: '' }]);
  };
  const updateReksaRow = (id: string, field: 'name' | 'amount', val: string) => {
    setReksadanaRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const requestRemoveReksaRow = (row: DynamicRow) => {
    if (row.name.trim() || Number(row.amount) > 0) {
      setDeleteConfirm({ id: row.id, name: row.name || 'Reksa Dana', amount: Number(row.amount) || 0, category: 'reksadana' });
    } else {
      setReksadanaRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  // Handlers for Emas Fisik
  const handleUpdateEmasFisik = (weight: string, price: string) => {
    setEmasWeightGram(weight);
    setEmasPricePerGram(price);
    const w = parseFloat(weight);
    const p = parseFloat(price);
    if (!isNaN(w) && w > 0 && !isNaN(p) && p > 0) {
      setEmasStr(Math.round(w * p).toString());
    } else {
      setEmasStr('');
    }
  };

  const handleSelectGramPreset = (grams: number) => {
    handleUpdateEmasFisik(grams.toString(), emasPricePerGram);
  };

  // Confirm delete execution
  const executeDelete = () => {
    if (!deleteConfirm) return;
    const { id, category } = deleteConfirm;
    if (category === 'crypto') setCryptoRows((prev) => prev.filter((r) => r.id !== id));
    else if (category === 'saham') setSahamRows((prev) => prev.filter((r) => r.id !== id));
    else if (category === 'obligasi') setObligasiRows((prev) => prev.filter((r) => r.id !== id));
    else if (category === 'reksadana') setReksadanaRows((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirm(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCrypto: AssetHoldingItem[] = cryptoRows
      .filter((r) => r.name.trim() || Number(r.amount) > 0)
      .map((r) => ({
        id: r.id,
        name: r.name.trim().toUpperCase(),
        amount: Number(r.amount) || 0,
      }));

    const cleanSaham: AssetHoldingItem[] = sahamRows
      .filter((r) => r.name.trim() || Number(r.amount) > 0)
      .map((r) => ({
        id: r.id,
        name: r.name.trim().toUpperCase(),
        amount: Number(r.amount) || 0,
      }));

    const cleanObligasi: AssetHoldingItem[] = obligasiRows
      .filter((r) => r.name.trim() || Number(r.amount) > 0)
      .map((r) => ({
        id: r.id,
        name: r.name.trim().toUpperCase(),
        amount: Number(r.amount) || 0,
      }));

    const cleanReksa: AssetHoldingItem[] = reksadanaRows
      .filter((r) => r.name.trim() || Number(r.amount) > 0)
      .map((r) => ({
        id: r.id,
        name: r.name.trim(),
        amount: Number(r.amount) || 0,
      }));

    const emas = Number(emasStr) || 0;

    // Derived BTC & ETH for backward compatibility
    const btcItem = cleanCrypto.find((c) => c.name === 'BTC' || c.name.includes('BITCOIN'));
    const ethItem = cleanCrypto.find((c) => c.name === 'ETH' || c.name.includes('ETHEREUM'));
    const derivedBtc = btcItem ? btcItem.amount : 0;
    const derivedEth = ethItem ? ethItem.amount : 0;

    // Derived RDPU & RD Saham for legacy readers
    let derivedRdpu = 0;
    let derivedRdSaham = 0;
    cleanReksa.forEach((item) => {
      const lower = item.name.toLowerCase();
      if (lower.includes('pasar uang') || lower.includes('rdpu') || lower.includes('pendapatan tetap') || lower.includes('rdpt')) {
        derivedRdpu += item.amount;
      } else {
        derivedRdSaham += item.amount;
      }
    });

    // Top-level amounts for database row
    const cryptoAmount = subtotalCrypto;
    const mutualFundAmount = subtotalSaham + subtotalObligasi + subtotalReksa + emas;

    const notePayload = {
      cryptoHoldings: cleanCrypto,
      sahamHoldings: cleanSaham,
      obligasiHoldings: cleanObligasi,
      reksadanaHoldings: cleanReksa,
      rdpu: derivedRdpu,
      rdSaham: derivedRdSaham,
      emas,
      emasDetails: {
        type: emasMode,
        weightGram: emasMode === 'fisik' ? parseFloat(emasWeightGram) || 0 : undefined,
        pricePerGram: emasMode === 'fisik' ? parseFloat(emasPricePerGram) || 0 : undefined,
        lastUpdated: new Date().toISOString(),
      },
      btc: derivedBtc,
      eth: derivedEth,
      emergencyFundSources: preservedEmergencySources,
    };

    await addSnapshot(cryptoAmount, mutualFundAmount, JSON.stringify(notePayload));
    onClose();
  };

  const getSheetTitle = () => {
    switch (activeCategory) {
      case 'crypto':
        return 'Update Kripto';
      case 'saham':
        return 'Update Saham Individual';
      case 'obligasi':
        return 'Update Obligasi & SBN';
      case 'reksadana':
        return 'Update Reksa Dana';
      case 'emas':
        return 'Update Saldo Emas';
      default:
        return 'Update Portofolio Investasi';
    }
  };

  return (
    <>
      <Sheet 
        open={open} 
        onClose={onClose} 
        title={getSheetTitle()} 
        size="2xl"
        footer={
          <button
            type="submit"
            form="add-snapshot-form"
            className="w-full rounded-xl bg-purple py-3.5 font-bold text-white shadow-soft transition-transform active:scale-95 cursor-pointer"
          >
            Simpan Portofolio
          </button>
        }
      >
        <form id="add-snapshot-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category Tabs Switcher - Responsive & No Cutoff */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto sm:flex-wrap pb-2 sm:pb-1 no-scrollbar touch-pan-x pr-6 sm:pr-0 shrink-0">
            {[
              { id: 'all', label: 'Semua Kategori' },
              { id: 'crypto', label: '🪙 Kripto' },
              { id: 'saham', label: '📈 Saham' },
              { id: 'obligasi', label: '📜 Obligasi' },
              { id: 'reksadana', label: '📊 Reksa Dana' },
              { id: 'emas', label: '🪙 Emas' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                className={`rounded-xl sm:rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeCategory === tab.id
                    ? 'bg-purple text-white shadow-xs'
                    : 'bg-surface-muted dark:bg-surface-muted-dark text-text-muted hover:text-text dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Subtotal Header Banner */}
          <div className="rounded-2xl bg-linear-to-r from-purple/15 to-blue/15 p-3.5 border border-purple/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple shrink-0" />
              <p className="text-xs font-semibold text-text dark:text-white">
                {activeCategory === 'all'
                  ? 'Total Seluruh Investasi:'
                  : `Subtotal ${getSheetTitle().replace('Update ', '')}:`}
              </p>
            </div>
            <span className="font-display text-sm font-bold text-purple">
              {formatCurrency(
                activeCategory === 'crypto'
                  ? subtotalCrypto
                  : activeCategory === 'saham'
                  ? subtotalSaham
                  : activeCategory === 'obligasi'
                  ? subtotalObligasi
                  : activeCategory === 'reksadana'
                  ? subtotalReksa
                  : activeCategory === 'emas'
                  ? totalEmas
                  : grandTotalInvestasi
              )}
            </span>
          </div>

          {/* 1. Kripto Section */}
          {(activeCategory === 'all' || activeCategory === 'crypto') && (
            <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins size={18} className="text-amber-500" />
                  <h3 className="text-sm font-bold">Kripto (Crypto)</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Subtotal: {formatCurrency(subtotalCrypto)}
                </span>
              </div>

              {/* Scrollable Container with max-height to avoid endless growth */}
              <div className="max-h-60 sm:max-h-72 overflow-y-auto pr-1 flex flex-col gap-2.5">
                {cryptoRows.length === 0 ? (
                  <p className="text-xs text-text-muted dark:text-text-muted-dark py-4 text-center italic">
                    Belum ada koin kripto. Klik tombol di bawah untuk menambah koin.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {cryptoRows.map((row) => (
                      <div key={row.id} className="flex items-center gap-2 bg-surface/50 dark:bg-surface-dark/50 p-2 rounded-xl border border-border/50 hover:border-purple/30 transition-colors">
                        <input
                          type="text"
                          placeholder="Simbol (SOL)"
                          value={row.name}
                          onChange={(e) => updateCryptoRow(row.id, 'name', e.target.value)}
                          className="w-24 sm:w-28 shrink-0 rounded-lg bg-surface dark:bg-surface-dark px-2.5 py-2 text-xs font-bold uppercase outline-hidden border border-border dark:border-border-dark focus:ring-1 focus:ring-purple/50 text-center"
                        />
                        <div className="relative flex-1 min-w-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-bold">Rp</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={row.amount}
                            onChange={(e) => updateCryptoRow(row.id, 'amount', e.target.value)}
                            className="w-full rounded-lg bg-surface dark:bg-surface-dark py-2 pl-9 pr-3 text-xs sm:text-sm font-bold tabular-nums outline-hidden border border-border dark:border-border-dark focus:ring-1 focus:ring-purple/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => requestRemoveCryptoRow(row)}
                          aria-label="Hapus koin"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={addCryptoRow}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors mt-1"
              >
                <Plus size={14} /> Tambah Koin Baru
              </button>
            </div>
          )}

          {/* 2. Saham Section */}
          {(activeCategory === 'all' || activeCategory === 'saham') && (
            <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue" />
                  <h3 className="text-sm font-bold">Saham Individual</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue/10 text-blue border border-blue/20">
                  Subtotal: {formatCurrency(subtotalSaham)}
                </span>
              </div>

              <div className="max-h-60 sm:max-h-72 overflow-y-auto pr-1 flex flex-col gap-2.5">
                {sahamRows.length === 0 ? (
                  <p className="text-xs text-text-muted dark:text-text-muted-dark py-4 text-center italic">
                    Belum ada emiten saham. Klik tombol di bawah untuk menambah saham.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {sahamRows.map((row) => (
                      <div key={row.id} className="flex items-center gap-2 bg-surface/50 dark:bg-surface-dark/50 p-2 rounded-xl border border-border/50 hover:border-purple/30 transition-colors">
                        <input
                          type="text"
                          placeholder="Kode (BBCA)"
                          value={row.name}
                          onChange={(e) => updateSahamRow(row.id, 'name', e.target.value)}
                          className="w-24 sm:w-28 shrink-0 rounded-lg bg-surface dark:bg-surface-dark px-2.5 py-2 text-xs font-bold uppercase outline-hidden border border-border dark:border-border-dark focus:ring-1 focus:ring-purple/50 text-center"
                        />
                        <div className="relative flex-1 min-w-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-bold">Rp</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={row.amount}
                            onChange={(e) => updateSahamRow(row.id, 'amount', e.target.value)}
                            className="w-full rounded-lg bg-surface dark:bg-surface-dark py-2 pl-9 pr-3 text-xs sm:text-sm font-bold tabular-nums outline-hidden border border-border dark:border-border-dark focus:ring-1 focus:ring-purple/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => requestRemoveSahamRow(row)}
                          aria-label="Hapus saham"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={addSahamRow}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-blue/40 bg-blue/5 py-2 text-xs font-bold text-blue hover:bg-blue/10 transition-colors mt-1"
              >
                <Plus size={14} /> Tambah Saham Baru
              </button>
            </div>
          )}

          {/* 3. Obligasi / SBN Section */}
          {(activeCategory === 'all' || activeCategory === 'obligasi') && (
            <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-teal-500" />
                  <h3 className="text-sm font-bold">Obligasi / SBN (Bonds)</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  Subtotal: {formatCurrency(subtotalObligasi)}
                </span>
              </div>

              <div className="max-h-60 sm:max-h-72 overflow-y-auto pr-1 flex flex-col gap-2.5">
                {obligasiRows.length === 0 ? (
                  <p className="text-xs text-text-muted dark:text-text-muted-dark py-4 text-center italic">
                    Belum ada obligasi/SBN. Klik tombol di bawah untuk menambah seri.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {obligasiRows.map((row) => (
                      <div key={row.id} className="flex items-center gap-2 bg-surface/50 dark:bg-surface-dark/50 p-2 rounded-xl border border-border/50 hover:border-purple/30 transition-colors">
                        <input
                          type="text"
                          placeholder="Seri (ORI026)"
                          value={row.name}
                          onChange={(e) => updateObligasiRow(row.id, 'name', e.target.value)}
                          className="w-28 sm:w-32 shrink-0 rounded-lg bg-surface dark:bg-surface-dark px-2.5 py-2 text-xs font-bold uppercase outline-hidden border border-border dark:border-border-dark focus:ring-1 focus:ring-purple/50 text-center"
                        />
                        <div className="relative flex-1 min-w-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-bold">Rp</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={row.amount}
                            onChange={(e) => updateObligasiRow(row.id, 'amount', e.target.value)}
                            className="w-full rounded-lg bg-surface dark:bg-surface-dark py-2 pl-9 pr-3 text-xs sm:text-sm font-bold tabular-nums outline-hidden border border-border dark:border-border-dark focus:ring-1 focus:ring-purple/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => requestRemoveObligasiRow(row)}
                          aria-label="Hapus obligasi"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={addObligasiRow}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-teal-500/40 bg-teal-500/5 py-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 transition-colors mt-1"
              >
                <Plus size={14} /> Tambah Obligasi Baru
              </button>
            </div>
          )}

          {/* 4. Reksa Dana Dinamis Section */}
          {(activeCategory === 'all' || activeCategory === 'reksadana') && (
            <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart size={18} className="text-emerald-500" />
                  <h3 className="text-sm font-bold">Reksa Dana (Multi-Produk)</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Subtotal: {formatCurrency(subtotalReksa)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-text-muted self-center mr-1">Preset:</span>
                {REKSA_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => addReksaRow(preset)}
                    className="rounded-lg bg-surface dark:bg-surface-dark px-2 py-0.5 text-[11px] font-semibold text-text-muted hover:text-emerald-600 hover:border-emerald-500/40 border border-border dark:border-border-dark transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div className="max-h-60 sm:max-h-72 overflow-y-auto pr-1 flex flex-col gap-2.5 mt-1">
                {reksadanaRows.length === 0 ? (
                  <p className="text-xs text-text-muted dark:text-text-muted-dark py-4 text-center italic">
                    Belum ada produk reksadana. Pilih preset di atas atau tambah produk baru.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {reksadanaRows.map((row) => (
                      <div key={row.id} className="flex items-center gap-2 bg-surface/50 dark:bg-surface-dark/50 p-2 rounded-xl border border-border/50 hover:border-purple/30 transition-colors">
                        <input
                          type="text"
                          placeholder="Nama Produk (mis: RDPU Sucorinvest)"
                          value={row.name}
                          onChange={(e) => updateReksaRow(row.id, 'name', e.target.value)}
                          className="w-36 sm:w-48 shrink-0 rounded-lg bg-surface dark:bg-surface-dark px-2.5 py-2 text-xs font-semibold outline-hidden border border-border dark:border-border-dark focus:ring-1 focus:ring-purple/50"
                        />
                        <div className="relative flex-1 min-w-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-bold">Rp</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={row.amount}
                            onChange={(e) => updateReksaRow(row.id, 'amount', e.target.value)}
                            className="w-full rounded-lg bg-surface dark:bg-surface-dark py-2 pl-9 pr-3 text-xs sm:text-sm font-bold tabular-nums outline-hidden border border-border dark:border-border-dark focus:ring-1 focus:ring-purple/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => requestRemoveReksaRow(row)}
                          aria-label="Hapus produk reksa dana"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => addReksaRow('')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors mt-1"
              >
                <Plus size={14} /> Tambah Produk Reksa Dana Baru
              </button>
            </div>
          )}

          {/* 5. Emas Section (Dual-Mode: Digital vs Fisik Realtime) */}
          {(activeCategory === 'all' || activeCategory === 'emas') && (
            <div className="rounded-2xl bg-surface-muted dark:bg-surface-muted-dark p-4 border border-border dark:border-border-dark flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🪙</span>
                  <h3 className="text-sm font-bold">Logam Mulia (Emas)</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-600 dark:text-amber-300 border border-amber-400/20">
                  {emasMode === 'fisik' && Number(emasWeightGram) > 0 ? `${emasWeightGram} gr Fisik` : 'Safe Haven'}
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface dark:bg-surface-dark border border-border/60">
                <button
                  type="button"
                  onClick={() => setEmasMode('digital')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    emasMode === 'digital'
                      ? 'bg-purple text-white shadow-xs'
                      : 'text-text-muted dark:text-text-muted-dark hover:text-purple dark:hover:text-white'
                  }`}
                >
                  Emas Digital (Rp)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmasMode('fisik');
                    if (emasWeightGram) {
                      handleUpdateEmasFisik(emasWeightGram, emasPricePerGram);
                    }
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    emasMode === 'fisik'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-text-muted dark:text-text-muted-dark hover:text-purple dark:hover:text-white'
                  }`}
                >
                  🪙 Emas Fisik (Gram)
                </button>
              </div>

              {emasMode === 'digital' ? (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] text-text-muted dark:text-text-muted-dark">
                    Input langsung saldo Rupiah untuk tabungan emas digital (Pegadaian, Pluang, Tokopedia, dll).
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium">Rp</span>
                    <input
                      type="number"
                      value={emasStr}
                      onChange={(e) => setEmasStr(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl bg-surface dark:bg-surface-dark py-2.5 pl-8 pr-3 text-xs font-semibold outline-hidden border border-border dark:border-border-dark focus:ring-2 focus:ring-purple/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Live Realtime Gold Price Badge */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <div className="truncate">
                        <span className="font-bold block leading-tight">
                          Live 24K: {formatCurrency(liveGoldPrice)} / gr
                        </span>
                        <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-medium truncate block">
                          {goldPriceSource}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadGoldPrice(true)}
                      disabled={isFetchingGold}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface dark:bg-surface-dark border border-amber-500/30 text-[11px] font-semibold text-amber-700 dark:text-amber-300 shadow-xs hover:bg-amber-500/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                      title="Perbarui Harga Pasar Emas Terkini"
                    >
                      <RefreshCw size={12} className={isFetchingGold ? 'animate-spin' : ''} />
                      {isFetchingGold ? 'Sync...' : 'Update'}
                    </button>
                  </div>

                  <p className="text-[11px] text-text-muted dark:text-text-muted-dark leading-relaxed">
                    Hitung otomatis nilai emas kepingan fisik (Antam, UBS, Lotus, dll) berdasarkan berat gram dan harga pasar per gram terkini.
                  </p>

                  {/* Preset Quick Chips */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted dark:text-text-muted-dark mb-1.5 block">
                      Pilihan Cepat Berat Kepingan (Gram):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[1, 2, 5, 10, 25, 50, 100].map((gram) => (
                        <button
                          key={gram}
                          type="button"
                          onClick={() => handleSelectGramPreset(gram)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            emasWeightGram === gram.toString()
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-xs'
                              : 'bg-surface dark:bg-surface-dark border-border/60 text-text-muted hover:border-amber-400/40'
                          }`}
                        >
                          {gram}g
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Two Inputs: Gram and Price per Gram */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark block mb-1">
                        Berat Emas (Gram)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          value={emasWeightGram}
                          onChange={(e) => handleUpdateEmasFisik(e.target.value, emasPricePerGram)}
                          placeholder="Contoh: 1"
                          className="w-full rounded-xl bg-surface dark:bg-surface-dark py-2.5 pl-3 pr-12 text-xs font-bold tabular-nums outline-hidden border border-border dark:border-border-dark focus:ring-2 focus:ring-amber-400/50"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-text-muted">
                          gram
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark">
                          Harga Pasar / Gram
                        </label>
                        <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium">Acuan Live</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium">Rp</span>
                        <input
                          type="number"
                          value={emasPricePerGram}
                          onChange={(e) => handleUpdateEmasFisik(emasWeightGram, e.target.value)}
                          placeholder={liveGoldPrice.toString()}
                          className="w-full rounded-xl bg-surface dark:bg-surface-dark py-2.5 pl-8 pr-3 text-xs font-bold tabular-nums outline-hidden border border-border dark:border-border-dark focus:ring-2 focus:ring-amber-400/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Total Calculation Result */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Total Nilai Pasar Emas Fisik
                      </span>
                      <p className="text-[11px] text-text-muted dark:text-text-muted-dark">
                        {Number(emasWeightGram) > 0
                          ? `${emasWeightGram} gram × ${formatCurrency(Number(emasPricePerGram) || liveGoldPrice)}`
                          : 'Masukkan berat gram untuk menghitung'}
                      </p>
                    </div>
                    <span className="font-display text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {formatCurrency(totalEmas)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </form>
      </Sheet>

      {/* Confirmation Dialog for Delete with Portal & Safe Stacking */}
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
              <h4 className="font-display text-base font-bold">Hapus Aset?</h4>
            </div>

            <p className="text-xs text-text dark:text-white leading-relaxed">
              Yakin ingin menghapus <strong className="font-bold text-rose-500">{deleteConfirm.name}</strong>
              {deleteConfirm.amount > 0 && ` senilai ${formatCurrency(deleteConfirm.amount)}`} dari daftar portofolio?
            </p>

            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-border dark:border-border-dark text-xs font-semibold text-text-muted hover:bg-surface-muted transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
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
