import { useState, useEffect } from 'react';
import { Sheet } from '../../components/Sheet';
import { useWealthStore, parseWealthNote } from '../../stores/wealthStore';

interface AddSnapshotSheetProps {
  open: boolean;
  onClose: () => void;
}

export function AddSnapshotSheet({ open, onClose }: AddSnapshotSheetProps) {
  const addSnapshot = useWealthStore((s) => s.addSnapshot);
  const snapshots = useWealthStore((s) => s.snapshots);
  
  const [rdpuStr, setRdpuStr] = useState('');
  const [rdSahamStr, setRdSahamStr] = useState('');
  const [btcStr, setBtcStr] = useState('');
  const [ethStr, setEthStr] = useState('');

  // Auto-fill with the latest snapshot values if any
  useEffect(() => {
    if (open && snapshots.length > 0) {
      const latest = snapshots[0];
      const details = parseWealthNote(latest.note);
      
      // Fallback: If no JSON details exist, populate from the legacy sums
      if (details.rdpu === 0 && details.rdSaham === 0 && latest.mutualFundAmount > 0) {
        setRdSahamStr(latest.mutualFundAmount.toString());
      } else {
        setRdpuStr(details.rdpu === 0 ? '' : details.rdpu.toString());
        setRdSahamStr(details.rdSaham === 0 ? '' : details.rdSaham.toString());
      }

      if (details.btc === 0 && details.eth === 0 && latest.cryptoAmount > 0) {
        setBtcStr(latest.cryptoAmount.toString());
      } else {
        setBtcStr(details.btc === 0 ? '' : details.btc.toString());
        setEthStr(details.eth === 0 ? '' : details.eth.toString());
      }
    }
  }, [open, snapshots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rdpu = Number(rdpuStr) || 0;
    const rdSaham = Number(rdSahamStr) || 0;
    const btc = Number(btcStr) || 0;
    const eth = Number(ethStr) || 0;

    const mutualFundAmount = rdpu + rdSaham;
    const cryptoAmount = btc + eth;
    
    const noteJson = JSON.stringify({ rdpu, rdSaham, btc, eth });

    await addSnapshot(cryptoAmount, mutualFundAmount, noteJson);
    setRdpuStr('');
    setRdSahamStr('');
    setBtcStr('');
    setEthStr('');
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Update Snapshot Bulanan">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="rounded-xl bg-blue/10 p-4 mb-2">
          <p className="text-sm font-medium text-blue dark:text-blue-400">
            Perbarui data aset investasimu bulan ini. Cukup update sebulan sekali untuk melihat tren pertumbuhan kekayaanmu.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">🏦 RDPU (Aman)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
              <input
                type="number"
                value={rdpuStr}
                onChange={(e) => setRdpuStr(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl bg-surface-muted dark:bg-surface-muted-dark py-3 pl-9 pr-2 text-sm font-semibold outline-hidden focus:ring-2 focus:ring-purple/50"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">📈 RD Saham/Campuran</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
              <input
                type="number"
                value={rdSahamStr}
                onChange={(e) => setRdSahamStr(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl bg-surface-muted dark:bg-surface-muted-dark py-3 pl-9 pr-2 text-sm font-semibold outline-hidden focus:ring-2 focus:ring-purple/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">₿ Bitcoin (BTC)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
              <input
                type="number"
                value={btcStr}
                onChange={(e) => setBtcStr(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl bg-surface-muted dark:bg-surface-muted-dark py-3 pl-9 pr-2 text-sm font-semibold outline-hidden focus:ring-2 focus:ring-purple/50"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">💎 Ethereum (ETH)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark font-medium">Rp</span>
              <input
                type="number"
                value={ethStr}
                onChange={(e) => setEthStr(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl bg-surface-muted dark:bg-surface-muted-dark py-3 pl-9 pr-2 text-sm font-semibold outline-hidden focus:ring-2 focus:ring-purple/50"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-purple py-3.5 font-bold text-white shadow-soft transition-transform active:scale-95"
        >
          Simpan Snapshot
        </button>
      </form>
    </Sheet>
  );
}
