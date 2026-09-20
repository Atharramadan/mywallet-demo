import { ArrowLeft, FileSpreadsheet, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToastStore } from '../../stores/toastStore';
import { exportTransactionsToCsv, downloadFile } from '../../lib/backup';
import { demoStorage } from '../../lib/storage';
import { useAccountStore } from '../../stores/accountStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { useSavingsStore } from '../../stores/savingsStore';
import { useWealthStore } from '../../stores/wealthStore';
import { useBudgetStore } from '../../stores/budgetStore';

export function BackupRestorePage() {
  const showToast = useToastStore((s) => s.show);

  async function handleExportCsv() {
    try {
      const csv = await exportTransactionsToCsv();
      downloadFile(csv, `mywallet-transaksi-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
      showToast('Export CSV berhasil diunduh', 'success');
    } catch (e: any) {
      showToast('Gagal export: ' + e.message, 'error');
    }
  }

  async function handleResetDemo() {
    demoStorage.resetAll();
    await Promise.all([
      useAccountStore.getState().refresh(),
      useTransactionStore.getState().refresh(),
      useSavingsStore.getState().refresh(),
      useWealthStore.getState().refresh(),
      useBudgetStore.getState().refresh(),
    ]);
    showToast('Data demo berhasil di-reset ke kondisi awal!', 'info');
  }

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/pengaturan" className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Backup &amp; Export</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-3 font-display text-sm font-semibold">Export Data</h2>
          <p className="mb-4 text-xs text-text-muted dark:text-text-muted-dark">
            Karena MyWallet kini sepenuhnya online, semua data Anda sudah tersimpan aman di cloud dan langsung tersinkronisasi. Anda dapat mengekspor data riwayat transaksi ke format CSV untuk diolah di Excel atau Google Sheets.
          </p>
          <div className="flex flex-col gap-2.5">
            <Button variant="secondary" fullWidth onClick={handleExportCsv}>
              <FileSpreadsheet size={16} /> Export Transaksi CSV
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-sm font-semibold text-rose-500">Reset Data Demo</h2>
          <p className="mb-4 text-xs text-text-muted dark:text-text-muted-dark">
            Ingin mengembalikan seluruh saldo, target, dan transaksi simulasi ke data awal? Tekan tombol di bawah ini untuk mereset seluruh data demo lokal.
          </p>
          <Button variant="secondary" fullWidth onClick={handleResetDemo} className="text-rose-500 hover:text-rose-600 border-rose-500/20">
            <RotateCcw size={16} /> Reset ke Data Awal Demo
          </Button>
        </Card>
      </div>
    </div>
  );
}
