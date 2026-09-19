import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToastStore } from '../../stores/toastStore';
import { exportTransactionsToCsv, downloadFile } from '../../lib/backup';
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

  return (
    <div className="mx-auto w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4 md:px-8 lg:px-10 pb-28 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/pengaturan" className="rounded-full p-1.5 hover:bg-surface-muted dark:hover:bg-surface-muted-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold">Backup &amp; Export</h1>
      </div>

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
    </div>
  );
}
